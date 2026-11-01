const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { spawn } = require("node:child_process");
const { createService } = require("../service/server.cjs");
const { Trash, fingerprint: treeFingerprint, maintenanceLock } = require("../service/trash.cjs");
const { acquireLock } = require("../studio.cjs");
const { fixture, cleanup, fingerprint } = require("./standalone-fixture.cjs");
async function setup(t, trashOptions) {
  const f = fixture(), app = await createService({ root: f.root, trashOptions });
  t.after(async () => { await app.close(); cleanup(f.root); });
  async function login() {
    const response = await fetch(app.origin + "/api/session", { method: "POST", headers: { Origin: app.origin, "Content-Type": "application/json", "X-Studio-Request": "1" }, body: JSON.stringify({ code: app.pairingCode }) });
    const cookie = response.headers.get("set-cookie").split(";")[0];
    const session = await fetch(app.origin + "/api/session", { headers: { Cookie: cookie } }).then(r => r.json());
    return { cookie, csrf: session.csrf };
  }
  const session = await login();
  const get = route => fetch(app.origin + route, { headers: { Cookie: session.cookie } });
  const post = (route, body, headers = {}) => fetch(app.origin + route, { method: "POST", headers: { Cookie: session.cookie, Origin: app.origin, "Content-Type": "application/json", "X-Studio-CSRF": session.csrf, ...headers }, body: JSON.stringify(body) });
  const plan = async ids => { const r = await post("/api/history/plan", { mode: "selected", ids }); assert.equal(r.status, 200); return r.json(); };
  const confirm = value => post("/api/history/confirm", { planId: value.planId, confirm: true });
  return { ...f, app, session, login, get, post, plan, confirm };
}
test("single delete is a reversible byte-preserving move; Source and parent Run stay intact", async t => {
  const f = await setup(t), id = f.failed.manifest.id, before = treeFingerprint(f.failed.folder), source = fs.readFileSync(f.source);
  const untouched = treeFingerprint(f.runs[1].folder);
  const plan = await f.plan([id]); assert.equal(plan.count, 1);
  const moved = await f.confirm(plan); assert.equal(moved.status, 200); assert.deepEqual((await moved.json()).moved, [id]);
  assert.equal((await f.get("/api/runs").then(r => r.json())).runs.length, 12);
  assert.equal(fs.existsSync(f.failed.folder), false);
  const trash = (await f.get("/api/history/trash").then(r => r.json())).items[0]; assert.equal(trash.restorable, true);
  const payload = f.app.trash.entry(trash.id).payload; assert.equal(treeFingerprint(payload), before);
  const restore = await f.post("/api/history/restore-plan", { trashId: trash.id }).then(r => r.json());
  assert.equal((await f.confirm(restore)).status, 200); assert.equal(treeFingerprint(f.failed.folder), before);
  assert.deepEqual(fs.readFileSync(f.source), source); assert.equal(treeFingerprint(f.runs[1].folder), untouched);
});
test("plan/cancel changes no file; duplicate and expired confirmations never repeat a move", async t => {
  const f = await setup(t, { ttl: 150 }), before = fingerprint(f.root), plan = await f.plan([f.failed.manifest.id]);
  assert.deepEqual(fingerprint(f.root), before); assert.equal(fs.existsSync(f.app.trash.base), false);
  await new Promise(resolve => setTimeout(resolve, 180)); assert.equal((await f.confirm(plan)).status, 409);
  assert.deepEqual(fingerprint(f.root), before);
  const fresh = await f.plan([f.failed.manifest.id]); assert.equal((await f.confirm(fresh)).status, 200); assert.equal((await f.confirm(fresh)).status, 409);
});
test("Clear snapshots finalized runs only; incomplete and newly created runs survive", async t => {
  const f = await setup(t), incomplete = treeFingerprint(f.incomplete.folder);
  const response = await f.post("/api/history/plan", { mode: "clear" }), plan = await response.json();
  assert.equal(plan.count, 12); assert.equal(plan.blocked.length, 1);
  const newer = f.history.create({ scope: "file", tests: [] }); f.history.finalize(newer, { status: "passed", complete: true });
  const result = await f.confirm(plan).then(r => r.json()); assert.equal(result.moved.length, 12);
  const remaining = await f.get("/api/runs").then(r => r.json()); assert.equal(remaining.runs.length, 2);
  assert.equal(treeFingerprint(f.incomplete.folder), incomplete); assert.ok(fs.existsSync(newer.folder));
});
test("active or unknown-owner run cannot be trashed even with an explicit selected ID", async t => {
  const f = await setup(t), before = fingerprint(f.root), plan = await f.plan([f.incomplete.manifest.id]);
  assert.equal(plan.count, 0); assert.equal(plan.blocked.length, 1); assert.equal((await f.confirm(plan)).status, 409);
  assert.deepEqual(fingerprint(f.root), before);
});
test("authorization, CSRF, Origin, exact IDs and cross-session plan binding fail closed", async t => {
  const f = await setup(t), before = fingerprint(f.root), input = { mode: "selected", ids: [f.failed.manifest.id] };
  assert.equal((await fetch(f.app.origin + "/api/history/plan", { method: "POST" })).status, 401);
  for (const headers of [{ "X-Studio-CSRF": "" }, { "X-Studio-CSRF": "wrong" }, { Origin: "null" }, { Origin: "https://evil.example" }]) assert.equal((await f.post("/api/history/plan", input, headers)).status, 403);
  for (const invalid of [{ mode: "selected", ids: ["../../TestCases"] }, { mode: "selected", ids: [f.failed.manifest.id, f.failed.manifest.id] }, { mode: "clear", ids: [f.source] }, { ...input, path: f.source }, { mode: "selected", ids: ["20261001T000000000Z-00000000-0000-0000-0000-000000000000"] }]) assert.equal((await f.post("/api/history/plan", invalid)).status, 400);
  assert.equal((await f.post("/api/history/restore-plan", { trashId: "00000000-0000-0000-0000-000000000000" })).status, 404);
  const plan = await f.plan(input.ids), other = await f.login();
  assert.equal((await f.post("/api/history/confirm", { planId: plan.planId, confirm: true }, { Cookie: other.cookie, "X-Studio-CSRF": other.csrf })).status, 409);
  assert.equal((await f.post("/api/history/confirm", { planId: plan.planId, confirm: false })).status, 400);
  assert.deepEqual(fingerprint(f.root), before);
});
test("shared Studio lock excludes maintenance and maintenance excludes the old Extension lock", async t => {
  const f = await setup(t), before = fingerprint(f.root), plan = await f.plan([f.failed.manifest.id]);
  const lock = acquireLock(f.root);
  try { assert.equal((await f.confirm(plan)).status, 409); assert.deepEqual(fingerprint(f.root), before); } finally { lock.release(); }
  const release = maintenanceLock(f.root); try { assert.throws(() => acquireLock(f.root), /Studio/); } finally { release(); }
});
test("all-batch revalidation blocks stale plans before moving even the first item", async t => {
  const f = await setup(t), plan = await f.plan([f.failed.manifest.id, f.runs[1].manifest.id]);
  fs.appendFileSync(path.join(f.runs[1].folder, "attachments", "note.txt"), "changed");
  const before = fingerprint(f.root); assert.equal((await f.confirm(plan)).status, 409); assert.deepEqual(fingerprint(f.root), before);
});
test("junction archive payloads are blocked; source/project files never become delete targets", async t => {
  const f = await setup(t), target = path.join(f.failed.folder, "link-to-source");
  fs.symlinkSync(path.join(f.root, "TestCases"), target, process.platform === "win32" ? "junction" : "dir");
  const before = fingerprint(f.root), plan = await f.plan([f.failed.manifest.id]); assert.equal(plan.count, 0);
  assert.equal((await f.confirm(plan)).status, 409); assert.deepEqual(fingerprint(f.root), before);
});
test("race just before rename fails without copy/delete fallback or source damage", async t => {
  const f = await setup(t, { beforeMove: ({ from }) => fs.writeFileSync(path.join(from, "raced.txt"), "external change") });
  const source = fs.readFileSync(f.source), result = await f.confirm(await f.plan([f.failed.manifest.id])).then(r => r.json());
  assert.equal(result.moved.length, 0); assert.equal(result.failures.length, 1); assert.ok(fs.existsSync(f.failed.folder)); assert.deepEqual(fs.readFileSync(f.source), source);
});
test("post-move verification failure keeps recoverable quarantine and never automatically overwrites", async t => {
  const f = await setup(t, { afterMove: ({ to }) => fs.writeFileSync(path.join(to, "raced.txt"), "external change") });
  const result = await f.confirm(await f.plan([f.failed.manifest.id])).then(r => r.json()); assert.equal(result.moved.length, 0); assert.equal(result.failures.length, 1);
  const entry = (await f.get("/api/history/trash").then(r => r.json())).items[0]; assert.equal(entry.state, "unverified"); assert.equal(entry.restorable, false);
  assert.ok(fs.existsSync(f.app.trash.entry(entry.id).payload));
  assert.equal((await f.post("/api/history/restore-plan", { trashId: entry.id })).status, 409);
});
test("restore refuses a colliding destination", async t => {
  const f = await setup(t), id = f.failed.manifest.id;
  await f.confirm(await f.plan([id])); const entry = (await f.get("/api/history/trash").then(r => r.json())).items[0];
  fs.mkdirSync(f.failed.folder); fs.writeFileSync(path.join(f.failed.folder, "personal.txt"), "do not overwrite");
  assert.equal((await f.post("/api/history/restore-plan", { trashId: entry.id })).status, 409); assert.equal(fs.readFileSync(path.join(f.failed.folder, "personal.txt"), "utf8"), "do not overwrite");
});
test("junction Trash containers and stale restore destinations cannot overwrite user files", async t => {
  const f = await setup(t), plan = await f.plan([f.failed.manifest.id]);
  fs.symlinkSync(path.join(f.root, "TestCases"), f.app.trash.base, process.platform === "win32" ? "junction" : "dir");
  const source = fs.readFileSync(f.source), result = await f.confirm(plan).then(r => r.json());
  assert.equal(result.moved.length, 0); assert.ok(fs.existsSync(f.failed.folder)); assert.deepEqual(fs.readFileSync(f.source), source);
  assert.equal((await f.get("/api/history/trash")).status, 409);
  fs.unlinkSync(f.app.trash.base);
  await f.confirm(await f.plan([f.failed.manifest.id])); const item = (await f.get("/api/history/trash").then(r => r.json())).items[0];
  const restore = await f.post("/api/history/restore-plan", { trashId: item.id }).then(r => r.json());
  fs.mkdirSync(f.failed.folder); fs.writeFileSync(path.join(f.failed.folder, "new-file.txt"), "preserve");
  assert.equal((await f.confirm(restore)).status, 409); assert.equal(fs.readFileSync(path.join(f.failed.folder, "new-file.txt"), "utf8"), "preserve");
});
test("a separate legacy Studio process holding its lock blocks deletion", async t => {
  const f = await setup(t), plan = await f.plan([f.failed.manifest.id]);
  const script = `const {acquireLock}=require(${JSON.stringify(path.resolve(__dirname, "../studio.cjs"))});const lock=acquireLock(process.argv[1]);process.send('ready');process.once('message',()=>{lock.release();process.disconnect();});`;
  const child = spawn(process.execPath, ["-e", script, f.root], { windowsHide: true, stdio: ["ignore", "ignore", "pipe", "ipc"] }); child.stderr.resume();
  const closed = new Promise(resolve => child.once("close", resolve));
  try {
    await new Promise((resolve, reject) => { const timer = setTimeout(() => reject(new Error("Fixture lock owner did not become ready")), 10000); child.once("message", () => { clearTimeout(timer); resolve(); }); child.once("error", reject); });
    const before = fingerprint(f.root); assert.equal((await f.confirm(plan)).status, 409); assert.deepEqual(fingerprint(f.root), before);
  } finally { if (child.connected) child.send("release"); await closed; }
});
test("corrupt/unknown execution lock is preserved, not recovered for deletion", async t => {
  const f = await setup(t), plan = await f.plan([f.failed.manifest.id]);
  const real = fs.realpathSync(f.root), key = crypto.createHash("sha256").update(process.platform === "win32" ? real.toLowerCase() : real).digest("hex").slice(0, 24);
  const filename = path.join(os.tmpdir(), "playwright-test-studio-" + key + ".lock");
  fs.writeFileSync(filename, "unknown owner", { flag: "wx" });
  try { assert.equal((await f.confirm(plan)).status, 409); assert.equal(fs.readFileSync(filename, "utf8"), "unknown owner"); assert.ok(fs.existsSync(f.failed.folder)); }
  finally { fs.unlinkSync(filename); } // Only this test's explicitly created, unique temporary lock.
});
