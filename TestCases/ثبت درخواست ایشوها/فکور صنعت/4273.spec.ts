
import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
import { recordingDevices } from "../../../framework/config/recording-devices";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("4273", async ({ page }) => {
  test.setTimeout(90000);

  await loginAs(page, users.rahbar);

  const logo = page.locator(
    "fd-shellbar-logo a.fd-shellbar__logo"
  );

  await page.locator(".fd-avatar__icon").click();

  await page.getByRole("menuitem", {
    name: "تنظیمات",
  }).click();

  await page.getByRole("combobox", {
    name: "Select an Option",
    description: "sap_fiori_3",
  }).click();

  await page.getByRole("option", {
    name: "sap_fiori_3_dark",
  }).click();

  await page.getByRole("button", {
    name: "ذخیره و بستن",
  }).click();

  await expect(logo).toBeVisible();

  await expect(logo).toHaveCSS(
    "background-image",
    /GetPictureFromFileInfo/
  );

  const firstLogoBackground = await logo.evaluate(
    (element) => getComputedStyle(element).backgroundImage
  );

  await page.locator("fd-user-menu-control").click();

  await page.getByRole("menuitem", {
    name: "تنظیمات",
  }).click();

  await page.getByRole("combobox", {
    name: "Select an Option",
    description: "sap_fiori_3",
  }).click();

  await page.getByRole("option", {
    name: "sap_fiori_3",
    exact: true,
  }).click();

  await page.getByRole("button", {
    name: "ذخیره و بستن",
  }).click();

  await page.locator("fd-user-menu-control").click();

  await page.getByRole("menuitem", {
    name: "تنظیمات",
  }).click();

  await page.getByRole("combobox", {
    name: "Select an Option",
    description: "sap_fiori_3",
  }).click();

  await page.getByRole("option", {
    name: "sap_horizon",
    exact: true,
  }).click();

  await page.getByRole("button", {
    name: "ذخیره و بستن",
  }).click();

  await expect(logo).toBeVisible();

  await expect(logo).toHaveCSS(
    "background-image",
    /GetPictureFromFileInfo/
  );

  await expect(logo).not.toHaveCSS(
    "background-image",
    firstLogoBackground,
    { timeout: 15000 }
  );
});
