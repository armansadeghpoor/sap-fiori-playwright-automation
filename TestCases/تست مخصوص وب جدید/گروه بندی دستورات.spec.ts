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
  await page.getByText('تست ابزار', { exact: true }).click();
  await page.locator('#headerCollapse').click();
  await expect(page.getByText('منو 2 گروهبندی دستور 4 گروه 1 گروه')).toBeVisible();
  await page.getByRole('button', { name: 'منو' }).click();
  await page.locator('a').filter({ hasText: 'گروه بندی دستور' }).click();
  await expect(page.locator('fd-dialog-body')).toContainText('گروه بندی دستور 3');
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.locator('span.fd-shellbar__button', { hasText: 'گروهبندی دستور 4' }).click();
  await expect(page.locator('fd-dialog-body')).toContainText('گروهبندی دستور 4');
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.getByRole('button', { name: 'گروه 1' }).click();
  await expect(page.getByText('منو 1', { exact: true })).toBeVisible();
  await page.locator('fd-menu-addon').click();
  await expect(page.locator('a').filter({ hasText: 'گروه بندی دستور' })).toBeVisible();

});