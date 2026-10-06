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
  await page.getByText("ویرایش در لیست-رابطه تکی-انواع نمایش").click();
  await page.getByTitle("میز").locator("div").click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("مداد").click();
  await page
    .locator("fd-dynamic-page-content div")
    .filter({
      hasText: "جدید رابطه تکی- نمایش لیست ساده 6 result list items ‫صندل‬",
    })
    .click();
  await page
    .locator("fd-dynamic-page-content div")
    .filter({
      hasText: "جدید رابطه تکی- نمایش لیست ساده 6 result list items ‫صندل‬",
    })
    .click();
  await page.getByRole("cell", { name: "‫صندل‬" }).click();
  await expect(page.locator("tbody")).toContainText("‫مداد‬");
});
