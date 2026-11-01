const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { chromium } = require("playwright");
const { createService } = require("../service/server.cjs");
const { fixture, cleanup, fingerprint } = require("./standalone-fixture.cjs");

(async()=>{
  const real=process.argv.includes("--real"),fixtureData=real?null:fixture();
  const root=real?path.resolve(__dirname,"../../.."):fixtureData.root;
  const output=fs.mkdtempSync(path.join(os.tmpdir(),"studio-ro-")),profile=path.join(output,"browser-profile");
  const app=await createService({root}), before=real?null:fingerprint(root),expected=app.repository.list();
  let context;
  try {
    assert.ok(expected.length>0);if(real)assert.equal(expected.length,13,"real archived run count");
    context=await chromium.launchPersistentContext(profile,{channel:"chrome",headless:true,viewport:{width:1600,height:1000}});
    let page=await context.newPage();const faults=[];page.on("pageerror",e=>faults.push(e.message));
    await page.goto(app.origin);await page.locator("#login").waitFor({state:"visible"});
    assert.equal(await page.locator("#dashboard").isVisible(),false);
    await page.locator("#code").fill(app.pairingCode);await page.locator("#login button").click();
    await page.locator(".history-card").first().waitFor();assert.equal(await page.locator(".history-card").count(),expected.length);
    const failed=expected.find(run=>run.status==="failed");assert.ok(failed);
    await page.locator(`[data-run-id="${failed.id}"]`).click();
    await page.locator("#test-detail").waitFor({state:"visible"});
    await page.waitForFunction(()=>document.querySelector("#code-preview .line"));
    assert.ok(await page.locator("#code-preview .line-number").count()>0);
    assert.equal(await page.locator("#code-preview .active").count(),1);
    assert.equal(await page.locator("#failure-message img, #code-preview img, #stack img").count(),0);
    if(!real) {
      assert.equal(await page.locator("#code-preview .active").getAttribute("data-line"),"3");
      await page.getByRole("button",{name:"نمایش Screenshot",exact:true}).first().click();
      await page.waitForFunction(()=>document.querySelector("#media img")?.naturalWidth>0);
      // Generate an actual local WebM, without importing or executing any test spec.
      const video=await page.evaluate(async()=>{const canvas=document.createElement("canvas");canvas.width=64;canvas.height=64;const ctx=canvas.getContext("2d");ctx.fillStyle="#2255cc";ctx.fillRect(0,0,64,64);const stream=canvas.captureStream(5),recorder=new MediaRecorder(stream,{mimeType:"video/webm"}),parts=[];return new Promise(resolve=>{recorder.ondataavailable=e=>parts.push(e.data);recorder.onstop=async()=>{stream.getTracks().forEach(track=>track.stop());resolve([...new Uint8Array(await new Blob(parts).arrayBuffer())]);};recorder.start();setTimeout(()=>recorder.stop(),350);});});
      const selectedFixture = fixtureData.runs.find(run=>run.manifest.id===failed.id);
      fs.writeFileSync(path.join(selectedFixture.folder,"attachments","video.webm"),Buffer.from(video));
      const original=fingerprint(root); // This explicit fixture generation is the only data change.
      await page.getByRole("button",{name:"نمایش Video",exact:true}).first().click();
      await page.waitForFunction(()=>document.querySelector("#media video")?.readyState>=1);
      assert.deepEqual(fingerprint(root),original);
      const incomplete=expected.find(run=>run.status==="incomplete");await page.locator(`[data-run-id="${incomplete.id}"]`).click();
      await page.waitForFunction(id=>document.getElementById("run-id").textContent===id&&!document.getElementById("run-note").hidden,incomplete.id);
      assert.equal(await page.locator("#run-note").isVisible(),true);
      assert.equal((await page.locator("#tests").innerText()).includes("پایان نامشخص"),true);
      await page.locator(`[data-run-id="${failed.id}"]`).click();await page.locator("#code-preview .line").first().waitFor();
    }
    for(const theme of ["dark","light"]){
      if(await page.locator("html").getAttribute("data-theme")!==theme)await page.locator("#theme").click();
      for(const width of [390,1600]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,theme+" overflow "+width);await page.screenshot({path:path.join(output,`${real?"real":"fixture"}-${theme}-${width}.png`),fullPage:true});}
    }
    const cookie=await context.cookies(app.origin);assert.ok(cookie.some(item=>item.httpOnly&&item.sameSite==="Strict"));
    await context.close();context=await chromium.launchPersistentContext(profile,{channel:"chrome",headless:true,viewport:{width:1600,height:1000}});
    page=await context.newPage();await page.goto(app.origin);await page.locator(".history-card").first().waitFor();
    assert.equal(await page.locator(".history-card").count(),expected.length,"full Browser restart retains authorized history access");
    assert.equal(await page.locator("#login").isVisible(),false);
    const finalState=real?null:fingerprint(root);await app.close();
    await page.waitForFunction(()=>document.getElementById("connection").dataset.state==="offline",{},{timeout:18000});
    if(!real)assert.deepEqual(fingerprint(root),finalState);
    assert.deepEqual(faults,[]);
    console.log(JSON.stringify({passed:true,realHistory:real,runs:expected.length,output,checks:["standalone Chrome without VS Code","authorized history","failure and numbered source","RTL Dark/Light narrow/wide","full Browser restart","Offline indication",...real?[]:["screenshot","actual WebM playback","incomplete run truthfulness"]]}));
  }finally{if(context)await context.close();await app.close();if(fixtureData)cleanup(root);}
})().catch(error=>{console.error(error);process.exitCode=1;});
