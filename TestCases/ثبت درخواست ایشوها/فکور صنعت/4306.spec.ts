import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
import { recordingDevices } from "../../../framework/config/recording-devices";
import { restoreSnapshot } from "../../../framework/api/environment.api";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("4306", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);

  // Paste the recorded business actions and assertions here.
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('4306');
  await page.getByRole('link', { name: '4306' }).click();
  await page.locator('a').filter({ hasText: '‫حذف نشود‬' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'حذف نشود' }).fill('تست');
  await page.getByRole('textbox', { name: 'تست' }).press('Enter');
  await expect(page.getByText('شامل تست نباشد')).toBeVisible();
  await page.locator('a').filter({ hasText: '‫تست‬' }).click();
  await page.getByRole('button', { name: 'ویرایش' }).click();
  await page.getByRole('textbox', { name: 'تست' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'تست' }).fill('وب');
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await expect(page.locator('bsu-ui-table-view')).toContainText('عنوان تعداد');
});
