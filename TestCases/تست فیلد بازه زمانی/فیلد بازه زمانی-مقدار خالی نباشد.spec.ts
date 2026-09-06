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
  await page.getByText('تست فیلد').click();
  await page.getByText('فیلد های نوع پیشرفته').click();
  await page.getByText('فیلد بازه زمانی').click();
  await page.getByText('فیلد بازه زمانی-مقدار خالی نباشد').click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "اشکال در مقادیر فرم مقدار خالی نباشد: فیلد `مقدار خالی نباشد` اجباری میباشد"
    )
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
