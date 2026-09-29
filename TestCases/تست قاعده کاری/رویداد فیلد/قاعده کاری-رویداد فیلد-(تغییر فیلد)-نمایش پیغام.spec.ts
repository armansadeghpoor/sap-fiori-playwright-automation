import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست قاعده کاری").click();
  await page.getByText("رویداد فیلد").click();
  await page
    .getByText("قاعده کاری-رویداد فیلد(تغییر فیلد))-عملیات نمایش پیغام", {
      exact: true,
    })
    .click();
  await page
    .getByRole("row", { name: "‫علی‬ ‫دانشجو‬ " })
    .getByRole("button")
    .click();
  await page.getByRole("textbox", { name: "علی" }).click();
  await page.getByRole("textbox", { name: "علی" }).fill("علیا");
  await expect(
    page.locator("#cdk-overlay-2").getByRole("heading", { name: "اطلاعات" })
  ).toBeVisible();
  await expect(
    page
      .locator("#cdk-overlay-2")
      .getByText('نام نمیتواند شامل کاراکتر "الف" باشد')
  ).toBeVisible();
  await page
    .locator("#cdk-overlay-2")
    .getByRole("button", { name: "تایید" })
    .click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
