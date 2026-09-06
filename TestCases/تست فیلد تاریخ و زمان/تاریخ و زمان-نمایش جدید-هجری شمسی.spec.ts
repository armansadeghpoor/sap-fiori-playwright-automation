import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto("http://localhost:8000/#/login");
  await page.waitForTimeout(2000);
  await page.reload();
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
  await page.getByText("فیلد تاریخ و زمان").click();
  await page.getByText("فیلد تاریخ وزمان- نمایش جدید در وب جدید").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "select day" }).click();
  await page.locator("fd-toolbar div").getByRole("button").nth(3).click(); //   await page.getByRole('button', { name: '1404' }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "1382" }).click();
  await page.locator("fd-toolbar").getByRole("button").nth(6).click(); //   await page.getByRole('button', { name: 'مهر' }).click();
  // await page
  //   .getByRole("button", { name: "بهمن", exact: true })
  //   .and(page.locator('[aria-label="بهمن"]'))
  //   .click();
  await page.getByRole('button', { name: 'بهمن' }).click();
  await page.getByRole("button", { name: "۱۹" }).click();
  await page.getByRole("spinbutton").nth(1).click();
  await page.getByRole("spinbutton").nth(1).fill("12");
  await page.getByRole("spinbutton").first().click();
  await page.getByRole("spinbutton").first().fill("12");
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(
    page.getByRole("textbox", { name: "YYYY/MM/DD HH:mm" })
  ).toHaveValue("۱۳۸۲/۱۱/۱۹ ۱۲:۱۲");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "" }).click();
  await expect(
    page.getByRole("textbox", { name: "YYYY/MM/DD HH:mm" })
  ).toBeVisible();
});
