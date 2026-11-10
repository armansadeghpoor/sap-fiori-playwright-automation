const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const native = require('../service/native.cjs');
const registry = require('./registry.cjs');
const { safeSpec, location, digest } = require('../regression/source.cjs');

class BridgeHost {
  constructor(vscode, root, options = {}) {
    this.vscode = vscode; this.getRoot = root; this.options = options;
    this.windowId = crypto.randomUUID(); this.token = crypto.randomBytes(32).toString('hex');
    this.queue = Promise.resolve(); this.pending = 0; this.closed = false;
  }
  async start() {
    this.root = fs.realpathSync(this.getRoot());
    const folder = this.options.directory || registry.directory(this.root);
    native.secureDirectory(folder);
    this.server = http.createServer(async (req, res) => {
      const json = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
      try {
        if (this.closed || fs.realpathSync(this.getRoot()) !== this.root) throw Error('Workspace is no longer trusted or has changed.');
        if (req.headers.host !== `127.0.0.1:${this.port}` || req.rawHeaders.filter((v, i) => !(i % 2) && v.toLowerCase() === 'host').length !== 1 ||
            req.headers.origin || req.headers['sec-fetch-site'] || req.headers['x-studio-bridge'] !== '1' || !registry.equal(req.headers.authorization, 'Bearer ' + this.token)) { json(403, { error: 'Native Studio bridge authentication required.' }); return; }
        if (req.method === 'GET' && req.url === '/health') { json(200, { windowId: this.windowId, projectKey: native.key(this.root), pid: process.pid, protocolVersion: 1, capabilities: { editorGuard: 1, artifacts: 1 } }); return; }
        if (req.method !== 'POST' || !['/open', '/editors/check', '/artifacts/open'].includes(req.url) || req.headers['content-type'] !== 'application/json') { json(404, { error: 'Unknown bridge request.' }); return; }
        let bytes = 0, text = '';
        for await (const chunk of req) { bytes += chunk.length; if (bytes > 32768) throw Error('Bridge request too large.'); text += chunk.toString('utf8'); }
        const input = JSON.parse(text);
        if (!input || !registry.uuid.test(input.requestId) || this.pending >= 16) throw Error('Invalid bridge request.');
        const route = req.url;
        if (route === '/open' && (Object.keys(input).sort().join(',') !== 'requestId,target' || !input.target || Object.keys(input.target).sort().join(',') !== 'result,test')) throw Error('Invalid bridge request.');
        this.pending++;
        const task = this.queue.then(() => {
          if (this.closed || fs.realpathSync(this.getRoot()) !== this.root) throw Error('Workspace changed');
          return route === '/open' ? this.open(input.target) : route === '/editors/check' ? this.checkEditors(input) : require('./artifacts.cjs').open(this, input);
        });
        this.queue = task.catch(() => {});
        try { json(200, await task); } finally { this.pending--; }
      } catch { if (!res.headersSent) json(409, { error: 'عملیات Bridge تأیید نشد؛ فایل، پروژه، سازگاری نسخه یا ظرفیت Viewer را بررسی کنید.' }); else res.destroy(); }
    });
    this.server.requestTimeout = 5000; this.server.headersTimeout = 5000;
    await new Promise((resolve, reject) => { this.server.once('error', reject); this.server.listen(0, '127.0.0.1', resolve); });
    this.port = this.server.address().port;
    const value = { protocolVersion: 1, windowId: this.windowId, projectKey: native.key(this.root), pid: process.pid,
      identity: native.identity(process.pid), port: this.port, token: this.token,
      label: `${path.basename(this.root)} · ${this.vscode.workspace.name || 'Workspace'} · #${this.windowId.slice(0, 6)}`.slice(0, 256) };
    this.file = path.join(folder, this.windowId + '.json'); this.bytes = Buffer.from(JSON.stringify(value));
    try { fs.writeFileSync(this.file, this.bytes, { flag: 'wx', mode: 0o600 }); this.ino = fs.lstatSync(this.file).ino; }
    catch (e) { await this.close(); throw e; }
    return this;
  }
  async open({ test, result }) {
    if (this.closed || fs.realpathSync(this.getRoot()) !== this.root) throw Error('Workspace changed');
    if (!test || typeof test.id !== 'string' || typeof test.sourceHash !== 'string' && test.sourceHash != null) throw Error('Invalid test identity');
    const real = safeSpec(this.root, test.file), document = await this.vscode.workspace.openTextDocument(this.vscode.Uri.file(real));
    if (this.closed || fs.realpathSync(this.getRoot()) !== this.root || safeSpec(this.root, test.file) !== real) throw Error('Source changed');
    const changed = document.isDirty || (test.sourceHash ? digest(fs.readFileSync(real)) !== test.sourceHash : null);
    const target = location(test, result, document.getText(), real), range = new this.vscode.Range(target.line - 1, target.column - 1, target.line - 1, target.column - 1);
    const visible = this.vscode.window.visibleTextEditors.find(e => e.document.uri.fsPath === document.uri.fsPath);
    const group = this.vscode.window.tabGroups.all.find(g => g.tabs.some(t => t.input instanceof this.vscode.TabInputText && t.input.uri.fsPath === document.uri.fsPath));
    const editor = await this.vscode.window.showTextDocument(document, { preview: false, preserveFocus: false, viewColumn: visible?.viewColumn ?? group?.viewColumn ?? this.vscode.ViewColumn.Active, selection: range });
    editor.revealRange(range, this.vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    return { opened: true, windowId: this.windowId, line: target.line, kind: target.kind, changed,
      message: changed ? 'کد باز شد؛ فایل یا ویرایش ذخیره‌نشده با زمان شناسایی/Run متفاوت است و خط تاریخی است.' : !test.sourceHash ? 'کد باز شد؛ تطابق نسخهٔ تاریخی قابل تأیید نیست.' : 'کد در پنجرهٔ انتخاب‌شده باز شد.' };
  }
  checkEditors(input) {
    if (Object.keys(input).sort().join(',') !== 'requestId,tests' || !Array.isArray(input.tests) || !input.tests.length || input.tests.length > 32 || !Array.isArray(this.vscode.workspace.textDocuments)) throw Error('Editor inspection unavailable');
    const dirty = [];
    for (const test of input.tests) {
      if (!test || Object.keys(test).sort().join(',') !== 'file,sourceHash' || !/^[a-f0-9]{64}$/u.test(test.sourceHash)) throw Error('Invalid editor identity');
      const real = safeSpec(this.root, test.file);
      if (digest(fs.readFileSync(real)) !== test.sourceHash) throw Error('Source changed');
      if (this.vscode.workspace.textDocuments.some(doc => doc.uri.scheme === 'file' && path.resolve(doc.uri.fsPath).toLowerCase() === real.toLowerCase() && doc.isDirty)) dirty.push(path.relative(this.root, real));
    }
    return { windowId: this.windowId, checked: input.tests.length, dirty: dirty.slice(0, 8) };
  }
  async close() {
    this.closed = true;
    if (this.file) try { if (fs.lstatSync(this.file).ino === this.ino && fs.readFileSync(this.file).equals(this.bytes)) fs.unlinkSync(this.file); } catch {}
    if (this.server?.listening) { this.server.closeAllConnections(); await new Promise(resolve => this.server.close(resolve)); }
    await this.queue;
  }
}
module.exports = { BridgeHost };
