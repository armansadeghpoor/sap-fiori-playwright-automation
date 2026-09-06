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
  await page.getByRole("button", { name: "ورود" }).click();
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
