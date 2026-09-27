import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد بولین").click();
  await page.getByText("درست/نادرست-انواع نمایش").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("label").filter({ hasText: "سیاه" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
