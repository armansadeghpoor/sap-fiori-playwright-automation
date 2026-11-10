const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const { fixture, withRunner, cleanup } = require('./fixture.cjs');
const { RegressionManager } = require('../regression/manager.cjs');
const { createService } = require('../service/server.cjs');
const { BridgeHost } = require('../bridge/host.cjs');
const { fingerprint } = require('./standalone-fixture.cjs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(fn) { const end = Date.now() + 30000; while (!fn()) { if (Date.now() > end) throw Error('Viewer fixture timeout'); await sleep(50); } }
(async () => {
  const root = fixture(); withRunner(root); const terminals = [], closes = [], reveals = []; let browser, app, host;
  try {
    fs.writeFileSync(path.join(root,'TestCases','گزارش.spec.ts'), "const {test,expect}=require('@playwright/test');test('synthetic report failure',()=>{console.log('ACTUAL_FIXTURE_STDOUT فارسی');console.error('ACTUAL_FIXTURE_STDERR');console.log('password=fixture-only-private-value');expect(1).toBe(2);});");
    const manager = new RegressionManager({root:()=>root,node:()=>process.execPath});
    const run = await manager.run({scope:'suite',headed:false}); assert.equal(run.summary.status,'failed'); run.folder = manager.store().directory(run.manifest.id);
    browser = await chromium.launch({channel:'chrome',headless:true});
    const recorded = await browser.newContext(); await recorded.tracing.start({screenshots:true,snapshots:true});
    const recordingPage = await recorded.newPage(); await recordingPage.goto('data:text/html,<button>Trace fixture button</button>'); await recordingPage.getByRole('button').click();
    fs.mkdirSync(path.join(run.folder,'attachments'),{recursive:true}); await recorded.tracing.stop({path:path.join(run.folder,'attachments/fixture.zip')}); await recorded.close();
    const summaryFile = path.join(run.folder,'summary.json'), summary = JSON.parse(fs.readFileSync(summaryFile));
    summary.tests[0].attempts[0].attachments.push({name:'trace',path:'attachments/fixture.zip',contentType:'application/zip'});
    summary.tests[0].attempts.push({retry:1,status:'failed',errors:[{message:'earlier / later attempt فارسی',stack:'stack <b>literal</b>'}]});
    fs.writeFileSync(summaryFile,JSON.stringify(summary)); const before = fingerprint(path.join(root,'.playwright-studio'));
    const vscode = {workspace:{name:'Viewer fixture',textDocuments:[],getConfiguration:()=>({get:()=>process.execPath})},Uri:{file:fsPath=>({fsPath})},commands:{executeCommand:async (...args)=>reveals.push(args)},window:{
      onDidCloseTerminal(callback) {closes.push(callback);return {dispose(){}};},
      createTerminal(options) {
        const env = {...process.env,...options.env,COPILOT_CLI:'fixture',PWTEST_UNDER_TEST:'1'}; for(const k of Object.keys(env)) if(env[k]===null) delete env[k];
        const child = spawn(options.shellPath,options.shellArgs,{cwd:options.cwd,env,windowsHide:true,shell:false});
        const terminal = {options,child,output:'',show(){},async close(){if(child.exitCode===null){child.kill();await new Promise(r=>child.once('exit',r));}closes.forEach(callback=>callback(terminal));}};
        child.stdout.on('data',c=>terminal.output+=c); child.stderr.on('data',c=>terminal.output+=c); terminals.push(terminal); return terminal;
      }
    }};
    host = await new BridgeHost(vscode,()=>root,{directory:path.join(root,'bridges')}).start();
    let blocked = false;
    app = await createService({root,bridgeOptions:{directory:path.join(root,'bridges')},catalogOptions:{discover:async ({signal})=>{if(blocked) await new Promise((r,j)=>signal.addEventListener('abort',()=>j(Error('cancelled')),{once:true}));return {rootDir:path.join(root,'TestCases'),tests:run.manifest.tests};}}});
    const page = await browser.newPage({viewport:{width:1600,height:1000}}), faults=[]; page.on('pageerror',e=>faults.push(e.message));
    await page.goto(app.origin); await page.locator('#code').fill(app.pairingCode); await page.locator('#login button').click();
    await page.locator('.history-card').first().click(); await page.locator('#test-detail').waitFor({state:'visible'});
    assert.equal(await page.locator('#attempts details').count(),2); assert.equal(await page.locator('#attempts b').count(),0);
    assert.equal(await page.getByRole('button',{name:'Open Trace Viewer',exact:true}).count(),2);
    assert.ok(await page.locator('#artifacts a[download]').count());
    await page.locator('#open-report').click(); await until(()=>terminals.length===1 && /http:\/\/127\.0\.0\.1:\d+/u.test(terminals[0].output));
    const reportUrl = terminals[0].output.match(/http:\/\/127\.0\.0\.1:\d+/u)[0], reportPage = await browser.newPage(); await reportPage.goto(reportUrl);
    await reportPage.getByText('synthetic report failure',{exact:true}).first().waitFor();
    const outside = await reportPage.request.get(reportUrl+'/trace/file?path='+encodeURIComponent(path.join(root,'playwright.config.cjs'))); assert.equal(outside.status(),403,'Report cannot read workspace paths');
    await page.locator('#open-report').click(); await page.waitForFunction(()=>document.getElementById('viewer-result').textContent.includes('موجود')); assert.equal(terminals.length,1,'repeated action reuses terminal');
    await page.getByRole('button',{name:'Open Trace Viewer',exact:true}).last().click(); await until(()=>terminals.length===2 && /Listening on http/u.test(terminals[1].output));
    const traceUrl=terminals[1].output.match(/http:\/\/127\.0\.0\.1:\d+/u)[0],tracePage=await browser.newPage(); await tracePage.goto(traceUrl);
    await tracePage.getByText('Trace fixture button',{exact:false}).first().waitFor({timeout:30000}).catch(async()=>{await tracePage.getByText('page.goto',{exact:false}).first().waitFor();});
    const escaped=await tracePage.request.get(traceUrl+'/trace/file?path='+encodeURIComponent(path.join(root,'playwright.config.cjs'))); assert.equal(escaped.status(),403,'Trace cannot read workspace paths');
    await page.locator('#open-archive').click(); await until(()=>reveals.length===1); assert.equal(reveals[0][0],'revealFileInOS');
    await page.locator('#discover').click(); await page.waitForFunction(()=>document.getElementById('explorer-status').textContent.includes('آماده'));
    await page.locator('#explorer-all').click(); const selected=await page.locator('#explorer-selected').innerText(); blocked=true;
    await page.locator('#discover').click(); await page.locator('#discovery-stop').waitFor({state:'visible'}); await until(()=>app.catalog.pending && app.catalog.operation);
    await page.waitForFunction(()=>!document.getElementById('discovery-stop').disabled); await page.locator('#discovery-stop').click();
    await page.waitForFunction(()=>document.getElementById('explorer-status').textContent.includes('لغو شد')); assert.equal(await page.locator('#explorer-selected').innerText(),selected); assert.equal(await page.locator('#run-selected').isEnabled(),true);
    const out = process.env.STUDIO_PARITY_SCREENSHOTS;
    if(out) {fs.mkdirSync(out,{recursive:true}); for(const theme of ['dark','light']){if(await page.locator('html').getAttribute('data-theme')!==theme) await page.locator('#theme').click();await page.screenshot({path:path.join(out,theme+'.png'),fullPage:true});}}
    assert.deepEqual(fingerprint(path.join(root,'.playwright-studio')),before); assert.deepEqual(faults,[]); assert.equal(app.execution.current,null);
    const csrf=(await page.request.get(app.origin+'/api/session').then(r=>r.json())).csrf;
    assert.equal((await page.request.post(app.origin+'/api/bridge/artifact',{data:{kind:'report',runId:run.manifest.id,artifactId:null,windowId:host.windowId},headers:{Origin:app.origin,'X-Studio-CSRF':'bad'}})).status(),403);
    assert.equal((await fetch(app.origin+'/api/bridge/artifact',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,401);
    const invalid = await page.request.post(app.origin+'/api/bridge/artifact',{data:{kind:'trace',runId:run.manifest.id,artifactId:'../../secret',windowId:host.windowId},headers:{Origin:app.origin,'X-Studio-CSRF':csrf}}); assert.equal(invalid.status(),404);
    blocked=false; const confirmations=[]; page.on('dialog', async dialog=>{confirmations.push(dialog.message());await dialog.accept();});
    assert.equal(app.catalog.get().tests[0].listFile,run.manifest.tests[0].listFile,'synthetic Catalog must preserve official Test List identity');
    await page.locator('#run-selected').click(); await until(()=>app.execution.current && (app.execution.current.confirmation || !app.execution.current.busy)); assert.equal(app.execution.current.phase,'Awaiting Confirmation',JSON.stringify(app.execution.current.error)); await page.locator('#execution-confirm').waitFor({state:'visible'}); await page.locator('#execution-confirm').click();
    await page.waitForFunction(()=>document.getElementById('execution-confirm').textContent.includes('Snapshot')&&!document.getElementById('execution-confirm').hidden); await page.locator('#execution-confirm').click();
    await page.waitForFunction(()=>document.getElementById('cli-log').textContent.includes('ACTUAL_FIXTURE_STDOUT فارسی'));
    await until(()=>app.execution.current && !app.execution.current.busy); assert.equal(confirmations.length,2);
    await page.locator('#cli-section summary').click(); assert.equal(await page.locator('#cli-log').isVisible(),true);
    const cli=await page.locator('#cli-log').textContent();assert.ok(cli.includes('ACTUAL_FIXTURE_STDERR'));assert.ok(!cli.includes('fixture-only-private-value'));assert.ok(cli.length<=16000);
    console.log(JSON.stringify({passed:true,checks:['Dashboard → authenticated native Bridge → real show-report rendered','Dashboard → real show-trace with recorded synthetic browser actions','Report / Trace filesystem escape rejected','Download ZIP remains separate','archive reveal fixed action','all attempts rendered literally','real cancellation preserves selected IDs','duplicate viewer reuse','History unchanged','Origin/CSRF/auth/path rejection','real live CLI visible after two explicit fixture confirmations, credentials redacted']}));
  } finally {
    await browser?.close(); await app?.close(); await host?.close(); for(const terminal of terminals) await terminal.close(); cleanup(root);
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
