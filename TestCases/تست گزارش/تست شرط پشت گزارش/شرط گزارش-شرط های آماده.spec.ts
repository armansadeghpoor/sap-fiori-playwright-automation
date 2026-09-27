import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("انواع شرط در گزارش").click();
  await page.getByText("شرط گزارش-شرط های آماده").click();
  await page.getByText("شرط گزارش - شرط های آماده").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(page.getByText("جدید عنوان وضعیت تعداد ‫تست 1")).toBeVisible();
});
