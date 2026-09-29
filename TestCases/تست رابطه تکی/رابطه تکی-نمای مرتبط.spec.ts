import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page
    .locator("bt-shellbar ul bsu-barsa-tree-item:nth-child(1)")
    .getByRole("button")
    .click();
  await page
    .locator("li")
    .filter({ hasText: "فیلد های رابطه ای" })
    .locator("button")
    .click();
  await page
    .locator("li")
    .filter({ hasText: "رابطه تکی" })
    .locator("button")
    .click();
  await page.getByText("رابطه تکی-نمایش دکمه جدید-نمای مرتبط").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.getByText("سفید").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("سفید");
});
