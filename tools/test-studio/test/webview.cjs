const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { repository } = require("./fixture.cjs");
const { chromium } = require(path.join(repository, "node_modules", "playwright"));

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 360, height: 1050 } });
    const faults = [];
    page.on("pageerror", error => faults.push(error.message));
    await page.addInitScript(() => {
      window.messages = [];
      window.acquireVsCodeApi = () => ({ getState: () => ({}), setState: value => { window.saved = value; }, postMessage: message => window.messages.push(message) });
    });
    const media = path.resolve(__dirname, "..", "media");
    await page.route("https://studio.test/**", route => {
      const name = new URL(route.request().url()).pathname.slice(1) || "studio.html";
      let body = fs.readFileSync(path.join(media, name), "utf8");
      if (name === "studio.css") body += "\nbody{--vscode-sideBar-background:#202126;--vscode-foreground:#e5e6eb;--vscode-descriptionForeground:#aeb3c1;--vscode-input-background:#30323b;--vscode-input-foreground:#fff;--vscode-dropdown-background:#30323b;--vscode-dropdown-foreground:#fff;--vscode-button-background:#237fce;--vscode-button-foreground:#fff;--vscode-button-secondaryBackground:#393b44;--vscode-button-secondaryForeground:#fff;--vscode-font-size:13px;--vscode-font-family:Tahoma,sans-serif}";
      if (name === "studio.html") body = body.replaceAll("{{nonce}}", "test-nonce")
        .replaceAll("{{cspSource}}", "https://studio.test")
        .replaceAll("{{style}}", "https://studio.test/studio.css")
        .replaceAll("{{script}}", "https://studio.test/studio.js");
      return route.fulfill({ body, contentType: name.endsWith("css") ? "text/css" : name.endsWith("js") ? "application/javascript" : "text/html" });
    });
    await page.goto("https://studio.test/");
    const send = data => page.evaluate(value => window.postMessage(value, "*"), data);
    await send({ type: "init", root: "D:\\NewWeb UiTest", userProfiles: ["rahbar", "user1", "user2", "kartable"], deviceProfiles: ["desktop", "pixel-7", "iphone-15-pro-max"] });
    await page.locator("#name").fill("بررسی مقدار پیش‌فرض");
    await page.waitForFunction(() => window.messages.some(message => message.type === "preview"));
    let request = await page.evaluate(() => window.messages.filter(message => message.type === "preview").at(-1).request);
    await send({ type: "preview", request, specPath: "D:\\NewWeb UiTest\\TestCases\\NewTests\\بررسی مقدار پیش‌فرض.spec.ts" });
    await page.waitForFunction(() => !document.getElementById("start").disabled);
    assert.equal(await page.locator("#user option").count(), 4);
    assert.equal(await page.locator("#device option").count(), 3);
    await page.locator("#browse").click();
    assert.equal(await page.evaluate(() => window.messages.filter(message => message.type === "browse").length), 1);
    assert.equal(await page.locator("#start").isDisabled(), true);
    await send({ type: "folder", path: "پوشه با فاصله/Nested" });
    await page.waitForFunction(() => document.getElementById("path").value === "پوشه با فاصله/Nested");
    assert.equal(await page.evaluate(() => window.saved.path), "پوشه با فاصله/Nested");
    await page.waitForFunction(() => window.messages.some(message => message.type === "preview" && message.form.path === "پوشه با فاصله/Nested"));
    request = await page.evaluate(() => window.messages.filter(message => message.type === "preview").at(-1).request);
    await send({ type: "preview", request, specPath: "D:\\NewWeb UiTest\\TestCases\\پوشه با فاصله\\Nested\\بررسی مقدار پیش‌فرض.spec.ts" });
    await page.waitForFunction(() => !document.getElementById("start").disabled);
    await page.locator("#browse").click();
    await send({ type: "folder", cancelled: true });
    assert.equal(await page.locator("#path").inputValue(), "پوشه با فاصله/Nested");
    await page.locator("#browse").click();
    await send({ type: "folder", error: "فقط پوشهٔ داخل TestCases را انتخاب کنید." });
    await page.waitForFunction(() => !document.getElementById("folder-error").hidden);
    assert.equal(await page.locator("#path").inputValue(), "پوشه با فاصله/Nested");
    await page.locator("#browse").click();
    await send({ type: "folder", path: "" });
    await page.waitForFunction(() => document.getElementById("path").value === "");
    await page.waitForFunction(() => window.messages.some(message => message.type === "preview" && message.form.path === ""));
    request = await page.evaluate(() => window.messages.filter(message => message.type === "preview").at(-1).request);
    await send({ type: "preview", request, specPath: "D:\\NewWeb UiTest\\TestCases\\بررسی مقدار پیش‌فرض.spec.ts" });
    await page.waitForFunction(() => !document.getElementById("start").disabled);
    const screenshot = path.join(os.tmpdir(), "playwright-studio-webview.png");
    await page.screenshot({ path: screenshot, fullPage: true });
    await page.locator("#start").click();
    await page.locator("#form").evaluate(form => form.dispatchEvent(new Event("submit", { cancelable: true })));
    assert.equal(await page.evaluate(() => window.messages.filter(message => message.type === "start").length), 1);
    assert.equal(await page.locator("#name").isDisabled(), true);
    await send({ type: "state", state: { busy: false, phase: "error", message: "Recorder failed", log: "<img src=x onerror=alert(1)>", specPath: "D:\\test.spec.ts" } });
    await page.waitForFunction(() => !document.getElementById("fields").disabled);
    assert.equal(await page.locator("#log img").count(), 0);
    assert.equal(await page.locator("#details").getAttribute("open"), "");
    await page.locator("#path").fill("D:\\absolute");
    await page.waitForFunction(() => window.messages.some(message => message.type === "preview" && message.form.path === "D:\\absolute"));
    request = await page.evaluate(() => window.messages.filter(message => message.type === "preview").at(-1).request);
    await send({ type: "preview", request, error: "مسیر کامل ویندوز را وارد نکنید." });
    await page.waitForFunction(() => document.getElementById("validation").textContent.includes("مسیر کامل"));
    assert.equal(await page.locator("#start").isDisabled(), true);
    assert.equal(await page.evaluate(() => Object.hasOwn(window.saved, "snapshot")), false);
    assert.equal(await page.locator("#run").isDisabled(), false, "run does not depend on creation form validity");
    await page.locator("#run").click();
    await page.locator("#run").evaluate(button => button.dispatchEvent(new Event("click")));
    assert.equal(await page.evaluate(() => window.messages.filter(message => message.type === "run").length), 1);
    assert.equal(await page.locator("#run").isDisabled(), true);
    await send({ type: "state", state: { busy: true, operation: "run", phase: "running", message: "در حال اجرا", log: "Running 1 test", specPath: "D:\\test.spec.ts", outputDir: "D:\\test-results\\studio-id" } });
    await page.waitForFunction(() => document.getElementById("stop").textContent === "توقف اجرای تست");
    assert.equal(await page.locator("#stop").isVisible(), true);
    await page.locator("#stop").click();
    assert.equal(await page.evaluate(() => window.messages.at(-1).type), "stop");
    await send({ type: "state", state: { busy: false, operation: "run", phase: "failed", message: "اجرای تست ناموفق بود", log: "1 failed", specPath: "D:\\test.spec.ts" } });
    await page.waitForFunction(() => !document.getElementById("run").disabled);
    assert.equal(await page.locator("#status").getAttribute("class"), "error");
    assert.equal(await page.locator("#details").getAttribute("open"), "");
    await page.screenshot({ path: screenshot, fullPage: true });
    assert.deepEqual(faults, []);
    console.log(JSON.stringify({ passed: true, screenshot, checks: ["CSP", "Persian form", "profiles", "preview", "duplicate click", "busy guard", "inline errors", "text-only logs", "browse", "folder cancellation", "rejected-folder preservation", "root selection"] }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
