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
