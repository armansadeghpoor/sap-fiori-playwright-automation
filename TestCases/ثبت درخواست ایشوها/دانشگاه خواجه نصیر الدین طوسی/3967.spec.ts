import { test, expect } from '@playwright/test';
import { restoreSnapshot } from '../../../framework/api/environment.api';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  const mainMenuButton = page.locator('button.fd-shellbar__button--menu');
  await mainMenuButton.click();
  await page.locator('a').filter({ hasText: 'کارتابل' }).click();
  await page.locator('i[ulvcontextmenu] button:has(.sap-icon--overflow)').first().click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.locator('input.fd-input.is-compact[type="text"]').click();
  await page.locator('input.fd-input.is-compact[type="text"]').fill('تست');
  await page.getByRole('button', { name: 'ذخیره', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'تست' })).toBeVisible();
});