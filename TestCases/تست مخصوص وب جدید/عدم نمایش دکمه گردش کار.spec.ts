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
    .getByRole("heading", { name: "به هم ریختگی نما در مولتی سلکت ها" })
    .click();
  await expect(page.locator('#fd-toolbar-3')).toMatchAriaSnapshot(`
    - toolbar:
      - button "تنظیمات"
      - button "جدید"
      - button "ویرایش" [disabled]
      - button "حذف" [disabled]
      - button "بازآوری"
    `);
});
