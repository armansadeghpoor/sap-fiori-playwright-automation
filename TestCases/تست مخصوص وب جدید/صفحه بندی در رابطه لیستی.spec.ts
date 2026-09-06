import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json'
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
  await page.getByRole('button', { name: 'Product Switch' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'صفحه بندی در رابطه لیستی' }).click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('button', { name: 'اضافه به لیست' }).click();
  await page.getByRole('button', { name: 'Page 2' }).click();
  await page.getByRole('button', { name: 'Page 3' }).click();
  await page.getByRole('button', { name: 'Page 1' }).click();
  await expect(page.getByRole('navigation', { name: 'از 1 تا 24 تعداد (50)' })).toBeVisible();
});