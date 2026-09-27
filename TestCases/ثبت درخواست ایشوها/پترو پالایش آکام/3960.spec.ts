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
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('ثبت درخواست ایشوها').last().click();
  await page.getByRole('link', { name: '3960' }).last().click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await expect(page.getByRole('button', { name: 'فیلد دکمه فرم بصورت کارت تست وب فیلد دکمه فرم بصورت کارت bdc-ui-card-button' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'پترو پالایش آکام' })).toBeVisible();
  await expect(page.locator('bdc-ui-card-button').first()).toContainText('تست وب');
  await expect(page.locator('bdc-ui-card-button').first()).toContainText('شروعپایان');
  await expect(page.locator('bdc-ui-card-button').first()).toContainText('فیلد دکمه فرم بصورت کارتbdc-ui-card-button‹');
  await page.getByRole('button', { name: 'فیلد دکمه فرم بصورت کارت تست وب فیلد دکمه فرم بصورت کارت bdc-ui-card-button' }).click();
  await page.getByText('نمایش پیغام').click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.getByRole('button', { name: 'پترو پالایش آکام' }).click();
});