// Public Playwright Reporter API only. This file runs inside the project's CLI.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { within, hashFile } = require("./history.cjs");

class RegressionReporter {
  constructor() {
    this.folder = process.env.STUDIO_REGRESSION_DIR;
    if (!this.folder) throw new Error("Missing Studio run directory");
    this.sequence = 0;
    this.failed = false;
    this.fd = fs.openSync(path.join(this.folder, "events.ndjson"), "wx");
  }
  guard(action) {
    try { return action(); }
    catch (error) {
      this.failed = true;
      try { fs.writeFileSync(path.join(this.folder, "reporter-error.txt"), String(error.stack || error)); } catch {}
      process.stderr.write("Studio reporter error: " + error.message + "\n");
    }
  }
  event(type, data) {
    fs.writeSync(this.fd, JSON.stringify({ seq: ++this.sequence, type, time: new Date().toISOString(), ...data }) + "\n");
    // Completed results must survive an abrupt runner/extension shutdown.
    fs.fsyncSync(this.fd);
  }
  onBegin(config, suite) {
    this.guard(() => {
      const tests = suite.allTests().map(test => {
        const titles = [test.title];
        for (let parent = test.parent; parent && parent.type !== "file"; parent = parent.parent) {
          if (parent.type === "describe" && parent.title) titles.unshift(parent.title);
        }
        return {
          id: test.id, project: test.parent.project()?.name || "", title: test.title,
          titles, file: test.location.file,
          listFile: path.relative(config.rootDir, test.location.file).split(path.sep).join("/"),
          line: test.location.line, column: test.location.column, expectedStatus: test.expectedStatus,
          sourceHash: hashFile(test.location.file),
        };
      });
      if (process.env.STUDIO_REGRESSION_EXPECTED) {
        const expected = JSON.parse(fs.readFileSync(process.env.STUDIO_REGRESSION_EXPECTED, "utf8")).sort();
        const actual = tests.map(test => test.id).sort();
        if (JSON.stringify(expected) !== JSON.stringify(actual)) {
          throw new Error(`مجموعهٔ تست‌های Runner با انتخاب شما یکسان نیست (${actual.length}/${expected.length})؛ اجرا پیش از شروع تست متوقف شد.`);
        }
      }
      this.event("begin", { rootDir: config.rootDir, tests, workers: config.workers, version: config.version });
    });
    // Throwing from reporter hooks is swallowed by Playwright. Fail closed before any test body.
    if (this.failed) process.exit(2);
  }
  onTestBegin(test, result) {
    this.guard(() => this.event("testBegin", { testId: test.id, retry: result.retry, startTime: result.startTime, workerIndex: result.workerIndex }));
  }
  onTestEnd(test, result) {
    this.guard(() => {
      const attachments = result.attachments.map(attachment => {
        const item = { name: attachment.name, contentType: attachment.contentType };
        if (!attachment.path && !attachment.body) return item;
        const destination = path.join(this.folder, "attachments");
        fs.mkdirSync(destination, { recursive: true });
        const name = crypto.randomUUID() + (attachment.path ? path.extname(attachment.path) : ".bin");
        const filename = path.join(destination, name);
        if (attachment.path) {
          if (!fs.existsSync(attachment.path)) return { ...item, missing: true };
          fs.copyFileSync(attachment.path, filename, fs.constants.COPYFILE_EXCL);
        } else fs.writeFileSync(filename, attachment.body, { flag: "wx" });
        if (!within(this.folder, fs.realpathSync(filename))) throw new Error("Attachment escaped run directory");
        return { ...item, path: "attachments/" + name };
      });
      this.event("testEnd", { testId: test.id, expectedStatus: test.expectedStatus,
        result: { retry: result.retry, status: result.status, duration: result.duration, startTime: result.startTime,
          workerIndex: result.workerIndex, errors: result.errors, attachments } });
    });
  }
  onError(error) { this.guard(() => this.event("error", { error })); }
  onEnd(result) {
    this.guard(() => this.event("end", { status: result.status, duration: result.duration, startTime: result.startTime }));
    if (this.failed) return { status: "failed" };
  }
  onExit() { this.guard(() => fs.closeSync(this.fd)); }
  printsToStdio() { return false; }
}
module.exports = RegressionReporter;
