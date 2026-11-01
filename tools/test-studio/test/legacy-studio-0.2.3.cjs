const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawn, execFile } = require("node:child_process");

function normalizeForm(value) {
  if (!value || typeof value !== "object") throw new Error("فرم نامعتبر است.");
  const result = {};
  for (const key of ["name", "path", "user", "device"]) {
    if (typeof value[key] !== "string" || value[key].length > 2048) throw new Error("ورودی فرم نامعتبر است.");
    result[key] = value[key].trim();
  }
  if (!result.name) throw new Error("نام تست را وارد کنید.");
  if (!result.path) result.path = ".";
  if (/\.spec\.ts$/iu.test(result.path)) throw new Error("در قسمت پوشه، فقط نام پوشه را وارد کنید؛ نام فایل از نام تست ساخته می‌شود.");
  if (typeof value.snapshot !== "boolean") throw new Error("گزینهٔ Snapshot نامعتبر است.");
  result.snapshot = value.snapshot;
  return result;
}

function generatorArgs(root, form, preview) {
  return [path.join(root, "tools", "new-test.cjs"), "--name", form.name,
    "--path", form.path, "--user", form.user, "--device", form.device,
    "--snapshot", form.snapshot ? "enabled" : "disabled", "--json", "--no-record",
    ...(preview ? ["--preview"] : [])];
}

function nodePath(configured) {
  if (configured) {
    if (!path.isAbsolute(configured) || !fs.existsSync(configured)) throw new Error("مسیر Node.js در تنظیمات افزونه معتبر نیست.");
    return configured;
  }
  if (process.platform === "win32") {
    const standard = path.join(process.env.ProgramFiles || "C:\\Program Files", "nodejs", "node.exe");
    if (fs.existsSync(standard)) return standard;
  }
  return "node";
}

// Folder-picker boundary check only; Generator remains the authority for specs.
function relativeFolder(root, selected) {
  const testRoot = path.join(root, "TestCases");
  const within = (base, candidate) => {
    const relative = path.relative(base, candidate);
    return relative === "" || (relative !== ".." && !relative.startsWith(".." + path.sep) && !path.isAbsolute(relative));
  };
  const folder = path.resolve(selected);
  if (!within(testRoot, folder) || !within(fs.realpathSync(testRoot), fs.realpathSync(folder))) {
    throw new Error("فقط پوشهٔ TestCases یا یکی از پوشه‌های داخل آن را انتخاب کنید.");
  }
  if (!fs.statSync(folder).isDirectory()) throw new Error("لطفاً یک پوشه انتخاب کنید.");
  return path.relative(testRoot, folder).split(path.sep).join("/");
}

function runJson(node, args, root) {
  return new Promise((resolve, reject) => {
    const child = spawn(node, args, { cwd: root, shell: false, windowsHide: true });
    let stdout = "", stderr = "";
    const timer = setTimeout(() => { child.kill(); reject(new Error("پاسخ Generator بیش از حد طول کشید.")); }, 15000);
    child.stdout.setEncoding("utf8"); child.stderr.setEncoding("utf8");
    child.stdout.on("data", chunk => { stdout = (stdout + chunk).slice(-65536); });
    child.stderr.on("data", chunk => { stderr = (stderr + chunk).slice(-65536); });
    child.on("error", error => { clearTimeout(timer); reject(error); });
    child.on("close", code => {
      clearTimeout(timer);
      if (code !== 0) return reject(new Error(stderr.trim() || `Generator exited: ${code}`));
      try { resolve(JSON.parse(stdout)); } catch { reject(new Error("پاسخ Generator قابل خواندن نیست؛ نسخهٔ tools/new-test.cjs را بررسی کنید.")); }
    });
  });
}

function validateRunTarget(root, target) {
  if (!target || path.resolve(target.root) !== path.resolve(root)) throw new Error("ابتدا یک تست در همین پروژه بسازید.");
  const filename = target.specPath;
  if (typeof filename !== "string" || !path.isAbsolute(filename) || !filename.endsWith(".spec.ts")) throw new Error("مسیر تست معتبر نیست.");
  relativeFolder(root, path.dirname(filename));
  relativeFolder(root, path.dirname(fs.realpathSync(filename)));
  if (!fs.statSync(filename).isFile()) throw new Error("فایل تست پیدا نشد.");
  return filename;
}

function testArguments(root, filename, outputDir) {
  const cli = require.resolve("@playwright/test/cli", { paths: [root] });
  // Playwright treats file arguments as regexes against the absolute file path.
  const exactFile = "^" + filename.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&") + "$";
  return [cli, "test", exactFile, "--workers=1", "--reporter=line", "--headed", "--no-deps", "--output", outputDir];
}

function alive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; } catch (error) { return error.code !== "ESRCH"; }
}

// Shared by Studio windows for this repository; no lock or log in the repo.
function acquireLock(root) {
  let realRoot = fs.realpathSync(root);
  if (process.platform === "win32") realRoot = realRoot.toLowerCase();
  const hash = crypto.createHash("sha256").update(realRoot).digest("hex").slice(0, 24);
  const filename = path.join(os.tmpdir(), `playwright-test-studio-${hash}.lock`);
  let fd;
  try { fd = fs.openSync(filename, "wx"); }
  catch (error) {
    if (error.code !== "EEXIST") throw error;
    // Fail closed on unknown/corrupt locks; never delete a live recorder's lock.
    // Serialize stale-lock recovery too: two windows must not delete a new lock.
    let recovery;
    try {
      recovery = fs.openSync(filename + ".recovery", "wx");
      let previous;
      try { previous = JSON.parse(fs.readFileSync(filename, "utf8")); } catch {}
      if (previous && !alive(previous.owner) && !alive(previous.recorder)) {
        fs.unlinkSync(filename);
        try { fd = fs.openSync(filename, "wx"); } catch { /* another window won */ }
      }
    } catch { /* another window is recovering; fail closed */ }
    finally {
      if (recovery !== undefined) { fs.closeSync(recovery); fs.unlinkSync(filename + ".recovery"); }
    }
    if (fd === undefined) throw new Error("یک عملیات Studio برای این پروژه فعال است. ابتدا ضبط یا اجرای قبلی را پایان دهید. قفل: " + filename);
  }
  const state = { owner: process.pid, recorder: null, token: crypto.randomUUID() };
  const write = () => { fs.ftruncateSync(fd); fs.writeSync(fd, JSON.stringify(state), 0, "utf8"); };
  write();
  return {
    recorder(pid) { state.recorder = pid; write(); },
    release() {
      fs.closeSync(fd);
      try { if (JSON.parse(fs.readFileSync(filename, "utf8")).token === state.token) fs.unlinkSync(filename); }
      catch { /* already gone */ }
    },
  };
}

function stopTree(child) {
  if (!child || child.exitCode !== null || !child.pid) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (process.platform === "win32") {
      execFile(path.join(process.env.SystemRoot || "C:\\Windows", "System32", "taskkill.exe"),
        ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true }, error => {
          if (error && child.exitCode === null && alive(child.pid)) reject(error); else resolve();
        });
    } else {
      try { process.kill(-child.pid, "SIGTERM"); resolve(); }
      catch (error) { if (error.code === "ESRCH") resolve(); else reject(error); }
    }
  });
}

function readableError(error) {
  const detail = String(error.message || error).replace(/^New Playwright Test:\s*/u, "");
  if (detail.includes("relative to TestCases")) return "مسیر کامل ویندوز را وارد نکنید. فقط پوشهٔ داخل TestCases را بنویسید؛ مثلاً NewTests یا Code/Form.";
  if (detail.includes("already exists") || detail.includes("EEXIST")) return "این فایل از قبل وجود دارد و بازنویسی نشد. نام تست یا پوشه را تغییر دهید.\n" + detail;
  if (detail.includes("Invalid path segment") || detail.includes("safe filename") || detail.includes("control characters")) return "نام تست یا پوشه برای ساخت فایل در ویندوز معتبر نیست. کاراکترهای غیرمجاز، نقطهٔ انتهایی و نام‌هایی مثل CON را حذف کنید.\n" + detail;
  if (detail.includes("outside TestCases") || detail.includes("inside TestCases")) return "پوشهٔ خروجی باید داخل TestCases بماند. مسیر یا میان‌بر پوشه را بررسی کنید.\n" + detail;
  if (detail.includes("ENOENT")) return "فایل یا برنامهٔ موردنیاز پیدا نشد. پوشهٔ پروژه و نصب Node.js را بررسی کنید.\n" + detail;
  return detail;
}

class Studio {
  constructor(host) {
    this.host = host;
    this.busy = false;
    this.child = null;
    this.closing = false;
    this.target = host.savedTarget || null;
    this.state = { busy: false, operation: "record", phase: "idle", message: "آمادهٔ ساخت تست", log: "", specPath: this.target?.specPath || "", outputDir: "" };
  }
  publish(patch) { Object.assign(this.state, patch); this.host.state(this.state); }
  async preview(value) {
    const root = this.host.root();
    const form = normalizeForm(value);
    const result = await runJson(this.host.node(), generatorArgs(root, form, true), root);
    return { ...result, root };
  }
  async start(value) {
    if (this.busy || this.closing) return;
    this.busy = true;
    this.publish({ busy: true, operation: "record", phase: "validating", message: "در حال بررسی ورودی‌ها…", log: "", outputDir: "" });
    let lock;
    try {
      const root = this.host.root();
      const form = normalizeForm(value);
      const node = this.host.node();
      lock = acquireLock(root);
      const plan = await runJson(node, generatorArgs(root, form, true), root);
      if (this.closing) return;
      if (form.snapshot && !await this.host.confirmSnapshot(plan.specPath)) {
        this.publish({ phase: "idle", message: "عملیات لغو شد؛ فایلی ساخته نشد." });
        return;
      }
      if (this.closing) return;
      this.publish({ phase: "creating", message: "در حال ساخت فایل تست…" });
      const result = await runJson(node, generatorArgs(root, form, false), root);
      this.target = { root, specPath: result.specPath, snapshot: form.snapshot };
      this.publish({ specPath: result.specPath });
      await this.host.rememberTarget?.(this.target);
      if (this.closing) return;
      await this.host.open(result.specPath);
      if (this.closing) return;
      this.publish({ phase: "recording", message: "فایل ساخته شد؛ در حال آماده‌سازی Recorder و ورود خودکار…" });
      const args = [path.join(root, "tools", "recorder", "launch.cjs"), "--user=" + form.user, "--device=" + form.device];
      if (form.snapshot) args.push("--snapshot");
      const code = await this.execute(node, args, root, lock, true);
      if (code !== 0 && this.state.phase !== "stopping") throw new Error(`Recorder با کد ${code} متوقف شد. فایل ساخته‌شده باقی مانده است؛ جزئیات پایین پنل را بررسی کنید.`);
      this.publish({ phase: "done", message: "ضبط پایان یافت. کد business flow را در محل مشخص‌شدهٔ فایل تست قرار دهید و ذخیره کنید." });
    } catch (error) { this.publish({ phase: "error", message: readableError(error) }); }
    finally { await this.finishOperation(lock); }
  }
  async runTest() {
    if (this.busy || this.closing) return;
    this.busy = true;
    this.publish({ busy: true, operation: "run", phase: "preparing-run", message: "در حال آماده‌سازی اجرای همین فایل…", log: "", outputDir: "" });
    let lock;
    try {
      const root = this.host.root();
      const filename = validateRunTarget(root, this.target);
      lock = acquireLock(root);
      if (!await this.host.prepareRun(filename, this.target.snapshot === true)) {
        this.publish({ phase: "cancelled", message: "اجرای تست لغو شد." });
        return;
      }
      if (this.closing) return;
      validateRunTarget(this.host.root(), this.target);
      const outputDir = path.join(root, "test-results", "studio-" + crypto.randomUUID());
      const args = testArguments(root, filename, outputDir);
      this.publish({ phase: "running", outputDir, message: "در حال اجرای همین فایل تست…" });
      const code = await this.execute(this.host.node(), args, root, lock, false);
      if (this.state.phase === "stopping") this.publish({ phase: "cancelled", message: "اجرای تست متوقف شد." });
      else if (code === 0) this.publish({ phase: "run-complete", message: "اجرای فایل با موفقیت پایان یافت؛ تعداد تست‌های passed یا skipped را در جزئیات ببینید." });
      else this.publish({ phase: "failed", message: `اجرای تست ناموفق بود (کد ${code}). جزئیات اجرا را بررسی کنید.` });
    } catch (error) { this.publish({ phase: "error", message: readableError(error) }); }
    finally { await this.finishOperation(lock); }
  }
  execute(node, args, root, lock, recording) {
    return new Promise((resolve, reject) => {
        const child = spawn(node, args, { cwd: root, shell: false, windowsHide: true, detached: process.platform !== "win32" });
        this.child = child;
        if (child.pid) lock.recorder(child.pid);
        const output = chunk => {
          const clean = chunk.replace(/\x1b\[[0-?]*[ -/]*[@-~]/gu, "");
          const log = (this.state.log + clean).slice(-16000);
          const ready = recording && log.includes("Recorder ready for");
          this.publish({ log, ...(ready && this.state.phase !== "stopping" ? { message: "ورود انجام شد. در Inspector روی Record بزنید و مراحل تست را ضبط کنید." } : {}) });
        };
        child.stdout.setEncoding("utf8"); child.stderr.setEncoding("utf8");
        child.stdout.on("data", output); child.stderr.on("data", output);
        child.on("error", reject);
        child.on("close", resolve);
      });
  }
  async finishOperation(lock) {
      // Also clean up if starting/logging the owned process itself failed.
      if (this.child && this.child.exitCode === null && this.child.pid && this.state.phase === "error") {
        try { await stopTree(this.child); }
        catch (error) {
          this.publish({ message: this.state.message + "\nتوقف عملیات انجام نشد: " + readableError(error) });
          // Keep the lock pointing to the live process rather than allow overlap.
          lock = null;
        }
      }
      this.child = null;
      if (lock) lock.release();
      this.busy = false;
      this.publish({ busy: false });
  }
  async stop() {
    if (!this.child) return;
    this.publish({ phase: "stopping", message: this.state.operation === "run" ? "در حال توقف اجرای تست…" : "در حال پایان دادن به ضبط…" });
    try { await stopTree(this.child); }
    catch (error) { this.publish({ phase: "error", message: readableError(error) }); }
  }
}

module.exports = { Studio, normalizeForm, generatorArgs, nodePath, runJson, readableError, acquireLock, stopTree, relativeFolder, validateRunTarget, testArguments };
