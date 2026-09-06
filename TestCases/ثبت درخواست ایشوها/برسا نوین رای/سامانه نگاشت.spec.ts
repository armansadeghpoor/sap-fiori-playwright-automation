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
  await page.getByRole("link", { name: "سامانه نگاشت" }).last().click();
  await page.getByText("‫*حذف نشود*‬").dblclick();
  const toolbar = page.locator('fd-toolbar');
  await Promise.all([
    expect(toolbar.locator('button[glyph="delete"]')).toBeVisible(),
    expect(toolbar.locator('button[glyph="attachment"]')).toBeVisible(),
    expect(toolbar.locator('button:has(.sap-icon--download)')).toBeVisible(),
    expect(toolbar.locator('button:has(.sap-icon--refresh)')).toBeVisible()
  ]);
  await page
    .getByRole("tab", { name: "فایل ورد-همراه با ویژگی پیشرفته default" })
    .click();
  const toolbar2 = page.locator('fd-toolbar');
  await Promise.all([
    expect(toolbar2.locator('button:has(.sap-icon--download)')).toBeVisible(),
    expect(toolbar2.locator('button:has(.sap-icon--refresh)')).toBeVisible(),
  ])
});
