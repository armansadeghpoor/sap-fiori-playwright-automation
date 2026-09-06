import { test, expect } from "@playwright/test";
import { asyncWrapProviders } from "async_hooks";

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
  await page.getByText('ویرایش در لیست', { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page.getByText("گزارش از نوع فرم-ویراش در فرم -رابطه لیستی").click();
  await page.getByRole("button", { name: "" }).click();

  await page
    .locator("div")
    .filter({ hasText: /^‫سبز‬$/ })
    .nth(2)
    .click();
  await page.getByRole("textbox", { name: "سبز" }).fill("سبز تستی");
  await page.getByRole("button", { name: "" }).click(); //pen button for edit in list
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "" }).last().click();
  await expect(page.locator("tbody")).toContainText("‫سبز تستی‬");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
