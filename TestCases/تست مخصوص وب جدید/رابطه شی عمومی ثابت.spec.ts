import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8000/#/login');

  // فرآیند لاگین
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'Product Switch' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'رابطه شی عمومی ثابت' }).click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('combobox', { name: 'Select an Option' }).click();
  await page.locator('span').filter({ hasText: 'موجویت مقصد تستی برای روابط' }).nth(1).click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.getByLabel('جستجو').click();
  await expect(page.locator('a').filter({ hasText: '‫تست1‬' })).toBeVisible();
  await page.getByRole('button', { name: 'close' }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.getByText('تست2', { exact: true }).click();
  await expect(page.locator('fd-layout-grid')).toContainText('عنوان:رابطه: موجویت مقصد تستی برای روابط');
  await page.waitForTimeout(500);
  await page.getByRole('combobox', { name: 'Select an Option' }).click();
  await page.locator('span').filter({ hasText: 'پریدن صفحه بندی بعد از رفرش' }).nth(2).click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.getByLabel('جستجو').click();
  await expect(page.locator('a').filter({ hasText: '‫تست 1‬' })).toBeVisible();
  await page.getByRole('button', { name: 'close' }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.getByText('تست 3').click();
  await expect(page.locator('fd-layout-grid')).toContainText('عنوان:رابطه: پریدن صفحه بندی بعد از رفرش');
  await page.getByTitle('Close').click();
  await page.getByRole('button', { name: 'خیر', exact: true }).click();
});