import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
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
  await page.getByText("تست نمای چندصفحه ای").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole("button", { name: "بیشتر " })).toBeVisible();
  await page.getByRole("button", { name: "بیشتر " }).click();
  // await page
  //   .locator("#cdk-overlay-1")
  //   .getByText("گزارش مرتبط 2 default")
  //   .click();
  await page.locator('#cdk-overlay-0').getByText('گزارش مرتبط 2 default').click();
});
