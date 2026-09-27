import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارشات از نوع داشبورد").click();
  await page.getByText("تست داشبورد 2").click();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("زیرساخت").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(
    page
      .locator('iframe[name="ppppp"]')
      .contentFrame()
      .locator("dashboard-viewer")
  ).toMatchAriaSnapshot(
    `- img: ۰ ۰٫۵ ۱ ۱٫۵ ۲ وضعیت تاهل (تعداد) ۵ ۱۰ ۱۵ ۲۰ ۲۵ وضعیت تاهل (تعداد)`
  );
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("پشتیبانی").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(
    page
      .locator('iframe[name="ppppp"]')
      .contentFrame()
      .locator("dashboard-viewer")
  ).toMatchAriaSnapshot(
    `- img: ۰ ۰٫۵ ۱ ۱٫۵ ۲ وضعیت تاهل (تعداد) ۵ ۱۰ ۱۵ ۲۰ ۲۵ وضعیت تاهل (تعداد)`
  );
  await page.getByRole("button", { name: "پاک کردن" }).click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("انتخاب کنید").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(
    page
      .locator('iframe[name="ppppp"]')
      .contentFrame()
      .locator("dashboard-viewer")
  ).toMatchAriaSnapshot(
    `- img: "پروژه: ۳۰٫۰۰٪ پشتیبانی: ۴۰٫۰۰٪ زیرساخت: ۳۰٫۰۰٪ کاربر (تعداد)"`
  );
});
