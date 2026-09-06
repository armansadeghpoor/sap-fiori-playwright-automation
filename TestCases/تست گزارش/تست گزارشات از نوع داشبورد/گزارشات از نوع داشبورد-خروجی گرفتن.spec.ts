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
  await page.getByText("تست داشبورد 1").click();
  await page.waitForTimeout(3000);
  await expect(
    page
      .locator('iframe[name="ppppp"]')
      .contentFrame()
      .locator("dashboard-viewer")
  ).toMatchAriaSnapshot(
    `- img: "راهبر سیستم: ۳۰٫۰۰٪ کاربر1: ۳۰٫۰۰٪ کاربر2: ۲۰٫۰۰٪ کاربر3: ۲۰٫۰۰٪ واحد مربوطه (تعداد)"`
  );
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .getByRole("button", { name: "خروجی به" })
    .click();
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .locator(".dx-item.dx-tile.dx-state-hover > .dx-item-content")
    .click();
  await expect(
    page
      .locator('iframe[name="ppppp"]')
      .contentFrame()
      .locator("#ASPxDashboard1")
  ).toMatchAriaSnapshot(`
    - button "تنظیم مجدد"
    - button "خروجی"
    - button "انصراف"
    `);
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .getByRole("button", { name: "close" })
    .click();
});
