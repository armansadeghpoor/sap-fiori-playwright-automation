const { test } = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { fixture, cleanup, withRunner } = require('./fixture.cjs');
const { History, hashFile } = require('../regression/history.cjs');
const { Repository } = require('../service/repository.cjs');
const { createService } = require('../service/server.cjs');
const { BridgeHost } = require('../bridge/host.cjs');
const { Catalog } = require('../service/catalog.cjs');
const { acquireLock } = require('../studio.cjs');
const { CliLog } = require('../service/log.cjs');
const artifacts = require('../bridge/artifacts.cjs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(fn) { const end = Date.now() + 30000; while (!fn()) { if (Date.now() > end) throw Error('Fixture timeout'); await sleep(40); } }
async function auth(app) {
  const login = await fetch(app.origin + '/api/session', { method: 'POST', headers: { Origin: app.origin, 'Content-Type':'application/json', 'X-Studio-Request':'1' }, body: JSON.stringify({ code: app.pairingCode }) });
  const cookie = login.headers.get('set-cookie').split(';')[0], get = route => fetch(app.origin + route, { headers: { Cookie: cookie } });
  const { csrf } = await get('/api/session').then(r => r.json());
  return { get, post: (route, value, extra = {}) => fetch(app.origin + route, { method: 'POST', headers: { Cookie: cookie, Origin: app.origin, 'Content-Type':'application/json', 'X-Studio-CSRF':csrf, ...extra }, body: JSON.stringify(value) }) };
}
test('CLI log redacts chunked credentials and both streams, bounds unterminated lines and retention', () => {
  const secret = 'fixture-session-value-123456', log = new CliLog(() => [secret]);
  log.append('hello فارسی\npass', 'stdout'); log.append('word="hunter2"\nBearer abcde\n' + secret.slice(0, 9), 'stdout');
  log.append(secret.slice(9) + '\n', 'stdout'); log.append('error واقعی\n', 'stderr');
  for (let i = 0; i < 100; i++) log.append('x'.repeat(1000), 'stderr');
  log.append('\nlast\n', 'stderr'); log.flush();
  assert.ok(log.text.includes('hello فارسی')); assert.ok(log.text.includes('[stderr] error واقعی'));
  assert.ok(!/hunter2|abcde|fixture-session/u.test(log.text)); assert.ok(log.text.includes('overlong CLI line omitted'));
  for (let i = 0; i < 5000; i++) log.append('bounded line\n', 'stdout');
  assert.ok(log.text.length <= 16000); assert.ok(Object.values(log.pending).every(s => s.length <= 8192));
});
test('report / trace IDs and snapshot prevent arbitrary paths, missing files, symlinks and original History exposure', t => {
  const root = fixture(); t.after(() => cleanup(root));
  const history = new History(root), run = history.create({ scope:'fixture', tests:[{ id:'A' }] });
  fs.mkdirSync(path.join(run.folder, 'report')); fs.writeFileSync(path.join(run.folder, 'report/index.html'), '<html>fixture report</html>');
  fs.mkdirSync(path.join(run.folder, 'attachments')); fs.writeFileSync(path.join(run.folder, 'attachments/trace.zip'), 'zip fixture');
  fs.writeFileSync(path.join(run.folder, 'attachments/uppercase.ZIP'), 'uppercase zip fixture');
  history.finalize(run, { status:'failed', complete:true, tests:[{ id:'A', outcome:'failed', attempts:[{ retry:0, status:'failed', errors:[{message:'first'}], attachments:[{name:'trace',path:'attachments/trace.zip',contentType:'application/zip'}, {name:'trace',path:'attachments/uppercase.ZIP',contentType:'application/zip'}] },{retry:1,status:'failed',errors:[{message:'second'}]}] }] });
  const repo = new Repository(root), dto = repo.detail(run.manifest.id); assert.equal(dto.report, true); assert.equal(dto.tests[0].attempts.length, 2);
  const action = { runId:run.manifest.id, kind:'trace', artifactId:dto.tests[0].attachments[0].id };
  assert.ok(repo.viewer({...action, artifactId:dto.tests[0].attachments[1].id}).file.endsWith('uppercase.ZIP'));
  const item = repo.viewer(action), temp = artifacts.snapshot(item); t.after(() => artifacts.dispose(temp));
  assert.deepEqual(fs.readdirSync(temp), ['trace.zip']); assert.equal(fs.readFileSync(path.join(temp,'trace.zip'),'utf8'), 'zip fixture');
  assert.throws(() => repo.viewer({ ...action, artifactId:'../../secret' }));
  const report = artifacts.snapshot(repo.viewer({ ...action, kind:'report', artifactId:null })); t.after(() => artifacts.dispose(report));
  assert.deepEqual(fs.readdirSync(report), ['index.html']);
  fs.symlinkSync(root, path.join(run.folder,'report','escape'), 'junction');
  assert.throws(() => artifacts.snapshot(repo.viewer({ ...action, kind:'report', artifactId:null })), /Linked/);
  fs.unlinkSync(path.join(run.folder,'report','escape')); fs.unlinkSync(path.join(run.folder,'report/index.html'));
  assert.equal(repo.detail(run.manifest.id).report, false); assert.throws(() => repo.viewer({ ...action, kind:'report', artifactId:null }));
});
test('discovery cancellation preserves committed Catalog/revision/selection and rejects stale operation IDs', async t => {
  const root = fixture(); const file = path.join(root,'TestCases','فارسی.spec.ts'); fs.writeFileSync(file,'// fixture only');
  const begin = { rootDir:root, tests:[{id:'A',file,listFile:path.relative(root,file),title:'A',titles:['A'],project:'',line:1,column:1,sourceHash:hashFile(file)}] };
  let slow = false;
  const app = await createService({root, catalogOptions:{discover:async ({signal}) => { if (slow) await new Promise((resolve,reject) => signal.addEventListener('abort', () => reject(Error('aborted')), {once:true})); return begin; }}});
  t.after(async () => {await app.close(); cleanup(root);}); const c = await auth(app);
  app.catalog.start({}); await app.catalog.pending; const revision = app.catalog.get().catalogRevision;
  slow = true; const started = app.catalog.start({}); await sleep(1);
  assert.equal((await c.post('/api/discovery/stop',{discoveryId:started.discoveryId},{'X-Studio-CSRF':'bad'})).status,403);
  assert.equal((await c.post('/api/discovery/stop',{discoveryId:crypto.randomUUID()})).status,409);
  assert.equal((await c.post('/api/discovery/stop',{discoveryId:started.discoveryId})).status,200); await app.catalog.pending;
  const value = app.catalog.get(); assert.equal(value.discoveryOutcome,'cancelled'); assert.equal(value.phase,'ready'); assert.equal(value.catalogRevision,revision);
  assert.deepEqual(app.catalog.resolve({catalogRevision:revision,ids:['A']}).ids,['A']);
  assert.equal((await c.get('/api/execution').then(r => r.json())).phase,'Idle'); assert.equal((await c.get('/api/health')).status,200);
  const lock = acquireLock(root); lock.release();
});
test('real discovery CLI cancellation stops only its owned child and releases the lock without running test bodies', async t => {
  const root = fixture(); withRunner(root);
  const marker = path.join(root,'discovery-started');
  fs.writeFileSync(path.join(root,'playwright.config.cjs'), `module.exports = (async () => { require('node:fs').writeFileSync(${JSON.stringify(marker)},'1'); await new Promise(r=>setTimeout(r,20000)); return {testDir:'./TestCases'}; })();`);
  const catalog = new Catalog(root); t.after(async () => {await catalog.close(); cleanup(root);});
  const started = catalog.start({}); await until(() => fs.existsSync(marker)); const child = catalog.manager.child;
  catalog.cancel({discoveryId:started.discoveryId}); await catalog.pending;
  assert.ok(child.exitCode !== null || child.signalCode !== null); assert.equal(catalog.get().phase,'idle'); assert.equal(catalog.get().discoveryOutcome,'cancelled');
  const lock = acquireLock(root); lock.release();
});
async function executionFixture(t) {
  const root = fixture(); withRunner(root); const directory = path.join(root,'bridges');
  const file = path.join(root,'TestCases','تست مصنوعی.spec.ts');
  fs.writeFileSync(file, `const {test}=require('@playwright/test'); test('CLI fixture',async()=>{console.log('OUT فارسی');console.error('ERR واقعی');console.log('password=fixture-private-password');await new Promise(r=>setTimeout(r,400));});`);
  const documents = [{uri:{scheme:'file',fsPath:file},isDirty:false}], vscode = {workspace:{name:'Fixture',textDocuments:documents}};
  const host = await new BridgeHost(vscode,()=>root,{directory}).start();
  const app = await createService({root,bridgeOptions:{directory}}); const c = await auth(app);
  t.after(async () => {await app.close(); await host.close(); cleanup(root);});
  app.catalog.start({}); await app.catalog.pending; const catalog = app.catalog.get(); assert.equal(catalog.phase,'ready',catalog.error);
  const start = () => app.execution.start({}, {requestId:crypto.randomUUID(),scope:'selection',catalogRevision:catalog.catalogRevision,ids:[catalog.tests[0].id],headed:false});
  const confirm = async kind => {await until(() => app.execution.current.phase === 'Awaiting Confirmation' || !app.execution.current.busy);const op = app.execution.current; assert.equal(op.confirmation?.kind,kind,JSON.stringify(op.error)); app.execution.confirm(op.session,{operationId:op.id,token:op.confirmation.token,confirm:true});};
  return {root,file,documents,host,app,c,start,confirm};
}
test('Dashboard blocks dirty selected editors before discovery or run; disk and buffers are never saved', async t => {
  const f = await executionFixture(t), bytes = fs.readFileSync(f.file); f.documents[0].isDirty = true; f.start(); await f.app.execution.current.pending;
  assert.equal(f.app.execution.current.phase,'Failed'); assert.match(f.app.execution.current.error.message,/ذخیره/); assert.equal(f.app.execution.current.runId,null);
  assert.equal(f.documents[0].isDirty,true); assert.deepEqual(fs.readFileSync(f.file),bytes);
});
test('new dirty edits after confirmation block execution; Bridge disconnect after verified inspection blocks too', async t => {
  const f = await executionFixture(t); f.start(); await f.confirm('execution');
  await until(() => f.app.execution.current.confirmation?.kind === 'snapshot'); f.documents[0].isDirty=true; await f.confirm('snapshot'); await f.app.execution.current.pending;
  assert.equal(f.app.execution.current.phase,'Failed'); assert.equal(f.app.execution.current.runId,null);
  f.documents[0].isDirty=false; f.start(); await f.confirm('execution'); await until(() => f.app.execution.current.confirmation?.kind === 'snapshot'); await f.host.close(); await f.confirm('snapshot'); await f.app.execution.current.pending;
  assert.equal(f.app.execution.current.phase,'Failed'); assert.match(f.app.execution.current.error.message,/disconnected/);
});
test('real fixture CLI stdout/stderr reach authenticated snapshots redacted; disconnected Bridge requires accurate explicit warning', async t => {
  const f = await executionFixture(t); await f.host.close(); f.start(); await until(() => f.app.execution.current.confirmation?.kind === 'execution');
  assert.match(f.app.execution.current.confirmation.message,/دیسک/); assert.equal(f.app.execution.current.editorSafety.verified,false);
  await f.confirm('execution'); await f.confirm('snapshot'); await f.app.execution.current.pending;
  assert.equal(f.app.execution.current.phase,'Completed',JSON.stringify(f.app.execution.current.error));
  const view = await f.c.get('/api/execution').then(r=>r.json()); assert.match(view.cliLog,/OUT فارسی/); assert.match(view.cliLog,/ERR واقعی/); assert.ok(!view.cliLog.includes('fixture-private-password')); assert.ok(view.cliLog.includes('[REDACTED]'));
  assert.ok(view.cliLog.length<=16000); assert.equal('logs' in view,false);
});

test('dirty inspection covers all registered windows and never claims a partial inspection is clean', async t => {
  const f = await executionFixture(t), directory = path.join(f.root,'bridges');
  const second = await new BridgeHost({workspace:{name:'Second',textDocuments:[{uri:{scheme:'file',fsPath:f.file},isDirty:true}]}},()=>f.root,{directory}).start();
  t.after(()=>second.close());
  await assert.rejects(f.app.bridge.guard(f.app.catalog.get().tests),/ذخیره/);
  await second.close();
  const record = JSON.parse(fs.readFileSync(f.host.file));
  const ghost = {...record,windowId:crypto.randomUUID(),port:1};
  const file = path.join(directory,ghost.windowId+'.json'); fs.writeFileSync(file,JSON.stringify(ghost));
  try {await assert.rejects(f.app.bridge.guard(f.app.catalog.get().tests),/همه/);} finally {fs.unlinkSync(file);}
});
test('cancelled discovery stays non-runnable until owned cleanup succeeds and never conceals cleanup failure', async t => {
  const root=fixture();t.after(()=>cleanup(root));
  let started, release;
  const catalog=new Catalog(root,{discover:async({signal})=>{started=true;await new Promise((r,j)=>signal.addEventListener('abort',()=>j(Error('cancelled')),{once:true}));}});
  catalog.value={phase:'ready',catalogRevision:'previous',tests:[],entries:[],error:null}; catalog.fingerprint=catalog.scan();
  const original=catalog.cleanupOwned.bind(catalog);
  catalog.cleanupOwned=async()=>{await new Promise(r=>release=r);throw Error('unverified process');};
  const op=catalog.start({});await until(()=>started);catalog.cancel({discoveryId:op.discoveryId});await until(()=>release);
  assert.equal(catalog.get().phase,'discovering');assert.equal(catalog.get().cancelRequested,true);
  assert.throws(()=>catalog.start({}),/فعال/);release();await catalog.pending;
  assert.equal(catalog.get().phase,'error');assert.match(catalog.get().error,/قفل/);assert.equal(catalog.get().discoveryOutcome,null);
  await original();
});


test('Windows terminal cwd cleanup retries asynchronously after the owned child exits, without killing another process', async t => {
  const folder=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'pw-studio-viewer-'));
  fs.writeFileSync(path.join(folder,'owned-fixture.txt'),'synthetic copy');
  const {spawn}=require('node:child_process');
  const child=spawn(process.execPath,['-e',"process.stdout.write('READY');process.stdin.on('data',()=>process.exit(0));process.stdin.on('end',()=>process.exit(0));"],{cwd:folder,windowsHide:true,stdio:['pipe','pipe','pipe']});
  child.stdin.on('error',()=>{});
  const exited=new Promise(r=>child.once('exit',r));
  try {
    await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);});
    if(process.platform==='win32') {
      assert.throws(()=>fs.rmSync(folder,{recursive:true,force:true}),error=>{t.diagnostic('owned cwd removal blocked: '+error.code);return ['EPERM','EBUSY','ENOTEMPTY'].includes(error.code);});
    }
    setTimeout(()=>child.stdin.end('finish'),150);
    await artifacts.cleanup(folder);await exited;assert.equal(fs.existsSync(folder),false);
  } finally {child.stdin.end('finish');await exited;await artifacts.cleanup(folder);}
});
