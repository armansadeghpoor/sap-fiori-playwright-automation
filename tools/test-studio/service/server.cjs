const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { Repository, fail } = require("./repository.cjs");
const { Trash } = require("./trash.cjs");
const { Catalog } = require("./catalog.cjs");
const { Execution } = require("./execution.cjs");
const { Bootstrap } = require("./bootstrap.cjs");
const { Bridge } = require("./bridge.cjs");
const { Events } = require("./events.cjs");
const { key } = require("./native.cjs");
const equal = (a, b) => { const left = Buffer.from(String(a || "")), right = Buffer.from(String(b || "")); return left.length === right.length && crypto.timingSafeEqual(left, right); };

async function createService({ root, sessionLifetime = 8 * 60 * 60 * 1000, trashOptions, catalogOptions, executionOptions, instanceId = crypto.randomUUID(), privateDirectory, bootstrapTTL, port = 0, onStop, bridgeOptions }) {
  const repository = new Repository(root), sessions = new Map(), pairingCode = crypto.randomBytes(32).toString("hex");
  const trash = new Trash(repository, trashOptions);
  const catalog = new Catalog(repository.root, catalogOptions);
  const execution = new Execution(repository, catalog, executionOptions);
  const bridge = new Bridge(repository, catalog, bridgeOptions);
  const bootstrap = new Bootstrap(instanceId, privateDirectory, bootstrapTTL);
  const events = new Events(instanceId, execution);
  const cookieName = "studio_" + crypto.randomBytes(8).toString("hex");
  let origin, attempts = [], closed = false;
  const json = (response, status, value) => { response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }); response.end(JSON.stringify(value)); };
  async function body(request, limit = 32768) {
    if (!/^application\/json(?:\s*;.*)?$/iu.test(request.headers["content-type"] || "")) throw fail(415, "درخواست JSON لازم است.");
    let bytes = 0, value = "";
    for await (const chunk of request) { bytes += chunk.length; if (bytes > limit) throw fail(413, "درخواست بیش از حد بزرگ است."); value += chunk.toString("utf8"); }
    try { return JSON.parse(value); } catch { throw fail(400, "درخواست JSON معتبر نیست."); }
  }
  function session(request) {
    const cookies = String(request.headers.cookie || "").split(";").map(item => item.trim());
    const token = cookies.find(item => item.startsWith(cookieName + "="))?.slice(cookieName.length + 1);
    const value = sessions.get(token);
    if (!value || value.expires <= Date.now()) { if (token) sessions.delete(token); throw fail(401, "برای اتصال، کد ترمینال سرویس را وارد کنید."); }
    return value;
  }
  const server = http.createServer({ maxHeaderSize: 16384 }, async (request, response) => {
    response.setHeader("Cache-Control", "no-store"); response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "no-referrer"); response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    response.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; media-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    try {
      if (closed) throw fail(503, "سرویس در حال بسته‌شدن است.");
      if (request.headers.host !== new URL(origin).host || request.rawHeaders.filter((value, index) => index % 2 === 0 && value.toLowerCase() === "host").length !== 1) throw fail(403, "Host مجاز نیست.");
      if (request.headers.origin && request.headers.origin !== origin) throw fail(403, "Origin مجاز نیست.");
      if (["cross-site", "same-site"].includes(request.headers["sec-fetch-site"])) throw fail(403, "درخواست باید از همین Dashboard باشد.");
      const url = new URL(request.url, origin), route = url.pathname === "/catalog" ? "/api/catalog" : url.pathname;
      if (url.origin !== origin) throw fail(403, "مقصد درخواست مجاز نیست.");
      if (url.search) throw fail(400, "پارامتر مسیر دلخواه پذیرفته نمی‌شود.");
      if (request.method === 'GET' && route === '/api/health') { json(response,200,{instanceId,pid:process.pid,projectKey:key(repository.root),protocolVersion:2,minimumExtensionVersion:'0.3.0'});return; }
      if (request.method === 'POST' && route === '/api/launcher/bootstrap') {
        if(request.headers.origin || request.headers['sec-fetch-site'] || request.headers['x-studio-launcher']!=='1')throw fail(403,'Native launcher required.');
        json(response,200,bootstrap.issue(await body(request,2048)));return;
      }
      const assets = { "/bridge.js": ["bridge.js", "application/javascript; charset=utf-8"], "/bootstrap.js": ["bootstrap.js", "application/javascript; charset=utf-8"], "/stream-model.js": ["stream-model.js", "application/javascript; charset=utf-8"], "/execution.js": ["execution.js", "application/javascript; charset=utf-8"], "/": ["dashboard.html", "text/html; charset=utf-8"], "/dashboard.js": ["dashboard.js", "application/javascript; charset=utf-8"], "/explorer.js": ["explorer.js", "application/javascript; charset=utf-8"], "/explorer-model.js": ["explorer-model.js", "application/javascript; charset=utf-8"], "/dashboard.css": ["dashboard.css", "text/css; charset=utf-8"] };
      if (request.method === "GET" && Object.hasOwn(assets, route)) {
        const [name, type] = assets[route]; response.writeHead(200, { "Content-Type": type }); response.end(fs.readFileSync(path.join(__dirname, "..", "web", name))); return;
      }
      if (request.method === "POST" && ["/api/session", "/api/bootstrap"].includes(route)) {
        if (request.headers.origin !== origin || request.headers["x-studio-request"] !== "1") throw fail(403, "درخواست اتصال مجاز نیست.");
        attempts = attempts.filter(time => time > Date.now() - 60000);
        if (attempts.length >= 10) throw fail(429, "تلاش‌های اتصال زیاد است؛ یک دقیقه صبر کنید.");
        const input = await body(request);
        if (route === "/api/bootstrap") { try{bootstrap.consume(input?.token);}catch(error){attempts.push(Date.now());throw error;} }
        else if (!equal(input?.code, pairingCode)) { attempts.push(Date.now()); throw fail(401, "کد اتصال درست نیست."); }
        // Reopening the launcher in one browser profile must not replace the Session owning an awaiting confirmation.
        try{session(request);json(response,200,{connected:true});return;}catch{}
        for (const [key, value] of sessions) if (value.expires <= Date.now()) sessions.delete(key);
        if (sessions.size >= 16) throw fail(429, "تعداد اتصال‌های مجاز پر شده است؛ سرویس را در زمان مناسب دوباره راه‌اندازی کنید.");
        const token = crypto.randomBytes(32).toString("hex"); sessions.set(token, { expires: Date.now() + sessionLifetime, csrf: crypto.randomBytes(32).toString("hex") });
        response.setHeader("Set-Cookie", `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(sessionLifetime / 1000)}`);
        json(response, 200, { connected: true }); return;
      }
      if (!route.startsWith("/api/")) throw fail(404, "مسیر موجود نیست.");
      const currentSession = session(request);
      if (request.method === 'GET' && route === '/api/bridge') { json(response, 200, await bridge.status()); return; }
      if (request.method === 'POST' && route === '/api/bridge/open') {
        if (request.headers.origin !== origin || !equal(request.headers['x-studio-csrf'], currentSession.csrf)) throw fail(403, 'Origin / CSRF required.');
        json(response, 200, await bridge.open(await body(request, 8192))); return;
      }
      if(request.method==='GET' && route==='/api/events'){events.subscribe(request,response,currentSession);return;}
      if(request.method==='POST' && route==='/api/service/stop'){
        if(request.headers.origin!==origin||!equal(request.headers['x-studio-csrf'],currentSession.csrf))throw fail(403,'Origin / CSRF required.');
        const input=await body(request);
        if(!input||Object.keys(input).sort().join(',')!=='confirm,instanceId'||input.instanceId!==instanceId||input.confirm!==true)throw fail(400,'Explicit instance confirmation required.');
        if(execution.current?.busy||catalog.pending)throw fail(409,'Stop the owned operation before stopping Service.');
        if(!onStop)throw fail(409,'Service is controlled by its embedding host.');
        json(response,200,{accepted:true});setImmediate(()=>void onStop());return;
      }
      if (request.method === "POST" && ["/api/execution/start", "/api/execution/confirm", "/api/execution/stop"].includes(route)) {
        if (request.headers.origin !== origin || !equal(request.headers["x-studio-csrf"], currentSession.csrf)) throw fail(403, "Origin / CSRF required.");
        const input = await body(request, 2 * 1024 * 1024);
        const result = route.endsWith("/start") ? execution.start(currentSession, input) : route.endsWith("/confirm") ? execution.confirm(currentSession, input) : execution.stop(input);
        json(response, route.endsWith("/start") ? 202 : 200, result); return;
      }
      if (request.method === "POST" && ["/api/discovery", "/api/selection/resolve"].includes(route)) {
        if (request.headers.origin !== origin || !equal(request.headers["x-studio-csrf"], currentSession.csrf)) throw fail(403, "تأیید Origin و CSRF مخصوص این Session لازم است.");
        const input = await body(request, route === "/api/selection/resolve" ? 2 * 1024 * 1024 : 32768);
        json(response, route === "/api/discovery" ? 202 : 200, route === "/api/discovery" ? catalog.start(input) : catalog.resolve(input)); return;
      }
      if (request.method === "POST" && ["/api/history/plan", "/api/history/restore-plan", "/api/history/confirm"].includes(route)) {
        if (request.headers.origin !== origin || !equal(request.headers["x-studio-csrf"], currentSession.csrf)) throw fail(403, "تأیید Origin و CSRF مخصوص این Session لازم است.");
        const input = await body(request);
        const result = route === "/api/history/plan" ? trash.plan(currentSession, input) : route === "/api/history/restore-plan" ? trash.restorePlan(currentSession, input) : trash.confirm(currentSession, input);
        json(response, 200, result); return;
      }
      if (request.method !== "GET") throw fail(405, "اجرای تست یا Command در این Milestone پشتیبانی نمی‌شود.");
      if (route === "/api/session") { json(response, 200, { online: true, readOnly: false, execution: true, discovery: true, historyManagement: true, csrf: currentSession.csrf, project: path.basename(repository.root), instanceId, protocolVersion: 2, minimumExtensionVersion: "0.3.0" }); return; }
      if (route === "/api/execution") { const value=events.snapshot(currentSession);json(response, 200, {...value.operation,instanceId,revision:value.revision}); return; }
      if (route === "/api/catalog") { json(response, 200, catalog.get()); return; }
      if (route === "/api/history/trash") { json(response, 200, { items: trash.list() }); return; }
      if (route === "/api/runs") { json(response, 200, { runs: repository.list() }); return; }
      let match;
      if ((match = route.match(/^\/api\/runs\/([^/]+)$/u))) { json(response, 200, repository.detail(decodeURIComponent(match[1]))); return; }
      if ((match = route.match(/^\/api\/runs\/([^/]+)\/tests\/([^/]+)\/source$/u))) { json(response, 200, repository.source(decodeURIComponent(match[1]), decodeURIComponent(match[2]))); return; }
      if ((match = route.match(/^\/api\/runs\/([^/]+)\/artifacts\/([a-f0-9]{24})$/u))) {
        const artifact = repository.artifact(decodeURIComponent(match[1]), match[2]);
        const name = encodeURIComponent(path.basename(artifact.filename));
        const headers = { "Content-Type": artifact.type, "Accept-Ranges": "bytes", "Content-Disposition": `${artifact.kind === "download" ? "attachment" : "inline"}; filename*=UTF-8''${name}` };
        let start = 0, end = artifact.size - 1, status = 200;
        if (request.headers.range) {
          const range = request.headers.range.match(/^bytes=(\d+)-(\d*)$/u);
          if (!range) throw fail(416, "Range مجاز نیست.");
          start = Number(range[1]); end = range[2] ? Number(range[2]) : end;
          if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start < 0 || end >= artifact.size) throw fail(416, "Range خارج از فایل است.");
          status = 206; headers["Content-Range"] = `bytes ${start}-${end}/${artifact.size}`;
        }
        headers["Content-Length"] = Math.max(0, end - start + 1); response.writeHead(status, headers);
        if (!artifact.size) { response.end(); return; }
        const stream = fs.createReadStream(artifact.filename, { start, end });
        stream.on("error", () => response.destroy()); response.on("close", () => stream.destroy()); stream.pipe(response); return;
      }
      throw fail(404, "منبع مجاز پیدا نشد؛ Report اجرایی و Endpoint اجرایی در این نسخه وجود ندارند.");
    } catch (error) {
      if (response.headersSent) response.destroy();
      else json(response, error.status || 500, { error: error.status ? error.message : "خواندن داده ممکن نشد؛ آرشیو یا مجوز فایل را بررسی کنید." });
    }
  });
  server.requestTimeout = 10000; server.headersTimeout = 10000; server.maxHeadersCount = 50;
  await new Promise((resolve, reject) => { server.once("error", error=>{events.close();reject(error);}); server.listen(port, "127.0.0.1", resolve); });
  origin = `http://127.0.0.1:${server.address().port}`;
  return { server, origin, pairingCode, instanceId, bootstrap, events, repository, trash, catalog, execution, bridge, async close() { if (closed) return; closed = true; events.close(); bootstrap.tokens.clear(); sessions.clear(); trash.plans.clear(); await execution.close(); await catalog.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); } };
}
module.exports = { createService };
