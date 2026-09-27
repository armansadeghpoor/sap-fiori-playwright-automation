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
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'امکان فریز کردن ستون' }).click();
  const hiddenButton = page.locator('.column__FieldType2.column__عنوان19 > .wrapper > .content');

  // مجبور کردن مرورگر به اسکرول افقی تا رسیدن به این دکمه
  await hiddenButton.scrollIntoViewIfNeeded();

  await hiddenButton.click();
  await expect(page.getByText('عنوان19')).toBeVisible();
  await expect(page.locator('.content').first()).toBeVisible();
  await expect(page.locator('thead')).toContainText('عنوان1');
});