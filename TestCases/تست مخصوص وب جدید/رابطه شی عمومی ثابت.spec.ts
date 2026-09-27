import { test, expect } from '@playwright/test';
import { loginAs } from '../../framework/auth/auth.service';
import { users } from '../../framework/auth/users';

test.use({
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'رابطه شی عمومی ثابت' }).click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('combobox', { name: 'Select an Option' }).click();
  await page.locator('span').filter({ hasText: 'موجویت مقصد تستی برای روابط' }).nth(1).click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.getByLabel('جستجو').click();
  await expect(page.locator('a').filter({ hasText: '‫تست1‬' })).toBeVisible();
  await page.getByRole('button', { name: 'close' }).last().click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.getByText('تست2', { exact: true }).click();
  await expect(page.locator('fd-layout-grid')).toContainText('عنوان:رابطه: موجویت مقصد تستی برای روابط');
  await page.waitForTimeout(500);
  await page.getByRole('combobox', { name: 'Select an Option' }).click();
  await page.locator('span').filter({ hasText: 'پریدن صفحه بندی بعد از رفرش' }).nth(2).click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.getByLabel('جستجو').click();
  await expect(page.locator('a').filter({ hasText: '‫تست 1‬' })).toBeVisible();
  await page.getByRole('button', { name: 'close' }).last().click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.getByText('تست 3').click();
  await expect(page.locator('fd-layout-grid')).toContainText('عنوان:رابطه: پریدن صفحه بندی بعد از رفرش');
  await page.getByTitle('Close').click();
  await page.getByRole('button', { name: 'خیر', exact: true }).click();
});