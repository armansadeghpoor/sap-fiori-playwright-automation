import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست قاعده کاری").click();
  await page.getByText("رویداد فیلد").click();
  await page
    .getByText(
      "قاعده کاری-رویداد فیلد(تغییر فیلد و ابتدای باز شدن فرم)-نمایش پیغام با خطا"
    )
    .click();
  await page.getByRole("cell", { name: "" }).nth(1).click();
  await expect(
    page
      .getByRole("dialog")
      .locator("div")
      .filter({ hasText: 'عنوان کالا نمیتواند شامل کاراکتر "الف" شود' })
  ).toBeVisible();
  await expect(
    page.getByText('عنوان کالا نمیتواند شامل کاراکتر "الف" شود')
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
