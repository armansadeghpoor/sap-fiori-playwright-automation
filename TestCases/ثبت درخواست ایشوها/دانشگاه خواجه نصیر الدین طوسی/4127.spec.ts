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
  await page.getByLabel('ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست').getByText('ثبت درخواست ایشوها').click();
  await page.getByRole('link', { name: '4127' }).last().click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).first().click();
  await page.getByRole('button', { name: 'جستجو' }).nth(1).click();
  await page.getByRole('button', { name: 'جستجو', description: 'Default Action' }).click();
  await expect(page.locator('a').filter({ hasText: '‫تست24‬' })).toBeVisible();
  await page.getByRole('button', { name: 'Page 2' }).click();
  await page.getByRole('button', { name: 'Page 3' }).click();
  await page.getByRole('button', { name: 'انصراف' }).click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).nth(1).click();
  await page.getByRole('button', { name: 'جستجو' }).nth(2).click();
  await page.getByRole('button', { name: 'جستجو', description: 'Default Action' }).click();
  await expect(page.locator('a').filter({ hasText: '‫تست24‬' })).toBeVisible();
  await page.getByRole('button', { name: 'Page 2' }).click();
  await page.getByRole('button', { name: 'Page 3' }).click();
  await page.getByRole('button', { name: 'انصراف' }).click();
});
