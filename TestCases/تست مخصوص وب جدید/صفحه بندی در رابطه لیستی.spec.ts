import { test, expect } from '@playwright/test';
import { loginAs } from '../../framework/auth/auth.service';
import { users } from '../../framework/auth/users';

test.use({
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'صفحه بندی در رابطه لیستی' }).click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('button', { name: 'اضافه به لیست' }).click();
  await page.getByRole('button', { name: 'Page 2' }).click();
  await page.getByRole('button', { name: 'Page 3' }).click();
  await page.getByRole('button', { name: 'Page 1' }).click();
  await expect(page.getByRole('navigation', { name: 'از 1 تا 24 تعداد (50)' })).toBeVisible();
});