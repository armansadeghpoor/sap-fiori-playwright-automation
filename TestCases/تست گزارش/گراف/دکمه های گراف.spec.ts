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
  await page.getByText('تست گزارش').click();
  await page.getByRole('link', { name: 'گزارش از نوع گراف' }).last().click();
  await expect(page.getByText('چپ به راستراست به چپپایین به بالابالا یه پایین')).toBeVisible();
  await page.getByRole('button', { name: 'چپ به راست' }).click();
  await page.getByRole('button', { name: 'راست به چپ' }).click();
  await page.getByRole('button', { name: 'پایین به بالا' }).click();
  await page.getByRole('button', { name: 'بالا یه پایین' }).click();
});