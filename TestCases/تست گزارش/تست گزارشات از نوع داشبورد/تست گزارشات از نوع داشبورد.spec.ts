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
