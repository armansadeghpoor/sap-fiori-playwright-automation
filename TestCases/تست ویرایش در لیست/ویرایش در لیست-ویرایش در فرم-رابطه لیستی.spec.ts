import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
import { asyncWrapProviders } from "async_hooks";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText('ویرایش در لیست', { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page.getByText("گزارش از نوع فرم-ویراش در فرم -رابطه لیستی").click();
  await page.getByRole("button", { name: "" }).click();

  await page
    .locator("div")
    .filter({ hasText: /^‫سبز‬$/ })
    .nth(2)
    .click();
  await page.getByRole("textbox", { name: "سبز" }).fill("سبز تستی");
  await page.getByRole("button", { name: "" }).click(); //pen button for edit in list
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "" }).last().click();
  await expect(page.locator("tbody")).toContainText("‫سبز تستی‬");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
