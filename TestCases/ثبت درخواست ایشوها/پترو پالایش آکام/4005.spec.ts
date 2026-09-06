import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['Pixel 7'],
  storageState: 'localstorage.json'
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8000/#/login');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('button', { name: 'ورود' }).click();
  await page.getByRole('tab', { name: 'تست موبایل-تایل default' }).click();
  await page.getByRole('heading', { name: '4005' }).last().click();
  await expect(page.getByRole('button', { name: 'نمایش دکمه فرآیندی در مودال' })).toBeVisible();
  await expect(page.getByRole('banner')).toContainText('');
  await expect(page.getByText('عنوان:')).toBeVisible();
});