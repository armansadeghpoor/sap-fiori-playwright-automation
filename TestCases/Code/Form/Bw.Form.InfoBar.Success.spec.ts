import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست کد").click();
  await page.getByText('Form', { exact: true }).click();
  await page.getByText("InfoBar").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "Success" }).click();
  await expect(
    page
      .getByLabel("test infobar")
      .locator("div")
      .filter({ hasText: "test infobar" })
  ).toBeVisible();
});
