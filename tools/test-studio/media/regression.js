(() => {
  const vscode = acquireVsCodeApi(), el = id => document.getElementById(id);
  const saved = vscode.getState() || {};
  let ready = false, busy = false, picking = false, stopping = false, root = "", detail = null;
  let selectedRunId = "", inspectedTestId = "", followCurrent = true, lastResultId = "";
  let runs = [], catalog = [], catalogSignature = "", historyLimit = 6, testLimit = 8, catalogLimit = 12;
  let latestSummary = null, latestProgress = null, wasExecuting = false;
  const selected = new Set(), catalogSelection = new Set();
  const states = {
    idle: ["○", "آماده"], passed: ["✓", "موفق"], failed: ["×", "ناموفق"], skipped: ["−", "Skipped"],
    interrupted: ["■", "متوقف‌شده"], notRun: ["○", "اجرانشده"], running: ["▶", "در حال اجرا"],
    error: ["!", "ناقص / خطا"], stopping: ["■", "در حال توقف"], discovering: ["↻", "در حال شناسایی"], cancelled: ["−", "لغوشده"],
  };
  const post = (type, value = {}) => vscode.postMessage({ type, ...value });
  const node = (tag, value, className, direction) => {
    const item = document.createElement(tag); item.textContent = value == null ? "" : String(value);
    if (tag === "pre") { item.tabIndex = 0; item.setAttribute("aria-label", "جزئیات فنی"); }
    if (className) item.className = className; if (direction) item.dir = direction; return item;
  };
  const setText = (id, value) => { const text = String(value == null ? "" : value); if (el(id).textContent !== text) el(id).textContent = text; };
  const clean = value => String(value || "").replace(/\x1b\[[0-?]*[ -/]*[@-~]/gu, "");
  const shortId = id => "#" + String(id || "").slice(-6);
  const basename = file => String(file || "").split(/[\\/]/u).at(-1);
  function scenario(test, peers = []) {
    const primary = basename(test.file || test.listFile).replace(/\.spec\.ts$/iu, "") || test.title || "تست";
    const actual = (test.titles?.filter(Boolean).join(" › ") || test.title || "").trim();
    const multiple = peers.filter(item => (item.file || item.listFile) === (test.file || test.listFile)).length > 1;
    const secondary = actual && actual !== primary && (!/^test$/iu.test(actual) || multiple) ? actual : "";
    return { primary, secondary, accessible: primary + (secondary ? " · " + secondary : "") };
  }
  const duration = value => {
    if (!Number.isFinite(Number(value))) return "—";
    const seconds = Math.max(0, Number(value)) / 1000;
    if (seconds < 60) return seconds.toFixed(1) + "s";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m " + Math.floor(seconds % 60) + "s";
    return Math.floor(seconds / 3600) + "h " + Math.floor(seconds % 3600 / 60) + "m";
  };
  const date = value => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "زمان ثبت نشده" : new Intl.DateTimeFormat("fa-IR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(parsed);
  };
  const title = run => ({ suite: "کل Suite", failed: "اجرای مجدد Failedها", selected: "اجرای مجدد انتخاب‌ها", selection: "تست‌های انتخاب‌شده" })[run.scope] || run.label || "اجرای تست";
  const countText = counts => counts ? "Passed " + (counts.passed || 0) + " · Failed " + (counts.failed || 0) + " · Skipped " + (counts.skipped || 0) : "";
  function badge(element, status) {
    const known = states[status], value = known || ["○", status || "آماده"];
    element.className = "pill " + (known && status !== "idle" ? "status-" + status : "neutral");
    const symbol = node("span", value[0]); symbol.setAttribute("aria-hidden", "true");
    element.replaceChildren(symbol, node("span", value[1]));
  }
  el("path").value = typeof saved.path === "string" ? saved.path : "";
  if (["folder", "file", "suite"].includes(saved.scope)) el("scope").value = saved.scope;
  el("headed").checked = saved.headed === true;
  function controls() {
    const pending = !ready || busy || picking;
    el("fields").disabled = pending;
    const matching = detail && detail.manifest.id === selectedRunId;
    el("failed").disabled = !matching || pending || !detail.summary.counts?.failed || !detail.summary.finishedAt;
    el("failed").title = !detail?.summary.counts?.failed ? "این Run تست Failed ندارد." : pending ? "تا پایان عملیات جاری صبر کنید." : "Failedهای این Run در اجرای مستقل جدید";
    el("selected").disabled = !matching || pending || !selected.size || !detail.summary.finishedAt;
    el("selected").title = selected.size ? selected.size + " تست انتخاب‌شده" : "ابتدا تست‌های دلخواه را انتخاب کنید.";
    el("stop").disabled = !busy || stopping;
    el("stop").hidden = !busy;
    el("stop").title = !busy ? "اجرایی فعال نیست." : "توقف عملیات جاری و حفظ نتایج ثبت‌شده";
    el("rerun-headed").disabled = pending;
    el("catalog-run").disabled = pending || !catalogSelection.size;
    el("catalog-all").disabled = pending;
    el("select-all").disabled = pending || !matching;
    setText("selected-count", selected.size ? selected.size + " انتخاب" : "");
    el("select-all").indeterminate = Boolean(detail && selected.size && selected.size < detail.summary.tests.length);
    el("select-all").checked = Boolean(detail?.summary.tests.length && selected.size === detail.summary.tests.length);
    el("target-fields").hidden = el("scope").value === "suite";
    setText("target-preview", root + "\\TestCases" + (el("scope").value !== "suite" && el("path").value.trim() ? "\\" + el("path").value.trim() : ""));
  }
  function preferences() {
    vscode.setState({ path: el("path").value, scope: el("scope").value, headed: el("headed").checked }); controls();
  }
  function start(input) {
    if (!ready || busy || picking) return;
    busy = true; stopping = false; followCurrent = true; el("error").hidden = true; controls(); post("run", { input });
  }
  el("form").addEventListener("input", preferences);
  el("form").addEventListener("submit", event => { event.preventDefault(); start({ scope: el("scope").value, path: el("path").value, headed: el("headed").checked }); });
  el("browse").addEventListener("click", () => { if (!busy && !picking) { picking = true; controls(); post("browse", { scope: el("scope").value }); } });
  el("discover").addEventListener("click", () => { if (!busy && !picking) { busy = true; controls(); post("discover"); } });
  el("stop").addEventListener("click", () => { if (busy && !stopping) { stopping = true; controls(); post("stop"); } });
  el("refresh").addEventListener("click", () => post("refresh"));
  el("catalog-run").addEventListener("click", () => start({ scope: "selection", ids: [...catalogSelection], headed: el("headed").checked }));
  el("catalog-all").addEventListener("change", () => {
    catalogSelection.clear(); if (el("catalog-all").checked) for (const test of catalog) catalogSelection.add(test.id); renderCatalog();
  });
  el("failed").addEventListener("click", () => { if (detail) start({ scope: "failed", parentRunId: detail.manifest.id, headed: el("rerun-headed").checked }); });
  el("selected").addEventListener("click", () => { if (detail) start({ scope: "selected", parentRunId: detail.manifest.id, ids: [...selected], headed: el("rerun-headed").checked }); });
  el("report").addEventListener("click", () => { if (detail) post("openReport", { id: detail.manifest.id }); });
  el("archive").addEventListener("click", () => { if (detail) post("openArchive", { id: detail.manifest.id }); });
  el("select-all").addEventListener("change", () => {
    selected.clear(); if (el("select-all").checked) for (const test of detail?.summary.tests || []) selected.add(test.id); renderTests();
  });
  el("history-more").addEventListener("click", () => { historyLimit += 6; renderHistory(); });
  el("tests-more").addEventListener("click", () => { testLimit += 12; renderTests(); });
  el("catalog-more").addEventListener("click", () => { catalogLimit += 24; renderCatalog(); });
  function highlightHistory() {
    for (const button of el("history").querySelectorAll("button")) button.setAttribute("aria-pressed", String(button.dataset.runId === selectedRunId));
  }
  function renderHistory() {
    const focused = document.activeElement?.dataset.runId;
    el("empty").hidden = runs.length > 0; setText("history-count", runs.length ? "(" + runs.length + ")" : "");
    el("history").replaceChildren();
    for (const run of runs.slice(0, historyLimit)) {
      const button = node("button", "", "run-card"); button.type = "button"; button.dataset.runId = run.id;
      button.title = title(run) + "\n" + run.id; button.setAttribute("aria-pressed", String(run.id === selectedRunId));
      button.setAttribute("aria-controls", "detail-content");
      const label = node("span", title(run), "run-title", "auto"), status = node("span"); badge(status, run.status);
      const time = node("time", date(run.createdAt), "run-time"); if (run.createdAt) time.dateTime = run.createdAt;
      const meta = node("span", "", "run-meta");
      for (const [symbol, value, kind, accessible] of [
        ["✓", run.counts?.passed || 0, "passed", "Passed"], ["×", run.counts?.failed || 0, "failed", "Failed"],
      ]) {
        const stat = node("bdi", "", "run-stat", "ltr");
        const icon = node("span", symbol, "status-" + kind); icon.setAttribute("aria-hidden", "true");
        stat.append(icon, node("span", value));
        stat.setAttribute("aria-label", accessible + " " + value); stat.title = accessible + ": " + value; meta.append(stat);
      }
      meta.append(node("bdi", "◷ " + duration(run.duration), "muted", "ltr"), node("bdi", shortId(run.id), "run-short mono", "ltr"));
      button.append(label, status, time, meta);
      button.addEventListener("click", () => { selectedRunId = run.id; followCurrent = false; highlightHistory(); controls(); post("detail", { id: run.id }); });
      el("history").append(button);
      if (focused === run.id) button.focus();
    }
    el("history-more").hidden = runs.length <= historyLimit;
    if (!el("history-more").hidden) setText("history-more", "نمایش اجراهای بیشتر · " + (runs.length - historyLimit));
  }
  function renderDetail(value) {
    const changed = detail?.manifest.id !== value.manifest.id;
    detail = value; selectedRunId = value.manifest.id;
    if (changed) { selected.clear(); inspectedTestId = ""; testLimit = 8; }
    el("details-empty").hidden = true; el("detail-content").hidden = false;
    const { manifest, summary } = value;
    setText("run-title", title(manifest)); setText("run-short", shortId(manifest.id)); el("run-short").title = manifest.id;
    setText("run-id", manifest.id); setText("run-time", date(manifest.createdAt));
    if (manifest.createdAt) el("run-time").dateTime = manifest.createdAt;
    el("detail-badge").hidden = false; badge(el("detail-badge"), summary.status);
    setText("run-summary", countText(summary.counts) + " · " + duration(summary.duration));
    const notes = [
      manifest.parentRunId ? "اجرای مجدد از " + shortId(manifest.parentRunId) : "",
      manifest.changedSources?.length ? "کد برخی تست‌ها نسبت به Run قبلی تغییر کرده است." : "",
      summary.complete === false ? "Run کامل بسته نشده؛ نتایج ثبت‌شده حفظ شده‌اند." : "",
    ];
    setText("run-note", notes.filter(Boolean).join("\n")); el("run-note").hidden = !notes.some(Boolean);
    el("report").disabled = !summary.report; el("report").title = summary.report ? "HTML Report همین Run" : "Report این Run موجود یا کامل نیست.";
    renderTests();
    el("run-errors").replaceChildren();
    const errors = [...(summary.errors || [])];
    if (summary.message) errors.push({ message: summary.message });
    for (const error of errors) {
      const disclosure = node("details", "", "technical-details");
      disclosure.append(node("summary", "جزئیات خطای Run"), node("pre", clean(error.stack || error.message || error.value || String(error)), "", "ltr"));
      el("run-errors").append(disclosure);
    }
    highlightHistory(); controls();
  }
  function renderTests() {
    if (!detail) return;
    const tests = detail.summary.tests || [], priority = { failed: 0, interrupted: 1, running: 2, notRun: 3, passed: 4, skipped: 5 };
    const display = [...tests].sort((a, b) => (priority[a.outcome] ?? 6) - (priority[b.outcome] ?? 6));
    if (!tests.some(test => test.id === inspectedTestId)) inspectedTestId = display[0]?.id || "";
    setText("test-count", "(" + tests.length + ")"); el("tests").replaceChildren();
    for (const test of display.slice(0, testLimit)) {
      const name = scenario(test, tests);
      const card = node("div", "", "test-card" + (test.id === inspectedTestId ? " is-selected" : ""));
      const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.checked = selected.has(test.id);
      checkbox.setAttribute("aria-label", "انتخاب برای اجرای مجدد: " + name.accessible);
      checkbox.addEventListener("change", () => { if (checkbox.checked) selected.add(test.id); else selected.delete(test.id); controls(); });
      const button = node("button", "", "test-open"); button.type = "button"; button.dataset.testId = test.id;
      button.setAttribute("aria-controls", "failure-inspector");
      button.setAttribute("aria-pressed", String(test.id === inspectedTestId)); button.title = name.accessible + "\n" + test.file + "\n" + test.id;
      const symbol = node("span", states[test.outcome]?.[0] || "○", "status-symbol status-" + (states[test.outcome] ? test.outcome : "notRun"));
      symbol.setAttribute("aria-hidden", "true");
      button.setAttribute("aria-label", (states[test.outcome]?.[1] || test.outcome) + " · " + name.accessible);
      button.append(symbol, node("span", name.primary + (test.flaky ? " · Flaky" : ""), "test-name", "auto"), node("bdi", duration(test.duration), "test-duration", "ltr"));
      if (name.secondary) button.append(node("span", name.secondary, "test-subtitle", "auto"));
      button.append(node("bdi", test.project || "Project ثبت نشده", "test-file", "ltr"));
      button.addEventListener("click", () => {
        inspectedTestId = test.id;
        for (const row of el("tests").children) { const action = row.querySelector("button"); const active = action.dataset.testId === test.id; row.classList.toggle("is-selected", active); action.setAttribute("aria-pressed", String(active)); }
        renderInspector(test);
      });
      card.append(checkbox, button); el("tests").append(card);
    }
    el("tests-more").hidden = display.length <= testLimit;
    if (!el("tests-more").hidden) setText("tests-more", "نمایش تست‌های بیشتر · " + (display.length - testLimit));
    renderInspector(tests.find(test => test.id === inspectedTestId)); controls();
  }
  function renderInspector(test) {
    el("failure-inspector").hidden = !test; if (!test) return;
    const attempts = test.attempts || [], latest = attempts.at(-1), error = latest?.errors?.[0];
    const name = scenario(test, detail.summary.tests || []);
    badge(el("failure-badge"), test.outcome); setText("failure-duration", duration(test.duration)); setText("failure-title", name.primary);
    setText("failure-playwright-title", name.secondary); el("failure-playwright-title").hidden = !name.secondary;
    setText("failure-project", test.project || "Project ثبت نشده");
    setText("failure-spec-path", test.file || test.listFile || "");
    setText("failure-test-id", test.id);
    let location = error?.location, failure = Boolean(location);
    if (!location && error?.stack) {
      const match = clean(error.stack).match(/(?:[A-Za-z]:[\\/]|\/)[^\n()]*?\.spec\.[cm]?[jt]s:\d+:\d+/u);
      if (match) { location = match[0]; failure = true; }
    }
    setText("failure-location-label", failure ? "محل Failure" : "تعریف تست");
    setText("failure-location", typeof location === "string" ? location : location ? location.file + ":" + location.line + (location.column ? ":" + location.column : "") : test.file + (test.line ? ":" + test.line : ""));
    setText("failure-message", error ? clean(error.message || error.value || error.stack).split("\n").filter(Boolean).slice(0, 5).join("\n") : test.outcome === "notRun" ? "این تست اجرا نشده است." : "خطایی برای این تست ثبت نشده است.");
    el("failure-message").classList.toggle("is-error", test.outcome === "failed");
    el("attachments").replaceChildren(); el("attempts").replaceChildren();
    for (const attempt of attempts) {
      for (const attachment of attempt.attachments || []) {
        const kind = attachment.name === "trace" ? "Trace" : attachment.contentType?.startsWith("image/") ? "Screenshot" : attachment.contentType?.startsWith("video/") ? "Video" : attachment.name;
        const button = node("button", (kind === "Trace" ? "◇ " : kind === "Video" ? "▶ " : "▧ ") + kind + (attempts.length > 1 ? " · A" + (attempt.retry + 1) : ""), "secondary compact");
        button.type = "button"; button.disabled = !attachment.path; button.title = attachment.path ? attachment.name : attachment.name + " · فایل موجود نیست";
        button.addEventListener("click", () => post("openArtifact", { id: detail.manifest.id, path: attachment.path, kind: attachment.name === "trace" ? "trace" : "file" }));
        el("attachments").append(button);
      }
      const disclosure = node("details", "", "technical-details");
      disclosure.append(node("summary", "Attempt " + (attempt.retry + 1) + " · " + attempt.status + " · " + duration(attempt.duration) + " — Log و Stack"));
      const log = (attempt.errors || []).map(value => clean(value.stack || value.message || value.value)).join("\n\n");
      disclosure.append(node("pre", log || "خطایی ثبت نشده است.", "", "ltr"));
      el("attempts").append(disclosure);
    }
  }
  function renderCatalog() {
    el("catalog").hidden = false; setText("catalog-count", "(" + catalog.length + ")"); el("catalog-tests").replaceChildren();
    for (const test of catalog.slice(0, catalogLimit)) {
      const name = scenario(test, catalog);
      const label = node("label", "", "check"), checkbox = document.createElement("input");
      checkbox.type = "checkbox"; checkbox.checked = catalogSelection.has(test.id);
      checkbox.addEventListener("change", () => { if (checkbox.checked) catalogSelection.add(test.id); else catalogSelection.delete(test.id); controls(); });
      const caption = node("span", name.primary, "", "auto");
      if (name.secondary) caption.append(node("span", name.secondary, "catalog-subtitle", "auto"));
      caption.append(node("bdi", test.listFile, "catalog-file", "ltr")); label.append(checkbox, caption); el("catalog-tests").append(label);
    }
    el("catalog-more").hidden = catalog.length <= catalogLimit; controls();
  }
  function current(state) {
    if (state.busy && !wasExecuting) { latestSummary = null; latestProgress = null; }
    if (state.progress) latestProgress = state.progress;
    if (state.result?.summary) latestSummary = state.result.summary;
    wasExecuting = Boolean(state.busy);
    const idle = !state.busy && state.phase === "idle";
    const progress = state.progress || latestProgress, summary = state.result?.summary || latestSummary;
    const counts = summary?.counts || progress?.counts;
    const panel = el("current-panel");
    panel.dataset.mode = idle ? "idle" : state.busy ? "active" : "completed";
    el("current-body").hidden = idle;
    setText("idle-summary", idle && summary ? "آخرین اجرا · " + countText(counts) + " · " + duration(summary.duration) : "");
    el("idle-summary").hidden = !idle || !summary;
    badge(el("phase"), state.phase); setText("status", state.message || "آماده");
    for (const key of ["passed", "failed", "skipped"]) setText("metric-" + key, counts ? counts[key] || 0 : "—");
    setText("metric-duration", duration(summary?.duration ?? progress?.elapsed));
    el("progress").hidden = !state.busy || !progress;
    if (progress) {
      el("progress").max = Math.max(1, progress.total); el("progress").value = progress.completed;
      setText("progress-label", progress.completed + " / " + progress.total);
    } else setText("progress-label", "");
    setText("current", state.busy ? progress?.current || "" : ""); el("current").hidden = !state.busy || !progress?.current;
    const extra = counts ? [counts.interrupted ? counts.interrupted + " متوقف‌شده" : "", counts.notRun ? counts.notRun + " اجرانشده" : "", counts.flaky ? counts.flaky + " Flaky" : ""].filter(Boolean).join(" · ") : "";
    setText("counts", extra); el("counts").hidden = !extra;
    setText("log", state.log || ""); el("logs").hidden = !state.log;
  }
  window.addEventListener("message", ({ data }) => {
    if (data.type === "init") { ready = true; root = data.root; setText("root", basename(root)); el("root").title = root; }
    else if (data.type === "target") { el("path").value = data.path; preferences(); }
    else if (data.type === "picking") picking = data.busy;
    else if (data.type === "history") { runs = data.runs; renderHistory(); }
    else if (data.type === "detail") { if (!selectedRunId || data.detail.manifest.id === selectedRunId) renderDetail(data.detail); }
    else if (data.type === "state") {
      busy = data.state.busy; stopping = busy && (stopping || data.state.phase === "stopping"); current(data.state);
      if (data.state.catalog) {
        const signature = JSON.stringify(data.state.catalog);
        if (signature !== catalogSignature) { catalogSignature = signature; catalog = data.state.catalog; catalogSelection.clear(); catalogLimit = 12; el("catalog-all").checked = false; renderCatalog(); }
      }
      if (data.state.result && data.state.result.manifest.id !== lastResultId) {
        lastResultId = data.state.result.manifest.id;
        if (followCurrent || !detail) renderDetail(data.state.result);
      }
    } else if (data.type === "error") {
      if (typeof data.busy === "boolean") busy = data.busy;
      stopping = false;
      setText("error", data.message); el("error").hidden = false;
    }
    controls();
  });
  controls(); post("ready");
})();
