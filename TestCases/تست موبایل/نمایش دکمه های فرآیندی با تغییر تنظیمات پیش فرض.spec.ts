import { test, expect, devices } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
const iPhone = devices["Pixel 7"];
test.setTimeout(45000);
test.use({ ...iPhone });
test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.waitForTimeout(1000);
  await page.getByText("فرم مودال-تغییر تنظیمات پیش فرض فرآیند").click();
  await expect(
    page.getByText("انتخاب کنید ارسال ذخیره و بستن انصراف"),
  ).toBeVisible();
  await page.getByRole("button", { name: "انتخاب کنید" }).click();
  await page.getByText("رد", { exact: true }).click();
  await page.getByRole("button", { name: "ارسال" }).click();
  await expect(page.getByText("ثبت درخواست ذخیره و بستن انصراف")).toBeVisible();
  await page.getByRole("button", { name: "ثبت درخواست" }).click();
});
