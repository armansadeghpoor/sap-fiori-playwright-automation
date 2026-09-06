import { test, expect } from "@playwright/test";
test.setTimeout(50000);
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
