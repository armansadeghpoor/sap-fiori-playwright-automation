import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
await page.getByRole('button', { name: 'App Launcher' }).click();
await page.getByText('تست مخصوص وب جدید', { exact: true }).click();
await page.getByRole('link', { name: 'ریسپانسیو بودن فیلدها در فرم' }).click();
await page.getByRole('link', { name: '‫تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست تست ر‬', exact: true }).dblclick();
await page.waitForTimeout(1500);
await expect(page.getByTitle('بولین چک باکس4', { exact: true })).toBeVisible();
await expect(page.getByTitle('بولین چک باکس3', { exact: true })).toBeVisible();
await expect(page.getByTitle('بولین چک باکس2', { exact: true })).toBeVisible();
await expect(page.getByTitle('بولین چک باکس1', { exact: true })).toBeVisible();
await expect(page.getByText('بولین-دکمه رادیویی: درست نادرست')).toBeVisible();
});
