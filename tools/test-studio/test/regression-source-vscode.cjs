const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vscode = require("vscode");
const { withRunner } = require("./fixture.cjs");

exports.run = async () => {
  const root = vscode.workspace.workspaceFolders[0].uri.fsPath; withRunner(root);
  const folder = path.join(root, "TestCases", "پوشه فارسی طولانی با فاصله برای بررسی باز کردن سناریو در کنار داشبورد");
  fs.mkdirSync(folder);
  const firstFile = path.join(folder, "سناریوی اول (خطای معتبر) و چند تست.spec.ts"), secondFile = path.join(folder, "سناریوی دوم.spec.ts");
  fs.writeFileSync(firstFile, [
    'const {test,expect}=require("@playwright/test");',
    'test("failure", () => {',
    '  expect(1).toBe(2);',
    '});',
    'test("passed same spec", () => {});',
    'test.skip("skipped same spec", () => {});',
  ].join("\n"));
  fs.writeFileSync(secondFile, 'const {test}=require("@playwright/test");\n\ntest("second file", () => {});\n');
  const { regression } = await vscode.extensions.getExtension("newweb-local.playwright-test-studio").activate();
  const received = [], sent = [], handle = regression.handle.bind(regression), send = regression.send.bind(regression);
  regression.handle = async message => { received.push(message); return handle(message); };
  regression.send = message => { sent.push(message); send(message); };
  await vscode.commands.executeCommand("playwrightTestStudio.regression.open");
  const deadline = Date.now() + 20000;
  while (!received.some(message => message.type === "ready")) {
    if (Date.now() > deadline) throw new Error("Source Dashboard webview did not become ready");
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  await regression.handle({ type: "run", input: { scope: "folder", path: path.relative(path.join(root, "TestCases"), folder), headed: false } });
  const run = regression.manager.state.result; assert.equal(run.summary.counts.failed, 1, regression.manager.state.log);
  const archive = regression.manager.store().directory(run.manifest.id);
  const archivedFiles = ["manifest.json", "summary.json", "events.ndjson"].map(name => [name, fs.readFileSync(path.join(archive, name))]);
  const byTitle = title => run.manifest.tests.find(test => test.title === title);
  const open = async title => {
    const test = byTitle(title); assert.ok(test, title);
    await vscode.commands.executeCommand("playwrightTestStudio.regression.focus");
    await regression.handle({ type: "openSource", id: run.manifest.id, testId: test.id });
    assert.equal(sent.at(-1).error, undefined, sent.at(-1).message);
    const editor = vscode.window.visibleTextEditors.find(item => item.document.uri.fsPath === test.file);
    assert.equal(regression.view.visible, true, "Dashboard remains visible alongside the source");
    assert.ok(editor, "source visible beside Dashboard: " + title); return editor;
  };
  const userDocument = await vscode.workspace.openTextDocument({ content: "unsaved user work", language: "typescript" });
  await vscode.window.showTextDocument(userDocument, { preview: false });
  const columnsBefore = vscode.window.tabGroups.all.length;
  const failed = await open("failure");
  assert.equal(failed.selection.start.line, 2, "the actual failed assertion, not the test definition");
  const sourceColumn = failed.viewColumn;
  const second = await open("second file");
  assert.equal(second.selection.start.line, 2); assert.equal(second.viewColumn, sourceColumn);
  assert.equal(vscode.window.tabGroups.all.length, columnsBefore, "no split-per-click");
  let tabs = vscode.window.tabGroups.all.flatMap(group => group.tabs);
  assert.ok(tabs.some(tab => tab.input instanceof vscode.TabInputText && tab.input.uri.fsPath === secondFile && tab.isPreview));
  assert.equal(tabs.some(tab => tab.input instanceof vscode.TabInputText && tab.input.uri.fsPath === firstFile), false, "clean preview replaced");
  const passed = await open("passed same spec"); assert.equal(passed.selection.start.line, 4);
  const skipped = await open("skipped same spec"); assert.equal(skipped.selection.start.line, 5);
  const disk = fs.readFileSync(firstFile);
  const edit = new vscode.WorkspaceEdit(); edit.insert(skipped.document.uri, new vscode.Position(0, 0), "// unsaved user edit\n");
  assert.equal(await vscode.workspace.applyEdit(edit), true);
  await open("failure"); assert.equal(sent.at(-1).changed, true); assert.match(sent.at(-1).message, /متفاوت/);
  await open("second file");
  assert.equal(skipped.document.isDirty, true); assert.deepEqual(fs.readFileSync(firstFile), disk);
  tabs = vscode.window.tabGroups.all.flatMap(group => group.tabs);
  assert.ok(tabs.some(tab => tab.input instanceof vscode.TabInputText && tab.input.uri.fsPath === firstFile), "dirty source retained");
  assert.equal(userDocument.isClosed, false); assert.equal(userDocument.getText(), "unsaved user work");
  fs.unlinkSync(secondFile);
  await regression.handle({ type: "openSource", id: run.manifest.id, testId: byTitle("second file").id });
  assert.equal(sent.at(-1).error, true); assert.match(sent.at(-1).message, /حذف یا جابه/);
  for (const [name, bytes] of archivedFiles) assert.deepEqual(fs.readFileSync(path.join(archive, name)), bytes, "history unchanged: " + name);
  assert.equal(regression.manager.store().list().length, 1);
  fs.writeFileSync(path.join(root, "vscode-validation.json"), JSON.stringify({ passed: true, checks: [
    "actual Dashboard ready", "real failure source line", "same-Spec exact IDs", "passed and skipped definitions", "second Persian long-path spec",
    "same editor column", "preview tab reuse", "dirty source and user tabs preserved", "source-change warning", "deleted-file error", "history byte-identical",
  ] }, null, 2));
};
