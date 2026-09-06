import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 1080,
    width: 1920
  }
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
  await page.locator('fd-icon.sap-icon--supplier').click();
  await page.getByRole('link', { name: '3982' }).last().click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await expect(page.locator('button[glyph="download"]')).toBeVisible();
  await expect(page.locator('button[glyph="delete"]')).toBeVisible();
  const page1Promise = page.waitForEvent('popup');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('button[glyph="download"]').click();
  const page1 = await page1Promise;
  const download = await downloadPromise;
  await page.getByRole('button', { name: 'لیست تصاویر (2).tiff' }).click();
  await page.locator('button:has(.sap-icon--resize)').click();
  await page.getByRole('button', { name: 'close', exact: true }).click();
  await page.getByRole('button', { name: 'لیست تصاویر (2).tiff' }).click();
});