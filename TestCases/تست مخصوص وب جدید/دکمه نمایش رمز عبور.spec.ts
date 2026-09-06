import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:8000/#/login");
  await page.getByRole("textbox", { name: "xxxxxxx" }).click();
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await expect(page.getByRole("textbox", { name: "xxxxxxx" })).toBeVisible();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "رمز عبور*" })
    .locator("fd-icon")
    .click();
  await expect(page.getByRole("textbox", { name: "xxxxxxx" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "xxxxxxx" })).toHaveValue(
    "123"
  );
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "رمز عبور*" })
    .locator("fd-icon")
    .click();
  await expect(page.getByRole("textbox", { name: "xxxxxxx" })).toHaveValue(
    "123"
  );
});
