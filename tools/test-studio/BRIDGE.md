# VS Code Bridge — 0.4.0

Version 0.4.0 adds the local Extension bridge to the Standalone Dashboard released in 0.3.0. Manual acceptance of Open in VS Code succeeded in the real user environment. This is the accepted baseline for the Windows-local Bridge.

## Architecture and boundary

Each trusted compatible VS Code window runs its own loopback-only endpoint and displays a unique `Studio Bridge #xxxxxx` status-bar ID. Its private registration lives in `%LOCALAPPDATA%/PlaywrightTestStudio/<canonical-project-hash>/bridges`. Windows ACL inheritance is disabled; only the current account and SYSTEM have access. The registration contains a native bearer capability and must not be shared. It is never returned to the browser, placed in a URL, logged or committed.

The Service verifies the registered PID, executable and process creation time before sending native credentials, then checks the authenticated health response's window/project identity. Failed or stale registrations are ignored, preserved and never adopted or deleted. The Extension removes only its own unchanged registration on normal shutdown. Native identity checks are asynchronous so they do not block execution event delivery.

Dashboard requests use the existing Session, exact Origin and CSRF checks. The only source selectors accepted from the browser are:

* History: `kind: history`, `runId`, `testId`.
* Explorer: `kind: catalog`, `catalogRevision`, `testId`.

No browser-provided file path, line number, URL, workspace, executable or command is accepted. The Service resolves the IDs against its read-only History/current Catalog and revalidates after window discovery. Only bounded source metadata is passed to the authenticated native endpoint. The Extension independently checks its current trusted project and the on-disk Spec boundary, including symlink/junction rejection. It exposes health and open-source operations only; it cannot execute arbitrary commands or start tests.

The shared `regression/source.cjs` resolver is used by Source Preview, the existing Extension view and the Bridge. A failed test uses a validated same-Spec assertion location/stack frame; otherwise it falls back to the recorded definition. Passed and skipped tests use their exact test IDs and definition positions. A changed source/dirty buffer or missing historical hash is clearly reported; historical line numbers are not claimed to have been remapped to changed code. Deleted/out-of-bound sources fail without creating a file.

Opening code never saves, reverts or closes a dirty/untitled document. Existing source tabs/groups are reused; clean preview tabs can be replaced through normal VS Code behavior. History/Explorer selections are unchanged. If multiple valid windows exist, a new Dashboard requires an explicit destination. A disconnected chosen window is never silently replaced by another. The status-bar ID identifies otherwise identical project windows. Dashboard Source Preview remains independent when no Bridge is available.

This is a boundary against browser requests, other projects and accidental wrong-window routing; it is not a boundary against malicious native programs running as the same Windows user, a compromised Extension host or administrator.

## Build and automated validation

From the repository root (all test projects are synthetic):

```powershell
node --test --test-concurrency=1 tools/test-studio/test/*.test.cjs
node tools/test-studio/test/bridge-browser.cjs
node tools/test-studio/test/run-bridge-vscode.cjs "C:\Users\Barsa\Code.exe"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\tools\test-studio\package.ps1
```

PowerShell users can enumerate the `.test.cjs` files explicitly if their Node version does not expand the wildcard. Existing Browser/Webview and Extension Host harnesses remain under `test`. The two-window harness launches separate isolated VS Code profiles against one temporary project, verifies actual editor state through authenticated HTTP and exits its own hosts normally. It never runs the real project's tests or loads its Config.

The VSIX contains the Extension bridge, shared source helper and required native Windows identity/ACL helpers. The Standalone Service and Launcher continue running from repository source. Launcher protocol 2 and the minimum safe execution-client version 0.3.0 remain unchanged; Bridge requires Extension 0.4.0. No new shortcut is required.

## Install and accept on two monitors

1. Save your work only if you choose to; installation/reload follows normal VS Code behavior. Install `tools/test-studio/playwright-test-studio-0.4.0.vsix` via **Extensions → … → Install from VSIX…** in the intended profile, then **Developer: Reload Window**.
2. Open the intended repository as a trusted local VS Code workspace on monitor one. Wait for `Studio Bridge #xxxxxx` in its status bar. Clicking it shows the project and full window identity. **Playwright Test Studio: Bridge Reconnect** retries registration if needed.
3. If a Service from before the upgrade is still running, use its **Stop Service** button while no Discovery/Run is active, then reopen the existing Desktop shortcut. Closing a tab alone does not restart the Service. Never delete locks/descriptors or kill an unknown process to upgrade.
4. Keep the Dashboard on monitor two. Its VS Code Bridge section should list the matching window ID. If multiple trusted windows have the same project open, choose the exact ID shown on monitor one. Different projects must not appear.
5. Select an existing History test and click **Open in VS Code**. Check the failed assertion or passed/skipped definition. For Explorer, use an already-valid Catalog, or explicitly choose Discovery if appropriate; then use the row's **Open in VS Code** button. Discovery imports Config/spec modules; no Run is needed for source acceptance.
6. Check a Persian filename and similar test titles, repeat opening, leave a source tab with an unsaved edit, and open another result. Verify the edit remains dirty and no redundant duplicate source tab appears. Verify both Dashboard selections remain unchanged.
7. Close the chosen fixture/VS Code window normally and retry. The Dashboard must explain the unavailable destination and keep Source Preview usable. Reopen/reconnect, refresh Bridge and explicitly select the new ID. Test a second same-project window to verify routing.

The user deliberately moved 12 real Runs to Trash; these are not restored for acceptance. Use currently available History/Catalog or controlled fixtures. Do not run a Business Test or RestoreSnapshot for this acceptance.

The Bridge opens the source in the selected window's editor. It does not move OS windows between monitors or bypass Windows foreground-focus rules. Physical monitor placement, foreground focus, installed-profile activation and the final visual experience require manual acceptance. Browser/HTTP and two real Extension Hosts cover the automated portion. Remote/WSL/SSH, virtual or untrusted workspaces are outside this Windows-local release.
