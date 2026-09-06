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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page.getByRole("heading", { name: "نمایش گزارش زیرفرم" }).click();
  await page.getByRole("button", { name: "جزئیات" }).first().click();
  await page.waitForTimeout(700);
  await page.getByRole('link', { name: '‫تست 1‬' }).dblclick();
  await page.waitForTimeout(700);
  await page.getByTitle('Close').click();
  await page.getByRole("button", { name: "مخفی" }).click();
  await page.getByRole("button", { name: "جزئیات" }).nth(2).click();
  await page.getByRole("tab", { name: "گزارش مرتبط-بدون صفحه بندی" }).click();
});
