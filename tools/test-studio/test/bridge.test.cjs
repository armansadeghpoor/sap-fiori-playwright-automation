const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { fixture, cleanup } = require('./fixture.cjs');
const { History, hashFile } = require('../regression/history.cjs');
const { Repository } = require('../service/repository.cjs');
const { Catalog } = require('../service/catalog.cjs');
const { BridgeHost } = require('../bridge/host.cjs');
const { Bridge } = require('../service/bridge.cjs');
const { createService } = require('../service/server.cjs');
const { records } = require('../bridge/registry.cjs');
function mock() {
  const docs = new Map(), opened = [];
  return { docs, opened, workspace: { name: 'Fixture', async openTextDocument(uri) {
    if (!docs.has(uri.fsPath)) docs.set(uri.fsPath, { uri, isDirty: false, getText() { return this.buffer ?? fs.readFileSync(uri.fsPath, 'utf8'); } });
    return docs.get(uri.fsPath);
  } }, Uri: { file: fsPath => ({ fsPath }) }, Range: class { constructor(line, column) { this.start = { line, character: column }; } }, ViewColumn: { Active: -1 }, TextEditorRevealType: { InCenterIfOutsideViewport: 2 }, TabInputText: class {}, window: { visibleTextEditors: [], tabGroups: { all: [] }, async showTextDocument(document, options) { opened.push({ document, options }); return { revealRange() {} }; } } };
}
async function setup(t) {
  const root = fixture(); t.after(() => cleanup(root));
  const source = path.join(root, 'TestCases', 'فایل فارسی (مشابه).spec.ts'); fs.writeFileSync(source, ['// fixture', '// test A', '// assertion A', '// test B', '// skipped', '// end'].join('\n'));
  const tests = ['A', 'B', 'C'].map((id, i) => ({ id, title: 'similar title', titles: ['group ' + id, 'similar title'], file: source, listFile: path.relative(root, source), project: 'Chrome', line: [2, 4, 5][i], column: 1, sourceHash: hashFile(source) }));
  const history = new History(root), run = history.create({ scope: 'fixture', tests });
  history.finalize(run, { complete: true, status: 'failed', tests: tests.map((v, i) => ({ ...v, outcome: ['failed', 'passed', 'skipped'][i], attempts: i ? [] : [{ errors: [{ stack: 'Error\n at ' + source + ':3:1' }] }] })) });
  const repository = new Repository(root), catalog = new Catalog(root); catalog.value = { phase: 'ready', catalogRevision: 'fixture', tests, entries: [], updatedAt: null, error: null }; catalog.fingerprint = catalog.scan();
  const directory = path.join(root, 'bridges'), vscode = mock(), host = await new BridgeHost(vscode, () => root, { directory }).start(); t.after(() => host.close());
  const bridge = new Bridge(repository, catalog, { directory });
  const input = id => ({ windowId: host.windowId, selection: { kind: 'history', runId: run.manifest.id, testId: id } });
  return { root, source, tests, run, history, repository, catalog, directory, vscode, host, bridge, input };
}
test('bridge exact IDs open assertion, passed/skipped definitions and Persian source', async t => {
  const s = await setup(t);
  assert.equal((await s.bridge.status()).windows.length, 1);
  for (const [id, line] of [['A', 3], ['B', 4], ['C', 5]]) { const value = await s.bridge.open(s.input(id)); assert.equal(value.line, line); assert.equal(s.vscode.opened.at(-1).document.uri.fsPath, s.source); }
});
test('bridge catalog IDs require current revision, identity and unchanged source', async t => {
  const s = await setup(t), input = { windowId: null, selection: { kind: 'catalog', catalogRevision: 'fixture', testId: 'B' } };
  assert.equal((await s.bridge.open(input)).line, 4);
  await assert.rejects(s.bridge.open({ ...input, selection: { ...input.selection, catalogRevision: 'old' } }), /قدیمی/);
  fs.appendFileSync(s.source, '\n// changed'); await assert.rejects(s.bridge.open(input), /قدیمی/);
});
test('bridge dirty buffer survives, no save, historical source change is reported', async t => {
  const s = await setup(t); await s.bridge.open(s.input('A'));
  const document = s.vscode.docs.get(s.source), before = fs.readFileSync(s.source); document.isDirty = true; document.buffer = '// unsaved\n' + before;
  assert.equal((await s.bridge.open(s.input('B'))).changed, true); assert.equal(document.isDirty, true); assert.deepEqual(fs.readFileSync(s.source), before);
  document.isDirty = false; fs.appendFileSync(s.source, '\n// changed disk'); assert.equal((await s.bridge.open(s.input('A'))).changed, true);
});
test('bridge removed source and path/command injection fail before editor changes', async t => {
  const s = await setup(t);
  for (const selection of [{ ...s.input('A').selection, file: s.source }, { kind: 'path', file: s.source }, { kind: 'command', command: 'workbench.action.closeWindow' }]) await assert.rejects(s.bridge.open({ windowId: null, selection }));
  fs.unlinkSync(s.source); await assert.rejects(s.bridge.open(s.input('A')), /Spec/); assert.equal(s.vscode.opened.length, 0);
});
test('bridge two windows require explicit choice and never fall back from disconnected choice', async t => {
  const s = await setup(t), otherVSCode = mock(), second = await new BridgeHost(otherVSCode, () => s.root, { directory: s.directory }).start(); t.after(() => second.close());
  assert.equal((await s.bridge.status()).windows.length, 2);
  await assert.rejects(s.bridge.open({ ...s.input('B'), windowId: null }), /چند پنجره/);
  assert.equal((await s.bridge.open({ ...s.input('B'), windowId: second.windowId })).windowId, second.windowId); assert.equal(s.vscode.opened.length, 0); assert.equal(otherVSCode.opened.length, 1);
  await second.close(); await assert.rejects(s.bridge.open({ ...s.input('A'), windowId: second.windowId }), /متصل نیست/);
  assert.equal((await s.bridge.open(s.input('C'))).windowId, s.host.windowId);
});
test('bridge stale registrations, PID reuse, different projects and reconnect are isolated', async t => {
  const s = await setup(t), record = records(s.root, s.directory)[0];
  const bad = new Bridge(s.repository, s.catalog, { directory: s.directory, identity: () => ({ ...record.identity, startTicks: '1000000000000000' }) });
  assert.equal((await bad.status()).connected, false);
  const other = fixture(); t.after(() => cleanup(other)); const different = new Bridge(new Repository(other), new Catalog(other), { directory: s.directory }); assert.equal((await different.status()).connected, false);
  await s.host.close(); assert.equal((await s.bridge.status()).connected, false);
  const second = await new BridgeHost(s.vscode, () => s.root, { directory: s.directory }).start(); t.after(() => second.close()); assert.equal((await s.bridge.status()).connected, true);
});
test('bridge native endpoint rejects browser origins, wrong tokens and arbitrary requests', async t => {
  const s = await setup(t), origin = 'http://127.0.0.1:' + s.host.port;
  assert.equal((await fetch(origin + '/health')).status, 403);
  const headers = { Authorization: 'Bearer ' + s.host.token, 'X-Studio-Bridge': '1' };
  assert.equal((await fetch(origin + '/health', { headers: { ...headers, Origin: origin } })).status, 403);
  assert.equal((await fetch(origin + '/command', { headers })).status, 404);
  assert.equal((await fetch(origin + '/open', { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'arbitrary' }) })).status, 409);
  assert.equal(s.vscode.opened.length, 0);
});
test('bridge browser API requires Session, Origin and CSRF and leaves History/Execution untouched', async t => {
  const s = await setup(t), files = ['manifest.json', 'summary.json'].map(name => [name, fs.readFileSync(path.join(s.run.folder, name))]);
  const app = await createService({ root: s.root, bridgeOptions: { directory: s.directory } }); t.after(() => app.close());
  assert.equal((await fetch(app.origin + '/api/bridge')).status, 401);
  const paired = await fetch(app.origin + '/api/session', { method: 'POST', headers: { Origin: app.origin, 'X-Studio-Request': '1', 'Content-Type': 'application/json' }, body: JSON.stringify({ code: app.pairingCode }) });
  const cookie = paired.headers.get('set-cookie').split(';')[0]; const session = await fetch(app.origin + '/api/session', { headers: { Cookie: cookie } }).then(r => r.json());
  const post = headers => fetch(app.origin + '/api/bridge/open', { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(s.input('A')) });
  assert.equal((await post({})).status, 403); assert.equal((await post({ Origin: app.origin, 'X-Studio-CSRF': 'invalid' })).status, 403);
  const success = await post({ Origin: app.origin, 'X-Studio-CSRF': session.csrf }); assert.equal(success.status, 200); assert.equal((await success.json()).line, 3);
  for (const [name, bytes] of files) assert.deepEqual(fs.readFileSync(path.join(s.run.folder, name)), bytes);
  assert.equal(app.execution.current, null); assert.equal(app.catalog.value.phase, 'idle');
  const dto = JSON.stringify(await app.bridge.status()); assert.ok(!dto.includes(s.host.token)); assert.ok(!dto.includes(s.root));
});
