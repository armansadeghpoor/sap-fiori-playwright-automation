const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const repository = path.resolve(__dirname, "..", "..", "..");
function populate(root) {
  fs.mkdirSync(path.join(root, "tools", "recorder"), { recursive: true });
  fs.mkdirSync(path.join(root, "TestCases"), { recursive: true });
  for (const file of ["tools/new-test.cjs", "tools/recorder/profiles.cjs"]) {
    fs.copyFileSync(path.join(repository, file), path.join(root, file));
  }
  fs.copyFileSync(path.join(__dirname, "fake-recorder.cjs"), path.join(root, "tools", "recorder", "launch.cjs"));
  return root;
}
function fixture() { return populate(fs.mkdtempSync(path.join(os.tmpdir(), "pw-studio-test-"))); }
function withRunner(root) {
  fs.symlinkSync(path.join(repository, "node_modules"), path.join(root, "node_modules"), process.platform === "win32" ? "junction" : "dir");
  fs.writeFileSync(path.join(root, "playwright.config.cjs"), 'module.exports = { testDir: "./TestCases", timeout: 10000, retries: 0 };');
}
function cleanup(root) {
  const resolved = fs.realpathSync(root);
  if (path.dirname(resolved) !== fs.realpathSync(os.tmpdir()) || !path.basename(resolved).startsWith("pw-studio-test-")) throw new Error("Unsafe cleanup path");
  const dependencyLink = path.join(resolved, "node_modules");
  if (fs.existsSync(dependencyLink) && fs.lstatSync(dependencyLink).isSymbolicLink()) fs.unlinkSync(dependencyLink);
  fs.rmSync(resolved, { recursive: true });
}
module.exports = { fixture, populate, cleanup, repository, withRunner };
