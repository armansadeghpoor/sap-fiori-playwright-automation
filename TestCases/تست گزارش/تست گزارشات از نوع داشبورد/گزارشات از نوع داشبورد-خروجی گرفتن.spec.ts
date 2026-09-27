import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
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
