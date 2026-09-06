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
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page.getByRole("link", { name: "CB18809" }).last().click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.locator('button[glyph="search"]').click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'جستجو', exact: true }).last().click();
  await expect(page.getByText("‫ت1‬")).toBeVisible();
  await page.getByRole("combobox").nth(1).click();
  await page.getByRole("combobox").nth(1).fill("11");
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'جستجو', exact: true }).last().click();
  await expect(page.getByText("‫ت11‬")).toBeVisible();
});
