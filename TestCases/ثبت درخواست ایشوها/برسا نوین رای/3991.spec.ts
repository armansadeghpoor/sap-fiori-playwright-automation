import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page.getByRole('link', { name: '3991' }).last().click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await expect(page.getByRole('option', { name: 'object icon تست 1 ‪11' })).toBeVisible();
});