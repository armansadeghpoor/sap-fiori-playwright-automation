import { test, expect } from "@playwright/test";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot",
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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page.getByRole("link", { name: "3866" }).last().click();
  await expect(page.locator("bsu-ui-table-view")).toBeVisible();
  await expect(page.locator("bsu-ui-table-view")).toContainText(
    "عنوان ‫تست 1‬‫تست 2‬‫تست 3‬‫تست 4‬‫تست 5‬‫تست 6‬‫تست 7‬‫تست 8‬‫تست 9‬‫تست 10‬",
  );
  await page.getByText("‫تست 1‬").dblclick();
  await page.waitForTimeout(1000);
  await page.getByTitle('Close').click();
  await page.getByText("‫تست 1‬").dblclick();
  await page.locator("fd-toolbar").getByRole("button").nth(1).click(); //دکمه پایین تولبار
  await page.waitForTimeout(1000);
  await page.locator("fd-toolbar").getByRole("button").nth(1).click(); //دکمه پایین تولبار
  await page.waitForTimeout(1500);
  await page.locator("fd-toolbar").getByRole("button").nth(1).click(); //دکمه پایین تولبار
  await page.getByTitle('Close').click();
  await expect(page.locator('bsu-ui-table-view')).toContainText('عنوان ‫تست 1‬‫تست 2‬‫تست 3‬‫تست 4‬‫تست 5‬‫تست 6‬‫تست 7‬‫تست 8‬‫تست 9‬‫تست 10‬');
  await page.getByText("‫تست 1‬").dblclick();
  await expect(page.getByRole("textbox", { name: "تست" })).toHaveValue("تست 1");
  await page.getByTitle('Close').click();
  await page.locator("fd-toolbar").getByRole("button").nth(2).click(); //دکمه بالای تولبار
});
