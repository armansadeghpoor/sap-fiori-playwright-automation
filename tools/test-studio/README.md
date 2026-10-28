# Playwright Test Studio

## نسخهٔ پیشنهادی 0.2.3 — بازکردن کد کنار Dashboard

برای نصب، `playwright-test-studio-0.2.3.vsix` را از Install from VSIX نصب و
VS Code را در صورت درخواست Reload کنید. قالب آرشیو و رفتار اجرایی نسخهٔ 0.2.0 حفظ شده است.

روی ردیف هر تست در Failure Details کلیک کنید: جزئیات انتخاب و همان Spec در Editor
اصلی کنار Sidebar باز می‌شود. دکمهٔ «باز کردن کد» با Tab و Enter/Space هم قابل استفاده
است. Checkbox اجرای مجدد، Report و Artifactها مستقل‌اند و کد را باز نمی‌کنند.

برای Failed، خط خطای معتبرِ همان Spec انتخاب می‌شود؛ در نبود آن، خط تعریف تستِ همان
شناسه از Run استفاده می‌شود. خط خارج از Spec یا نامعتبر به خط تعریف برمی‌گردد. اگر
خط تعریف هم دیگر وجود نداشته باشد، ابتدای فایل با توضیح نمایش داده می‌شود. Passed و
Skipped نیز قابل بازکردن‌اند. این رفتار هیچ تستی را اجرا یا ذخیره نمی‌کند.

پنل فقط شناسهٔ Run و تست را ارسال می‌کند، نه مسیر یا شمارهٔ خط. Extension مسیر را از
Manifest همان Run می‌گیرد و مسیر مطلق و واقعی را داخل TestCases این Workspace بررسی
می‌کند؛ مسیر بیرونی، junction بیرونی، فایل حذف‌شده یا شناسهٔ نامعتبر خطای خوانا می‌دهد.
فایل جابه‌جاشده با جست‌وجوی نام یا حدس به فایل دیگری نگاشت نمی‌شود.

از `workspace.openTextDocument` و `window.showTextDocument` با `preview: true` و
`preserveFocus: true` استفاده می‌شود. Editor مجاور Sidebar دوباره استفاده می‌شود؛
در هر کلیک Split جدید ساخته نمی‌شود. فایل ویرایش‌شده ذخیره یا بسته نمی‌شود. اگر کاربر
Preview را در تنظیمات VS Code غیرفعال کرده باشد، تنظیم کاربر اولویت دارد.
[API رسمی Preview و Focus](https://code.visualstudio.com/api/references/vscode-api#TextDocumentShowOptions)

تغییر hash فایل یا وجود ویرایش ذخیره‌نشده با هشدار در پنل مشخص می‌شود؛ فایل فعلی باز
می‌شود، نه نسخهٔ تاریخی Git. شمارهٔ خط تاریخی ممکن است پس از ویرایش جابه‌جا شده باشد.
برای Run قدیمی بدون sourceHash، عدم امکان تأیید تطابق نسخه اعلام می‌شود. History بدون
بازنویسی یا Migration خوانده می‌شود.

Acceptance روی سیستم اصلی: یک Run قبلی را انتخاب کنید، روی Failed و سپس Passed/Skipped
کلیک کنید و خط انتخاب‌شده را ببینید؛ تست دوم باید در همان ناحیه باز شود. Checkbox را
تغییر دهید و مطمئن شوید Editor عوض نمی‌شود. یک Spec را بدون ذخیره ویرایش و تست دیگری
را باز کنید؛ ویرایش باید باقی بماند. هشدار اختلاف نسخه و ثابت‌ماندن History را بررسی کنید.

```powershell
node --test tools/test-studio/test/regression-source.test.cjs
node tools/test-studio/test/run-vscode.cjs "C:\Users\Barsa\AppData\Local\Programs\Microsoft VS Code\Code.exe" tools/test-studio/test/regression-source-vscode.cjs
```

نام فایل بدون `.spec.ts` عنوان اصلی سناریوهاست. عنوان کامل Playwright در صورت مفیدبودن
یا وجود چند تست در یک Spec زیر آن می‌آید. Project، مسیر اصلی و شناسهٔ واقعی تست در Details
قابل دسترسی‌اند. این نام‌گذاری فقط نمایشی است و هویت یا Matching تست را تغییر نمی‌دهد.

Current Run در Idle یک نوار Ready فشرده است. هنگام اجرا آمار و Progress باز می‌شوند و
پس از اتمام، Summary باقی می‌ماند. بازگشت به Idle خلاصهٔ آخرین نتیجه را به‌شکل فشرده
حفظ می‌کند. انتخاب Run تاریخی مستقل از این تغییر وضعیت است.

در Recovery اجرای رهاشده، تستی که Host آن بسته شده نیز Interrupted نمایش داده می‌شود؛
این اصلاح فقط در خواندن journal اعمال می‌شود و دادهٔ آرشیو را بازنویسی نمی‌کند.

بخش‌های انتخاب تست، کنترل اجرا، اجرای جاری، History و جزئیات خطا جدا هستند. در عرض باریک
زیر هم و از عرض 700px به بالا کنار هم قرار می‌گیرند. فهرست‌ها اسکرول داخلی ندارند؛ برای
تاریخچه یا فهرست طولانی از «نمایش موارد بیشتر» استفاده می‌شود. این نمایش تدریجی، مجموعهٔ
تست‌های انتخاب‌شده را عوض نمی‌کند؛ «انتخاب همه» همچنان تمام مجموعه را انتخاب می‌کند.

Run انتخاب‌شده با Border و وضعیت مشخص است. عنوان کوتاه، زمان و مدت نمایش داده می‌شوند؛
UUID کامل در Tooltip و «مشخصات Run» قابل دسترسی است. انتخاب Run تاریخی هنگام به‌روزرسانی
اجرای جاری حفظ می‌شود. انتخاب تست برای دیدن خطا از Checkbox اجرای مجدد جداست؛ خطا، محل،
Screenshot/Video/Trace و Stack بازشدنی در بخش جزئیات نمایش داده می‌شوند.

رنگ‌ها از Theme Variables رسمی VS Code می‌آیند و وضعیت‌ها هم آیکون و هم متن دارند.
Dark/Light، Focus کیبورد، مسیرهای LTR در RTL و متن طولانی با Webview آزمایشی بررسی شده‌اند.
تصاویر این بررسی از همان HTML/CSS با دادهٔ نمونه و دو پالت VS Code تولید می‌شوند؛ این فاز
نمای Webview فعلی را بهبود می‌دهد و تب Editor یا فرمان اجرایی جدیدی اضافه نمی‌کند.

```powershell
node tools/test-studio/test/regression-webview.cjs
```

مسیر اختیاری خروجی تصاویر را می‌توان به‌عنوان آرگومان دوم به این دستور داد.

## Regression Execution Manager — نسخهٔ 0.2.0

پس از نصب `playwright-test-studio-0.2.3.vsix` از **Install from VSIX…** و Reload،
روی آیکون Playwright Test Studio کلیک کنید و نمای **Regression Execution Manager**
را باز کنید. نمای «ساخت تست جدید» همچنان برای Recorder و Generator قبلی است.

1. محدودهٔ «پوشه» را انتخاب کنید و با «مرور…» پوشه‌ای داخل `TestCases` را انتخاب
   کنید. مسیر را می‌توانید نسبت به TestCases هم بنویسید؛ خالی یعنی خود TestCases.
2. برای اجرای Headed، «نمایش مرورگر (Show Browser)» را فعال کنید و «اجرای تست‌ها»
   را بزنید. همهٔ تست‌های انتخاب‌شده در یک اجرای Runner و با یک Worker اجرا می‌شوند.
   فایل‌های انتخابی باز و ذخیره‌نشده در VS Code، قبل از Discovery ذخیره می‌شوند.
3. اگر فایل‌های انتخابی دارای ارجاع مستقیم به RestoreSnapshot باشند، تأیید می‌گیرید.
   Manager خودش Snapshot اضافی اجرا نمی‌کند؛ Setup خود Spec اجرا می‌شود. تشخیص متنی
   ممکن است comment را هم تشخیص دهد و reset پنهان‌شده در helper غیرمستقیم را پیدا نکند.
4. نوار پیشرفت، شمار نتایج و تست جاری در پنل دیده می‌شوند. «توقف اجرا» Process Tree
   همان عملیات را می‌بندد؛ نتایج کامل‌شده و گزارش‌های Runهای گذشته حفظ می‌شوند.
5. در Run History روی اجرای موردنظر کلیک کنید. نتیجهٔ هر تست، مدت، Attempt، خطا و
   پیوست‌های موجود قابل مشاهده‌اند. Report با سرور محلی رسمی Playwright باز می‌شود؛
   Terminal مربوط به Report را پس از استفاده ببندید. Trace نیز با Trace Viewer رسمی
   باز می‌شود و Screenshot/Video با viewer مربوط در VS Code باز می‌شوند.
6. «اجرای مجدد Failedها» فقط Failedهای نهایی همان Run را انتخاب می‌کند. پیش‌فرض اجرای
   مجدد، مرورگر باز است. برای «اجرای مجدد انتخاب‌ها» کنار تست‌های دلخواه تیک بزنید.
   هر بار Run جدید با ارجاع به والد ساخته می‌شود؛ نتیجهٔ والد بازنویسی نمی‌شود.
7. برای انتخاب چند تست پیش از اولین اجرا، «شناسایی تست‌ها و تعداد Suite» را بزنید،
   بخش «انتخاب تست‌ها از فهرست Suite» را باز کنید و تست‌ها را انتخاب کنید. محدوده‌های
   «فایل Spec» و «کل Suite» هم در فرم در دسترس‌اند.

آرشیو محلی در `.playwright-studio/runs/<run-id>/` و خارج از `test-results` قرار دارد.
Manifest، رویدادهای افزایشی، Summary، stdout/stderr کامل، HTML/JSON Report و پیوست‌ها
جدا نگهداری می‌شوند. فایل نهایی هر Run فقط یک بار ساخته می‌شود. هیچ سیاست حذف خودکار
وجود ندارد؛ فضای آرشیو را در نظر بگیرید. تغییرات ظاهر Test Explorer و پاک‌سازی خروجی
پیش‌فرض Playwright این آرشیو را پاک نمی‌کنند. Runهای نسخهٔ 0.1.2 به این تاریخچه وارد
نمی‌شوند. حتی پس از Reload، نتیجهٔ Runهای پایان‌یافته از روی دیسک بارگذاری می‌شود.

Regression از CLI و Reporter API عمومی Playwright پروژه استفاده می‌کند؛ config عمومی
ویرایش نمی‌شود. Overrideهای مختص این اجرا: یک Worker، `retries=0`، `--no-deps`،
`--forbid-only`، `--trace=retain-on-failure`، `--update-snapshots=none` و Reporterهای
line/JSON/HTML/Studio با مسیرهای مستقل. تنظیمات اختصاصی داخل Spec، از جمله ایجاد
Persistent Context و چند Page یا چند کاربر، بازنویسی نمی‌شوند. تعداد Attemptها و
Expected Failureها جدا ثبت می‌شوند؛ Passed در Retry با نشان Flaky دیده می‌شود.

نمایش مرورگر فقط Headed را فعال می‌کند و Context Reuse افزونهٔ رسمی VS Code را فعال
نمی‌کند. Context استاندارد هر تست تازه است و ممکن است پنجره بین تست‌ها یا بعد از
Worker Restart تغییر کند. ثبات یک پنجرهٔ فیزیکی تضمین نمی‌شود. State اولیهٔ تعریف‌شده
در storageState همچنان طبق Spec/config اعمال می‌شود؛ استقلال مرورگر، Backend مشترک
را بازنشانی نمی‌کند. به‌ویژه تست‌های Persistent، Contextهای دستی و `page.pause()`
رفتار خودشان را حفظ می‌کنند و ممکن است پنجرهٔ اضافی یا انتظار دستی داشته باشند.

Runها با قفل مشترک Studio از Recorder و اجرای قبلی جلوگیری می‌کنند؛ اجرای مستقیم
CLI یا Test Explorer این قفل را رعایت نمی‌کند. هم‌زمان علیه همان محیط اجرا نکنید.
روی Windows توقف فعلی اجباری است؛ ممکن است HTML یا Video اجرای متوقف‌شده ناقص باشد.
رویدادهای کاملِ ذخیره‌شده قابل بازیابی‌اند و موارد اجرا‌نشده Skipped محسوب نمی‌شوند.
توقف در مرحلهٔ Discovery ممکن است هنوز Run جدیدی ایجاد نکرده باشد.

Rerun با Discovery تازه و Test List رسمی انجام می‌شود. تست حذف‌شده یا تغییرنام‌یافته
باعث توقف انتخاب می‌شود؛ هرگز به اجرای کل Suite تبدیل نمی‌شود. تغییر کد با عنوان ثابت
مجاز است و در metadata فرزند مشخص می‌شود. عنوان‌های دارای جداکنندهٔ `›` پشتیبانی
نمی‌شوند. اگر Test List یک تست را با suite همنام اشتباه بگیرد، تطبیق شناسه‌های واقعی
قبل از شروع test body اجرا را متوقف می‌کند. این محدودیت به‌وضوح در Run ناقص ثبت می‌شود.

Validation مربوط به Regression (فقط پروژه‌های موقت، بدون API برنامه):

```powershell
node --test tools/test-studio/test/regression.test.cjs
node tools/test-studio/test/regression-webview.cjs
node tools/test-studio/test/regression-report.cjs
node tools/test-studio/test/run-vscode.cjs "C:\Users\Barsa\AppData\Local\Programs\Microsoft VS Code\Code.exe" tools/test-studio/test/regression-vscode.cjs
node tools/test-studio/test/run-vscode.cjs "C:\Users\Barsa\AppData\Local\Programs\Microsoft VS Code\Code.exe" tools/test-studio/test/regression-vscode.cjs tools/test-studio/test/regression-reload-vscode.cjs
```

A local VS Code sidebar for this repository's existing `tools/new-test.cjs` and
`tools/recorder/launch.cjs`. No runtime dependencies, cloud account, telemetry,
credentials, storage-state files, global Playwright changes, or npm installation.
Node.js, project dependencies, Google Chrome and the application/API must already
be available, just as for the existing recorder.

## نصب و استفاده

1. پوشهٔ اصلی `D:\NewWeb UiTest` را در VS Code باز کنید.
2. فقط برای نصب اولیه، بخش Extensions را با `Ctrl+Shift+X` باز کنید. منوی سه‌نقطه ←
   **Install from VSIX…** را بزنید و فایل
   `tools/test-studio/playwright-test-studio-0.2.3.vsix` را انتخاب کنید.
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

The packager uses the built-in .NET ZIP API and an explicit source-file allowlist.
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

The restart check launches two separate Extension Hosts against one temporary
workspace/profile. It verifies sealed parent/child history, interrupted test recovery
without rewriting journals, and actual artifact opening after restart. The report
check renders a real built-in HTML report and retrieves its attachment over loopback.

Sources: [VS Code Webview API](https://code.visualstudio.com/api/extension-guides/webview),
[View contributions](https://code.visualstudio.com/api/references/contribution-points#contributes.viewsContainers),
[Install from VSIX](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#_install-from-a-vsix).
