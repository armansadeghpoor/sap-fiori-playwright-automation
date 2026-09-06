import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  test.setTimeout(50000);
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
    .fill(" راهبر");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند", { exact: true }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("کد تغییر وضعیت", { exact: true }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("درخواست");
  await page
    .getByRole("button", { name: "کد تغییر وضعیت", exact: true })
    .click();
await expect(page.locator('div').filter({ hasText: 'شرح درخواست:درخواستوضعیت درخواست:ثبت شده' }).nth(3)).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
