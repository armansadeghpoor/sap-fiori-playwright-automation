import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto('http://localhost:8000/#/login');
  await page.waitForTimeout(2000);
  await page.reload();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  const mainMenuButton = page.locator('button.fd-shellbar__button--menu');
  await mainMenuButton.click();
  await page.locator('a').filter({ hasText: 'کارتابل' }).click();
  await page.locator('i[ulvcontextmenu] button:has(.sap-icon--overflow)').first().click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.locator('input.fd-input.is-compact[type="text"]').click();
  await page.locator('input.fd-input.is-compact[type="text"]').fill('تست');
  await page.getByRole('button', { name: 'ذخیره', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'تست' })).toBeVisible();
});