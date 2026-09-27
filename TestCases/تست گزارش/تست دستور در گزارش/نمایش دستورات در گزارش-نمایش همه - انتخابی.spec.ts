import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("نمایش دستورات در گزارش").click();
  await page.getByText("نمایش دستورات در گزارش - نمایش همه - انتخابی").click();
  await expect(page.getByText("جدیددستور")).toBeVisible();
});
