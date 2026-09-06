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
  await page
    .getByRole("heading", { name: "پریدن صفحه بندی بعد از رفرش" })
    .click();
  await page.getByRole('link', { name: '‫تست 1‬' }).dblclick();
  await expect(page.getByRole('heading', { name: 'پریدن صفحه بندی بعد از رفرش :تست' })).toContainText('پریدن صفحه بندی بعد از رفرش :تست 1');
  await page.locator('button[itemid="MoveNext"]').click();
  await expect(page.getByRole('heading', {
    name:
      'پریدن صفحه بندی بعد از رفرش :تست'
  })).toContainText('پریدن صفحه بندی بعد از رفرش :تست 2');
  await page.waitForTimeout(700);
  await page.locator('fd-toolbar').filter({ hasText: 'ذخیره' }).click();
  await page.waitForTimeout(700);
  await page.locator('button[itemid="MoveNext"]').click();
  await expect(page.getByRole('heading', {
    name:
      'پریدن صفحه بندی بعد از رفرش :تست'
  })).toContainText('پریدن صفحه بندی بعد از رفرش :تست 3');
  await page.waitForTimeout(1000);
  await page.locator('button[itemid="MovePrev"]').click();
  await expect(page.getByRole('heading', {
    name:
      'پریدن صفحه بندی بعد از رفرش :تست'
  })).toContainText('پریدن صفحه بندی بعد از رفرش :تست 2');
});
