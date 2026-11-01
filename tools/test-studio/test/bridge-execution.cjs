const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { fixture, withRunner, cleanup } = require('./fixture.cjs');
const { History, hashFile } = require('../regression/history.cjs');
const { createService } = require('../service/server.cjs');
const { BridgeHost } = require('../bridge/host.cjs');
async function until(fn) { const end = Date.now() + 60000; while (!fn()) { if (Date.now() > end) throw Error('Synthetic operation timeout'); await new Promise(r => setTimeout(r, 50)); } }
(async () => {
  const root = fixture(); withRunner(root);
  fs.writeFileSync(path.join(root, 'playwright.config.cjs'), "module.exports={testDir:'./TestCases',timeout:30000,retries:0};");
  const source = path.join(root, 'TestCases', 'owned.spec.ts');
  fs.writeFileSync(source, "const {test}=require('@playwright/test');\ntest('synthetic owned execution',async()=>{console.log('BRIDGE_RUN_READY');await new Promise(r=>setTimeout(r,7000));});\n");
  const history = new History(root), old = history.create({ scope: 'fixture', tests: [{ id: 'seed', title: 'old synthetic result', file: source, line: 2, column: 1, sourceHash: hashFile(source) }] });
  history.finalize(old, { complete: true, status: 'passed', tests: [{ id: 'seed', outcome: 'passed', attempts: [] }] });
  const original = fs.readFileSync(path.join(old.folder, 'summary.json')), directory = path.join(root, 'bridges'), opened = [];
  const vscode = { workspace: { name: 'Execution fixture', openTextDocument: async uri => ({ uri, isDirty: false, getText: () => fs.readFileSync(uri.fsPath, 'utf8') }) }, Uri: { file: fsPath => ({ fsPath }) }, Range: class {}, TabInputText: class {}, ViewColumn: { Active: -1 }, TextEditorRevealType: { InCenterIfOutsideViewport: 2 }, window: { visibleTextEditors: [], tabGroups: { all: [] }, async showTextDocument(document) { opened.push(document.uri.fsPath); return { revealRange() {} }; } } };
  const host = await new BridgeHost(vscode, () => root, { directory }).start(); let app;
  try {
    app = await createService({ root, bridgeOptions: { directory } });
    const paired = await fetch(app.origin + '/api/session', { method: 'POST', headers: { Origin: app.origin, 'X-Studio-Request': '1', 'Content-Type': 'application/json' }, body: JSON.stringify({ code: app.pairingCode }) });
    const cookie = paired.headers.get('set-cookie').split(';')[0];
    const get = route => fetch(app.origin + route, { headers: { Cookie: cookie } }).then(r => r.json());
    const session = await get('/api/session');
    const post = (route, body) => fetch(app.origin + route, { method: 'POST', headers: { Cookie: cookie, Origin: app.origin, 'Content-Type': 'application/json', 'X-Studio-CSRF': session.csrf }, body: JSON.stringify(body) });
    app.catalog.start({}); await app.catalog.pending; const catalog = app.catalog.get(); assert.equal(catalog.phase, 'ready', catalog.error);
    assert.equal((await post('/api/execution/start', { scope: 'test', requestId: crypto.randomUUID(), catalogRevision: catalog.catalogRevision, ids: [catalog.tests[0].id], headed: false })).status, 202);
    for (const kind of ['execution', 'snapshot']) { await until(() => app.execution.current.phase === 'Awaiting Confirmation'); const op = await get('/api/execution'); assert.equal(op.confirmation.kind, kind); assert.equal((await post('/api/execution/confirm', { operationId: op.id, token: op.confirmation.token, confirm: true })).status, 200); }
    await until(() => app.execution.current.manager?.state.log.includes('BRIDGE_RUN_READY'));
    const operation = app.execution.current, id = operation.id;
    assert.equal((await post('/api/bridge/open', { windowId: host.windowId, selection: { kind: 'history', runId: old.manifest.id, testId: 'seed' } })).status, 200);
    assert.equal(app.execution.current.id, id); assert.equal(app.execution.current.busy, true); assert.deepEqual(opened, [source]);
    assert.throws(() => require('../studio.cjs').acquireLock(root), /Studio/);
    await operation.pending; assert.equal(operation.phase, 'Completed', JSON.stringify(operation.error));
    assert.equal(app.repository.raw(operation.runId).summary.counts.passed, 1);
    assert.equal(history.list().length, 2); assert.deepEqual(fs.readFileSync(path.join(old.folder, 'summary.json')), original);
    console.log(JSON.stringify({ passed: true, checks: ['source open during real controlled synthetic execution', 'same operation and execution lock preserved', 'owned run completes with one pass', 'original history unchanged', 'no real business test'] }));
  } finally { await app?.close(); await host.close(); cleanup(root); }
})().catch(error => { console.error(error); process.exitCode = 1; });
