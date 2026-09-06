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
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "رمز عبور*" })
    .locator("fd-icon")
    .click();
  await page.getByRole('combobox', { name: 'Select an Option' }).locator('fd-icon').click();
  await page.getByText("English").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "رمز عبور*" })
    .locator("fd-icon")
    .click();
  await expect(
    page
      .locator("bsu-layout-control")
      .filter({ hasText: "رمز عبور*" })
      .locator("fd-icon")
  ).toBeVisible();
});
