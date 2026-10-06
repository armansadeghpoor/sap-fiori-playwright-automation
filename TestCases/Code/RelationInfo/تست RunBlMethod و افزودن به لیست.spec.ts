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
  await page.getByRole("button", { name: "" }).click();
  // await page.locator("tbody").getByTitle("1").locator("div").click();
  await page.getByRole('cell').nth(4).click();
  await page.waitForTimeout(1000);
  await page
    .getByRole("button", { name: "افزودن به رابطه لیستی از طریق گزارش مرتبط" })
    .click();
  await expect(page.locator('bsu-ui-ulv-main-ui').filter({ hasText: 'جدیداضافه به لیستحذف از لیست عنوان ‫1‬' })).toBeVisible();
  await page.waitForTimeout(500);[]
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-column-renderer")).toMatchAriaSnapshot(
    `- text: ‫1‬`
  );
});
