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
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های نوع فایل").click();
  await page.getByText("فیلد فایل word").click();
  await page.getByText("فایل word", { exact: true }).click();
  await page.getByRole("row", { name: "‫اصلی‬ " }).getByRole("button").click();
  await page.getByRole("button", { name: "" }).click();
  // کلیک برای فعال‌کردن فایل‌اینپوت (اگر lazy-load بشه)
  await page.click('button[glyph="attachment"]');
  // انتظار برای حضور input
  await page.waitForSelector('input[type="file"]', {
    state: "attached",
    timeout: 5000,
  });
  // انتخاب فایل
  await page
    .locator('input[type="file"]')
    .setInputFiles("موارد سیستم حضور غیاب(صادق پور).docx");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "" }).click();
  const download = await downloadPromise;
});
