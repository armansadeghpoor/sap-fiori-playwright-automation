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
  await page.getByRole("link", { name: "3889" }).last().click();
  await expect(page.locator("bsu-column-renderer div").getByText("‫ت4‬")).toHaveCSS(
    "color",
    "rgb(0, 0, 139)",
  );
  await page.locator(".fd-avatar__icon").click();
  await page.getByRole("menuitem", { name: "تنظیمات" }).click();
  await page.getByRole('combobox', { name: 'Select an Option' }).first().click();
  await page.getByText("sap_horizon_dark").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).last().click();
  await page.getByRole('button', { name: 'ذخیره و بستن' }).first().click();
  await page.getByTitle('بازآوری').click();
  await expect(page.locator("bsu-column-renderer div").getByText("‫ت4‬")).toHaveCSS(
    "color",
    "rgb(0, 0, 139)",
  );
  await page.getByTitle("بازآوری").click();
  await page.getByText("‫ت4‬").click();
  await expect(page.locator("bsu-column-renderer div").getByText("‫ت4‬")).toHaveCSS(
    "color",
    "rgb(114, 114, 255)",
  );
});
