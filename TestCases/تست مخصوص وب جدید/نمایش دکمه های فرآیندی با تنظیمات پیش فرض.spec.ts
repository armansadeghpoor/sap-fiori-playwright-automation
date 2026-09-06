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
  await page.getByText("تست وب جدید").click();
  await page.getByText("فرم مودال-تنظیمات پیش فرض فرآیند").click();
  await expect(
    page.getByText("انتخاب کنید ارسال ذخیره و بستن انصراف")
  ).toBeVisible();
  await page.getByRole("button", { name: "انتخاب کنید" }).click();
  await page.getByText("تایید").click();
  await page.getByRole("button", { name: "ارسال" }).click();
  await expect(
    page.locator("div").filter({ hasText: /^ثبت درخواستذخیره$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "ثبت درخواست" }).click();
});
