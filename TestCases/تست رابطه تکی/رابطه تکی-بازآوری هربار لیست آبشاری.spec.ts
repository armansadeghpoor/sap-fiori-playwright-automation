import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
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
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه تکی").click();
  await page.getByText("سمت-موجودیت مرجوع-بازآوری هربار لیست ابشاری").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("کارشناسی پیوسته");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page
    .getByText(
      "رابطه تکی-بازآوری هربار لیست ابشاری-پرسنل-سمت هایی رو بیار که شامل کارشناسی باشد",
      { exact: true }
    )
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await expect(page.locator('fd-popover-body').last()).toContainText('کارشناسی کارشناسی01 کارشناسی 02 کارشناسی ارشد11 کارشناسی برق کارشناسی پیوسته');
  await page.getByText("کارشناسی پیوسته").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByText("‫کارشناسی پیوسته‬")).toBeVisible();
});
