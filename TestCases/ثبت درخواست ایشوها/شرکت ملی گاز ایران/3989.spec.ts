import { test, expect } from '@playwright/test';

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
  await page.reload();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').click();
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').fill('راهبر');
  await page.locator('bsu-layout-control').filter({ hasText: 'نام کاربری*' }).getByRole('textbox').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.locator('li:nth-child(19) > .mini-nav-item > a').click();
  await page.getByRole('link', { name: '3989' }).last().click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await expect(page.locator('#LayoutItem_7 fd-dynamic-page-content')).toBeVisible();
  await expect(page.locator('fdp-icon-tab-bar-tab-content')).toContainText('جدید بولین درست نادرست درست نادرست');
  await page.locator('a').filter({ hasText: 'نادرست' }).nth(1).click();
  await page.locator('fd-checkbox[title="بولین"] label').click();
  await page.getByTitle('ویرایش در لیست', { exact: true }).click();
  await expect(page.locator('fdp-icon-tab-bar-tab-content')).toContainText('جدید بولین درست جزئیات نادرست جزئیات درست جزئیات درست جزئیات');
  await page.locator('.fd-col.fd-col--12').click();
});