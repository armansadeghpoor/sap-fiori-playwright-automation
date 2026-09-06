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
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('راهبر');
  await page.locator('input[type="text"]').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'Product Switch' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'قابلیت ویرایش در لیست' }).click();
  await page.locator('a').filter({ hasText: '‫علی‬' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'ویرایش', description: 'ویرایش' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await expect(page.getByRole('option', { name: 'object icon تست1 ‪1' })).toBeVisible();
  await expect(page.locator('ul.fdp-combobox__list li[fd-list-item]').first()).toContainText('تست1 ‪1 ستون اضافه اول:تست ستون ها در نمایش گزارش رابطه تکی در وب جدید ستون اضافه دوم:‪123,456,789,789,456,123');
  await expect(page.getByRole('option', { name: 'object icon تست2 ‪2' })).toBeVisible();
  await expect(page.locator('ul.fdp-combobox__list li[fd-list-item]').nth(1)).toContainText('تست2 ‪2 ستون اضافه اول:تست ستون ها در نمایش گزارش رابطه تکی در وب جدید ستون اضافه دوم:‪123,456,789,789,456,123');
});