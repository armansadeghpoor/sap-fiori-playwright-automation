import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:4300/#/servicedesk");
  await page
    .getByRole("heading", { name: "پریدن صفحه بندی بعد از رفرش" })
    .click();
  await page.getByText("‫تست 1‬").dblclick();
  await expect(page.getByText("عنوان:")).toBeVisible();
});
