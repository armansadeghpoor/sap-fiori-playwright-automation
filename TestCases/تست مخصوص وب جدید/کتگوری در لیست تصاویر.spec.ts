import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  await page.getByRole("link", { name: "کتگوری در لیست تصاویر" }).click();
  await page.getByText("‫*حذف نشود*‬").dblclick();
  await expect(page.getByText("تست 1")).toBeVisible();
  await expect(page.getByText("تست 2")).toBeVisible();
  await expect(page.getByText('تست 114تست')).toBeVisible();
  await page.getByRole('button', { name: 'تست 1' }).click();
  await page.getByRole('button', { name: 'تست 1' }).click();
});
