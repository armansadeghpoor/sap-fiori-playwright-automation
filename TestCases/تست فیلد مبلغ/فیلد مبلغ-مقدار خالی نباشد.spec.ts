import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();

  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد مبلغ").click();
  await page.getByText("مبلغ-مقدار خالی نباشد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "اشکال در مقادیر فرم مبلغ-مقدار خالی نباشد: فیلد `مبلغ-مقدار خالی نباشد` اجباری م"
    )
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
