import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['Pixel 7'],
  storageState: 'localstorage.json'
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
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Navigation' }).click();
  await page.locator('li[data-name="تست مخصوص وب جدید"]').click();
  await page.getByRole('link', { name: 'پریدن صفحه بندی بعد از رفرش' }).click();
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('dialog')).toContainText('بازآوریگردش کار چند انتخابی گروه بندی مرتب سازی ستون ها');
  await page.getByRole('button', { name: 'چند انتخابی' }).click();
  await page.locator('.tw-flex > .ng-untouched > .fd-checkbox__label > .fd-checkbox__checkmark').first().click();
});