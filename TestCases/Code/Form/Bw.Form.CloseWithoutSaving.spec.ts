import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Form").click();
  await page.getByText("close", { exact: true }).click();
  await page.locator("fd-dynamic-page-content").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "close without saving" }).click();
});
