import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./TestCases",

  /* اجرای تست‌های داخل یک فایل به ترتیب (جلوگیری از تداخل) */
  fullyParallel: false,

  forbidOnly: !!process.env.CI,
  retries: 0,

  /* محدود کردن کارگرها برای پایداری کامل سیستم. در صورت نیاز می‌توانید به 2 افزایش دهید */
  workers: 1,

  reporter: "html",

  use: {
    storageState: "localstorage.json",
    trace: "on-first-retry",
    viewport: null,

    launchOptions: {
      args: ['--start-maximized']
    },

    /* ضبط ویدیو فقط در صورت شکست تست برای جلوگیری از اشغال فضای هارد و پردازنده */
    video: {
      mode: 'retain-on-failure',
      size: { width: 1920, height: 1080 }
    },

    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: 'Google Chrome',
      use: {
        channel: 'chrome',
      },
    },
  ],
});