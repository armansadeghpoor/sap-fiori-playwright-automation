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
  await page.getByText("فیلد رابطه لیستی-رابطه دارد-انواع نمایش").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.locator("tbody")).toContainText("‫سفید2‬");
  await page.locator('bsu-barsa-table-row:nth-child(4) > .cdk-drag > td > .tw-flex > .ng-untouched > .fd-checkbox__label > .fd-checkbox__checkmark').click();
  // await page.getByRole("textbox", { name: "2سفید" }).click();

  await page.getByRole('link', { name: '‫سفید2‬' }).dblclick();
  await page.getByRole("textbox", { name: "سفید" }).fill("سفید تستی");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("‫سفید تستی‬");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(2000);
  await expect(page.locator("bsu-barsa-table-row")).toContainText(
    "‫سفید تستی‬"
  );
});
