const fs = require("node:fs");
const path = require("node:path");
const { RegressionManager } = require("./manager.cjs");
const { within, hashFile } = require("./history.cjs");
const { relativeFolder } = require("../studio.cjs");

class RegressionView {
  constructor(context, vscode, helpers) {
    this.context = context; this.vscode = vscode; this.helpers = helpers;
    this.view = null; this.operation = null; this.picking = false;
    this.sourceRequest = 0; this.sourceOpening = Promise.resolve(); this.sourceColumn = undefined;
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
      else if (message.type === "openSource") {
        const request = ++this.sourceRequest;
        // Serialize editor changes, skipping superseded clicks rather than opening stale tabs.
        this.sourceOpening = this.sourceOpening.then(() => this.openSource(message.id, message.testId, request));
        await this.sourceOpening;
      }
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
  async openSource(id, testId, request) {
    const current = () => request === this.sourceRequest && !this.manager.closing;
    if (!current()) return;
    try {
      const root = fs.realpathSync(this.helpers.root());
      const { manifest, summary } = this.manager.store().detail(id);
      const matches = (manifest.tests || []).filter(test => typeof testId === "string" && test.id === testId);
      if (matches.length !== 1) throw new Error("شناسهٔ تست در این Run معتبر یا یکتا نیست.");
      const test = matches[0], filename = test.file;
      const base = fs.realpathSync(path.join(root, "TestCases"));
      if (typeof filename !== "string" || !path.isAbsolute(filename) || !/\.spec\.ts$/iu.test(filename) ||
          !within(root, base) || !within(path.join(root, "TestCases"), filename)) throw new Error("مسیر Spec خارج از TestCases این Workspace یا نامعتبر است.");
      const realFile = fs.realpathSync(filename);
      if (!within(base, realFile) || !fs.statSync(realFile).isFile()) throw new Error("مسیر واقعی Spec داخل TestCases نیست یا فایل معتبر نیست.");
      const document = await this.vscode.workspace.openTextDocument(this.vscode.Uri.file(filename));
      if (!current()) return;
      if (fs.realpathSync(this.helpers.root()) !== root || fs.realpathSync(filename) !== realFile) throw new Error("پروژه یا مسیر Spec هنگام بازکردن تغییر کرد؛ دوباره انتخاب کنید.");
      const changed = document.isDirty || Boolean(test.sourceHash && hashFile(realFile) !== test.sourceHash);
      const validLine = line => Number.isSafeInteger(line) && line > 0 && line <= document.lineCount;
      const sameSpec = file => typeof file === "string" && path.isAbsolute(file) &&
        (path.relative(filename, file) === "" || path.relative(realFile, file) === "");
      let location;
      const result = (summary.tests || []).find(item => item.id === testId);
      if (result?.outcome === "failed") {
        for (const error of result.attempts?.at(-1)?.errors || []) {
          if (typeof error.location?.file === "string" && path.isAbsolute(error.location.file)) {
            if (sameSpec(error.location.file) && validLine(error.location.line)) location = error.location;
            // An explicit helper/out-of-range location must fall back to the definition.
            break;
          }
          // Playwright can truncate location.file for paths containing parentheses.
          // Only an absolute, validated stack frame may repair that missing location.
          const stack = String(error.stack || "").replace(/\x1b\[[0-?]*[ -/]*[@-~]/gu, "");
          for (const frame of stack.split(/\r?\n/u)) {
            const match = frame.match(/(?:^|\s|\()((?:[A-Za-z]:[\\/]|\/)[^\r\n]*):(\d+):(\d+)\)?\s*$/u);
            if (match) {
              if (sameSpec(match[1]) && validLine(Number(match[2]))) location = { line: Number(match[2]), column: Number(match[3]) };
              break; // Do not turn a helper frame into a guessed Spec failure location.
            }
          }
          if (location) break;
        }
      }
      const historicalLine = location?.line || test.line;
      const line = validLine(historicalLine) ? historicalLine - 1 : 0;
      const selectedColumn = location ? location.column : test.column;
      const column = Math.min(document.lineAt(line).text.length, Math.max(0,
        validLine(historicalLine) && Number.isSafeInteger(selectedColumn) ? selectedColumn - 1 : 0));
      const range = new this.vscode.Range(line, column, line, column);
      const visible = this.vscode.window.visibleTextEditors?.find(editor => editor.document.uri.fsPath === document.uri.fsPath);
      const groups = this.vscode.window.tabGroups?.all || [];
      const columnToReuse = groups.some(group => group.viewColumn === this.sourceColumn) ? this.sourceColumn : undefined;
      // The Dashboard is a Sidebar view: the main editor already sits beside it.
      // Reuse one editor group; ViewColumn.Beside on every click would create splits.
      const editor = await this.vscode.window.showTextDocument(document, { preview: true, preserveFocus: true,
        viewColumn: visible?.viewColumn ?? columnToReuse ?? this.vscode.ViewColumn.Active, selection: range });
      editor.revealRange(range, this.vscode.TextEditorRevealType.InCenterIfOutsideViewport);
      this.sourceColumn = editor.viewColumn;
      if (!current()) return;
      const notes = [changed ? "هشدار: فایل فعلی یا ویرایش ذخیره‌نشده با کد زمان Run متفاوت است؛ شمارهٔ خط‌ها تاریخی هستند." :
        !test.sourceHash ? "اثر انگشت کد در این Run موجود نیست؛ تطابق نسخه قابل تأیید نیست." : "",
      !validLine(historicalLine) ? "خط ثبت‌شده دیگر معتبر نیست؛ ابتدای فایل نمایش داده شد." : ""];
      this.send({ type: "source", id, testId, changed, message: "کد باز شد · خط " + (line + 1) + (notes.some(Boolean) ? "\n" + notes.filter(Boolean).join("\n") : "") });
    } catch (error) {
      if (current()) this.send({ type: "source", id, testId, error: true, message: error.code ?
        "فایل Spec در دسترس نیست؛ ممکن است حذف یا جابه‌جا شده باشد یا اجازهٔ خواندن نداشته باشد." : error.message });
    }
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
    await this.sourceOpening;
  }
}
module.exports = { RegressionView };
