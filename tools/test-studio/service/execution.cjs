const crypto = require('node:crypto');
const { maintenanceLock } = require('./trash.cjs');
const { fail } = require('./repository.cjs');
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u;
const fields = (x, keys) => x && typeof x === 'object' && !Array.isArray(x) && Object.keys(x).every(k => keys.includes(k));
const identity = t => JSON.stringify([t.id,t.project,t.file,t.listFile,t.titles,t.line,t.column,t.sourceHash]);
class Execution {
  constructor(repository, catalog, { ttl = 120000, prepareTimeout = 90000, editorGuard, secrets = () => [] } = {}) {
    this.repository = repository; this.catalog = catalog; this.ttl = ttl; this.prepareTimeout = prepareTimeout;
    this.editorGuard = editorGuard; this.secrets = secrets;
    this.requests = new Map(); this.current = null; this.closed = false;
  }
  view(op, session) {
    const { manager, session: owner, resolve, timer, pending, baseline, tests, input, logs, ...publicValue } = op;
    return { ...publicValue, cliLog: op.logs?.text || "", canConfirm: owner === session && op.phase === 'Awaiting Confirmation',
      confirmation: owner === session ? op.confirmation : null };
  }
  get(session) {
    if(this.current)return this.view(this.current,session);
    const root=process.platform==='win32'?this.repository.root.toLowerCase():this.repository.root;
    const lock=require('node:path').join(require('node:os').tmpdir(),'playwright-test-studio-'+crypto.createHash('sha256').update(root).digest('hex').slice(0,24)+'.lock');
    const busy=require('node:fs').existsSync(lock);return {phase:busy?'Ownership Unknown':'Idle',busy};
  }
  start(session, input) {
    if (!fields(input,['requestId','scope','catalogRevision','ids','parentRunId','headed']) || !uuid.test(input.requestId) ||
        typeof input.headed !== 'boolean' || !['test','file','folder','selection','suite','failed','selected'].includes(input.scope)) throw fail(400,'Invalid execution request.');
    const prior = this.requests.get(input.requestId);
    if (prior) {
      if (prior.session !== session || JSON.stringify(prior.input) !== JSON.stringify(input)) throw fail(409,'requestId already used.');
      return this.view(prior, session);
    }
    if (this.closed || this.current?.busy) throw fail(409,'Execution is busy.');
    if (this.requests.size >= 200) throw fail(409,'Operation session limit reached; restart only after completion.');
    let tests;
    if (['test','file','folder','selection','suite'].includes(input.scope)) {
      if (input.parentRunId !== undefined) throw fail(400,'Unexpected parent.');
      tests = this.catalog.resolve({catalogRevision:input.catalogRevision,ids:input.ids}).tests;
      if(input.scope==='test'&&tests.length!==1)throw fail(400,'Single test requires one ID.');
      if(input.scope==='file'&&(new Set(tests.map(t=>t.file)).size!==1||tests.length!==this.catalog.get().tests.filter(t=>t.file===tests[0].file).length))throw fail(409,'File selection must include its exact full catalog.');
      if (input.scope === 'suite' && tests.length !== this.catalog.get().tests.length) throw fail(409,'Suite requires the entire current Catalog.');
    } else {
      if (input.catalogRevision !== undefined || typeof input.parentRunId !== 'string') throw fail(400,'Invalid historical selection.');
      const previous = this.repository.raw(input.parentRunId);
      if (!previous.summary.finishedAt || !['passed','failed','interrupted','error'].includes(previous.summary.status)) throw fail(409,'Parent is not finalized.');
      if (input.scope === 'failed') {
        if (input.ids !== undefined) throw fail(400,'Failed selection does not accept ids.');
        tests = previous.manifest.tests.filter(t=>previous.summary.tests.some(r=>r.id===t.id && r.outcome==='failed'));
      } else {
        if (!Array.isArray(input.ids) || !input.ids.length || new Set(input.ids).size !== input.ids.length || input.ids.some(id=>typeof id!=='string')) throw fail(400,'Invalid historical ids.');
        tests = previous.manifest.tests.filter(t=>input.ids.includes(t.id));
        if (tests.length !== input.ids.length) throw fail(409,'Historical test not found.');
      }
    }
    if (!tests.length || tests.length > 20000) throw fail(400,'No valid tests selected.');
    const op = { id:crypto.randomUUID(),requestId:input.requestId,input:structuredClone(input),session,tests:structuredClone(tests),baseline:this.catalog.scan(),
      phase:'Preparing',busy:true,scope:input.scope,headed:input.headed,count:tests.length,selection:tests.map(t=>({project:t.project,path:t.listFile,titles:t.titles})),startedAt:Date.now(),runId:null,error:null,confirmation:null };
    this.current=op; this.requests.set(input.requestId,op);
    op.pending=this.run(op);
    return this.view(op,session);
  }
  async run(op) {
    const { RegressionManager } = require('../regression/manager.cjs');
    const check = () => { if (this.catalog.scan() !== op.baseline) throw fail(409,'Source / configuration changed; select again.'); };
    op.logs = new (require('./log.cjs').CliLog)(() => [...this.secrets(), ...Object.entries(process.env).filter(([key]) => /password|passwd|token|secret|credential|api.?key/iu.test(key)).map(([,value]) => value)]);
    const inspect = async () => {
      const next = await this.editorGuard?.(op.tests) || { verified: false, message: 'Editor inspection unavailable; only saved files on disk will run.' };
      if (op.editorSafety?.verified && !next.verified) throw fail(409, 'Bridge disconnected after editor validation; execution blocked. Reconnect and select again.');
      op.editorSafety = next; return true;
    };
    const manager = op.manager = new RegressionManager({root:()=>this.repository.root,node:()=>process.execPath,
      prepare: inspect,
      output: (chunk, stream) => op.logs.append(chunk, stream), outputEnd: () => op.logs.flush(),
      acquireLock:root=>{try { const release=maintenanceLock(root); return {recorder:release.recorder,release}; } catch(e) {op.phase='Ownership Unknown';throw e;}},
      validateCatalog:async catalog=>{
        check(); const current=this.catalog.validate(catalog), byId=new Map(current.map(t=>[t.id,t]));
        if (op.tests.some(t=>!byId.has(t.id)||identity(t)!==identity(byId.get(t.id)))) throw fail(409,'Exact selection identity/source changed.');
        if (op.scope==='suite' && current.length!==op.tests.length) throw fail(409,'Suite changed.');
      },
      confirmExecution:async()=>{await inspect();clearTimeout(preparation);return this.wait(op,'execution');},
      alwaysConfirmSnapshot:true,verifySelection:true,
      confirmSnapshot:async()=>this.wait(op,'snapshot'),
      beforeRun:async()=>{check();await inspect();op.phase='Preparing';},
      state:state=>{
        if(state.runId)op.runId=state.runId;
        if(state.progress)op.progress=state.progress;
        if(state.phase==='running')op.phase='Running';
        if(state.phase==='stopping')op.phase='Stopping';
      }
    });
    const preparation=setTimeout(()=>{void manager.stop().catch(()=>{});},this.prepareTimeout);
    try {
      const result=await manager.run({scope:['failed','selected'].includes(op.scope)?op.scope:'selection',ids:op.tests.map(t=>t.id),parentRunId:op.input.parentRunId,headed:op.headed});
      op.phase=manager.stopRequested?'Interrupted':result?.summary.status==='passed'?'Completed':result?'Failed':'Interrupted';
      if(result)op.result={runId:result.manifest.id,status:result.summary.status,counts:result.summary.counts};
    } catch(error) {
      if(op.phase!=='Ownership Unknown')op.phase=manager.stopRequested?'Interrupted':'Failed';
      op.error={code:op.phase==='Ownership Unknown'?'OWNERSHIP_UNKNOWN':'EXECUTION_FAILED',message:op.logs.redact(String(error.message)).slice(0,4000)};
    } finally {
      op.logs.flush();clearTimeout(preparation);clearTimeout(op.timer);op.confirmation=null;op.busy=false;op.finishedAt=Date.now();
    }
  }
  wait(op, kind) {
    if(op.manager.stopRequested||this.closed)return Promise.resolve(false);
    op.phase='Awaiting Confirmation';
    op.confirmation={kind,token:crypto.randomUUID(),expiresAt:Date.now()+this.ttl,
      message:kind==='snapshot'?'تأیید مستقل Snapshot: تست‌ها و Helperهای واردشده ممکن است RestoreSnapshot و تغییر Backend داشته باشند. آیا این پیامدها را برای همین انتخاب مجاز می‌دانید؟':
        `تأیید اجرای ${op.count} تست (${op.scope}) با حالت ${op.headed?'Headed':'Headless'}. کد تست و Hookها می‌توانند دادهٔ برنامه را تغییر دهند.\n${op.editorSafety?.message || ""}`};
    return new Promise(resolve=>{op.resolve=resolve;op.timer=setTimeout(()=>this.settle(op,false),this.ttl);});
  }
  settle(op,value) {clearTimeout(op.timer);op.confirmation=null;const resolve=op.resolve;op.resolve=null;resolve?.(value);}
  confirm(session,input) {
    if(!fields(input,['operationId','token','confirm'])||typeof input.confirm!=='boolean')throw fail(400,'Invalid confirmation.');
    const op=this.current;
    if(!op||op.id!==input.operationId||op.session!==session||!op.resolve||op.confirmation?.token!==input.token||Date.now()>=op.confirmation.expiresAt)throw fail(409,'Confirmation expired or belongs to a different operation/session.');
    this.settle(op,input.confirm);return {accepted:true};
  }
  stop(input) {
    if(!fields(input,['operationId'])||typeof input.operationId!=='string')throw fail(400,'Operation ID required.');
    const op=this.current;
    if(!op?.busy||op.id!==input.operationId)throw fail(409,'No matching owned operation.');
    this.settle(op,false);void op.manager.stop().catch(error=>{op.phase='Ownership Unknown';op.error={code:'STOP_FAILED',message:error.message};});
    return {accepted:true};
  }
  async close() {this.closed=true;const op=this.current;if(op?.busy){this.stop({operationId:op.id});await op.pending;}}
}
module.exports={Execution};
