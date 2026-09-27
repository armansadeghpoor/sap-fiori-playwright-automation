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
  await page.getByText("انتخاب کاربر-انواع مشخصات").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole("textbox")).toBeEmpty();
});
