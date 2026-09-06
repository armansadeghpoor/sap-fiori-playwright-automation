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
  await page
    .getByText("شرط گزارش - گزارش مرتبط - مساوی مقدار از فرم پدر")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.locator("div ul li span").getByText("1").click();
  await page.getByRole('button', { name: 'بازآوری' }).click();
  await expect(
    page
      .locator("bsu-ui-ulv-main-ui")
      .filter({ hasText: "جدید نام مقدار ‫1‬‫‪1‬" })
  ).toBeVisible();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: '‫1‬' }).dblclick();
  await expect(
    page
      .locator("bsu-ui-ulv-main-ui")
      .filter({ hasText: "جدید نام مقدار ‫1‬‫‪1‬" })
  ).toBeVisible();
  await page.getByTitle('Close').click();
});
