const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { History, within } = require("../regression/history.cjs");
const RUN_ID = /^\d{8}T\d{9}Z-[0-9a-f-]{36}$/u;
const text = value => String(value ?? "").replace(/\x1b\[[0-?]*[ -/]*[@-~]/gu, "").slice(0, 32768);
const fail = (status, message) => Object.assign(new Error(message), { status });
const formats = {
  ".png": ["image/png", "image"], ".jpg": ["image/jpeg", "image"], ".jpeg": ["image/jpeg", "image"],
  ".webp": ["image/webp", "image"], ".gif": ["image/gif", "image"],
  ".webm": ["video/webm", "video"], ".mp4": ["video/mp4", "video"],
  ".zip": ["application/zip", "download"], ".txt": ["text/plain; charset=utf-8", "download"],
  ".json": ["application/json", "download"], ".pdf": ["application/pdf", "download"],
};
const basename = file => String(file || "").split(/[\\/]/u).at(-1);
function deletionPolicy(value) {
  const { manifest, summary } = value;
  const ids = (manifest.tests || []).map(test => test.id), results = summary.tests || [];
  const sealed = typeof summary.finishedAt === "string" && Number.isFinite(Date.parse(summary.finishedAt)) && ["passed", "failed", "interrupted", "error"].includes(summary.status) &&
    ids.every(id => typeof id === "string" && id.length > 0) &&
    new Set(ids).size === ids.length && results.length === ids.length && new Set(results.map(test => test.id)).size === ids.length &&
    results.every(test => ids.includes(test.id) && ["passed", "failed", "skipped", "interrupted", "notRun"].includes(test.outcome));
  return { deletable: sealed, deletionReason: sealed ? "فقط با تأیید و انتقال قابل‌بازیابی به Trash" : "Run نهایی نشده یا مالکیت/نتیجه نامشخص است؛ حذف خودکار مجاز نیست." };
}
class Repository {
  constructor(root) { this.root = fs.realpathSync(root); this.history = new History(this.root, { readOnly: true }); }
  raw(id) {
    if (!RUN_ID.test(id)) throw fail(400, "شناسهٔ Run نامعتبر است.");
    try {
      const value = this.history.detail(id);
      if (value.manifest.id !== id || value.manifest.schemaVersion !== 1 || !Array.isArray(value.manifest.tests) || !Array.isArray(value.summary.tests)) throw new Error("Invalid schema");
      return value;
    } catch { throw fail(404, "Run موجود نیست یا آرشیو آن قابل خواندن نیست."); }
  }
  results(value) {
    return value.manifest.tests.map(test => {
      const result = value.summary.tests.find(item => item.id === test.id) || {};
      const outcome = result.outcome === "running" || !result.outcome ? "unfinished" : result.outcome;
      return { ...test, ...result, id: test.id, file: test.file, line: test.line, column: test.column, project: test.project, outcome };
    });
  }
  card(id, value) {
    const tests = this.results(value), counts = { passed: 0, failed: 0, skipped: 0, interrupted: 0, notRun: 0, unfinished: 0 };
    for (const test of tests) if (Object.hasOwn(counts, test.outcome)) counts[test.outcome]++;
    return { id, label: text(value.manifest.label || "اجرای تست"), createdAt: value.manifest.createdAt, scope: value.manifest.scope,
      parentRunId: value.manifest.parentRunId || null, status: value.summary.status === "running" ? "incomplete" : value.summary.status,
      complete: value.summary.complete === true, counts, total: tests.length, duration: value.summary.duration ?? null, ...deletionPolicy(value) };
  }
  list() {
    if (!this.history.checkReadOnlyBase()) return [];
    return fs.readdirSync(this.history.base, { withFileTypes: true }).filter(item => item.isDirectory() && !item.isSymbolicLink() && RUN_ID.test(item.name))
      .map(item => { try { return this.card(item.name, this.raw(item.name)); } catch { return { id: item.name, label: "آرشیو غیرقابل خواندن", status: "unreadable", counts: {}, total: 0, complete: false }; } })
      .sort((a, b) => b.id.localeCompare(a.id));
  }
  find(value, testId) {
    const matches = this.results(value).filter(test => test.id === testId);
    if (matches.length !== 1) throw fail(404, "شناسهٔ تست در این Run معتبر یا یکتا نیست.");
    return matches[0];
  }
  attachments(test) {
    return (test.attempts || []).flatMap((attempt, ai) => (attempt.attachments || []).flatMap((attachment, index) => {
      const relative = attachment.path;
      if (typeof relative !== "string" || !/^(attachments|artifacts)\//u.test(relative) || path.isAbsolute(relative) || relative.split(/[\\/]/u).some(part => part === ".." || part.includes(":"))) return [];
      const format = formats[path.extname(relative).toLowerCase()];
      if (!format || (format[1] !== "download" && attachment.contentType !== format[0])) return [];
      const id = crypto.createHash("sha256").update(JSON.stringify([test.id, ai, index, relative])).digest("hex").slice(0, 24);
      return [{ id, name: text(attachment.name), kind: format[1], type: format[0], relative }];
    }));
  }
  testDTO(test) {
    return { id: test.id, title: text(basename(test.file).replace(/\.spec\.ts$/iu, "") || test.title),
      testTitle: text(test.titles?.join(" › ") || test.title), project: text(test.project), outcome: test.outcome,
      duration: test.duration || 0, line: test.line, displayPath: text(test.listFile || basename(test.file)),
      errors: (test.attempts?.at(-1)?.errors || []).map(error => ({ message: text(error.message || error.value), stack: text(error.stack) })),
      attachments: this.attachments(test).map(({ relative, ...item }) => item) };
  }
  detail(id) {
    const value = this.raw(id);
    return { ...this.card(id, value), message: text(value.summary.message), damaged: value.summary.damaged === true,
      errors: (value.summary.errors || []).map(error => text(error.stack || error.message)), tests: this.results(value).map(test => this.testDTO(test)) };
  }
  source(id, testId) {
    const value = this.raw(id), original = value.manifest.tests.find(test => test.id === testId), test = this.find(value, testId);
    const filename = original?.file, base = path.join(this.root, "TestCases");
    try {
      if (typeof filename !== "string" || !path.isAbsolute(filename) || !/\.spec\.ts$/iu.test(filename) || !within(base, filename) || path.relative(base, filename).includes(":")) throw new Error("invalid source");
      const realBase = fs.realpathSync(base), real = fs.realpathSync(filename), stat = fs.statSync(real);
      if (!within(this.root, realBase) || !within(realBase, real) || !stat.isFile() || stat.size > 1024 * 1024) throw new Error("invalid source");
      const buffer = fs.readFileSync(real), content = buffer.toString("utf8"), lines = content.split(/\r?\n/u);
      const valid = line => Number.isSafeInteger(line) && line > 0 && line <= lines.length;
      const same = file => typeof file === "string" && path.isAbsolute(file) && (path.relative(filename, file) === "" || path.relative(real, file) === "");
      let target = original.line;
      if (test.outcome === "failed") for (const error of test.attempts?.at(-1)?.errors || []) {
        if (typeof error.location?.file === "string" && path.isAbsolute(error.location.file)) { if (same(error.location.file) && valid(error.location.line)) target = error.location.line; break; }
        const match = text(error.stack).split("\n").map(frame => frame.match(/(?:^|\s|\()((?:[A-Za-z]:[\\/]|\/)[^\r\n]*):(\d+):(\d+)\)?\s*$/u)).find(Boolean);
        if (match) { if (same(match[1]) && valid(Number(match[2]))) target = Number(match[2]); break; }
      }
      const changed = original.sourceHash ? crypto.createHash("sha256").update(buffer).digest("hex") !== original.sourceHash : null;
      return { testId, content, line: valid(target) ? target : 1, changed, displayPath: path.relative(this.root, filename).split(path.sep).join("/"),
        notice: changed === true ? "فایل فعلی با زمان Run متفاوت است؛ شمارهٔ خط تاریخی است." : changed === null ? "تطابق نسخهٔ کد قابل تأیید نیست." : "نسخهٔ روی دیسک با اثر انگشت Run برابر است." };
    } catch { throw fail(404, "Spec موجود یا مجاز نیست؛ فایل ممکن است حذف، منتقل یا بیش از حد بزرگ شده باشد."); }
  }
  artifact(id, artifactId) {
    if (!/^[0-9a-f]{24}$/u.test(artifactId)) throw fail(404, "پیوست مجاز نیست.");
    const value = this.raw(id), item = this.results(value).flatMap(test => this.attachments(test)).find(attachment => attachment.id === artifactId);
    if (!item) throw fail(404, "پیوست ثبت‌شده و مجاز پیدا نشد.");
    try {
      const filename = this.history.artifact(id, item.relative), stat = fs.statSync(filename);
      const allowedBase = path.join(this.history.directory(id), item.relative.split("/")[0]);
      if (fs.lstatSync(allowedBase).isSymbolicLink() || !within(allowedBase, filename)) throw new Error("artifact escape");
      if (stat.size > 512 * 1024 * 1024) throw new Error("large artifact");
      return { ...item, filename, size: stat.size };
    } catch { throw fail(404, "فایل پیوست موجود نیست یا خارج از محدودهٔ مجاز است."); }
  }
}
module.exports = { Repository, fail, deletionPolicy };
