const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vscode = require("vscode");
const { withRunner } = require("./fixture.cjs");

exports.run = async () => {
  const root = vscode.workspace.workspaceFolders[0].uri.fsPath;
  withRunner(root);
  const folder = path.join(root, "TestCases", "پوشه Regression"); fs.mkdirSync(folder);
  const filename = path.join(folder, "نمونه.spec.ts");
  fs.writeFileSync(path.join(root, "note.txt"), "regression fixture artifact");
  fs.writeFileSync(filename, 'const {test,expect}=require("@playwright/test");test("passes",()=>{});test("fails",async({},info)=>{await info.attach("note",{path:require("node:path").join(__dirname,"..","..","note.txt")});expect(1).toBe(2)});');
  const extension = vscode.extensions.getExtension("newweb-local.playwright-test-studio");
  const { provider, regression } = await extension.activate();
  assert.ok(provider, "original recording view still registered");
  const received = [], sent = [];
  const handle = regression.handle.bind(regression), send = regression.send.bind(regression);
  regression.handle = async message => { received.push(message); return handle(message); };
  regression.send = message => { sent.push(message); send(message); };
  await vscode.commands.executeCommand("playwrightTestStudio.regression.open");
  const deadline = Date.now() + 20000;
  while (!received.some(message => message.type === "ready")) {
    if (Date.now() > deadline) throw new Error("Regression webview did not send ready");
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  regression.pick = async () => [vscode.Uri.file(folder)];
  await regression.handle({ type: "browse", scope: "folder" });
  assert.ok(sent.some(message => message.type === "target" && message.path === "پوشه Regression"));
  await regression.handle({ type: "run", input: { scope: "folder", path: "پوشه Regression", headed: false } });
  const first = regression.manager.state.result;
  assert.equal(first.summary.counts.failed, 1, regression.manager.state.log);
  assert.equal(first.summary.counts.passed, 1);
  const original = fs.readFileSync(path.join(regression.manager.store().directory(first.manifest.id), "summary.json"), "utf8");
  const document = await vscode.workspace.openTextDocument(filename);
  const edit = new vscode.WorkspaceEdit();
  edit.replace(document.uri, new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length)),
    'const {test,expect}=require("@playwright/test");test("passes",()=>{});test("fails",()=>expect(1).toBe(1));');
  assert.equal(await vscode.workspace.applyEdit(edit), true);
  assert.equal(document.isDirty, true);
  await regression.handle({ type: "run", input: { scope: "failed", parentRunId: first.manifest.id, headed: true } });
  const child = regression.manager.state.result;
  assert.equal(document.isDirty, false);
  assert.equal(child.summary.status, "passed", regression.manager.state.log);
  assert.equal(child.manifest.tests.length, 1);
  assert.equal(child.manifest.parentRunId, first.manifest.id);
  assert.equal(child.manifest.changedSources.length, 1);
  assert.equal(fs.readFileSync(path.join(regression.manager.store().directory(first.manifest.id), "summary.json"), "utf8"), original);
  await regression.handle({ type: "detail", id: first.manifest.id });
  assert.equal(sent.at(-1).detail.summary.counts.failed, 1);
  assert.equal(regression.manager.store().list().length, 2);
  const attachment = first.summary.tests.find(test => test.outcome === "failed").attempts[0].attachments.find(item => item.name === "note");
  assert.ok(attachment?.path);
  const abandoned = regression.manager.store().create({ scope: "folder", label: "unfinished fixture", tests: first.manifest.tests });
  const partial = JSON.stringify({ type: "testBegin", testId: first.manifest.tests[0].id }) + "\n";
  fs.writeFileSync(path.join(abandoned.folder, "events.ndjson"), partial);
  fs.writeFileSync(path.join(root, "vscode-reload-fixture.json"), JSON.stringify({ parent: first.manifest.id, child: child.manifest.id, original, attachment: attachment.path, abandoned: abandoned.manifest.id, partial }));
  fs.writeFileSync(path.join(root, "vscode-validation.json"), JSON.stringify({ passed: true, checks: [
    "same-extension activation", "Regression view ready/CSP", "folder browse", "real folder runner", "dirty target save",
    "failed headed rerun", "source change metadata", "immutable parent", "history detail", "original provider retained",
  ] }, null, 2));
};
