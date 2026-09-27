import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
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
