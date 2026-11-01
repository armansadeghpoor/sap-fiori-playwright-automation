const {fail}=require('./repository.cjs');
class Events{
 constructor(instanceId,execution){this.instanceId=instanceId;this.execution=execution;this.revision=0;this.signature='';this.clients=new Set();this.timer=setInterval(()=>this.tick(),250);}
 refresh(){const value=this.execution.get(this.execution.current?.session);const signature=JSON.stringify(value);if(signature!==this.signature){this.signature=signature;this.revision++;return true;}return false;}
 snapshot(session){this.refresh();return {instanceId:this.instanceId,revision:this.revision,operation:this.execution.get(session)};}
 send(client){
  if(client.blocked){client.pending=true;return;}
  const value=this.snapshot(client.session),good=client.response.write(`id: ${this.instanceId}:${this.revision}\nevent: snapshot\ndata: ${JSON.stringify(value)}\n\n`);client.sent=Date.now();
  if(!good){client.blocked=true;client.blockedAt=Date.now();client.response.once('drain',()=>{client.blocked=false;if(client.pending&&this.clients.has(client)){client.pending=false;this.send(client);}});}
 }
 subscribe(request,response,session){
  if(this.clients.size>=32||[...this.clients].filter(c=>c.session===session).length>=2)throw fail(429,'Too many event streams.');
  response.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Connection':'keep-alive','X-Accel-Buffering':'no'});response.write('retry: 1000\n\n');
  const client={response,session,sent:0};this.clients.add(client);response.on('close',()=>this.clients.delete(client));this.send(client);
 }
 tick(){if(!this.clients.size)return;const changed=this.refresh();for(const client of this.clients){if(client.session.expires<=Date.now()||client.blocked&&(Date.now()-client.blockedAt>15000||client.response.writableLength>8*1024*1024)){client.response.destroy();this.clients.delete(client);}else if(changed)this.send(client);else if(!client.blocked&&Date.now()-client.sent>15000){client.sent=Date.now();client.response.write(': heartbeat\n\n');}}}
 close(){clearInterval(this.timer);for(const client of this.clients)client.response.end();this.clients.clear();}
}
module.exports={Events};
