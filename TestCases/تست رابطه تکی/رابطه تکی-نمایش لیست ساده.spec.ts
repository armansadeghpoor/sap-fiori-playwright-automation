import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه تکی").click();
  await page.getByText("تست فیلد رابطه تکی-انواع نمایش").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("#fd-input-group-button-id-0").click();
  await page.locator("li").getByText("سفید تست").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
