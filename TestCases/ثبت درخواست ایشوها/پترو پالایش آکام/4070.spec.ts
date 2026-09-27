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
  await loginAs(page, users.kartable);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('link', { name: 'کارتابل وارده تفکیکی' }).click();
  await expect(page.getByText('تمامی سمتهای من (12)')).toBeVisible();
  await expect(page.getByText('منشی ایشو 4070 (کارتابل) (1)')).toBeVisible();
  const targetItem = page.locator('#fd-list-item-39 > div:nth-child(2) > div > .fd-list__title > .ellapsis');
  await targetItem.scrollIntoViewIfNeeded();
  await expect(targetItem).toBeVisible();
});
