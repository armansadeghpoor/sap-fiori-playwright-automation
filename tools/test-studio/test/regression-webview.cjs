const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { repository } = require("./fixture.cjs");
const { chromium } = require(path.join(repository, "node_modules", "playwright"));
const output = path.resolve(process.argv[2] || path.join(os.tmpdir(), "playwright-regression-ui"));
const palettes = {
  dark: { "sideBar-background": "#181818", "editor-background": "#1f1f1f", foreground: "#cccccc", "descriptionForeground": "#9d9d9d", "widget-border": "#454545", "panel-border": "#2b2b2b",
    "input-background": "#313131", "input-foreground": "#cccccc", "input-border": "#3c3c3c", "input-placeholderForeground": "#989898",
    "dropdown-background": "#313131", "dropdown-foreground": "#cccccc", "button-background": "#0078d4", "button-foreground": "#ffffff", "button-hoverBackground": "#026ec1",
    "button-secondaryBackground": "#313131", "button-secondaryForeground": "#cccccc", "button-secondaryHoverBackground": "#3c3c3c", "disabledForeground": "#8c8c8c",
    "testing-iconPassed": "#89d185", "testing-iconFailed": "#f48771", "testing-iconSkipped": "#aaaaaa", "testing-iconQueued": "#cca700",
    "focusBorder": "#007fd4", "list-hoverBackground": "#2a2d2e", "list-inactiveSelectionBackground": "#37373d", "list-inactiveSelectionForeground": "#ffffff",
    "textLink-foreground": "#4daafc", "progressBar-background": "#0078d4", "textCodeBlock-background": "#181818", "errorForeground": "#f48771",
    "inputValidation-errorBackground": "#382b2b", "inputValidation-errorBorder": "#be1100" },
  light: { "sideBar-background": "#f8f8f8", "editor-background": "#ffffff", foreground: "#3b3b3b", "descriptionForeground": "#616161", "widget-border": "#d0d0d0", "panel-border": "#e5e5e5",
    "input-background": "#ffffff", "input-foreground": "#3b3b3b", "input-border": "#cecece", "input-placeholderForeground": "#767676",
    "dropdown-background": "#ffffff", "dropdown-foreground": "#3b3b3b", "button-background": "#005fb8", "button-foreground": "#ffffff", "button-hoverBackground": "#0258a8",
    "button-secondaryBackground": "#e5e5e5", "button-secondaryForeground": "#3b3b3b", "button-secondaryHoverBackground": "#cccccc", "disabledForeground": "#767676",
    "testing-iconPassed": "#388a34", "testing-iconFailed": "#d32f2f", "testing-iconSkipped": "#616161", "testing-iconQueued": "#895503",
    "focusBorder": "#005fb8", "list-hoverBackground": "#f0f0f0", "list-inactiveSelectionBackground": "#e4e6f1", "list-inactiveSelectionForeground": "#3b3b3b",
    "textLink-foreground": "#005fb8", "progressBar-background": "#005fb8", "textCodeBlock-background": "#f3f3f3", "errorForeground": "#b5200d",
    "inputValidation-errorBackground": "#fdf2f2", "inputValidation-errorBorder": "#be1100" },
};
const runIds = [
  "20261025T104212123Z-41811111-a111-4111-8111-1111119cf03a",
  "20261025T104755321Z-41822222-a222-4222-8222-222222f71c2e",
  "20261025T110013441Z-41833333-a333-4333-8333-333333d28b41",
  "20261025T110511441Z-41844444-a444-4444-8444-444444b1d8f0",
];
const longPath = "D:\\NewWeb UiTest\\TestCases\\تست مخصوص وب جدید\\پوشه فارسی بسیار طولانی برای بررسی حفظ چیدمان\\ذخیره فرم با مقدار پیش‌فرض و کاراکترهای انگلیسی.spec.ts";
const tests = [
  { id: "T1", title: "test", file: longPath, line: 12, project: "Google Chrome", outcome: "failed", duration: 30420,
    attempts: [{ retry: 0, status: "failed", duration: 30420, errors: [{ message: "expect(locator).toBeVisible() failed\nExpected: visible\nReceived: hidden", location: { file: longPath, line: 42, column: 7 },
      stack: "Error: expect(locator).toBeVisible() failed\n\nLocator: getByRole('button', { name: 'ذخیره' })\nExpected: visible\nReceived: hidden\n\n  40 | await page.getByRole('button', { name: 'ویرایش' }).click();\n  41 | await page.getByRole('textbox').fill('مقدار جدید');\n> 42 | await expect(saveButton).toBeVisible();\n     |                         ^\n\n    at " + longPath + ":42:7" }],
      attachments: [{ name: "screenshot", contentType: "image/png", path: "attachments/a.png" }, { name: "video", contentType: "video/webm", path: "attachments/b.webm" }, { name: "trace", contentType: "application/zip", path: "attachments/c.zip" }] }] },
  { id: "T2", title: "انتخاب تاریخ و نمایش مقدار فارسی در فرم English / فارسی", titles: ["گروه تاریخ", "انتخاب تاریخ و نمایش مقدار فارسی در فرم English / فارسی"], file: longPath, project: "Google Chrome", outcome: "passed", duration: 2850, attempts: [{ retry: 0, status: "passed", duration: 2850, errors: [], attachments: [] }] },
  { id: "T3", title: "بازگشت به لیست پس از ویرایش رکورد", file: "D:\\NewWeb UiTest\\TestCases\\Form\\back.spec.ts", project: "Google Chrome", outcome: "passed", duration: 1085, attempts: [] },
  { id: "T4", title: "بررسی دسترسی کاربر دوم", file: "D:\\NewWeb UiTest\\TestCases\\Users\\access.spec.ts", project: "Google Chrome", outcome: "skipped", duration: 0, attempts: [] },
];
const detail = { manifest: { id: runIds[0], scope: "folder", label: "تست فرم / مقادیر پیش‌فرض", createdAt: "2026-10-25T10:42:12Z", tests: [], headed: false },
  summary: { status: "failed", complete: true, duration: 93450, finishedAt: "2026-10-25T10:43:45Z", report: true,
    counts: { passed: 2, failed: 1, skipped: 1, interrupted: 0, notRun: 0 }, tests } };
const history = [
  { id: runIds[0], label: detail.manifest.label, scope: "folder", status: "failed", createdAt: detail.manifest.createdAt, counts: detail.summary.counts, duration: 93450 },
  { id: runIds[1], label: "Failedهای " + runIds[0], scope: "failed", status: "passed", createdAt: "2026-10-25T10:47:55Z", counts: { passed: 1, failed: 0, skipped: 0 }, duration: 18690 },
  { id: runIds[2], label: "کل Suite", scope: "suite", status: "interrupted", createdAt: "2026-10-25T11:00:13Z", counts: { passed: 36, failed: 0, skipped: 0, interrupted: 1, notRun: 471 }, duration: 268000 },
  { id: runIds[3], label: "فیلدهای متنی", scope: "folder", status: "passed", createdAt: "2026-10-25T11:05:11Z", counts: { passed: 18, failed: 0, skipped: 0 }, duration: 60120 },
];
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 1050 } });
    const faults = [], screenshots = [];
    let theme = "dark";
    page.on("pageerror", error => faults.push(error.message));
    await page.addInitScript(() => {
      window.messages = [];
      document.addEventListener("securitypolicyviolation", event => window.messages.push({ type: "csp-error", directive: event.violatedDirective }));
      window.acquireVsCodeApi = () => ({ getState: () => ({}), setState: value => { window.saved = value; }, postMessage: message => window.messages.push(message) });
    });
    const media = path.resolve(__dirname, "..", "media");
    await page.route("https://studio.test/**", route => {
      const name = new URL(route.request().url()).pathname.slice(1) || "regression.html";
      let body = fs.readFileSync(path.join(media, name), "utf8");
      if (name === "regression.html") body = body.replaceAll("{{nonce}}", "test-nonce").replaceAll("{{cspSource}}", "https://studio.test")
        .replaceAll("{{style}}", "https://studio.test/regression.css").replaceAll("{{script}}", "https://studio.test/regression.js");
      if (name === "regression.css") body += "\n:root{" + Object.entries(palettes[theme]).map(([key, value]) => "--vscode-" + key + ":" + value).join(";") +
        ";--vscode-font-size:13px;--vscode-font-family:Segoe UI,Tahoma,sans-serif;--vscode-editor-font-family:Consolas,monospace}";
      return route.fulfill({ body, contentType: name.endsWith("css") ? "text/css" : name.endsWith("js") ? "application/javascript" : "text/html" });
    });
    const send = data => page.evaluate(value => window.postMessage(value, "*"), data);
    const nextFrame = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const load = async () => {
      await page.goto("https://studio.test/"); await send({ type: "init", root: "D:\\NewWeb UiTest" }); await nextFrame();
    };
    await load();
    assert.equal(await page.locator("#empty").isVisible(), true);
    assert.equal(await page.locator("#details-empty").isVisible(), true);
    assert.equal(await page.locator("#stop").isDisabled(), true);
    const idleHeight = (await page.locator("#current-panel").boundingBox()).height;
    assert.equal(idleHeight < 80, true, "initial idle is a compact Ready strip");
    assert.equal(await page.locator("#current-body").isVisible(), false);
    await page.locator("#path").fill("پوشه با فاصله");
    await page.locator("#run").click();
    await page.locator("#form").evaluate(form => form.dispatchEvent(new Event("submit", { cancelable: true })));
    assert.equal(await page.evaluate(() => window.messages.filter(message => message.type === "run").length), 1);
    await send({ type: "state", state: { busy: true, phase: "running", message: "تست‌ها در حال اجرا هستند", log: "<img src=x>", progress: { total: 508, completed: 37, elapsed: 28100, current: tests[0].title,
      counts: { passed: 36, failed: 1, skipped: 0, interrupted: 0, notRun: 470 } } } });
    await page.waitForFunction(() => document.getElementById("progress").value === 37);
    assert.equal(await page.locator("#metric-passed").textContent(), "36");
    assert.equal(await page.locator("#metric-duration").textContent(), "28.1s");
    assert.equal(await page.locator("#current-panel").getAttribute("data-mode"), "active");
    const activeHeight = (await page.locator("#current-panel").boundingBox()).height;
    assert.equal(await page.locator("#log img").count(), 0);
    assert.equal(await page.locator("#run").isDisabled(), true);
    await page.locator("#stop").click();
    assert.equal(await page.evaluate(() => window.messages.at(-1).type), "stop");
    assert.equal(await page.locator("#stop").isDisabled(), true);
    await send({ type: "error", message: "توقف انجام نشد؛ می‌توانید دوباره تلاش کنید.", busy: true });
    await page.waitForFunction(() => !document.getElementById("stop").disabled);
    assert.equal(await page.locator("#stop").isDisabled(), false, "a failed stop can be retried");
    await send({ type: "state", state: { busy: false, phase: "failed", message: "اجرا پایان یافت؛ نتایج ذخیره شدند.", log: "1 failed", result: detail } });
    await send({ type: "history", runs: history }); await nextFrame();
    assert.equal(await page.locator("#history .run-card").count(), 4);
    assert.equal(await page.locator("#history [aria-pressed=true]").getAttribute("data-run-id"), runIds[0]);
    assert.equal(await page.locator("#history .run-short").first().textContent(), "#9cf03a");
    assert.equal(await page.locator("#history .run-card").first().getAttribute("title"), detail.manifest.label + "\n" + runIds[0]);
    assert.equal(await page.locator("#history .run-card").nth(1).innerText().then(text => text.includes(runIds[0])), false, "rerun labels do not expose long UUIDs");
    const fileTitle = longPath.split("\\").at(-1).replace(/\.spec\.ts$/u, "");
    assert.equal(await page.locator("#failure-title").textContent(), fileTitle);
    assert.equal(await page.locator('[data-test-id="T1"] .test-name').textContent(), fileTitle);
    assert.equal(await page.locator('[data-test-id="T1"] .test-subtitle').textContent(), "test");
    assert.equal(await page.locator('[data-test-id="T2"] .test-subtitle').textContent(), tests[1].titles.join(" › "));
    assert.equal(await page.locator("#failure-project").textContent(), "Google Chrome");
    assert.equal(await page.locator("#failure-spec-path").textContent(), longPath);
    assert.equal(await page.locator("#failure-test-id").textContent(), "T1");
    assert.equal(await page.locator("#current-panel").getAttribute("data-mode"), "completed");
    assert.equal(Math.abs((await page.locator("#current-panel").boundingBox()).height - activeHeight) < 90, true, "completion has a stable stats area");
    assert.equal(await page.locator("#failure-location").textContent(), longPath + ":42:7");
    assert.equal(await page.locator("#failure-location").evaluate(element => getComputedStyle(element).direction), "ltr");
    const sourceCount = () => page.evaluate(() => window.messages.filter(message => message.type === "openSource").length);
    assert.equal(await sourceCount(), 0, "rendering results must not open an editor");
    await page.locator('[data-test-id="T1"]').click();
    assert.deepEqual(await page.evaluate(() => window.messages.at(-1)), { type: "openSource", id: runIds[0], testId: "T1" });
    const rerunCheckbox = page.locator('.test-card').filter({ has: page.locator('[data-test-id="T2"]') }).locator('input');
    const beforeCheckbox = await sourceCount(); await rerunCheckbox.check(); await rerunCheckbox.uncheck();
    assert.equal(await sourceCount(), beforeCheckbox, "checkbox must not open source");
    await page.locator('[data-test-id="T2"]').click();
    assert.equal(await page.locator("#failure-test-id").textContent(), "T2");
    assert.deepEqual(await page.evaluate(() => window.messages.at(-1)), { type: "openSource", id: runIds[0], testId: "T2" });
    await page.locator('[data-test-id="T4"]').click();
    assert.equal(await page.evaluate(() => window.messages.at(-1).testId), "T4", "skipped test source is accessible");
    await page.getByRole("button", { name: "باز کردن کد", exact: true }).focus(); await page.keyboard.press("Enter");
    assert.deepEqual(await page.evaluate(() => window.messages.at(-1)), { type: "openSource", id: runIds[0], testId: "T4" });
    await send({ type: "source", id: runIds[0], testId: "T1", message: "obsolete warning" });
    assert.equal(await page.locator("#source-status").textContent(), "در حال بازکردن کد…", "late source responses cannot replace another test's status");
    await send({ type: "source", id: runIds[0], testId: "T4", error: true, message: "فایل حذف شده <img src=x>" });
    await nextFrame(); assert.equal(await page.locator("#source-status img").count(), 0);
    assert.equal((await page.locator("#source-status").textContent()).includes("فایل حذف شده"), true);
    await page.locator('.test-card').filter({ has: page.locator('[data-test-id="T1"]') }).evaluate(card => card.click());
    assert.equal(await page.evaluate(() => window.messages.at(-1).testId), "T1", "row padding also selects and opens source");
    const beforeArtifacts = await sourceCount();
    await page.locator("#attachments button").filter({ hasText: "Screenshot" }).click();
    assert.deepEqual(await page.evaluate(() => window.messages.at(-1)), { type: "openArtifact", id: runIds[0], path: "attachments/a.png", kind: "file" });
    await page.locator("#attachments button").filter({ hasText: "Trace" }).click();
    assert.equal(await page.evaluate(() => window.messages.at(-1).kind), "trace");
    await page.locator("#report").click();
    assert.deepEqual(await page.evaluate(() => window.messages.at(-1)), { type: "openReport", id: runIds[0] });
    assert.equal(await sourceCount(), beforeArtifacts, "Report and Artifact buttons never open source");
    await page.locator("#failed").click();
    assert.deepEqual(await page.evaluate(() => window.messages.at(-1).input), { scope: "failed", parentRunId: runIds[0], headed: true });
    await send({ type: "state", state: { busy: false, phase: "idle", message: "آماده", log: "" } });
    await nextFrame();
    assert.equal(await page.locator("#current-body").isVisible(), false);
    assert.equal((await page.locator("#idle-summary").textContent()).includes("Failed 1"), true, "last summary remains readable in Idle");
    const secondCheckbox = page.locator('.test-card').filter({ has: page.locator('[data-test-id="T2"]') }).locator('input[type=checkbox]');
    await secondCheckbox.check();
    await send({ type: "state", state: { busy: false, phase: "failed", message: "نتایج ذخیره شدند", result: detail } });
    assert.equal(await secondCheckbox.isChecked(), true, "refresh preserves selection");
    await page.locator("#selected").click();
    assert.deepEqual(await page.evaluate(() => window.messages.at(-1).input.ids), ["T2"]);
    await send({ type: "state", state: { busy: false, phase: "idle", message: "آماده" } });
    await page.locator("#history .run-card").nth(1).focus(); await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => window.messages.at(-1).id), runIds[1], "history selection works with keyboard");
    const second = { manifest: { ...detail.manifest, id: runIds[1], scope: "failed", parentRunId: runIds[0] }, summary: { ...detail.summary, status: "passed", counts: { passed: 1, failed: 0, skipped: 0 }, tests: [tests[1]] } };
    await send({ type: "detail", detail }); // An old asynchronous response must not replace the selection.
    await send({ type: "detail", detail: second }); await nextFrame();
    assert.equal(await page.locator("#run-id").textContent(), runIds[1]);
    assert.equal(await page.locator("#failed").isDisabled(), true);
    assert.equal(await page.locator("#history [aria-pressed=true]").getAttribute("data-run-id"), runIds[1]);
    await send({ type: "state", state: { busy: false, phase: "failed", result: detail } });
    assert.equal(await page.locator("#run-id").textContent(), runIds[1], "current-run updates do not steal history selection");
    const many = Array.from({ length: 30 }, (_, index) => ({ id: "C" + index, title: "تست انتخابی " + index, listFile: "folder/test" + index + ".spec.ts" }));
    await send({ type: "state", state: { busy: false, phase: "idle", message: "آماده", catalog: many } });
    await page.locator("#catalog summary").click();
    await page.locator("#catalog-all").check();
    assert.equal(await page.locator("#catalog-tests input").count(), 12);
    await page.locator("#catalog-run").click();
    assert.equal(await page.evaluate(() => window.messages.at(-1).input.ids.length), 30, "pagination does not narrow the selected test set");
    await send({ type: "error", message: "خطای آماده‌سازی پروژه", busy: false });
    await page.waitForFunction(() => !document.getElementById("fields").disabled);
    assert.equal(await page.locator("#error").isVisible(), true);
    await send({ type: "detail", detail: { ...second, summary: { ...second.summary, tests: [{ ...tests[1], title: "<img src=x onerror=alert(1)>", titles: ["<img src=x onerror=alert(1)>"], attempts: [{ retry: 0, status: "failed", errors: [{ message: "<script>alert(1)</script>" }], attachments: [] }] }] } } });
    assert.equal(await page.locator("#detail img, #detail script").count(), 0);
    await send({ type: "detail", detail: { ...second, summary: { ...second.summary, tests: [{ ...tests[0], id: "GENERIC", file: "D:\\NewWeb UiTest\\TestCases\\نام فارسی.spec.ts", attempts: [] }] } } });
    await nextFrame();
    assert.equal(await page.locator("#failure-title").textContent(), "نام فارسی");
    assert.equal(await page.locator("#tests .test-subtitle").count(), 0, "generic test title is hidden for a single-test spec");
    await send({ type: "history", runs: Array.from({ length: 20 }, (_, index) => ({ ...history[0], id: "legacy-run-" + index })) });
    assert.equal(await page.locator("#history .run-card").count(), 6);
    await page.locator("#history-more").click();
    assert.equal(await page.locator("#history .run-card").count(), 12);
    for (const currentTheme of ["dark", "light"]) {
      theme = currentTheme;
      for (const width of [280, 320, 390, 920, 1280]) {
        await page.setViewportSize({ width, height: 1050 }); await load();
        await send({ type: "history", runs: history });
        await page.locator("#path").fill("تست مخصوص وب جدید/پوشهٔ بسیار طولانی با نام فارسی English و فاصله");
        await send({ type: "state", state: { busy: false, phase: "failed", message: "اجرا پایان یافت؛ نتایج ذخیره شدند.", log: "1 failed · 2 passed · 1 skipped", result: detail } });
        await nextFrame();
        await page.locator("h1").click();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        assert.equal(overflow, false, currentTheme + " horizontal overflow at " + width);
        const contrastFailures = await page.evaluate(() => {
          const rgb = text => (text.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
          const luminance = channels => channels.map(channel => { const value = channel / 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; }).reduce((total, value, index) => total + value * [.2126, .7152, .0722][index], 0);
          return [...document.querySelectorAll('h1,h2,#status,.metric dd,.metric dt,.run-title,.run-time,.run-short,.pill > span:last-child,.test-name,.test-file,.error-message')].filter(element => element.getClientRects().length).flatMap(element => {
            const foreground = luminance(rgb(getComputedStyle(element).color)); let parent = element, background = '';
            while (parent) { const color = getComputedStyle(parent).backgroundColor; if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') { background = color; break; } parent = parent.parentElement; }
            const value = luminance(rgb(background)); const ratio = (Math.max(value, foreground) + .05) / (Math.min(value, foreground) + .05);
            return ratio < 4.5 ? [{ className: element.className, text: element.textContent.slice(0, 25), ratio }] : [];
          });
        });
        assert.deepEqual(contrastFailures, [], currentTheme + " primary text contrast");
        const nested = await page.locator("#history, #tests, #catalog-tests").evaluateAll(elements => elements.some(element => ["auto", "scroll"].includes(getComputedStyle(element).overflowY)));
        assert.equal(nested, false, "lists use page scrolling, not nested scrollers");
        if (width === 390 || width === 1280) {
          const name = "regression-" + currentTheme + (width === 390 ? "-sidebar" : "-wide") + ".png";
          const filename = path.join(output, name); await page.screenshot({ path: filename, fullPage: true }); screenshots.push(filename);
        }
        if (width === 1280) {
          const boxes = await page.locator(".history-panel, .detail-panel").evaluateAll(elements => elements.map(element => ({ top: element.getBoundingClientRect().top, width: element.getBoundingClientRect().width })));
          assert.equal(Math.abs(boxes[0].top - boxes[1].top) < 2, true, "wide layout uses side-by-side panels");
          if (currentTheme === "dark") {
            await send({ type: "state", state: { busy: true, phase: "running", message: "در حال اجرای پوشهٔ انتخاب‌شده…", log: "Running 508 tests using 1 worker", progress: {
              total: 508, completed: 37, elapsed: 28100, current: "بررسی ذخیرهٔ رکورد پس از ویرایش فیلد محاسباتی", counts: { passed: 36, failed: 1, skipped: 0, interrupted: 0, notRun: 470 },
            } } });
            await nextFrame();
            const filename = path.join(output, "regression-dark-live-wide.png"); await page.screenshot({ path: filename, fullPage: true }); screenshots.push(filename);
            await send({ type: "state", state: { busy: false, phase: "interrupted", message: "اجرا متوقف شد", result: { ...detail, summary: { ...detail.summary, status: "interrupted", complete: false } } } });
            await nextFrame();
            assert.equal(await page.locator("#current-panel").getAttribute("data-mode"), "completed");
            assert.equal(await page.locator("#phase").innerText().then(text => text.includes("متوقف")), true);
            assert.equal(await page.locator("#stop").isVisible(), false);
          }
        }
        if (width === 390 && currentTheme === "light") {
          await send({ type: "history", runs: [] });
          await page.reload(); await send({ type: "init", root: "D:\\NewWeb UiTest" });
          await send({ type: "history", runs: [] }); await send({ type: "state", state: { busy: false, phase: "idle", message: "آمادهٔ اجرای Regression", log: "" } }); await nextFrame();
          const filename = path.join(output, "regression-light-empty.png"); await page.screenshot({ path: filename, fullPage: true }); screenshots.push(filename);
          assert.equal(await page.locator("#empty").isVisible(), true);
        }
      }
    }
    // High contrast focus and narrow viewport reflow.
    await page.setViewportSize({ width: 320, height: 1050 }); await load();
    await page.locator("body").evaluate(element => element.classList.add("vscode-high-contrast"));
    await page.locator("#path").focus();
    assert.notEqual(await page.locator("#path").evaluate(element => getComputedStyle(element).outlineStyle), "none");
    assert.deepEqual(faults, []);
    assert.equal(await page.evaluate(() => window.messages.some(message => message.type === "csp-error")), false);
    console.log(JSON.stringify({ passed: true, screenshots, checks: ["source row click sends only run/test IDs", "checkbox/report/artifact never open source", "keyboard open-source action", "stale source response ignored", "text-only source errors", "file-first scenario names without changing IDs", "single/multiple tests per spec", "Idle/Running/Completed/Interrupted states", "existing IPC actions", "failed/selected rerun", "live stats", "stop disabled states and retry", "immutable history presentation", "keyboard", "selection retention", "long RTL/LTR paths", "empty/multiple/paginated history", "Dark/Light 280-1280px", "primary text contrast >= 4.5", "no nested list scrollers", "text-only errors", "CSP"] }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
