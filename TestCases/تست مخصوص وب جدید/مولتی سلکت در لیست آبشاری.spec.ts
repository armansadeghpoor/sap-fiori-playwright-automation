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
    .getByRole("heading", { name: "به هم ریختگی نما در مولتی سلکت ها" })
    .click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await page.getByRole('button', { name: 'value-help' }).click();
  await page.getByTitle('Close').click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "value-help" }).click();
  await page.locator(".fd-checkbox__checkmark").first().click();
  await page.locator(".fd-checkbox__checkmark").nth(1).click();
  await page.locator(".fd-checkbox__checkmark").nth(2).click();
  await page.locator(".fd-checkbox__checkmark").nth(3).click();
  await page.locator(".fd-checkbox__checkmark").nth(4).click();
  await page.locator(".fd-checkbox__checkmark").nth(5).click();
  await page.locator(".fd-checkbox__checkmark").nth(6).click();
  await page.locator(".fd-checkbox__checkmark").nth(7).click();
  await page.locator(".fd-checkbox__checkmark").nth(8).click();
  await page.locator(".fd-checkbox__checkmark").nth(9).click();
  await page.locator(".fd-checkbox__checkmark").nth(10).click();
  await page
    .getByRole("heading", { name: "به هم ریختگی نما در مولتی سلکت ها : *" })
    .click();
  await expect(page.locator("fd-multi-input")).toBeVisible();
});
