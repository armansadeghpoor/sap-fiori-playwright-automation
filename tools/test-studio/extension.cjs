const vscode = require("vscode");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { Studio, nodePath, runJson, readableError, relativeFolder } = require("./studio.cjs");

function projectRoot() {
  if (!vscode.workspace.isTrusted) throw new Error("ابتدا Workspace Trust را برای این پروژه فعال کنید.");
  const candidates = (vscode.workspace.workspaceFolders || []).filter(folder =>
    folder.uri.scheme === "file" &&
    fs.existsSync(path.join(folder.uri.fsPath, "tools", "new-test.cjs")) &&
    fs.existsSync(path.join(folder.uri.fsPath, "tools", "recorder", "launch.cjs")));
  if (candidates.length !== 1) throw new Error("پوشهٔ اصلی یک پروژهٔ Playwright دارای tools/new-test.cjs را در VS Code باز کنید. در Workspace فعلی باید دقیقاً یک پروژهٔ سازگار وجود داشته باشد.");
  return candidates[0].uri.fsPath;
}

function renderHtml(webview, extensionUri) {
  const nonce = crypto.randomBytes(24).toString("hex");
  const resource = name => webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", name));
  const template = fs.readFileSync(path.join(extensionUri.fsPath, "media", "studio.html"), "utf8");
  return template.replaceAll("{{nonce}}", nonce).replaceAll("{{cspSource}}", webview.cspSource)
    .replaceAll("{{script}}", resource("studio.js").toString())
    .replaceAll("{{style}}", resource("studio.css").toString());
}

class StudioProvider {
  constructor(context) {
    this.context = context;
    this.view = null;
    this.operation = null;
    this.pickingFolder = false;
    this.pickFolder = options => vscode.window.showOpenDialog(options);
    this.confirmRun = filename => vscode.window.showWarningMessage(
      "این تست ممکن است محیط را با RestoreSnapshot بازنشانی کند. ادامه می‌دهید؟",
      { modal: true, detail: "اجرای تست می‌تواند داده‌ها و تغییرات فعلی محیط تست را جایگزین کند.\n\n" + filename },
      "تأیید و اجرای تست");
    this.node = () => nodePath(vscode.workspace.getConfiguration("playwrightTestStudio").get("nodePath"));
    this.studio = new Studio({
      root: projectRoot, node: this.node,
      savedTarget: context.workspaceState.get("lastSpec"),
      rememberTarget: target => context.workspaceState.update("lastSpec", target),
      prepareRun: (filename, snapshot) => this.prepareRun(filename, snapshot),
      state: state => this.send({ type: "state", state }),
      open: filename => this.openSpec(filename),
      confirmSnapshot: async filename => {
        const answer = await vscode.window.showWarningMessage(
          "RestoreSnapshot وضعیت محیط تست را بازنشانی می‌کند. ادامه می‌دهید؟",
          { modal: true, detail: "این کار می‌تواند تغییرات و داده‌های فعلی محیط تست را جایگزین کند. همچنین اجرای بعدی این تست هم Snapshot را بازنشانی می‌کند.\n\n" + filename },
          "تأیید و شروع ضبط");
        return answer === "تأیید و شروع ضبط";
      },
    });
  }
  send(message) { if (this.view) void this.view.webview.postMessage(message); }
  async prepareRun(filename, snapshot) {
    const document = await vscode.workspace.openTextDocument(vscode.Uri.file(filename));
    if (document.isDirty && !await document.save()) throw new Error("فایل تست ذخیره نشد؛ اجرای تست شروع نشد.");
    if (snapshot || /\brestoreSnapshot\b/u.test(document.getText())) {
      const answer = await this.confirmRun(filename);
      return answer === "تأیید و اجرای تست";
    }
    return true;
  }
  async browseFolder(currentPath) {
    if (this.pickingFolder) return;
    if (this.studio.busy || this.studio.closing) {
      this.send({ type: "folder", cancelled: true });
      return;
    }
    this.pickingFolder = true;
    try {
      const root = projectRoot();
      let initial = path.join(root, "TestCases");
      if (typeof currentPath === "string" && currentPath.length <= 2048 && !path.isAbsolute(currentPath)) {
        const candidate = path.resolve(initial, currentPath.replace(/^TestCases(?:[\\/]|$)/iu, ""));
        try { relativeFolder(root, candidate); initial = candidate; } catch { /* open TestCases instead */ }
      }
      const selected = await this.pickFolder({
        canSelectFiles: false, canSelectFolders: true, canSelectMany: false,
        defaultUri: vscode.Uri.file(initial),
        title: "انتخاب پوشهٔ مقصد درون TestCases", openLabel: "انتخاب پوشه",
      });
      if (!selected?.length || this.studio.closing) {
        this.send({ type: "folder", cancelled: true });
        return;
      }
      if (projectRoot() !== root) throw new Error("پروژه تغییر کرده است؛ پوشه را دوباره انتخاب کنید.");
      if (selected.length !== 1 || selected[0].scheme !== "file") throw new Error("یک پوشهٔ محلی درون TestCases را انتخاب کنید.");
      this.send({ type: "folder", path: relativeFolder(root, selected[0].fsPath) });
    } catch (error) { this.send({ type: "folder", error: readableError(error) }); }
    finally { this.pickingFolder = false; }
  }
  async openSpec(filename) {
    const document = await vscode.workspace.openTextDocument(vscode.Uri.file(filename));
    const editor = await vscode.window.showTextDocument(document, { preview: false, preserveFocus: true });
    const line = document.getText().split(/\r?\n/u).findIndex(text => text.includes("Paste the recorded business actions"));
    if (line >= 0) {
      const position = new vscode.Position(line, 2);
      editor.selection = new vscode.Selection(position, position);
      editor.revealRange(new vscode.Range(position, position));
    }
  }
  async initialize() {
    try {
      const root = projectRoot();
      const profiles = await runJson(this.node(), [path.join(root, "tools", "new-test.cjs"), "--describe"], root);
      if (profiles.protocolVersion !== 1) throw new Error("نسخهٔ Generator با Studio سازگار نیست.");
      this.send({ type: "init", root, ...profiles });
    } catch (error) { this.send({ type: "init", error: readableError(error) }); }
    this.send({ type: "state", state: this.studio.state });
  }
  async handle(message) {
    if (!message || typeof message.type !== "string") return;
    try {
      if (message.type === "ready") await this.initialize();
      else if (message.type === "browse") await this.browseFolder(message.path);
      else if (message.type === "preview") {
        try {
          const result = await this.studio.preview(message.form);
          this.send({ type: "preview", request: message.request, specPath: result.specPath });
        } catch (error) { this.send({ type: "preview", request: message.request, error: readableError(error) }); }
      } else if (message.type === "start") {
        // Store the operation so extension shutdown can wait for owned processes.
        if (!this.studio.busy && !this.pickingFolder) {
          this.operation = this.studio.start(message.form);
          await this.operation;
        }
      } else if (message.type === "run") {
        if (!this.studio.busy && !this.pickingFolder) {
          this.operation = this.studio.runTest();
          await this.operation;
        }
      } else if (message.type === "stop" && this.studio.child) {
        if (this.studio.state.operation === "run") { await this.studio.stop(); return; }
        const answer = await vscode.window.showWarningMessage("کد ضبط‌شده را کپی کرده‌اید؟ پایان ضبط مرورگر و Inspector را می‌بندد.", { modal: true }, "کپی کرده‌ام؛ پایان ضبط");
        if (answer) await this.studio.stop();
      } else if (message.type === "open" && this.studio.state.specPath) {
        await this.openSpec(this.studio.state.specPath);
      }
    } catch (error) { this.send({ type: "error", error: readableError(error) }); }
  }
  resolveWebviewView(view) {
    this.view = view;
    view.webview.options = { enableScripts: true, localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, "media")] };
    view.webview.html = renderHtml(view.webview, this.context.extensionUri);
    const listener = view.webview.onDidReceiveMessage(message => void this.handle(message));
    view.onDidDispose(() => { listener.dispose(); if (this.view === view) this.view = null; });
  }
  async shutdown() {
    this.studio.closing = true;
    await this.studio.stop();
    if (this.operation) await this.operation;
  }
}

let provider;
function activate(context) {
  provider = new StudioProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("playwrightTestStudio.form", provider),
    vscode.commands.registerCommand("playwrightTestStudio.open", () => vscode.commands.executeCommand("workbench.view.extension.playwrightTestStudio")),
    vscode.workspace.onDidChangeWorkspaceFolders(() => void provider.initialize()));
  return { provider };
}
async function deactivate() { if (provider) await provider.shutdown(); }
module.exports = { activate, deactivate };
