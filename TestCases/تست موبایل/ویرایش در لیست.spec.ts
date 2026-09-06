import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot",
  );
  await page.goto("http://localhost:8000/#/login");
  await page.waitForTimeout(2000);
  await page.reload();
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
  await page.getByText("ویرایش در لیست", { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page.getByText("فیلدهای نوع ساده").click();
  await page.getByTitle("سارا").first().click();
  await page.getByRole("textbox", { name: "سارا" }).fill("موبایل");
  await page.getByRole("button", { name: "ویرایش در لیست" }).click();
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole("button", { name: "بازآوری" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText("موبایل");
});
