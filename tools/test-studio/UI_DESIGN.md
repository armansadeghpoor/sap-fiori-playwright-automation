# 0.5.0 — Hybrid Developer Command Center

Manual visual acceptance succeeded in the user environment: refresh, both themes, collapsible navigation, expanded Inspector/Escape, Source Preview/Artifacts/Open in VS Code, and Summary/History. Version 0.5.0 is the accepted visual release.

## References and scope

- [Minimal Professional](https://designs.magicpath.ai/v1/gladly-coast-2731), pinned revision 467550632803463169: hierarchy, spacing and restraint.
- [Developer Command Center](https://designs.magicpath.ai/v1/solidly-village-9756), pinned revision 467550640571318273: navigation and technical identity.

These are visual references only. No prototype code, sample counts, remote canvas edits, new API, or framework was introduced.

## Tokens

All stylesheet custom properties use `--ps-`. Dark and Light override the same semantic color tokens: background, surface, raised/input surfaces, border, text/muted/subtle, accent/text/solid/on-accent, selection, running/passed/failed/warning/skipped, overlay, shadow and focus. Shared tokens define typography, spacing (4/8/12/16/20/24/32), radii (6/8/12/pill), focus ring and motion (120/160ms). Reduced motion removes transitions. System fonts provide offline fallback; no external font requests.

Dark uses the approved #0B0F14 background, #151E2B panels, #8176F6 identity, #5295FF running, #32C58E passed, #F06472 failed, #29364A borders and #E6EDF7 text. Light uses darker status and accent text for readability. Primary button text is dark on violet in Dark, white on a darker violet in Light.

## Layout and semantics

- Product/workspace header, actual service and Bridge connection state, theme, refresh, Stop Service and version.
- Collapsible navigation links to existing sections and moves keyboard focus. It does not execute operations. Collapse and theme preferences are local browser settings.
- Four summary cards describe the selected historical Run: Total Tests, Passed, Failed, Skipped. Run identity and duration are explicit. Catalog counts remain in Explorer. Active SSE progress remains in Execution and never overwrites the historical summary.
- Wide screens: Explorer | Execution, selected results and History | Diagnostics. Below 1390px Diagnostics spans the workspace; below 900px panels stack. At 390px navigation becomes a compact horizontal row.
- The expanded native-dialog Inspector moves the existing DOM node, preserving selection, source and handlers. Escape/Close restores it and keyboard focus. Nothing is cloned.
- Persian content is RTL/auto; the application grid and code/path containers are LTR. Code remains text-only, numbered and read-only.
- Bounded tree, history and result lists scroll independently; sensitive action controls remain outside those lists. Confirmations and eligible/disabled states retain existing behavior.

## Preserved contracts

All 81 original static DOM IDs and their handlers remain. The baseline audit also records dynamic listeners and referenced IDs from all seven web scripts. Existing endpoints, mutation bodies, tokens, native confirmations, request sequencing and SSE cursor logic are unchanged. JavaScript changes only add status decoration, selected-run summary, theme/navigation/drawer presentation and real progress visualization.

Runner, RegressionManager, discovery/identity, authentication/session/CSRF/origin security, execution lifecycle, history schema, Trash/Restore, Bridge protocol, Source Resolver, bootstrap, stream-model and explorer-model remain byte-identical to 0.4.0. Backend routes and asset allowlist are unchanged.

## Validation and packaging

`node tools/test-studio/test/redesign-browser.cjs` creates a temporary synthetic project, performs fixture-only discovery, captures Dark/Light at 1600/1440/1100/800/390 and checks selected-run scope, overflow, same-node drawer state, focus, navigation, reduced motion, unique IDs and unchanged fixture history. Set `STUDIO_VISUAL_OUTPUT` to choose the capture folder. `--before` is for capturing the previous UI before replacement; it skips redesign-specific assertions.

The existing 99 Node tests and Browser, Webview and Extension Host harnesses remain the behavioral regression gate. No business test or actual project discovery is part of validation. Browser execution harnesses run only their controlled synthetic tests.

The release VSIX is 0.5.0, with UI_DESIGN.md added to the explicit package allowlist. Extension runtime remains compatible with 0.4.0. Standalone web assets are served from this repository, not bundled by the existing extension packaging contract. Installing the VSIX alone does not deploy the Standalone redesign; the installed extension is not automatically replaced.

## Manual acceptance

Open the existing Playwright Test Studio shortcut, refresh the Dashboard, review both themes, collapse navigation and expand/close Diagnostics. Check Persian and English readability, selected-state clarity and comfortable panel sizing on the actual monitor. Use existing archived results to inspect source and Open in VS Code. Do not start Discovery, a Run or Snapshot restoration merely to review the appearance. Final visual approval is a user decision, separate from automated fixture validation.


## Observed validation risk

During preview validation, the Bridge reconnect test once reported disconnected after starting its second host. Eight isolated checks and the subsequent full 99-test run passed; the original cause remains unknown. Release validation must recheck it and retain this observation even if it does not recur. No timeout, assertion or Backend behavior is weakened for release.
