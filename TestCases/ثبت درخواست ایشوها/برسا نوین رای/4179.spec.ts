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

test("4179", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('4179');
  await page.getByRole('link', { name: '4179' }).click();
  await expect(page.locator('bsu-ui-tree-grid-view')).toBeVisible();
  await expect(page.locator('bsu-ui-tree-grid-view')).toContainText('عنوان رابطه سلسله مراتبی ‫1‬‫‬‫1.1‬‫1‬‫1.1.1‬‫1.1‬‫1.2‬‫1‬‫2‬‫‬‫2.1‬‫2‬‫2.2‬‫2‬‫2.2.2‬‫2.2‬');
  await page.getByText('‫1‬').first().dblclick();
  await page.getByRole('combobox').click();
  await page.getByRole('button', { name: 'جستجو' }).click();
  await expect(page.locator('bsu-ui-tree-view')).toBeVisible();
});
