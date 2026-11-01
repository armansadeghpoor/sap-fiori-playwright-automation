const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vscode = require('vscode');
const { createService } = require('../service/server.cjs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(fn, message, timeout = 60000) { const end = Date.now() + timeout; while (!fn()) { if (Date.now() > end) throw Error(message); await sleep(100); } }
exports.run = async () => {
  const root = vscode.workspace.workspaceFolders[0].uri.fsPath, control = path.join(root, 'bridge-control');
  const role = process.env.STUDIO_BRIDGE_ROLE;
  const { bridge } = await vscode.extensions.getExtension('newweb-local.playwright-test-studio').activate();
  await bridge.ready; assert.ok(bridge.host, 'real native bridge registered');
  fs.writeFileSync(path.join(control, role + '-window.json'), JSON.stringify({ windowId: bridge.host.windowId }));
  if (role === 'secondary') {
    try {
      await until(() => fs.existsSync(path.join(control, 'secondary-check')) || fs.existsSync(path.join(control, 'finish')), 'no secondary open', 120000);
      if (fs.existsSync(path.join(control, 'finish'))) return;
      const editor = vscode.window.activeTextEditor;
      fs.writeFileSync(path.join(control, 'secondary-result.json'), JSON.stringify({ file: editor?.document.uri.fsPath, line: editor?.selection.start.line }));
      await until(() => fs.existsSync(path.join(control, 'finish')), 'driver did not finish', 120000);
    } finally { await bridge.close(); }
    return;
  }
  const seed = JSON.parse(fs.readFileSync(path.join(control, 'seed.json')));
  let app;
  try {
    await until(() => fs.existsSync(path.join(control, 'secondary-window.json')), 'second Extension Host not registered');
    const secondary = JSON.parse(fs.readFileSync(path.join(control, 'secondary-window.json')));
    const canonicalRoot = fs.realpathSync(root);
    const catalogTests = seed.tests.map(test => ({ ...test, file: path.join(canonicalRoot, path.relative(root, test.file)) }));
    app = await createService({ root, catalogOptions: { discover: async () => ({ rootDir: canonicalRoot, tests: catalogTests }) } });
    const paired = await fetch(app.origin + '/api/session', { method: 'POST', headers: { Origin: app.origin, 'Content-Type': 'application/json', 'X-Studio-Request': '1' }, body: JSON.stringify({ code: app.pairingCode }) });
    const cookie = paired.headers.get('set-cookie').split(';')[0];
    const session = await fetch(app.origin + '/api/session', { headers: { Cookie: cookie } }).then(r => r.json());
    const post = async (selection, windowId = bridge.host.windowId) => {
      const response = await fetch(app.origin + '/api/bridge/open', { method: 'POST', headers: { Cookie: cookie, Origin: app.origin, 'Content-Type': 'application/json', 'X-Studio-CSRF': session.csrf }, body: JSON.stringify({ windowId, selection }) });
      const value = await response.json(); return { status: response.status, ...value };
    };
    const selection = testId => ({ kind: 'history', runId: seed.runId, testId });
    assert.equal((await app.bridge.status()).windows.length, 2, 'two genuine Extension Hosts');
    assert.equal((await post(selection('A'), null)).status, 409, 'ambiguous window refused');
    const userDocument = await vscode.workspace.openTextDocument({ content: 'unsaved user work', language: 'typescript' }); await vscode.window.showTextDocument(userDocument, { preview: false });
    const disk = fs.readFileSync(seed.source);
    const failed = await post(selection('A')); assert.equal(failed.status, 200, failed.error); assert.equal(failed.line, 3); assert.equal(vscode.window.activeTextEditor.selection.start.line, 2);
    for (const [id, line] of [['B', 4], ['C', 5]]) { const value = await post(selection(id)); assert.equal(value.line, line); assert.equal(vscode.window.activeTextEditor.selection.start.line, line - 1); }
    const document = vscode.window.activeTextEditor.document;
    const edit = new vscode.WorkspaceEdit(); edit.insert(document.uri, new vscode.Position(0, 0), '// unsaved user edit\n'); await vscode.workspace.applyEdit(edit);
    assert.equal((await post(selection('A'))).changed, true); assert.equal(document.isDirty, true); assert.deepEqual(fs.readFileSync(seed.source), disk);
    for (let i = 0; i < 3; i++) await post(selection('B'));
    const tabs = vscode.window.tabGroups.all.flatMap(g => g.tabs).filter(t => t.input instanceof vscode.TabInputText && path.relative(t.input.uri.fsPath, seed.source) === ''); assert.equal(tabs.length, 1, 'no duplicate tabs');
    assert.equal(userDocument.getText(), 'unsaved user work'); assert.equal(userDocument.isClosed, false);
    const other = await post(selection('B'), secondary.windowId); assert.equal(other.status, 200); assert.equal(other.windowId, secondary.windowId);
    fs.writeFileSync(path.join(control, 'secondary-check'), '1'); await until(() => fs.existsSync(path.join(control, 'secondary-result.json')), 'secondary editor not verified');
    const observed = JSON.parse(fs.readFileSync(path.join(control, 'secondary-result.json'))); assert.equal(path.relative(observed.file, seed.source), ''); assert.equal(observed.line, 3, 'clean secondary sees definition on disk');
    const oldId = bridge.host.windowId; await bridge.refresh(); assert.notEqual(bridge.host.windowId, oldId);
    assert.equal((await post(selection('A'), oldId)).status, 409); assert.equal((await post(selection('A'))).status, 200, 'reconnected window works');
    app.catalog.start({}); await app.catalog.pending;
    assert.equal(app.catalog.value.phase, 'ready', app.catalog.value.error);
    const revision = app.catalog.value.catalogRevision;
    assert.equal((await post({ kind: 'catalog', catalogRevision: revision, testId: 'C' })).status, 200);
    fs.appendFileSync(seed.source, '\n// disk changed'); assert.equal((await post(selection('A'))).changed, true);
    assert.equal((await post({ kind: 'catalog', catalogRevision: revision, testId: 'C' })).status, 409);
    fs.unlinkSync(seed.source); assert.equal((await post(selection('A'))).status, 404);
    const before = JSON.parse(fs.readFileSync(path.join(control, 'archive-before.json')));
    for (const [file, base64] of before) assert.equal(fs.readFileSync(path.join(root, file)).toString('base64'), base64);
    assert.equal(app.execution.current, null);
    fs.writeFileSync(path.join(control, 'driver-result.json'), JSON.stringify({ passed: true, checks: ['two real VS Code windows', 'explicit target and no wrong-window fallback', 'authenticated HTTP → actual editor', 'Persian spec and exact similar-title IDs', 'failed assertion / passed / skipped', 'dirty and unsaved user buffers preserved', 'no duplicate source tabs', 'changed and deleted source', 'catalog stale rejection', 'bridge reconnect', 'History bytes unchanged', 'Execution remains idle'] }, null, 2));
  } finally { fs.writeFileSync(path.join(control, 'finish'), '1'); await app?.close(); await bridge.close(); }
};
