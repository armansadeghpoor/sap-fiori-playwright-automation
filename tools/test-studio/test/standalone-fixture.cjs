const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { History, hashFile } = require("../regression/history.cjs");
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "studio-ro-"));
  fs.mkdirSync(path.join(root, "TestCases", "پوشه فارسی با فاصله"), { recursive: true });
  const source = path.join(root, "TestCases", "پوشه فارسی با فاصله", "سناریو (اول).spec.ts");
  fs.writeFileSync(source, '// read-only fixture; never imported or executed\nconst label = "<img src=x>";\n// assertion location\n// second test\n');
  const history = new History(root), runs = [];
  for (let index = 0; index < 13; index++) {
    const tests = ["A", "B", "C"].map((id, i) => ({ id, title: "scenario " + id, titles: ["group", "scenario " + id], project: "Chrome", file: source,
      listFile: "TestCases/پوشه فارسی با فاصله/سناریو (اول).spec.ts", line: i + 1, column: 1, sourceHash: hashFile(source) }));
    const run = history.create({ scope: "folder", label: "Run فارسی " + index, tests }); runs.push(run);
    if (index === 12) {
      fs.writeFileSync(path.join(run.folder, "events.ndjson"), JSON.stringify({ type: "testBegin", testId: "A", seq: 1 }) + "\n{" );
      continue;
    }
    fs.mkdirSync(path.join(run.folder, "attachments"));
    fs.writeFileSync(path.join(run.folder, "attachments", "image.png"), Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jbeYAAAAASUVORK5CYII=", "base64"));
    fs.writeFileSync(path.join(run.folder, "attachments", "video.webm"), "video fixture range bytes");
    fs.writeFileSync(path.join(run.folder, "attachments", "note.txt"), "allowed attachment");
    const attachments = [{name:"screenshot",contentType:"image/png",path:"attachments/image.png"}, {name:"video",contentType:"video/webm",path:"attachments/video.webm"}, {name:"note",contentType:"text/plain",path:"attachments/note.txt"}, {name:"unsafe",contentType:"text/html",path:"report/index.html"}];
    history.finalize(run, { status: "failed", complete: true, duration: 1500, tests: tests.map((test, i) => ({ ...test, outcome: ["failed", "passed", "skipped"][i], duration: 500,
      attempts: i === 0 ? [{ retry:0, status:"failed", errors:[{message:"fixture failure <img src=x onerror=alert(1)>", stack:"Error\n at " + source + ":3:1", location:{file:source,line:3,column:1}}],attachments }] : [] })) });
  }
  return { root, source, runs, history, failed: runs[0], incomplete: runs[12] };
}
function cleanup(root) {
  const resolved = fs.realpathSync(root);
  if (path.dirname(resolved) !== fs.realpathSync(os.tmpdir()) || !path.basename(resolved).startsWith("studio-ro-")) throw new Error("Unsafe temporary cleanup");
  fs.rmSync(resolved, { recursive: true });
}
function fingerprint(root) {
  const crypto = require("node:crypto"), entries = [];
  function visit(dir) { for (const entry of fs.readdirSync(dir, {withFileTypes:true})) { const file=path.join(dir,entry.name); if(entry.isSymbolicLink()) entries.push([path.relative(root,file),"link"]); else if(entry.isDirectory()) visit(file); else entries.push([path.relative(root,file),crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")]); } }
  visit(root); return entries.sort((a,b)=>a[0].localeCompare(b[0]));
}
module.exports = { fixture, cleanup, fingerprint };
