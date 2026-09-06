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
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه تکی").click();

  await page
    .getByText("رابطه تکی-انواع تنظیمات-کالاهای موجود در انبار")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole('heading', { name: 'کالاهای موجود در انبار :' })).toBeVisible();
  await page
    .locator("bsu-ui-mo-info-combo-viewer")
    .getByRole("textbox")
    .click();
});
