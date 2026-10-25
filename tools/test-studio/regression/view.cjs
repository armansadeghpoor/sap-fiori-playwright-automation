const fs = require("node:fs");
const path = require("node:path");
const { RegressionManager } = require("./manager.cjs");
const { within } = require("./history.cjs");
const { relativeFolder } = require("../studio.cjs");

class RegressionView {
  constructor(context, vscode, helpers) {
    this.context = context; this.vscode = vscode; this.helpers = helpers;
    this.view = null; this.operation = null; this.picking = false;
    this.pick = options => vscode.window.showOpenDialog(options);
    this.confirmSnapshot = files => vscode.window.showWarningMessage(
      `${files.length} فایل انتخاب‌شده دارای RestoreSnapshot است. اجرای تست‌ها می‌تواند محیط را بازنشانی کند.`,
      { modal: true, detail: "Setup خود تست‌ها اجرا می‌شود.\n\n" + files.join("\n") }, "تأیید و اجرای تست‌ها");
    this.manager = new RegressionManager({ root: helpers.root, node: helpers.node,
      state: state => this.send({ type: "state", state }),
      prepare: input => this.prepare(input), confirmSnapshot: async files => await this.confirmSnapshot(files) === "تأیید و اجرای تست‌ها" });
  }
  send(value) { if (this.view) void this.view.webview.postMessage(value); }
  async prepare(input) {
    const root = this.helpers.root();
    const base = path.join(root, "TestCases");
    let files;
    if (input.scope === "selection") files = (this.manager.state.catalog || []).filter(test => input.ids?.includes(test.id)).map(test => test.file);
    if (["failed", "selected"].includes(input.scope)) {
      const old = this.manager.store().detail(input.parentRunId).summary.tests;
      files = old.filter(test => input.scope === "failed" ? test.outcome === "failed" : input.ids?.includes(test.id)).map(test => test.file);
    }
    const target = typeof input.path === "string" ? path.resolve(base, input.path) : base;
    for (const document of this.vscode.workspace.textDocuments || []) {
      const file = document.uri.fsPath;
      const included = files ? files.includes(file) : input.scope === "suite" || (input.scope === "file" ? file === target : within(target, file));
      if (document.uri.scheme === "file" && within(base, file) && included && document.isDirty && !await document.save()) throw new Error("فایل تست ذخیره نشد: " + file);
    }
    return true;
  }
  refresh() { this.send({ type: "history", runs: this.manager.store().list() }); }
  async browse(scope) {
    if (this.manager.busy || this.picking || this.manager.closing) return;
    this.picking = true;
    this.send({ type: "picking", busy: true });
    try {
      const root = this.helpers.root();
      const selected = await this.pick({ canSelectFiles: scope === "file", canSelectFolders: scope !== "file", canSelectMany: false,
        defaultUri: this.vscode.Uri.file(path.join(root, "TestCases")), title: "انتخاب مقصد Regression",
        ...(scope === "file" ? { filters: { "Playwright Spec": ["ts"] } } : {}) });
      if (!selected?.length) return;
      if (this.helpers.root() !== root || selected.length !== 1 || selected[0].scheme !== "file") throw new Error("انتخاب مقصد نامعتبر است.");
      const file = selected[0].fsPath;
      relativeFolder(root, scope === "file" ? path.dirname(file) : file);
      if (scope === "file" && (!file.endsWith(".spec.ts") || !within(fs.realpathSync(path.join(root, "TestCases")), fs.realpathSync(file)))) throw new Error("یک فایل spec داخل TestCases انتخاب کنید.");
      this.send({ type: "target", path: path.relative(path.join(root, "TestCases"), file).split(path.sep).join("/") });
    } finally { this.picking = false; this.send({ type: "picking", busy: false }); }
  }
  async handle(message) {
    if (!message || typeof message.type !== "string") return;
    try {
      this.helpers.root(); // Trust and current-workspace checks also apply to history/artifacts.
      if (message.type === "ready" || message.type === "refresh") {
        this.send({ type: "init", root: this.helpers.root() }); this.refresh();
        this.send({ type: "state", state: this.manager.state });
      } else if (message.type === "browse") await this.browse(message.scope);
      else if (message.type === "discover" || message.type === "run") {
        if (this.picking || this.manager.busy || this.manager.closing) return;
        this.operation = message.type === "discover" ? this.manager.discover() : this.manager.run(message.input);
        try { await this.operation; } finally { this.refresh(); }
      } else if (message.type === "stop") await this.manager.stop();
      else if (message.type === "detail") this.send({ type: "detail", detail: this.manager.store().detail(message.id) });
      else if (message.type === "openArchive") await this.vscode.commands.executeCommand("revealFileInOS", this.vscode.Uri.file(path.join(this.manager.store().directory(message.id), "manifest.json")));
      else if (message.type === "openArtifact") {
        const filename = this.manager.store().artifact(message.id, message.path);
        if (message.kind === "trace") {
          const root = this.helpers.root();
          this.vscode.window.createTerminal({ name: "Regression Trace", cwd: root, shellPath: this.helpers.node(),
            shellArgs: [this.manager.cli(root), "show-trace", filename] }).show(true);
        } else await this.vscode.commands.executeCommand("vscode.open", this.vscode.Uri.file(filename));
      } else if (message.type === "openReport") await this.openReport(message.id);
    } catch (error) { this.send({ type: "error", message: error.message, busy: this.manager.busy }); }
  }
  async openReport(id) {
    const store = this.manager.store();
    store.artifact(id, "report/index.html");
    const root = this.helpers.root();
    const terminal = this.vscode.window.createTerminal({ name: "Regression Report " + id.slice(0, 18), cwd: root,
      shellPath: this.helpers.node(), shellArgs: [this.manager.cli(root), "show-report", path.join(store.directory(id), "report"), "--host=127.0.0.1", "--port=0"] });
    terminal.show(true);
  }
  resolveWebviewView(view) {
    this.view = view;
    view.webview.options = { enableScripts: true, localResourceRoots: [this.vscode.Uri.joinPath(this.context.extensionUri, "media")] };
    view.webview.html = this.helpers.render(view.webview, this.context.extensionUri, "regression");
    const listener = view.webview.onDidReceiveMessage(message => void this.handle(message));
    view.onDidDispose(() => { listener.dispose(); if (this.view === view) this.view = null; });
  }
  async shutdown() {
    this.manager.closing = true;
    await this.manager.stop();
    if (this.operation) await this.operation.catch(() => {});
  }
}
module.exports = { RegressionView };
