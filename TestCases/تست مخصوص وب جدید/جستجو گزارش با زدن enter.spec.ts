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
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('راهبر');
  await page.locator('input[type="text"]').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'Product Switch' }).click();
  await page.getByText('تست شرط گزارش').click();
  await page.getByRole('link', { name: 'شرط گزارش-پیشفرض جدید' }).click();
  await page.locator('bsu-ui-num-int-ui').getByRole('textbox').click();
  await page.locator('bsu-ui-num-int-ui').getByRole('textbox').press('Enter');
  await expect(page.locator('bsu-ui-table-view')).toContainText('عنوان تعداد رابطه تکی کاربر تاریخ ‫تست 1‬‫‪1‬‫تست1‬‫کاربر1‬‫1404/01/24 ‬‫‬‫‬‫‬‫‬‫‬');
});