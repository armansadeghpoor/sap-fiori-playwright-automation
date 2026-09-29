import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../../framework/api/environment.api";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد عددی").click();
  await page.getByText("انتخاب ستون و انتخاب شرط").click();
  await page.getByText("فیلدعددی-انتخاب شرط-عملگر <>(").click();
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
    .fill("6");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .press("Tab");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "تعداد فرزند:" })
    .getByRole("textbox")
    .fill("6");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "" }).click();
  await expect(
    page
      .locator("fd-dynamic-page-content div")
      .filter({ hasText: "جدید شماره بیمه تعداد فرزند (موردی یافت نشد)" })
  ).toBeVisible();
});
