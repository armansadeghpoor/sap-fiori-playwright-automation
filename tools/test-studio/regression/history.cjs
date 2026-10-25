const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const within = (base, candidate) => {
  const relative = path.relative(base, candidate);
  return relative === "" || (!path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(".." + path.sep));
};
const readJson = filename => JSON.parse(fs.readFileSync(filename, "utf8"));
const writeNew = (filename, value) => fs.writeFileSync(filename, JSON.stringify(value, null, 2), { flag: "wx" });
const hashFile = filename => crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex");

function safeDirectory(base, parts) {
  let folder = fs.realpathSync(base);
  for (const part of parts) {
    folder = path.join(folder, part);
    try { fs.mkdirSync(folder); } catch (error) { if (error.code !== "EEXIST") throw error; }
    if (fs.lstatSync(folder).isSymbolicLink() || !fs.statSync(folder).isDirectory()) throw new Error("مسیر آرشیو نباید میان‌بر یا فایل باشد.");
  }
  return folder;
}

function journal(folder) {
  const filename = path.join(folder, "events.ndjson");
  if (!fs.existsSync(filename)) return { events: [], damaged: false };
  const text = fs.readFileSync(filename, "utf8");
  const lines = text.split("\n");
  const events = [];
  let damaged = false;
  // A trailing partial record is expected after a hard stop. Never discard earlier records.
  for (const line of lines.slice(0, -1)) {
    if (!line.trim()) continue;
    try { events.push(JSON.parse(line)); } catch { damaged = true; }
  }
  return { events, damaged: damaged || Boolean(lines.at(-1)) };
}

function snapshot(folder, manifest) {
  const { events, damaged } = journal(folder);
  const tests = (manifest.tests || []).map(test => ({ ...test, attempts: [], outcome: "notRun", duration: 0, flaky: false }));
  const byId = new Map(tests.map(test => [test.id, test]));
  const errors = [];
  let end;
  for (const event of events) {
    if (event.type === "error") errors.push(event.error);
    if (event.type === "end") end = event;
    const test = byId.get(event.testId);
    if (!test) continue;
    if (event.type === "testBegin") test.outcome = "running";
    if (event.type === "testEnd") {
      test.attempts.push(event.result);
      test.duration += event.result.duration;
      const status = event.result.status;
      test.outcome = status === "skipped" ? (event.result.workerIndex === -1 && event.expectedStatus !== "skipped" ? "notRun" : "skipped") : status === "interrupted" ? "interrupted" : status === event.expectedStatus ? "passed" : "failed";
      test.flaky = test.outcome === "passed" && test.attempts.some(attempt => attempt.status !== "skipped" && attempt.status !== event.expectedStatus);
    }
  }
  const counts = { passed: 0, failed: 0, skipped: 0, interrupted: 0, notRun: 0, running: 0, flaky: 0 };
  for (const test of tests) { counts[test.outcome]++; if (test.flaky) counts.flaky++; }
  return { tests, counts, errors, end, damaged };
}

class History {
  constructor(root) {
    this.root = fs.realpathSync(root);
    this.base = safeDirectory(this.root, [".playwright-studio", "runs"]);
  }
  directory(id) {
    if (typeof id !== "string" || !/^\d{8}T\d{9}Z-[0-9a-f-]{36}$/u.test(id)) throw new Error("شناسهٔ Run نامعتبر است.");
    const folder = path.join(this.base, id);
    if (!within(this.base, fs.realpathSync(folder)) || fs.lstatSync(folder).isSymbolicLink()) throw new Error("مسیر Run نامعتبر است.");
    return folder;
  }
  create(value) {
    const id = new Date().toISOString().replace(/[-:.]/gu, "") + "-" + crypto.randomUUID();
    const folder = path.join(this.base, id);
    fs.mkdirSync(folder);
    const manifest = { schemaVersion: 1, id, createdAt: new Date().toISOString(), owner: process.pid, ...value };
    writeNew(path.join(folder, "manifest.json"), manifest);
    return { folder, manifest };
  }
  detail(id) {
    const folder = this.directory(id);
    const manifest = readJson(path.join(folder, "manifest.json"));
    const summaryFile = path.join(folder, "summary.json");
    if (fs.existsSync(summaryFile)) return { manifest, summary: readJson(summaryFile) };
    const state = snapshot(folder, manifest);
    let alive = false;
    try { process.kill(manifest.owner, 0); alive = true; } catch {}
    if (!alive) {
      // Reconstruct an interrupted view only; never rewrite an abandoned journal.
      for (const test of state.tests) if (test.outcome === "running") test.outcome = "interrupted";
      state.counts.running = 0;
      state.counts.interrupted = state.tests.filter(test => test.outcome === "interrupted").length;
    }
    return { manifest, summary: { ...state, status: alive ? "running" : "interrupted", complete: false,
      message: alive ? "Run هنوز نهایی نشده است." : "اجرای قبلی کامل بسته نشده؛ نتایج ثبت‌شده بازیابی شدند.",
      report: fs.existsSync(path.join(folder, "report", "index.html")) } };
  }
  list() {
    const result = [];
    for (const entry of fs.readdirSync(this.base, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
      try {
        const { manifest, summary } = this.detail(entry.name);
        result.push({ id: manifest.id, createdAt: manifest.createdAt, parentRunId: manifest.parentRunId,
          scope: manifest.scope, label: manifest.label, headed: manifest.headed, total: manifest.tests.length,
          status: summary.status, counts: summary.counts, duration: summary.duration, complete: summary.complete });
      } catch { /* A partially created/corrupt run must not hide other runs. */ }
    }
    return result.sort((a, b) => b.id.localeCompare(a.id));
  }
  finalize(run, value) {
    const state = snapshot(run.folder, run.manifest);
    for (const test of state.tests) if (test.outcome === "running") test.outcome = "interrupted";
    state.counts.running = 0;
    state.counts.interrupted = state.tests.filter(test => test.outcome === "interrupted").length;
    const summary = { ...state, ...value, finishedAt: new Date().toISOString(),
      report: fs.existsSync(path.join(run.folder, "report", "index.html")) };
    writeNew(path.join(run.folder, "summary.json"), summary);
    return summary;
  }
  artifact(id, relative) {
    const base = this.directory(id);
    if (typeof relative !== "string" || path.isAbsolute(relative)) throw new Error("مسیر پیوست نامعتبر است.");
    const filename = fs.realpathSync(path.resolve(base, relative));
    if (!within(base, filename) || !fs.statSync(filename).isFile()) throw new Error("پیوست در آرشیو این Run نیست.");
    return filename;
  }
}

module.exports = { History, snapshot, journal, within, safeDirectory, hashFile, writeNew };
