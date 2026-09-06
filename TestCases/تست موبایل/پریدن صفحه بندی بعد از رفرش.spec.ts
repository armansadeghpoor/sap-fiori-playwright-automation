import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
  test.setTimeout(25000);
  await page.goto("http://localhost:8000/#/login");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .fill("راهبر");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
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
