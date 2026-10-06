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
  await page.getByText("ویرایش گزارش در لیست- چند مقداری").click();
  await page.getByTitle("سخت").locator("div").click();
  await page.locator("label").filter({ hasText: "آسان" }).click();
  await page.getByTitle('ویرایش در لیست').click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("tbody")).toContainText("‫آسان‬");
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("label").filter({ hasText: "سخت" }).click();
  // await page
  //   .locator("fd-dynamic-page-content div")
  //   .filter({ hasText: "جدید سطح ‫متوسط‬‫آسان‬ آسان متوسط سخت" })
  //   .click();

  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("label").filter({ hasText: "سخت" }).click();
  // await page
  //   .locator("fd-dynamic-page-content div")
  //   .filter({ hasText: "جدید سطح ‫متوسط‬‫آسان‬ آسان متوسط سخت" })
  //   .click();
  await page.getByRole('button', { name: 'ذخیره و بستن' }).click();
  await page.getByTitle("آسان").locator("div").click();
});
