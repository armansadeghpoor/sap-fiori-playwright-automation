import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
import { recordingDevices } from "../../../framework/config/recording-devices";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("4307", async ({ page }) => {
  await loginAs(page, users.rahbar);

  // Paste the recorded business actions and assertions here.
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'تست شرط گزارش اجرای شرط های متفاوت بر روی گزارشات' }).click();
  await page.getByRole('link', { name: 'شرط گزارش-پیشفرض جدید' }).click();
  await expect(page.getByText('جستجو Default Action پاک کردن')).toBeVisible();
  await expect(
  page.getByText('جستجو Default Action پاک کردن')
).toHaveCSS('justify-content', 'end');
});
