import { test, expect, devices } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("heading", { name: "نمایش گزارش زیرفرم" }).click();
  await page.getByRole("button", { name: "جزئیات" }).first().click();
  await page.getByRole("tab", { name: "گزارش مرتبط-بدون صفحه بندی" }).click();
await page.getByRole('cell', { name: 'عنوان: تست 1.1' }).getByLabel('More').click();
await page.locator('#fd-button-142').click();
  await page
    .getByRole("cell", { name: "عنوان: تست 1.1" })
    .getByLabel("More")
    .click();
  await page.getByRole("tab", { name: "گزارش مرتبط-با صفحه بندی" }).click();
  await page
    .locator(
      "bsu-barsa-table-row:nth-child(19) > .fd-table__row.fd-table__row--hoverable > .col-view > bsu-barsa-row-inline-actionlist > .fd-button"
    )
    .click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
