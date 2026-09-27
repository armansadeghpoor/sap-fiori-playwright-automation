import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('.fd-avatar__icon').click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("link").nth(5).click();
  await page
    .getByRole("link", { name: "فیلد رابطه لیستی-رابطه دارد-انواع نمایش" })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole('button', { name: 'اضافه به لیست' })).toBeVisible();
});
