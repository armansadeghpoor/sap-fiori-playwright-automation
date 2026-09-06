import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 980,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8000/#/login');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.locator('#cdk-overlay-1').getByText('ثبت درخواست ایشوها').click();
  await page.getByRole('link', { name: '4000' }).last().click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'جستجو' }).last().click();
  await expect(page.getByRole('link', { name: '‫تست 1‬' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: '‫تست 24‬' })).toBeVisible();
  await expect(page.getByText('موضوع:')).toBeVisible();
  await expect(page.getByRole('button', { name: 'جستجو' }).last()).toBeVisible();
});