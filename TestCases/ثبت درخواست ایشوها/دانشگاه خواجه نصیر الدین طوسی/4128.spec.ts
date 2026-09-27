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
  await page.getByRole('link', { name: 'کارتابل وارده تفکیکی' }).click();
  await page.getByText('تمامی سمتهای من').click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'تنظیمات' }).click();
  await page.locator('.sap-icon.sap-icon--checklist').click();
  await page.getByRole('option', { name: 'موضوع: *حذف نشود3*' }).locator('label').click();
  await expect(page.getByRole('button', { name: 'undefined' })).toBeVisible();
});