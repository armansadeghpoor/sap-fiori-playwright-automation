import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("heading", { name: "نمایش گزارش زیرفرم" }).click();
  await page.getByRole("button", { name: "جزئیات" }).first().click();
  await page.waitForTimeout(700);
  await page.getByRole('link', { name: '‫تست 1‬' }).dblclick();
  await page.waitForTimeout(700);
  await page.getByTitle('Close').click();
  await page.getByRole("button", { name: "مخفی" }).click();
  await page.getByRole("button", { name: "جزئیات" }).nth(2).click();
  await page.getByRole("tab", { name: "گزارش مرتبط-بدون صفحه بندی" }).click();
});
