import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("فایل-لیست خطی-انتخاب چند نوع").click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await page.getByText("لایسنس سرور.pdf").click();
  await page.locator('fd-button-bar[glyph="resize"] button').click();
  await page.getByRole('button', { name: 'close' }).click();
  await page.getByText("word.pdf").click();
  await page.locator('fd-button-bar[glyph="resize"] button').click();
  await page.getByRole('button', { name: 'close' }).click();
});
