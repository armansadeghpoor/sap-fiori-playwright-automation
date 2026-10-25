(() => {
  const vscode = acquireVsCodeApi();
  const el = id => document.getElementById(id);
  const previous = vscode.getState() || {};
  el("name").value = typeof previous.name === "string" ? previous.name : "";
  el("path").value = typeof previous.path === "string" ? previous.path : "NewTests";
  let initialized = false, busy = false, picking = false, valid = false, target = "", request = 0, timer;
  const form = () => ({ name: el("name").value, path: el("path").value,
    user: el("user").value, device: el("device").value, snapshot: el("snapshot").checked });
  const enabled = () => {
    el("fields").disabled = !initialized || busy || picking;
    el("start").disabled = !initialized || busy || picking || !valid;
    el("run").disabled = !initialized || busy || picking || !target;
  };
  const error = (id, text) => { el(id).textContent = text || ""; el(id).hidden = !text; };
  function preview() {
    clearTimeout(timer);
    valid = false; enabled();
    const current = ++request;
    const value = form();
    // Restore harmless form preferences, but never persist Snapshot consent or logs.
    vscode.setState({ name: value.name, path: value.path, user: value.user, device: value.device });
    error("validation", "");
    error("folder-error", "");
    el("preview").textContent = value.name.trim() ? "در حال بررسی مسیر…" : "نام تست را وارد کنید.";
    if (!initialized || !value.name.trim()) return;
    timer = setTimeout(() => vscode.postMessage({ type: "preview", request: current, form: value }), 250);
  }
  el("form").addEventListener("input", preview);
  el("browse").addEventListener("click", () => {
    if (!initialized || busy || picking) return;
    picking = true;
    clearTimeout(timer);
    ++request; // Ignore previews for the path from before the dialog opened.
    enabled();
    vscode.postMessage({ type: "browse", path: el("path").value });
  });
  el("form").addEventListener("submit", event => {
    event.preventDefault();
    if (!initialized || busy || picking || !valid) return;
    busy = true; enabled();
    vscode.postMessage({ type: "start", form: form() });
  });
  el("stop").addEventListener("click", () => vscode.postMessage({ type: "stop" }));
  el("open").addEventListener("click", () => vscode.postMessage({ type: "open" }));
  el("run").addEventListener("click", () => {
    if (!initialized || busy || picking || !target) return;
    busy = true; enabled();
    vscode.postMessage({ type: "run" });
  });
  el("refresh").addEventListener("click", () => vscode.postMessage({ type: "ready" }));
  window.addEventListener("message", ({ data }) => {
    if (data.type === "init") {
      initialized = !data.error;
      error("init-error", data.error);
      el("refresh").hidden = initialized;
      if (initialized) {
        el("project").textContent = data.root;
        const labels = { desktop: "Desktop Chrome", "pixel-7": "Pixel 7", "iphone-15-pro-max": "iPhone 15 Pro Max" };
        for (const [id, values] of [["user", data.userProfiles], ["device", data.deviceProfiles]]) {
          const selected = el(id).value || previous[id];
          el(id).replaceChildren(...values.map(value => new Option(labels[value] || value, value)));
          if (values.includes(selected)) el(id).value = selected;
        }
        preview();
      }
      enabled();
    } else if (data.type === "folder") {
      picking = false;
      if (typeof data.path === "string") el("path").value = data.path;
      preview();
      error("folder-error", data.error);
    } else if (data.type === "preview" && data.request === request) {
      valid = !data.error;
      error("validation", data.error);
      el("preview").textContent = data.specPath || "مسیر معتبر نیست.";
      enabled();
    } else if (data.type === "state") {
      const wasBusy = busy;
      busy = data.state.busy;
      el("status").textContent = data.state.message;
      el("status").classList.toggle("error", ["error", "failed"].includes(data.state.phase));
      el("log").textContent = data.state.log;
      el("details").hidden = !data.state.log;
      if (["error", "failed", "running", "run-complete"].includes(data.state.phase)) el("details").open = true;
      target = data.state.specPath || "";
      el("created").textContent = data.state.specPath;
      el("created").hidden = !data.state.specPath;
      el("open").hidden = !data.state.specPath;
      el("run").hidden = !target;
      el("artifacts").textContent = data.state.outputDir ? "Test output: " + data.state.outputDir : "";
      el("artifacts").hidden = !data.state.outputDir;
      el("stop").textContent = data.state.operation === "run" ? "توقف اجرای تست" : "پایان ضبط";
      el("stop").hidden = !busy || !["recording", "running", "stopping"].includes(data.state.phase);
      el("stop").disabled = data.state.phase === "stopping";
      if (wasBusy && !busy) preview();
      enabled();
    } else if (data.type === "error") error("validation", data.error);
  });
  vscode.postMessage({ type: "ready" });
})();
