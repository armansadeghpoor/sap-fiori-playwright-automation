import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto("http://localhost:8000/#/login");
  await page.waitForTimeout(2000);
  await page.reload();
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
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("تنظیمات مرتب سازی گزارشات").click();
  await page.getByRole('button', { name: 'تنظیمات' }).click();
  await page.getByText("مرتب سازی", { exact: true }).click();
  await page.locator("#fd-select-0 fd-icon").click();
  await page.getByRole("option", { name: "نام" }).locator("span").click();
  await page.locator("fd-popover-control div span fd-icon").nth(2).click();
  await page.getByText("صعودی").click();
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(page.locator('bsu-ui-table-view')).toContainText('نام سن ‫تست 1‬‫‪3‬‫تست 1‬‫‪1‬‫تست 2‬‫‪2‬‫تست 2.1‬‫‪2‬');
  await page.getByRole('button', { name: 'تنظیمات' }).click();
  await page.getByText("مرتب سازی", { exact: true }).click();
  await page.locator('button[glyph="sys-cancel"]').click();
  await page.locator('fd-icon.sap-icon--slim-arrow-down').nth(3).click();
  await page.getByRole("option", { name: "سن" }).locator("span").click();
  await page.getByTitle(" ", { exact: true }).locator("fd-icon").last().click();
  await page.getByRole("option", { name: "نزولی" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(page.locator('bsu-ui-table-view')).toContainText('نام سن ‫تست 1‬‫‪3‬‫تست 2‬‫‪2‬‫تست 2.1‬‫‪2‬‫تست 1‬‫‪1‬');
  await page.getByRole('button', { name: 'تنظیمات' }).click();
  await page.getByText("مرتب سازی", { exact: true }).click();
  await page.locator('button[glyph="sys-cancel"]').click();
  await page.locator('fd-icon.sap-icon--slim-arrow-down').nth(3).click();
  await page.getByRole("option", { name: "سن" }).locator("span").click();
  await page.getByTitle(" ", { exact: true }).locator("fd-icon").last().click();
  await page.getByText("صعودی").click();
  await page.locator('button[glyph="add"]').click();
  await page.locator('span:has(.sap-icon--slim-arrow-down)').nth(2).click();
  await page.getByRole("option", { name: "نام" }).locator("span").click();
  await page.locator('span:has(.sap-icon--slim-arrow-down)').nth(3).click();
  await page.getByText("نزولی").click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole('button', { name: 'تنظیمات' }).click();
  await page.getByText("مرتب سازی", { exact: true }).click();
  await page.getByRole("button", { name: "تنظیم مجدد" }).click();
  await expect(page.locator('bsu-ui-grid-sort-setting')).toContainText('');
  await page.getByRole("button", { name: "تایید" }).click();
});
