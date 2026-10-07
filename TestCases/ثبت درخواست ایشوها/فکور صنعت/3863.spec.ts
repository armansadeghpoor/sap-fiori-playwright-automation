import { test, expect } from '@playwright/test';
import { restoreSnapshot } from '../../../framework/api/environment.api';
import { loginAs } from '../../../framework/auth/auth.service';
import { users } from '../../../framework/auth/users';

test.use({
  storageState: 'localstorage.json'
});

test('test', async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page.getByRole('link', { name: '3863' }).last().click();
  await page.getByText('‫*حذف نشود*‬').dblclick();
  await expect(page.locator('tbody')).toContainText('‫‪45‬');
  await page.getByTitle('ویرایش در لیست', { exact: true }).click();
  await page.locator('a').filter({ hasText: '‫‪45‬' }).click();
  await page.getByTitle('ویرایش در لیست', { exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByTitle('ویرایش در لیست', { exact: true }).click();
  await page.getByRole('cell', { name: '45' }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '45' }).getByRole('textbox').fill('45,1111');
    await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await page.locator('fd-dialog').click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await expect(page.locator('[id="-content-text"]')).toContainText('اشکال در مقادیر فرم عدد: مقدار ورودی `عدد` نمی تواند بیشتر از 100 باشد.');
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('textbox').last().fill('111');
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await expect(page.getByText('اشکال در مقادیر فرم گزارش مرتبط: ردیف 1 ذخیره نشده است')).toBeVisible();
  await page.getByRole('button', { name: 'تایید' }).click();
});