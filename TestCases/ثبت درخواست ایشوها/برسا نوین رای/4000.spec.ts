import { test, expect } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 980,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.locator('#cdk-overlay-1').getByText('ثبت درخواست ایشوها').click();
  await page.getByRole('link', { name: '4000' }).last().click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'جستجو' }).last().click();
  await expect(page.getByRole('link', { name: '‫تست 1‬' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: '‫تست 24‬' })).toBeVisible();
  await expect(page.getByText('موضوع:')).toBeVisible();
  await expect(page.getByRole('button', { name: 'جستجو' }).last()).toBeVisible();
});