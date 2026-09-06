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
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("انواع شرط در گزارش").click();
  await page.getByText("شرط گزارش-پارامتر از فرم پدر").click();
  await page.getByText("شرط گزارش - گزارش مرتبط - وجود دارد در لیست").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");

  await page
    .locator("fd-toolbar")
    .getByRole("button")
    .filter({ hasText: "جدید" })
    .nth(0)
    .click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").fill("وب");
  await page.locator("bsu-ui-text-field").getByRole("textbox").press("Tab");
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").fill("1");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole('button', { name: 'بازآوری' }).click();
  await expect(page.locator("#fd-panel-content-0")).toContainText("‫وب‬");
  await expect(page.locator("#fd-panel-content-0")).toContainText("‫‪1‬");
  await expect(page.getByText('جدید نام مقدار ‫وب‬‫‪1‬')).toBeVisible();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page
    .locator("bsu-barsa-table-row td bsu-barsa-row-inline-actionlist")
    .getByRole("button")
    .nth(1)
    .click();
  await page.getByTitle('Close').click();
});
