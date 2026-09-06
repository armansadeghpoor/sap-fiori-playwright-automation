import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
  await page.goto("http://localhost:8000/#/login");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .fill("راهبر");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
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
