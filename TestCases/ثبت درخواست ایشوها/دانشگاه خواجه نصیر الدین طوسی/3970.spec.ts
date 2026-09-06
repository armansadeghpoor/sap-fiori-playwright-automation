import { test, expect } from '@playwright/test';
import { ADDRGETNETWORKPARAMS } from 'dns';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto('http://localhost:8000/#/login');
  await page.waitForTimeout(2000);
  await page.reload()
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('link', { name: 'کارتابل وارده تفکیکی' }).click();
  await page.getByText('تمامی سمتهای من').click();
  await page.locator('button:has(.sap-icon--overflow)').first().click();
  await page.getByRole('button', { name: 'حذف پیام' }).click();
  await page.getByRole('button', { name: 'بله' }).click();
  await expect(page.locator('bsu-ui-list-view li')).toHaveCount(2);
});