import { test, expect } from '@playwright/test';
import { restoreSnapshot } from '../../../framework/api/environment.api';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';
import { ADDRGETNETWORKPARAMS } from 'dns';

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
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('link', { name: 'کارتابل وارده تفکیکی' }).click();
  await page.getByText('تمامی سمتهای من').click();
  await page.locator('button:has(.sap-icon--overflow)').first().click();
  await page.getByRole('button', { name: 'حذف پیام' }).click();
  await page.getByRole('button', { name: 'بله' }).click();
  await expect(page.locator('bsu-ui-list-view li')).toHaveCount(2);
});