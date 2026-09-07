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
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('ثبت درخواست ایشوها').last().click();
  await page.getByRole('link', { name: '3960' }).last().click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await expect(page.getByRole('button', { name: 'فیلد دکمه فرم بصورت کارت تست وب فیلد دکمه فرم بصورت کارت bdc-ui-card-button' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'پترو پالایش آکام' })).toBeVisible();
  await expect(page.locator('bdc-ui-card-button').first()).toContainText('تست وب');
  await expect(page.locator('bdc-ui-card-button').first()).toContainText('شروعپایان');
  await expect(page.locator('bdc-ui-card-button').first()).toContainText('فیلد دکمه فرم بصورت کارتbdc-ui-card-button‹');
  await page.getByRole('button', { name: 'فیلد دکمه فرم بصورت کارت تست وب فیلد دکمه فرم بصورت کارت bdc-ui-card-button' }).click();
  await page.getByText('نمایش پیغام').click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.getByRole('button', { name: 'پترو پالایش آکام' }).click();
});