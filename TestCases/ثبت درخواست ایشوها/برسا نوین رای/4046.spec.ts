import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 950,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'نمایش لیست تصاویر-کامپوننت و بدون کامپوننت' }).last().click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await expect(page.locator('#fd-toolbar-12')).toContainText('دانلود صفحهٔ فعال اسکن پیوست فایل بزرگ‌نمایی صفحهٔ فعال کوچک‌نمایی صفحهٔ فعال چرخش صفحهٔ فعال حذف انتخاب‌شده‌ها حذف همه Negative Action');
});