import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../../framework/api/environment.api";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("#fd-list-item-5").click();
  await page.getByText("گزارش در فیلد عددی").click();
  await page.getByText("انتخاب ستون و انتخاب شرط").click();
  await page.getByText("فیلدعددی-انتخاب شرط-مقدار داشته باشد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .fill("5");

  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "" }).dblclick();
  await expect(
    page
      .locator("fd-dynamic-page-content div")
      .filter({ hasText: "جدید شماره بیمه تعداد فرزند (موردی یافت نشد)" })
  ).toBeVisible();
});
