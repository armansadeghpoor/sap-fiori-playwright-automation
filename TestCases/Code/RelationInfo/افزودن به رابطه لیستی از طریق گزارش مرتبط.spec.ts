import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("MoList").click();
  await page.getByText("تست گزارش مرتبط و رابطه لیستی").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByTitle("1").locator("div").click();
  await page
    .getByRole("button", { name: "افزودن به رابطه لیستی از طریق گزارش مرتبط" })
    .click();
  await expect(
    page
      .getByRole("rowgroup")
      .filter({ hasText: /^‫1‬$/ })
      .locator("div")
      .nth(2)
  ).toBeVisible();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("td").nth(1)).toBeVisible();
});
