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
  await page.getByText('سیستم تست کاربران').click();
  await page.locator("#headerCollapse").click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await expect(page.getByRole('menuitem', { name: 'سیستم تست کاربران' })).toHaveClass(/selected/);
  await page.getByText("تست کد").click();
  await page.locator("#headerCollapse").click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText('سیستم تست کاربران', { exact: true }).click();
  await page.getByText('کدنویسی وب').click();
  await page.locator("#headerCollapse").click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await expect(
    page.getByRole('menuitem', { name: 'تست کد' })
  ).toHaveClass(/selected/);
});
