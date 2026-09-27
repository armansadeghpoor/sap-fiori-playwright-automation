import { test, expect, devices } from '@playwright/test';
import { loginAs } from '../../framework/auth/auth.service';
import { users } from '../../framework/auth/users';

test.use({
  ...devices['Pixel 7'],
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Navigation' }).click();
  await page.getByRole('link', { name: 'کارتابل وارده تفکیکی' }).click();
  await page.getByRole('button', { name: 'دستورات' }).click();
  await expect(page.locator('fd-dialog-body')).toContainText('پیام و پوشهعملیات راهبر');
  await page.getByRole('menuitem', { name: 'پیام و پوشه' }).locator('fd-menu-addon').click();
  await expect(page.getByRole('menuitem', { name: 'پیام جدید پیام جدید' })).toBeVisible();
});