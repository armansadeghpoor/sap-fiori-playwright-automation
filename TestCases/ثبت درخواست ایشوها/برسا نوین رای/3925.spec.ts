import { test, expect, devices } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';
test.setTimeout(60000);
test.use({
  ...devices['Pixel 7'],
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: 'Navigation' }).click();
  await page.locator('li[data-name="ثبت درخواست ایشوها"] a').click();
  await page.getByRole('link', { name: '3925' }).last().click();
  await page.getByRole('button', { name: 'جزئیات' }).nth(0).click();
  await expect(page.getByRole('cell', { name: 'عنوان: تست 1 تعداد: 1' })).toBeVisible();
  await page.getByRole('button', { name: 'جزئیات' }).nth(0).click();
  await expect(page.getByRole('cell', { name: 'عنوان: تست 2 تعداد: 2' })).toBeVisible();
  await page.getByRole('button', { name: 'جزئیات' }).nth(0).click();
});