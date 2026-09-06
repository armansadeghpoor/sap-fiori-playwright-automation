import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  test.setTimeout(60000);
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
    .fill("کاربر1");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page
    .locator("div")
    .filter({ hasText: /^اجرای فرآیندها$/ })
    .nth(2)
    .click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("تست سمت آغازکننده فرآیند").click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("نام1");
  await page.getByRole("textbox").press("Tab");
  await page.getByRole("spinbutton").fill("45");
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(page.locator('div').filter({ hasText: 'نام:نام1شماره پرسنلی:‪45' }).nth(3)).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "تایید" }).click();
});
