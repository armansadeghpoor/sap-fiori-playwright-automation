const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { Studio, runJson, generatorArgs, acquireLock, relativeFolder, validateRunTarget } = require("../studio.cjs");
const { fixture, cleanup, withRunner } = require("./fixture.cjs");
const basic = { name: "بررسی فارسی English", path: "پوشه با فاصله/جدید", user: "rahbar", device: "desktop", snapshot: false };
function setup(t, confirmed = true) {
  const root = fixture();
  const events = [];
  const studio = new Studio({ root: () => root, node: () => process.execPath,
    state: state => events.push({ ...state }),
    confirmSnapshot: async filename => { events.push({ confirm: filename }); return confirmed; },
    prepareRun: async (filename, snapshot) => { events.push({ run: filename, snapshot }); return confirmed; },
    open: async filename => { assert.ok(fs.existsSync(filename)); events.push({ open: filename }); },
  });
  t.after(async () => { await studio.stop(); cleanup(root); });
  return { root, studio, events };
}
async function until(predicate) {
  const deadline = Date.now() + 10000;
  while (!predicate()) {
    if (Date.now() > deadline) throw new Error("Timed out waiting for Recorder fixture");
    await new Promise(resolve => setTimeout(resolve, 30));
  }
}

test("preview shares Generator validation, supports Persian, and writes nothing", async t => {
  const { root, studio } = setup(t);
  const plan = await studio.preview(basic);
  assert.equal(plan.specPath, path.join(root, "TestCases", basic.path, basic.name + ".spec.ts"));
  assert.deepEqual(fs.readdirSync(path.join(root, "TestCases")), []);
  for (const invalid of ["D:\\absolute", "../outside", "CON", "bad:folder"]) {
    await assert.rejects(studio.preview({ ...basic, path: invalid }));
  }
  for (const patch of [{ user: "unknown" }, { device: "bad" }, { name: "" }]) {
    await assert.rejects(studio.preview({ ...basic, ...patch }));
  }
});

test("real runner selects only the exact Persian filename with regex characters; pass and fail", async t => {
  const { root, studio } = setup(t);
  withRunner(root);
  await studio.start({ ...basic, name: "تست [1]+(A)$" });
  const filename = studio.state.specPath;
  const prelude = 'const { test, expect } = require("@playwright/test");\n';
  fs.writeFileSync(filename, prelude + 'test("only this file", () => { expect(2).toBe(2); });');
  fs.writeFileSync(filename.replace(".spec.ts", "-other.spec.ts"), prelude + 'test("must not run", () => { throw new Error("DECOY_RAN"); });');
  await studio.runTest();
  assert.equal(studio.state.phase, "run-complete", studio.state.message + studio.state.log);
  assert.match(studio.state.log, /1 passed/);
  assert.doesNotMatch(studio.state.log, /DECOY_RAN/);
  const firstOutput = studio.state.outputDir;
  assert.ok(fs.existsSync(firstOutput));
  fs.writeFileSync(filename, prelude + 'test("failure result", () => { expect(2).toBe(3); });');
  await studio.runTest();
  assert.equal(studio.state.phase, "failed");
  assert.match(studio.state.log, /1 failed/);
  assert.equal(studio.busy, false);
  assert.notEqual(studio.state.outputDir, firstOutput);
  assert.ok(fs.existsSync(firstOutput), "previous results preserved");
  assert.equal(studio.state.specPath, filename);
});

test("run confirmation cancellation preserves file, last target survives restart, missing target is rejected", async t => {
  const { root, studio, events } = setup(t);
  let saved;
  studio.host.rememberTarget = target => { saved = target; };
  await studio.start({ ...basic, snapshot: true });
  const filename = studio.state.specPath;
  const before = fs.readFileSync(filename, "utf8");
  const restored = new Studio({ ...studio.host, savedTarget: saved, prepareRun: async (file, snapshot) => {
    assert.equal(file, filename); assert.equal(snapshot, true); return false;
  } });
  await restored.runTest();
  assert.equal(restored.state.phase, "cancelled");
  assert.equal(restored.child, null);
  assert.equal(fs.readFileSync(filename, "utf8"), before);
  assert.equal(fs.existsSync(path.join(root, "test-results")), false);
  fs.renameSync(filename, filename + ".moved");
  await studio.runTest();
  assert.equal(studio.state.phase, "error");
  assert.equal(events.filter(event => event.run).length, 0);
  assert.throws(() => validateRunTarget(root, { root, specPath: path.join(root, "outside.spec.ts") }));
  const lock = acquireLock(root); lock.release();
});

test("running excludes duplicate runs and recording; stop terminates real runner and releases lock", async t => {
  const { root, studio, events } = setup(t);
  withRunner(root);
  await studio.start(basic);
  fs.writeFileSync(studio.state.specPath, 'const { test } = require("@playwright/test"); test("long run", async () => { console.log("RUN_READY"); await new Promise(() => {}); });');
  const operation = studio.runTest();
  await studio.runTest();
  await studio.start({ ...basic, name: "must not create" });
  await until(() => studio.state.log.includes("RUN_READY"));
  assert.equal(events.filter(event => event.run).length, 1);
  assert.equal(events.filter(event => event.open).length, 1);
  assert.throws(() => acquireLock(root), /Studio/);
  await studio.stop();
  await operation;
  assert.equal(studio.state.phase, "cancelled");
  assert.equal(studio.busy, false);
  const lock = acquireLock(root); lock.release();
});

test("folder picker accepts Persian destinations and rejects outside folders and junctions", t => {
  const { root } = setup(t);
  const testRoot = path.join(root, "TestCases");
  const folder = path.join(testRoot, "پوشه با فاصله", "Nested");
  const outside = path.join(root, "TestCases-other");
  fs.mkdirSync(folder, { recursive: true });
  fs.mkdirSync(outside);
  assert.equal(relativeFolder(root, testRoot), "");
  assert.equal(relativeFolder(root, folder), "پوشه با فاصله/Nested");
  assert.throws(() => relativeFolder(root, outside), /TestCases/);
  assert.throws(() => relativeFolder(root, root), /TestCases/);
  const alias = path.join(testRoot, "escape");
  fs.symlinkSync(outside, alias, process.platform === "win32" ? "junction" : "dir");
  assert.throws(() => relativeFolder(root, alias), /TestCases/);
  fs.unlinkSync(alias);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test("create opens exact spec, runs matching recorder, and prevents overwrite", async t => {
  const { studio, events } = setup(t);
  await studio.start({ ...basic, device: "pixel-7", user: "kartable" });
  assert.equal(studio.state.phase, "done");
  const spec = studio.state.specPath;
  const contents = fs.readFileSync(spec, "utf8");
  assert.match(contents, /users.kartable/);
  assert.match(contents, /recordingDevices\["pixel-7"\]/);
  assert.doesNotMatch(contents, /restoreSnapshot/);
  assert.match(studio.state.log, /--device=pixel-7/);
  assert.equal(events.filter(event => event.open).length, 1);
  await studio.start(basic);
  assert.equal(studio.state.phase, "error");
  assert.equal(fs.readFileSync(spec, "utf8"), contents);
});

test("Snapshot cancellation creates no directories and launches nothing", async t => {
  const { root, studio, events } = setup(t, false);
  await studio.start({ ...basic, snapshot: true });
  assert.equal(events.filter(event => event.confirm).length, 1);
  assert.equal(events.filter(event => event.open).length, 0);
  assert.deepEqual(fs.readdirSync(path.join(root, "TestCases")), []);
  assert.equal(studio.state.log, "");
});

test("Snapshot consent precedes creation and is passed to generator and recorder", async t => {
  const { studio, events } = setup(t);
  await studio.start({ ...basic, snapshot: true, device: "iphone-15-pro-max" });
  assert.equal(studio.state.phase, "done");
  assert.ok(events.findIndex(event => event.confirm) < events.findIndex(event => event.open));
  assert.match(fs.readFileSync(studio.state.specPath, "utf8"), /await restoreSnapshot\(request\)/);
  assert.match(studio.state.log, /--snapshot/);
});

test("double submission and another window cannot overlap; stop kills descendants", async t => {
  const { root, studio, events } = setup(t);
  const operation = studio.start({ ...basic, user: "user1" });
  await studio.start({ ...basic, name: "duplicate" });
  await until(() => studio.state.log.includes("descendant="));
  assert.throws(() => acquireLock(root), /Studio/);
  assert.equal(events.filter(event => event.open).length, 1);
  const pid = Number(studio.state.log.match(/descendant=(\d+)/u)[1]);
  await studio.stop();
  await operation;
  assert.equal(studio.busy, false);
  assert.throws(() => process.kill(pid, 0));
  const released = acquireLock(root); released.release();
});

test("recorder failure retains spec and readable diagnostic; form unlocks", async t => {
  const { studio } = setup(t);
  await studio.start({ ...basic, user: "user2" });
  assert.equal(studio.state.phase, "error");
  assert.match(studio.state.log, /authentication unavailable/);
  assert.ok(fs.existsSync(studio.state.specPath));
  assert.equal(studio.busy, false);
});

test("CLI JSON creation, unsafe mode and literal shell characters", async t => {
  const { root } = setup(t);
  const form = { ...basic, name: "نام & literal $() ' test", path: "." };
  const args = generatorArgs(root, form, false);
  const result = await runJson(process.execPath, args, root);
  assert.ok(fs.existsSync(result.specPath));
  await assert.rejects(runJson(process.execPath,
    generatorArgs(root, { ...basic, name: "must not create" }, false).filter(arg => arg !== "--no-record"), root));
  assert.equal(fs.existsSync(path.join(root, "TestCases", basic.path, "must not create.spec.ts")), false);
});
