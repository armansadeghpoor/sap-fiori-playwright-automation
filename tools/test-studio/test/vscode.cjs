const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vscode = require("vscode");
const { populate, withRunner } = require("./fixture.cjs");

exports.run = async () => {
  const root = vscode.workspace.workspaceFolders[0].uri.fsPath;
  populate(root);
  const extension = vscode.extensions.getExtension("newweb-local.playwright-test-studio");
  assert.ok(extension, "Extension discovered by VS Code");
  const { provider } = await extension.activate();
  const received = [], sent = [];
  const originalHandle = provider.handle.bind(provider);
  provider.handle = async message => { received.push(message); return originalHandle(message); };
  const originalSend = provider.send.bind(provider);
  provider.send = message => { sent.push(message); originalSend(message); };
  await vscode.commands.executeCommand("playwrightTestStudio.open");
  const deadline = Date.now() + 20000;
  while (!received.some(message => message.type === "ready")) {
    if (Date.now() > deadline) throw new Error("Webview did not load its script or send the ready handshake");
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const form = { name: "تست واقعی VS Code", path: "پوشه با فاصله", user: "rahbar", device: "desktop", snapshot: false };
  const destination = path.join(root, "TestCases", "پوشه با فاصله");
  fs.mkdirSync(destination);
  const dialogs = [];
  provider.pickFolder = async options => { dialogs.push(options); return [vscode.Uri.file(destination)]; };
  await provider.handle({ type: "browse", path: "NotCreatedYet" });
  assert.equal(dialogs[0].defaultUri.fsPath, path.join(root, "TestCases"));
  assert.equal(dialogs[0].canSelectFolders, true);
  assert.equal(dialogs[0].canSelectFiles, false);
  assert.equal(dialogs[0].canSelectMany, false);
  assert.equal(sent.at(-1).path, form.path);
  await provider.handle({ type: "browse", path: form.path });
  assert.equal(dialogs[1].defaultUri.fsPath, destination);
  provider.pickFolder = async () => undefined;
  await provider.handle({ type: "browse", path: form.path });
  assert.equal(sent.at(-1).cancelled, true);
  provider.pickFolder = async () => [vscode.Uri.file(root)];
  await provider.handle({ type: "browse", path: form.path });
  assert.ok(sent.at(-1).error.includes("TestCases"));
  assert.equal(Object.hasOwn(sent.at(-1), "path"), false);
  provider.pickFolder = async () => [vscode.Uri.file(path.join(root, "TestCases"))];
  await provider.handle({ type: "browse", path: form.path });
  assert.equal(sent.at(-1).path, "");
  let finishSelection;
  provider.pickFolder = () => new Promise(resolve => { finishSelection = resolve; });
  const pendingSelection = provider.handle({ type: "browse", path: form.path });
  await provider.handle({ type: "start", form });
  assert.equal(fs.readdirSync(destination).length, 0);
  finishSelection(undefined);
  await pendingSelection;
  assert.equal(provider.pickingFolder, false);
  await provider.handle({ type: "preview", request: 91, form });
  assert.ok(sent.some(message => message.request === 91 && message.specPath));
  await provider.handle({ type: "preview", request: 92, form: { ...form, path: "D:\\absolute" } });
  assert.ok(sent.some(message => message.request === 92 && message.error.includes("مسیر کامل")));
  await provider.handle({ type: "start", form });
  assert.equal(provider.studio.state.phase, "done", provider.studio.state.message);
  const filename = provider.studio.state.specPath;
  assert.ok(fs.existsSync(filename));
  assert.ok(vscode.window.visibleTextEditors.some(editor => editor.document.uri.fsPath === filename));
  assert.match(provider.studio.state.log, /--user=rahbar/);
  assert.match(fs.readFileSync(filename, "utf8"), /users.rahbar/);
  await provider.handle({ type: "start", form });
  assert.equal(provider.studio.state.phase, "error");
  assert.match(provider.studio.state.message, /بازنویسی نشد/);
  withRunner(root);
  const document = await vscode.workspace.openTextDocument(vscode.Uri.file(filename));
  const edit = new vscode.WorkspaceEdit();
  edit.replace(document.uri, new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length)),
    'import { test, expect } from "@playwright/test"; test("saved by Studio", () => { expect(1).toBe(1); });\n// restoreSnapshot consent fixture');
  assert.equal(await vscode.workspace.applyEdit(edit), true);
  assert.equal(document.isDirty, true);
  let confirmations = 0;
  provider.confirmRun = async target => { assert.equal(target, filename); confirmations++; return undefined; };
  await provider.handle({ type: "run" });
  assert.equal(provider.studio.state.phase, "cancelled");
  assert.equal(document.isDirty, false, "only target document saved before run");
  assert.match(fs.readFileSync(filename, "utf8"), /saved by Studio/);
  provider.confirmRun = async () => { confirmations++; return "تأیید و اجرای تست"; };
  await provider.handle({ type: "run" });
  assert.equal(provider.studio.state.phase, "run-complete", provider.studio.state.log);
  assert.match(provider.studio.state.log, /1 passed/);
  assert.equal(confirmations, 2);
  assert.equal(provider.context.workspaceState.get("lastSpec").specPath, filename);
  fs.writeFileSync(path.join(root, "vscode-validation.json"), JSON.stringify({ passed: true, checks: [
    "activation", "activity-bar command", "CSP webview ready handshake", "real generator preview", "inline validation",
    "spec creation", "editor opening", "recorder arguments", "no overwrite",
    "native folder-dialog options", "Persian relative folder", "selection cancellation", "outside rejection", "TestCases root", "dialog/start exclusion",
    "save dirty target", "snapshot run confirmation and cancellation", "real Playwright run", "persist last target",
  ] }, null, 2));
};
