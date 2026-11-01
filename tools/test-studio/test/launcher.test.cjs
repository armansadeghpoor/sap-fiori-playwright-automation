const {test}=require('node:test'),assert=require('node:assert/strict');const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),http=require('node:http');
const {fixture,cleanup}=require('./fixture.cjs');const {launch}=require('../service/launcher.cjs');const native=require('../service/native.cjs');const {createService}=require('../service/server.cjs');
async function login(origin,token){const r=await fetch(origin+'/api/bootstrap',{method:'POST',headers:{Origin:origin,'X-Studio-Request':'1','Content-Type':'application/json'},body:JSON.stringify({token})});assert.equal(r.status,200);const cookie=r.headers.get('set-cookie').split(';')[0];const status=await fetch(origin+'/api/session',{headers:{Cookie:cookie}}).then(r=>r.json());return {cookie,status};}
async function stop(origin,c){return fetch(origin+'/api/service/stop',{method:'POST',headers:{Origin:origin,Cookie:c.cookie,'Content-Type':'application/json','X-Studio-CSRF':c.status.csrf},body:JSON.stringify({instanceId:c.status.instanceId,confirm:true})});}
test('D1 cold startup, repeated/concurrent launch, bootstrap, detached lifetime and explicit owned shutdown',async t=>{
 const base=fixture(),root=base+' مسیر فارسی with spaces';fs.renameSync(base,root);const privateDirectory=path.join(root,'private'),descriptorDirectory=root,urls=[];let connected,instance;
 const options={extensionHome:root,descriptorDirectory,privateDirectory,open:url=>urls.push(url)};
 t.after(async()=>{if(connected)await stop(instance.origin,connected).catch(()=>{});await new Promise(r=>setTimeout(r,500));const file=native.descriptorPath(root,descriptorDirectory);if(fs.existsSync(file)){const d=JSON.parse(fs.readFileSync(file));await native.validate(root,d);await require('../studio.cjs').stopTree({pid:d.pid,exitCode:null});}cleanup(root);});
 const results=await Promise.all([launch(root,options),launch(root,options),launch(root,options)]);instance=results[0];assert.equal(new Set(results.map(x=>x.pid)).size,1);assert.equal(new Set(results.map(x=>x.instanceId)).size,1);
 const descriptor=JSON.parse(fs.readFileSync(native.descriptorPath(root,descriptorDirectory),'utf8'));assert.equal(descriptor.protocolVersion,2);assert.ok(descriptor.identity.startTicks);
 const token=urls[0].split('#bootstrap=')[1];connected=await login(instance.origin,token);
 const reused=await fetch(instance.origin+'/api/bootstrap',{method:'POST',headers:{Origin:instance.origin,Cookie:connected.cookie,'Content-Type':'application/json','X-Studio-Request':'1'},body:JSON.stringify({token:urls[1].split('#bootstrap=')[1]})});assert.equal(reused.status,200);assert.equal(reused.headers.get('set-cookie'),null);
 assert.equal((await fetch(instance.origin+'/api/bootstrap',{method:'POST',headers:{Origin:instance.origin,'Content-Type':'application/json','X-Studio-Request':'1'},body:JSON.stringify({token})})).status,401);
 assert.deepEqual(fs.readdirSync(privateDirectory),[]);assert.ok(!JSON.stringify(descriptor).includes(token));
 assert.equal((await fetch(instance.origin+'/api/launcher/bootstrap',{method:'POST',headers:{Origin:'https://evil.test','Content-Type':'application/json','X-Studio-Launcher':'1'},body:'{}'})).status,403);
 assert.equal((await fetch(instance.origin+'/api/launcher/bootstrap',{method:'POST',headers:{'Content-Type':'application/json','X-Studio-Launcher':'1'},body:JSON.stringify({requestId:crypto.randomUUID(),nonce:'a'.repeat(64),instanceId:instance.instanceId})})).status,403);
 assert.equal((await stop(instance.origin,{...connected,status:{...connected.status,instanceId:crypto.randomUUID()}})).status,400);
 const again=await launch(root,options);assert.equal(again.instanceId,instance.instanceId);assert.equal((await native.validate(root,descriptor)),instance.origin);
 assert.equal((await stop(instance.origin,connected)).status,200);connected=null;await new Promise(r=>setTimeout(r,500));assert.equal(fs.existsSync(native.descriptorPath(root,descriptorDirectory)),false);
});
test('D1 stale descriptor, PID reuse/endpoint mismatch and old Extension fail closed',async t=>{
 const root=fixture();t.after(()=>cleanup(root));const options={descriptorDirectory:root,privateDirectory:path.join(root,'private'),extensionHome:root,open:()=>{throw Error('Browser must not open');}};
 const filename=native.descriptorPath(root,root),old=JSON.stringify({pid:2147483000,port:1234});fs.writeFileSync(filename,old);await assert.rejects(launch(root,options),/Old|invalid/i);assert.equal(fs.readFileSync(filename,'utf8'),old);
 const fake={protocolVersion:2,projectKey:native.key(root),instanceId:crypto.randomUUID(),pid:process.pid,port:1234,identity:{...native.identity(process.pid),startTicks:'wrong'}};await assert.rejects(native.validate(root,fake),/identity changed/);
 const folder=path.join(root,'.vscode','extensions');fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,'extensions.json'),JSON.stringify([{identifier:{id:'newweb-local.playwright-test-studio'},version:'0.2.3'}]));await assert.rejects(launch(root,options),/incompatible/);assert.equal(fs.readFileSync(filename,'utf8'),old);
});
test('D1 port binding failure leaks no event timer or descriptor and expired bootstrap is one-use',async t=>{
 const root=fixture();t.after(()=>cleanup(root));const occupied=http.createServer();await new Promise(r=>occupied.listen(0,'127.0.0.1',r));
 try{await assert.rejects(createService({root,port:occupied.address().port}),/EADDRINUSE/);}finally{await new Promise(r=>occupied.close(r));}
 const directory=path.join(root,'private');fs.mkdirSync(directory);const app=await createService({root,privateDirectory:directory,bootstrapTTL:1});t.after(()=>app.close());
 const requestId=crypto.randomUUID(),nonce=crypto.randomBytes(32).toString('hex');fs.writeFileSync(path.join(directory,requestId+'.json'),JSON.stringify({nonce,instanceId:app.instanceId,createdAt:Date.now()}));const issued=app.bootstrap.issue({nonce,requestId,instanceId:app.instanceId});await new Promise(r=>setTimeout(r,10));assert.throws(()=>app.bootstrap.consume(issued.token),/expired/);assert.throws(()=>app.bootstrap.consume(issued.token),/already used/);
});
test('D1 repeated concurrent cold launches remain a single instance in Unicode paths',async t=>{
 const base=fixture(),root=base+' مسیر فارسی';fs.renameSync(base,root);let connected,instance;
 const options={extensionHome:root,descriptorDirectory:root,privateDirectory:path.join(root,'private')};
 t.after(async()=>{if(connected)await stop(instance.origin,connected).catch(()=>{});await new Promise(r=>setTimeout(r,500));cleanup(root);});
 for(let cycle=0;cycle<3;cycle++){
  const urls=[];const results=await Promise.all(Array.from({length:4},()=>launch(root,{...options,open:url=>urls.push(url)})));instance=results[0];
  assert.equal(new Set(results.map(x=>x.pid)).size,1);assert.equal(urls.length,4);connected=await login(instance.origin,urls[0].split('#bootstrap=')[1]);assert.equal((await stop(instance.origin,connected)).status,200);connected=null;
  for(let i=0;fs.existsSync(native.descriptorPath(root,root))&&i<50;i++)await new Promise(r=>setTimeout(r,50));
  assert.equal(fs.existsSync(native.descriptorPath(root,root)),false);
 }
});
test('a genuinely ended Service descriptor, legacy or modern, recovers once across concurrent/repeated launches',async t=>{
 const root=fixture(),file=native.descriptorPath(root,root),options={extensionHome:root,descriptorDirectory:root,privateDirectory:path.join(root,'private')};let instance,connected;
 t.after(async()=>{if(connected)await stop(instance.origin,connected).catch(()=>{});await new Promise(r=>setTimeout(r,500));cleanup(root);});
 for(const legacy of [true,false]){
  let url;instance=await launch(root,{...options,open:value=>{url=value;}});connected=await login(instance.origin,url.split('#bootstrap=')[1]);const old=JSON.parse(fs.readFileSync(file));
  assert.equal((await stop(instance.origin,connected)).status,200);connected=null;
  for(let n=0;fs.existsSync(file)&&n<100;n++)await new Promise(r=>setTimeout(r,50));
  assert.equal(native.probe(old.pid,old.port).process.state,'absent');
  const archived=legacy?{instanceId:old.instanceId,pid:old.pid,port:old.port,startedAt:old.startedAt}:old,bytes=JSON.stringify(archived);fs.writeFileSync(file,bytes,{flag:'wx'});
  const beforeArchive=fs.readdirSync(root).filter(name=>name.includes('.stale-')).length,urls=[];
  const results=await Promise.all(Array.from({length:4},()=>launch(root,{...options,open:value=>urls.push(value)})));
  assert.equal(new Set(results.map(r=>r.instanceId)).size,1);assert.notEqual(results[0].instanceId,old.instanceId);
  const saved=fs.readdirSync(root).filter(name=>name.startsWith(path.basename(file)+'.stale-'));assert.equal(saved.length,beforeArchive+1);assert.ok(saved.some(name=>fs.readFileSync(path.join(root,name),'utf8')===bytes));
  instance=results[0];connected=await login(instance.origin,urls[0].split('#bootstrap=')[1]);const again=await launch(root,{...options,open:()=>{}});assert.equal(again.instanceId,instance.instanceId);assert.equal(fs.readdirSync(root).filter(name=>name.includes('.stale-')).length,beforeArchive+1);
  assert.equal((await stop(instance.origin,connected)).status,200);connected=null;await new Promise(r=>setTimeout(r,500));
 }
});
