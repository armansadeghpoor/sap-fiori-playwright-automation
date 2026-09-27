import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Form").click();
  await page.getByText("GetMo").click();
  await page
    .locator("bsu-barsa-table-row td bsu-barsa-row-inline-actionlist")
    .getByRole("button")
    .last()
    .click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.locator("div").filter({ hasText: /^Value of Mo Isمداد$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
