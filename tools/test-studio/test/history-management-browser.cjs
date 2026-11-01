const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { chromium } = require("playwright");
const { createService } = require("../service/server.cjs");
const { fixture, cleanup, fingerprint } = require("./standalone-fixture.cjs");
(async () => {
  const realPreview = process.argv.includes("--real-preview");
  const f = realPreview ? { root: path.resolve(__dirname, "../../..") } : fixture(), app = await createService({ root: f.root });
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "studio-ro-"));
  let context;
  try {
    context = await chromium.launchPersistentContext(path.join(output, "profile"), { channel: "chrome", headless: true, viewport: { width: 1600, height: 1000 } });
    let page = await context.newPage(); const faults = []; page.on("pageerror", error => faults.push(error.message));
    await page.goto(app.origin); await page.locator("#login").waitFor({ state: "visible" });
    await page.locator("#code").fill(app.pairingCode); await page.locator("#login button").click();
    await page.locator(".history-card").first().waitFor(); assert.equal(await page.locator(".history-card").count(), 13);
    if (realPreview) {
      // Defense-in-depth: this mode can ONLY preview/cancel, never send a confirmation.
      await page.route("**/api/history/confirm", route => route.abort());
      const trashBefore = fs.existsSync(app.trash.base);
      await page.locator("#clear-history").click(); await page.locator("#history-confirm").waitFor({ state: "visible" });
      const eligible = await page.locator("#confirm-items li").count(), blocked = await page.locator("#confirm-blocked").innerText();
      assert.equal(eligible, 12); assert.match(blocked, /1 Run/); await page.locator("#cancel-history").click();
      assert.equal(fs.existsSync(app.trash.base), trashBefore); assert.equal(app.repository.list().length, 13);
      await page.screenshot({ path: path.join(output, "real-preview-cancel.png"), fullPage: true });
      console.log(JSON.stringify({ passed: true, realPreviewOnly: true, eligible, blocked: 1, mutations: 0, output })); return;
    }
    const before = fingerprint(f.root), source = fs.readFileSync(f.source), first = f.failed.manifest.id;
    await page.locator(`[data-delete-id="${first}"]`).click();
    await page.locator("#history-confirm").waitFor({ state: "visible" });
    assert.equal((await page.locator("#confirm-description").innerText()).includes("1 Run"), true);
    await page.locator("#cancel-history").click(); assert.deepEqual(fingerprint(f.root), before);
    await page.locator(`[data-run-id="${first}"]`).click();
    await page.waitForFunction(id => document.getElementById("run-id").textContent === id, first);
    await page.locator(`[data-delete-id="${first}"]`).click(); await page.locator("#confirm-history").click();
    await page.waitForFunction(() => document.getElementById("history-count").textContent === "12");
    assert.equal(await page.locator(`[data-run-id="${first}"]`).count(), 0);
    for (const run of [f.runs[1], f.runs[2]]) await page.locator(".history-row").filter({ has: page.locator(`[data-run-id="${run.manifest.id}"]`) }).locator("input").check();
    assert.equal(await page.locator("#history-selected").innerText(), "2 انتخاب");
    const inspected = await page.locator("#run-id").innerText();
    await page.locator("#delete-selected").click(); await page.locator("#history-confirm").waitFor({ state: "visible" });
    assert.equal((await page.locator("#confirm-description").innerText()).includes("2 Run"), true);
    await page.keyboard.press("Escape"); assert.equal(await page.locator("#run-id").innerText(), inspected);
    await page.locator("#delete-selected").click(); await page.locator("#confirm-history").click();
    await page.waitForFunction(() => document.getElementById("history-count").textContent === "10");
    await page.locator("#show-trash").click(); await page.locator(".trash-row").first().waitFor();
    const entries = await page.request.get(app.origin + "/api/history/trash").then(r => r.json()), entry = entries.items.find(item => item.runId === first);
    await page.locator(`[data-trash-id="${entry.id}"]`).click(); await page.locator("#history-confirm").waitFor({ state: "visible" });
    assert.equal(await page.locator("#confirm-history").innerText(), "تأیید بازیابی"); await page.locator("#confirm-history").click();
    await page.waitForFunction(() => document.getElementById("history-count").textContent === "11");
    for (const theme of ["dark", "light"]) {
      if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#theme").click();
      for (const width of [390, 1600]) { await page.setViewportSize({ width, height: 1000 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false); await page.screenshot({ path: path.join(output, `history-${theme}-${width}.png`), fullPage: true }); }
    }
    await page.locator("#clear-history").click(); await page.locator("#history-confirm").waitFor({ state: "visible" });
    assert.equal((await page.locator("#confirm-description").innerText()).includes("10 Run"), true);
    assert.equal((await page.locator("#confirm-blocked").innerText()).includes("1 Run"), true);
    await page.locator("#confirm-history").click(); await page.waitForFunction(() => document.getElementById("history-count").textContent === "1");
    assert.equal(await page.locator(".delete-run").isDisabled(), true); assert.equal(await page.locator(".history-select").isDisabled(), true);
    assert.equal(await page.locator("#clear-history").isDisabled(), true); assert.deepEqual(fs.readFileSync(f.source), source);
    await context.close(); context = await chromium.launchPersistentContext(path.join(output, "profile"), { channel: "chrome", headless: true });
    page = await context.newPage(); await page.goto(app.origin); await page.locator(".history-card").first().waitFor();
    assert.equal(await page.locator(".history-card").count(), 1); await page.locator("#show-trash").click(); await page.locator(".trash-row").first().waitFor();
    assert.deepEqual(faults, []);
    console.log(JSON.stringify({ passed: true, output, checks: ["single delete confirmation/cancel", "bulk count and Escape cancel", "immediate list update", "Trash restore", "clear finalized only", "incomplete disabled", "Source unchanged", "Browser restart", "Dark/Light 390/1600", "no horizontal overflow"] }));
  } finally { if (context) await context.close(); await app.close(); if (!realPreview) cleanup(f.root); }
})().catch(error => { console.error(error); process.exitCode = 1; });
