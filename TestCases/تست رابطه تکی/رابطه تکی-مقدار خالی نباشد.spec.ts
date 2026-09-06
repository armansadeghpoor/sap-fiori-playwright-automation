import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto("http://localhost:8000/#/login");
  await page.waitForTimeout(2000);
  await page.reload();
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
  await page.getByRole("textbox", { name: "راهبر" }).click();
  await page.getByRole("textbox", { name: "راهبر" }).fill("راهبر");
  await page.getByRole("textbox", { name: "xxxxxxx" }).click();
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه تکی").click();
  await page.getByText("رابطه تکی-مقدار خالی نباشد-کودک").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "اشکال در مقادیر فرم لیست ورود و خروج- مقدار خالی نباشد: فیلد `لیست ورود و خروج- "
    )
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.getByText(":30 ب.ظ").click();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-ui-table-view")).toContainText(
    "نام لیست ورود و خروج- مقدار خالی نباشد ‫نام2‬‫ 01:50 ب.ظ‬‫سارا‬‫ 03:32 ب.ظ‬‫تست‬‫ 07:30 ب.ظ‬"
  );
});
