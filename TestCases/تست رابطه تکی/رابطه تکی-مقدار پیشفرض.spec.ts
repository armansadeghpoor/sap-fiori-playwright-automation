import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه تکی").click();
  await page
    .getByText("دانشجو-رابطه تکی-فیلد محاسباتی و مقدار پیش فرض")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole("combobox", { name: "انتخاب کنید" })).toHaveValue(
    "جغرافیا"
  );
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText("‫جغرافیا‬");
});
