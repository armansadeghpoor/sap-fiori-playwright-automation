const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {fixture,cleanup}=require('./fixture.cjs'),native=require('../service/native.cjs'),descriptors=require('../service/descriptor.cjs');
function setup(t){const root=fixture(),file=native.descriptorPath(root,root),old={instanceId:crypto.randomUUID(),pid:2147483000,port:32392,startedAt:'2026-10-28T13:35:19.609Z'};fs.writeFileSync(file,JSON.stringify(old));t.after(()=>cleanup(root));return {root,file,old};}
const absent=()=>({process:{state:'absent'},endpoint:'free'});
test('recognized legacy and current descriptors are distinct from corrupt/future records',t=>{
 const f=setup(t);assert.equal(descriptors.schema(f.root,f.old),'legacy');
 for(const value of [{pid:f.old.pid,port:1234},{...f.old,secret:'unknown'},{...f.old,pid:0},{...f.old,port:'1234'},{...f.old,startedAt:'bad'}])assert.equal(descriptors.schema(f.root,value),'invalid');
 const id={pid:f.old.pid,exe:process.execPath,startTicks:'638999999999999999'};
 const current={...f.old,protocolVersion:2,projectKey:native.key(f.root),identity:id};assert.equal(descriptors.schema(f.root,current),'modern');assert.equal(descriptors.schema(f.root,{...current,protocolVersion:3}),'invalid');
});
test('only absent PID, free port and absent execution evidence permit recoverable retirement',t=>{
 const f=setup(t),before=fs.readFileSync(f.file);let checks=0;const result=descriptors.recover(f.root,f.file,{probe:()=>{if(++checks===2)assert.throws(()=>require('../studio.cjs').acquireLock(f.root),/Studio/);return absent();}});assert.equal(result.state,'recovered');assert.equal(fs.existsSync(f.file),false);assert.deepEqual(fs.readFileSync(result.retired),before);assert.equal(fs.existsSync(f.file+'.control'),false);assert.equal(descriptors.locked(f.root),false);
});
test('live old Service, inaccessible identity and occupied/unknown ports are preserved',t=>{
 const f=setup(t),before=fs.readFileSync(f.file);
 for(const [processState,endpoint,expected] of [['alive','listening','legacy-alive'],['unknown','free','ownership-unknown'],['absent','listening','endpoint-unknown'],['absent','unknown','endpoint-unknown']]){
  const result=descriptors.recover(f.root,f.file,{probe:()=>({process:{state:processState},endpoint})});assert.equal(result.state,expected);assert.deepEqual(fs.readFileSync(f.file),before);
 }
});
test('PID reuse is never recovered even if the executable path is identical',t=>{
 const f=setup(t);fs.writeFileSync(f.file,JSON.stringify({...f.old,protocolVersion:2,projectKey:native.key(f.root),identity:{pid:f.old.pid,exe:process.execPath,startTicks:'638999999999999999'}}));
 const before=fs.readFileSync(f.file);const result=descriptors.recover(f.root,f.file,{probe:()=>({process:{state:'alive',exe:process.execPath,startTicks:'638888888888888888'},endpoint:'free'})});assert.equal(result.state,'pid-reused');assert.deepEqual(fs.readFileSync(f.file),before);
});
test('execution locks and unknown recovery guards are never changed',t=>{
 const f=setup(t),base=path.join(os.tmpdir(),'playwright-test-studio-'+native.key(f.root)+'.lock');
 for(const file of [base,base+'.recovery']){fs.writeFileSync(file,'unknown fixture owner',{flag:'wx'});try{assert.equal(descriptors.recover(f.root,f.file,{probe:absent}).state,'execution-locked');assert.equal(fs.readFileSync(file,'utf8'),'unknown fixture owner');}finally{fs.unlinkSync(file);}}
 fs.writeFileSync(f.file+'.control','unknown control owner');assert.throws(()=>descriptors.recover(f.root,f.file,{probe:absent}),/ownership is unknown/);assert.equal(fs.readFileSync(f.file+'.control','utf8'),'unknown control owner');
});
test('file replacement or a PID becoming live during recovery aborts without overwriting',t=>{
 const f=setup(t);let changed;
 assert.throws(()=>descriptors.recover(f.root,f.file,{probe:absent,beforeFinalCheck:()=>{changed=JSON.stringify({...f.old,instanceId:crypto.randomUUID()});fs.writeFileSync(f.file,changed);}}),/changed/);assert.equal(fs.readFileSync(f.file,'utf8'),changed);
 let calls=0;const result=descriptors.recover(f.root,f.file,{probe:()=>++calls===1?absent():({process:{state:'alive'},endpoint:'listening'})});assert.equal(result.state,'legacy-alive');assert.equal(fs.readFileSync(f.file,'utf8'),changed);
});
test('malformed and symlink descriptors fail closed; failed OS probe is never absence',t=>{
 const f=setup(t);fs.writeFileSync(f.file,'not json');assert.throws(()=>descriptors.read(f.file),/valid JSON/);assert.equal(fs.readFileSync(f.file,'utf8'),'not json');
 fs.unlinkSync(f.file);const target=path.join(f.root,'outside');fs.mkdirSync(target);fs.symlinkSync(target,f.file,process.platform==='win32'?'junction':'dir');assert.throws(()=>descriptors.read(f.file),/identity/);assert.deepEqual(native.probe(-1,1234),{process:{state:'unknown'},endpoint:'unknown'});
});
