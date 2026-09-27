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
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page.getByRole('link', { name: '3919' }).last().click();
  await page.getByText('‫*حذف نشود*‬').dblclick();
  await page.locator('fd-icon.sap-icon--navigation-down-arrow').first().click();
  await expect(page.getByText('تست 1', { exact: true })).toBeVisible();
  await page.locator('fd-icon.sap-icon--navigation-down-arrow').last().click();
  await expect(page.getByText('تست 1', { exact: true })).toBeVisible();
});