import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json'
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
  await page.getByRole('button', { name: 'Product Switch' }).click();
  await page.locator('#cdk-overlay-1').getByText('ثبت درخواست ایشوها').click();
  await page.getByRole('link', { name: '3953' }).last().click();
  await expect(page.getByText('عنوان', { exact: true })).toBeVisible();
  await expect(page.getByText('عنوان1')).toBeVisible();
  await expect(page.getByText('عنوان2')).toBeVisible();
  await expect(page.getByText('عنوان 3')).toBeVisible();
  await expect(page.getByText('عنوان4')).toBeVisible();
  await expect(page.locator('.column__FieldType2.column__عنوان5 > .wrapper > .content')).toBeVisible();
  await expect(page.getByText('عنوان5')).toBeVisible();
  await expect(page.getByText('عنوان عنوان عنوان', { exact: true })).toBeVisible();
  await expect(page.getByText('عنوان 12')).toBeVisible();
  await expect(page.locator('thead')).toContainText('عنوان 13');
  const tableLocator = page.locator('bsu-ui-table-view');
  // اجرای کد جاوااسکریپت در داخل مرورگر برای محاسبه ابعاد
  const hasHorizontalScroll = await tableLocator.evaluate((el) => {
    return el.scrollWidth > el.clientWidth;
  });

  // بررسی اینکه آیا اسکرول وجود دارد
  expect(hasHorizontalScroll).toBe(true); // یا expect(hasHorizontalScroll).toBeTruthy();
  const dataCells = page.locator('bsu-ui-table-view td');
  await expect(dataCells.first()).toBeVisible();
  const hasTruncatedCells = await dataCells.evaluateAll((cells) => {
    return cells.some(cell => cell.scrollWidth > cell.clientWidth);
  });
  expect(hasTruncatedCells).toBe(false);
});