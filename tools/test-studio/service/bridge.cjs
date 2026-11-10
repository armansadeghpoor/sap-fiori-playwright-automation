const fs = require('node:fs');
const crypto = require('node:crypto');
const native = require('./native.cjs');
const registry = require('../bridge/registry.cjs');
const { safeSpec } = require('../regression/source.cjs');
const { fail } = require('./repository.cjs');
class Bridge {
  constructor(repository, catalog, options = {}) { this.repository = repository; this.catalog = catalog; this.options = options; }
  async call(record, route, body) {
    const actual = await (this.options.identity || registry.identity)(record.pid);
    if (actual.startTicks !== record.identity.startTicks || actual.exe.toLowerCase() !== record.identity.exe.toLowerCase()) throw Error('Bridge process identity changed');
    const response = await fetch(`http://127.0.0.1:${record.port}${route}`, { method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(route === '/artifacts/open' ? 30000 : 4000),
      headers: { Authorization: 'Bearer ' + record.token, 'X-Studio-Bridge': '1', ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
    if (!response.ok) throw fail(409, 'Bridge عملیات را نپذیرفت؛ فایل، پنجره یا ظرفیت Viewer را بررسی کنید.');
    const text = await response.text(); if (text.length > 8192) throw Error('Invalid Bridge response'); return JSON.parse(text);
  }
  async available() {
    let records;
    try { records = registry.records(this.repository.root, this.options.directory); } catch { return []; }
    return (await Promise.all(records.map(async record => {
      try { const health = await this.call(record, '/health'); if (health.windowId !== record.windowId || health.projectKey !== record.projectKey || health.pid !== record.pid || health.protocolVersion !== 1) return null; return { ...record, capabilities: health.capabilities }; } catch { return null; }
    }))).filter(Boolean);
  }
  async status() { const windows = (await this.available()).map(({ windowId, label }) => ({ windowId, label })); return { connected: windows.length > 0, windows, message: windows.length ? 'Bridge آماده است؛ پنجرهٔ مقصد را بررسی کنید.' : 'VS Code یا Bridge در دسترس نیست؛ پروژه را با Extension سازگار باز کنید. Source Preview مستقل قابل استفاده است.' }; }
  async guard(tests) {
    const windows = await this.available();
    if (!windows.length) return { verified: false, message: 'Bridge متصل نیست؛ ویرایش‌های ذخیره‌نشده قابل بررسی نیستند. فقط نسخهٔ ذخیره‌شده روی دیسک اجرا می‌شود.' };
    for (const record of windows) {
      if (record.capabilities?.editorGuard !== 1) throw fail(409, 'Bridge متصل بررسی ویرایش‌های ذخیره‌نشده را پشتیبانی نمی‌کند؛ Extension سازگار را باز کنید.');
      for (let i = 0; i < tests.length; i += 32) {
        const batch = tests.slice(i, i + 32).map(({ file, sourceHash }) => ({ file, sourceHash }));
        const value = await this.call(record, '/editors/check', { requestId: crypto.randomUUID(), tests: batch });
        if (value.windowId !== record.windowId || value.checked !== batch.length || !Array.isArray(value.dirty)) throw fail(409, 'بررسی Editor کامل نشد؛ اجرا متوقف شد.');
        if (value.dirty.length) throw fail(409, 'تست انتخاب‌شده ویرایش ذخیره‌نشده دارد. در VS Code بازبینی و به‌صورت دستی ذخیره کنید، سپس Discovery را تکرار کنید. هیچ فایلی خودکار ذخیره نشد.');
      }
    }
    // A registered but unreachable window must never be reported as inspected.
    let candidates; try { candidates = registry.records(this.repository.root, this.options.directory); } catch { candidates = null; }
    if (!candidates || candidates.length !== windows.length || candidates.some(c => !windows.some(w => w.windowId === c.windowId))) throw fail(409, 'بررسی همهٔ پنجره‌های ثبت‌شده ممکن نشد؛ اجرا متوقف شد. Bridgeهای متصل را بررسی کنید.');
    return { verified: true, message: 'ویرایش ذخیره‌نشده در فایل‌های تست انتخاب‌شده در پنجره‌های متصل دیده نشد؛ نسخهٔ دیسک اجرا می‌شود.' };
  }
  async artifact(input) {
    if (!input || Object.keys(input).sort().join(',') !== 'artifactId,kind,runId,windowId' || !['report','trace','archive'].includes(input.kind) || input.windowId !== null && !registry.uuid.test(input.windowId)) throw fail(400, 'Invalid artifact action.');
    const validate = () => this.repository.viewer(input);
    validate(); const windows = await this.available();
    const record = input.windowId ? windows.find(w => w.windowId === input.windowId) : windows.length === 1 ? windows[0] : null;
    if (!record || record.capabilities?.artifacts !== 1) throw fail(409, 'برای بازکردن Viewer یا پوشه، پنجرهٔ مشخص VS Code با Bridge سازگار را متصل کنید. دانلود ZIP مستقل در دسترس است.');
    validate();
    const { windowId, ...action } = input;
    const result = await this.call(record, '/artifacts/open', { ...action, requestId: crypto.randomUUID() });
    if (result.windowId !== record.windowId || result.opened !== true) throw fail(409, 'Invalid viewer response.');
    return result;
  }
  resolve(selection) {
    if (!selection || typeof selection !== 'object' || Array.isArray(selection)) throw fail(400, 'انتخاب Source معتبر نیست.');
    if (selection.kind === 'history' && Object.keys(selection).sort().join(',') === 'kind,runId,testId') {
      this.repository.source(selection.runId, selection.testId);
      const value = this.repository.raw(selection.runId), test = value.manifest.tests.find(t => t.id === selection.testId), result = this.repository.find(value, selection.testId);
      return { test, result };
    }
    if (selection.kind === 'catalog' && Object.keys(selection).sort().join(',') === 'catalogRevision,kind,testId') {
      const { tests } = this.catalog.resolve({ catalogRevision: selection.catalogRevision, ids: [selection.testId] });
      safeSpec(this.repository.root, tests[0].file); return { test: tests[0], result: null };
    }
    throw fail(400, 'فقط شناسهٔ تست و Run یا Catalog پذیرفته می‌شود؛ Path و Command مجاز نیست.');
  }
  async open(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).sort().join(',') !== 'selection,windowId' || input.windowId !== null && !registry.uuid.test(input.windowId)) throw fail(400, 'درخواست Bridge نامعتبر است.');
    this.resolve(input.selection); const windows = await this.available();
    const record = input.windowId ? windows.find(w => w.windowId === input.windowId) : windows.length === 1 ? windows[0] : null;
    if (!record) throw fail(409, windows.length > 1 ? 'چند پنجره معتبر است؛ پنجرهٔ مقصد را صریح انتخاب کنید.' : 'پنجرهٔ انتخاب‌شده متصل نیست. VS Code و Bridge را بررسی کنید؛ Source Preview در دسترس است.');
    // Re-resolve after the asynchronous window checks to reject a stale Catalog/removed Run.
    const fresh = this.resolve(input.selection), test = fresh.test;
    const target = { test: { id: test.id, file: test.file, line: test.line, column: test.column, sourceHash: test.sourceHash ?? null },
      result: fresh.result ? { outcome: fresh.result.outcome, attempts: [{ errors: (fresh.result.attempts?.at(-1)?.errors || []).slice(0, 4).map(e => ({
        location: e.location ? { file: e.location.file, line: e.location.line, column: e.location.column } : undefined,
        stack: String(e.stack || '').slice(0, 4096) })) }] } : null };
    const result = await this.call(record, '/open', { requestId: crypto.randomUUID(), target });
    if (result.windowId !== record.windowId || result.opened !== true) throw fail(409, 'پاسخ پنجرهٔ مقصد معتبر نیست.');
    return result;
  }
}
module.exports = { Bridge };
