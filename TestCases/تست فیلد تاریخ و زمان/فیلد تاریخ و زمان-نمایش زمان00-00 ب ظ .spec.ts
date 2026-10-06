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
  await page.getByText("فیلد زمان-نمایش مختلف زمان").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox", { name: "HH", exact: true }).click();
  await page.getByRole("textbox", { name: "HH", exact: true }).fill("16:30");
  await page.locator("#fd-input-group-button-id-1").click();
  await page
    .locator("#fd-time-column-216")
    .getByRole("button", { name: "16" })
    .click();
  await page.getByText("30").nth(2).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText("04:30 ب.ظ");
});
