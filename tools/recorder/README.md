# New Playwright Test

For a persistent graphical sidebar, install the local **Playwright Test Studio**
extension described in [its guide](../test-studio/README.md). Its Activity Bar icon
opens one form with a validated full output path, Snapshot confirmation, and inline
Recorder diagnostics. The existing Task and CLI workflow below remain available.

Open this repository in VS Code, then choose **Terminal > Run Task > New Playwright
Test**. Enter a test name and a folder (or explicit `.spec.ts` path) inside
`TestCases`, then select the user, device, and Snapshot mode.

The task creates a new spec with correct relative imports, the selected device
options, a fresh browser storage state, and the matching login/setup calls. It
then launches the Recorder using those same selections. After login, start
recording in Playwright Inspector if necessary, perform only business actions,
stop recording, copy the generated actions/assertions, and paste them at the
comment in the new spec. Review the locators and assertions before running it.

Snapshot mode **Enabled** calls RestoreSnapshot before login and changes the
test environment. The task asks about this explicitly, and the Recorder prints
a warning before invoking the API.

## Command-line workflow

The generator also works without VS Code:

```powershell
npm run new:test -- --name "نام تست" --path "پوشه/زیرپوشه" --user=user1 --device=pixel-7 --snapshot=disabled
```

Use `--snapshot=enabled` only when the test needs the environment reset.
`--path` is relative to `TestCases`; a leading `TestCases/` is accepted.
You may provide an explicit filename ending in `.spec.ts`. The generator
creates missing parent folders but never overwrites an existing spec. Add
`--no-record` to create the spec without opening the Recorder.

## Recorder shortcuts

The six existing npm scripts launch the Recorder without creating a spec.
They use `rahbar` by default; append `-- --user=user2` to select another user.
The Recorder signs in using the existing `loginAs` helper and never records
credentials or writes a storage-state file.

```powershell
npm run record
npm run record:mobile
npm run record:iphone
```

These commands log in without restoring the snapshot. When you decide the test
needs a restore, run its matching snapshot script:

```powershell
npm run record:snapshot
npm run record:mobile:snapshot
npm run record:iphone:snapshot
```

All six shortcuts remain in VS Code's NPM Scripts view.

The terminal prints `snapshot=on` or `snapshot=off` before starting. Snapshot
restore happens before login only when it is on.

Valid users are `rahbar`, `user1`, `user2`, and `kartable`.

- `record` uses a 1920 x 950 desktop viewport.
- `record:mobile` emulates a Pixel 7.
- `record:iphone` emulates an iPhone 15 Pro Max.
- All three use the installed Google Chrome channel. The mobile commands emulate
  the selected device; they do not run a real mobile browser or Safari.

Generated specs call `loginAs(page, users.<profile>)`. They call
`restoreSnapshot(request)` only when enabled. Device settings come from
`framework/config/recording-devices.ts`, shared with the Recorder. The
iPhone option emulates that device in Chrome; it does not run Safari.

## Limits

`page.pause()` exposes codegen controls for an already configured and authenticated
page, but it does not provide an API that writes the recorded actions into a
production spec. The copy-and-paste step is intentional. Review the generated
locators and assertions before keeping them.

The standalone `playwright codegen` command cannot attach to this recorder's page.
Using it would create a different browser context and would require repeating login
or transferring authentication state.

To validate the recorder wiring without opening a browser or calling the application:

```powershell
npm run record -- --check
```
