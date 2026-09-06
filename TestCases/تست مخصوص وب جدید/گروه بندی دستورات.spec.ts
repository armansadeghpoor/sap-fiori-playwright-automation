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
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'Product Switch' }).click();
  await page.getByText('تست ابزار', { exact: true }).click();
  await page.locator('#headerCollapse').click();
  await expect(page.getByText('منو 2 گروهبندی دستور 4 گروه 1 گروه')).toBeVisible();
  await page.getByRole('button', { name: 'منو' }).click();
  await page.locator('a').filter({ hasText: 'گروه بندی دستور' }).click();
  await expect(page.locator('fd-dialog-body')).toContainText('گروه بندی دستور 3');
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.locator('span.fd-shellbar__button', { hasText: 'گروهبندی دستور 4' }).click();
  await expect(page.locator('fd-dialog-body')).toContainText('گروهبندی دستور 4');
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.getByRole('button', { name: 'گروه 1' }).click();
  await expect(page.getByText('منو 1', { exact: true })).toBeVisible();
  await page.locator('fd-menu-addon').click();
  await expect(page.locator('a').filter({ hasText: 'گروه بندی دستور' })).toBeVisible();

});