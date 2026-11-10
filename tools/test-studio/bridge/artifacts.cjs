// Fixed native actions, not a command or filesystem API.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), crypto = require('node:crypto');
const { History, within } = require('../regression/history.cjs');
const native = require('../service/native.cjs');
const RUN = /^\d{8}T\d{9}Z-[0-9a-f-]{36}$/u;
function checked(base, relative) {
  if (typeof relative !== 'string' || path.isAbsolute(relative) || relative.split(/[\\/]/u).some(p => !p || p === '.' || p === '..' || p.includes(':'))) throw Error('Invalid artifact path');
  const file = path.join(base, relative); native.noLinks(file);
  const real = fs.realpathSync(file);
  if (!within(base, real) || !fs.statSync(real).isFile()) throw Error('Artifact outside run');
  return real;
}
function resolve(root, { kind, runId, artifactId }) {
  if (!RUN.test(runId)) throw Error('Invalid run');
  const store = new History(root, { readOnly: true }), value = store.detail(runId), base = store.directory(runId);
  if (value.manifest.id !== runId || value.manifest.schemaVersion !== 1 || !Array.isArray(value.manifest.tests) || !Array.isArray(value.summary.tests)) throw Error('Invalid run schema');
  native.noLinks(base);
  if (kind === 'archive' && artifactId === null) return { kind, file: checked(base, 'manifest.json') };
  if (kind === 'report' && artifactId === null && value.summary.report === true) return { kind, file: checked(base, 'report/index.html') };
  if (kind === 'trace' && /^[a-f0-9]{24}$/u.test(artifactId)) {
    for (const test of value.summary.tests) for (const [ai, attempt] of (test.attempts || []).entries()) for (const [index, a] of (attempt.attachments || []).entries()) {
      if (a.name !== 'trace' || typeof a.path !== 'string' || !/^(attachments|artifacts)\//u.test(a.path) || path.extname(a.path).toLowerCase() !== '.zip') continue;
      const id = crypto.createHash('sha256').update(JSON.stringify([test.id, ai, index, a.path])).digest('hex').slice(0, 24);
      if (id === artifactId) return { kind, file: checked(base, a.path) };
    }
  }
  throw Error('Recorded report or trace is missing / invalid');
}
function snapshot(item) {
  // Serve only an isolated copy, never the workspace or original History.
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-studio-viewer-'));
  let bytes = 0, files = 0;
  const copy = (base, relative, to) => {
    const source = checked(base, relative), stat = fs.statSync(source);
    bytes += stat.size; if (++files > 10000 || bytes > 512 * 1024 * 1024) throw Error('Viewer artifact limit exceeded');
    fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(source, to, fs.constants.COPYFILE_EXCL);
  };
  try {
    native.secureDirectory(folder);
    if (item.kind === 'trace') copy(path.dirname(item.file), path.basename(item.file), path.join(folder, 'trace.zip'));
    else {
      const base = path.dirname(item.file);
      const walk = (relative = '', depth = 0) => {
        if (depth > 32) throw Error('Report directory too deep');
        for (const entry of fs.readdirSync(path.join(base, relative), { withFileTypes: true })) {
          if (entry.isSymbolicLink()) throw Error('Linked report artifact');
          const child = path.join(relative, entry.name);
          if (entry.isDirectory()) walk(child, depth + 1);
          else if (entry.isFile()) copy(base, child, path.join(folder, child));
          else throw Error('Invalid report artifact');
        }
      }; walk();
    }
    return folder;
  } catch (error) { dispose(folder); throw error; }
}
function cleanupPath(folder) {
  const resolved = path.resolve(folder);
  if (path.dirname(resolved) !== fs.realpathSync(os.tmpdir()) || !/^pw-studio-viewer-/u.test(path.basename(resolved))) throw Error('Invalid viewer cleanup');
  native.noLinks(resolved); return resolved;
}
function dispose(folder) { fs.rmSync(cleanupPath(folder), { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }); }
async function cleanup(folder) {
  // Windows can hold the terminal cwd briefly after onDidCloseTerminal. Retry
  // only this owned copy, asynchronously; never stop a process to remove it.
  await fs.promises.rm(cleanupPath(folder), { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
async function open(host, input) {
  if (Object.keys(input).sort().join(',') !== 'artifactId,kind,requestId,runId') throw Error('Invalid native action');
  const root = fs.realpathSync(host.getRoot()); if (root !== host.root) throw Error('Workspace changed');
  const item = resolve(root, input), vscode = host.vscode;
  if (item.kind === 'archive') await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(item.file));
  else {
    host.viewers ||= new Map(); const key = JSON.stringify([input.kind, input.runId, input.artifactId]);
    if (host.viewers.has(key)) { host.viewers.get(key).show(true); return { opened: true, windowId: host.windowId, message: 'ترمینال Viewer موجود دوباره نمایش داده شد.' }; }
    if (host.viewers.size >= 4) throw Error('Close an existing Studio viewer terminal first');
    const node = require('../studio.cjs').nodePath(vscode.workspace.getConfiguration('playwrightTestStudio').get('nodePath'));
    const cli = require.resolve('@playwright/test/cli', { paths: [root] });
    const folder = snapshot(item);
    let terminal, listener;
    try {
      listener = vscode.window.onDidCloseTerminal(closed => { if (closed === terminal) {
        listener.dispose(); host.viewers.delete(key);
        void cleanup(folder).catch(() => {
          void vscode.window.showWarningMessage?.('پاکسازی کپی موقت Viewer تأیید نشد؛ کپی برای بررسی حفظ شد. هیچ پردازش دیگری متوقف نشد.');
        });
      } });
      terminal = vscode.window.createTerminal({ name: 'Studio ' + (item.kind === 'report' ? 'HTML Report' : 'Trace Viewer'), cwd: folder, shellPath: node,
        shellArgs: [cli, item.kind === 'report' ? 'show-report' : 'show-trace', item.kind === 'report' ? folder : path.join(folder, 'trace.zip'), '--host=127.0.0.1', '--port=0'],
        env: { ELECTRON_RUN_AS_NODE: null, PW_TEST_REUSE_CONTEXT: null, PWDEBUG: null } });
      host.viewers.set(key, terminal); terminal.show(true);
    } catch (error) { listener?.dispose(); host.viewers.delete(key); terminal?.dispose(); dispose(folder); throw error; }
  }
  return { opened: true, windowId: host.windowId, message: item.kind === 'archive' ? 'پوشهٔ Run در پنجرهٔ انتخاب‌شده باز شد.' : 'فرمان Viewer در ترمینال پنجرهٔ انتخاب‌شده شروع شد؛ خطای احتمالی را همان‌جا بررسی کنید. بستن ترمینال کپی موقت را پاک می‌کند.' };
}
module.exports = { resolve, snapshot, dispose, cleanup, open };
