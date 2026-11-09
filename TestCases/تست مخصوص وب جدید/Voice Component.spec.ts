import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
import { recordingDevices } from "../../framework/config/recording-devices";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("Voice Component", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'تست مخصوص وب جدید سناریو برای بخش های مختلف وب جدید' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('voice');
  await page.getByRole('link', { name: 'کامپوننت voice' }).click();
  await page.getByRole('button', { name: 'جدید', exact: true }).click();
  await page.getByRole('button', { name: 'شروع ضبط صدا' }).click();
  await expect(page.getByRole('button', { name: 'شروع ضبط صدا' })).toBeVisible();
});
