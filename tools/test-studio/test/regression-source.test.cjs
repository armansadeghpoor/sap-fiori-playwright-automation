const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { fixture, cleanup, withRunner } = require("./fixture.cjs");
const { History, hashFile } = require("../regression/history.cjs");
const { RegressionView } = require("../regression/view.cjs");

function setup(t) {
  const root = fixture(); t.after(() => cleanup(root));
  const filename = path.join(root, "TestCases", "سناریو (اول) با فاصله.spec.ts");
  fs.writeFileSync(filename, Array.from({ length: 12 }, (_, index) => "// source line " + (index + 1)).join("\n"));
  const store = new History(root), opened = [], shown = [], messages = [];
  const vscode = {
    Uri: { file: fsPath => ({ fsPath, scheme: "file" }) },
    Range: class { constructor(line, character, endLine, endCharacter) { this.start = { line, character }; this.end = { line: endLine, character: endCharacter }; } },
    ViewColumn: { Active: -1 }, TextEditorRevealType: { InCenterIfOutsideViewport: 2 },
    workspace: { openTextDocument: async uri => {
      opened.push(uri.fsPath); const lines = fs.readFileSync(uri.fsPath, "utf8").split("\n");
      return { uri, lineCount: lines.length, isDirty: false, lineAt: line => ({ text: lines[line] }) };
    } },
    window: { visibleTextEditors: [], tabGroups: { all: [{ viewColumn: 1 }] }, showTextDocument: async (document, options) => {
      shown.push({ document, options }); return { document, viewColumn: 1, revealRange(range) { assert.equal(range, options.selection); } };
    } },
  };
  const view = new RegressionView({}, vscode, { root: () => root, node: () => process.execPath });
  view.send = value => messages.push(value);
  const spec = (id, extra = {}) => ({ id, file: filename, line: 2, column: 3, sourceHash: hashFile(filename), ...extra });
  function archive(tests, results = tests.map(item => ({ ...item, outcome: "passed", attempts: [] }))) {
    const run = store.create({ scope: "file", tests }); store.finalize(run, { status: "failed", tests: results });
    return run;
  }
  const open = (run, testId, extra = {}) => view.handle({ type: "openSource", id: run.manifest.id, testId, ...extra });
  return { root, filename, store, vscode, view, opened, shown, messages, spec, archive, open };
}

test("failed source uses the exact manifest ID, valid error line, safe preview and immutable history", async t => {
  const s = setup(t), a = s.spec("A"), b = s.spec("B", { line: 9 });
  const run = s.archive([a, b], [{ ...a, outcome: "failed", attempts: [{ errors: [{ location: { file: s.filename, line: 6, column: 7 } }] }] },
    { ...b, line: 1, outcome: "passed", attempts: [] }]);
  const before = fs.readFileSync(path.join(run.folder, "summary.json"));
  await s.open(run, "A", { path: "C:\\untrusted.spec.ts", line: 1 });
  assert.deepEqual(s.opened, [s.filename]);
  assert.deepEqual(s.shown[0].options.selection.start, { line: 5, character: 6 });
  assert.equal(s.shown[0].options.preview, true); assert.equal(s.shown[0].options.preserveFocus, true);
  assert.equal(s.shown[0].options.viewColumn, -1);
  await s.open(run, "B");
  assert.equal(s.shown.at(-1).options.selection.start.line, 8, "manifest definition wins over a summary copy");
  assert.equal(s.shown.at(-1).options.viewColumn, 1, "the same editor group is reused");
  assert.deepEqual(fs.readFileSync(path.join(run.folder, "summary.json")), before);
  assert.equal(s.store.list().length, 1);
});

test("same-Spec stack frames support Persian Windows paths, spaces and parentheses", async t => {
  const s = setup(t), a = s.spec("A");
  const run = s.archive([a], [{ ...a, outcome: "failed", attempts: [{ errors: [{
    stack: "\u001b[31mError\u001b[0m\n    at test body (" + s.filename + ":7:4)" }] }] }]);
  await s.open(run, "A"); assert.deepEqual(s.shown[0].options.selection.start, { line: 6, character: 3 });
});

test("external, missing and invalid failure locations fall back to the definition; skipped tests open too", async t => {
  const s = setup(t), a = s.spec("A");
  for (const error of [{}, { location: { file: path.join(s.root, "helper.ts"), line: 5 } },
    { location: { file: path.join(s.root, "helper.ts"), line: 5 }, stack: "at " + s.filename + ":7:1" },
    { location: { file: s.filename, line: 999 }, stack: "at " + s.filename + ":7:1" }, { location: { file: s.filename, line: -1 } },
    { stack: "at " + path.join(s.root, "helper.ts") + ":1:1\n at " + s.filename + ":7:1" },
    { stack: "at " + s.filename + ":999:1" }]) {
    const run = s.archive([a], [{ ...a, outcome: "failed", attempts: [{ errors: [error] }] }]);
    await s.open(run, "A"); assert.equal(s.shown.at(-1).options.selection.start.line, 1);
  }
  const skipped = s.archive([a], [{ ...a, outcome: "skipped" }]); await s.open(skipped, "A");
  assert.equal(s.shown.at(-1).options.selection.start.line, 1);
  const obsolete = s.archive([s.spec("old", { line: 999 })]); await s.open(obsolete, "old");
  assert.deepEqual(s.shown.at(-1).options.selection.start, { line: 0, character: 0 });
  assert.match(s.messages.at(-1).message, /ابتدای فایل/);
});

test("invalid IDs, outside paths, junction escapes, directories and removed files never open", async t => {
  const s = setup(t), other = fixture(); t.after(() => cleanup(other));
  const outside = path.join(other, "TestCases", "outside.spec.ts"); fs.writeFileSync(outside, "// outside");
  const inRoot = path.join(s.root, "outside.spec.ts"); fs.writeFileSync(inRoot, "// outside TestCases");
  const link = path.join(s.root, "TestCases", "link");
  fs.symlinkSync(path.dirname(outside), link, process.platform === "win32" ? "junction" : "dir");
  const directory = path.join(s.root, "TestCases", "directory.spec.ts"); fs.mkdirSync(directory);
  const run = s.archive([s.spec("valid")]);
  await s.open(run, "unknown"); assert.match(s.messages.at(-1).message, /شناسه/);
  await s.view.handle({ type: "openSource", id: "../../bad", testId: "valid" });
  assert.equal(s.messages.at(-1).error, true);
  const duplicate = s.archive([s.spec("same"), s.spec("same")]); await s.open(duplicate, "same");
  for (const filename of [outside, inRoot, path.join(link, "outside.spec.ts"), directory, path.join(s.root, "TestCases", "removed.spec.ts"), "relative.spec.ts"]) {
    const invalid = s.archive([s.spec("bad", { file: filename })]); await s.open(invalid, "bad");
    assert.equal(s.messages.at(-1).error, true, filename);
  }
  assert.equal(s.opened.length, 0); assert.equal(s.shown.length, 0);
  fs.unlinkSync(link); // Do not recursively traverse the fixture's junction during cleanup.
});

test("changed disk and dirty buffers are warned about without saving or rewriting code", async t => {
  const s = setup(t), run = s.archive([s.spec("A")]);
  fs.appendFileSync(s.filename, "\n// changed after run");
  await s.open(run, "A"); assert.equal(s.messages.at(-1).changed, true);
  assert.match(s.messages.at(-1).message, /متفاوت/);
  const current = s.archive([s.spec("B")]), originalOpen = s.vscode.workspace.openTextDocument;
  s.vscode.workspace.openTextDocument = async uri => ({ ...await originalOpen(uri), isDirty: true });
  const before = fs.readFileSync(s.filename); await s.open(current, "B");
  assert.equal(s.messages.at(-1).changed, true); assert.deepEqual(fs.readFileSync(s.filename), before);
  const legacy = s.archive([s.spec("old", { sourceHash: undefined })]);
  s.vscode.workspace.openTextDocument = originalOpen; await s.open(legacy, "old");
  assert.match(s.messages.at(-1).message, /قابل تأیید نیست/);
});

test("rapid clicks skip obsolete documents and the final selected test wins", async t => {
  const s = setup(t), run = s.archive([s.spec("A"), s.spec("B", { line: 8 })]);
  const original = s.vscode.workspace.openTextDocument; let release;
  s.vscode.workspace.openTextDocument = async uri => { const document = await original(uri); await new Promise(resolve => { release = resolve; }); return document; };
  const first = s.open(run, "A");
  while (!release) await new Promise(resolve => setImmediate(resolve));
  s.vscode.workspace.openTextDocument = original;
  const second = s.open(run, "B"); release(); await Promise.all([first, second]);
  assert.equal(s.shown.length, 1); assert.equal(s.shown[0].options.selection.start.line, 7);
  assert.equal(s.messages.at(-1).testId, "B");
});

test("real Playwright reporter error navigates to the actual assertion", async t => {
  const s = setup(t); withRunner(s.root);
  fs.writeFileSync(s.filename, 'const {test,expect}=require("@playwright/test");\ntest("real failure", () => {\n  expect(1).toBe(2);\n});\n');
  const run = await s.view.manager.run({ scope: "file", path: path.basename(s.filename), headed: false });
  assert.equal(run.summary.counts.failed, 1);
  const failed = run.summary.tests[0];
  await s.open(run, failed.id);
  assert.equal(s.shown.at(-1).options.selection.start.line, 2, JSON.stringify(failed.attempts.at(-1).errors));
});
