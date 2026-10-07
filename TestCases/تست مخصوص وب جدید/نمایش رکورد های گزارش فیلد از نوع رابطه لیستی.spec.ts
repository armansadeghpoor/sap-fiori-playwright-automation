import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator(".fd-avatar__icon").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  await page.getByRole('link', { name: 'نمایش رکورد های گزارش فیلد از نوع رابطه لیستی' }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole('button', { name: 'اضافه به لیست' }).click();
  await page.locator('.tw-flex > .ng-untouched > .fd-checkbox__label > .fd-checkbox__checkmark').first().click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole('link', { name: '‫‬' }).dblclick();
  await page.locator("bsu-ui-text-field input").click();
  await page.locator("bsu-ui-text-field input").fill("تست 1.1");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
