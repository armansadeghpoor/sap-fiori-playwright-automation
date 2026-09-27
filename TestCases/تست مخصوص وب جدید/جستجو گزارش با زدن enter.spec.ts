import { test, expect } from '@playwright/test';
import { loginAs } from '../../framework/auth/auth.service';
import { users } from '../../framework/auth/users';

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
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('تست شرط گزارش').click();
  await page.getByRole('link', { name: 'شرط گزارش-پیشفرض جدید' }).click();
  await page.locator('bsu-ui-num-int-ui').getByRole('textbox').click();
  await page.locator('bsu-ui-num-int-ui').getByRole('textbox').press('Enter');
  await expect(page.locator('bsu-ui-table-view')).toContainText('عنوان تعداد رابطه تکی کاربر تاریخ ‫تست 1‬‫‪1‬‫تست1‬‫کاربر1‬‫1404/01/24 ‬‫‬‫‬‫‬‫‬‫‬');
});