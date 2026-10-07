import { test, expect } from '@playwright/test';
import { restoreSnapshot } from '../../framework/api/environment.api';
import { loginAs } from '../../framework/auth/auth.service';
import { users } from '../../framework/auth/users';

test.use({
  storageState: 'localstorage.json'
});

test('test', async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.waitForTimeout(500);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'گفتگو' }).click();
  await page.getByTitle('اضافه کردن مخاطب').click();
  await page.getByText('‫کاربر2‬').first().click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await expect(page.getByText('کاربر2')).toBeVisible();
  await page.getByText('کاربر2').click();
  await page.locator('textarea').click();
});