import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("ویرایش در لیست", { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page
    .getByText(
      "گزارش از نوع فرم-(دانشجو)ویراش در فرم -رابطه گزارش عکس تکی لیستی"
    )
    .click();
  await page
    .getByRole("row", { name: "‫سارا‬ ‫کمالی‬ ‫‪9878‬ " })
    .getByRole("button")
    .click();
  await page.getByRole("cell", { name: "‫فرزند‬" }).click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.locator("#fd-list-item-73").click();
  await page.getByTitle('ویرایش در لیست').click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page
    .getByRole("row", { name: "‫سارا‬ ‫کمالی‬ ‫‪9878‬ " })
    .getByRole("button")
    .click();
  await expect(page.getByRole("cell", { name: "‫همسر‬" })).toBeVisible();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
