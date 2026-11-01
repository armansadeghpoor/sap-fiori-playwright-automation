const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const os=require('node:os');
const {chromium}=require('playwright');const {createService}=require('../service/server.cjs');
const {explorerFixture,cleanup}=require('./explorer-fixture.cjs');
(async()=>{
 const f=explorerFixture();fs.writeFileSync(f.source,`const {test}=require('@playwright/test');test('اجرا از Dashboard',()=>{});test('decoy',()=>{throw Error('DECOY');});`);
 const app=await createService({root:f.root}),browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1600,height:1000}}),faults=[];page.on('pageerror',e=>faults.push(e.message));page.on('dialog',d=>d.accept());
  await page.goto(app.origin);await page.locator('#code').fill(app.pairingCode);await page.locator('#login button').click();await page.locator('#discover').click();
  await page.waitForFunction(()=>document.getElementById('explorer-status').textContent.includes('آماده'));
  const chosen=app.catalog.get().tests.find(t=>t.title==='اجرا از Dashboard');
  await page.locator('#explorer-search').fill('اجرا از Dashboard');
  const row=page.locator(`[data-node-key="test:${chosen.id}"]`);
  await row.getByRole('button',{name:'Run Test',exact:true}).click();
  await page.getByRole('button',{name:'تأیید اجرای انتخاب',exact:true}).click();
  await page.getByRole('button',{name:'تأیید مستقل Snapshot',exact:true}).click();
  await page.waitForFunction(()=>document.getElementById('execution-status').textContent.includes('Completed'),{},{timeout:30000});
  assert.equal(app.execution.current.count,1);const id=app.execution.current.runId;
  await page.locator(`[data-run-id="${id}"]`).click();await page.locator('#tests input[type=checkbox]').check();assert.equal(await page.locator('#rerun-selected').isEnabled(),true);
  assert.equal(await page.locator('#history-selected').innerText(),'0 انتخاب');
  const output=fs.mkdtempSync(path.join(os.tmpdir(),'studio-execution-'));
  for(const theme of ['dark','light']){await page.evaluate(value=>document.documentElement.dataset.theme=value,theme);for(const width of [390,800,1100,1600]){
   await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,theme+'/'+width);
   if(width===1600)await page.screenshot({path:path.join(output,theme+'.png'),fullPage:true});
  }}
  assert.deepEqual(faults,[]);console.log(JSON.stringify({passed:true,output,checks:['Run Test','two independent confirmations','structured progress','History refresh','independent rerun selection','Dark/Light responsive']}));
 }finally{await browser.close();await app.close();cleanup(f.root);}
})().catch(e=>{console.error(e);process.exitCode=1;});
