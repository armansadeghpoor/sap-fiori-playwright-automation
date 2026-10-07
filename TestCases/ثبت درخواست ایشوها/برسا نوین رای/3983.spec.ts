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
  await page.getByRole('heading', { name: 'مدیریت نوتیفیکیشن' }).click();
  const notifBadge = page.getByLabel('Notification Label');
  await page.waitForTimeout(4000);
  await expect(notifBadge).toHaveText('2');
  await page.getByRole('button', { name: 'Notification Label' }).click();
  await page.getByRole('button', { name: 'امروز', exact: true }).click();
  await page.locator('button:has(.sap-icon--delete)').first().click();
  await page.waitForTimeout(1000);
  await page.locator('button:has(.sap-icon--delete)').first().click();
  await expect(notifBadge).not.toBeVisible();
});