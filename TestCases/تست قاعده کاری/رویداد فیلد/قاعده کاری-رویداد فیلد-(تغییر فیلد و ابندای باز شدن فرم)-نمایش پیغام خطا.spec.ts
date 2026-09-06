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
  await page.getByText("تست قاعده کاری").click();
  await page.getByText("رویداد فیلد").click();
  await page
    .getByText(
      "قاعده کاری-رویداد فیلد(تغییر فیلد و ابتدای باز شدن فرم)-نمایش پیغام با خطا"
    )
    .click();
  await page.getByRole("cell", { name: "" }).nth(1).click();
  await expect(
    page
      .getByRole("dialog")
      .locator("div")
      .filter({ hasText: 'عنوان کالا نمیتواند شامل کاراکتر "الف" شود' })
  ).toBeVisible();
  await expect(
    page.getByText('عنوان کالا نمیتواند شامل کاراکتر "الف" شود')
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
