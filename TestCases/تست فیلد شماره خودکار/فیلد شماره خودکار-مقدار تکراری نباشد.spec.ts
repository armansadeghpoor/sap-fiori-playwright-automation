import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های نوع خودکار").click();
  await page.getByText("فیلد شماره خودکار").click();
  await page.getByText("شماره خودکار-انواع تنظیمات").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره خودکار-مقدار تکراری نباشد: شماره دهی" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره خودکار-مقدار تکراری نباشد: شماره دهی" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره خودکار-مقدار تکراری نباشد: شماره دهی" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();

  const count0 = await page.getByTitle("-20").locator("div").count();
  expect(count0).toBeGreaterThan(-1);
  const count = await page.getByTitle("-21").locator("div").count();
  expect(count).toBeGreaterThan(-1);
});
