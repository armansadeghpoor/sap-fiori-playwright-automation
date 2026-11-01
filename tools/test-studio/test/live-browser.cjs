const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');const {fixture,withRunner,cleanup}=require('./fixture.cjs');const {launch}=require('../service/launcher.cjs');
(async()=>{
 const root=fixture();withRunner(root);
 fs.writeFileSync(path.join(root,'TestCases','live.spec.ts'),`const {test}=require('@playwright/test');test('first',async()=>{});test('slow',async()=>{await new Promise(r=>setTimeout(r,8000));});test('failure',()=>{throw Error('SYNTHETIC FAILURE');});`);
 const options={extensionHome:root,descriptorDirectory:root,privateDirectory:path.join(root,'private')};let url;
 const instance=await launch(root,{...options,open:value=>{url=value;}}),browser=await chromium.launch({channel:'chrome',headless:true});let control;
 try{
  const context=await browser.newContext(),page=await context.newPage(),faults=[];page.on('pageerror',e=>faults.push(e.message));page.on('dialog',d=>d.accept());
  await page.goto(url);await page.locator('#dashboard').waitFor({state:'visible'});assert.equal(new URL(page.url()).hash,'');assert.equal(await page.locator('#login').isVisible(),false);
  await page.locator('#discover').click();await page.waitForFunction(()=>document.getElementById('explorer-status').textContent.includes('آماده'));
  await page.locator('#explorer-all').click();await page.locator('#run-selected').click();await page.getByRole('button',{name:'تأیید اجرای انتخاب',exact:true}).click();await page.getByRole('button',{name:'تأیید مستقل Snapshot',exact:true}).click();
  await page.waitForFunction(()=>document.getElementById('execution-progress').textContent.includes('1/3'),{},{timeout:30000});
  const state=await context.request.get(instance.origin+'/api/execution').then(r=>r.json());assert.equal(state.phase,'Running');assert.equal(state.progress.completed,1);
  await launch(root,{...options,open:value=>{url=value;}});control=await browser.newContext();const second=await control.newPage();second.on('dialog',d=>d.accept());await second.goto(url);await second.locator('#dashboard').waitFor({state:'visible'});await second.waitForFunction(()=>document.getElementById('stream-status').textContent.includes('SSE'));
  await context.close(); // The originating browser disappears during the slow test.
  await control.setOffline(true);await new Promise(r=>setTimeout(r,500));await control.setOffline(false);
  await second.waitForFunction(()=>document.getElementById('execution-status').textContent.includes('Failed'),{},{timeout:40000});
  const result=await control.request.get(instance.origin+'/api/execution').then(r=>r.json());assert.equal(result.id,state.id);assert.equal(result.instanceId,instance.instanceId);assert.equal(result.progress.completed,3);assert.deepEqual(result.result.counts.passed,2);assert.equal(result.result.counts.failed,1);
  await second.locator(`[data-run-id="${result.runId}"]`).waitFor();
  // Reopen the originating client without manual pairing, verify the same completed operation.
  await launch(root,{...options,open:value=>{url=value;}});const reopened=await browser.newPage();await reopened.goto(url);await reopened.waitForFunction(()=>document.getElementById('execution-status').textContent.includes('Failed'));
  // Start a second owned operation and interrupt it using the surviving client.
  await second.locator('#explorer-all').click();await second.locator('#run-selected').click();await second.getByRole('button',{name:'تأیید اجرای انتخاب',exact:true}).click();await second.getByRole('button',{name:'تأیید مستقل Snapshot',exact:true}).click();await second.waitForFunction(()=>document.getElementById('execution-status').textContent.includes('Running'));
  const session=await control.request.get(instance.origin+'/api/session').then(r=>r.json());
  assert.equal((await control.request.post(instance.origin+'/api/service/stop',{headers:{Origin:instance.origin,'X-Studio-CSRF':session.csrf},data:{instanceId:instance.instanceId,confirm:true}})).status(),409);
  await second.locator('#execution-stop').click();await second.waitForFunction(()=>document.getElementById('execution-status').textContent.includes('Interrupted'),{},{timeout:30000});
  assert.deepEqual(faults,[]);
  await second.locator('#stop-service').click();await second.waitForFunction(()=>document.getElementById('connection').textContent.includes('stopped'));
  await launch(root,{...options,open:value=>{url=value;}});const fresh=await browser.newPage();fresh.on('dialog',d=>d.accept());await fresh.goto(url);await fresh.locator('#dashboard').waitFor({state:'visible'});
  const freshOrigin=new URL(url).origin,freshState=await fresh.request.get(freshOrigin+'/api/session').then(r=>r.json());assert.notEqual(freshState.instanceId,instance.instanceId);
  await fresh.locator('#stop-service').click();await fresh.waitForFunction(()=>document.getElementById('connection').textContent.includes('stopped'));
  console.log(JSON.stringify({passed:true,checks:['one-click bootstrap without manual code','two browser sessions share SSE','originating browser closed during Run','network reconnect preserves counts','failure 2 passed / 1 failed','History refreshed','Stop Interrupted','Stop Service rejects active operation','owned service restart has new instanceId']}));
 }finally{
  if(control){try{const origin=new URL(url).origin;const s=await control.request.get(origin+'/api/session').then(r=>r.json());await control.request.post(origin+'/api/service/stop',{headers:{Origin:origin,'X-Studio-CSRF':s.csrf},data:{instanceId:s.instanceId,confirm:true}});}catch{}}
  await browser.close();await new Promise(r=>setTimeout(r,500));cleanup(root);
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
