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
