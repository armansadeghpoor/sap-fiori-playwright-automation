(function(target){
 class Cursor{
  constructor(){this.instanceId=null;this.revision=-1;this.value=null;this.seen=new Set();}
  accept(value){
   if(!value||typeof value.instanceId!=='string'||!Number.isSafeInteger(value.revision)||value.revision<0||!value.operation)return false;
   if(this.instanceId===value.instanceId&&value.revision<=this.revision)return false;
   if(this.instanceId!==value.instanceId&&this.seen.has(value.instanceId))return false;
   this.seen.add(value.instanceId);
   this.instanceId=value.instanceId;this.revision=value.revision;this.value=value.operation;return true;
  }
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={Cursor};else target.StudioStreamModel={Cursor};
})(typeof window!=='undefined'?window:globalThis);
