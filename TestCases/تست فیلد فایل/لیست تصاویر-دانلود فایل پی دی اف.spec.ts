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
  await page.locator(".fd-avatar__icon").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page
    .getByRole("listitem")
    .filter({ has: page.getByText("تست مخصوص وب جدید", { exact: true }) })
    .click();
  await page.getByTitle("سیستم تست وب جدید").click();
  await page.getByRole("link", { name: "لیست تصاویر-دانلود فایل PDF" }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: " دانلود" }).click();
  const download2Promise = page.waitForEvent("download");
  await page.locator(".fd-card__content > .ng-star-inserted").first().click();
  const download2 = await download2Promise;
});
