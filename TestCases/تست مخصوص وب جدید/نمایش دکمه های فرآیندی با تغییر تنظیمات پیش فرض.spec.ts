import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.waitForTimeout(1000);
  await page.getByText("فرم مودال-تغییر تنظیمات پیش فرض فرآیند").dblclick();
  await page.waitForTimeout(2000);
  await expect(await page.locator('fd-dialog-footer').last()).toContainText('انتخاب کنید ارسال ذخیره و بستن انصراف');
  await page.getByRole("button", { name: "انتخاب کنید" }).last().click();
  await page.locator("div nav").getByText("رد").click();
  // await page.getByRole("button", { name: "ارسال" }).nth(3).click();
  await page.locator('button.fd-button--positive[aria-label="ارسال"]').last().click();
  await expect(page.getByText("ثبت درخواست ذخیره و بستن انصراف")).toBeVisible();
  await page.getByRole("button", { name: "ثبت درخواست" }).click();
});
