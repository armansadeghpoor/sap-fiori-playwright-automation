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
  await page.getByText("فیلد تاریخ و زمان").click();
  await page.getByText("فیلد تاریخ و زمان-چپ به راست").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "select day" }).click();
  await page.getByRole("button", { name: "امروز" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.locator('bsu-barsa-row-inline-actionlist').getByRole("button").first().click();
  await expect(page.getByRole('combobox', { name: 'HH:mm' })).toBeVisible();
  await expect(page.locator('fd-input-group input')).not.toBeEmpty();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("td").first()).toBeVisible();
});
