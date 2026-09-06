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
  await page.getByText("تست گزارش").click();
  await page.getByText("نمایش دستورات در گزارش").click();
  await page
    .getByText("نمایش دستورات در گزارش - نمایش همه - نمایش همه")
    .click();
  await expect(page.getByRole("button", { name: "دستور 1" })).toBeVisible();
  await expect(page.getByRole("button", { name: "دستور 2" })).toBeVisible();
  await expect(page.getByRole("button", { name: "دستور 3" })).toBeVisible();
});
