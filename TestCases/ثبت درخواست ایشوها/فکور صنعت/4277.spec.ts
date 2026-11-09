import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
import { recordingDevices } from "../../../framework/config/recording-devices";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("4277", async ({ page }) => {
  await loginAs(page, users.rahbar);

  // Paste the recorded business actions and assertions here.
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست' }).getByText('ثبت درخواست ایشوها').click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('4277');
  await page.getByRole('link', { name: '4277' }).click();
  await page.getByRole('button', { name: 'خروجی به اکسل' }).click();
  await expect(page.locator('fd-dialog-body')).toMatchAriaSnapshot(`
    - text: "از شماره:"
    - textbox: "1"
    - text: "تا شماره:"
    - textbox: "3"
    - text: "فرمت:"
    - radio "xlsx"
    - text: xlsx
    - radio "xls"
    - text: xls
    - separator
    `);
});
