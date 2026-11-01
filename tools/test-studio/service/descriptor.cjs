// Existing execution locks are never recovered here. A fresh maintenance lock serializes safe descriptor retirement.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const native=require('./native.cjs');
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u;
const exists=file=>{try{fs.lstatSync(file);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
function guard(filename){
 native.noLinks(path.dirname(filename));const file=filename+'.control';let fd;
 try{fd=fs.openSync(file,'wx',0o600);}catch(e){if(e.code==='EEXIST')throw Object.assign(Error('Descriptor control is busy or ownership is unknown. Review '+file+'; it was not removed.'),{code:'DESCRIPTOR_BUSY'});throw e;}
 const token=crypto.randomUUID();try{fs.writeSync(fd,JSON.stringify({pid:process.pid,token,createdAt:new Date().toISOString()}));fs.fsyncSync(fd);}catch(e){fs.closeSync(fd);throw e;}
 return ()=>{fs.closeSync(fd);try{if(JSON.parse(fs.readFileSync(file,'utf8')).token===token)fs.unlinkSync(file);}catch{}};
}
function read(filename){
 native.noLinks(path.dirname(filename));const stat=fs.lstatSync(filename,{bigint:true});
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size>16384n||stat.ino===0n)throw Error('Invalid descriptor file identity; manual review required: '+filename);
 const bytes=fs.readFileSync(filename);const after=fs.lstatSync(filename,{bigint:true});
 if(stat.ino!==after.ino||stat.dev!==after.dev||stat.mtimeNs!==after.mtimeNs||stat.size!==after.size)throw Error('Descriptor changed while reading; retry the shortcut.');
 let value;try{value=JSON.parse(bytes.toString('utf8'));}catch{throw Error('Descriptor is not valid JSON; manual review required: '+filename);}
 return {value,bytes,ino:stat.ino,dev:stat.dev,mtime:stat.mtimeNs};
}
function schema(root,value){
 if(!value||typeof value!=='object'||Array.isArray(value)||!uuid.test(value.instanceId)||!Number.isSafeInteger(value.pid)||value.pid<1||value.pid>2147483647||
   !(value.port===null||Number.isInteger(value.port)&&value.port>0&&value.port<65536)||typeof value.startedAt!=='string'||!Number.isFinite(Date.parse(value.startedAt))||new Date(value.startedAt).toISOString()!==value.startedAt||Date.parse(value.startedAt)>Date.now()+5000)return 'invalid';
 const keys=Object.keys(value).sort().join(',');
 if(keys==='instanceId,pid,port,startedAt')return 'legacy';
 if(keys!=='identity,instanceId,pid,port,projectKey,protocolVersion,startedAt'||value.protocolVersion!==2||value.projectKey!==native.key(root))return 'invalid';
 if(value.identity===null&&value.port===null)return 'modern-starting';
 const id=value.identity;
 if(!id||Object.keys(id).sort().join(',')!=='exe,pid,startTicks'||id.pid!==value.pid||typeof id.exe!=='string'||id.exe.toLowerCase()!==process.execPath.toLowerCase()||typeof id.startTicks!=='string'||!/^\d{15,20}$/u.test(id.startTicks)||value.port===null)return 'invalid';
 return 'modern';
}
function locked(root){const base=path.join(os.tmpdir(),'playwright-test-studio-'+native.key(root)+'.lock');return exists(base)||exists(base+'.recovery');}
function compare(filename,snapshot){const current=read(filename);if(current.ino!==snapshot.ino||current.dev!==snapshot.dev||current.mtime!==snapshot.mtime||!current.bytes.equals(snapshot.bytes))throw Error('Descriptor changed; recovery cancelled without replacing it.');return current;}
function assessment(root,snapshot,probe=native.probe,executionOwned=false){
 const type=schema(root,snapshot.value);if(type==='invalid')return {state:'invalid',type};
 const result=probe(snapshot.value.pid,snapshot.value.port);
 if(result.process.state==='unknown')return {state:'ownership-unknown',type};
 if(result.process.state==='alive'){
  if(type==='legacy')return {state:'legacy-alive',type};
  if(type==='modern-starting')return {state:'starting',type};
  if(result.process.exe?.toLowerCase()!==snapshot.value.identity.exe.toLowerCase()||result.process.startTicks!==snapshot.value.identity.startTicks)return {state:'pid-reused',type};
  return {state:'alive',type,actual:result.process};
 }
 if(result.process.state!=='absent')return {state:'ownership-unknown',type};
 if(!['free','unassigned'].includes(result.endpoint))return {state:'endpoint-unknown',type};
 if(!executionOwned&&locked(root))return {state:'execution-locked',type};
 return {state:'stale',type};
}
function refuse(state,filename){return Error(`Descriptor status: ${state}. No process or execution lock was changed. Descriptor preserved: ${filename}. Close a positively identified live old Service normally; invalid/unknown ownership needs the manual recovery checklist in LAUNCHER_RECOVERY.md.`);}
function recover(root,filename,{probe=native.probe,beforeFinalCheck}={}){
 const release=guard(filename);
 try{
  if(!exists(filename))return {state:'absent'};
  const snapshot=read(filename),first=assessment(root,snapshot,probe);
  if(first.state!=='stale')return {...first,descriptor:snapshot.value};
  beforeFinalCheck?.();
  compare(filename,snapshot);
  // Acquire only a NEW cooperative execution lock, closing the race with Extension/Recorder starts.
  let releaseExecution;
  try{releaseExecution=require('./trash.cjs').maintenanceLock(root);}catch(error){if(error.status===409)return {state:'execution-locked'};throw error;}
  try{
  const second=assessment(root,snapshot,probe,true);
  if(second.state!=='stale')return {...second,descriptor:snapshot.value};
  compare(filename,snapshot);
  const retired=filename+'.stale-'+snapshot.value.instanceId+'-'+crypto.randomUUID()+'.json';
  if(exists(retired))throw Error('Retirement destination exists; descriptor preserved.');
  fs.renameSync(filename,retired);
  const saved=read(retired);
  if(saved.ino!==snapshot.ino||saved.dev!==snapshot.dev||!saved.bytes.equals(snapshot.bytes))throw Error('Retired descriptor changed; evidence retained for manual review: '+retired);
  return {state:'recovered',retired,type:first.type};
  }finally{releaseExecution();}
 }finally{release();}
}
module.exports={guard,read,schema,assessment,recover,refuse,exists,locked};
