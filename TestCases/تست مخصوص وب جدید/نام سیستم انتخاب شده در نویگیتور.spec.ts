import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.waitForTimeout(1000);
  await page.locator('li[data-name="سیستم تست کاربران"]').click();
  await expect(page.getByText("سیستم سیستم تست کاربران")).toBeVisible();
  await page.getByRole("link").nth(2).click();
  await expect(page.getByText("سیستم تست کد")).toBeVisible();
  await page.getByRole("link").nth(9).click();
  await expect(page.getByText("سیستم تست ابزار")).toBeVisible();
});
