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
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("link").nth(5).click();
  await page
    .getByRole("link", { name: "فیلد رابطه لیستی-رابطه دارد-انواع نمایش" })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole('button', { name: 'اضافه به لیست' })).toBeVisible();
});
