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
  await page.getByText("نما با قابلیت اجباری").click();
  await page.getByTitle("فرو").locator("div").click();
  await page.waitForTimeout(1000);
  await page.getByRole("textbox", { name: "فرو" }).fill("");
  await page
    .locator("fd-dynamic-page-content div")
    .filter({ hasText: "جدید نام ‫آوا‬‫سارا‬‫شهاب‬" })
    .click();
  await page.getByRole("button", { name: "" }).click();
  await expect(
    page.getByRole("cell", { name: "" }).locator("fd-icon")
  ).toBeVisible();
  await page.getByTitle("فرو").locator("div").click();
  await page.waitForTimeout(1000);
  await page.getByRole("textbox", { name: "فرو" }).fill("");
  await page.getByRole("textbox", { name: "" }).fill("فرو");
  await expect(page.getByRole("cell", { name: "" })).toBeVisible();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("tbody")).toContainText("‫فرو‬");
});
