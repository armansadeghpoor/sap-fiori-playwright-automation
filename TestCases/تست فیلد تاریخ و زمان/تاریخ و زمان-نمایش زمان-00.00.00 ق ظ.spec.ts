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
  await page.locator("#fd-input-group-input-id-3").click();
  await page.locator("#fd-input-group-input-id-3").fill("10:44");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText(
    "10:44:00 ق.ظ"
  );
});
