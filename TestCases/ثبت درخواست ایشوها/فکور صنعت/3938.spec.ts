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
  await page.getByRole('button', { name: 'ورود' }).click();
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('پورتال برسانوین‌رای').click();
  await expect(page.locator('fd-icon.sap-icon--hello-world')).toBeVisible();
});