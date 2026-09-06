import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto("http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot");
  await page.goto('http://localhost:8000/#/login');
  await page.waitForTimeout(2000);
  await page.reload();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.getByRole('heading', { name: 'مدیریت نوتیفیکیشن' }).click();
  const notifBadge = page.getByLabel('Notification Label');
  await page.waitForTimeout(4000);
  await expect(notifBadge).toHaveText('2');
  await page.getByRole('button', { name: 'Notification Label' }).click();
  await page.getByRole('button', { name: 'امروز', exact: true }).click();
  await page.locator('button:has(.sap-icon--delete)').first().click();
  await page.waitForTimeout(1000);
  await page.locator('button:has(.sap-icon--delete)').first().click();
  await expect(notifBadge).not.toBeVisible();
});