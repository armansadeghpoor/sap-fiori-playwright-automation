// Fragments are never sent as HTTP paths. Remove the one-time capability before awaiting anything.
(() => {
 const match=location.hash.match(/^#bootstrap=([a-f0-9]{64})$/);
 if(!match){window.StudioBootstrap=Promise.resolve();return;}
 history.replaceState(null,'',location.pathname);
 window.StudioBootstrap=(async()=>{
  const response=await fetch('/api/bootstrap',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-Studio-Request':'1'},body:JSON.stringify({token:match[1]}),signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw Error('ورود یک‌بارمصرف منقضی یا مصرف شده است؛ Shortcut را دوباره باز کنید.');
 })();
})();
