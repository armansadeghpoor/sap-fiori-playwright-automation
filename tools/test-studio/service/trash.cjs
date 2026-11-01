// Recoverable moves only. Never recursively delete, copy across volumes, or follow links.
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { within } = require("../regression/history.cjs");
const { fail, deletionPolicy } = require("./repository.cjs");
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u;
const runId = /^\d{8}T\d{9}Z-[0-9a-f-]{36}$/u;
const exists = file => { try { fs.lstatSync(file); return true; } catch (error) { if (error.code === "ENOENT") return false; throw error; } };
const projectKey = root => crypto.createHash("sha256").update(process.platform === "win32" ? root.toLowerCase() : root).digest("hex").slice(0, 24);
function maintenanceLock(root) {
  // Same on-disk protocol as studio.cjs/acquireLock. Unlike execution recovery,
  // maintenance fails closed on ANY existing lock, including unknown/dead owners.
  const filename = path.join(os.tmpdir(), "playwright-test-studio-" + projectKey(fs.realpathSync(root)) + ".lock");
  let fd;
  try { fd = fs.openSync(filename, "wx", 0o600); } catch (error) { if (error.code === "EEXIST") throw fail(409, "قفل Studio موجود است؛ اجرا/Recorder فعال یا مالکیت نامشخص است. هیچ قفلی حذف نشد."); throw error; }
  const token = crypto.randomUUID();
  const guard=filename+'.recovery';
  try{const guardFd=fs.openSync(guard,'wx',0o600);try{fs.writeSync(guardFd,JSON.stringify({token,policy:'manual-service-recovery'}));fs.fsyncSync(guardFd);}finally{fs.closeSync(guardFd);}}
  catch(error){fs.closeSync(fd);fs.unlinkSync(filename);throw fail(409,'Recovery guard exists; ownership requires manual review.');}
  try { fs.writeSync(fd, JSON.stringify({ owner: process.pid, recorder: null, token, recoveryPolicy: "manual" })); fs.fsyncSync(fd); }
  catch (error) { fs.closeSync(fd); throw error; }
  const release = () => {
    fs.closeSync(fd);
    try{if(JSON.parse(fs.readFileSync(filename,'utf8')).token===token)fs.unlinkSync(filename);}catch{}
    try{if(JSON.parse(fs.readFileSync(guard,'utf8')).token===token)fs.unlinkSync(guard);}catch{}
  };
  // Discovery uses the same fail-closed lock; record only its own spawned child.
  release.recorder = pid => { fs.ftruncateSync(fd); fs.writeSync(fd, JSON.stringify({ owner: process.pid, recorder: pid, token, recoveryPolicy: "manual" }), 0, "utf8"); fs.fsyncSync(fd); };
  return release;
}
function directory(folder, base) {
  const stat = fs.lstatSync(folder, { bigint: true });
  if (stat.isSymbolicLink() || !stat.isDirectory() || !within(base, fs.realpathSync(folder)) || stat.ino === 0n) throw fail(409, "هویت یا مسیر پوشه معتبر نیست؛ عملیات متوقف شد.");
  return stat;
}
function fingerprint(folder) {
  const rows = []; let count = 0;
  function visit(file, relative, depth) {
    if (++count > 20000 || depth > 32) throw fail(409, "آرشیو برای بررسی ایمن بیش از حد بزرگ یا عمیق است.");
    const stat = fs.lstatSync(file, { bigint: true });
    if (stat.isSymbolicLink() || !within(folder, fs.realpathSync(file))) throw fail(409, "آرشیو دارای Symlink/Junction یا مسیر نامعتبر است؛ جابه‌جا نشد.");
    if (stat.isDirectory()) {
      rows.push([relative, "d", String(stat.dev), String(stat.ino)]);
      for (const name of fs.readdirSync(file).sort()) visit(path.join(file, name), relative + "/" + name, depth + 1);
    } else if (stat.isFile()) rows.push([relative, "f", String(stat.dev), String(stat.ino), String(stat.size), String(stat.mtimeNs)]);
    else throw fail(409, "آرشیو دارای فایل ویژه است؛ عملیات مجاز نیست.");
  }
  directory(folder, folder); visit(folder, "", 0);
  for (const name of ["manifest.json", "summary.json", "events.ndjson"]) if (exists(path.join(folder, name))) {
    if (fs.statSync(path.join(folder, name)).size > 64 * 1024 * 1024) throw fail(409, "Metadata بیش از حد بزرگ است.");
    rows.push([name, crypto.createHash("sha256").update(fs.readFileSync(path.join(folder, name))).digest("hex")]);
  }
  return crypto.createHash("sha256").update(JSON.stringify(rows)).digest("hex");
}
function writeNew(file, value) {
  const fd = fs.openSync(file, "wx", 0o600);
  try { fs.writeSync(fd, JSON.stringify(value)); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
class Trash {
  constructor(repository, { ttl = 120000, beforeMove, afterMove } = {}) {
    this.repository = repository; this.root = repository.root; this.base = path.join(this.root, ".playwright-studio", "trash");
    this.key = projectKey(this.root); this.plans = new Map(); this.ttl = ttl; this.beforeMove = beforeMove; this.afterMove = afterMove;
  }
  container(create = false) {
    if (!this.repository.history.checkReadOnlyBase()) { if (create) throw fail(409, "پوشهٔ اصلی History موجود نیست."); return false; }
    if (!exists(this.base)) { if (!create) return false; fs.mkdirSync(this.base); }
    directory(this.base, this.root); return true;
  }
  snapshot(id) {
    const value = this.repository.raw(id), policy = deletionPolicy(value);
    if (!policy.deletable) throw fail(409, policy.deletionReason);
    return { id, label: String(value.manifest.label || "Run").slice(0, 512), fingerprint: fingerprint(this.repository.history.directory(id)) };
  }
  entry(id) {
    if (!uuid.test(id) || !this.container()) throw fail(404, "شناسهٔ Trash معتبر نیست.");
    const folder = path.join(this.base, id); if (!exists(folder)) throw fail(404, "رکورد Trash موجود نیست."); directory(folder, this.base);
    const filename = path.join(folder, "entry.json"), stat = fs.lstatSync(filename);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 16384) throw fail(409, "سند بازیافت معتبر نیست.");
    const value = JSON.parse(fs.readFileSync(filename, "utf8"));
    if (value.schemaVersion !== 1 || value.trashId !== id || value.projectKey !== this.key || !runId.test(value.runId) || !/^[a-f0-9]{64}$/u.test(value.fingerprint)) throw fail(409, "هویت سند بازیافت معتبر نیست.");
    return { folder, value, payload: path.join(folder, "run") };
  }
  list() {
    if (!this.container()) return [];
    return fs.readdirSync(this.base).filter(id => uuid.test(id)).map(id => {
      try { const item = this.entry(id), present = exists(item.payload);
        const restorable = present && fingerprint(item.payload) === item.value.fingerprint;
        return { id, runId: item.value.runId, label: item.value.label, createdAt: item.value.createdAt, restorable,
          state: restorable ? "trashed" : present ? "unverified" : exists(path.join(item.folder, "RESTORED")) ? "restored" : "pending" };
      } catch { return { id, label: "بازیافت نیازمند بررسی دستی", state: "unverified", restorable: false }; }
    }).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }
  remember(owner, value) {
    for (const [id, plan] of this.plans) if (plan.expires <= Date.now()) this.plans.delete(id);
    if (this.plans.size >= 256) throw fail(429, "تعداد پیش‌نمایش‌ها زیاد است؛ دو دقیقه صبر کنید.");
    const id = crypto.randomUUID(), plan = { ...value, id, owner, expires: Date.now() + this.ttl }; this.plans.set(id, plan);
    return { planId: id, kind: value.kind, count: value.items.length, items: value.items.map(({ fingerprint, ...item }) => item), blocked: value.blocked || [], expiresAt: plan.expires };
  }
  plan(owner, input) {
    if (!input || Object.keys(input).some(key => !["mode", "ids"].includes(key)) || !["selected", "clear"].includes(input.mode) || input.mode === "clear" && Object.hasOwn(input, "ids")) throw fail(400, "درخواست حذف باید فقط شامل mode و شناسه‌های Run باشد.");
    const all = this.repository.list(), known = new Set(all.map(item => item.id));
    const ids = input.mode === "clear" ? all.map(item => item.id) : input.ids;
    if (!Array.isArray(ids) || ids.length > 1000 || new Set(ids).size !== ids.length || ids.some(id => typeof id !== "string" || !known.has(id))) throw fail(400, "شناسه‌های انتخاب‌شده معتبر یا ثبت‌شده نیستند.");
    const items = [], blocked = [];
    for (const id of ids) { try { items.push(this.snapshot(id)); } catch { blocked.push({ id, reason: "Run نهایی نشده، ناخوانا یا دارای مسیر/مالکیت نامشخص است؛ بدون تغییر می‌ماند." }); } }
    return this.remember(owner, { kind: "trash", items, blocked });
  }
  restorePlan(owner, input) {
    if (!input || Object.keys(input).length !== 1 || typeof input.trashId !== "string") throw fail(400, "فقط شناسهٔ Trash پذیرفته می‌شود.");
    const item = this.entry(input.trashId);
    if (!exists(item.payload) || fingerprint(item.payload) !== item.value.fingerprint) throw fail(409, "آرشیو بازیافت موجود یا قابل تأیید نیست.");
    if (exists(path.join(this.repository.history.base, item.value.runId))) throw fail(409, "Run هم‌نام وجود دارد؛ هیچ بازنویسی انجام نمی‌شود.");
    return this.remember(owner, { kind: "restore", items: [{ id: item.value.runId, trashId: input.trashId, label: item.value.label, fingerprint: item.value.fingerprint }] });
  }
  confirm(owner, input) {
    if (!input || Object.keys(input).some(key => !["planId", "confirm"].includes(key)) || input.confirm !== true) throw fail(400, "تأیید صریح لازم است.");
    const plan = this.plans.get(input.planId);
    if (!plan || plan.owner !== owner || plan.expires <= Date.now()) throw fail(409, "پیش‌نمایش منقضی یا متعلق به Session دیگری است؛ دوباره بررسی کنید.");
    this.plans.delete(plan.id);
    if (!plan.items.length) throw fail(409, "مورد قابل جابه‌جایی وجود ندارد.");
    const release = maintenanceLock(this.root);
    try {
      // Validate the ENTIRE batch before moving the first directory.
      for (const item of plan.items) {
        const current = plan.kind === "trash" ? this.snapshot(item.id) : this.entry(item.trashId);
        if (plan.kind === "trash" ? current.fingerprint !== item.fingerprint : !exists(current.payload) || fingerprint(current.payload) !== item.fingerprint || exists(path.join(this.repository.history.base, item.id))) throw fail(409, "آرشیو پس از پیش‌نمایش تغییر کرده یا مقصد موجود است؛ هیچ موردی جابه‌جا نشد.");
      }
      const moved = [], failures = [];
      for (const item of plan.items) {
        try {
          this.container(true);
          let from, to, wrapper;
          if (plan.kind === "trash") {
            from = this.repository.history.directory(item.id);
            const trashId = crypto.randomUUID(); wrapper = path.join(this.base, trashId); fs.mkdirSync(wrapper); directory(wrapper, this.base);
            writeNew(path.join(wrapper, "entry.json"), { schemaVersion: 1, projectKey: this.key, trashId, runId: item.id, label: item.label, createdAt: new Date().toISOString(), fingerprint: item.fingerprint });
            to = path.join(wrapper, "run");
          } else { const entry = this.entry(item.trashId); from = entry.payload; wrapper = entry.folder; to = path.join(this.repository.history.base, item.id); }
          this.beforeMove?.({ from, to, kind: plan.kind }); // Test hook, never supplied by HTTP.
          if (fingerprint(from) !== item.fingerprint || exists(to)) throw fail(409, "مبدأ تغییر کرده یا مقصد موجود است؛ بازنویسی انجام نشد.");
          fs.renameSync(from, to); // Same volume only; no copy/delete fallback.
          this.afterMove?.({ from, to, kind: plan.kind });
          if (fingerprint(to) !== item.fingerprint) throw fail(409, "جابه‌جایی نیازمند بررسی دستی است؛ داده پاک نشده و بازنویسی خودکار انجام نشد.");
          writeNew(path.join(wrapper, plan.kind === "trash" ? "COMMITTED" : "RESTORED"), { at: new Date().toISOString() });
          moved.push(item.id);
        } catch { failures.push({ id: item.id, reason: "جابه‌جایی کامل تأیید نشد؛ داده برای بررسی و بازیابی نگه داشته شده است." }); }
      }
      return { kind: plan.kind, moved, failures, blocked: plan.blocked || [] };
    } finally { release(); }
  }
}
module.exports = { Trash, maintenanceLock, fingerprint };
