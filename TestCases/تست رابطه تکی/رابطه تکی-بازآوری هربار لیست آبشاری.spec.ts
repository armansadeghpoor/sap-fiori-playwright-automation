import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه تکی").click();
  await page.getByText("سمت-موجودیت مرجوع-بازآوری هربار لیست ابشاری").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("کارشناسی پیوسته");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page
    .getByText(
      "رابطه تکی-بازآوری هربار لیست ابشاری-پرسنل-سمت هایی رو بیار که شامل کارشناسی باشد",
      { exact: true }
    )
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await expect(page.locator('fd-popover-body').last()).toContainText('کارشناسی کارشناسی01 کارشناسی 02 کارشناسی ارشد11 کارشناسی برق کارشناسی پیوسته');
  await page.getByText("کارشناسی پیوسته").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByText("‫کارشناسی پیوسته‬")).toBeVisible();
});
