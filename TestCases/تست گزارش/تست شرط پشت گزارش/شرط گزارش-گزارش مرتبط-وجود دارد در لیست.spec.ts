import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("انواع شرط در گزارش").click();
  await page.getByText("شرط گزارش-پارامتر از فرم پدر").click();
  await page.getByText("شرط گزارش - گزارش مرتبط - وجود دارد در لیست").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");

  await page
    .locator("fd-toolbar")
    .getByRole("button")
    .filter({ hasText: "جدید" })
    .nth(0)
    .click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").fill("وب");
  await page.locator("bsu-ui-text-field").getByRole("textbox").press("Tab");
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").fill("1");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole('button', { name: 'بازآوری' }).click();
  await expect(page.locator("#fd-panel-content-0")).toContainText("‫وب‬");
  await expect(page.locator("#fd-panel-content-0")).toContainText("‫‪1‬");
  await expect(page.getByText('جدید نام مقدار ‫وب‬‫‪1‬')).toBeVisible();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page
    .locator("bsu-barsa-table-row td bsu-barsa-row-inline-actionlist")
    .getByRole("button")
    .nth(1)
    .click();
  await page.getByTitle('Close').click();
});
