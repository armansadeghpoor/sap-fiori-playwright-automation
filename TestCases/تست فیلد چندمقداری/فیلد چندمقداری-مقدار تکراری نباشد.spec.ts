import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد چندمقداری").click();
  await page.getByText("فیلد چند مقداری-تکراری نباشد- مقدار پیش فرض").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("#fd-input-group-button-id-0").click();
  await page.getByText("آوا").click();
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page.locator("#fd-input-group-button-id-2").click();
  await page.getByText("آوا").click();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "مقدار فیلد 'فیلد چند مقداری-تکراری نباشد- مقدار پیش فرض.مقدار تکراری نباشد' تکرا"
    )
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
