import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();

  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Form").click();
  await page.getByText("SaveAndClose(FailFn)(With").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "SaveAndClose", exact: true }).click();
  await expect(page.getByText("ایجاد خطا در ذخیره وبستن با")).toBeVisible();
  await expect(page.getByText("FailFn Message")).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).last().click();
});
