import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot",
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
  await page.getByText("رابطه عکس تکی لیستی").click();
  await page.getByText("رابطه تکی -پرسنل سازمان").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("313");
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("پروژه").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("رابطه عکس تکی(لیستی)-انواع نمایش-واحد سازمانی").click();
  await page
    .getByRole("row", { name: "‫پروژه‬ " })
    .getByRole("button")
    .click();
  await page.waitForTimeout(1000);
  await page
    .locator("bsu-barsa-row-inline-actionlist")
    .getByRole("button")
    .nth(0)
    .click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText("‫‪313‬");
  await expect(page.locator("bsu-barsa-table-row")).toContainText("‫پروژه‬");
});
