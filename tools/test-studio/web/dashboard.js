(() => {
  const $ = id => document.getElementById(id), make = (tag, value, cls) => { const item = document.createElement(tag); item.textContent = value ?? ""; if (cls) item.className = cls; return item; };
  const labels = { passed: "✓ Passed", failed: "× Failed", skipped: "− Skipped", interrupted: "■ Interrupted", incomplete: "! ناقص / پایان نامشخص", unreadable: "! آرشیو غیرقابل خواندن", unfinished: "? شروع ثبت‌شده؛ پایان نامشخص", notRun: "○ اجرای ثبت‌نشده", error: "! خطا" };
  let runId = "", testId = "", detail = null, connected = false, runTicket = 0, sourceTicket = 0;
  let instanceId = "", csrf = "", runsCache = [], mutationBusy = false, pendingPlan = null;
  const selectedRuns = new Set(), rerunIds = new Set();
  const duration = value => value == null ? "—" : (value / 1000).toFixed(1) + "s";
  function connection(state, label) { $("connection").dataset.state = state; $("connection").textContent = label; }
  function error(message) { $("error").textContent = message || ""; $("error").hidden = !message; }
  async function api(url, options = {}) {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, { credentials: "same-origin", cache: "no-store", ...options, signal: controller.signal });
      const data = await response.json();
      if (!response.ok) { if (response.status === 401) { connected = false; $("login").hidden = false; $("dashboard").hidden = true; $("refresh").disabled = true; connection("locked", "نیاز به کد اتصال"); } throw new Error(data.error); }
      return data;
    } catch (value) { if (value instanceof TypeError || value.name === "AbortError") { connection("offline", "Offline — آخرین دادهٔ دریافت‌شده"); throw new Error("ارتباط با سرویس محلی قطع است؛ دادهٔ نمایش‌داده‌شده تازه نیست."); } throw value; }
    finally { clearTimeout(timer); }
  }
  function setTheme(value) { document.documentElement.dataset.theme = value; try { localStorage.setItem("studio-theme", value); } catch {} }
  let theme; try { theme = localStorage.getItem("studio-theme"); } catch {}
  setTheme(theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  $("theme").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  async function authenticate() {
    const status = await api("/api/session"); connected = true; csrf = status.csrf; instanceId=status.instanceId; $("stop-service").disabled=false; $("project").textContent = status.project + " · Explorer & History Management · Execution Manager";
    $("login").hidden = true; $("dashboard").hidden = false; $("refresh").disabled = false; connection("online", "● Online"); await window.StudioExplorer.connect(api, mutation); await window.StudioExecution.connect(api, mutation, history, status.instanceId); return status;
  }
  $("login").onsubmit = async event => {
    event.preventDefault(); const button = $("login").querySelector("button"); button.disabled = true;
    try { await api("/api/session", { method: "POST", headers: { "Content-Type": "application/json", "X-Studio-Request": "1" }, body: JSON.stringify({ code: $("code").value.trim() }) }); $("code").value = ""; await authenticate(); await history(); error(""); }
    catch (value) { error(value.message); } finally { button.disabled = false; }
  };
  async function history() {
    const { runs } = await api("/api/runs"); $("history").replaceChildren(); $("history-count").textContent = runs.length;
    runsCache = runs;
    for (const id of selectedRuns) if (!runs.some(run => run.id === id && run.deletable)) selectedRuns.delete(id);
    if (runId && !runs.some(run => run.id === runId)) {
      runId = ""; testId = ""; detail = null; runTicket++; sourceTicket++;
      $("run-title").textContent = "یک Run را انتخاب کنید"; $("run-id").textContent = ""; $("metrics").replaceChildren(); $("tests").replaceChildren();
      $("run-note").hidden = true; $("run-errors").hidden = true; $("test-detail").hidden = true; $("inspect-empty").hidden = false;
      $("media").replaceChildren(); $("code-preview").replaceChildren();
    }
    $("empty").hidden = Boolean(runs.length);
    for (const run of runs) {
      const row = make("div", "", "history-row"), select = document.createElement("input"); select.type = "checkbox"; select.className = "history-select";
      select.setAttribute("aria-label", "انتخاب Run: " + run.label + " #" + run.id.slice(-6)); select.checked = selectedRuns.has(run.id);
      select.disabled = !run.deletable || mutationBusy; select.title = run.deletionReason || "Run قابل حذف نیست";
      select.onchange = () => { if (select.checked) selectedRuns.add(run.id); else selectedRuns.delete(run.id); historyControls(); };
      const button = make("button", "", "history-card"); button.type = "button"; button.dataset.runId = run.id; button.title = run.id; button.setAttribute("aria-pressed", String(run.id === runId));
      button.append(make("strong", run.label), make("span", labels[run.status] || run.status, run.status), make("span", `${run.createdAt || ""} · ${duration(run.duration)} · #${run.id.slice(-6)}`, "card-meta technical"), make("span", `Passed ${run.counts.passed || 0} · Failed ${run.counts.failed || 0} · Skipped ${run.counts.skipped || 0}`, "card-meta"));
      button.onclick = () => void selectRun(run.id).catch(value => error(value.message));
      const remove = make("button", "حذف", "delete-run danger"); remove.type = "button"; remove.dataset.deleteId = run.id; remove.disabled = !run.deletable || mutationBusy;
      remove.title = run.deletionReason || "Run قابل حذف نیست"; remove.setAttribute("aria-label", "حذف Run: " + run.label);
      remove.onclick = () => void prepareHistory({ mode: "selected", ids: [run.id] });
      row.append(select, button, remove); $("history").append(row);
    }
    historyControls();
    if (!runId && runs.length) await selectRun(runs[0].id);
  }
  async function selectRun(id) {
    runId = id; rerunIds.clear(); testId = ""; sourceTicket++; const ticket = ++runTicket;
    detail = null; $("run-title").textContent = "در حال خواندن Run…"; $("run-note").hidden = true;
    for (const button of $("history").querySelectorAll(".history-card")) button.setAttribute("aria-pressed", String(button.dataset.runId === id));
    $("test-detail").hidden = true; $("inspect-empty").hidden = false; $("tests").replaceChildren();
    const value = await api("/api/runs/" + encodeURIComponent(id)); if (ticket !== runTicket) return;
    detail = value; $("run-title").textContent = value.label; $("run-id").textContent = value.id;
    $("run-note").hidden = value.complete; $("run-note").textContent = "این Run کامل بسته نشده است؛ مقادیر فقط آخرین ثبت موجود هستند و وضعیت Process از آن‌ها حدس زده نمی‌شود.\n" + (value.message || "");
    $("run-errors").textContent = (value.errors || []).join("\n\n"); $("run-errors").hidden = !value.errors?.length;
    $("metrics").replaceChildren();
    for (const [name, count] of [["Passed", value.counts.passed], ["Failed", value.counts.failed], ["Skipped", value.counts.skipped], ["Duration", duration(value.duration)]]) {
      const metric = make("div", "", "metric"); metric.append(make("span", name), make("b", count)); $("metrics").append(metric);
    }
    $("search").value = ""; $("filter").value = "all"; renderTests(); error("");
    const first = value.tests.find(test => test.outcome === "failed") || value.tests[0]; if (first) selectTest(first);
  }
  function historyControls() {
    $("history-selected").textContent = selectedRuns.size + " انتخاب";
    $("delete-selected").disabled = mutationBusy || !selectedRuns.size;
    $("clear-history").disabled = mutationBusy || !runsCache.some(run => run.deletable);
    $("history-all").disabled = mutationBusy || !runsCache.some(run => run.deletable);
    const total = runsCache.filter(run => run.deletable).length;
    $("history-all").checked = Boolean(total && selectedRuns.size === total);
    $("history-all").indeterminate = Boolean(selectedRuns.size && selectedRuns.size < total);
    for (const row of $("history").querySelectorAll(".history-row")) {
      const id = row.querySelector(".delete-run").dataset.deleteId, eligible = runsCache.find(run => run.id === id)?.deletable;
      row.querySelector("input").checked = selectedRuns.has(id); row.querySelector("input").disabled = mutationBusy || !eligible;
      row.querySelector(".delete-run").disabled = mutationBusy || !eligible;
    }
  }
  async function mutation(url, value) {
    return api(url, { method: "POST", headers: { "Content-Type": "application/json", "X-Studio-CSRF": csrf }, body: JSON.stringify(value) });
  }
  function showPlan(plan) {
    pendingPlan = plan; const restore = plan.kind === "restore";
    $("confirm-title").textContent = restore ? "تأیید بازیابی Run" : "تأیید انتقال Runها به Trash";
    $("confirm-description").textContent = restore ? `${plan.count} Run به History برمی‌گردد. هیچ فایل موجودی بازنویسی نمی‌شود.` :
      `${plan.count} Run به همراه نتایج و Artifactها از History خارج و به Trash منتقل می‌شود. حذف دائمی نیست و قابل بازیابی است. Spec و Source دست‌نخورده می‌مانند.`;
    $("confirm-items").replaceChildren(); for (const item of plan.items) { const li = make("li", item.label + " · #" + item.id.slice(-6)); li.title = item.id; $("confirm-items").append(li); }
    $("confirm-blocked").textContent = plan.blocked.length ? `${plan.blocked.length} Run ناقص، نامشخص یا نامعتبر بدون تغییر باقی می‌ماند.` : "";
    $("confirm-history").textContent = restore ? "تأیید بازیابی" : "تأیید انتقال به Trash"; $("confirm-history").disabled = !plan.count;
    $("history-confirm").showModal(); $("cancel-history").focus();
  }
  async function prepareHistory(input) {
    if (mutationBusy) return; mutationBusy = true; historyControls();
    try { showPlan(await mutation("/api/history/plan", input)); error(""); } catch (value) { error(value.message); }
    finally { mutationBusy = false; historyControls(); }
  }
  async function refreshTrash() {
    const result = await api("/api/history/trash"); $("trash-items").replaceChildren();
    for (const item of result.items) {
      const row = make("div", "", "trash-row"); row.append(make("span", item.label + " · " + item.state));
      const restore = make("button", "بازیابی"); restore.type = "button"; restore.disabled = !item.restorable; restore.dataset.trashId = item.id;
      restore.onclick = async () => { if (mutationBusy) return; mutationBusy = true; historyControls(); try { showPlan(await mutation("/api/history/restore-plan", { trashId: item.id })); } catch (value) { error(value.message); } finally { mutationBusy = false; historyControls(); } };
      row.append(restore); $("trash-items").append(row);
    }
    if (!result.items.length) $("trash-items").append(make("p", "سطل بازیافت خالی است.", "muted"));
  }
  $("history-all").onchange = () => { selectedRuns.clear(); if ($("history-all").checked) for (const run of runsCache) if (run.deletable) selectedRuns.add(run.id); historyControls(); };
  $("delete-selected").onclick = () => void prepareHistory({ mode: "selected", ids: [...selectedRuns] });
  $("clear-history").onclick = () => void prepareHistory({ mode: "clear" });
  $("show-trash").onclick = async () => { $("trash-panel").hidden = !$("trash-panel").hidden; if (!$("trash-panel").hidden) try { await refreshTrash(); } catch (value) { error(value.message); } };
  $("history-confirm").addEventListener("close", () => { pendingPlan = null; });
  $("confirm-history").onclick = async () => {
    if (!pendingPlan || mutationBusy) return; const plan = pendingPlan; mutationBusy = true; historyControls(); $("confirm-history").disabled = true; $("cancel-history").disabled = true;
    try {
      const result = await mutation("/api/history/confirm", { planId: plan.planId, confirm: true });
      $("history-result").textContent = `${result.moved.length} Run ${result.kind === "restore" ? "بازیابی شد" : "به Trash منتقل شد"}. ${result.failures.length ? "برخی موارد تأیید نشدند؛ داده‌ها برای بررسی نگه داشته شده‌اند." : ""}`;
      $("history-result").hidden = false; $("history-confirm").close(); await history();
      if (!$("trash-panel").hidden) await refreshTrash(); error("");
    } catch (value) { $("history-confirm").close(); error(value.message); await history().catch(() => {}); }
    finally { mutationBusy = false; $("cancel-history").disabled = false; historyControls(); }
  };
  function rerunControls() {
    $("rerun-count").textContent = `${rerunIds.size} انتخاب Rerun`;
    $("rerun-failed").disabled = !detail?.complete || !detail.tests.some(t=>t.outcome==='failed');
    $("rerun-selected").disabled = !detail?.complete || !rerunIds.size;
    if(window.StudioExecution?.busy){$("rerun-failed").disabled=true;$("rerun-selected").disabled=true;}
    $("rerun-clear").disabled=Boolean(window.StudioExecution?.busy);
    for(const check of $("tests").querySelectorAll('input[type=checkbox]'))check.disabled=Boolean(window.StudioExecution?.busy);
  }
  $("rerun-failed").onclick = () => window.StudioExecution.start({scope:'failed',parentRunId:runId});
  $("rerun-selected").onclick = () => window.StudioExecution.start({scope:'selected',parentRunId:runId,ids:[...rerunIds]});
  $("rerun-clear").onclick = () => {rerunIds.clear();renderTests();};
  function renderTests() {
    rerunControls();
    $("tests").replaceChildren();
    const query = $("search").value.toLocaleLowerCase(), filter = $("filter").value;
    for (const test of detail?.tests || []) {
      if (filter !== "all" && test.outcome !== filter || ![test.title, test.testTitle, test.project].join(" ").toLocaleLowerCase().includes(query)) continue;
      const button = make("button", "", "test-row"); button.type = "button"; button.dataset.testId = test.id; button.setAttribute("aria-pressed", String(test.id === testId));
      button.append(make("strong", test.title), make("span", `${labels[test.outcome] || test.outcome} · ${duration(test.duration)}`, "card-meta " + test.outcome), make("span", test.testTitle + " · " + test.project, "card-meta"));
      const check = document.createElement("input"); check.type = "checkbox"; check.disabled=Boolean(window.StudioExecution?.busy); check.checked = rerunIds.has(test.id); check.setAttribute("aria-label", "انتخاب برای Rerun: " + test.testTitle);
      check.onchange = () => { if(check.checked)rerunIds.add(test.id);else rerunIds.delete(test.id); rerunControls(); };
      button.onclick = () => selectTest(test); $("tests").append(check, button);
    }
  }
  function selectTest(test) {
    testId = test.id; sourceTicket++; renderTests(); $("test-detail").hidden = false; $("inspect-empty").hidden = true;
    $("test-title").textContent = test.title; $("test-meta").textContent = `${test.project} · ${test.displayPath} · ${test.id}`;
    $("failure-message").textContent = test.errors.map(item => item.message).join("\n\n") || (labels[test.outcome] || test.outcome);
    $("stack").textContent = test.errors.map(item => item.stack).join("\n\n"); $("stack-section").hidden = !test.errors.length;
    $("media").replaceChildren(); $("artifacts").replaceChildren(); $("code-preview").replaceChildren(); $("source-note").textContent = "";
    for (const item of test.attachments) {
      const url = `/api/runs/${encodeURIComponent(runId)}/artifacts/${item.id}`;
      if (item.kind === "download") { const link = make("a", "دانلود " + item.name); link.href = url; link.download = ""; $("artifacts").append(link); }
      else {
        const button = make("button", item.kind === "image" ? "نمایش Screenshot" : "نمایش Video"); button.type = "button";
        button.onclick = () => { const media = document.createElement(item.kind === "image" ? "img" : "video"); media.src = url; media.onerror = () => $("media").replaceChildren(make("p", "پیوست موجود یا مجاز نیست؛ آرشیو را بررسی کنید.", "error")); if (item.kind === "image") media.alt = item.name; else { media.controls = true; media.preload = "metadata"; } $("media").replaceChildren(media); }; $("artifacts").append(button);
      }
    }
    void source().catch(value => { $("source-note").textContent = value.message; });
  }
  async function source() {
    const selectedRun = runId, selectedTest = testId, ticket = ++sourceTicket;
    $("source-note").textContent = "در حال خواندن Spec…";
    try {
      const result = await api(`/api/runs/${encodeURIComponent(selectedRun)}/tests/${encodeURIComponent(selectedTest)}/source`);
      if (ticket !== sourceTicket) return;
      $("source-path").textContent = result.displayPath; $("code-preview").replaceChildren();
      const lines = result.content.split(/\r?\n/u), begin = Math.max(0, result.line - 141), end = Math.min(lines.length, begin + 320);
      $("source-note").textContent = result.notice + `\nخط ${result.line}؛ نمایش ${begin + 1} تا ${end} از ${lines.length}`;
      for (let index = begin; index < end; index++) { const line = make("span", "", "line" + (index + 1 === result.line ? " active" : "")); line.dataset.line = index + 1; line.append(make("span", index + 1, "line-number"), make("span", lines[index] || " ", "line-code")); $("code-preview").append(line); }
    } catch (value) { if (ticket === sourceTicket) { $("code-preview").replaceChildren(); $("source-path").textContent = ""; $("source-note").textContent = value.message; } }
  }
  $("source").onclick = () => void source(); $("search").oninput = renderTests; $("filter").onchange = renderTests;
  $("refresh").onclick = async () => { try { await authenticate(); await history(); error(""); } catch (value) { error(value.message); } };
  async function check() { try { const was = connected; await authenticate(); if (!was) await history(); } catch (value) { if (connected) error(value.message); } }
  window.addEventListener('studio-execution',rerunControls);
  $("stop-service").onclick=async()=>{if(!window.confirm('سرویس همین Dashboard بسته شود؟ اجرای فعال باید ابتدا با Stop متوقف شود.'))return;try{await mutation('/api/service/stop',{instanceId,confirm:true});$('stop-service').disabled=true;connection('offline','Service stopped');}catch(value){error(value.message);}};
  void (async()=>{try{await window.StudioBootstrap;}catch(value){error(value.message);}await check();})(); setInterval(() => void check(), 5000);
})();
