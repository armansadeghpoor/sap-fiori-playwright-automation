# VS Code Bridge — 0.6.0

Version 0.6.0 is the accepted Studio baseline, retaining the Windows-local Bridge introduced in 0.4.0. The user completed manual acceptance. Regression Execution Manager and Recorder remain available; this release does not authorize UI retirement.

## Architecture and boundary

Each trusted compatible VS Code window runs its own loopback-only endpoint and displays a unique `Studio Bridge #xxxxxx` status-bar ID. Its private registration lives in `%LOCALAPPDATA%/PlaywrightTestStudio/<canonical-project-hash>/bridges`. Windows ACL inheritance is disabled; only the current account and SYSTEM have access. The registration contains a native bearer capability and must not be shared. It is never returned to the browser, placed in a URL, logged or committed.

The Service verifies the registered PID, executable and process creation time before sending native credentials, then checks the authenticated health response's window/project identity. Failed or stale registrations are ignored, preserved and never adopted or deleted. The Extension removes only its own unchanged registration on normal shutdown. Native identity checks are asynchronous so they do not block execution event delivery.

Dashboard requests use the existing Session, exact Origin and CSRF checks. The only source selectors accepted from the browser are:

* History: `kind: history`, `runId`, `testId`.
* Explorer: `kind: catalog`, `catalogRevision`, `testId`.

No browser-provided file path, line number, URL, workspace, executable or command is accepted. The Service resolves the IDs against its read-only History/current Catalog and revalidates after window discovery. Only bounded source metadata is passed to the authenticated native endpoint. The Extension independently checks its current trusted project and the on-disk Spec boundary, including symlink/junction rejection. The native protocol remains version 1 with additive, explicitly advertised `editorGuard: 1` and `artifacts: 1` capabilities. It exposes health, source opening, selected-editor inspection, and fixed report/trace/archive actions. It cannot accept arbitrary commands or start tests.

The shared `regression/source.cjs` resolver is used by Source Preview, the existing Extension view and the Bridge. A failed test uses a validated same-Spec assertion location/stack frame; otherwise it falls back to the recorded definition. Passed and skipped tests use their exact test IDs and definition positions. A changed source/dirty buffer or missing historical hash is clearly reported; historical line numbers are not claimed to have been remapped to changed code. Deleted/out-of-bound sources fail without creating a file.

Opening code never saves, reverts or closes a dirty/untitled document. Source opens with `preview: false`. Existing source tabs/groups are reused; two distinct files remain open. Neither clean source tabs nor dirty buffers are discarded. History/Explorer selections are unchanged. If multiple valid windows exist, a new Dashboard requires an explicit destination. A disconnected chosen window is never silently replaced by another. The status-bar ID identifies otherwise identical project windows. Dashboard Source Preview remains independent when no Bridge is available.

This is a boundary against browser requests, other projects and accidental wrong-window routing; it is not a boundary against malicious native programs running as the same Windows user, a compromised Extension host or administrator.

## Build and automated validation

From the repository root (all test projects are synthetic):

```powershell
node --test --test-concurrency=1 tools/test-studio/test/*.test.cjs
node tools/test-studio/test/bridge-browser.cjs
node tools/test-studio/test/run-bridge-vscode.cjs "C:\Users\Barsa\AppData\Local\Programs\Microsoft VS Code\Code.exe"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tools\test-studio\package.ps1
```

PowerShell users can enumerate the `.test.cjs` files explicitly if their Node version does not expand the wildcard. Existing Browser/Webview and Extension Host harnesses remain under `test`. The two-window harness launches separate isolated VS Code profiles against one temporary project, verifies actual editor state through authenticated HTTP and exits its own hosts normally. It never runs the real project's tests or loads its Config.

The VSIX contains the Extension bridge, shared source helper and required native Windows identity/ACL helpers. The Standalone Service and Launcher continue running from repository source. Launcher protocol 2 and the minimum safe execution-client version 0.3.0 remain unchanged; Source Bridge remains compatible with 0.4.0. New editor protection and native artifact actions require the 0.6.0 capabilities. An older connected Bridge blocks execution until upgraded; it is never reported as having inspected editors. No new shortcut is required.

## Install and accept on two monitors

1. Save your work only if you choose to; installation/reload follows normal VS Code behavior. Install the final `playwright-test-studio-0.6.0.vsix` (manual installation only) via **Extensions → … → Install from VSIX…** in the intended profile, then **Developer: Reload Window**.
2. Open the intended repository as a trusted local VS Code workspace on monitor one. Wait for `Studio Bridge #xxxxxx` in its status bar. Clicking it shows the project and full window identity. **Playwright Test Studio: Bridge Reconnect** retries registration if needed.
3. If a Service from before the upgrade is still running, use its **Stop Service** button while no Discovery/Run is active, then reopen the existing Desktop shortcut. Closing a tab alone does not restart the Service. Never delete locks/descriptors or kill an unknown process to upgrade.
4. Keep the Dashboard on monitor two. Its VS Code Bridge section should list the matching window ID. If multiple trusted windows have the same project open, choose the exact ID shown on monitor one. Different projects must not appear.
5. Select an existing History test and click **Open in VS Code**. Check the failed assertion or passed/skipped definition. For Explorer, use an already-valid Catalog, or explicitly choose Discovery if appropriate; then use the row's **Open in VS Code** button. Discovery imports Config/spec modules; no Run is needed for source acceptance.
6. Check a Persian filename and similar test titles, repeat opening, leave a source tab with an unsaved edit, and open another result. Verify the edit remains dirty and no redundant duplicate source tab appears. Verify both Dashboard selections remain unchanged.
7. Close the chosen fixture/VS Code window normally and retry. The Dashboard must explain the unavailable destination and keep Source Preview usable. Reopen/reconnect, refresh Bridge and explicitly select the new ID. Test a second same-project window to verify routing.

The user deliberately moved 12 real Runs to Trash; these are not restored for acceptance. Use currently available History/Catalog or controlled fixtures. Do not run a Business Test or RestoreSnapshot for this acceptance.

The Bridge opens the source in the selected window's editor. It does not move OS windows between monitors or bypass Windows foreground-focus rules. Physical monitor placement, foreground focus, installed-profile activation and the final visual experience require manual acceptance. Browser/HTTP and two real Extension Hosts cover the automated portion. Remote/WSL/SSH, virtual or untrusted workspaces are outside this Windows-local release.

## Dashboard parity additions (Regression UI retained)

`POST /api/bridge/artifact` requires the existing Session, exact Origin and CSRF. Its exact fields are `windowId`, `kind` (`report`, `trace`, `archive`), `runId`, `artifactId` (null except a registered trace attachment ID). No path, URL, executable, CLI argument or general command is accepted. The selected authenticated native Host independently resolves and checks the Run, report marker or trace attachment ID, paths and absence of symlinks/junctions.

Report and Trace use the installed workspace Playwright CLI via a VS Code terminal with a fixed Node executable and an argument array, not shell text. They cannot run a spec. Viewers bind to 127.0.0.1 and use a free/available port. The CLI serves an isolated temporary copy: the report subtree or just the selected trace ZIP. No original workspace/History file route is added to Studio HTTP. Copy size is limited to 512 MiB / 10,000 files, depth 32; symlinks are refused. Repeated actions reuse their owned terminal; at most four distinct viewers per Host are retained. Closing that terminal deletes only its guarded temporary copy. Closing Dashboard/Studio does not kill native viewers; close their terminals normally. Abnormal Host exit can leave a temporary copy; no automatic unknown-process cleanup is attempted. The native CLI viewer is loopback-local and has its own normal Playwright HTTP behavior; it does not receive the native Bridge bearer or a Dashboard URL/token. Viewer copy and rendering are not an HTML/ZIP malware sandbox. Same-user malicious native programs are outside this boundary.

The Service's editor guard checks selected on-disk identities against **all registered reachable project windows**, in batches of 32. It refuses dirty selected specs and partial/unverifiable connected inspections. The check happens before discovery, before explicit execution confirmation, and again immediately before running. It never saves/discards a buffer. If no compatible Bridge is reachable initially, the explicit confirmation warns that unsaved changes cannot be checked and **only saved disk versions will run**. If a successful inspection later loses its Bridge, execution is blocked. Editors cannot be locked atomically across processes; a change after the final check is still possible, as in the legacy prepare/save workflow. Nonregistered editors and unsaved imported helpers cannot be certified. Both existing execution and Snapshot confirmations remain mandatory.

Discovery has an operation-scoped cancel endpoint with Origin/CSRF and an exact discovery ID. Cancellation stops only the child owned by Catalog, preserves the last committed revision and selected IDs, and publishes cancelled separately from failure only after owned cleanup succeeds. A failed cleanup keeps the lock and a non-runnable error state. Service shutdown is a separate action.

Live CLI output uses actual stdout/stderr callbacks in the shared manager. A per-operation line buffer suppresses overlong lines (8,192 characters), redacts known session/bootstrap/environment credentials plus common password/token/auth/JWT patterns, and retains the last 16,000 characters with stream labels. It never serves the raw archived log files. Existing SSE coalescing/backpressure, expiry, polling fallback and revisions are preserved. Arbitrary test output cannot be proven secret-free by pattern matching; tests/helpers should not print secrets without labels. This is redaction of known values/patterns, not a claim of universal secret classification. The unmodified legacy UI/raw local archives retain their existing behavior.

Fixture validation: `test/parity.test.cjs`, `test/parity-browser.cjs`, and the expanded two-window `test/run-bridge-vscode.cjs`. The browser harness opens actual Playwright reports and recorded browser traces and verifies filesystem escape rejection. All fixtures are temporary; no production Business Test, RestoreSnapshot, real profile installation, History mutation or UI retirement is authorized by these tests.

## History selection refresh regression

Deleting a selected Run clears its prior Summary, Inspector, attempts, artifacts/source display and Rerun selection. If another Run remains it is selected normally; empty History stays empty without a stale error banner. A duplicated attempt renderer previously referenced an out-of-scope variable in that cleanup branch; it was removed without changing Backend/History schema. `node tools/test-studio/test/history-selection-browser.cjs` permanently tests both cases with synthetic Runs, including transient caught errors and unhandled rejections. It never reads, deletes or restores real project History.
