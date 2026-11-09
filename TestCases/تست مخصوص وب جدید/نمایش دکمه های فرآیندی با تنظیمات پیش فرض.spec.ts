import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("فرم مودال-تنظیمات پیش فرض فرآیند").click();
  await expect(
    page.getByText(
      "انتخاب کنید Default Action ارسال Positive Action ذخیره و بستن انصراف",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "انتخاب کنید" }).click();
  await page.getByText("تایید").click();
  await page.getByRole("button", { name: "ارسال" }).click();
  await expect(page.getByText("ثبت درخواستPositive Actionذخیره")).toBeVisible();
  await page.getByRole("button", { name: "ثبت درخواست" }).click();
});
