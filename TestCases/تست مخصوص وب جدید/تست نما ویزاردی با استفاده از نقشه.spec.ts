import { test, expect } from "@playwright/test";

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
  await page.getByText("تست نما Wizard").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await expect(page.locator("bsu-layout-actions")).toMatchAriaSnapshot(`
    - button "arrow right"
    - button "arrow left"
    `);
  await page.getByRole("button", { name: "arrow left" }).click();
  await page.getByRole("button", { name: "select day" }).click();
  await page.getByRole("button", { name: "امروز" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "arrow left" }).click();
  await page.getByRole("button", { name: "arrow right" }).click();
  await expect(page.getByText("تاریخ شروع:")).toBeVisible();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "arrow left" }).click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("دانشگاه").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByRole("region", { name: "Wizard" }).locator("bsu-ui-ulv-main-ui"),
  ).toBeVisible();
});
