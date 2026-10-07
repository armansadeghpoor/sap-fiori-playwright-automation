import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  const mainMenuButton = page.locator('button.fd-shellbar__button--menu');
  await mainMenuButton.click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page
    .getByRole("link", {
      name: "ذخیره نشدن مقدار فیلد در ویرایش در لیست، داخل رابطه تکی لیستی",
    }).last()
    .click();
  await page.locator('button', { has: page.locator('.sap-icon--navigation-left-arrow') }).click();//باز کردن رکورد حذف نشود با استفاده از دکمه
  await expect(page.locator('bsu-barsa-table-row')).toContainText('‫‪10‬');
  await page.locator('a').filter({ hasText: '‫‪10‬' }).click();
  await page.getByRole('cell', { name: '10' }).getByRole('textbox').fill('');
  await page.getByTitle('ویرایش در لیست', { exact: true }).click();
  await expect(page.locator('bsu-barsa-table-row')).toContainText('‫‬');
});
