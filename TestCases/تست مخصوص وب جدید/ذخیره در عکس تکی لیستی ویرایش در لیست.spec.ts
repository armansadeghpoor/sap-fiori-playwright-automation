import { test, expect } from '@playwright/test';
import { restoreSnapshot } from '../../framework/api/environment.api';
import { loginAs } from '../../framework/auth/auth.service';
import { users } from '../../framework/auth/users';

test.use({
  storageState: 'localstorage.json',
  viewport: {
    height: 950,
    width: 1920
  }
});

test('test', async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
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
  // await page.getByRole('button', { name: 'ویرایش در لیست' }).click();
  await page.getByTitle("ویرایش در لیست", { exact: true }).click();
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
  // await page.getByRole('button', { name: 'ویرایش در لیست' }).click();
  await page.getByTitle("ویرایش در لیست", { exact: true }).click();
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await page.getByRole('link', { name: '‫‬' }).dblclick();
  await expect(page.locator('a').filter({ hasText: '‫تست2‬' })).toBeVisible();
});