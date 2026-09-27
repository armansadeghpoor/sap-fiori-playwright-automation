import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 950,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
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