import { test, expect } from "@playwright/test";

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
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("تست دکمه های سرچ پنل").click();
  await page.locator('span.fd-select__button:has(.sap-icon--slim-arrow-down)').click();//دکمه پاپ‌اپ فیلد جنسیت
  await page.getByText("مرد").click();
  await expect(page.getByLabel('Select an Option')).toContainText('مرد');
  await page.getByRole("button", { name: "جستجو" }).click();
  await page.getByRole("button", { name: "پاک کردن" }).click();
  await expect(page.getByLabel('Select an Option')).toContainText('انتخاب کنید');//چک کنیم که خالی شده باشه
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("32");
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText("‫‪32‬");
  await page.getByRole("button", { name: "پاک کردن" }).click();
  await expect(page.getByRole("textbox")).toBeEmpty();
});
