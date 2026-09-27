import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارشات از نوع داشبورد").click();
  await page.getByText("تست داشبورد 1").click();
  await page.waitForTimeout(5000);
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .locator(".dxc-markers > path:nth-child(4)")
    .click();
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .locator(".dxc-markers > rect:nth-child(2)")
    .first()
    .click();
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .getByRole("option", { name: " _ متاهل" })
    .getByRole("checkbox")
    .click();
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .getByRole("img")
    .filter({ hasText: "۱۱۳۳۱۲۱۲۱۵۱۵۱۸۱۸" })
    .locator("rect")
    .nth(2)
    .click();
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .locator(".dxc-markers > path:nth-child(4)")
    .click();
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .getByRole("checkbox", { name: "" })
    .click();
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .locator("div")
    .filter({ hasText: /^در حال بارگذاری\.\.\.$/ })
    .nth(1)
    .click();
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .getByRole("option", { name: "_ متاهل" })
    .getByRole("checkbox")
    .click();
  await page
    .locator('iframe[name="ppppp"]')
    .contentFrame()
    .getByRole("option", { name: "_ مجرد" })
    .getByRole("checkbox")
    .click();
  await expect(
    page
      .locator('iframe[name="ppppp"]')
      .contentFrame()
      .locator("dashboard-viewer")
  ).toMatchAriaSnapshot(`
    - toolbar: تست نمودار
    - img: ۰ ۱ ۲ ۳ ۴ ۵ مقادیر متاهل مجرد واحد مربوطه (تعداد) نام (تعداد)
    - toolbar: تست نمودار کیکی
    - img: "راهبر سیستم: ۳۰٫۰۰٪ کاربر1: ۳۰٫۰۰٪ کاربر2: ۲۰٫۰۰٪ کاربر3: ۲۰٫۰۰٪ واحد مربوطه (تعداد)"
    - toolbar: تست نقشه درختواره ای
    - img: ۱۱ ۳۳ ۵۵ ۱۲۱۲ ۱۴۱۴ ۱۵۱۵ ۱۸۱۸ ۲۹۲۹
    - toolbar: تست فیلتر
    - listbox:
      - checkbox "" [checked]
      - text: (همه)
      - option " _ متاهل" [selected]:
        - checkbox "" [checked]
      - option " _ مجرد" [selected]:
        - checkbox "" [checked]
    `);
});
