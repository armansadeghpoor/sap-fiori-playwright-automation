import { test, expect, devices } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
test.use({
  ...devices["Pixel 7"],
});
test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
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
