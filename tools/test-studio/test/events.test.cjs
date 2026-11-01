const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os');
const {fixture,cleanup}=require('./fixture.cjs');const {createService}=require('../service/server.cjs');const {Cursor}=require('../web/stream-model.js');const {maintenanceLock}=require('../service/trash.cjs');const legacy=require('./legacy-studio-0.2.3.cjs');const {acquireLock}=require('../studio.cjs');const {assertCompatible}=require('../compatibility.cjs');
test('D2 cursor replaces snapshots, ignores duplicates/out-of-order revisions and detects restart',()=>{const c=new Cursor();assert.ok(c.accept({instanceId:'A',revision:7,operation:{progress:{completed:2}}}));assert.equal(c.accept({instanceId:'A',revision:7,operation:{progress:{completed:4}}}),false);assert.equal(c.value.progress.completed,2);assert.equal(c.accept({instanceId:'A',revision:6,operation:{}}),false);assert.ok(c.accept({instanceId:'B',revision:1,operation:{phase:'Idle'}}));assert.equal(c.value.phase,'Idle');});
test('D2 authenticated SSE shares one revision across clients, reconnect sends full snapshot, expires Sessions',async t=>{
 const root=fixture(),app=await createService({root,sessionLifetime:3000});t.after(async()=>{await app.close();cleanup(root);});
 const login=await fetch(app.origin+'/api/session',{method:'POST',headers:{Origin:app.origin,'Content-Type':'application/json','X-Studio-Request':'1'},body:JSON.stringify({code:app.pairingCode})});const cookie=login.headers.get('set-cookie').split(';')[0];
 assert.equal((await fetch(app.origin+'/api/events')).status,401);assert.equal((await fetch(app.origin+'/api/events',{headers:{Cookie:cookie,Origin:'https://evil.test'}})).status,403);
 const controllers=[],readers=[];
 async function connect(last){const controller=new AbortController();controllers.push(controller);const r=await fetch(app.origin+'/api/events',{headers:{Cookie:cookie,...last?{'Last-Event-ID':last}:{}},signal:controller.signal});assert.equal(r.status,200);const reader=r.body.getReader();readers.push(reader);let text='';while(!text.includes('event: snapshot')){text+=Buffer.from((await reader.read()).value).toString('utf8');}const data=JSON.parse(text.match(/data: (.+)/)[1]);return data;}
 try{const a=await connect(),b=await connect(a.instanceId+':'+a.revision);assert.equal(a.revision,b.revision);assert.equal(app.events.clients.size,2);controllers[0].abort();await new Promise(r=>setTimeout(r,50));const c=await connect(a.instanceId+':'+a.revision);assert.equal(c.operation.phase,'Idle');assert.equal(c.instanceId,app.instanceId);const expiryDeadline=Date.now()+5000;while(app.events.clients.size&&Date.now()<expiryDeadline)await new Promise(r=>setTimeout(r,25));assert.equal(app.events.clients.size,0);assert.equal((await fetch(app.origin+'/api/execution',{headers:{Cookie:cookie}})).status,401);}
 finally{controllers.forEach(c=>c.abort());for(const r of readers)await r.cancel().catch(()=>{});}
});
test('D3 actual legacy 0.2.3 and current Extension cannot recover an abandoned guarded Service lock',t=>{
 const root=fixture();t.after(()=>cleanup(root));const release=maintenanceLock(root),key=crypto.createHash('sha256').update(fs.realpathSync(root).toLowerCase()).digest('hex').slice(0,24),file=path.join(os.tmpdir(),'playwright-test-studio-'+key+'.lock');
 try{const value=JSON.parse(fs.readFileSync(file));fs.writeFileSync(file,JSON.stringify({...value,owner:2147483000,recorder:null}));assert.throws(()=>legacy.acquireLock(root));assert.throws(()=>acquireLock(root));assert.equal(JSON.parse(fs.readFileSync(file)).token,value.token);assert.ok(fs.existsSync(file+'.recovery'));}finally{release();}
 assert.equal(fs.existsSync(file),false);assert.equal(fs.existsSync(file+'.recovery'),false);const old=legacy.acquireLock(root);assert.throws(()=>maintenanceLock(root));old.release();
 const folder=path.join(root,'tools','test-studio');fs.mkdirSync(folder);fs.writeFileSync(path.join(folder,'package.json'),JSON.stringify({version:'0.3.0'}));assert.throws(()=>assertCompatible(root,'0.2.3'),/Install/);assert.doesNotThrow(()=>assertCompatible(root,'0.3.0'));
});
test('D3 an owned synthetic process exits abruptly; both clients preserve its actual abandoned lock',t=>{
 const root=fixture();t.after(()=>cleanup(root));
 const source=`const {maintenanceLock}=require(${JSON.stringify(require.resolve('../service/trash.cjs'))});maintenanceLock(${JSON.stringify(root)});process.exit(86);`;
 const child=require('node:child_process').spawnSync(process.execPath,['-e',source],{windowsHide:true});assert.equal(child.status,86);
 const key=crypto.createHash('sha256').update(fs.realpathSync(root).toLowerCase()).digest('hex').slice(0,24),file=path.join(os.tmpdir(),'playwright-test-studio-'+key+'.lock');
 const original=fs.readFileSync(file,'utf8'),guard=fs.readFileSync(file+'.recovery','utf8');
 try{assert.throws(()=>legacy.acquireLock(root));assert.throws(()=>acquireLock(root));assert.throws(()=>maintenanceLock(root));assert.equal(fs.readFileSync(file,'utf8'),original);assert.equal(fs.readFileSync(file+'.recovery','utf8'),guard);}
 finally{assert.equal(JSON.parse(original).token,JSON.parse(guard).token);fs.unlinkSync(file);fs.unlinkSync(file+'.recovery');}
});
test('D2 slow stream keeps only the newest pending snapshot; retired instance cannot overwrite restart',()=>{
 const {Events}=require('../service/events.cjs'),{EventEmitter}=require('node:events');let completed=1,first=true;const chunks=[],response=new EventEmitter();response.writeHead=()=>{};response.write=value=>{chunks.push(value);if(value.startsWith('id:')&&first){first=false;return false;}return true;};response.end=()=>{};response.destroy=()=>{};response.writableLength=100000;
 const events=new Events('instance', {get:()=>({phase:'Running',progress:{completed}})});
 try{events.subscribe({},response,{expires:Date.now()+5000});completed=2;events.tick();completed=3;events.tick();assert.equal(chunks.filter(x=>x.startsWith('id:')).length,1);response.emit('drain');assert.equal(events.clients.size,1);assert.ok(chunks.at(-1).includes('"completed":3'));}
 finally{events.close();}
 const cursor=new Cursor();cursor.accept({instanceId:'old',revision:9,operation:{phase:'Running'}});cursor.accept({instanceId:'new',revision:1,operation:{phase:'Idle'}});assert.equal(cursor.accept({instanceId:'old',revision:10,operation:{phase:'Running'}}),false);assert.equal(cursor.value.phase,'Idle');
});
