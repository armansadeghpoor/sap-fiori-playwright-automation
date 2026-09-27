import { test, expect } from '@playwright/test';
import { loginAs } from '../../framework/auth/auth.service';
import { users } from '../../framework/auth/users';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 950,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'فیلد شرط در بازه زمانی' }).click();
  await expect(page.getByRole('button', { name: 'از', exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'تا' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'تا' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'از' })).toBeVisible();
});