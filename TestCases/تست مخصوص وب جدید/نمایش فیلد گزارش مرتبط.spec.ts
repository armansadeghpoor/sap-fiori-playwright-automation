import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  await page.getByRole("link", { name: "نمایش فیلد گزارش مرتبط" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(page.getByText("‫تست 1‬")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("‫تست 25‬")).toBeVisible();
  await page.getByRole("tab", { name: "گزارش مرتبط-بدون صفحه بندی" }).click();
  await expect(page.getByText("‫تست 50‬")).toBeVisible();
});
