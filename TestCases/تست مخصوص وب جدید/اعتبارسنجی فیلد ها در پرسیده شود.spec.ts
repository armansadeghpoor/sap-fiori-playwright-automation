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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  await page
    .getByRole("link", { name: "اعتبارسنجی فیلد ها در پرسیده شود" })
    .click();
  await page.getByRole('region', { name: 'Collapsed Header' }).getByRole('textbox').click();
  await page.getByRole('region', { name: 'Collapsed Header' }).getByRole('textbox').fill('12');
  await page.getByRole("button", { name: "جستجو" }).last().click();
  await expect(page.locator('div').filter({ hasText: /^اشکال در مقادیر فرم پرسیده شود: مقدار ورودی `تعداد` نمی تواند کمتر از 18 باشد\.$/ })).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "پاک کردن" }).click();
  await page.getByRole('region', { name: 'Collapsed Header' }).getByRole('textbox').click();
  await page.getByRole('region', { name: 'Collapsed Header' }).getByRole('textbox').fill("80");
  await page.getByRole("button", { name: "جستجو" }).last().click();
  await expect(
    page.locator('div').filter({ hasText: /^اشکال در مقادیر فرم پرسیده شود: مقدار ورودی `تعداد` نمی تواند بیشتر از 50 باشد\.$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "پاک کردن" }).click();
});
