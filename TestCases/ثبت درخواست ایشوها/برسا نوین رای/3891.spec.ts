import { test, expect, devices } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  ...devices['Pixel 7'],
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole('tab', { name: 'تست موبایل-تایل default' }).click();
  await page.getByRole('heading', { name: '3891' }).click();
  await page.getByText('*حذف نشود*').dblclick();
  await expect(page.getByRole('button', { name: 'بیشتر' })).toBeVisible();
});