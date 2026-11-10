// Adapter over RegressionManager.catalog, never a second Playwright discovery runner.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { within } = require("../regression/history.cjs");
const { fail } = require("./repository.cjs");
const { maintenanceLock } = require("./trash.cjs");
const hash = value => crypto.createHash("sha256").update(value).digest("hex");
const object = value => value && typeof value === "object" && !Array.isArray(value);
class Catalog {
  constructor(root, { discover, timeout = 90000 } = {}) {
    this.root = fs.realpathSync(root); this.base = path.join(this.root, "TestCases");
    this.discoverFixture = discover; this.timeout = timeout; this.pending = null; this.manager = null; this.closed = false;
    this.value = { phase: "idle", catalogRevision: null, tests: [], entries: [], updatedAt: null, error: null };
  }
  safe(file, directory = false) {
    if (!within(this.root, file)) throw fail(409, "مسیر Catalog خارج از پروژه است.");
    const relative = path.relative(this.root, file); let current = this.root;
    for (const part of relative.split(path.sep).filter(Boolean)) {
      current = path.join(current, part);
      if (fs.lstatSync(current).isSymbolicLink()) throw fail(409, "Symlink/Junction در مسیر تست مجاز نیست.");
    }
    const stat = fs.statSync(file), real = fs.realpathSync(file);
    if (!within(this.root, real) || (directory ? !stat.isDirectory() : !stat.isFile())) throw fail(409, "مسیر Catalog معتبر نیست.");
    return real;
  }
  scan(withEntries = false) {
    const rows = [], entries = []; let visited = 0;
    const walk = (folder, depth = 0) => {
      if (depth > 64) throw fail(409, "ساختار TestCases بیش از حد عمیق است.");
      this.safe(folder, true);
      entries.push({ kind: "folder", path: path.relative(this.base, folder).split(path.sep).join("/") });
      for (const item of fs.readdirSync(folder, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
        if (++visited > 30000) throw fail(409, "Catalog بیش از حد بزرگ است.");
        const file = path.join(folder, item.name);
        if (item.isSymbolicLink()) throw fail(409, "TestCases دارای Symlink/Junction است؛ Discovery ایمن متوقف شد.");
        if (item.isDirectory()) walk(file, depth + 1);
        else if (item.isFile() && /\.(?:[cm]?[jt]s|json)$/iu.test(item.name)) { record(file); if (item.name.endsWith(".spec.ts")) entries.push({ kind: "file", path: path.relative(this.base, file).split(path.sep).join("/") }); }
      }
    };
    const record = file => {
      this.safe(file); const stat = fs.statSync(file);
      if (stat.size > 8 * 1024 * 1024) throw fail(409, "فایل ورودی Catalog بیش از حد بزرگ است.");
      rows.push([path.relative(this.root, file).split(path.sep).join("/"), hash(fs.readFileSync(file))]);
    };
    if (fs.existsSync(this.base)) walk(this.base);
    else rows.push(["TestCases", "missing"]);
    for (const name of fs.readdirSync(this.root).sort()) if (/^playwright\.config\.(?:[cm]?[jt]s)$/u.test(name) || ["package.json", "package-lock.json", "pnpm-lock.yaml", "yarn.lock"].includes(name)) record(path.join(this.root, name));
    const fingerprint = hash(JSON.stringify([rows, entries]));
    return withEntries ? { fingerprint, entries } : fingerprint;
  }
  get() {
    let stale = false, staleReason = "";
    if (this.value.catalogRevision) try { stale = this.scan() !== this.fingerprint; if (stale) staleReason = "فایل‌ها یا Config تغییر کرده‌اند؛ Discovery تازه لازم است."; }
    catch { stale = true; staleReason = "فایل یا مسیر Catalog دیگر قابل تأیید نیست؛ Discovery تازه لازم است."; }
    return { ...this.value, tests: this.value.tests.map(test => ({ ...test, titles: [...test.titles] })), stale, staleReason,
      fileCount: this.value.entries.filter(item => item.kind === "file").length, testCount: this.value.tests.length };
  }
  validate(begin) {
    if (!begin || !Array.isArray(begin.tests) || begin.tests.length > 20000 || typeof begin.rootDir !== "string") throw fail(409, "پاسخ Discovery معتبر نیست.");
    const ids = new Set();
    return begin.tests.map(test => {
      if (!object(test) || typeof test.id !== "string" || !test.id || test.id.length > 512 || ids.has(test.id) ||
          typeof test.project !== "string" || typeof test.title !== "string" || !Array.isArray(test.titles) || !test.titles.length || test.titles.some(title => typeof title !== "string") ||
          !Number.isSafeInteger(test.line) || test.line < 1 || !Number.isSafeInteger(test.column) || test.column < 1 ||
          typeof test.file !== "string" || !path.isAbsolute(test.file) || !within(this.base, test.file) || !test.file.endsWith(".spec.ts") ||
          typeof test.listFile !== "string" || path.isAbsolute(test.listFile) || test.listFile.split(/[\\/]/u).includes("..") ||
          path.resolve(begin.rootDir, test.listFile) !== path.resolve(test.file)) throw fail(409, "هویت دقیق تست یا مسیر Discovery معتبر نیست.");
      const file = this.safe(path.resolve(test.file));
      if (!within(this.safe(this.base, true), file) || hash(fs.readFileSync(file)) !== test.sourceHash) throw fail(409, "Source هنگام Discovery تغییر کرده است؛ دوباره شناسایی کنید.");
      ids.add(test.id);
      return { id: test.id, project: test.project, title: test.title, titles: [...test.titles], file,
        listFile: test.listFile, displayPath: path.relative(this.base, file).split(path.sep).join("/"),
        line: test.line, column: test.column, sourceHash: test.sourceHash, expectedStatus: test.expectedStatus };
    });
  }
  start(input) {
    if (!object(input) || Object.keys(input).length) throw fail(400, "Discovery فقط برای پروژهٔ ثبت‌شده و بدون پارامتر اجرا می‌شود.");
    if (this.closed || this.pending || this.releaseOwnedLock) throw fail(409, "یک Discovery یا قفل متعلق به آن فعال است؛ منتظر نتیجه بمانید.");
    const release = maintenanceLock(this.root);
    let before;
    try { before = this.scan(true); } catch (error) { release(); throw error; }
    this.releaseOwnedLock = release;
    const previous = this.value, operation = this.operation = { id: crypto.randomUUID(), controller: new AbortController(), cancelled: false };
    this.value = { ...this.value, phase: "discovering", discoveryId: operation.id, discoveryOutcome: null, error: null };
    this.pending = Promise.resolve().then(async () => {
      let timer, cancelledValue;
      try {
        if (this.closed || operation.cancelled) throw fail(409, "سرویس در حال بسته‌شدن است.");
        let begin;
        if (this.discoverFixture) begin = await this.discoverFixture({ signal: operation.controller.signal });
        else {
          // Lazy load: GET /catalog never imports CLI/config/spec modules.
          const { RegressionManager } = require("../regression/manager.cjs");
          this.manager = new RegressionManager({ root: () => this.root, node: () => process.execPath });
          this.manager.busy = true;
          timer = setTimeout(() => { void this.manager.stop().catch(() => {}); }, this.timeout);
          begin = await this.manager.catalog(this.root, { recorder: release.recorder }, { allowEmpty: true });
        }
        if (operation.cancelled || this.closed) throw Error("Discovery cancelled");
        const tests = this.validate(begin);
        if (before.fingerprint !== this.scan()) throw fail(409, "فایل‌ها هنگام Discovery تغییر کردند؛ نتیجه پذیرفته نشد.");
        this.fingerprint = before.fingerprint;
        this.value = { phase: "ready", catalogRevision: crypto.randomUUID(), tests, entries: before.entries, updatedAt: new Date().toISOString(), error: null };
      } catch (error) {
        if (operation.cancelled) cancelledValue = { ...previous, discoveryOutcome: "cancelled", discoveryId: null, cancelRequested: false };
        else this.value = { ...this.value, discoveryId: null, phase: "error", discoveryOutcome: "failed", error: String(error.message || "Discovery ناموفق بود.").slice(-4000) };
      } finally {
        clearTimeout(timer);
        try { await this.cleanupOwned(); if (cancelledValue) this.value = cancelledValue; }
        catch { this.value = { ...this.value, phase: "error", error: "توقف پردازش متعلق به Discovery تأیید نشد؛ قفل حفظ شد. وضعیت را از ترمینال سرویس بررسی کنید." }; }
        this.pending = null;
      }
    });
    return { accepted: true, phase: "discovering", discoveryId: operation.id };
  }
  cancel(input) {
    if (!object(input) || Object.keys(input).join(',') !== 'discoveryId' || typeof input.discoveryId !== 'string') throw fail(400, 'Discovery ID required.');
    if (!this.pending || input.discoveryId !== this.operation?.id) throw fail(409, 'No matching discovery.');
    if (this.operation.cancelled) return { accepted: true, discoveryId: this.operation.id };
    this.value = { ...this.value, cancelRequested: true };
    this.operation.cancelled = true; this.operation.controller.abort();
    if (this.manager) void this.manager.stop().catch(() => {});
    return { accepted: true, discoveryId: this.operation.id };
  }
  resolve(input) {
    if (!object(input) || Object.keys(input).some(key => !["catalogRevision", "ids"].includes(key)) ||
        !Array.isArray(input.ids) || !input.ids.length || input.ids.length > 20000 || input.ids.some(id => typeof id !== "string") || new Set(input.ids).size !== input.ids.length) throw fail(400, "انتخاب باید فقط شامل catalogRevision و شناسه‌های یکتای تست باشد.");
    const current = this.get();
    if (!current.catalogRevision || current.phase !== "ready" || current.stale || input.catalogRevision !== current.catalogRevision) throw fail(409, "انتخاب قدیمی یا Discovery نامعتبر است؛ دوباره شناسایی و انتخاب کنید.");
    const byId = new Map(current.tests.map(test => [test.id, test]));
    if (input.ids.some(id => !byId.has(id))) throw fail(409, "تست انتخاب‌شده در Catalog فعلی موجود نیست.");
    return { catalogRevision: current.catalogRevision, ids: [...input.ids], tests: input.ids.map(id => byId.get(id)) };
  }
  async cleanupOwned() {
    if (this.manager?.child) await this.manager.stop();
    if (this.manager?.child?.exitCode === null) throw fail(409, "پردازش متعلق به Discovery هنوز پایان نیافته است.");
    if (this.manager) this.manager.busy = false;
    this.manager = null; this.releaseOwnedLock?.(); this.releaseOwnedLock = null;
  }
  async close() { this.closed = true; this.operation?.controller.abort(); if (this.manager) await this.manager.stop(); if (this.pending) await this.pending; await this.cleanupOwned(); }
}
module.exports = { Catalog };
