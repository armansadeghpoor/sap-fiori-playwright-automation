import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto("http://localhost:8000/#/login");
  await page.waitForTimeout(2000);
  await page.reload();
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
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد چندمقداری").click();
  await page.getByText("فیلد چند مقداری-تکراری نباشد- مقدار پیش فرض").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator('fd-icon.sap-icon--navigation-down-arrow').first().click();
  await page.locator('fd-icon.sap-icon--navigation-down-arrow').last().click();
  await expect(page.locator("fd-popover-body")).toMatchAriaSnapshot(`
    - dialog:
      - listbox:
        - listitem: انتخاب کنید
        - listitem: آبی
        - listitem: سبز
        - listitem: سفید
        - listitem: زرد
        - listitem: صورتی
    `);
  await page.getByText("سبز").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByRole('cell', { name: '‫سبز‬' })).toBeVisible();
});
