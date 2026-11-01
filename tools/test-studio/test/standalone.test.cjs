const {test} = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const http = require("node:http");
const { spawn } = require("node:child_process");
const { History } = require("../regression/history.cjs");
const { createService } = require("../service/server.cjs");
const { claim } = require("../service/start.cjs");
const { fixture, cleanup, fingerprint } = require("./standalone-fixture.cjs");
const rawStatus = (origin, headers) => new Promise((resolve, reject) => {
  const request = http.request(origin + "/api/runs", { headers }, response => { response.resume(); response.on("end", () => resolve(response.statusCode)); });
  request.on("error", reject); request.end();
});
async function setup(t) {
  const f = fixture(), app = await createService({root:f.root});
  t.after(async()=>{await app.close();cleanup(f.root);});
  const login = await fetch(app.origin + "/api/session", {method:"POST",headers:{Origin:app.origin,"Content-Type":"application/json","X-Studio-Request":"1"},body:JSON.stringify({code:app.pairingCode})});
  assert.equal(login.status,200); const cookie = login.headers.get("set-cookie").split(";")[0];
  const get = (url, options={})=>fetch(app.origin+url,{...options,headers:{Cookie:cookie,...options.headers}});
  return {...f,app,cookie,get};
}
test("13 existing schema-v1 runs, exact source identity and immutable read-only access", async t=>{
  const f=await setup(t), before=fingerprint(f.root);
  assert.equal(f.app.server.address().address,"127.0.0.1");
  const list=await f.get("/api/runs").then(r=>r.json()); assert.equal(list.runs.length,13);
  const detail=await f.get("/api/runs/"+f.failed.manifest.id).then(r=>r.json());
  assert.deepEqual(detail.counts,{passed:1,failed:1,skipped:1,interrupted:0,notRun:0,unfinished:0});
  const source=await f.get(`/api/runs/${detail.id}/tests/A/source`).then(r=>r.json()); assert.equal(source.line,3);assert.equal(source.changed,false);assert.match(source.content,/<img/);
  assert.equal((await f.get(`/api/runs/${detail.id}/tests/B/source`).then(r=>r.json())).line,2);
  const incomplete=await f.get("/api/runs/"+f.incomplete.manifest.id).then(r=>r.json());
  assert.equal(incomplete.status,"incomplete");assert.equal(incomplete.counts.unfinished,1);assert.equal(incomplete.damaged,true);
  assert.equal(f.history.detail(f.incomplete.manifest.id).summary.status,"running","legacy default retains old behavior for live owner");
  assert.deepEqual(fingerprint(f.root),before);
  assert.equal(Object.keys(require.cache).some(file=>/[\\/]regression[\\/](manager|reporter)\.cjs$/u.test(file)),false,"no execution core loaded");
});
test("empty History reads create no folders, write methods fail, default writer remains compatible", async()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),"studio-ro-"));let app;
  try { const before=fingerprint(root);const store=new History(root,{readOnly:true});assert.deepEqual(store.list(),[]);assert.throws(()=>store.create({}),/فقط/);assert.throws(()=>store.finalize({},{}),/فقط/);
    app=await createService({root});assert.deepEqual(fingerprint(root),before);await app.close();app=null;
    const legacy=new History(root);assert.ok(fs.existsSync(legacy.base));
  }finally{if(app)await app.close();cleanup(root);}
});
test("unauthorized, hostile Host/Origin, malformed paths and all execution requests are rejected", async t=>{
  const f=await setup(t),before=fingerprint(f.root);
  const status=await f.get("/api/session");assert.equal(status.headers.get("access-control-allow-origin"),null);assert.match(status.headers.get("content-security-policy"),/default-src 'none'/);assert.equal(status.headers.get("cache-control"),"no-store");assert.equal((await status.text()).includes(f.app.pairingCode),false);
  assert.equal((await fetch(f.app.origin+"/api/runs")).status,401);
  for(const headers of [{Origin:"https://evil.example"},{Origin:"null"},{Host:"evil.example"},{"Sec-Fetch-Site":"same-site"}]) assert.equal(await rawStatus(f.app.origin,{Cookie:f.cookie,...headers}),403,JSON.stringify(headers));
  assert.equal((await fetch(f.app.origin+"/api/session",{method:"POST",headers:{Origin:f.app.origin,"Content-Type":"application/json"},body:JSON.stringify({code:f.app.pairingCode})})).status,403);
  for(const route of ["/api/run","/api/rerun","/api/stop","/api/restoreSnapshot","/api/open-source"]) assert.equal((await f.get(route,{method:"POST",headers:{Origin:f.app.origin}})).status,405);
  for(const route of ["/api/runs?path=C:/Windows/win.ini","/api/runs/%2e%2e%5csecret","/report/index.html","/.env","/api/command"]) assert.ok([400,404].includes((await f.get(route)).status),route);
  assert.deepEqual(fingerprint(f.root),before);
});
test("allowlisted artifacts support range while HTML, arbitrary files and symlink escapes fail", async t=>{
  const f=await setup(t),id=f.failed.manifest.id;
  const detail=await f.get("/api/runs/"+id).then(r=>r.json());const attachments=detail.tests[0].attachments;
  assert.equal(attachments.length,3);
  const video=attachments.find(a=>a.kind==="video");const url=`/api/runs/${id}/artifacts/${video.id}`;
  const partial=await f.get(url,{headers:{Range:"bytes=1-3"}});assert.equal(partial.status,206);assert.equal(await partial.text(),"ide");
  assert.equal((await f.get(url,{headers:{Range:"bytes=1000-2000"}})).status,416);
  const note=attachments.find(a=>a.name==="note");assert.match((await f.get(`/api/runs/${id}/artifacts/${note.id}`)).headers.get("content-disposition"),/^attachment/);
  assert.equal((await f.get(`/api/runs/${id}/artifacts/${"0".repeat(24)}`)).status,404);
  const artifact=path.join(f.failed.folder,"attachments"),outside=path.join(f.root,"outside-artifacts");fs.renameSync(artifact,outside);fs.symlinkSync(outside,artifact,process.platform==="win32"?"junction":"dir");
  assert.equal((await f.get(`/api/runs/${id}/artifacts/${note.id}`)).status,404);
});
test("Source changes, deletion, unknown identity and outside Spec or junction paths are safe", async t=>{
  const f=await setup(t),id=f.failed.manifest.id,url=`/api/runs/${id}/tests/A/source`;
  fs.appendFileSync(f.source,"\n// changed");assert.equal((await f.get(url).then(r=>r.json())).changed,true);
  assert.equal((await f.get(`/api/runs/${id}/tests/unknown/source`)).status,404);
  const outside=path.join(f.root,"outside.spec.ts");fs.writeFileSync(outside,"// private");
  const file=path.join(f.failed.folder,"manifest.json"),manifest=JSON.parse(fs.readFileSync(file,"utf8"));manifest.tests[0].file=outside;fs.writeFileSync(file,JSON.stringify(manifest));assert.equal((await f.get(url)).status,404);
  const link=path.join(f.root,"TestCases","link");fs.symlinkSync(f.root,link,process.platform==="win32"?"junction":"dir");manifest.tests[0].file=path.join(link,"outside.spec.ts");fs.writeFileSync(file,JSON.stringify(manifest));assert.equal((await f.get(url)).status,404);
  fs.unlinkSync(link);manifest.tests[0].file=f.source;fs.writeFileSync(file,JSON.stringify(manifest));fs.unlinkSync(f.source);assert.equal((await f.get(url)).status,404);
});
test("archive junctions and metadata symlinks do not expose external files", async t=>{
  const f=await setup(t),file=path.join(f.failed.folder,"summary.json");fs.unlinkSync(file);fs.symlinkSync(path.join(f.root,"TestCases"),file,process.platform==="win32"?"junction":"dir");
  assert.equal((await f.get("/api/runs/"+f.failed.manifest.id)).status,404);
  assert.equal((await f.get("/api/runs").then(r=>r.json())).runs.find(r=>r.id===f.failed.manifest.id).status,"unreadable");
});
test("session expiry and bounded pairing failures reject access", async t=>{
  const f=fixture(),app=await createService({root:f.root,sessionLifetime:25});t.after(async()=>{await app.close();cleanup(f.root);});
  const post=code=>fetch(app.origin+"/api/session",{method:"POST",headers:{Origin:app.origin,"Content-Type":"application/json","X-Studio-Request":"1"},body:JSON.stringify({code})});
  const login=await post(app.pairingCode),cookie=login.headers.get("set-cookie").split(";")[0];await new Promise(r=>setTimeout(r,40));assert.equal((await fetch(app.origin+"/api/runs",{headers:{Cookie:cookie}})).status,401);
  for(let i=0;i<10;i++)assert.equal((await post("wrong")).status,401);assert.equal((await post("wrong")).status,429);
});
test("singleton never takes over or kills an unknown owner; own normal release is safe",()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),"studio-ro-"));
  try{const lease=claim(root,root);assert.throws(()=>claim(root,root),/نامشخص/);lease.release();const next=claim(root,root);next.release();assert.deepEqual(fs.readdirSync(root),[]);}finally{cleanup(root);}
});
test("documented launcher runs as an independent Node process without VS Code", async()=>{
  const f=fixture();
  const child=spawn(process.execPath,[path.resolve(__dirname,"../service/start.cjs"),"--root",f.root,"--descriptor-directory",f.root,"--private-directory",path.join(f.root,"private")],{windowsHide:true,stdio:["ignore","pipe","pipe"],env:{...process.env,TEMP:f.root,TMP:f.root}});
  const closed=new Promise(resolve=>child.once("close",resolve));let output="",launchError;
  child.on("error",error=>{launchError=error;});child.stdout.setEncoding("utf8");child.stdout.on("data",chunk=>{output+=chunk;});child.stderr.resume();
  try{
    const deadline=Date.now()+10000;
    while(!/http:\/\/127\.0\.0\.1:\d+/u.test(output)){if(launchError)throw launchError;if(Date.now()>deadline||child.exitCode!==null)throw new Error("Independent launcher did not become ready");await new Promise(resolve=>setTimeout(resolve,50));}
    assert.doesNotMatch(output,/Connection code|[0-9a-f]{64}/u);
    let url;const instance=await require('../service/launcher.cjs').launch(f.root,{extensionHome:f.root,descriptorDirectory:f.root,privateDirectory:path.join(f.root,'private'),open:value=>{url=value;}});
    const origin=instance.origin,token=url.split('#bootstrap=')[1];
    const response=await fetch(origin+"/api/bootstrap",{method:"POST",headers:{Origin:origin,"Content-Type":"application/json","X-Studio-Request":"1"},body:JSON.stringify({token})});
    assert.equal(response.status,200);const cookie=response.headers.get("set-cookie").split(";")[0];
    assert.equal((await fetch(origin+"/api/runs",{headers:{Cookie:cookie}}).then(r=>r.json())).runs.length,13);
  }finally{if(child.exitCode===null)child.kill();await closed;cleanup(f.root);}
});
