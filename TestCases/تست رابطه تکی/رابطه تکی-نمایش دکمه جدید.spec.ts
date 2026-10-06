import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه تکی").click();
  await page
    .getByText("رابطه تکی-نمایش از دکمه جدید و انتتخاب از لیست Popup")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();

  await page
    .locator("bsu-layout-control", { hasText: "نمایش دکمه جدید" })
    .getByRole("combobox")
    .click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.locator('button:has(.sap-icon--add)').first().click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("سرمه ای");
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByTitle("سرمه ای").locator("div")).toBeVisible();
});
