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
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('ثبت درخواست ایشوها').last().click();
  await page.getByRole('link', { name: '4072' }).last().click();
  await expect(page.getByRole('img', { name: 'object icon' })).toBeVisible();
  await expect(page.locator('bsu-barsa-table-row')).toMatchAriaSnapshot(`
    - img
    - text: ‫تست 1‬
    `);
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await expect(page.getByRole('option', { name: 'object icon تست 1' })).toBeVisible();
});