import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست فیلد").click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("فیلد های نوع پیشرفته")
    .click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("فیلد بازه زمانی")
    .click();
  await page.getByText("فیلد بازه زمانی-محاسباتی").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("کاربر1").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-ui-table-view")).toContainText(
    "نام بازه زمانی محاسباتی ‫کاربر1‬‫0:33‬"
  );
});
