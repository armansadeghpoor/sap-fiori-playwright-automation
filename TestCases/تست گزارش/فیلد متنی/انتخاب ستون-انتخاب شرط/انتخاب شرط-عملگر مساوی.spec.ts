import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../../framework/api/environment.api";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";
import { parseArgs } from "util";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد متنی").click();
  await page.getByText("انتخاب ستون و انتخاب شرط").click();
  await page.getByText("فیلد متنی-انتخاب شرط- عملگر =").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("رها");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByText('(موردی یافت نشد)')).toBeVisible();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("فروزان");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator('bsu-ui-table-view')).toContainText('نام سن ‫فروزان‬‫‬');
});
