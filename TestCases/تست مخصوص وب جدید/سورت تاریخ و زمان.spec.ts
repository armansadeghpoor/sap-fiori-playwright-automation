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
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  // await page.getByTitle("سیستم تست وب جدید").click();
  await page.getByRole("link", { name: "سورت تاریخ و زمان" }).click();
  await expect(page.locator("bsu-ui-table-view")).toContainText(
    "تاریخ و زمان 1 تاریخ و زمان 2 ‫1404/12/04 13:00‬‫1404/12/01 12:00‬‫1404/12/04 12:00‬‫1404/12/02 12:15‬‫1404/12/04 12:00‬‫1404/12/02 12:30‬‫1404/12/04 11:00‬‫1404/12/03 13:00‬‫1404/12/03 13:00‬‫1404/12/01 12:00‬‫1404/12/03 12:00‬‫1404/12/01 12:00‬‫1404/12/03 12:00‬‫1404/12/02 12:15‬‫1404/12/03 11:00‬‫1404/12/02 12:30‬‫1404/12/02 13:00‬‫1404/12/01 12:00‬‫1404/12/02 12:00‬‫1404/12/01 12:30‬‫1404/12/02 11:00‬‫1404/12/02 12:15‬‫1404/12/02 11:00‬‫1404/12/03 13:00‬",
  );
});
