import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["Pixel 7"],
});

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
  await page.getByRole("tab", { name: "تست موبایل-تایل default" }).click();
  await page
    .getByRole("heading", { name: "دیده نشدن قسمت پایین فرم در موبایل" })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "مرحله بعد" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "شماره دهی" }).click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("کاربر1").click();
});
