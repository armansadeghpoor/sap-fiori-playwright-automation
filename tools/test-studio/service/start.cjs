// Independent foreground Node service. CLI collection is lazy and explicitly requested only.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { createService } = require("./server.cjs");
const native = require("./native.cjs");

function claim(root, directory = os.tmpdir()) {
  const canonical = fs.realpathSync(root), key = crypto.createHash("sha256").update(process.platform === "win32" ? canonical.toLowerCase() : canonical).digest("hex").slice(0, 24);
  const filename = path.join(directory, "pw-studio-readonly-" + key + ".json"), instanceId = crypto.randomUUID();
  const releaseControl=require("./descriptor.cjs").guard(filename);
  let descriptor;
  try {
  try { descriptor = fs.openSync(filename, "wx", 0o600); }
  catch (error) {
    if (error.code !== "EEXIST") throw error;
    let address = "";
    try { const old = JSON.parse(fs.readFileSync(filename, "utf8")); if (Number.isInteger(old.port) && old.port > 0 && old.port < 65536) address = " http://127.0.0.1:" + old.port; } catch {}
    throw new Error("یک Instance ثبت‌شده وجود دارد." + address + "\nمالکیت آن ممکن است نامشخص باشد؛ هیچ Process متوقف یا قفلی خودکار حذف نشد. بررسی دستی: " + filename);
  }
  let processIdentity = null;
  const write = (port, value) => { if(value) processIdentity=value; fs.ftruncateSync(descriptor); fs.writeSync(descriptor, JSON.stringify({ instanceId, pid: process.pid, port, startedAt: new Date().toISOString(), protocolVersion: 2, projectKey: key, identity: processIdentity }), 0, "utf8"); fs.fsyncSync(descriptor); };
  write(null);
  return { write, instanceId, release() { if (descriptor === undefined) return; fs.closeSync(descriptor); descriptor = undefined; try { if (JSON.parse(fs.readFileSync(filename, "utf8")).instanceId === instanceId) fs.unlinkSync(filename); } catch {} } };
  } finally { releaseControl(); }
}
async function main() {
  const args = process.argv.slice(2), options={};
  for(let i=0;i<args.length;i++){
    if(args[i]==='--background')options.background=true;
    else if(['--root','--descriptor-directory','--private-directory'].includes(args[i])&&path.isAbsolute(args[i+1]||''))options[args[i].slice(2)]=args[++i];
    else throw Error('Invalid service startup arguments.');
  }
  const root = fs.realpathSync(options.root || path.resolve(__dirname, "../../.."));
  if (!fs.statSync(path.join(root, "TestCases")).isDirectory()) throw new Error("پروژه باید TestCases داشته باشد.");
  let instance;
  const claimDeadline=Date.now()+10000;
  while(!instance){try{instance=claim(root,options["descriptor-directory"]);}catch(error){if(error.code!=='DESCRIPTOR_BUSY'||Date.now()>=claimDeadline)throw error;await new Promise(resolve=>setTimeout(resolve,50));}}
  let service;
  try {
    const close = async () => { if (closing) return; closing = true; await service.close(); instance.release(); };
    let closing = false;
    const privateDirectory=native.secureDirectory(options['private-directory']||native.privatePath(root));
    service = await createService({ root, instanceId:instance.instanceId, privateDirectory, onStop:close }); instance.write(service.server.address().port,native.identity(process.pid));
    if(!options.background) console.log("Playwright Test Studio — Execution Dashboard\n" + service.origin);
    if(!options.background) console.log("Discovery is explicit. Use the Studio Shortcut to sign in. No test execution occurs on startup. Browser close does not stop this service. Ctrl+C ends only owned operations.");
    process.once("SIGINT", () => void close()); process.once("SIGTERM", () => void close()); process.once("exit", () => instance.release());
  } catch (error) { instance.release(); if (service) await service.close(); throw error; }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { claim };
