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
  await page.getByText("رابطه عکس تکی تکی").click();
  await page
    .getByText("رابطه عکس تکی(تکی)-نمایش چند انتخابی رادیویی-تجهیزات")
    .click();
  await expect(page.locator("tbody")).toContainText("‫کلاس2‬");
  await page
    .getByRole("row", { name: "‫دفتر4‬ ‫کلاس2‬ " })
    .getByRole("button")
    .click();
  await page.locator("label").filter({ hasText: "کلاس3" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("‫کلاس3‬");
});
