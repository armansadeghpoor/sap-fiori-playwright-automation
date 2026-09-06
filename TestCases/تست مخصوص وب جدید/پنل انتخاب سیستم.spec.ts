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
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "سیستم تست کاربرانتست کاربران" })
    .click();
  await page.locator("#headerCollapse").click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await expect(
    page
      .getByRole("listitem")
      .filter({ hasText: "سیستم تست کاربرانتست کاربران" }),
  ).toHaveClass(/selected/);
  await page.getByText("تست کد").click();
  await page.locator("#headerCollapse").click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "تست کدکدنویسی وب" })
    .click();
  await page.locator("#headerCollapse").click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await expect(
    page.getByRole("listitem").filter({ hasText: "تست کدکدنویسی وب" }),
  ).toHaveClass(/selected/);
});
