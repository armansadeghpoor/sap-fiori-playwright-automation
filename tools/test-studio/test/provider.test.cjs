const { test } = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const { fixture, cleanup } = require("./fixture.cjs");
const root = fixture();
let dirty = true, saves = 0, canSave = true, source = "", notices = 0;
const metadata = new Map();
const document = { get isDirty() { return dirty; }, getText: () => source,
  save: async () => { saves++; if (canSave) dirty = false; return canSave; } };
const vscode = {
  workspace: {
    isTrusted: true, workspaceFolders: [{ uri: { scheme: "file", fsPath: root } }],
    getConfiguration: () => ({ get: () => "" }),
    openTextDocument: async () => document,
    onDidChangeWorkspaceFolders: () => ({ dispose() {} }),
  },
  window: { registerWebviewViewProvider: () => ({ dispose() {} }),
    showWarningMessage: async () => { notices++; return undefined; } },
  commands: { registerCommand: () => ({ dispose() {} }) },
  Uri: { file: fsPath => ({ fsPath, scheme: "file" }) },
};
const load = Module._load;
let activate;
try {
  Module._load = function (name, ...args) { return name === "vscode" ? vscode : load.call(this, name, ...args); };
  ({ activate } = require("../extension.cjs"));
} finally { Module._load = load; }
const { provider } = activate({ subscriptions: [], workspaceState: {
  get: key => metadata.get(key), update: async (key, value) => metadata.set(key, value),
} });
test.after(() => cleanup(root));

test("provider saves dirty target only and aborts on save failure", async () => {
  assert.equal(await provider.prepareRun("target.spec.ts", false), true);
  assert.equal(saves, 1);
  assert.equal(notices, 0);
  assert.equal(await provider.prepareRun("target.spec.ts", false), true);
  assert.equal(saves, 1, "clean document is not saved again");
  dirty = true; canSave = false;
  await assert.rejects(provider.prepareRun("target.spec.ts", false), /ذخیره نشد/);
  canSave = true;
});

test("provider confirms original and directly added Snapshot every run; cancel is respected", async () => {
  assert.equal(await provider.prepareRun("target.spec.ts", true), false);
  assert.equal(notices, 1);
  source = "await restoreSnapshot(request);";
  assert.equal(await provider.prepareRun("target.spec.ts", false), false);
  assert.equal(notices, 2);
  provider.confirmRun = async () => "تأیید و اجرای تست";
  assert.equal(await provider.prepareRun("target.spec.ts", false), true);
});

test("run message accepts no client-supplied path and respects busy/picker guards", async () => {
  let count = 0;
  provider.studio.runTest = async (...args) => { assert.deepEqual(args, []); count++; };
  await provider.handle({ type: "run", specPath: "untrusted-path.spec.ts" });
  assert.equal(count, 1);
  provider.studio.busy = true;
  await provider.handle({ type: "run" });
  provider.studio.busy = false;
  provider.pickingFolder = true;
  await provider.handle({ type: "run" });
  assert.equal(count, 1);
  provider.pickingFolder = false;
});

test("run stop has no recording-copy dialog and target metadata excludes consent/credentials", async () => {
  const before = notices;
  let stops = 0;
  provider.studio.child = {};
  provider.studio.state.operation = "run";
  provider.studio.stop = async () => { stops++; };
  await provider.handle({ type: "stop" });
  assert.equal(stops, 1);
  assert.equal(notices, before);
  const target = { root, specPath: "target.spec.ts", snapshot: true };
  await provider.studio.host.rememberTarget(target);
  assert.deepEqual(metadata.get("lastSpec"), target);
});
