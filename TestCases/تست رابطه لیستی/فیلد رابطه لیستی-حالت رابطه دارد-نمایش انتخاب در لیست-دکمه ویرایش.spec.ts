import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto("http://localhost:8000/#/login");
  await page.waitForTimeout(2000);
  await page.reload();
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
  await page.getByRole("textbox", { name: "راهبر" }).press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه لیستی").click();
  await page.getByText("فیلد رابطه لیستی-رابطه دارد-انواع نمایش").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.locator("tbody")).toContainText("‫سفید2‬");
  await page.locator('bsu-barsa-table-row:nth-child(4) > .cdk-drag > td > .tw-flex > .ng-untouched > .fd-checkbox__label > .fd-checkbox__checkmark').click();
  // await page.getByRole("button", { name: "" }).first().click();
  await page.getByRole("textbox", { name: "سفید" }).click();
  await page.getByRole("textbox", { name: "سفید" }).fill("سفید تستی");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("‫سفید تستی‬");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(2000);
  await expect(page.locator("bsu-barsa-table-row")).toContainText(
    "‫سفید تستی‬"
  );
});
