import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('div').filter({ hasText: /^3936$/ }).first().click();
  await page.getByRole('button', { name: 'ریلود کردن فرم' }).click();
  await expect(page.getByText('عنوان:')).toBeVisible();
  await page.getByRole('button', { name: 'ذخیره', exact: true }).click();
  await expect(page.getByText('عنوان:')).toBeVisible();
});