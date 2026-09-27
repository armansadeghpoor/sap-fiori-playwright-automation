import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
test.setTimeout(50000);
test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page.getByRole("link", { name: "باگ باز کردن fullScreen" }).last().click();
  await page.waitForTimeout(7000);
  await page.getByText("‫*حذف نشود*‬").dblclick();
  await page.locator('button', { has: page.locator('.sap-icon--overflow') }).first().click();
  await page.locator('a').filter({ hasText: 'تمام صفحه همه' }).click();
  await page.getByRole("button", { name: "close", exact: true }).click();
  await page.locator('button:has(.sap-icon--overflow)').nth(1).click();
  await page.locator("a").filter({ hasText: "تمام صفحه همه" }).click();
  await page.locator('bsu-file-viewer-content fd-card img[imglazy]').first().click();
  await page.locator('bsu-file-viewer-content fd-card img[imglazy]').nth(1).click();
  await page.locator('bsu-file-viewer-content fd-card img[imglazy]').nth(2).click();
  await page.getByRole("button", { name: "close", exact: true }).click();
});
