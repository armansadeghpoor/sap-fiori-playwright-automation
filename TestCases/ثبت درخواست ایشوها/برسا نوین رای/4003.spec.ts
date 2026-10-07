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
  await page.getByRole('button', { name: 'Navigation' }).click();
  await page.getByText('تست فرآیند', { exact: true }).click();
  await page.getByText('اجرای فرآیندها').click();
  await page.getByText('انجام فرم-حالت عدم دسترسی-نمای فعالیت جاری فرم').click();
  const notifBadge = page.getByLabel('Notification Label');
  await expect(notifBadge).toHaveText('2');
  await page.getByRole('button', { name: 'تایید' }).click();
  await expect(notifBadge).toHaveText('1');
});