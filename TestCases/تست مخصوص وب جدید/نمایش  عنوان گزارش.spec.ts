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
  await page.getByText("تست شرط گزارش").click();
  await page.getByRole("link", { name: "شرط گزارش-پیشفرض جدید" }).click();
  await expect(
    page.getByLabel("Breadcrumb Trail").getByText("شرط گزارش-پیشفرض جدید"),
  ).toBeVisible();
  await page.getByRole("link", { name: "شرط گزارش-پیشفرض قدیم" }).click();
  await expect(
    page.getByLabel("Breadcrumb Trail").getByText("شرط گزارش-پیشفرض قدیم"),
  ).toBeVisible();
});
