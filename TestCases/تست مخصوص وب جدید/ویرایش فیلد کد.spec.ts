import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot",
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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("فیلد کد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator(".view-line").click();
  await page
    .getByRole("textbox", { name: "Editor content;Press Alt+F1" })
    .fill('return("Test")');
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole('link', { name: '‫return("Test")‬' }).dblclick();
  await page.locator(".view-line").click();
  await page
    .getByRole("textbox", { name: "Editor content;Press Alt+F1" })
    .fill('return("Test complete")');
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByText('‫return("Test complete")‬')).toBeVisible();
});
