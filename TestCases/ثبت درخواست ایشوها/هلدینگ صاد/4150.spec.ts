import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator('a').filter({ hasText: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('ثبت درخواست ایشوها').last().click();
  await page.getByRole('link', { name: '4150' }).last().click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('button', { name: 'select day' }).click();
  await page.getByRole('button', { name: 'select day' }).click();
  await page.getByRole('button', { name: 'امروز' }).click();
  await page.getByRole('button', { name: 'تایید' }).click();
  await expect(page.getByText('تاریخ آینده قابل انتخاب نیست')).toBeVisible();
  await page.getByRole('button', { name: 'تایید' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'خیر', exact: true }).click();
});
