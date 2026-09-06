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
  await page.waitForTimeout(4000);
  await page.locator('fd-shellbar-context-area span[glyph="search"]').click();
  await page.locator("#fd-input-group-input-id-0").fill("@@@");
  await expect(page.getByRole('link', { name: 'تست @@@ سیستم ثبت درخواست ایشوها > برسا نوین رای > 3854' })).toBeVisible();
  await page.locator("#fd-input-group-input-id-0").fill("$$$");
  await expect(
    page.locator("a").filter({ hasText: "تست $$$Default" }),
  ).toBeVisible();
});
