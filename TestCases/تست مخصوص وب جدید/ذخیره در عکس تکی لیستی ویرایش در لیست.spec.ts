import { test, expect } from '@playwright/test';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 950,
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
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('راهبر');
  await page.locator('input[type="text"]').press('Tab');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).fill('123');
  await page.getByRole('textbox', { name: 'xxxxxxx' }).press('Enter');
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'Product Switch' }).click();
  await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
  await page.getByRole('link', { name: 'ذخیره در عکس تکی لیستی' }).click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('button', { name: 'جدید' }).click();
  const titleColumns = page.locator('bsu-barsa-table-column')
    .filter({ has: page.locator('[caption="عنوان"]') });
  await titleColumns.nth(0).locator('input[type="text"]').fill('تست1');
  await titleColumns.nth(0).locator('input[type="text"]').press('Tab');
  await page.getByRole('cell').nth(2).press('Tab');
  await page.locator('#LayoutItem_16').getByRole('textbox').fill('12');
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await expect(page.getByText('اشکال در مقادیر فرم عکس تکی لیستی: ردیف 1 تغییر یافته و ذخیره نشده است')).toBeVisible();
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.getByRole('button', { name: 'ویرایش در لیست' }).click();
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: 'ذخیره و بستن' }).dblclick();
  await page.getByRole('link', { name: '‫‬' }).dblclick();
  await expect(page.locator('a').filter({ hasText: '‫تست1‬' })).toBeVisible();
  await page.locator('a').filter({ hasText: '‫تست1‬' }).click();
  await page.getByRole('textbox', { name: 'تست' }).press('Enter');
  await page.locator('#LayoutItem_41').getByRole('textbox').fill('تست2');
  await page.locator('#LayoutItem_41').getByRole('textbox').press('Tab');
  await page.locator('.last-item > .cdk-drag > td:nth-child(3)').press('Tab');
  await page.locator('bsu-ui-num-int-ui input').fill('13');
  await page.getByRole('button', { name: 'ویرایش در لیست' }).click();
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await page.getByRole('link', { name: '‫‬' }).dblclick();
  await expect(page.locator('a').filter({ hasText: '‫تست2‬' })).toBeVisible();
});