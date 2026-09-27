import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
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
