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
  await page
    .getByText("شرط گزارش - گزارش مرتبط - مساوی مقدار از فرم پدر")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.locator("div ul li span").getByText("1").click();
  await page.getByRole('button', { name: 'بازآوری' }).click();
  await expect(
    page
      .locator("bsu-ui-ulv-main-ui")
      .filter({ hasText: "جدید نام مقدار ‫1‬‫‪1‬" })
  ).toBeVisible();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: '‫1‬' }).dblclick();
  await expect(
    page
      .locator("bsu-ui-ulv-main-ui")
      .filter({ hasText: "جدید نام مقدار ‫1‬‫‪1‬" })
  ).toBeVisible();
  await page.getByTitle('Close').click();
});
