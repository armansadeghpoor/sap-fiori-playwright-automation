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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page
    .getByRole("heading", { name: "فیلتر بازه زمانی-شمسی و میلادی" })
    .click();
  await page.locator("#fd-input-group-button-id-0").click();
  await page.locator("a").filter({ hasText: "بازه زمانی دلخواه" }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'از' }).click();
  await page.getByRole('button', { name: 'select day' }).first().click();
  const calendarHeader = page.locator('.month-years-wrapper');

  //انتخاب سال
  await calendarHeader.locator('button').nth(1).click();
  const yearCell = page.getByRole('button', { name: '1404' });
  const navNextBtn = page.locator('button:has(.sap-icon--navigation-right-arrow)');
  const isYearVisible = await yearCell.isVisible({ timeout: 2000 }).catch(() => false);
  if (!isYearVisible) {
    await navNextBtn.click();
  }
  await yearCell.click();
  // await page.getByRole('button', { name: '1404', description: 'emphasized' }).click();//جفتش کلیک میشه

  //انتخاب ماه
  await calendarHeader.locator('button').first().click();
  await page.getByRole('button', { name: 'آذر' }).click();
  await page.getByLabel("آذر 3,").getByText("3").click();
  await page.getByLabel("آذر 6,").getByText("6").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(
    page
      .locator("fd-dynamic-page-content div")
      .filter({ hasText: "جدید شمسی میلادی ‫1404/09/04" })
  ).toBeVisible();
  await page.getByRole("button", { name: "پاک کردن" }).click();
  await page.locator("#fd-input-group-button-id-1").click();
  await page.locator("a").filter({ hasText: "بازه زمانی دلخواه" }).click();
  await page.locator("ui5-icon").click();
  //   await page.getByText("نوامبر").click();
  await page.locator("div[data-ui5-cal-header-btn-month]").click();
  await page.getByRole("gridcell", { name: "نوامبر", exact: true }).click();
  await page.getByText("24", { exact: true }).first().click();
  await page.getByText("27").click();
  await page.getByRole("button", { name: "جستجو" }).click();
});
