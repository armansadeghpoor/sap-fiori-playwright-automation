import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("فیلد کد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator(".view-line").click();
  await page
    .getByRole("textbox", { name: "Editor content;Press Alt+F1" })
    .fill('return("Test")');
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole('link', { name: '‫return("Test")‬' }).dblclick();
  await page.locator(".view-line").click();
  await page
    .getByRole("textbox", { name: "Editor content;Press Alt+F1" })
    .fill('return("Test complete")');
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByText('‫return("Test complete")‬')).toBeVisible();
});
