const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { fixture, withRunner, cleanup } = require("./fixture.cjs");
const { RegressionManager } = require("../regression/manager.cjs");
const { History, snapshot, writeNew } = require("../regression/history.cjs");
const { acquireLock, Studio } = require("../studio.cjs");

function setup(t, source, config = {}) {
  const root = fixture(); withRunner(root);
  fs.writeFileSync(path.join(root, "playwright.config.cjs"), "module.exports = " + JSON.stringify({ testDir: "./TestCases", timeout: 15000, retries: 0, use: { channel: "chrome", screenshot: "only-on-failure", video: "off" }, ...config }));
  const folder = path.join(root, "TestCases", "پوشه [1] با فاصله"); fs.mkdirSync(folder);
  const filename = path.join(folder, "تست (A)+.spec.ts");
  fs.writeFileSync(filename, 'const { test, expect } = require("@playwright/test");\n' + source);
  const states = [];
  const manager = new RegressionManager({ root: () => root, node: () => process.execPath,
    state: value => states.push(value), confirmSnapshot: async () => true });
  t.after(async () => { await manager.stop(); cleanup(root); });
  return { root, folder, filename, manager, states, input: { scope: "folder", path: path.basename(folder), headed: false } };
}
async function until(predicate) {
  const end = Date.now() + 25000;
  while (!predicate()) { if (Date.now() > end) throw new Error("Timed out waiting for regression fixture"); await new Promise(resolve => setTimeout(resolve, 40)); }
}
function digest(folder) {
  const result = {};
  const walk = dir => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file); else result[path.relative(folder, file)] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  } };
  walk(folder); return result;
}

test("folder run, live results, independent artifacts, failed headed reruns and selected reruns never mutate parent", async t => {
  const { root, manager, states, input } = setup(t, `
test('passes', async ({ page }) => { await page.goto('data:text/html,<h1>ok</h1>'); await expect(page.locator('h1')).toHaveText('ok'); });
test('fails until allowed', async ({ page }, info) => {
  await page.goto('data:text/html,<h1>regression</h1>');
  await info.attach('diagnostic', { body: Buffer.from('local fixture'), contentType: 'text/plain' });
  expect(require('node:fs').existsSync(require('node:path').join(__dirname, '..', '..', 'allow-pass'))).toBe(true);
});
test.skip('skipped', async () => {});
`, { testDir: "./TestCases", timeout: 15000, retries: 0, use: { channel: "chrome", screenshot: "only-on-failure", video: "retain-on-failure" } });
  // A similarly named sibling must not be included by folder selection.
  fs.mkdirSync(path.join(root, "TestCases", input.path + "-other"));
  fs.writeFileSync(path.join(root, "TestCases", input.path + "-other", "other.spec.ts"), 'const {test}=require("@playwright/test");test("DECOY",()=>{throw new Error("DECOY_RAN")});');
  const result = await manager.run(input);
  assert.equal(result.summary.status, "failed", manager.state.log);
  assert.equal(result.summary.counts.passed, 1);
  assert.equal(result.summary.counts.failed, 1);
  assert.equal(result.summary.counts.skipped, 1);
  assert.equal(result.summary.report, true);
  assert.equal(result.summary.complete, true);
  assert.ok(states.some(state => state.progress?.completed > 0 && state.busy));
  assert.doesNotMatch(manager.state.log, /DECOY_RAN/);
  const store = new History(root), parent = store.directory(result.manifest.id), original = digest(parent);
  const failed = result.summary.tests.find(item => item.outcome === "failed");
  const attachments = failed.attempts[0].attachments;
  assert.ok(attachments.some(item => item.contentType === "image/png" && item.path));
  assert.ok(attachments.some(item => item.name === "trace" && item.path));
  assert.ok(attachments.some(item => item.contentType === "video/webm" && item.path));
  assert.ok(fs.existsSync(store.artifact(result.manifest.id, attachments.find(item => item.name === "diagnostic").path)));
  assert.throws(() => store.artifact(result.manifest.id, "../../../../package.json"));
  fs.writeFileSync(path.join(root, "allow-pass"), "yes");
  for (let attempt = 0; attempt < 2; attempt++) {
    const rerun = await manager.run({ scope: "failed", parentRunId: result.manifest.id, headed: true });
    assert.equal(rerun.summary.status, "passed", manager.state.log);
    assert.equal(rerun.manifest.tests.length, 1);
    assert.equal(rerun.manifest.headed, true);
    assert.equal(rerun.manifest.parentRunId, result.manifest.id);
    assert.deepEqual(digest(parent), original);
  }
  const selected = await manager.run({ scope: "selected", parentRunId: result.manifest.id, ids: [result.summary.tests[0].id], headed: false });
  assert.equal(selected.manifest.tests.length, 1);
  assert.equal(selected.summary.status, "passed");
  // Ordinary Playwright output cleanup cannot touch Studio's archive.
  fs.mkdirSync(path.join(root, "test-results"), { recursive: true });
  fs.writeFileSync(path.join(root, "test-results", "old.txt"), "old");
  const { execFileSync } = require("node:child_process");
  execFileSync(process.execPath, [manager.cli(root), "test", "--grep=^NEVER_MATCH$", "--pass-with-no-tests", "--reporter=line"], { cwd: root, windowsHide: true, stdio: "pipe" });
  assert.deepEqual(digest(parent), original);
  assert.equal(new History(root).list().length, 4);
  assert.equal(new History(root).detail(result.manifest.id).summary.counts.failed, 1);
});

test("default context isolation and user-created contexts keep their semantics", async t => {
  const { manager, input } = setup(t, `
test('sets storage', async ({ page, context }) => {
  await page.route('https://isolation.test/**', route => route.fulfill({body:'<h1>one</h1>',contentType:'text/html'}));
  await page.goto('https://isolation.test/');
  await context.addCookies([{ name:'leak', value:'bad', domain:'isolation.test', path:'/' }]);
  await page.evaluate(() => {localStorage.setItem('leak','bad');sessionStorage.setItem('leak','bad');});
});
test('gets clean context and isolated users', async ({ page, context, browser }) => {
  await page.route('https://isolation.test/**', route => route.fulfill({body:'<h1>two</h1>',contentType:'text/html'}));
  await page.goto('https://isolation.test/');
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => [localStorage.getItem('leak'),sessionStorage.getItem('leak')])).toEqual([null,null]);
  const other = await browser.newContext();
  await other.addCookies([{name:'other',value:'only-other-user',domain:'isolation.test',path:'/'}]);
  expect(await context.cookies()).toEqual([]); await other.close();
});`);
  const result = await manager.run(input);
  assert.equal(result.summary.status, "passed", manager.state.log);
  assert.equal(result.summary.counts.passed, 2);
});

test("stop preserves completed tests, distinguishes unstarted tests and releases shared recorder lock", async t => {
  const { root, manager, input } = setup(t, `
test('finished first', () => {});
test('long-running', async () => { console.log('STOP_READY'); await new Promise(() => {}); });
test('not reached', () => {});`);
  const operation = manager.run(input);
  await until(() => manager.state.log.includes("STOP_READY"));
  assert.throws(() => acquireLock(root), /Studio/);
  await assert.rejects(manager.run(input), /فعال/);
  const recorder = new Studio({ root: () => root, node: () => process.execPath, state() {} });
  await recorder.start({ name: "must-not-create", path: ".", user: "rahbar", device: "desktop", snapshot: false });
  assert.equal(recorder.state.phase, "error");
  assert.equal(fs.existsSync(path.join(root, "TestCases", "must-not-create.spec.ts")), false);
  await manager.stop();
  const result = await operation;
  assert.equal(result.summary.status, "interrupted");
  assert.equal(result.summary.counts.passed, 1);
  assert.equal(result.summary.counts.interrupted, 1);
  assert.equal(result.summary.counts.notRun, 1);
  const lock = acquireLock(root); lock.release();
});

test("Snapshot cancellation, invalid paths and missing historical tests never broaden selection", async t => {
  const { root, filename, manager, input } = setup(t, 'test("reset fixture", () => {}); // restoreSnapshot');
  manager.host.confirmSnapshot = async () => false;
  assert.equal(await manager.run(input), undefined);
  assert.equal(new History(root).list().length, 0);
  await assert.rejects(manager.run({ ...input, path: "../" }), /TestCases/);
  manager.host.confirmSnapshot = async () => true;
  const first = await manager.run(input);
  assert.equal(first.summary.status, "passed");
  fs.writeFileSync(filename, 'const {test}=require("@playwright/test");test("renamed",()=>{});');
  await assert.rejects(manager.run({ scope: "selected", parentRunId: first.manifest.id, ids: [first.manifest.tests[0].id], headed: false }), /تغییرنام/);
  assert.equal(new History(root).list().length, 1);
});

test("exact plan validation aborts Test List prefix ambiguity before test bodies", async t => {
  const { root, manager, input } = setup(t, `
test('name',()=>{});
test.describe('name',()=>{test('nested',()=>{require('node:fs').writeFileSync(require('node:path').join(__dirname,'..','..','BAD_EXECUTION'),'bad');});});`);
  const first = await manager.run(input);
  assert.equal(first.summary.status, "passed");
  fs.unlinkSync(path.join(root, "BAD_EXECUTION"));
  const result = await manager.run({ scope: "selected", parentRunId: first.manifest.id, ids: [first.manifest.tests.find(test => test.title === "name").id], headed: false });
  assert.equal(result.summary.status, "error");
  assert.equal(result.summary.counts.passed, 0);
  assert.equal(fs.existsSync(path.join(root, "BAD_EXECUTION")), false);
});

test("file/suite selection, expected failures and recovered partial journals", async t => {
  const { root, filename, manager } = setup(t, 'test.fail("expected failure",()=>{expect(1).toBe(2)});test("normal",()=>{});');
  const result = await manager.run({ scope: "file", path: path.relative(path.join(root, "TestCases"), filename), headed: false });
  assert.equal(result.summary.status, "passed", manager.state.log);
  assert.equal(result.summary.counts.passed, 2);
  const suite = await manager.run({ scope: "suite", headed: false });
  assert.equal(suite.manifest.tests.length, 2);
  const chosen = await manager.run({ scope: "selection", ids: [suite.manifest.tests[0].id], headed: false });
  assert.equal(chosen.manifest.tests.length, 1);
  assert.equal(chosen.summary.counts.passed, 1);
  const store = new History(root);
  const abandoned = store.create({ owner: 99999999, scope: "suite", tests: result.manifest.tests });
  fs.writeFileSync(path.join(abandoned.folder, "events.ndjson"), JSON.stringify({ type: "testEnd", testId: result.manifest.tests[0].id,
    expectedStatus: "failed", result: { status: "failed", duration: 1, retry: 0, attachments: [], errors: [] } }) + '\n' +
    JSON.stringify({ type: "testBegin", testId: result.manifest.tests[1].id }) + '\n{"partial');
  assert.equal(store.detail(abandoned.manifest.id).summary.status, "interrupted");
  assert.equal(store.detail(abandoned.manifest.id).summary.counts.passed, 1);
  assert.equal(store.detail(abandoned.manifest.id).summary.tests[1].outcome, "interrupted");
  assert.equal(store.detail(abandoned.manifest.id).summary.counts.running, 0);
  assert.equal(snapshot(abandoned.folder, abandoned.manifest).damaged, true);
  assert.throws(() => writeNew(path.join(abandoned.folder, "manifest.json"), {}), /EEXIST/);
});
