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

test("4303", async ({ page }) => {
  await loginAs(page, users.rahbar);

  // Paste the recorded business actions and assertions here.
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('4303');
  await page.getByRole('link', { name: '4303' }).click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await expect(page.getByRole('combobox', { name: 'Select an Option' })).toContainText('');
  await page.getByPlaceholder('لیستی 2').click();
  await expect(page.locator('bsu-ly-layout-container-of-root')).toBeVisible();
  await expect(page.locator('bsu-ly-layout-container-of-root')).toContainText('عنوان نمایشی:نوع عضویت:جنسیت: تاریخ تولد:تاریخ استخدام:تکی اول:تکی دوم:لیستی 1:لیستی 2:');
});
