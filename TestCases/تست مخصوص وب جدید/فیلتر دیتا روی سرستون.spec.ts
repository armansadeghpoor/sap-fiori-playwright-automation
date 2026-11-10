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

test("فیلتر دیتا روی سرستون", async ({ page }) => {
  await loginAs(page, users.rahbar);

  // Paste the recorded business actions and assertions here.
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'تست مخصوص وب جدید سناریو برای بخش های مختلف وب جدید' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('فیلتر دیتا روی سرستون');
  await page.getByRole('link', { name: 'فیلتر دیتا روی سرستون' }).click();
  await page.getByRole('button', { name: 'فیلتر نام', exact: true }).click();
  await page.getByRole('textbox', { name: 'مقدار' }).click();
  await page.getByRole('textbox', { name: 'مقدار' }).fill('علی');
  await page.getByRole('button', { name: 'اعمال' }).click();
  await expect(page.locator('bsu-ui-table-view')).toContainText('نام نام خانوادگی عنوان نمایشی ‫علی‬‫علوی‬‫علی علوی‬');
  await page.getByRole('button', { name: 'فیلتر نام', exact: true }).click();
  await page.getByRole('button', { name: 'پاک‌کردن', exact: true }).click();
  await expect(page.locator('bsu-ui-table-view')).toContainText('نام نام خانوادگی عنوان نمایشی ‫علی‬‫علوی‬‫علی علوی‬‫رضا‬‫رضوی‬‫رضا رضوی‬‫حسن‬‫حسنی‬‫حسن حسنی‬');
  await page.getByRole('button', { name: 'فیلتر نام خانوادگی' }).click();
  const selectButton = page.locator(
    'fd-select[aria-label="عملگر"] span.fd-select__button'
  );
  await selectButton.click();
  await page.getByRole('option', { name: 'شامل نیست' }).click();
  await page.getByRole('textbox', { name: 'مقدار' }).click();
  await page.getByRole('textbox', { name: 'مقدار' }).fill('علوی');
  await page.getByRole('button', { name: 'اعمال' }).click();
  await expect(page.locator('bsu-ui-table-view')).toContainText('نام نام خانوادگی عنوان نمایشی ‫رضا‬‫رضوی‬‫رضا رضوی‬‫حسن‬‫حسنی‬‫حسن حسنی‬');
});
