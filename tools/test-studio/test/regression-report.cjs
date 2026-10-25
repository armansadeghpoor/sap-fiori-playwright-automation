const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { fixture, withRunner, cleanup, repository } = require("./fixture.cjs");
const { RegressionManager } = require("../regression/manager.cjs");
const { within } = require("../regression/history.cjs");
const { chromium } = require(path.join(repository, "node_modules", "playwright"));

(async () => {
  const root = fixture(); withRunner(root);
  let server, browser;
  try {
    fs.writeFileSync(path.join(root, "note.txt"), "local report artifact");
    fs.writeFileSync(path.join(root, "TestCases", "report.spec.ts"), 'const {test,expect}=require("@playwright/test");test("report fixture failure",async({},info)=>{await info.attach("note",{path:require("node:path").join(__dirname,"..","note.txt")});expect(1).toBe(2)});');
    const manager = new RegressionManager({ root: () => root, node: () => process.execPath, state() {} });
    const result = await manager.run({ scope: "suite", headed: false });
    assert.equal(result.summary.counts.failed, 1);
    const store = manager.store(), base = store.directory(result.manifest.id);
    // Serve the actual built-in HTML artifact on loopback; no application or external service.
    server = http.createServer((request, response) => {
      const relative = decodeURIComponent(new URL(request.url, "http://localhost").pathname).replace(/^\/+/, "");
      const filename = path.resolve(base, relative.endsWith("/") ? relative + "index.html" : relative);
      if (!within(base, filename) || !fs.existsSync(filename) || !fs.statSync(filename).isFile()) { response.writeHead(404); response.end(); return; }
      const type = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".txt": "text/plain", ".zip": "application/zip" }[path.extname(filename)] || "application/octet-stream";
      response.writeHead(200, { "Content-Type": type }); fs.createReadStream(filename).pipe(response);
    });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const url = "http://127.0.0.1:" + server.address().port;
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage();
    await page.goto(url + "/report/");
    await page.getByText("report fixture failure", { exact: true }).first().waitFor();
    assert.match(await page.title(), /Playwright/i);
    const attachment = result.summary.tests[0].attempts[0].attachments.find(item => item.name === "note");
    const response = await page.request.get(url + "/" + attachment.path);
    assert.equal(await response.text(), "local report artifact");
    console.log(JSON.stringify({ passed: true, checks: ["actual built-in HTML report rendered", "failed test visible", "archived attachment retrieved", "loopback fixture only"] }));
  } finally {
    if (browser) await browser.close();
    if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
    cleanup(root);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
