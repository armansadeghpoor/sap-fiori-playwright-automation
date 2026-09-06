import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto("http://localhost:8000/#/login");
  await page.waitForTimeout(2000);
  await page.reload();
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
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه لیستی").click();
  await page.locator("#fd-list-item-25").click();
  await page.getByRole("button", { name: "جدید" }).click();
  // await page
  //   .getByRole("row", { name: "‫آبی‬ " })
  //   .locator("label span")
  //   .click();
  // await page
  //   .getByRole("row", { name: "‫صورتی‬ " })
  //   .locator("label span")
  //   .click();
  await page.locator('.tw-flex > .ng-untouched > .fd-checkbox__label > .fd-checkbox__checkmark').first().click();
  await page.locator('bsu-barsa-table-row:nth-child(3) > .cdk-drag > td > .tw-flex > .ng-untouched > .fd-checkbox__label > .fd-checkbox__checkmark').click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: '‫آبی‬' }).dblclick();
  await expect(
    page
      .locator("bsu-ui-table-view")
      .filter({ hasText: "رنگ ‫آبی‬‫آبی1‬‫صورتی‬‫سفید2" })
  ).toBeVisible();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
