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
  await page
    .getByRole("heading", { name: "نمایش فیلد تاریخ در اخبار" })
    .click();
  await expect(page.getByText("تست 1‫1404/09/19 ‬‫تست 1.1‬")).toBeVisible();
  await expect(page.getByText("تست 2‫1404/09/20 ‬‫تست 1.2‬")).toBeVisible();
  await expect(page.getByText("تست 3‫1404/09/21 ‬‫تست 1.3‬")).toBeVisible();
  await page.getByTitle("تست 3").first().click();
  await page.getByTitle("تست 3").first().dblclick();
});
