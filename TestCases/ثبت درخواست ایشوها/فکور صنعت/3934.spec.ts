import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('ثبت درخواست ایشوها').last().click();
  await page.getByRole('link', { name: '3934' }).last().click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await expect(page.locator('bsu-ly-label')).toContainText('عنوان 1');
  await page.getByTitle('Close').click();
});