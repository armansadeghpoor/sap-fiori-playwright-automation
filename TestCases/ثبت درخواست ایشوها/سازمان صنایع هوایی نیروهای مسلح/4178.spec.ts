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

test("4178", async ({ page }) => {
  await loginAs(page, users.rahbar);

  // Navigation
  await page.locator(".fd-avatar__icon").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole("button", { name: "App Launcher" }).click();

  await page.getByRole("menuitem", {
    name: "تست پشتیبانی نمونه مشابه تیکت های پشتیبانی",
  }).click();

  await page.getByRole("link", { name: "21825" }).click();
  await page.getByRole("button", { name: "جدید" }).click();

  // Verify initial form
  await expect(page.locator("#fd-panel-content-0")).toMatchAriaSnapshot(`
    - region:
      - checkbox "بولین 1"
      - text: "بولین 1 فایل1:"
      - checkbox "بولین2"
      - text: "بولین2 فایل2:"
  `);

  await page.getByText('بولین 1').click();
  await page.getByRole('checkbox', { name: 'بولین 1' }).check();
  await page.getByTitle('بولین2').click();
  await page.getByRole('checkbox', { name: 'بولین2' }).check();

  await expect(page.locator("#fd-panel-content-0")).toMatchAriaSnapshot(`
    - region:
      - checkbox "بولین 1" [checked]
      - text: "بولین 1 فایل1:"
      - button "پیوست فایل"
      - checkbox "بولین2" [checked]
      - text: "بولین2 فایل2:"
      - button "پیوست فایل"
  `);

  await page.getByText('بولین3').click();
  await page.getByRole('checkbox', { name: 'بولین3' }).check();


  await expect(page.locator("#fd-panel-content-1")).toMatchAriaSnapshot(`
    - region:
      - checkbox "بولین3" [checked]
      - text: "بولین3 تاریخ3:"
      - textbox
      - text: "فایل3:"
      - button "پیوست فایل"
      - text: "متن3:"
      - textbox
  `);
});