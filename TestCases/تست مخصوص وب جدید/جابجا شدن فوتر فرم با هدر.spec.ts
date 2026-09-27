import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  await page.getByRole("link", { name: "جابجا شدن فوتر با هدر فرم" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole("list", { name: "Wizard Steps" })).toBeVisible();
  await expect(page.locator("fd-dynamic-page-header")).toBeVisible();
});
