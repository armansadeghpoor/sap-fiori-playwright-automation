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
  await expect(
    page
      .locator("bsu-ui-table-view")
      .filter({ hasText: "رنگ ‫آبی‬‫آبی1‬‫صورتی‬‫سفید2" })
  ).toBeVisible();
  await page.getByRole("button", { name: "جدید" }).first().click();
  await page.locator("bsu-ui-text-field input").click();
  await page.locator("bsu-ui-text-field input").fill("بنفش");

  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page
      .locator("bsu-ui-table-view")
      .filter({ hasText: "رنگ ‫آبی‬‫آبی1‬‫صورتی‬‫سفید2" })
  ).toBeVisible();
  await page.getByRole('link', { name: '‫بنفش‬' }).dblclick();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByText("‫بنفش‬").click();
});
