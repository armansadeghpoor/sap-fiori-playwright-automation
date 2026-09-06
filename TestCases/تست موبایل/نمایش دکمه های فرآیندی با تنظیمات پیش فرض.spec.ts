import { test, expect, devices } from "@playwright/test";
test.use({
  ...devices["Pixel 7"],
});
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
  await page
    .locator("div")
    .filter({ hasText: /^تست وب جدید$/ })
    .nth(2)
    .click();
  await page.getByText("فرم مودال-تنظیمات پیش فرض فرآیند").click();
  await page.waitForTimeout(3000);
  await expect(
    page.getByText("انتخاب کنید ارسال ذخیره و بستن انصراف"),
  ).toBeVisible();
  await expect(
    page
      .getByRole("toolbar")
      .filter({ hasText: "انتخاب کنید ارسال ذخیره و بستن انصراف" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "انتخاب کنید" }).click();
  await page.getByText("تایید").click();
  await page.getByRole("button", { name: "ارسال" }).click();
  await expect(
    page
      .getByRole("toolbar")
      .filter({ hasText: "ثبت درخواست ذخیره و بستن انصراف" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "ثبت درخواست" }).click();
});
