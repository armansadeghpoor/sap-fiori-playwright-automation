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
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'Product Switch' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'گزارش نمای تقویمی' }).click();
  await expect(page.locator('bc-calendar-container')).toContainText('ش');
  await expect(page.getByRole('columnheader', { name: 'ش' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'ی' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'د' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'س' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'چ' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'پ' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'ج' }).nth(1)).toBeVisible();
});