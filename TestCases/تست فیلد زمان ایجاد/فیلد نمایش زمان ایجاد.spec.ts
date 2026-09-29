import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های سیستمی").click();
  await page.getByText("فیلد زمان ایجاد").click();
  await page.getByText("فیلد نمایش زمان ایجاد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  const dateTimeRegex = /\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/;
  const elements = page.getByTitle(dateTimeRegex).locator("div");
  await expect(elements).toHaveCount(1);
});
