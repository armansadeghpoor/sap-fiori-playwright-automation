const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const {chromium} = require("playwright");
const {createService} = require("../service/server.cjs");
const {explorerFixture,cleanup,fingerprint} = require("./explorer-fixture.cjs");
(async()=>{
  const f=explorerFixture(),app=await createService({root:f.root}),output=fs.mkdtempSync(path.join(os.tmpdir(),"studio-ro-"));let browser;
  try {
    const historyBefore=fingerprint(f.history.base);browser=await chromium.launch({channel:"chrome",headless:true});
    const page=await browser.newPage({viewport:{width:1600,height:1000}}), faults=[];page.on("pageerror",error=>faults.push(error.message));
    await page.goto(app.origin);await page.locator("#code").fill(app.pairingCode);await page.locator("#login button").click();
    await page.locator(".history-card").first().waitFor();assert.equal(await page.locator(".history-card").count(),13);
    assert.equal(fs.existsSync(path.join(f.root,"config-loaded")),false);assert.match(await page.locator("#explorer-status").innerText(),/شناسایی/);
    const discover=async()=>{await page.locator("#discover").click();await page.waitForFunction(()=>!document.getElementById("discover").disabled);assert.equal(app.catalog.get().phase,"ready",app.catalog.get().error);};
    const node=key=>page.locator(`[data-node-key=${JSON.stringify(key)}]`);
    const checkbox=key=>node(key).locator(":scope > .explorer-row > input");
    const expand=async key=>{const button=node(key).locator(":scope > .explorer-row > button[aria-expanded]");if(await button.getAttribute("aria-expanded")!=="true")await button.click();};
    await discover();assert.equal(await page.locator("#explorer-count").innerText(),"4 فایل · 8 تست");
    const root="folder:", folderPath=path.basename(path.dirname(f.source)), folder="folder:"+folderPath, file="file:"+folderPath+"/"+path.basename(f.source);
    await expand(folder);await expand(file);const main=app.catalog.get().tests.filter(test=>test.file===f.source);
    await checkbox("test:"+main[0].id).check();assert.match(await page.locator("#explorer-selected").innerText(),/^1 تست/);
    assert.equal(await checkbox(root).evaluate(el=>el.indeterminate),true);assert.equal(await checkbox(file).evaluate(el=>el.indeterminate),true);
    assert.equal(await page.locator("#history-selected").innerText(),"0 انتخاب");assert.equal(await checkbox("test:"+main[0].id).evaluate(el=>document.activeElement===el),true,"keyboard focus preserved after checkbox render");
    await checkbox(file).focus();await page.keyboard.press("Space");assert.match(await page.locator("#explorer-selected").innerText(),/^4 تست/);
    await node(file).locator(":scope > .explorer-row > button[aria-expanded]").click();await expand(file);assert.match(await page.locator("#explorer-selected").innerText(),/^4 تست/);
    await checkbox(folder).check();assert.match(await page.locator("#explorer-selected").innerText(),/^6 تست/);
    await page.locator("#explorer-search").fill("Nested");assert.equal(await page.locator('[data-node-key^="test:"]').count(),2);assert.match(await page.locator("#explorer-selected").innerText(),/^6 تست/);
    await page.locator("#explorer-project").selectOption(JSON.stringify("Mobile"));assert.equal(await page.locator('[data-node-key^="test:"]').count(),1);
    await page.locator("#explorer-all").click();assert.match(await page.locator("#explorer-selected").innerText(),/^8 تست/);
    await page.locator("#explorer-filter").selectOption("selected");await page.locator("#explorer-search").fill("NO_MATCH");assert.equal(await page.locator('[data-node-key^="test:"]').count(),0);assert.match(await page.locator("#explorer-selected").innerText(),/^8 تست/);
    await page.locator("#explorer-search").fill("");await page.locator("#explorer-project").selectOption("*");await page.locator("#explorer-filter").selectOption("all");
    await page.locator("#explorer-validate").click();await page.waitForFunction(()=>document.getElementById("explorer-validation").textContent.includes("8 شناسه"));
    // History selection and actual synthetic Trash/Restore never modify Explorer selection.
    const first=f.failed.manifest.id;await page.locator(".history-row").filter({has:page.locator(`[data-run-id="${first}"]`)}).locator(".history-select").check();
    assert.match(await page.locator("#explorer-selected").innerText(),/^8 تست/);
    await page.locator(`[data-delete-id="${first}"]`).click();await page.locator("#confirm-history").click();await page.waitForFunction(()=>document.getElementById("history-count").textContent==="12");
    await page.locator("#show-trash").click();await page.locator(".trash-row button").first().click();await page.locator("#confirm-history").click();await page.waitForFunction(()=>document.getElementById("history-count").textContent==="13");
    assert.match(await page.locator("#explorer-selected").innerText(),/^8 تست/);assert.deepEqual(fingerprint(f.history.base),historyBefore);
    for(const theme of ["dark","light"]){if(await page.locator("html").getAttribute("data-theme")!==theme)await page.locator("#theme").click();for(const width of [390,800,1100,1600]){
      await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${theme}/${width} overflow`);
      if(width===1600){const explorer=await page.locator(".explorer").boundingBox(),inspector=await page.locator(".inspector").boundingBox();assert.ok(inspector.width>350);assert.ok(Math.abs(explorer.y-inspector.y)<2);}
      await page.screenshot({path:path.join(output,`explorer-${theme}-${width}.png`),fullPage:true});
    }}
    await discover();assert.match(await page.locator("#explorer-selected").innerText(),/قدیمی/);assert.equal(await page.locator("#explorer-validate").isDisabled(),true);
    await page.locator("#explorer-clear").click();await page.locator("#explorer-all").click();
    fs.unlinkSync(f.nested);await page.locator("#refresh").click();await page.waitForFunction(()=>document.getElementById("explorer-status").textContent.includes("تغییر"));assert.equal(await page.locator("#explorer-validate").isDisabled(),true);
    await discover();assert.equal(await page.locator("#explorer-count").innerText(),"3 فایل · 6 تست");await page.locator("#explorer-clear").click();
    const old=fs.readFileSync(f.other);fs.writeFileSync(f.other,"const = invalid syntax");await page.locator("#discover").click();await page.waitForFunction(()=>document.getElementById("explorer-status").textContent.includes("ناموفق"));assert.equal(app.catalog.get().phase,"error");
    fs.writeFileSync(f.other,old);await discover();
    for(const filename of [f.source,f.other,f.empty])fs.renameSync(filename,filename+".disabled");await discover();assert.equal(app.catalog.get().testCount,0);assert.match(await page.locator("#explorer-status").innerText(),/تستی پیدا نشد/);
    assert.equal(await page.locator("#explorer-all").isDisabled(),true);assert.equal(fs.existsSync(path.join(f.root,"BODY_MUST_NOT_RUN")),false);assert.deepEqual(faults,[]);
    console.log(JSON.stringify({passed:true,output,checks:["explicit official fixture discovery only","Unicode nested tree and duplicate titles/projects","Test/File/Folder/partial/all selection","keyboard and focus","search/filter/collapse preserve selection","stale revisions and file removal","History delete/restore independent","Dark/Light 390/800/1100/1600","error/retry/empty","no test body executed"]}));
  }finally{if(browser)await browser.close();await app.close();cleanup(f.root);}
})().catch(error=>{console.error(error);process.exitCode=1;});
