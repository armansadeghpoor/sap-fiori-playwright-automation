const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');const {spawn}=require('node:child_process');
const native=require('./native.cjs');
const descriptors=require('./descriptor.cjs');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function launch(root,{open=native.openBrowser,extensionHome,descriptorDirectory,privateDirectory}={}){
 root=fs.realpathSync(root);const old=native.legacyExtension(extensionHome);if(old)throw Error('Playwright Test Studio '+old+' is incompatible. Install playwright-test-studio-0.3.0.vsix and Reload VS Code first.');
 const filename=native.descriptorPath(root,descriptorDirectory),directory=native.secureDirectory(privateDirectory||native.privatePath(root));
 let descriptor,verifiedIdentity,spawned=false,recovered=[]; const deadline=Date.now()+20000;
 for(let i=0;i<150&&Date.now()<deadline;i++){
  if(descriptors.exists(filename+'.control')){await delay(100);continue;}
  if(!descriptors.exists(filename)){
   if(!spawned){
    const args=[path.join(__dirname,'start.cjs'),'--root',root,'--background'];
    if(descriptorDirectory)args.push('--descriptor-directory',descriptorDirectory);
    if(privateDirectory)args.push('--private-directory',privateDirectory);
    const child=spawn(process.execPath,args,{stdio:'ignore',detached:true,windowsHide:true,shell:false});child.unref();
    await new Promise((resolve,reject)=>{child.once('spawn',resolve);child.once('error',reject);});spawned=true;
   }
   await delay(100);continue;
  }
  let snapshot;
  try{snapshot=descriptors.read(filename);}catch(error){if(i<10){await delay(100);continue;}throw error;}
  const status=descriptors.assessment(root,snapshot);
  if(status.state==='execution-locked'&&(descriptors.exists(filename+'.control')||!descriptors.locked(root))){await delay(100);continue;}
  if(status.state==='starting'){await delay(100);continue;}
  if(status.state==='alive'){descriptor=snapshot.value;verifiedIdentity=status.actual;break;}
  if(status.state==='stale'){
   let result;
   try{result=descriptors.recover(root,filename);}catch(error){if(error.code==='DESCRIPTOR_BUSY'){await delay(100);continue;}throw error;}
   if(result.state==='recovered'){recovered.push(result.retired);spawned=false;continue;}
   if(['absent','alive','starting'].includes(result.state)){await delay(100);continue;}
   throw descriptors.refuse(result.state,filename);
  }
  throw descriptors.refuse(status.state,filename);
 }
 if(!descriptor)throw Error('Service did not become ready; retry the shortcut. A control file with unknown ownership requires manual review. Descriptor: '+filename);
 const origin=await native.validate(root,descriptor,verifiedIdentity),requestId=crypto.randomUUID(),nonce=crypto.randomBytes(32).toString('hex'),file=path.join(directory,requestId+'.json');
 fs.writeFileSync(file,JSON.stringify({nonce,instanceId:descriptor.instanceId,createdAt:Date.now()}),{flag:'wx',mode:0o600});
 try{
  const bootstrap=await native.json(origin+'/api/launcher/bootstrap',{method:'POST',headers:{'Content-Type':'application/json','X-Studio-Launcher':'1'},body:JSON.stringify({requestId,nonce,instanceId:descriptor.instanceId})});
  if(bootstrap.instanceId!==descriptor.instanceId||!/^[a-f0-9]{64}$/.test(bootstrap.token))throw Error('Invalid bootstrap response.');
  await open(origin+'/#bootstrap='+bootstrap.token);return {origin,instanceId:descriptor.instanceId,pid:descriptor.pid,recovered};
 }finally{try{fs.unlinkSync(file);}catch(e){if(e.code!=='ENOENT')throw e;}}
}
if(require.main===module){if(process.argv.length!==2)throw Error('Launcher accepts no command line arguments.');launch(path.resolve(__dirname,'../../..')).catch(error=>{console.error('Playwright Test Studio: '+error.message);process.exitCode=1;});}
module.exports={launch};
