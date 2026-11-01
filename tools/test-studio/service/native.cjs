// Native launcher boundary. No project credentials and no durable bearer token.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {execFileSync,execFile}=require('node:child_process');
const key=root=>crypto.createHash('sha256').update(process.platform==='win32'?fs.realpathSync(root).toLowerCase():fs.realpathSync(root)).digest('hex').slice(0,24);
const descriptorPath=(root,directory=os.tmpdir())=>path.join(directory,'pw-studio-readonly-'+key(root)+'.json');
const privatePath=root=>path.join(process.env.LOCALAPPDATA||os.tmpdir(),'PlaywrightTestStudio',key(root));
const powershell=path.join(process.env.SystemRoot||'C:\\Windows','System32','WindowsPowerShell','v1.0','powershell.exe');
function identity(pid){
 if(!Number.isSafeInteger(pid)||pid<1)throw Error('Invalid process identity.');
 const result=execFileSync(powershell,['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.join(__dirname,'identity.ps1'),'-ProcessId',String(pid)],{encoding:'utf8',windowsHide:true,timeout:10000,stdio:['ignore','pipe','pipe']});
 return JSON.parse(result.replace(/^\uFEFF/,''));
}
function probe(pid,port){
 if(!Number.isSafeInteger(pid)||pid<1||pid>2147483647||!(port===null||Number.isInteger(port)&&port>0&&port<65536))return {process:{state:'unknown'},endpoint:'unknown'};
 try{
  const result=execFileSync(powershell,['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.join(__dirname,'process-probe.ps1'),'-ProcessId',String(pid),'-Port',String(port||0)],{encoding:'utf8',windowsHide:true,timeout:10000,stdio:['ignore','pipe','pipe']});
  return JSON.parse(result.replace(/^\uFEFF/,''));
 }catch{return {process:{state:'unknown'},endpoint:'unknown'};}
}
function noLinks(folder){let current=path.parse(path.resolve(folder)).root;for(const part of path.resolve(folder).slice(current.length).split(path.sep).filter(Boolean)){current=path.join(current,part);if(fs.existsSync(current)&&fs.lstatSync(current).isSymbolicLink())throw Error('Launcher directory contains a junction/symlink.');}}
function secureDirectory(folder){
 noLinks(folder);
 execFileSync(powershell,['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.join(__dirname,'private-directory.ps1'),'-Directory',folder],{windowsHide:true,timeout:10000,stdio:'pipe'});
 noLinks(folder);return folder;
}
async function json(url,options={}){
 const response=await fetch(url,{...options,redirect:'error',signal:AbortSignal.timeout(4000)});
 const body=await response.text();if(body.length>65536)throw Error('Invalid local response.');
 if(!response.ok){let reason='';try{reason=JSON.parse(body).error||'';}catch{}throw Error('Local service rejected request ('+response.status+'): '+String(reason).slice(0,200));}return JSON.parse(body);
}
function openBrowser(url){return new Promise((resolve,reject)=>{
 execFile(powershell,['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.join(__dirname,'open-browser.ps1'),'-Url',url],{stdio:'ignore',windowsHide:true,timeout:15000},error=>{if(error)reject(Error('Windows could not open the default browser. Reopen the Studio shortcut; its owned Service was preserved.'));else resolve();});
});}
async function validate(root,descriptor,verifiedIdentity){
 if(descriptor.protocolVersion!==2||descriptor.projectKey!==key(root)||!/^[a-f0-9-]{36}$/.test(descriptor.instanceId)||!Number.isInteger(descriptor.port)||descriptor.port<1||descriptor.port>65535)throw Error('Old or invalid service descriptor; close the known old instance normally and review ownership.');
 const actual=verifiedIdentity||identity(descriptor.pid);
 if(actual.startTicks!==descriptor.identity?.startTicks||actual.exe.toLowerCase()!==descriptor.identity?.exe?.toLowerCase()||actual.exe.toLowerCase()!==process.execPath.toLowerCase())throw Error('Process identity changed; no process or descriptor was modified.');
 const origin='http://127.0.0.1:'+descriptor.port,health=await json(origin+'/api/health');
 if(health.instanceId!==descriptor.instanceId||health.pid!==descriptor.pid||health.projectKey!==key(root)||health.protocolVersion!==2)throw Error('Endpoint identity does not match its process descriptor.');
 return origin;
}
function legacyExtension(home=os.homedir()){
 const file=path.join(home,'.vscode','extensions','extensions.json');if(!fs.existsSync(file))return null;
 const records=JSON.parse(fs.readFileSync(file,'utf8'));
 return records.find(x=>x.identifier?.id?.toLowerCase()==='newweb-local.playwright-test-studio'&&String(x.version).split('.')[0]==='0'&&Number(String(x.version).split('.')[1])<3)?.version||null;
}
module.exports={key,descriptorPath,privatePath,identity,probe,secureDirectory,noLinks,json,openBrowser,validate,legacyExtension};
