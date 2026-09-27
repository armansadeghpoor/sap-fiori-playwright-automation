import { test, expect, devices } from '@playwright/test';
import { loginAs } from '../../framework/auth/auth.service';
import { users } from '../../framework/auth/users';

test.use({
  ...devices['Pixel 7'],
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'Navigation' }).click();
  await page.locator('fd-icon.fs-7.sap-icon--lab').click();
  // await page.getByTitle('سیستم تست وب جدید').click();
  await page.getByRole('link', { name: 'تست نما Wizard' }).click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await expect(page.getByText('قبلیبعدی')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Wizard' }).getByRole('toolbar')).toBeVisible();
  await page.getByRole('button', { name: 'arrow left' }).click();
  await expect(page.getByText('تاریخ شروع:')).toBeVisible();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'arrow left' }).click();
  await expect(page.getByText('محل برگزاری:')).toBeVisible();
});