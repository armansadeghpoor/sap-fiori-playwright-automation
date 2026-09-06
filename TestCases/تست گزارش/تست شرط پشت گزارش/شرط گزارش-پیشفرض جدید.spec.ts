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
  await page.getByText("انواع شرط در گزارش").click();
  await page.getByText("شرط گزارش-پرسیده شود").click();
  await page.getByText("شرط گزارش-پیشفرض جدید").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(
    page.getByText(
      "جدید عنوان تعداد رابطه تکی کاربر تاریخ ‫تست 1‬‫‪1‬‫تست1‬‫کاربر1‬‫1404/01/24 ‬"
    )
  ).toBeVisible();
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").click();
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").fill("1");
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(
    page.getByText(
      "جدید عنوان تعداد رابطه تکی کاربر تاریخ ‫تست 1‬‫‪1‬‫تست1‬‫کاربر1‬‫1404/01/24 ‬"
    )
  ).toBeVisible();
});
