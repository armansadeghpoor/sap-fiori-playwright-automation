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
  await page.getByRole("link", { name: "3811" }).last().click();
  await page.waitForTimeout(500);
  await page.locator('button:has(.sap-icon--navigation-right-arrow)').first().click();
  await page.locator('button.fd-button.fd-button--transparent', { hasText: /^\s*\d{4}\s*$/ }).click();
  await page.locator('button:has(.sap-icon--navigation-right-arrow)').first().click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: '1404' }).click();
  const currentMonth = new Intl.DateTimeFormat("fa-IR", {
    month: "long",
  }).format(new Date());

  await page.locator('.month-years-wrapper button').first().click();
  await page.getByRole("button", { name: "دی", exact: true }).click();
  await page.waitForTimeout(1000);
  await page.locator('bc-day-number-box')
    .filter({ hasText: '۲۲' })
    .locator('button.inMonth').first().click();
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByTitle("ماه").last().click();
  const isMoreButtonVisible = await page.getByRole("button", { name: "1 بیشتر" }).isVisible();
  if (!isMoreButtonVisible) {
    await expect(page.getByRole('button', { name: 'تست 1' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'تست 3' })).toBeVisible();
  }
});
