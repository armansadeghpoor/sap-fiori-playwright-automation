# Playwright Test Studio

A local VS Code sidebar for this repository's existing `tools/new-test.cjs` and
`tools/recorder/launch.cjs`. No runtime dependencies, cloud account, telemetry,
credentials, storage-state files, global Playwright changes, or npm installation.
Node.js, project dependencies, Google Chrome and the application/API must already
be available, just as for the existing recorder.

## نصب و استفاده

1. پوشهٔ اصلی `D:\NewWeb UiTest` را در VS Code باز کنید.
2. فقط برای نصب اولیه، بخش Extensions را با `Ctrl+Shift+X` باز کنید. منوی سه‌نقطه ←
   **Install from VSIX…** را بزنید و فایل
   `tools/test-studio/playwright-test-studio-0.1.2.vsix` را انتخاب کنید.
   اگر VS Code درخواست Reload داد، آن را انجام دهید.
3. روی آیکون پنجره و دکمهٔ پخش با نام **Playwright Test Studio** در Activity Bar کلیک کنید.
   اگر Activity Bar مخفی است، از View → Appearance → Activity Bar آن را نمایش دهید.
   Workspace باید Trusted باشد چون ابزارهای پروژه اجرا می‌شوند.
4. نام تست، پوشه، کاربر و دستگاه را انتخاب کنید. برای پوشهٔ مقصد، «مرور پوشه…» را
   بزنید و پوشه‌ای درون `TestCases` انتخاب کنید. مسیر نسبی خودکار در فرم قرار می‌گیرد؛
   انتخاب خود `TestCases`، ورودی پوشه را خالی می‌کند. لغو پنجره، مسیر فعلی را حفظ می‌کند.
   برای ساخت پوشهٔ جدید می‌توانید نامش را مثل `NewTests` یا `Code/Form` تایپ کنید.
   مسیر کامل فایل پیش از اجرا در فرم نمایش داده می‌شود.
5. Snapshot اختیاری و پیش‌فرض خاموش است. اگر آن را فعال کنید، قبل از ساخت فایل و
   اجرای Recorder یک تأیید جداگانه می‌بینید؛ لغو تأیید، فایلی ایجاد نمی‌کند.
6. «ساخت تست و شروع ضبط» را بزنید. فایل باز می‌شود و Recorder ورود را انجام می‌دهد.
   در Inspector روی Record بزنید، مراحل business و assertionها را ضبط کنید، سپس کد
   همین مراحل را کپی و در محل مشخص‌شدهٔ فایل تست قرار دهید. فایل را ذخیره کنید.
7. پس از کپی کد، با «پایان ضبط» مرورگر و Inspector را ببندید. این دکمه فایل را حذف
   نمی‌کند. سپس «اجرای همین تست» را بزنید؛ فقط فایل نمایش‌داده‌شده اجرا می‌شود.
8. تغییرات ذخیره‌نشدهٔ همان فایل پیش از اجرا ذخیره می‌شوند. اگر تست دارای Snapshot
   باشد، دوباره تأیید می‌گیرید. نتیجه و خطاها در «جزئیات اجرا» نمایش داده می‌شوند.
   با «توقف اجرای تست» می‌توانید اجرا را متوقف کنید. مسیر فایل‌های نتیجه نیز در پنل
   دیده می‌شود. برای اجرای دوباره نیازی به ساخت فایل جدید ندارید.

نکته: «اجرای همین تست» به آخرین فایل ساخته‌شده با نسخهٔ جدید پنل اشاره دارد، نه فایل
فعال در ویرایشگر. تغییر گزینه‌های فرم روی آن اثر ندارد؛ کاربر، دستگاه و Snapshot از
کد ذخیره‌شدهٔ تست خوانده می‌شوند. اگر فایل را جابه‌جا یا حذف کنید، اجرا با خطای روشن
متوقف می‌شود. در اولین ارتقا، مسیر فایل ساخته‌شده با نسخهٔ قدیمی قابل بازیابی نیست؛
آن فایل را فعلاً با Test Explorer اجرا کنید. فایل را دوباره نسازید.

## Behavior and limits

- The generator owns validation, path resolution, template generation and atomic
  no-overwrite creation. The extension calls its `--preview` and `--json --no-record`
  interfaces, then invokes the existing recorder with separate process arguments
  (`shell: false`). Persian names, spaces and shell metacharacters stay literal.
- The Browse button uses VS Code's native folder dialog. It starts in the current
  valid existing folder, otherwise TestCases. The dialog can navigate elsewhere,
  but the extension rejects selections outside TestCases (including junctions
  resolving outside it), preserves the current input and shows an inline error.
  It does not create directories, reset Snapshot, or start a recording.
- Profiles come from the generator's `--describe` response, which reuses
  `tools/recorder/profiles.cjs`. The mobile options emulate devices in Chrome,
  including iPhone; they do not launch Safari or a real phone.
- Snapshot consent applies to this recording. The generated spec also includes
  RestoreSnapshot when selected, so running that spec later resets the environment.
- Run this test saves only the target document, then invokes the installed local
  Playwright CLI with an escaped, anchored absolute-file regex, `--headed`,
  `--workers=1`, `--reporter=line`, `--no-deps` and a unique output directory under
  `test-results/studio-<id>`. All tests in that file run for matching configured
  projects; project dependency tests are excluded. Normal config hooks still apply.
  No config file is edited, HTML reports are not auto-opened, and previous Studio
  output directories are preserved. Remove old result directories manually as needed.
- The last generated path, workspace root and original Snapshot flag are kept in
  VS Code workspace state. This is metadata, not saved consent or authentication.
  Each run reconfirms Snapshot when originally selected or when `restoreSnapshot`
  appears in the saved source (including comments). This conservative check cannot
  discover resets hidden inside arbitrary renamed/indirect helpers; review test code.
  Cancelling confirmation prevents execution but does not undo the preceding save.
- Running and recording share the busy guard and project lock. The panel supports
  live bounded logs, cancellation, failures and reruns; exit code zero means the
  runner completed successfully, not necessarily that every test ran (check skipped).
- A busy guard and a per-project temporary lock prevent overlapping Studio
  operations, including other VS Code windows. A live orphan recorder keeps its
  lock after an unexpected host crash. Locks from dead owners/recorders are recovered.
  The standalone CLI commands do not acquire this UI lock: do not run them against
  the same mutable environment during a Studio session.
- File creation is final even if opening the editor or recording later fails. The
  panel retains its path and diagnostics; existing files are never overwritten.
  Reopen the file with the panel button. To retry recording without creating a new
  spec, use an existing `npm run record` shortcut with the same options.
- Only harmless form fields use VS Code webview state. Snapshot consent and logs
  are not persisted. Output stays in memory and is displayed as text under a CSP.
- Hiding/showing the sidebar preserves the active session. Closing/reloading VS
  Code ends an owned session; copy recorded code first. Workspace-root changes
  require opening a new window once recording has ended. Multi-root workspaces
  must contain exactly one compatible repository.
- Playwright `page.pause()` exposes recording controls, but no supported public
  API copies the recording into a production spec. Manual copy/paste is intentional.
  [Playwright custom setup](https://playwright.dev/docs/codegen#record-using-custom-setup)

## Build and validate (maintainers)

Package offline using Windows PowerShell or PowerShell 7, from the project root:

```powershell
powershell -NoProfile -File tools/test-studio/package.ps1
node --test tools/test-studio/test/studio.test.cjs
node --test tools/test-studio/test/provider.test.cjs
node tools/test-studio/test/webview.cjs
node tools/test-studio/test/run-vscode.cjs "C:\Users\Barsa\AppData\Local\Programs\Microsoft VS Code\Code.exe"
node tools/recorder/launch.cjs --check
npx playwright test --list --reporter=line
```

The packager uses the built-in .NET ZIP API and an explicit eight-file allowlist.
It never packages workspace tests, auth files, logs, or node_modules. Rebuild and
reinstall the VSIX after changing extension source; do not publish this private
extension to a marketplace. Installing from VSIX is a one-time GUI step; daily
creation/recording requires only the sidebar.

The Node tests use the real generator, fake recorder and real Playwright runner in
temporary fixtures. Pass/fail, exact Persian/regex filenames, cancellation, locks,
stop and retained output are checked without accessing the application or API.
The webview check uses the existing Playwright dependency and headless Chrome with
intercepted local fixture content. The VS Code check launches an isolated profile
and verifies activation, the actual webview ready handshake, generator preview,
file creation, opening the editor, recorder forwarding, no-overwrite, saving a dirty
target document, run confirmation/cancellation and real execution of a harmless spec.
The existing `npm run new:test`, six `record*` commands and VS Code Task remain usable.

Sources: [VS Code Webview API](https://code.visualstudio.com/api/extension-guides/webview),
[View contributions](https://code.visualstudio.com/api/references/contribution-points#contributes.viewsContainers),
[Install from VSIX](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#_install-from-a-vsix).
