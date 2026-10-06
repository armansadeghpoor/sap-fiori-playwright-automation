import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("ویرایش در لیست", { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page
    .getByText("گزارش از نوع فرم-ویراش در فرم -رابطه گزارش مرتبط")
    .click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByTitle("کتاب", { exact: true }).locator("div").click();
  await page.getByRole("textbox", { name: "کتاب" }).fill("کتاب تستی");
  await page
    .getByText("گزارش مرتبط default جدید جنس ‫دفت6‬‫میز‬‫کیف5‬‫گوشی‬‫کتاب3‬")
    .click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "" }).click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^‫کتاب تستی‬$/ })
      .nth(2)
  ).toBeVisible();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
