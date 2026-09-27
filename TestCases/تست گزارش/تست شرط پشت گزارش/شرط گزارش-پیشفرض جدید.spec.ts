import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("انواع شرط در گزارش").click();
  await page.getByText("شرط گزارش-پرسیده شود").click();
  await page.getByText("شرط گزارش-پیشفرض جدید").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(
    page.getByText(
      "جدید عنوان تعداد رابطه تکی کاربر تاریخ ‫تست 1‬‫‪1‬‫تست1‬‫کاربر1‬‫1404/01/24 ‬"
    )
  ).toBeVisible();
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").click();
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").fill("1");
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(
    page.getByText(
      "جدید عنوان تعداد رابطه تکی کاربر تاریخ ‫تست 1‬‫‪1‬‫تست1‬‫کاربر1‬‫1404/01/24 ‬"
    )
  ).toBeVisible();
});
