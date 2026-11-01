# Milestone D bugfix — Launcher descriptor recovery

This is a bugfix to the existing Launcher, not a new milestone. The Extension version and VSIX runtime remain 0.3.0; Standalone helpers run from this working tree, so this fix requires no Extension reinstall or shortcut recreation.

## Root cause confirmed

A recognized four-field legacy descriptor (instanceId, pid, port, startedAt) remained after its process ended. It lacked protocolVersion, projectKey and Windows process identity. The previous Launcher rejected its schema before checking whether the process still existed, conflating a live old Service with a dead legacy descriptor.

Read-only OS inspection established absence of the recorded PID, no TCP listener on the recorded port and no project execution/recovery lock. Other IDE processes and incomplete historical Runs were preserved. An incomplete archive does not establish an active process. Recovery now repeats these checks under owned guards and retains the old descriptor bytes.

## State distinctions

| State | Launcher action |
|---|---|
| Valid current descriptor, live matching creation time/executable, matching health endpoint | Reuse the same Instance |
| Valid legacy four-field descriptor, live PID | Refuse; ask the owner to close that identified old Service normally |
| Live PID with a different creation time/executable (PID reuse) | Refuse; preserve descriptor and process |
| Invalid JSON/schema, unknown protocol, unsafe filesystem identity or failed OS inspection | Refuse; manual review |
| Absent PID but port listening/unknown, or execution lock/recovery evidence present | Refuse; preserve all evidence |
| Recognized legacy/current descriptor, PID positively absent, port positively free (or never assigned), no execution evidence | Recheck under owned guards, then retire the descriptor without deleting it |

OS absence is a specific Process.GetProcessById ArgumentException result. Access failure, timeout or inability to inspect identity is **unknown**, never absence. TCP listener enumeration is used; connection timeouts are not interpreted as a free port.

## Recovery transaction

`descriptor.cjs` accepts only the exact historical schema and the current known schema at the canonical project-specific descriptor path. Symlink/junction paths, non-files, oversized files and unavailable file identity are refused. It records file identity and exact bytes, not just a PID.

Recovery takes an exclusive `<descriptor>.control` lease shared with Service claim. It rereads the descriptor, checks the OS process and listener table, and confirms absence of execution-lock evidence. It acquires a **fresh** existing-protocol maintenance lock to exclude Extension/Recorder starts during the final check and rename. Existing/corrupt locks are never removed or adopted. It checks PID/port and file identity again under those guards.

The descriptor is renamed on the same volume to `<descriptor>.stale-<old-instanceId>-<unique-id>.json`; byte and file identity are verified afterwards. The old bytes remain available. A changed or unverifiable result is retained for manual review rather than overwritten or rolled back automatically. Normal release removes only the guard/maintenance records owned by this operation.

Concurrent launchers wait for the descriptor lease, and the Service claim remains exclusive. The child retries a transient busy lease. After retirement, launchers converge on one fresh Instance; subsequent shortcuts reuse it. A crashed control lease with unknown ownership fails closed. No PID is killed by recovery, and no historical Run is used as proof that a process is dead.

This protocol coordinates Studio clients, not malicious native processes under the same Windows account or external tools bypassing the shared lock.

## Browser handoff

The default browser is opened by Windows ShellExecute with normal window visibility. Only an HTTP URL on 127.0.0.1, root path, no query and the existing one-time bootstrap fragment is accepted by `open-browser.ps1`. The hidden helper does not hide the intended browser window and does not log its capability. Session/Origin/CSRF and the existing one-use bootstrap remain intact.

Computer Use could not independently establish the current browser URL during the earlier Windows inspection and ended. That is a visual-verification limitation, not proof of HTTP or recovery failure. No further Windows UI automation is needed for this fix: isolated browser fixtures and independent HTTP checks cover the automated portion; the user retains the final visual check on the real shortcut.

## Manual fallback — never delete evidence blindly

If the launcher refuses recovery, preserve the descriptor, `.control`, execution `.lock` and `.lock.recovery` files named in the message. Do not use a blanket Remove-Item or kill a PID from an old file.

1. For a positively identified live old Service, close it through its own Stop Service control or its original foreground terminal, then reopen the shortcut.
2. For PID reuse or failed identity inspection, identify the current process and its creation time first. Do not terminate it to free the descriptor.
3. For an occupied recorded port, determine its listener independently; an absent old PID alone is insufficient.
4. For invalid/unknown files or orphan control/execution guards, stop and provide the file path plus sanitized metadata for review. Recovery must be separately justified; the launcher intentionally offers no force-delete mode.

## Acceptance after applying this fix

Double-click the **existing Playwright Test Studio shortcut**. No PowerShell command, port lookup, manual descriptor deletion, Extension reinstall or pairing-code entry is required. If the old descriptor is still provably stale, the normal launcher preserves it and opens a fresh Service. If a validated Service is already running, it reuses it.

Verify that the browser visibly shows the Dashboard and Online status, and that a second double-click opens/reuses the same Instance without another Service. Do **not** press Discovery, Run or RestoreSnapshot for this acceptance. Closing the browser should leave Service alive. Stop Service is available when no operation is active.

## Files and validation

Changed existing source: `service/launcher.cjs`, `service/native.cjs`, `service/start.cjs`, `service/README.md`, `test/launcher.test.cjs`.

New source: `service/descriptor.cjs`, `service/process-probe.ps1`, `service/open-browser.ps1`, `test/descriptor.test.cjs`, and this guide.

The focused suite has 12 tests (7 descriptor cases plus 5 launcher cases), including exact legacy/current recognition, invalid schemas, live/unknown identity, PID reuse, blocked ports, existing locks, changed files, junctions, execution exclusion, genuinely ended services, concurrent recovery and repeated shortcuts. The full existing Extension/Execution/Catalog/History/Service suites and isolated browser workflows are also checked after deployment. Runtime files packaged by the VSIX are unchanged; a fresh package is built in the workspace and compared without installing or replacing the existing artifact.

Real Spec, Config, CI, History and Trash fingerprints are compared before and after the work. HEAD remains 859c693 and no Stage, Commit or Push is performed. The final chat report records the actual test totals, preserved-descriptor path and automatic/manual acceptance results.
