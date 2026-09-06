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
  await page.getByText("رابطه عکس لیستی").click();
  await page.getByText("رابطه لیستی-شامل است-پرسنل").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").fill("علی");
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox", { name: "YYYY/MM/DD" }).click();
  await page.getByRole("textbox", { name: "YYYY/MM/DD" }).fill("1403/10/10");
  await page.getByRole("textbox", { name: "HH:mm" }).click();
  await page.getByRole("textbox", { name: "HH:mm" }).fill("09:00");
  await page
    .locator("div")
    .filter({ hasText: "تاریخ:زمان: پرسنل مرتبط" })
    .nth(3)
    .click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page
    .getByText("رابطه عکس لیستی-شامل است-غیر قابل ویرایش-چپ به راست-تردد")
    .click();
  await page.getByRole("button", { name: "" }).click();
  // await expect(
  //   page.locator("#fdp-icon-tab-bar-tab-2").getByRole("toolbar")
  // ).toBeVisible();
  await page.getByRole("button", { name: "" }).click();
});
