import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های نوع خودکار").click();
  await page.getByText("فیلد شماره خودکار").click();
  await page.getByText("شماره خودکار-مقدار خالی نباشد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("fd-dialog-body")).toContainText(
    "اشکال در مقادیر فرم شماره خودکار-مقدار خالی نباشد: فیلد `شماره خودکار-مقدار خالی نباشد` اجباری میباشد."
  );
  await page.getByRole("button", { name: "تایید" }).click();
});
