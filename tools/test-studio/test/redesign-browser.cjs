const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {chromium} = require('playwright');
const {createService} = require('../service/server.cjs');
const {explorerFixture,cleanup,fingerprint} = require('./explorer-fixture.cjs');
(async()=>{
 const before=process.argv.includes('--before'), output=process.env.STUDIO_VISUAL_OUTPUT||fs.mkdtempSync(path.join(os.tmpdir(),'studio-visual-'));
 fs.mkdirSync(output,{recursive:true});const f=explorerFixture(),app=await createService({root:f.root});let browser;
 try {
  const original=fingerprint(f.history.base);browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await browser.newPage({viewport:{width:1600,height:1000}}),faults=[];page.on('pageerror',e=>faults.push(e.message));
  if(before && process.env.STUDIO_VISUAL_BASELINE){
   const allowed=new Set(['dashboard.html','dashboard.css','dashboard.js','explorer.js','execution.js','bridge.js']);
   await page.route(app.origin+'/**',async route=>{
    const name=new URL(route.request().url()).pathname.slice(1)||'dashboard.html';
    if(allowed.has(name)){const file=path.join(process.env.STUDIO_VISUAL_BASELINE,name);const response=await route.fetch();await route.fulfill({response,body:fs.readFileSync(file)});}else await route.continue();
   });
  }
  await page.goto(app.origin);await page.locator('#code').fill(app.pairingCode);if(!before)assert.equal(await page.locator('#overview').isVisible(),false);await page.locator('#login button').click();await page.locator('.history-card').first().waitFor();
  await page.locator('#discover').click();await page.waitForFunction(()=>!document.getElementById('discover').disabled);assert.equal(app.catalog.get().phase,'ready');
  await page.locator('#explorer-search').fill('عنوان');await page.locator('#explorer-all').click();
  await page.locator(`[data-run-id="${f.failed.manifest.id}"]`).click();await page.locator('#code-preview .active').waitFor();
  if(!before){
   assert.equal(await page.locator('#metrics .metric').count(),4);assert.equal(await page.locator('#metrics .metric b').first().innerText(),'3');
   assert.match(await page.locator('#summary-scope').innerText(),/Run/);assert.match(await page.locator('#explorer-count').innerText(),/8 تست/);
   await page.locator('#nav-toggle').click();assert.equal(await page.locator('#nav-toggle').getAttribute('aria-expanded'),'false');await page.locator('#nav-toggle').click();
   await page.setViewportSize({width:1100,height:1000});
   const selection=await page.locator('#explorer-selected').innerText(),source=await page.locator('#code-preview').textContent();
   await page.evaluate(()=>window.originalInspector=document.querySelector('.inspector'));
   await page.locator('#inspector-expand').click();assert.equal(await page.locator('#diagnostics-drawer').isVisible(),true);
   assert.equal(await page.evaluate(()=>window.originalInspector===document.querySelector('#diagnostics-drawer .inspector')),true);
   await page.screenshot({path:path.join(output,'drawer-dark-1100.png'),fullPage:false});
   await page.keyboard.press('Escape');await page.locator('#inspector-slot .inspector').waitFor({state:'visible'});assert.equal(await page.locator('#diagnostics-drawer').isVisible(),false);
   assert.equal(await page.locator('#code-preview').textContent(),source);assert.equal(await page.locator('#explorer-selected').innerText(),selection);
   assert.equal(await page.locator('#inspector-expand').evaluate(e=>document.activeElement===e),true);
   await page.locator('a[href="#execution-panel"]').click();assert.equal(await page.locator('#execution-panel').evaluate(e=>document.activeElement===e),true);
  }
  if(!before)await page.locator('a[href="#overview"]').filter({hasText:'Overview'}).click();
  const captures=[], contrasts=[];
  for(const theme of ['dark','light']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   if(!before){
    const tokens=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement),names=['text','text-muted','text-subtle','accent-text','running','passed','failed','warning','skipped','surface','accent-solid','on-accent'];return Object.fromEntries(names.map(n=>[n,s.getPropertyValue('--ps-'+n).trim()]));});
    const luminance=hex=>{const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
    for(const name of ['text','text-muted','text-subtle','accent-text','running','passed','failed','warning','skipped','on-accent']){const a=luminance(tokens[name]),b=luminance(tokens[name==='on-accent'?'accent-solid':'surface']),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert.ok(ratio>=4.5,theme+' '+name+' contrast '+ratio);contrasts.push({theme,name,ratio:Math.round(ratio*100)/100});}
   }
   for(const width of [1600,1440,1100,800,390]){
    await page.setViewportSize({width,height:1000});await page.evaluate(()=>window.scrollTo(0,0));
    if(!before){
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${theme}/${width}: page overflow`);
     if(width===390){for(const item of await page.locator('#nav-links a').all()){const box=await item.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width,'mobile navigation accessible');}}
     const boxes=await page.locator('#dashboard > *, .work-center > *').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).display!=='none').map(n=>({id:n.id,rect:n.getBoundingClientRect().toJSON()})));
     for(const b of boxes)assert.ok(b.rect.x>=-1&&b.rect.right<=width+1,`${b.id} outside viewport ${width}`);
     if(width>=1440){const a=await page.locator('.explorer').boundingBox(),b=await page.locator('.inspector').boundingBox();assert.ok(b.width>350);assert.ok(Math.abs(a.y-b.y)<2);}
    }
    const name=`${before?'before':'after'}-${theme}-${width}.png`;await page.screenshot({path:path.join(output,name),fullPage:true});captures.push(name);if(width===1600||width===390)await page.screenshot({path:path.join(output,(before?'before':'after')+'-'+theme+'-'+width+'-viewport.png'),fullPage:false});
   }
  }
  if(!before){
   const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));assert.equal(ids.length,new Set(ids).size);
   await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('#theme').evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
   assert.equal(await page.locator('#code-preview').evaluate(e=>getComputedStyle(e).direction),'ltr');
   await page.locator('#theme').focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');assert.notEqual(await page.locator('#theme').evaluate(e=>getComputedStyle(e).outlineStyle),'none');
  }
  if(!before){
   await page.locator('#inspector-expand').click();await page.context().clearCookies();
   await page.locator('#login').waitFor({state:'visible',timeout:12000});
   assert.equal(await page.locator('#overview').isVisible(),false,'summary hidden after session ends');
   assert.equal(await page.locator('#diagnostics-drawer').isVisible(),false,'drawer closed after session ends');
   assert.equal(await page.locator('#dashboard').isVisible(),false);
  }
  assert.deepEqual(fingerprint(f.history.base),original);assert.equal(fs.existsSync(path.join(f.root,'BODY_MUST_NOT_RUN')),false);assert.deepEqual(faults,[]);
  console.log(JSON.stringify({passed:true,before,output,captures,contrasts,checks:before?['baseline assets rendered','fixture-only discovery','history unchanged','no test bodies executed']:['fixture-only discovery','selected-run summary separate from catalog','responsive themes','same-node drawer preserves selection/source/focus','keyboard navigation','reduced motion','unique DOM IDs','history unchanged','no test bodies executed','text contrast >=4.5 in both themes','expired-session presentation closes drawer and summary']}));
 }finally{if(browser)await browser.close();await app.close();cleanup(f.root);}
})().catch(e=>{console.error(e);process.exitCode=1;});
