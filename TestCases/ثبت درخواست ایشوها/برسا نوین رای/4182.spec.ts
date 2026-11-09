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

test("4182", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('4179');
  await page.getByRole('link', { name: '4179' }).click();
  await page.getByRole('searchbox', { name: 'filter' }).click();
  await page.getByRole('searchbox', { name: 'filter' }).fill('2.2.2');
  await expect(page.locator('bsu-ui-tree-grid-view')).toContainText('عنوان رابطه سلسله مراتبی ‫2‬‫‬‫2.2‬‫2‬‫2.2.2‬‫2.2‬');
});
