import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.locator('li[data-name="تست مخصوص وب جدید"]').click();
  await page.getByRole('link', { name: 'نمایش لیست تصاویر-کامپوننت و بدون کامپوننت' }).click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await expect(page.getByRole('button', { name: 'بزرگ‌نمایی صفحهٔ فعال' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'کوچک‌نمایی صفحهٔ فعال' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'چرخش صفحهٔ فعال' })).toBeVisible();
});