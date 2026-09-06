import { test, expect } from "@playwright/test";
test.setTimeout(45000);
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
  await page.getByRole("link", { name: "3853" }).last().click();
  await expect(page.getByText("(موردی یافت نشد)")).toBeVisible();
  await page.waitForTimeout(500);
  const processBtn = page.getByRole("button", { name: "اجرای فرآیند" });
  await processBtn.dblclick({ delay: 50 });
  await page.waitForTimeout(5000);
  await page.getByTitle('Close').click();
  await page.getByTitle("بازآوری").click();
  const rows = page.locator('bsu-barsa-table-row');
  await expect(rows).toHaveCount(1);
});
