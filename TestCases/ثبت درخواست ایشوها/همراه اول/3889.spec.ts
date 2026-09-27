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
