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
  await page.getByText("فیلد مبلغ").click();
  await page.getByText("مبلغ-ریال-انواع مشخصات").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "مبلغ-ریال-چپ به راست:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "مبلغ-ریال-چپ به راست:" })
    .getByRole("textbox")
    .fill("12,345,6789");
  await expect(
    page
      .locator("bsu-layout-control")
      .filter({ hasText: "مبلغ-ریال-چپ به راست:" })
      .getByRole("textbox")
  ).toHaveValue("123,456,789");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "" }).click();
  await expect(
    page
      .locator("bsu-layout-control")
      .filter({ hasText: "مبلغ-ریال-چپ به راست:" })
      .getByRole("textbox")
  ).toBeVisible();
});
