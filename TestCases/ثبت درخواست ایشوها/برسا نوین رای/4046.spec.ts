import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 950,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8000/#/login');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'نمایش لیست تصاویر-کامپوننت و بدون کامپوننت' }).last().click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await expect(page.locator('#fd-toolbar-12')).toContainText('دانلود صفحهٔ فعال اسکن پیوست فایل بزرگ‌نمایی صفحهٔ فعال کوچک‌نمایی صفحهٔ فعال چرخش صفحهٔ فعال حذف انتخاب‌شده‌ها حذف همه Negative Action');
});