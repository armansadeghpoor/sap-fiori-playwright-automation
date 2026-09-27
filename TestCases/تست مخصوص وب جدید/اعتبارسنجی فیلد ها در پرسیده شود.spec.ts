import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
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
