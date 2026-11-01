(() => {
  const $=id=>document.getElementById(id);
  let api,write,history,operation={phase:'Idle'},polling=false,submitting=false,lastFinished=null,source=null,streaming=false,sourceInstance=null;
  const cursor=new window.StudioStreamModel.Cursor();
  function render() {
    const wasBusy=window.StudioExecution.busy;
    window.StudioExecution.busy=Boolean(operation.busy||submitting);
    $('execution-status').textContent=`${operation.phase} · ${operation.scope||''} · ${operation.count||0} tests · ${operation.headed?'Headed':'Headless'}${operation.id?' · #'+operation.id.slice(0,8):''}`;
    const p=operation.progress;
    $('execution-progress').textContent=p?`${p.completed}/${p.total} · Passed ${p.counts?.passed||0} · Failed ${p.counts?.failed||0} · Skipped ${p.counts?.skipped||0} · ${((p.elapsed||0)/1000).toFixed(1)}s · ${p.current||''}`:'';
    $('execution-error').textContent=operation.error?`${operation.error.code}: ${operation.error.message}`:'';
    $('execution-stop').disabled=!operation.busy||!operation.id;
    $('execution-confirm').hidden=!operation.canConfirm;
    $('execution-confirm').textContent=operation.confirmation?.kind==='snapshot'?'تأیید مستقل Snapshot':'تأیید اجرای انتخاب';
    if(wasBusy!==window.StudioExecution.busy)window.dispatchEvent(new Event('studio-execution'));
  }
  async function refresh() {
    if(!api||polling)return;polling=true;
    try {const next=await api('/api/execution');await accept({instanceId:next.instanceId,revision:next.revision,operation:next});}
    catch(e){$('execution-error').textContent=e.message;}finally{polling=false;}
  }
  async function accept(value){
    const previous=cursor.instanceId;
    if(!cursor.accept(value))return;
    if(previous&&previous!==value.instanceId){lastFinished=null;$('stream-status').textContent='Service restart detected — وضعیت تازه دریافت شد.';}
    operation=cursor.value;render();
    if(operation.finishedAt&&lastFinished!==operation.id){lastFinished=operation.id;await history();}
  }
  function connectEvents(instanceId){
    if(source&&sourceInstance===instanceId&&source.readyState!==2)return;
    source?.close();sourceInstance=instanceId;streaming=false;
    if(!window.EventSource)return;
    source=new EventSource('/api/events');
    source.addEventListener('snapshot',event=>{
      try{const value=JSON.parse(event.data);if(event.lastEventId!==`${value.instanceId}:${value.revision}`)throw Error('Invalid event ID');streaming=true;$('stream-status').textContent='Live · SSE';void accept(value).catch(e=>{$('execution-error').textContent=e.message;});}
      catch(e){$('stream-status').textContent='رویداد نامعتبر؛ آخرین وضعیت معتبر حفظ شد.';}
    });
    source.onopen=()=>{streaming=true;};
    source.onerror=()=>{streaming=false;$('stream-status').textContent='ارتباط زنده قطع است؛ آخرین Snapshot حفظ شد. تلاش برای اتصال مجدد…';};
  }
  async function start(input) {
    if(submitting||operation.busy)return;submitting=true;render();
    const request={...input,requestId:crypto.randomUUID(),headed:$('execution-headed').value==='true'};
    try {operation=await write('/api/execution/start',request);await refresh();}
    catch(e){$('execution-error').textContent=e.message;}
    finally{submitting=false;window.StudioExecution.busy=Boolean(operation.busy);window.dispatchEvent(new Event('studio-execution'));}
  }
  $('execution-confirm').onclick=async()=>{
    const op=operation,c=op.confirmation;if(!c)return;
    const names=(op.selection||[]).map(t=>`[${t.project}] ${t.path} · ${t.titles.join(' › ')}`).join('\n');
    const accepted=window.confirm(`${c.message}\nOperation: ${op.id}\nاعتبار تا ${new Date(c.expiresAt).toLocaleTimeString()}\n${names}`);
    try {await write('/api/execution/confirm',{operationId:op.id,token:c.token,confirm:accepted});await refresh();}
    catch(e){$('execution-error').textContent=e.message;}
  };
  $('execution-stop').onclick=async()=>{try{await write('/api/execution/stop',{operationId:operation.id});await refresh();}catch(e){$('execution-error').textContent=e.message;}};
  window.StudioExecution={busy:false,start,async connect(read,mutate,refreshHistory,instanceId){api=read;write=mutate;history=refreshHistory;await refresh();connectEvents(instanceId);}};
  setInterval(()=>{if(!streaming)void refresh();},5000);
  window.addEventListener('pagehide',()=>source?.close());
})();
