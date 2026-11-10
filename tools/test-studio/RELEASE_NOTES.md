# Playwright Test Studio v0.6.0

Studio baseline following successful user manual acceptance and final fixture validation. Regression Execution Manager, Recorder and New Test Generator remain active. No UI retirement is included.

## Included behavior

* Persistent Open in VS Code tabs (`preview:false`), existing-tab reuse, dirty/untitled preservation, Persian paths, exact line/column and explicit same-project window targeting.
* Open HTML Report, recorded Trace Viewer and Archive Folder through the authenticated native Bridge; ZIP download remains separate. Viewers use isolated validated artifact copies and fixed Playwright CLI argument arrays.
* Actual operation-scoped Discovery cancellation, with previous committed Catalog/revision/selection preserved after owned cleanup; cancellation differs from failure.
* Dirty selected specs block execution in connected registered windows; no silent save/discard. Initial unavailable Bridge requires explicit saved-disk-only confirmation. Loss after verified inspection and partial/incompatible connected checks block execution. Execution and Snapshot confirmations remain independent.
* Actual stdout/stderr in Dashboard with known-credential/pattern redaction, bounded lines/tail and existing SSE backpressure/reconnect behavior. All recorded attempts expose retry/status/duration/errors/stack.
* Approved UI Polish clarifies Planned Tests versus recorded outcomes, preserves technical LTR/error copy order, and compacts Idle panels while retaining critical messages/controls. Persian/English Recorder metadata and VSIX UTF-8 regression tests are included.
* Fixed `test is not defined` after deleting the last selected Run: the misplaced attempt renderer was removed and old display/Rerun state is cleared. Permanent fixture browser coverage includes last/non-last deletion, empty History, stale display cleanup and caught/transient errors/unhandled rejections.

## Known feature gaps

1. **Historical Rerun after Source changes**: strict historical identity/source and complete guards remain. Fresh Discovery/new selection is available but does not reproduce the legacy changed-source historical lineage workflow.
2. **Custom Node.js configuration in Standalone**: Service executes with its own Node runtime. VS Code's configured nodePath is not a standalone runtime preference.

Neither gap is implemented or bypassed in this release. Workers remain fixed at 1 and retries at 0. Report/Trace/archive actions require a compatible selected Bridge; Source Preview/download remain independent. Dirty checks cannot atomically lock edits or certify unregistered editors/unsaved imported helpers.

## Security and operational notes

Loopback-only access, session authentication, exact Host/Origin, CSRF, workspace trust, native process/project identity, private registration and path/symlink validation are retained. Browser requests accept typed IDs rather than arbitrary paths or shell commands. Native Viewer copies are private, bounded and isolated from original workspace/History files. Close their owned terminals normally; asynchronous bounded Windows cleanup retries handle the terminal cwd lock. Unknown processes/locks are never adopted or killed for recovery.

CLI redaction handles known runtime/environment credentials and common token/password formats; arbitrary unlabeled secrets printed by a test cannot be inferred universally. Do not print such values. Raw local archives and legacy UI behavior are unchanged. Native HTML/ZIP viewing is not a malware sandbox against a malicious same-user process.

The historical intermittent Bridge reconnect failure remains an open risk with unknown original cause. It was not reproduced in the preceding validation; fresh release results are recorded separately. Passing reconnect checks do not establish that historical root cause.

## Validation and packaging

Release gates include the complete Studio Node suite, Browser/Webview harnesses, permanent last-Run selection regression, isolated real Extension Hosts, Bridge, Reporter/History/Trash, security and actual report/trace rendering on synthetic artifacts. No real customer Business Test, real RestoreSnapshot or real-project Discovery is used. The final VSIX is rebuilt from approved 0.6.0 source, checked against the explicit package allowlist and exercised in isolated Hosts. The real installed profile is not changed by release preparation.

Standalone Service and web assets run from repository source. The VSIX retains Regression Manager, Recorder, New Test Generator and Bridge. Launcher protocol 2 and native Bridge protocol 1 with explicit editor/artifact capabilities remain compatible. A connected older Bridge without the required editor inspection capability blocks execution rather than being reported as verified.
