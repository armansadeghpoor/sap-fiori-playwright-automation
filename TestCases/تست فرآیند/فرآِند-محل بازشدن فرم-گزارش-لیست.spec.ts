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
    .fill("راهبر");
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
  await page.getByText("تست فرآیند").click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("فرم-محل بازشدن فرم-گزارش لیستی").click();
  await page.getByRole("button", { name: "close", exact: true }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "تایید" }).click();
  await page
    .locator("bt-barsa-shellbar")
    .getByRole("button", { name: "Navigation" })
    .click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("محل باز شدن فرم").click();
  await page.getByText("گزارش-لیست", { exact: true }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByTitle("تست").locator("div")).toBeVisible();
});
