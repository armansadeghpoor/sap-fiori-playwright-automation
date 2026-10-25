const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn, execFileSync } = require("node:child_process");
const { acquireLock, stopTree, relativeFolder } = require("../studio.cjs");
const { History, snapshot, journal, within, hashFile, writeNew } = require("./history.cjs");
const reporter = path.join(__dirname, "reporter.cjs");

function selectionLine(test) {
  const tokens = [test.project, test.listFile, ...test.titles];
  if (tokens.some(token => typeof token !== "string" || /[\r\n›]/u.test(token))) throw new Error("عنوان این تست با قالب رسمی Test List سازگار نیست؛ انتخاب دقیق ممکن نشد.");
  return `[${test.project}] › ${test.listFile} › ${test.titles.join(" › ")}`;
}

class RegressionManager {
  constructor(host) {
    this.host = host;
    this.busy = false;
    this.closing = false;
    this.child = null;
    this.stopRequested = false;
    this.state = { busy: false, phase: "idle", message: "آمادهٔ اجرای Regression", runId: null, log: "" };
  }
  publish(patch) { Object.assign(this.state, patch); this.host.state?.({ ...this.state }); }
  store() { return new History(this.host.root()); }
  cli(root) { return require.resolve("@playwright/test/cli", { paths: [root] }); }
  env(folder) {
    const env = { ...process.env, STUDIO_REGRESSION_DIR: folder,
      PLAYWRIGHT_HTML_OUTPUT_DIR: path.join(folder, "report"), PLAYWRIGHT_HTML_OPEN: "never",
      PLAYWRIGHT_JSON_OUTPUT_FILE: path.join(folder, "results.json") };
    delete env.PW_TEST_REUSE_CONTEXT;
    delete env.PWDEBUG;
    delete env.PWPAUSE;
    delete env.STUDIO_REGRESSION_EXPECTED;
    return env;
  }
  async process(root, args, env, lock, outputFolder) {
    return new Promise((resolve, reject) => {
      const child = spawn(this.host.node(), args, { cwd: root, env, shell: false, windowsHide: true, detached: process.platform !== "win32" });
      this.child = child;
      if (child.pid) lock.recorder(child.pid);
      let outputError;
      child.stdout.setEncoding("utf8"); child.stderr.setEncoding("utf8");
      const streams = outputFolder ? ["stdout", "stderr"].map(name => fs.openSync(path.join(outputFolder, name + ".log"), "wx")) : [];
      const output = (chunk, index) => {
        try { if (streams[index] !== undefined) fs.writeSync(streams[index], chunk); }
        catch (error) { outputError = error; void this.stop().catch(() => {}); }
        this.publish({ log: (this.state.log + chunk.toString("utf8").replace(/\x1b\[[0-?]*[ -/]*[@-~]/gu, "")).slice(-16000) });
      };
      child.stdout.on("data", chunk => output(chunk, 0));
      child.stderr.on("data", chunk => output(chunk, 1));
      child.on("error", error => { outputError = error; });
      child.on("close", code => {
        for (const fd of streams) fs.closeSync(fd);
        this.child = null;
        if (outputError) reject(outputError); else resolve(code);
      });
      if (this.stopRequested && child.pid) void stopTree(child).catch(error => { outputError = error; });
    });
  }
  async catalog(root, lock) {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), "pw-studio-catalog-"));
    try {
      const code = await this.process(root, [this.cli(root), "test", "--list", "--reporter=" + reporter], this.env(folder), lock);
      const { events } = journal(folder);
      const begin = events.find(event => event.type === "begin");
      const errors = events.filter(event => event.type === "error");
      if (this.stopRequested) throw new Error("عملیات متوقف شد.");
      if (code !== 0 || !begin || errors.length || fs.existsSync(path.join(folder, "reporter-error.txt"))) throw new Error("Discovery ناموفق بود. جزئیات اجرا را بررسی کنید.\n" + this.state.log.slice(-4000));
      return begin;
    } finally {
      const real = fs.realpathSync(folder);
      if (path.dirname(real) === fs.realpathSync(os.tmpdir()) && path.basename(real).startsWith("pw-studio-catalog-")) fs.rmSync(real, { recursive: true });
    }
  }
  async discover() {
    return this.operation(async (root, lock) => {
      this.publish({ phase: "discovering", message: "در حال شناسایی تست‌ها…" });
      const catalog = await this.catalog(root, lock);
      this.publish({ phase: "idle", message: `${catalog.tests.length} تست شناسایی شد.`, catalog: catalog.tests });
      return catalog.tests;
    });
  }
  choose(root, input, catalog, store) {
    const all = catalog.tests;
    if (input.scope === "suite") return { tests: all, label: "کل Suite" };
    if (input.scope === "selection") {
      if (!Array.isArray(input.ids) || !input.ids.length || input.ids.length !== new Set(input.ids).size) throw new Error("انتخاب تست‌ها معتبر نیست.");
      const tests = all.filter(test => input.ids.includes(test.id));
      if (tests.length !== input.ids.length) throw new Error("برخی تست‌های انتخابی حذف یا تغییرنام یافته‌اند؛ فهرست را دوباره شناسایی کنید.");
      return { tests, label: "تست‌های انتخاب‌شده" };
    }
    if (["folder", "file"].includes(input.scope)) {
      if (typeof input.path !== "string" || input.path.length > 2048 || path.isAbsolute(input.path)) throw new Error("مسیر را نسبت به TestCases وارد کنید.");
      const destination = path.resolve(root, "TestCases", input.path || ".");
      relativeFolder(root, input.scope === "file" ? path.dirname(destination) : destination);
      if (input.scope === "file" && (!destination.endsWith(".spec.ts") || !within(fs.realpathSync(path.join(root, "TestCases")), fs.realpathSync(destination)))) throw new Error("فایل Spec باید داخل TestCases باشد.");
      const tests = all.filter(test => input.scope === "file" ? path.resolve(test.file) === destination : within(destination, test.file));
      return { tests, label: input.path || "TestCases" };
    }
    if (["failed", "selected"].includes(input.scope)) {
      const previous = store.detail(input.parentRunId);
      if (!fs.existsSync(path.join(store.directory(input.parentRunId), "summary.json"))) throw new Error("ابتدا Run قبلی را پایان دهید.");
      const selected = input.scope === "failed" ? previous.summary.tests.filter(test => test.outcome === "failed") : previous.summary.tests.filter(test => input.ids?.includes(test.id));
      if (input.scope === "selected" && (!Array.isArray(input.ids) || !input.ids.length || input.ids.length !== new Set(input.ids).size || selected.length !== input.ids.length)) throw new Error("انتخاب تست‌ها معتبر نیست.");
      const tests = selected.map(old => {
        const current = all.find(test => test.id === old.id && test.project === old.project && test.listFile === old.listFile && JSON.stringify(test.titles) === JSON.stringify(old.titles));
        if (!current) throw new Error(`تست حذف یا تغییرنام یافته است: ${old.title}. ابتدا فهرست را بررسی کنید.`);
        return current;
      });
      return { tests, label: input.scope === "failed" ? "Failedهای " + input.parentRunId : "انتخاب از " + input.parentRunId,
        changedSources: tests.filter(test => selected.find(old => old.id === test.id).sourceHash !== test.sourceHash).map(test => test.file) };
    }
    throw new Error("نوع انتخاب نامعتبر است.");
  }
  async run(input) {
    return this.operation(async (root, lock) => {
      if (!input || typeof input.headed !== "boolean") throw new Error("گزینهٔ نمایش مرورگر نامعتبر است.");
      if (!["folder", "file", "suite", "selection", "failed", "selected"].includes(input.scope)) throw new Error("نوع انتخاب نامعتبر است.");
      if (["folder", "file"].includes(input.scope)) {
        if (typeof input.path !== "string" || input.path.length > 2048 || path.isAbsolute(input.path)) throw new Error("مسیر را نسبت به TestCases وارد کنید.");
        const target = path.resolve(root, "TestCases", input.path || ".");
        relativeFolder(root, input.scope === "file" ? path.dirname(target) : target);
      }
      if (this.host.prepare && !await this.host.prepare(input)) return;
      this.publish({ phase: "discovering", message: "در حال بررسی مجموعهٔ تست‌ها…" });
      const catalog = await this.catalog(root, lock);
      if (this.host.root() !== root) throw new Error("پروژه در حین آماده‌سازی تغییر کرده است.");
      const store = new History(root);
      const selected = this.choose(root, input, catalog, store);
      if (!selected.tests.length) throw new Error("تستی برای اجرای این انتخاب وجود ندارد.");
      const lines = selected.tests.map(selectionLine);
      const resets = [...new Set(selected.tests.map(test => test.file))].filter(file => /restoreSnapshot|RestoreSnapshot/u.test(fs.readFileSync(file, "utf8")));
      if (resets.length && this.host.confirmSnapshot && !await this.host.confirmSnapshot(resets)) {
        this.publish({ phase: "cancelled", message: "اجرا لغو شد؛ Run جدیدی ساخته نشد." }); return;
      }
      if (this.stopRequested || this.closing) return;
      let revision = null;
      try { revision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, windowsHide: true, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch {}
      const run = store.create({ scope: input.scope, label: selected.label, parentRunId: input.parentRunId || null,
        headed: input.headed, tests: selected.tests, changedSources: selected.changedSources || [], revision,
        playwrightVersion: catalog.version, configHash: fs.existsSync(path.join(root, "playwright.config.ts")) ? hashFile(path.join(root, "playwright.config.ts")) : null });
      this.publish({ phase: "running", runId: run.manifest.id, message: "در حال اجرای تست‌ها…", progress: { total: selected.tests.length, completed: 0 } });
      let timer, code = null, failure;
      const started = Date.now();
      try {
        fs.writeFileSync(path.join(run.folder, "selection.txt"), lines.join("\n") + "\n", { flag: "wx" });
        writeNew(path.join(run.folder, "expected.json"), selected.tests.map(test => test.id));
        const env = this.env(run.folder);
        env.STUDIO_REGRESSION_EXPECTED = path.join(run.folder, "expected.json");
        const args = [this.cli(root), "test", "--test-list", path.join(run.folder, "selection.txt"), "--workers=1", "--retries=0", "--no-deps", "--forbid-only", "--trace=retain-on-failure", "--update-snapshots=none",
          "--reporter=line,json,html," + reporter, "--output", path.join(run.folder, "artifacts"), ...(input.headed ? ["--headed"] : [])];
        const progress = () => {
          try {
            const value = snapshot(run.folder, run.manifest);
            this.publish({ progress: { total: selected.tests.length,
              completed: value.tests.filter(test => !["notRun", "running"].includes(test.outcome)).length,
              counts: value.counts, current: value.tests.find(test => test.outcome === "running")?.title,
              elapsed: Date.now() - started } });
          } catch (error) { failure = error; void this.stop().catch(() => {}); }
        };
        timer = setInterval(progress, 250);
        code = await this.process(root, args, env, lock, run.folder);
        progress();
      } catch (error) { failure = error; }
      finally { clearInterval(timer); }
      const value = snapshot(run.folder, run.manifest);
      const reporterError = fs.existsSync(path.join(run.folder, "reporter-error.txt"));
      const complete = Boolean(value.end) && !value.damaged && !reporterError && !failure;
      const status = this.stopRequested ? "interrupted" : !complete ? "error" : code === 0 && value.end.status === "passed" ? "passed" : "failed";
      const summary = store.finalize(run, { status, complete, exitCode: code, duration: Date.now() - started,
        message: failure?.message || (reporterError ? fs.readFileSync(path.join(run.folder, "reporter-error.txt"), "utf8") : "") });
      this.publish({ phase: status, message: status === "passed" ? "اجرا پایان یافت؛ نتایج ذخیره شدند." : status === "interrupted" ? "اجرا متوقف شد؛ نتایج ثبت‌شده حفظ شدند." : "اجرا ناموفق یا ناقص است؛ جزئیات Run را بررسی کنید.",
        result: { manifest: run.manifest, summary } });
      return { manifest: run.manifest, summary };
    });
  }
  async operation(action) {
    if (this.busy || this.closing) throw new Error("یک عملیات Regression فعال است.");
    this.busy = true; this.stopRequested = false;
    this.publish({ busy: true, log: "", result: null, progress: null });
    let lock;
    try { const root = this.host.root(); lock = acquireLock(root); return await action(root, lock); }
    catch (error) { this.publish({ phase: this.stopRequested ? "interrupted" : "error", message: error.message }); throw error; }
    finally {
      if (this.child) await stopTree(this.child);
      this.child = null;
      lock?.release(); this.busy = false; this.publish({ busy: false });
    }
  }
  async stop() {
    if (!this.busy) return;
    this.stopRequested = true;
    this.publish({ phase: "stopping", message: "در حال توقف؛ نتایج قبلی حفظ می‌شوند…" });
    if (this.child) await stopTree(this.child);
  }
}
module.exports = { RegressionManager, selectionLine };
