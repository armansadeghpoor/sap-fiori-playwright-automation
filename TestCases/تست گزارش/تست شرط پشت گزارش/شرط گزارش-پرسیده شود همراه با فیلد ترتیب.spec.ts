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
  await page.getByText("انواع شرط در گزارش").click();
  await page.getByText("شرط گزارش-پرسیده شود").click();
  await page.getByText("شرط گزارش-پرسیده شود همراه با فیلد ترتیب").click();
  await page.getByRole("combobox").click();
  await page.getByRole("combobox").fill("تست");
  await page.keyboard.press("Backspace");
  await page.getByRole("combobox").click();
  await page.getByRole("combobox").fill("تست");
  await expect(page.locator('fd-popover-body').last()).toContainText(
    "تست 639تست 640تست 641تست 642تست 643تست 644تست 645"
  );
});
