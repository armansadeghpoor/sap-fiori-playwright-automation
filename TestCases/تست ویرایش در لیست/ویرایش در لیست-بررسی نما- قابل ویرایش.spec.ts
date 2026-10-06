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
  await page.getByText("نما با قابلیت ویرایش").click();
  await page.getByTitle("دفتر").locator("div").click();
  await page.getByRole("textbox", { name: "دفتر" }).fill("دفتر تست");
  await page
    .locator("fd-dynamic-page-content div")
    .filter({ hasText: "جدید عنوان ‫کتاب‬‫میز‬" })
    .click();
  await page
    .locator("fd-dynamic-page-content div")
    .filter({ hasText: "جدید عنوان ‫کتاب‬‫میز‬" })
    .click();
  await page.getByTitle("میز").locator("div").click();
  await page.getByTitle("دفتر تست").locator("div").click();
  await page.getByTitle("میز").locator("div").click();
  await page
    .locator("fd-dynamic-page-content div")
    .filter({ hasText: "جدید عنوان ‫کتاب‬‫دفتر تست‬" })
    .click();
  await expect(page.locator("tbody")).toContainText("‫دفتر تست‬");
});
