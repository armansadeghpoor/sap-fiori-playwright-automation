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
  await page.getByRole("link", { name: "3858" }).last().click();
  await expect(page.locator("bsu-ui-table-view")).toBeVisible();
  await expect(page.locator('bsu-ui-table-view')).toContainText('تاریخ و زمان 1 تاریخ و زمان 2 ‫1404/11/21 13:00‬‫1404/11/19 12:00‬‫1404/11/21 12:00‬‫1404/11/19 13:00‬‫1404/11/21 12:00‬‫1404/11/19 14:00‬‫1404/11/20 13:00‬‫1404/11/21 12:00‬‫1404/11/20 12:00‬‫1404/11/22 12:18‬‫1404/11/20 12:00‬‫1404/11/22 12:19‬‫1404/11/19 13:00‬‫1404/11/24 12:30‬‫1404/11/19 12:00‬‫1404/11/20 11:20‬‫1404/11/19 12:00‬‫1404/11/20 12:20‬');

});
