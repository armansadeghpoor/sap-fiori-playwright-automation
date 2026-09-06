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
  await page.getByText("ویرایش در لیست-رابطه تکی-انواع نمایش").click();
  await page.getByTitle("میز").locator("div").click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("مداد").click();
  await page
    .locator("fd-dynamic-page-content div")
    .filter({
      hasText: "جدید رابطه تکی- نمایش لیست ساده 6 result list items ‫صندل‬",
    })
    .click();
  await page
    .locator("fd-dynamic-page-content div")
    .filter({
      hasText: "جدید رابطه تکی- نمایش لیست ساده 6 result list items ‫صندل‬",
    })
    .click();
  await page.getByRole("cell", { name: "‫صندل‬" }).click();
  await expect(page.locator("tbody")).toContainText("‫مداد‬");
});
