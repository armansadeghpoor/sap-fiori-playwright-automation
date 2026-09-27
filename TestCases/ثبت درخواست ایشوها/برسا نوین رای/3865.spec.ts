import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await expect(page.locator("body")).toHaveAttribute("theme", "sap_horizon");
  await page.locator(".fd-avatar__icon").click();
  await page.getByRole("menuitem", { name: "تنظیمات" }).click();
  await page.locator('.fd-select__button:has(.sap-icon--slim-arrow-down)').first().click();
  await page.getByText("sap_horizon_dark").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.goto("http://localhost:8000/#/home");
  await expect(page.locator("body")).toHaveAttribute(
    "theme",
    "sap_horizon_dark",
  );
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole("menuitem", { name: "تنظیمات" }).click();
  await page.locator('.fd-select__button:has(.sap-icon--slim-arrow-down)').first().click();
  await page.getByText("sap_horizon", { exact: true }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("body")).toHaveAttribute("theme", "sap_horizon");
});
