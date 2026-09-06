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
  await page.getByText("تست گزارش").click();
  await page.getByText("انواع شرط در گزارش").click();
  await page.getByText("جستجو").click();
  await page.getByText("بررسی اتوکامپلیت در جستجو رابطه عکس تکی تکی").click();
  await page.getByRole("combobox").click();
  await page.getByRole("combobox").fill("معاو");
  await page.keyboard.press("Backspace");
  await page.waitForTimeout(1000);
  await expect(page.getByText("معاون")).toContainText("معاون");
  await page.getByRole("combobox").click();
  await page.getByRole("combobox").press("ArrowDown");
  await page.getByText("معاون").press("Enter");
  await page.getByRole("button", { name: "جستجو", exact: true }).click();
  await expect(page.getByText("‫علوی‬")).toBeVisible();
});
