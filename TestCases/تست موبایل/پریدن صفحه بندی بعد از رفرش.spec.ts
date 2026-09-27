import { test, expect, devices } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
  test.setTimeout(25000);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.locator('#fd-list-item-29').getByText('پریدن صفحه بندی بعد از رفرش').click();
  await page.waitForTimeout(2000);
  await expect(page.locator("fd-dynamic-page-content")).toBeVisible();
  await expect(page.locator("tbody")).toContainText("تست 12");
  await expect(
    page.getByRole("navigation", { name: "از 1 تا 24 تعداد (50)" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await page.reload();
  await page.waitForTimeout(3000);
  await expect(page.getByText("تست 12")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
});
