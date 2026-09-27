import { test, expect, devices } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("تست نمای چندصفحه ای").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole('button', { name: 'بیشتر' })).toBeVisible();
  await page.getByRole('button', { name: 'بیشتر' }).click();
  await page.locator('#cdk-overlay-0').getByText('گزارش مرتبط 2 default').click();
});
