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
  await page
    .getByText("رابطه تکی-انواع تنظیمات-کالاهای موجود در انبار")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("#fd-input-group-button-id-0").click();
  await page.getByText("12").click();
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page.locator("#fd-input-group-button-id-3").click();
  await page.getByText("12").click();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "مقدار فیلد 'کالاهای موجود در انبار.فاکتور -مقدار تکراری نباشد' تکراری است (",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
