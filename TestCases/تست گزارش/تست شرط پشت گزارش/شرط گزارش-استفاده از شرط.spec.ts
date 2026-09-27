import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("انواع شرط در گزارش").click();
  await page.getByText("شرط گزارش-پرسیده شود").click();
  await page.getByText("شرط گزارش-استفاده از شرط").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(page.getByText("(موردی یافت نشد)")).toBeVisible();
  await page.locator('bsu-ui-num-int-ui').getByRole('textbox').click();
  await page.locator('bsu-ui-num-int-ui').getByRole('textbox').fill("1");
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(page.locator("bsu-no-data")).toContainText("(موردی یافت نشد)");
  await page.locator("fd-popover div input").nth(1).click();
  await page.locator("fd-popover div input").nth(1).fill("تست 1");
  await page.locator("fd-popover div input").nth(1).press("Tab");
  await page.getByRole("textbox", { name: "YYYY/MM/DD" }).fill("1404/01/24");
  await page
    .locator("fd-input-group div span")
    .getByRole("button")
    .nth(1)
    .click();
  await page.getByText("کاربر1").click();
  await page
    .locator("fd-input-group div span")
    .getByRole("button")
    .nth(2)
    .click();
  await page.getByText("تست1").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(page.getByText("‫تست 1‬")).toBeVisible();
});
