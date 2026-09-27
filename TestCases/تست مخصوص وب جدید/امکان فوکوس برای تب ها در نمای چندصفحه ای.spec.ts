import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("#fd-list-item-11").click();
  await page.getByText("تست نمای چندصفحه ای").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByText("متن پیشرفته:")).toBeVisible();
});
