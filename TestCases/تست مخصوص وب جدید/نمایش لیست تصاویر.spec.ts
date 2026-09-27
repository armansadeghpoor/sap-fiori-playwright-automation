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
  await page
    .getByRole("link", { name: "نمایش لیست تصاویر-کامپوننت و بدون کامپوننت" })
    .click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await page.getByRole("tab", { name: "لیست تصاویر-بدون کامپوننت" }).click();
  await expect(page.getByRole("button", { name: "دانلود" })).toBeVisible();
  await page.getByRole("tab", { name: "لیست تصاویر-همراه کامپوننت" }).click();
  await page.locator(".tw-w-full").first().click();
  await page.locator(".tw-w-full").nth(2).click();
});
