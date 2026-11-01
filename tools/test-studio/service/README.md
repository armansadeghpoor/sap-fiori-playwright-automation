> Launcher Recovery bugfix: recognized dead legacy/current descriptors can now be safely retired after repeated OS/process/port checks and fresh execution-lock exclusion. The original bytes are retained; live, reused, invalid and unknown ownership still fail closed. See [recovery guide](../LAUNCHER_RECOVERY.md). This supersedes the earlier blanket refusal of stale descriptors below.

# Standalone Studio — Windows launcher, execution and live progress

Daily entry point: double-click the shortcut created by `../create-shortcut.ps1`. A copy can live anywhere you choose; no Desktop file is created automatically. `../Launch Studio.vbs` is an optional hidden wrapper. The shortcut itself targets Windows PowerShell directly, so it does not depend on VBScript being enabled.

Prerequisites: Windows, Node.js on PATH and a default HTTP browser. No VS Code process, Windows Service, cloud service, dependency install or startup registration is needed. The Extension release for this Service is **0.3.0**; protocol is **2**.

## Start, reuse and stop

Launcher (`launcher.cjs`) canonicalizes its own project root, checks the registered VS Code Extension version, creates/verifies a private Windows directory, and uses the existing secret-free `pw-studio-readonly-<project-hash>.json` descriptor. If absent it starts a detached hidden Node child. The descriptor is claimed exclusively by that child, so concurrent launches converge on one Service. Only explicit loopback `127.0.0.1` and OS-assigned ports are used.

Before reuse, the launcher compares PID, the OS process creation time and executable path, then verifies the HTTP health identity (instanceId, PID, project hash and protocol). A stale, old-schema, mismatched or unresponsive descriptor fails closed. Nothing unknown is deleted, recovered, adopted or killed. Errors appear in a readable Windows dialog rather than a disappearing terminal. Corporate script/application policies and an unavailable Node/browser can block launch; those failures require local review rather than an automatic policy change.

`Stop Service` requires a Session/Origin/CSRF protected POST, explicit confirmation and the exact instanceId. It refuses while Discovery or an owned execution is active. It closes only this instance, streams and descriptor; it never kills external processes. Closing a browser never stops the Service or Run. A crash leaves ownership evidence for manual investigation; do not delete the descriptor, lock or recovery sidecar just to bypass the warning.

## Authentication

There is no reusable launcher token in the descriptor, URL or log. Native and browser authentication use two short-lived single-use steps:

1. The launcher writes a random request/nonce in a private directory under `%LOCALAPPDATA%/PlaywrightTestStudio/<project-hash>`. Windows ACL inheritance is disabled and access is limited to the current account and SYSTEM. Junction/symlink paths are refused. A native POST with no browser Origin/Fetch Metadata and a custom header must match this exact pending request, instanceId and a 15-second timestamp window (with at most 1 second of forward clock tolerance). The request file is consumed before issuing a bootstrap capability.
2. The default browser receives a random 30-second one-use capability in `#bootstrap=...`. Fragments are not sent as HTTP paths. The first local script removes the fragment with history.replaceState before awaiting or redeeming it via same-Origin POST with a custom header. The server consumes it and establishes the existing HttpOnly/SameSite=Strict cookie, CSRF and Session policy. An existing valid cookie is reused to preserve ownership of pending confirmations in other tabs.

The transient capability can briefly be visible to the OS browser handoff/process arguments or browser extensions; that is the unavoidable local secret exchange for opening a default browser without manual pairing. It is not a permanent credential and is never written by Studio to logs, descriptors or browser storage. The request file is private and single-use; an interrupted native request may leave an expired private request file that cannot be redeemed after its validity window. Session cookies use normal browser cookie handling. This is not a boundary against malicious code running as the same Windows account, browser extensions or elevated processes.

Foreground diagnostic startup no longer prints pairing secrets. For automatic login always use the shortcut/launcher. Test harnesses can still use the in-memory pairing interface directly; no project credentials or storageState are created by the launcher.

## Execution and live events

Milestone C's exact ID execution, two independent confirmations, single owner, workers=1, retries=0, new Rerun IDs/Parent relationships, fail-closed Test List preflight and final Reporter guard are preserved. No Runner/Reporter changes were made in D. Selection editing stays disabled during an operation.

`GET /api/events` is authenticated SSE. One Service hub observes the same structured RegressionManager/Journal snapshots; browsers do not create independent runners/reporters. Each event is a full replacement snapshot:

```text
id: <instanceId>:<revision>
event: snapshot
data: {"instanceId":"...","revision":12,"operation":{...}}
```

Revision advances on authoritative state change, not on reconnect. The hub samples the shared state every 250ms, emits a 15-second heartbeat, bounds clients to 32 total / 2 per Session, closes expired sessions, and coalesces slow-client updates to the newest snapshot. Slow streams with prolonged backpressure are closed rather than retaining an unbounded queue. Last-Event-ID never causes old delta replay: every new connection receives the latest full snapshot. Confirmation capabilities are included only for their owning Session.

The browser rejects duplicate/out-of-order revisions and retired instanceIds, retains its last valid snapshot on disconnect, and refreshes History once per completed operation. EventSource reconnects automatically; HTTP `GET /api/execution` remains available for recovery and a 5-second fallback. The existing 5-second Session/connection heartbeat remains. There is no 500ms execution HTTP polling while SSE is healthy. A Service restart may get a different port: existing tabs remain Offline at the old origin; reopen the shortcut for the new verified instance and Session. The new instanceId prevents confusing its revisions with the old instance.

New control APIs:

- `GET /api/health`: secret-free identity only, still subject to Host/Origin/Fetch Metadata checks.
- `POST /api/launcher/bootstrap`: native request-file proof; no browser Origin accepted.
- `POST /api/bootstrap`: one-use browser capability, exact Origin and custom header.
- `GET /api/events`: authenticated SSE.
- `POST /api/service/stop`: Session, Origin, CSRF, explicit confirmation and instanceId.

## Extension compatibility and crash safety

The Extension remains an independent compatible client of the shared lock; it is not silently migrated to remote execution. While Service holds a lock it also holds an owned `<lock>.recovery` marker. The **actual 0.2.3 recovery algorithm** first attempts exclusive creation of that sidecar; it cannot delete/recover the Service lock after a crash because that attempt fails. Both files survive a crash and are preserved. A normal verified release removes only matching owned records. No unknown PID is stopped and no speculative recovery endpoint is provided.

The launcher reads the standard `.vscode/extensions/extensions.json` registration and blocks registered 0.2.x versions with upgrade guidance. Portable/remote/alternative-profile installations may not appear there; the on-disk guard still protects against the original old recovery algorithm. New Extension source also checks project compatibility. Upgrade the VSIX, Reload VS Code, then use the launcher. The legacy VSIX is retained unchanged. See `../README.md` and `../LAUNCHER_RECOVERY.md` for installation, validation and recovery details.

## Validation

All new runs, crashes, descriptors, request files and archives are synthetic; no real project collection, business body, RestoreSnapshot or real History mutation is part of validation. Existing Extension/Catalog/History/Execution tests remain in `../test`. New tests: launcher.test.cjs, events.test.cjs and live-browser.cjs. legacy-studio-0.2.3.cjs is an unmodified test-only copy of commit 859c693's original runtime, never packaged in the VSIX.

Specification reference: https://html.spec.whatwg.org/multipage/server-sent-events.html
