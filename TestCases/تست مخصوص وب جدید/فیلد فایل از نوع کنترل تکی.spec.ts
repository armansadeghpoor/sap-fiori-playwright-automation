import { test, expect } from "@playwright/test";

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
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("فیلد فایل از نوع کنترل تکی").click();
  await page.waitForTimeout(2000);
  // await page.getByRole("button", { name: "" }).click();
  await page.getByRole('link', { name: '‫تست ابزار خودکار‬' }).dblclick();
  // await page.getByRole("button", { name: "" }).click();
  await page.waitForTimeout(500);
  await page.getByTitle('Close').click();
  await page.getByRole('link', { name: '‫تست ابزار خودکار‬' }).dblclick();
});
