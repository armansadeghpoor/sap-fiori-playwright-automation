(function (target) {
  "use strict";
  function tree(catalog) {
    const root = { key: "folder:", kind: "folder", text: "TestCases", path: "", children: [], ids: [] }, folders = new Map([["", root]]), files = new Map();
    function folder(relative) {
      if (folders.has(relative)) return folders.get(relative);
      const parts = relative.split("/"), text = parts.pop(), parent = folder(parts.join("/"));
      const node = { key: "folder:" + relative, kind: "folder", text, path: relative, children: [], ids: [] }; folders.set(relative, node); parent.children.push(node); return node;
    }
    function file(relative) {
      if (files.has(relative)) return files.get(relative);
      const parts = relative.split("/"), text = parts.pop(), parent = folder(parts.join("/"));
      const node = { key: "file:" + relative, kind: "file", text, path: relative, children: [], ids: [] }; files.set(relative, node); parent.children.push(node); return node;
    }
    for (const entry of catalog.entries || []) (entry.kind === "folder" ? folder : file)(entry.path);
    for (const test of catalog.tests || []) file(test.displayPath).children.push({ key: "test:" + test.id, kind: "test", text: test.title, test, path: test.displayPath, ids: [test.id], children: [] });
    function collect(node) {
      if (node.kind !== "test") {
        node.children.sort((a,b) => (a.kind === b.kind ? 0 : a.kind === "folder" ? -1 : 1) || a.text.localeCompare(b.text, "fa", { numeric: true }));
        node.ids = node.children.flatMap(collect);
      }
      return node.ids;
    }
    collect(root); return root;
  }
  function filtered(node, { query = "", project = null, selectedOnly = false }, selected) {
    if (node.kind === "test") return (!selectedOnly || selected.has(node.test.id)) && (project === null || node.test.project === project) &&
      [node.test.title, ...node.test.titles, node.test.project, node.path, node.test.id].join(" ").toLocaleLowerCase().includes(query.toLocaleLowerCase()) ? node : null;
    const children = node.children.map(child => filtered(child, { query, project, selectedOnly }, selected)).filter(Boolean);
    return children.length || (!query && project === null && !selectedOnly && !node.ids.length) ? { ...node, children } : null;
  }
  class Selection {
    constructor() { this.ids = new Set(); this.revision = null; }
    stale(catalog) { return Boolean(catalog.stale || this.ids.size && this.revision !== catalog.catalogRevision); }
    toggle(ids, checked, catalog) {
      if (catalog.phase !== "ready" || this.stale(catalog)) throw new Error("Catalog یا Selection قدیمی است؛ ابتدا بازشناسایی و انتخاب‌ها را پاک کنید.");
      const known = new Set(catalog.tests.map(test => test.id));
      if (ids.some(id => !known.has(id))) throw new Error("شناسهٔ تست در Catalog موجود نیست.");
      if (!this.ids.size) this.revision = catalog.catalogRevision;
      for (const id of ids) if (checked) this.ids.add(id); else this.ids.delete(id);
      if (!this.ids.size) this.revision = null;
    }
    state(ids) { const count = ids.filter(id => this.ids.has(id)).length; return { checked: Boolean(ids.length && count === ids.length), partial: Boolean(count && count < ids.length), count }; }
    clear() { this.ids.clear(); this.revision = null; }
    payload(catalog) { if (!this.ids.size || catalog.phase !== "ready" || this.stale(catalog)) throw new Error("انتخاب معتبر و تازه لازم است."); return { catalogRevision: this.revision, ids: [...this.ids] }; }
  }
  const api = { tree, filtered, Selection };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else target.StudioExplorerModel = api;
})(typeof window !== "undefined" ? window : globalThis);
