import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
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
