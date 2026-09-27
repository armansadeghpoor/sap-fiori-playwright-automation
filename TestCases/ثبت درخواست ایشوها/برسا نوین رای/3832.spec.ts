import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page.getByRole("link", { name: "3832" }).last().click();
  await page.locator('button.fd-button.fd-button--transparent', { hasText: /^\s*\d{4}\s*$/ }).click();
  await page.locator('bc-calendar-selection-days button[fdtype="transparent"]').first().click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: '1404' }).click();
  // ۱. نام ماه جاری را به صورت دینامیک بگیرید
  const currentMonth = new Intl.DateTimeFormat("fa-IR", {
    month: "long",
  }).format(new Date());

  // ۲. لوکیتور اصلاح شده
  await page
    .locator("button.fd-button--transparent") // پیدا کردن دکمه‌های شفاف
    .filter({ hasText: currentMonth }) // فیلتر کردن بر اساس نام ماه
    .click();
  await page.getByRole("button", { name: "دی", exact: true }).click();
  await page
    .locator("button.inMonth")
    .getByText("۲۳", { exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("روز", { exact: true }).click();
  await page.getByText("روز", { exact: true }).click();
  await page.getByTitle("ListView").click();
  await expect(
    page.getByText("جلسه دموی آنلاین سیستم ساز با شرکت آب وخاک"),
  ).toBeVisible();
  await page
    .locator("button.inMonth")
    .getByText("۲۴", { exact: true })
    .first()
    .click();
  await page
    .locator("button.inMonth")
    .getByText("۲۵", { exact: true })
    .first()
    .click();
  await expect(
    page.getByText("جلسه دموی آنلاین منابع انسانی با ایرانسل"),
  ).toBeVisible();
  await page
    .locator("button.inMonth")
    .getByText("۲", { exact: true })
    .first()
    .click();
  await expect(page.getByText("(موردی یافت نشد)")).toBeVisible();
});
