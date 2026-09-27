import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه تکی").click();

  await page
    .getByText("رابطه تکی-انواع تنظیمات-کالاهای موجود در انبار")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole('heading', { name: 'کالاهای موجود در انبار :' })).toBeVisible();
  await page
    .locator("bsu-ui-mo-info-combo-viewer")
    .getByRole("textbox")
    .click();
});
