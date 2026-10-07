import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
test.setTimeout(60000);
test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.locator('#cdk-overlay-1').getByText('ثبت درخواست ایشوها').click();
  await page.getByRole('link', { name: '4069' }).last().click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.getByLabel('جستجو').click();
  await page.locator('button.fd-list__button:has(.sap-icon--slim-arrow-left)').first().click();
  await page.waitForTimeout(500);
  await page.locator('button.fd-list__button:has(.sap-icon--slim-arrow-left)').first().click();
  await page.waitForTimeout(500);
  await page.locator('button.fd-list__button:has(.sap-icon--slim-arrow-left)').first().click();
  await page.waitForTimeout(500);
  await page.locator('button.fd-list__button:has(.sap-icon--slim-arrow-left)').first().click();
  await page.waitForTimeout(500);
  await expect(page.locator('bsu-ui-tree')).toContainText('تست 1تست 1.1تست 1.1.1تست 1.2تست 2تست 2.1تست 2.2تست 2.2.1تست 3');
  await page.getByRole('button', { name: 'close' }).last().click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await expect(page.locator('fd-layout-grid')).toContainText('عنوان:رابطه تکی-گزارش از نوع سلسله مراتبی: 3 result list items');
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.getByLabel('جستجو').click();
  await page.locator('button.fd-list__button:has(.sap-icon--slim-arrow-left)').first().click();
  await page.waitForTimeout(500);
  await page.locator('button.fd-list__button:has(.sap-icon--slim-arrow-left)').first().click();
  await page.waitForTimeout(500);
  await page.getByText('تست 1.1.1').click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await page.getByRole('link', { name: '‫تست 1.1.1‬' }).dblclick();
  await expect(page.getByRole('combobox', { name: 'انتخاب کنید' })).toHaveValue('تست 1.1.1');

});
