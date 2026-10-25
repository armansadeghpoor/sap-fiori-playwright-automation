const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vscode = require("vscode");

// Run in a second, fresh Extension Host, against the first host's temporary workspace.
exports.run = async () => {
  const root = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const saved = JSON.parse(fs.readFileSync(path.join(root, "vscode-reload-fixture.json"), "utf8"));
  const extension = vscode.extensions.getExtension("newweb-local.playwright-test-studio");
  const { regression } = await extension.activate();
  const sent = [], received = [];
  const handle = regression.handle.bind(regression), send = regression.send.bind(regression);
  regression.handle = async value => { received.push(value); return handle(value); };
  regression.send = value => { sent.push(value); send(value); };
  await vscode.commands.executeCommand("playwrightTestStudio.regression.open");
  const deadline = Date.now() + 20000;
  while (!received.some(message => message.type === "ready")) {
    if (Date.now() > deadline) throw new Error("Reloaded Regression Webview did not become ready");
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  await regression.handle({ type: "refresh" });
  const history = sent.findLast(message => message.type === "history").runs;
  assert.equal(history.length, 3);
  assert.equal(history.find(run => run.id === saved.parent).counts.failed, 1);
  assert.equal(history.find(run => run.id === saved.child).counts.passed, 1);
  await regression.handle({ type: "detail", id: saved.parent });
  assert.equal(sent.at(-1).detail.summary.counts.failed, 1);
  const store = regression.manager.store();
  const recovered = store.detail(saved.abandoned).summary;
  assert.equal(recovered.status, "interrupted");
  assert.equal(recovered.tests[0].outcome, "interrupted", "a dead host cannot leave a test Running");
  assert.equal(recovered.counts.running, 0);
  assert.equal(fs.readFileSync(path.join(store.directory(saved.abandoned), "events.ndjson"), "utf8"), saved.partial);
  assert.equal(fs.readFileSync(path.join(store.directory(saved.parent), "summary.json"), "utf8"), saved.original);
  await regression.handle({ type: "openArtifact", id: saved.parent, path: saved.attachment });
  const artifact = store.artifact(saved.parent, saved.attachment);
  assert.ok(vscode.window.visibleTextEditors.some(editor => editor.document.uri.fsPath === artifact));
  assert.equal(fs.readFileSync(artifact, "utf8"), "regression fixture artifact");
  assert.equal(fs.existsSync(store.artifact(saved.parent, "report/index.html")), true);
  fs.writeFileSync(path.join(root, "vscode-reload-validation.json"), JSON.stringify({ passed: true, checks: [
    "fresh Extension Host restart", "Webview ready after restart", "history restored from disk", "parent/child results retained",
    "parent summary byte-identical", "unfinished run/test recovery without migration", "actual VS Code artifact opening", "retained HTML report",
  ] }, null, 2));
};
