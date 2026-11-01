const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const {createService}=require('../service/server.cjs');
const {explorerFixture,cleanup,fingerprint}=require('./explorer-fixture.cjs');
const {acquireLock}=require('../studio.cjs');
const {tree}=require('../web/explorer-model.js');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn){for(let i=0;i<600;i++){if(fn())return;await sleep(50);}throw Error('Operation timeout');}
async function setup(t,options={}) {
 const f=explorerFixture();
 for(const file of [f.source,f.nested,f.other]){
  let source=fs.readFileSync(file,'utf8');
  source=source.replaceAll(/\(\) => \{ require\('node:fs'\).*?throw Error\('BODY_EXECUTED'\); \}/g,`async ({},info) => { const fs=require('node:fs');fs.appendFileSync(${JSON.stringify(path.join(f.root,'bodies'))},info.testId+'\\n'); if(info.title==='Other test' && !fs.existsSync(${JSON.stringify(path.join(f.root,'allow'))})) throw Error('synthetic failure'); if(fs.existsSync(${JSON.stringify(path.join(f.root,'slow'))})) await new Promise(r=>setTimeout(r,10000)); }`);
  fs.writeFileSync(file,source);
 }
 const app=await createService({root:f.root,executionOptions:options});
 t.after(async()=>{await app.close();cleanup(f.root);});
 async function client(){
  const login=await fetch(app.origin+'/api/session',{method:'POST',headers:{Origin:app.origin,'Content-Type':'application/json','X-Studio-Request':'1'},body:JSON.stringify({code:app.pairingCode})});
  const cookie=login.headers.get('set-cookie').split(';')[0];
  const get=url=>fetch(app.origin+url,{headers:{Cookie:cookie}});
  const session=await get('/api/session').then(r=>r.json());
  const post=(url,value,headers={})=>fetch(app.origin+url,{method:'POST',headers:{Cookie:cookie,Origin:app.origin,'Content-Type':'application/json','X-Studio-CSRF':session.csrf,...headers},body:JSON.stringify(value)});
  return {get,post};
 }
 const c=await client();
 async function discover(){app.catalog.start({});await app.catalog.pending;const catalog=app.catalog.get();assert.equal(catalog.phase,'ready',catalog.error);return catalog;}
 const catalog=await discover();
 const input=(ids,scope='selection')=>({requestId:crypto.randomUUID(),scope,catalogRevision:catalog.catalogRevision,ids,headed:false});
 async function confirm(kind,accept=true){await until(()=>app.execution.current.phase==='Awaiting Confirmation');const op=await c.get('/api/execution').then(r=>r.json());assert.equal(op.confirmation.kind,kind);const r=await c.post('/api/execution/confirm',{operationId:op.id,token:op.confirmation.token,confirm:accept});assert.equal(r.status,200);return op;}
 async function run(value){const r=await c.post('/api/execution/start',value);assert.equal(r.status,202,await r.text());await confirm('execution');await confirm('snapshot');await app.execution.current.pending;return app.execution.current;}
 const bodies=()=>fs.existsSync(path.join(f.root,'bodies'))?fs.readFileSync(path.join(f.root,'bodies'),'utf8').trim().split('\n'):[];
 return {...f,app,...c,client,catalog,input,confirm,run,bodies,discover};
}
test('exact single/file/folder/multi-file/suite across Persian duplicate titles and projects',async t=>{
 const f=await setup(t);const root=tree(f.catalog);
 const folder=root.children.find(n=>n.kind==='folder'&&n.text.includes('پوشه'));
 const file=folder.children.find(n=>n.kind==='file');
 for(const [ids,scope] of [[[f.catalog.tests[0].id],'selection'],[file.ids,'selection'],[folder.ids,'selection'],[[file.ids[0],f.catalog.tests.find(t=>t.title==='Other test').id],'selection'],[root.ids,'suite']]){
  const before=f.bodies().length;const op=await f.run(f.input(ids,scope));assert.ok(['Completed','Failed'].includes(op.phase),JSON.stringify(op.error));
  assert.deepEqual(f.bodies().slice(before).sort(),[...ids].sort());
  const run=f.app.repository.raw(op.runId);assert.deepEqual(run.manifest.tests.map(t=>t.id).sort(),[...ids].sort());
 }
});
test('idempotency, two sessions, CSRF, explicit confirmations, stop targeting and shared Extension/Trash lock',async t=>{
 const f=await setup(t),other=await f.client(),value=f.input([f.catalog.tests[0].id]);
 assert.equal((await f.post('/api/execution/start',value,{'X-Studio-CSRF':'bad'})).status,403);
 assert.equal((await f.post('/api/execution/start',{...value,path:'../x'})).status,400);
 const start=await f.post('/api/execution/start',value).then(r=>r.json());
 assert.equal((await f.post('/api/execution/start',value).then(r=>r.json())).id,start.id);
 assert.equal((await other.post('/api/execution/start',f.input(value.ids))).status,409);
 assert.equal((await other.get('/api/execution').then(r=>r.json())).canConfirm,false);
 await until(()=>f.app.execution.current.phase==='Awaiting Confirmation');
 assert.throws(()=>acquireLock(f.root));
 const plan=f.app.trash.plan({}, {mode:'clear'});assert.throws(()=>f.app.trash.confirm({}, {planId:plan.planId,confirm:true}));
 assert.equal((await f.post('/api/execution/stop',{operationId:crypto.randomUUID()})).status,409);
 const confirmation=await f.confirm('execution',false);await f.app.execution.current.pending;
 assert.equal(f.bodies().length,0);assert.equal(f.app.execution.current.phase,'Interrupted');
 assert.equal((await f.post('/api/execution/confirm',{operationId:start.id,token:confirmation.confirmation.token,confirm:true})).status,409);
 assert.equal((await f.post('/api/execution/start',value).then(r=>r.json())).id,start.id);
 const lock=acquireLock(f.root);try {await f.post('/api/execution/start',f.input(value.ids));await f.app.execution.current.pending;assert.equal(f.app.execution.current.phase,'Ownership Unknown');}finally{lock.release();}
});
test('expired or rejected independent Snapshot confirmation never executes tests',async t=>{
 const f=await setup(t,{ttl:1000});await f.post('/api/execution/start',f.input([f.catalog.tests[0].id]));
 await f.confirm('execution');await f.confirm('snapshot',false);await f.app.execution.current.pending;assert.deepEqual(f.bodies(),[]);
 await f.post('/api/execution/start',f.input([f.catalog.tests[0].id]));await until(()=>f.app.execution.current.phase==='Awaiting Confirmation');await f.app.execution.current.pending;assert.deepEqual(f.bodies(),[]);
});
test('stale catalog, empty selection, changed source after confirmation, and historical source mismatch fail closed',async t=>{
 const f=await setup(t),id=f.catalog.tests[0].id;
 assert.equal((await f.post('/api/execution/start',f.input([]))).status,400);
 const op=await f.run(f.input([id]));const parent=op.runId;
 await f.post('/api/execution/start',f.input([id]));await f.confirm('execution');
 fs.appendFileSync(f.catalog.tests[0].file,'\n// changed');await f.confirm('snapshot');await f.app.execution.current.pending;
 assert.equal(f.app.execution.current.phase,'Failed');assert.equal(f.bodies().length,1);
 assert.equal((await f.post('/api/execution/start',f.input([id]))).status,409);
 await f.post('/api/execution/start',{scope:'selected',parentRunId:parent,ids:[id],headed:false,requestId:crypto.randomUUID()});await f.app.execution.current.pending;
 assert.equal(f.app.execution.current.phase,'Failed');assert.equal(f.bodies().length,1);
});
test('failed and historical selected reruns preserve parent byte hashes; owned stop interrupts only its operation',async t=>{
 const f=await setup(t),id=f.catalog.tests.find(t=>t.title==='Other test').id;
 const parent=await f.run(f.input([id]));assert.equal(parent.phase,'Failed');
 const dir=f.app.repository.history.directory(parent.runId),before=fingerprint(dir);fs.writeFileSync(path.join(f.root,'allow'),'1');
 for(const scope of ['failed','selected']){
  const op=await f.run({scope,parentRunId:parent.runId,...(scope==='selected'?{ids:[id]}:{}),headed:false,requestId:crypto.randomUUID()});
  assert.equal(op.phase,'Completed',JSON.stringify(op.error));assert.notEqual(op.runId,parent.runId);assert.equal(f.app.repository.raw(op.runId).manifest.parentRunId,parent.runId);assert.deepEqual(fingerprint(dir),before);
 }
 fs.writeFileSync(path.join(f.root,'slow'),'1');await f.post('/api/execution/start',f.input([id]));await f.confirm('execution');await f.confirm('snapshot');await until(()=>f.app.execution.current.phase==='Running');
 const op=f.app.execution.current;assert.equal((await f.post('/api/execution/stop',{operationId:parent.id})).status,409);
 assert.equal((await f.post('/api/execution/stop',{operationId:op.id})).status,200);await op.pending;assert.equal(op.phase,'Interrupted');assert.deepEqual(fingerprint(dir),before);
});
test('Test List prefix ambiguity fails before all bodies; unsupported title fails closed',async t=>{
 const f=await setup(t);
 fs.writeFileSync(f.source,`const {test}=require('@playwright/test');test('prefix',()=>{require('node:fs').writeFileSync(${JSON.stringify(path.join(f.root,'UNSAFE'))},'1');});test.describe('prefix',()=>{test('nested',()=>{throw Error('MUST_NOT_RUN');});});test('bad › title',()=>{});`);
 const catalog=await f.discover();
 const value=id=>({scope:'selection',catalogRevision:catalog.catalogRevision,ids:[id],headed:false,requestId:crypto.randomUUID()});
 await f.post('/api/execution/start',value(catalog.tests.find(t=>t.title==='prefix').id));await f.confirm('execution');await f.confirm('snapshot');await f.app.execution.current.pending;
 assert.equal(f.app.execution.current.phase,'Failed');assert.equal(fs.existsSync(path.join(f.root,'UNSAFE')),false);assert.equal(f.app.execution.current.runId,null);
 await f.post('/api/execution/start',value(catalog.tests.find(t=>t.title.includes('›')).id));await f.app.execution.current.pending;assert.equal(f.app.execution.current.phase,'Failed');
});
test('abandoned manual-recovery service lock is preserved by Service and Extension',async t=>{
 const f=await setup(t),os=require('node:os');
 const key=crypto.createHash('sha256').update(fs.realpathSync(f.root).toLowerCase()).digest('hex').slice(0,24);
 const file=path.join(os.tmpdir(),'playwright-test-studio-'+key+'.lock');
 fs.writeFileSync(file,JSON.stringify({owner:2147483000,recorder:null,token:'fixture',recoveryPolicy:'manual'}));
 try{assert.equal(f.app.execution.get({}).phase,'Ownership Unknown');assert.throws(()=>acquireLock(f.root));assert.equal(JSON.parse(fs.readFileSync(file)).token,'fixture');}
 finally{fs.unlinkSync(file);}
});
