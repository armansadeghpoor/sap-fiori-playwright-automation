const {test} = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const {createService} = require("../service/server.cjs");
const {Catalog} = require("../service/catalog.cjs");
const {acquireLock} = require("../studio.cjs");
const {tree, filtered, Selection} = require("../web/explorer-model.js");
const {explorerFixture,cleanup,fingerprint} = require("./explorer-fixture.cjs");
const digest = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
async function setup(t, catalogOptions) {
  const f=explorerFixture(), app=await createService({root:f.root,catalogOptions});
  t.after(async()=>{await app.close();cleanup(f.root);});
  const login=await fetch(app.origin+"/api/session",{method:"POST",headers:{Origin:app.origin,"Content-Type":"application/json","X-Studio-Request":"1"},body:JSON.stringify({code:app.pairingCode})});
  const cookie=login.headers.get("set-cookie").split(";")[0];
  const get=(url,options={})=>fetch(app.origin+url,{...options,headers:{Cookie:cookie,...options.headers}});
  const csrf=(await get("/api/session").then(r=>r.json())).csrf;
  const post=(url,value,headers={})=>get(url,{method:"POST",headers:{Origin:app.origin,"Content-Type":"application/json","X-Studio-CSRF":csrf,...headers},body:JSON.stringify(value)});
  const discover=async()=>{assert.equal((await post("/api/discovery",{})).status,202);await app.catalog.pending;return get("/catalog").then(r=>r.json());};
  return {...f,app,get,post,discover};
}
function synthetic(f) {return {rootDir:f.root,tests:[{id:"exact-id",project:"Chrome",title:"same",titles:["group","same"],file:f.source,listFile:path.relative(f.root,f.source),line:2,column:1,sourceHash:digest(f.source)}]};}
test("GET /catalog is inert, authenticated and independent of historical tests",async t=>{
  const f=await setup(t), before=fingerprint(f.root);
  for(let n=0;n<3;n++){const value=await f.get("/catalog").then(r=>r.json());assert.equal(value.phase,"idle");assert.equal(value.catalogRevision,null);assert.deepEqual(value.tests,[]);}
  assert.equal((await fetch(f.app.origin+"/catalog")).status,401);
  assert.deepEqual(fingerprint(f.root),before);assert.equal(fs.existsSync(path.join(f.root,"config-loaded")),false);
});
test("official existing manager discovery preserves Unicode, exact project identities and empty files/folders without running bodies",async t=>{
  const f=await setup(t), before=fingerprint(f.history.base), value=await f.discover();
  assert.equal(value.phase,"ready",value.error);assert.equal(value.testCount,8);assert.equal(value.fileCount,4);assert.equal(new Set(value.tests.map(x=>x.id)).size,8);
  const same=value.tests.filter(x=>x.title==="عنوان یکسان");assert.equal(same.length,4);assert.equal(new Set(same.map(x=>JSON.stringify([x.project,x.titles]))).size,4);
  assert.ok(value.entries.some(x=>x.kind==="folder"&&x.path==="empty folder"));assert.ok(value.entries.some(x=>x.kind==="file"&&x.path==="empty.spec.ts"));
  assert.ok(value.tests.every(x=>path.isAbsolute(x.file)&&fs.realpathSync(x.file)===x.file));assert.equal(fs.existsSync(path.join(f.root,"BODY_MUST_NOT_RUN")),false);
  assert.deepEqual(fingerprint(f.history.base),before);assert.equal(fs.existsSync(f.app.trash.base),false);
});
test("selection model resolves a Test/File/recursive Folder to exact IDs, partial states and independent filters",async t=>{
  const f=await setup(t), catalog=await f.discover(), root=tree(catalog), selection=new Selection();
  const folder=root.children.find(x=>x.kind==="folder"&&x.text.includes("پوشه")), file=folder.children.find(x=>x.kind==="file");
  selection.toggle([file.ids[0]],true,catalog);assert.equal(selection.state(file.ids).partial,true);assert.equal(selection.state(root.ids).partial,true);
  selection.toggle(folder.ids,true,catalog);assert.equal(selection.ids.size,6);assert.equal(selection.state(folder.ids).checked,true);
  const visible=filtered(root,{query:"Nested",project:"Mobile"},selection.ids);assert.equal(visible.children.length,1);assert.equal(selection.ids.size,6);
  selection.toggle(root.ids,true,catalog);assert.equal(selection.ids.size,8);
  const result=await f.post("/api/selection/resolve",selection.payload(catalog)).then(r=>r.json());assert.equal(result.tests.length,8);assert.deepEqual(result.ids,selection.payload(catalog).ids);
  assert.equal((await f.post("/api/selection/resolve",{catalogRevision:catalog.catalogRevision,ids:["A"]})).status,409);
  selection.clear();assert.equal(selection.ids.size,0);assert.equal(selection.revision,null);
});
test("refresh creates a new revision even for unchanged IDs; old selections are never silently rebound",async t=>{
  const f=await setup(t), first=await f.discover(), selection=new Selection();selection.toggle([first.tests[0].id],true,first);
  const second=await f.discover();assert.notEqual(first.catalogRevision,second.catalogRevision);assert.deepEqual(first.tests.map(x=>x.id),second.tests.map(x=>x.id));
  assert.equal(selection.stale(second),true);assert.throws(()=>selection.payload(second),/انتخاب/);assert.equal((await f.post("/api/selection/resolve",{catalogRevision:first.catalogRevision,ids:[first.tests[0].id]})).status,409);
});
test("source change, file addition/removal, empty folder and config changes invalidate Catalog without triggering discovery",async t=>{
  const f=await setup(t);let value=await f.discover();const loaded=fs.readFileSync(path.join(f.root,"config-loaded"),"utf8");
  fs.appendFileSync(f.source,"// changed\n");assert.equal((await f.get("/catalog").then(r=>r.json())).stale,true);
  assert.equal((await f.post("/api/selection/resolve",{catalogRevision:value.catalogRevision,ids:[value.tests[0].id]})).status,409);
  assert.equal(fs.readFileSync(path.join(f.root,"config-loaded"),"utf8"),loaded);
  value=await f.discover();fs.unlinkSync(f.nested);assert.equal((await f.get("/catalog").then(r=>r.json())).stale,true);
  value=await f.discover();assert.equal(value.testCount,6);
  const newFile=path.join(f.root,"TestCases","new.spec.ts");fs.writeFileSync(newFile,"// empty");assert.equal((await f.get("/catalog").then(r=>r.json())).stale,true);
  value=await f.discover();fs.mkdirSync(path.join(f.root,"TestCases","new folder"));assert.equal((await f.get("/catalog").then(r=>r.json())).stale,true);
  value=await f.discover();fs.appendFileSync(f.config,"\n// config changed");assert.equal((await f.get("/catalog").then(r=>r.json())).stale,true);
});
test("Discovery and Selection require CSRF/Origin and reject arbitrary paths, commands, duplicates and unknown IDs",async t=>{
  const f=await setup(t);
  for(const route of ["/api/discovery","/api/selection/resolve"]){assert.equal((await f.post(route,{}, {"X-Studio-CSRF":"bad"})).status,403);assert.equal((await f.post(route,{}, {Origin:"https://evil.example"})).status,403);}
  for(const input of [null,[],{path:"../../secret"},{command:"node"},{project:"outside"}]) assert.equal((await f.post("/api/discovery",input)).status,400);
  assert.equal((await f.get("/catalog?path=../../secret")).status,400);
  const value=await f.discover(), id=value.tests[0].id;
  for(const input of [{ids:[id,id],catalogRevision:value.catalogRevision},{ids:[id],catalogRevision:value.catalogRevision,path:"../"},{ids:[],catalogRevision:value.catalogRevision}]) assert.equal((await f.post("/api/selection/resolve",input)).status,400);
  for(const route of ["/api/run","/api/stop","/api/restoreSnapshot"])assert.equal((await f.post(route,{})).status,405);
});
test("concurrent discovery is deduplicated, shared lock excludes History confirm and legacy Studio, then releases",async t=>{
  let release, calls=0, f;const gate=new Promise(resolve=>{release=resolve;});
  f=await setup(t,{discover:async()=>{calls++;await gate;return synthetic(f);}});
  const before=fingerprint(f.history.base), plan=await f.post("/api/history/plan",{mode:"selected",ids:[f.failed.manifest.id]}).then(r=>r.json());
  assert.equal((await f.post("/api/discovery",{})).status,202);
  try {
    assert.equal((await f.get("/catalog").then(r=>r.json())).phase,"discovering");assert.equal((await f.post("/api/discovery",{})).status,409);assert.equal(calls,1);
    assert.throws(()=>acquireLock(f.root),/Studio/);assert.equal((await f.post("/api/history/confirm",{planId:plan.planId,confirm:true})).status,409);assert.deepEqual(fingerprint(f.history.base),before);
  }finally{release();await f.app.catalog.pending;}
  const revision=f.app.catalog.get().catalogRevision;
  const newPlan=await f.post("/api/history/plan",{mode:"selected",ids:[f.failed.manifest.id]}).then(r=>r.json());
  const moved=await f.post("/api/history/confirm",{planId:newPlan.planId,confirm:true}).then(r=>r.json());assert.equal(moved.moved.length,1);
  const trash=f.app.trash.list().find(x=>x.runId===f.failed.manifest.id), restore=await f.post("/api/history/restore-plan",{trashId:trash.id}).then(r=>r.json());
  assert.equal((await f.post("/api/history/confirm",{planId:restore.planId,confirm:true}).then(r=>r.json())).moved.length,1);
  assert.deepEqual(fingerprint(f.history.base),before);assert.equal(f.app.catalog.get().catalogRevision,revision);assert.equal(f.app.catalog.get().stale,false);
});
test("existing execution lock blocks discovery without resetting catalog or recovering owner",async t=>{
  const f=await setup(t), lock=acquireLock(f.root);try{assert.equal((await f.post("/api/discovery",{})).status,409);assert.equal(f.app.catalog.get().phase,"idle");}finally{lock.release();}
});
test("invalid canonical paths, duplicate exact IDs and historical-only identities never enter Catalog",async t=>{
  const f=await setup(t);let begin=synthetic(f);const catalog=new Catalog(f.root,{discover:async()=>begin});t.after(()=>catalog.close());
  for(const bad of [ {...begin.tests[0],file:path.join(f.root,"outside.spec.ts")}, {...begin.tests[0],listFile:"../../outside.spec.ts"} ]) {
    begin={rootDir:f.root,tests:[bad]};catalog.start({});await catalog.pending;assert.equal(catalog.get().phase,"error");assert.equal(catalog.get().catalogRevision,null);
  }
  begin=synthetic(f);begin.tests.push({...begin.tests[0]});catalog.start({});await catalog.pending;assert.equal(catalog.get().phase,"error");
});
test("Discovery/source race rejects result, does not assign revision, and remains recoverable",async t=>{
  let f;f=await setup(t,{discover:async()=>{const begin=synthetic(f);fs.appendFileSync(f.source,"// race\n");return begin;}});
  const value=await f.discover();assert.equal(value.phase,"error");assert.equal(value.catalogRevision,null);assert.match(value.error,/تغییر/);
});
test("Junction traversal is refused before loading any config",async t=>{
  const f=await setup(t), junction=path.join(f.root,"TestCases","escape");fs.symlinkSync(path.join(f.root,"tools"),junction,process.platform==="win32"?"junction":"dir");
  try{assert.equal((await f.post("/api/discovery",{})).status,409);assert.equal(fs.existsSync(path.join(f.root,"config-loaded")),false);}finally{fs.unlinkSync(junction);}
});
test("syntax discovery errors retain last catalog only as non-runnable; explicit retry recovers",async t=>{
  const f=await setup(t), first=await f.discover(), original=fs.readFileSync(f.other);
  fs.writeFileSync(f.other,"const = syntax error;");let value=await f.discover();assert.equal(value.phase,"error");assert.equal(value.catalogRevision,first.catalogRevision);assert.equal(value.stale,true);
  assert.equal((await f.post("/api/selection/resolve",{catalogRevision:first.catalogRevision,ids:[first.tests[0].id]})).status,409);
  fs.writeFileSync(f.other,original);value=await f.discover();assert.equal(value.phase,"ready",value.error);assert.equal(value.stale,false);
});
test("empty catalog succeeds through the optional official flag while legacy discovery keeps its default",async t=>{
  const f=await setup(t);for(const file of [f.source,f.nested,f.other,f.empty])fs.renameSync(file,file+".disabled");
  const value=await f.discover();assert.equal(value.phase,"ready",value.error);assert.equal(value.testCount,0);assert.equal(value.fileCount,0);assert.equal(value.stale,false);
  const {RegressionManager}=require("../regression/manager.cjs"), manager=new RegressionManager({root:()=>f.root,node:()=>process.execPath});
  const lock=acquireLock(f.root);try{await assert.rejects(manager.catalog(f.root,lock),/Discovery ناموفق/);}finally{lock.release();}
});
test("closing service stops only its own in-flight discovery and releases its lock",async t=>{
  const f=await setup(t);
  fs.writeFileSync(f.config,`require('node:fs').writeFileSync(require('node:path').join(__dirname,'config-waiting'),'1');module.exports=new Promise(resolve=>setTimeout(()=>resolve({testDir:'./TestCases'}),30000));`);
  assert.equal((await f.post("/api/discovery",{})).status,202);
  const end=Date.now()+12000;while(!fs.existsSync(path.join(f.root,"config-waiting"))){if(Date.now()>end)throw Error("Owned discovery never started");await new Promise(resolve=>setTimeout(resolve,30));}
  await f.app.close();assert.equal(f.app.catalog.pending,null);assert.equal(f.app.catalog.value.phase,"error");
  const lock=acquireLock(f.root);lock.release();assert.equal(fs.existsSync(path.join(f.root,"BODY_MUST_NOT_RUN")),false);
});
test("unverified owned shutdown retains the lock and blocks rediscovery instead of guessing ownership",async t=>{
  let f;f=await setup(t,{discover:async()=>{
    f.app.catalog.manager={busy:true,child:{exitCode:null},stop:async()=>{throw Error("synthetic shutdown failure");}};
    return synthetic(f);
  }});
  try {
    const value=await f.discover();assert.equal(value.phase,"error");assert.match(value.error,/قفل حفظ/);
    assert.throws(()=>acquireLock(f.root),/Studio/);assert.equal((await f.post("/api/discovery",{})).status,409);
  }finally{if(f.app.catalog.manager)f.app.catalog.manager.child=null;await f.app.catalog.cleanupOwned();}
  const lock=acquireLock(f.root);lock.release();
});
