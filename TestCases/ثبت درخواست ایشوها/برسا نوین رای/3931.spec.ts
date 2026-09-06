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
  await page.getByRole('button', { name: 'Navigation' }).click();
  await page.getByText('تست فرآیند', { exact: true }).click();
  await page.getByText('متغیر گردش').click();
  await page.getByText('فرم- ویرایش فرم-نمای پیشفرض').click();
  await page.waitForTimeout(1000);
  await page.locator('button:has(.sap-icon--navigation-left-arrow)').first().click();
  await page.waitForTimeout(700);
  await page.getByTitle('Close').click();
  await page.getByTitle('گردش کار').click();
  await page.locator('bsu-ui-table-view').click();
  await expect(page.getByRole('cell', { name: '‫نمایش فرم‬' }).nth(1)).toHaveCSS('color', 'rgb(19, 30, 41)');
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'تنظیمات' }).click();
  await page.locator('span:has(.sap-icon--slim-arrow-down)').first().click();
  await page.getByText('sap_fiori_3_dark').click();
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await page.reload();
  await expect(page.getByRole('cell', { name: '‫نمایش فرم‬' }).nth(1)).toHaveCSS('color', 'rgb(0, 0, 0)');
});