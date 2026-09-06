import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:8000/#/login");
  await expect(page.locator("#bgLogin")).toBeVisible();
  await expect(page.getByRole('img').first()).toBeVisible();
});
