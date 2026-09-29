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
  await page.getByText("رابطه تکی").click();
  await page.getByText("رابطه تکی-نمایش فرم مرتبط").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("#fd-input-group-button-id-2").click();
  await page.getByText("بنفش").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByText("‫بنفش‬")).toBeVisible();
});
