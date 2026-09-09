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
  await page.getByText('تست گزارش').click();
  await page.getByRole('link', { name: 'گزارش از نوع گراف' }).last().click();
  await expect(page.getByText('چپ به راستراست به چپپایین به بالابالا یه پایین')).toBeVisible();
  await page.getByRole('button', { name: 'چپ به راست' }).click();
  await page.getByRole('button', { name: 'راست به چپ' }).click();
  await page.getByRole('button', { name: 'پایین به بالا' }).click();
  await page.getByRole('button', { name: 'بالا یه پایین' }).click();
});