import { test, expect } from "@playwright/test";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await page.goto("http://localhost:8000/#/login");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .fill("راهبر");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await expect(page.getByRole('button', { name: 'جمع‌کردن همه' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'کارتابل ارسال شده' })).toBeVisible();
  await page.getByRole('link').first().click();//زدن روی ایکون میزکار الکترونیک
  await expect(page.getByRole('button', { name: 'جمع‌کردن همه' })).not.toBeInViewport();
  await expect(page.getByRole('link', { name: 'کارتابل ارسال شده' })).not.toBeInViewport();
  // await expect(page.getByText('سیستم میزکار الکترونیک')).not.toBeInViewport();
});
