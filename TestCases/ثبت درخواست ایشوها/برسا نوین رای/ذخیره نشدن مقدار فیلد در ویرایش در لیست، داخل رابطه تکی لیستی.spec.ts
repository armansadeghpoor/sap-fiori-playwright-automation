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
  const mainMenuButton = page.locator('button.fd-shellbar__button--menu');
  await mainMenuButton.click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page
    .getByRole("link", {
      name: "ذخیره نشدن مقدار فیلد در ویرایش در لیست، داخل رابطه تکی لیستی",
    }).last()
    .click();
  await page.locator('button', { has: page.locator('.sap-icon--navigation-left-arrow') }).click();//باز کردن رکورد حذف نشود با استفاده از دکمه
  await expect(page.locator('bsu-barsa-table-row')).toContainText('‫‪10‬');
  await page.locator('a').filter({ hasText: '‫‪10‬' }).click();
  await page.getByRole('cell', { name: '10' }).getByRole('textbox').fill('');
  await page.getByTitle('ویرایش در لیست', { exact: true }).click();
  await expect(page.locator('bsu-barsa-table-row')).toContainText('‫‬');
});
