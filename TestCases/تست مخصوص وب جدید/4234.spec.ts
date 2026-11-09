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

test("4234", async ({ page }) => {
  await loginAs(page, users.rahbar);

  // Paste the recorded business actions and assertions here.
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('4234');
  await page.getByRole('link', { name: '4234' }).click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('combobox').click();
  await page.getByRole('combobox').fill('1.1');
  await page.getByRole('combobox').press('ArrowDown');
  await page.getByRole('option', { name: 'object icon 1.1', exact: true }).press('ArrowDown');
  await page.getByRole('option', { name: 'object icon 1.1.1' }).press('Enter');
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await expect(page.locator('bsu-barsa-table-row')).toContainText('‫1.1.1‬');
  await page.getByRole('link', { name: '‫‬' }).click();
  await page.getByRole('button', { name: 'حذف' }).click();
  await page.getByRole('button', { name: 'بله' }).click();
});
