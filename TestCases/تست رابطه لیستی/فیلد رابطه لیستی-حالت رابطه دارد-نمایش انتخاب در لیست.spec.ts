import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه لیستی").click();
  await page.locator("#fd-list-item-25").click();
  await page.getByRole("button", { name: "جدید" }).click();
  // await page
  //   .getByRole("row", { name: "‫آبی‬ " })
  //   .locator("label span")
  //   .click();
  // await page
  //   .getByRole("row", { name: "‫صورتی‬ " })
  //   .locator("label span")
  //   .click();
  await page.locator('.tw-flex > .ng-untouched > .fd-checkbox__label > .fd-checkbox__checkmark').first().click();
  await page.locator('bsu-barsa-table-row:nth-child(3) > .cdk-drag > td > .tw-flex > .ng-untouched > .fd-checkbox__label > .fd-checkbox__checkmark').click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: '‫آبی‬' }).dblclick();
  await expect(
    page
      .locator("bsu-ui-table-view")
      .filter({ hasText: "رنگ ‫آبی‬‫آبی1‬‫صورتی‬‫سفید2" })
  ).toBeVisible();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
