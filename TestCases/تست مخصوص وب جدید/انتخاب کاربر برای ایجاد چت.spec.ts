import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto('http://localhost:8000/#/login');
  await page.waitForTimeout(2000);
  await page.reload();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.waitForTimeout(500);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'گفتگو' }).click();
  await page.getByTitle('اضافه کردن مخاطب').click();
  await page.getByText('‫کاربر2‬').first().click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await expect(page.getByText('کاربر2')).toBeVisible();
  await page.getByText('کاربر2').click();
  await page.locator('textarea').click();
});