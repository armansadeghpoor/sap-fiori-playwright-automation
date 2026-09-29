import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../../framework/api/environment.api";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("انواع شرط در گزارش").click();
  await page.getByText("گزارش در فیلد متنی").click();
  await page.getByText("انتخاب ستون و انتخاب شرط").click();
  await page.getByText("فیلد متنی-انتخاب شرط- عملگر مقدار داشته باشد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator('bsu-ui-table-view')).toContainText('نام سن ‫تست انتخاب شرط کد‬‫‪18‬');
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تستی");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator('bsu-ui-table-view')).toContainText('نام سن ‫تست انتخاب شرط کد‬‫‪18‬‫تستی‬‫‬');
});
