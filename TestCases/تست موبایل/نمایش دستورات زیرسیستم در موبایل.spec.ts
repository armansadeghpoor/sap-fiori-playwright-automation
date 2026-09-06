import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['Pixel 7'],
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8000/#/login');
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('راهبر');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).click();
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('button', { name: 'ورود' }).click();
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Navigation' }).click();
  await page.getByRole('link', { name: 'کارتابل وارده تفکیکی' }).click();
  await page.getByRole('button', { name: 'دستورات' }).click();
  await expect(page.locator('fd-dialog-body')).toContainText('پیام و پوشهعملیات راهبر');
  await page.getByRole('menuitem', { name: 'پیام و پوشه' }).locator('fd-menu-addon').click();
  await expect(page.getByRole('menuitem', { name: 'پیام جدید پیام جدید' })).toBeVisible();
});