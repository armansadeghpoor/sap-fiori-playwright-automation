const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { fixture, cleanup, fingerprint } = require('./standalone-fixture.cjs');
const { createService } = require('../service/server.cjs');
const { BridgeHost } = require('../bridge/host.cjs');
function mock() {
  const opened = [];
  return { opened, workspace: { name: 'Browser Fixture', openTextDocument: async uri => ({ uri, isDirty: false, getText: () => fs.readFileSync(uri.fsPath, 'utf8') }) },
    Uri: { file: fsPath => ({ fsPath }) }, Range: class { constructor(line) { this.start = { line }; } }, ViewColumn: { Active: -1 }, TextEditorRevealType: { InCenterIfOutsideViewport: 2 }, TabInputText: class {},
    window: { visibleTextEditors: [], tabGroups: { all: [] }, async showTextDocument(document, options) { opened.push({ file: document.uri.fsPath, line: options.selection.start.line + 1 }); return { revealRange() {} }; } } };
}
(async () => {
  const data = fixture(), { root, failed } = data, directory = path.join(root, 'bridges'), first = mock(), second = mock();
  const archiveBefore = fingerprint(path.join(root, '.playwright-studio'));
  const host = await new BridgeHost(first, () => root, { directory }).start(); let other, browser, app;
  try {
    app = await createService({ root, bridgeOptions: { directory }, catalogOptions: { discover: async () => ({ rootDir: root, tests: failed.manifest.tests }) } });
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const context = await browser.newContext(), page = await context.newPage(), faults = []; page.on('pageerror', e => faults.push(e.message));
    await page.goto(app.origin); await page.locator('#code').fill(app.pairingCode); await page.locator('#login button').click();
    await page.waitForFunction(() => document.getElementById('bridge-status').dataset.state === 'connected');
    await page.locator(`[data-run-id="${failed.manifest.id}"]`).click(); await page.locator('#test-detail').waitFor({ state: 'visible' });
    await page.locator('[data-test-id="A"]').click(); await page.locator('#open-vscode').click(); await page.waitForFunction(() => document.getElementById('bridge-result').textContent.includes('خط 3'));
    for (const [id, line] of [['B', 2], ['C', 3]]) {
      await page.locator(`[data-test-id="${id}"]`).click(); await page.locator('#open-vscode').click(); await page.waitForFunction(line => document.getElementById('bridge-result').textContent.includes('خط ' + line), line);
      assert.equal(first.opened.at(-1).line, line);
    }
    await page.locator('#discover').click(); await page.waitForFunction(() => document.getElementById('explorer-status').textContent.includes('آماده'));
    await page.locator('#explorer-all').click();
    await page.locator('#explorer-search').fill('scenario B');
    // Filtering expands matching descendants; no test execution occurs.
    await page.locator('[data-open-test-id="B"]').waitFor();
    await page.locator('[data-open-test-id="B"]').click();
    await page.waitForFunction(() => document.getElementById('bridge-result').textContent.includes('خط 2'));
    assert.equal(await page.locator('#explorer-search').inputValue(), 'scenario B'); assert.match(await page.locator('#explorer-selected').innerText(), /3/);
    assert.equal(await page.locator('#run-id').innerText(), failed.manifest.id); assert.equal(await page.locator('[data-test-id="C"]').getAttribute('aria-pressed'), 'true');
    other = await new BridgeHost(second, () => root, { directory }).start();
    const chooser = await context.newPage(); chooser.on('pageerror', e => faults.push(e.message)); await chooser.goto(app.origin);
    await chooser.waitForFunction(() => document.getElementById('bridge-window').options.length === 3); assert.equal(await chooser.locator('#bridge-window').inputValue(), '');
    await chooser.locator(`[data-run-id="${failed.manifest.id}"]`).click(); await chooser.locator('[data-test-id="B"]').click();
    await chooser.locator('#open-vscode').click(); await chooser.waitForFunction(() => document.getElementById('bridge-result').textContent.includes('چند پنجره'));
    const count = first.opened.length; await chooser.locator('#bridge-window').selectOption(other.windowId); await chooser.locator('#open-vscode').click();
    await chooser.waitForFunction(() => document.getElementById('bridge-result').textContent.includes('خط 2')); assert.equal(first.opened.length, count); assert.equal(second.opened.at(-1).line, 2);
    await other.close(); await chooser.locator('#bridge-refresh').click(); await chooser.waitForFunction(() => document.getElementById('bridge-window').selectedOptions[0].textContent.includes('قطع'));
    await chooser.locator('#open-vscode').click(); await chooser.waitForFunction(() => document.getElementById('bridge-result').textContent.includes('متصل نیست')); assert.equal(first.opened.length, count);
    await chooser.locator('#bridge-window').selectOption(host.windowId); await chooser.locator('#open-vscode').click(); await chooser.waitForFunction(() => document.getElementById('bridge-result').textContent.includes('خط 2'));
    for (const width of [390, 1600]) { await page.setViewportSize({ width, height: 1000 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, 'Bridge responsive width ' + width); }
    assert.deepEqual(fingerprint(path.join(root, '.playwright-studio')), archiveBefore); assert.equal(app.execution.current, null); assert.deepEqual(faults, []);
    console.log(JSON.stringify({ passed: true, checks: ['history failed/passed/skipped source actions', 'Explorer source action', 'History/Explorer selection retained', 'bridge connection status', 'two-window explicit chooser', 'disconnected choice never silently switches', 'responsive layout', 'Source Preview remains independent', 'no Run / archive changes'] }));
  } finally { await browser?.close(); await app?.close(); await host.close(); await other?.close(); cleanup(root); }
})().catch(error => { console.error(error); process.exitCode = 1; });
