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
  await expect(page.getByRole('button', { name: 'جمع‌کردن همه' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'کارتابل ارسال شده' })).toBeVisible();
  await page.getByRole('link').first().click();//زدن روی ایکون میزکار الکترونیک
  await expect(page.getByRole('button', { name: 'جمع‌کردن همه' })).not.toBeInViewport();
  await expect(page.getByRole('link', { name: 'کارتابل ارسال شده' })).not.toBeInViewport();
  // await expect(page.getByText('سیستم میزکار الکترونیک')).not.toBeInViewport();
});
