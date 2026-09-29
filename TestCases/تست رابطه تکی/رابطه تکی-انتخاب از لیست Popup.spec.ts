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
    .getByText("رابطه تکی-نمایش از دکمه جدید و انتتخاب از لیست Popup")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).last().click();
  await page.getByRole('button', { name: 'جستجو' }).click();
  await page.getByText("‫زرد32‬").click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByText("‫زرد32‬")).toBeVisible();
});
