import { test, expect, devices } from '@playwright/test';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  ...devices['Pixel 7'],
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Navigation' }).click();
  await page.locator('li[data-name="تست مخصوص وب جدید"]').click();
  await page.getByRole('link', { name: 'پریدن صفحه بندی بعد از رفرش' }).click();
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('dialog')).toContainText('بازآوریگردش کار چند انتخابی گروه بندی مرتب سازی ستون ها');
  await page.getByRole('button', { name: 'چند انتخابی' }).click();
  await page.locator('.tw-flex > .ng-untouched > .fd-checkbox__label > .fd-checkbox__checkmark').first().click();
});