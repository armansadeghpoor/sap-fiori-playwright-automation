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
