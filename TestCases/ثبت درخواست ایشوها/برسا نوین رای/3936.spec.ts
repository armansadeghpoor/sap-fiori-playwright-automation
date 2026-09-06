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
  await page.locator('div').filter({ hasText: /^3936$/ }).first().click();
  await page.getByRole('button', { name: 'ریلود کردن فرم' }).click();
  await expect(page.getByText('عنوان:')).toBeVisible();
  await page.getByRole('button', { name: 'ذخیره', exact: true }).click();
  await expect(page.getByText('عنوان:')).toBeVisible();
});