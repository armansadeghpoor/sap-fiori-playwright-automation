// Isolated integration fixture: no browser, authentication, or Snapshot API.
const { spawn } = require("node:child_process");
console.log(JSON.stringify({ arguments: process.argv.slice(2) }));
if (process.argv.includes("--user=user2")) {
  console.error("Fixture: authentication unavailable");
  process.exit(7);
}
if (process.argv.includes("--user=user1")) {
  const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { stdio: "ignore" });
  console.log("descendant=" + child.pid);
  setInterval(() => {}, 1000);
}
console.log("Recorder ready for fixture");
