(() => {
  "use strict";
  const $ = id => document.getElementById(id), model = window.StudioExplorerModel, selection = new model.Selection(), expanded = new Set(["folder:"]), filterCollapsed = new Set();
  const make = (tag, text, cls) => { const node = document.createElement(tag); node.textContent = text || ""; if (cls) node.className = cls; return node; };
  let catalog = { phase: "idle", tests: [], entries: [], catalogRevision: null }, api, mutation, polling = null, reading = false, starting = false, readAgain = false, epoch = 0;
  function render() {
    const active = document.activeElement, activeKey = active?.closest("#explorer-tree li")?.dataset.nodeKey, activeCheckbox = active?.type === "checkbox";
    let restoreFocus;
    const busy = starting || catalog.phase === "discovering" || window.StudioExecution?.busy, stale = selection.stale(catalog), invalid = busy || catalog.phase !== "ready" || stale;
    $("discover").disabled = busy; $("explorer-all").disabled = invalid || !catalog.tests.length;
    $("explorer-clear").disabled = busy || !selection.ids.size;
    $("explorer-validate").disabled = invalid || !selection.ids.size;
    $("run-selected").disabled = invalid || !selection.ids.size || window.StudioExecution?.busy;
    $("run-suite").disabled = invalid || !catalog.tests.length || window.StudioExecution?.busy;
    $("explorer-count").textContent = `${catalog.fileCount || 0} فایل · ${catalog.testCount || 0} تست`;
    $("explorer-selected").textContent = `${selection.ids.size} تست انتخاب‌شده${stale && selection.ids.size ? " — انتخاب قدیمی / غیرقابل اجرا" : ""}`;
    $("explorer-revision").textContent = catalog.catalogRevision ? `Catalog #${catalog.catalogRevision.slice(0,8)}` : "Catalog هنوز ساخته نشده";
    $("explorer-revision").title = catalog.catalogRevision || "";
    $("explorer-status").textContent = busy ? "در حال Discovery… این عملیات Config و ماژول‌های تست را بارگذاری می‌کند؛ بدنهٔ تست اجرا نمی‌شود." :
      catalog.error ? `Discovery ناموفق: ${catalog.error}` : catalog.stale ? catalog.staleReason :
      stale ? "Catalog عوض شده است. انتخاب قبلی را پاک کنید و دوباره انتخاب کنید." : catalog.phase === "idle" ? "برای دریافت ساختار واقعی، روی «شناسایی / Refresh» بزنید. History منبع Explorer نیست." :
      !catalog.testCount ? "Discovery موفق بود؛ تستی پیدا نشد." : "Catalog آماده است؛ اجرا نیازمند بازبینی و تأیید است.";
    $("explorer-status").className = catalog.error || stale ? "notice error" : "notice";
    const projectValue = $("explorer-project").value, projects = [...new Set(catalog.tests.map(test => test.project))].sort();
    $("explorer-project").replaceChildren(); const all = make("option", "همهٔ Projectها"); all.value = "*"; $("explorer-project").append(all);
    for (const project of projects) { const option = make("option", project || "Project بدون نام"); option.value = JSON.stringify(project); $("explorer-project").append(option); }
    if ([...$("explorer-project").options].some(option => option.value === projectValue)) $("explorer-project").value = projectValue;
    const filters = { query: $("explorer-search").value.trim(), project: $("explorer-project").value === "*" ? null : JSON.parse($("explorer-project").value), selectedOnly: $("explorer-filter").value === "selected" };
    const activeFilter = filters.query || filters.project !== null || filters.selectedOnly;
    const root = model.filtered(model.tree(catalog), filters, selection.ids);
    $("explorer-tree").replaceChildren();
    if (!root || !catalog.entries.length && !catalog.tests.length) {
      $("explorer-tree").append(make("p", catalog.catalogRevision ? "موردی مطابق فیلتر نیست." : "Catalog خالی است؛ Discovery خودکار انجام نمی‌شود.", "muted")); return;
    }
    function append(node, parent) {
      const li = make("li"), row = make("div", "", "explorer-row"); li.dataset.nodeKey = node.key;
      const check = document.createElement("input"), state = selection.state(node.ids); check.type = "checkbox"; check.className = "explorer-select";
      check.setAttribute("aria-label", `انتخاب ${node.kind}: ${node.path || "TestCases"}${node.test ? " · " + node.test.titles.join(" › ") + " · " + node.test.project + " · " + node.test.line + ":" + node.test.column + " · " + node.test.id : ""}`);
      check.title = "تمام تست‌های این مورد، مستقل از فیلتر نمایشی"; check.checked = state.checked; check.indeterminate = state.partial; check.disabled = invalid || !node.ids.length;
      check.onchange = () => { try { selection.toggle(node.ids, check.checked, catalog); $("explorer-validation").textContent = ""; render(); } catch (error) { $("explorer-validation").textContent = error.message; } };
      row.dataset.kind = node.kind; row.dataset.selected = String(state.checked || state.partial);
      row.append(check);
      if (node.key === activeKey && activeCheckbox) restoreFocus = check;
      if (node.kind !== "test") {
        const open = Boolean(activeFilter ? !filterCollapsed.has(node.key) : expanded.has(node.key)), disclosure = make("button", (open ? "▾ " : "▸ ") + node.text, "explorer-disclosure"); disclosure.type = "button";
        disclosure.setAttribute("aria-expanded", String(open)); disclosure.title = node.path || "TestCases";
        disclosure.onclick = () => { const set = activeFilter ? filterCollapsed : expanded; if (set.has(node.key)) set.delete(node.key); else set.add(node.key); render(); };
        if (node.key === activeKey && !activeCheckbox) restoreFocus = disclosure;
        row.append(disclosure, make("span", `${state.count}/${node.ids.length}`, "explorer-total technical")); li.append(row);
        if (open) { const ul = make("ul"); for (const child of node.children) append(child, ul); li.append(ul); }
      } else {
        const label = make("div", "", "explorer-label"); label.title = node.test.id;
        const title = make("span", node.text); title.dir = "auto";
        label.append(title, make("span", `${node.test.project || "(default)"} · L${node.test.line}:${node.test.column} · ${node.test.titles.join(" › ")}`, "technical card-meta"));
        const source = make("button", "Open in VS Code"); source.type = "button"; source.disabled = catalog.phase !== 'ready' || stale;
        source.dataset.openTestId = node.test.id;
        source.onclick = () => window.StudioBridge.open({kind:'catalog',catalogRevision:catalog.catalogRevision,testId:node.test.id});
        row.append(label, source); li.append(row);
      }
      const run = make("button", node.kind === 'test' ? 'Run Test' : node.kind === 'file' ? 'Run File' : 'Run Folder'); run.type='button';
      run.disabled = invalid || !node.ids.length || window.StudioExecution?.busy;
      run.onclick = () => window.StudioExecution.start({scope:node.kind,catalogRevision:catalog.catalogRevision,ids:[...node.ids]});
      row.append(run);
      parent.append(li);
    }
    append(root, $("explorer-tree"));
    restoreFocus?.focus({ preventScroll: true });
  }
  async function refresh() {
    if (!api) return; if (reading) { readAgain = true; return; } reading = true; const ticket = epoch;
    try {
      const next = await api("/api/catalog");
      if (ticket !== epoch) { readAgain = true; return; }
      const changed = JSON.stringify(next) !== JSON.stringify(catalog); catalog = next;
      if (changed) { $("explorer-validation").textContent = ""; render(); }
      if (catalog.phase === "discovering" && !polling) polling = setTimeout(() => { polling = null; void refresh(); }, 400);
    } catch (error) { $("explorer-status").textContent = error.message; }
    finally { reading = false; if (readAgain) { readAgain = false; void refresh(); } }
  }
  $("discover").onclick = async () => {
    if (starting || catalog.phase === "discovering") return;
    const previous = catalog; epoch++; starting = true; catalog = { ...catalog, phase: "discovering", error: null }; render();
    try { await mutation("/api/discovery", {}); await refresh(); }
    catch (error) { epoch++; catalog = previous; $("explorer-validation").textContent = error.message; void refresh(); }
    finally { starting = false; render(); }
  };
  $("run-selected").onclick = () => window.StudioExecution.start({scope:'selection',...selection.payload(catalog)});
  $("run-suite").onclick = () => window.StudioExecution.start({scope:'suite',catalogRevision:catalog.catalogRevision,ids:catalog.tests.map(t=>t.id)});
  window.addEventListener('studio-execution',render);
  $("explorer-all").onclick = () => { selection.toggle(catalog.tests.map(test => test.id), true, catalog); $("explorer-validation").textContent = ""; render(); };
  $("explorer-clear").onclick = () => { selection.clear(); $("explorer-validation").textContent = ""; render(); };
  $("explorer-validate").onclick = async () => {
    try { const result = await mutation("/api/selection/resolve", selection.payload(catalog)); $("explorer-validation").textContent = `${result.ids.length} شناسهٔ دقیق تأیید شد؛ هیچ تستی اجرا نشد.`; }
    catch (error) { $("explorer-validation").textContent = error.message; await refresh(); }
  };
  for (const id of ["explorer-search", "explorer-project", "explorer-filter"]) $(id).addEventListener(id === "explorer-search" ? "input" : "change", () => { filterCollapsed.clear(); render(); });
  window.StudioExplorer = { async connect(read, write) { const first = !api; api = read; mutation = write; if (first) render(); await refresh(); }, refresh };
})();
