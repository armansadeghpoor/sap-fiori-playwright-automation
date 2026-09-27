import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();

  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد مبلغ").click();
  await page.getByText("مبلغ-انواع حالت های مقدار پیش فرض").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("55");
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("fd-text")).toContainText("2,000 ریال");
});
