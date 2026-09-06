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
  await page.getByText("ویرایش در لیست", { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page
    .getByText("گزارش از نوع فرم-ویراش در فرم -رابطه گزارش مرتبط")
    .click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByTitle("کتاب", { exact: true }).locator("div").click();
  await page.getByRole("textbox", { name: "کتاب" }).fill("کتاب تستی");
  await page
    .getByText("گزارش مرتبط default جدید جنس ‫دفت6‬‫میز‬‫کیف5‬‫گوشی‬‫کتاب3‬")
    .click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "" }).click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^‫کتاب تستی‬$/ })
      .nth(2)
  ).toBeVisible();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
