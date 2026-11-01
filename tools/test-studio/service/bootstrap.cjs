const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {fail}=require('./repository.cjs');const {noLinks}=require('./native.cjs');
class Bootstrap{
 constructor(instanceId,directory,ttl=30000){this.instanceId=instanceId;this.directory=directory;this.ttl=ttl;this.tokens=new Map();}
 issue(input){
  if(!this.directory||!input||Object.keys(input).sort().join(',')!=='instanceId,nonce,requestId'||input.instanceId!==this.instanceId||!/^[a-f0-9-]{36}$/.test(input.requestId)||!/^[a-f0-9]{64}$/.test(input.nonce))throw fail(403,'Invalid native bootstrap.');
  noLinks(this.directory);const file=path.join(this.directory,input.requestId+'.json');
  let value;try{const st=fs.lstatSync(file);if(!st.isFile()||st.isSymbolicLink()||st.size>2048)throw Error();value=JSON.parse(fs.readFileSync(file,'utf8'));}catch{throw fail(403,'Native request not found.');}
  if(value.nonce!==input.nonce||value.instanceId!==this.instanceId||!Number.isFinite(value.createdAt)||Date.now()-value.createdAt>15000||value.createdAt>Date.now()+1000)throw fail(403,'Expired native request.');
  fs.unlinkSync(file);for(const [token,expiry]of this.tokens)if(expiry<=Date.now())this.tokens.delete(token);
  if(this.tokens.size>=32)throw fail(429,'Bootstrap limit reached.');
  const token=crypto.randomBytes(32).toString('hex');this.tokens.set(token,Date.now()+this.ttl);return {token,instanceId:this.instanceId,expiresIn:this.ttl};
 }
 consume(token){if(typeof token!=='string'||!this.tokens.has(token))throw fail(401,'Invalid or already used bootstrap.');const expiry=this.tokens.get(token);this.tokens.delete(token);if(expiry<=Date.now())throw fail(401,'Bootstrap expired; reopen the launcher.');}
}
module.exports={Bootstrap};
