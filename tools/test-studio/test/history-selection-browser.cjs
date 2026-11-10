// Standalone regression harness: never opens real History or imports a spec.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { fixture, cleanup } = require('./fixture.cjs');
const { History, hashFile } = require('../regression/history.cjs');
const { createService } = require('../service/server.cjs');

async function scenario(remaining) {
  const root = fixture(), store = new History(root), sources = [];
  function seed(label, failed) {
    const file = path.join(root, 'TestCases', label + '.spec.ts');
    fs.writeFileSync(file, '// comment-only fixture source: ' + label); sources.push([file, fs.readFileSync(file)]);
    const test = { id:label, title:label, titles:[label], file, listFile:path.relative(root,file), project:'Fixture', line:1, column:1, sourceHash:hashFile(file) };
    const run = store.create({ scope:'fixture', label, tests:[test] });
    store.finalize(run,{status:failed?'failed':'passed',complete:true,tests:[{...test,outcome:failed?'failed':'passed',attempts:failed?[0,1].map(retry=>({retry,status:'failed',duration:12,errors:[{message:label+' error '+retry,stack:label+' stack '+retry}],attachments:[]})):[{retry:0,status:'passed',duration:7,errors:[],attachments:[]}]}]});
    return run.manifest.id;
  }
  const old = seed('PREVIOUS_SELECTED_RUN', true), next = remaining ? seed('REMAINING_RUN', false) : null;
  const app = await createService({root}); let browser;
  try {
    browser = await chromium.launch({channel:'chrome',headless:true}); const page = await browser.newPage(), errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(() => {
      window.__historyFaults=[];
      window.addEventListener('unhandledrejection',e=>window.__historyFaults.push(String(e.reason?.message||e.reason)));
      window.addEventListener('DOMContentLoaded',()=>{
        const error=document.getElementById('error');
        new MutationObserver(()=>{if(error.textContent)window.__historyFaults.push(error.textContent);}).observe(error,{childList:true,subtree:true,characterData:true});
      });
    });
    await page.goto(app.origin); await page.locator('#code').fill(app.pairingCode); await page.locator('#login button').click();
    await page.locator(`[data-run-id="${old}"]`).click();
    await page.waitForFunction(id=>document.getElementById('run-id').textContent===id,old);
    await page.waitForFunction(()=>document.querySelectorAll('#attempts details').length===2&&document.getElementById('code-preview').textContent.includes('PREVIOUS_SELECTED_RUN'));
    await page.locator('#tests input[type=checkbox]').first().check();
    await page.locator(`[data-delete-id="${old}"]`).click(); await page.locator('#history-confirm').waitFor({state:'visible'});
    await page.locator('#confirm-history').click();
    await page.waitForFunction(()=>!document.getElementById('history-confirm').open&&!document.getElementById('cancel-history').disabled);
    assert.equal(app.repository.list().length,remaining?1:0); assert.equal(app.trash.list().length,1);
    assert.equal(await page.locator(`[data-run-id="${old}"]`).count(),0);
    if (remaining) {
      await page.waitForFunction(id=>document.getElementById('run-id').textContent===id,next);
      await page.waitForFunction(()=>document.getElementById('code-preview').textContent.includes('REMAINING_RUN'));
      assert.equal(await page.locator('#attempts details').count(),1);
      for(const id of ['overview','test-detail'])assert.ok(!(await page.locator('#'+id).textContent()).includes('PREVIOUS_SELECTED_RUN'),id+' must show only the remaining Run');
    } else {
      assert.equal(await page.locator('#empty').isVisible(),true);
      assert.equal(await page.locator('.history-card').count(),0);
      assert.equal(await page.locator('#run-id').textContent(),'');
      assert.equal(await page.locator('#test-detail').isVisible(),false);
      for(const id of ['tests','attempts','media','code-preview','artifacts','test-title','test-meta','test-outcome','failure-message','stack','source-note','source-path','run-note','run-errors','summary-note'])assert.equal(await page.locator('#'+id).textContent(),'',id+' must be cleared');
      assert.match(await page.locator('#rerun-count').textContent(),/^0 /);
      for(const id of ['rerun-selected','rerun-failed','open-report','open-archive'])assert.equal(await page.locator('#'+id).isDisabled(),true,id+' must be disabled');
      assert.ok(!(await page.locator('#overview').textContent()).includes('PREVIOUS_SELECTED_RUN'));
    }
    assert.equal(await page.locator('#error').textContent(),'','successful deletion must not leave an error banner');
    assert.deepEqual(errors,[]); assert.deepEqual(await page.evaluate(()=>window.__historyFaults),[],'no caught/transient error banner or unhandled rejection');
    for(const [file,bytes]of sources)assert.deepEqual(fs.readFileSync(file),bytes);
    assert.equal(app.execution.current,null); assert.equal(app.catalog.pending,null);
    return remaining?'selected Run deleted with another Run remaining':'last selected Run deleted, empty History and cleared display';
  } finally {await browser?.close();await app.close();cleanup(root);}
}
(async()=>{
  const results=[];
  // Run both scenarios even if the first fails; keep each failure visible.
  for(const remaining of [false,true]) {
    try {const check=await scenario(remaining);results.push({remaining,passed:true,check});}
    catch(error){results.push({remaining,passed:false,error:error.message});}
  }
  console.log(JSON.stringify({fixtureOnly:true,results}));
  assert.ok(results.every(r=>r.passed),'History selection regressions failed; see individual fixture results.');
})().catch(error=>{console.error(error);process.exitCode=1;});
