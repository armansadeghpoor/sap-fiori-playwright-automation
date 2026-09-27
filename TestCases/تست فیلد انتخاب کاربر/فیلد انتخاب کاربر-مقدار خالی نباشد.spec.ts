import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست فیلد").click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("فیلد های ساده")
    .click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("فیلد انتخاب کاربر")
    .click();
  await page.getByText("انتخاب کاربر-مقدار خالی نباشد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("fd-dialog-body div")).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
