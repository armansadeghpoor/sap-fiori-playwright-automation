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
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'گزارش نمای تقویمی' }).click();
  await expect(page.locator('bc-calendar-container')).toContainText('ش');
  await expect(page.getByRole('columnheader', { name: 'ش' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'ی' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'د' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'س' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'چ' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'پ' }).nth(1)).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'ج' }).nth(1)).toBeVisible();
});