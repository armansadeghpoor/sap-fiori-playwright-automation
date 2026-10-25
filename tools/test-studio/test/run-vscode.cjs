const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { fixture, cleanup } = require("./fixture.cjs");
const code = process.argv[2];
if (!code || !path.isAbsolute(code)) throw new Error("Pass the absolute path to Code.exe.");
const root = fixture();
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;
try {
  const entries = [process.argv[3] ? path.resolve(process.argv[3]) : path.join(__dirname, "vscode.cjs")];
  if (process.argv[4]) entries.push(path.resolve(process.argv[4]));
  for (const [index, entry] of entries.entries()) {
    const result = spawnSync(code, [
      "--new-window", "--disable-workspace-trust", "--skip-welcome", "--skip-release-notes",
      "--user-data-dir=" + path.join(root, "vscode-data"),
      "--extensions-dir=" + path.join(root, "extensions"),
      "--extensionDevelopmentPath=" + path.resolve(__dirname, ".."),
      "--extensionTestsPath=" + entry, root,
    ], { env, windowsHide: true, encoding: "utf8", timeout: 90000 });
    if (result.error) throw result.error;
    const report = path.join(root, index === 0 ? "vscode-validation.json" : "vscode-reload-validation.json");
    if (result.status !== 0 || !fs.existsSync(report)) throw new Error(result.stdout + result.stderr);
    console.log(fs.readFileSync(report, "utf8"));
  }
} finally {
  // Keep the isolated profile on a failure if VS Code is still releasing its files.
  try { cleanup(root); } catch { console.error("Temporary validation directory retained: " + root); }
}
