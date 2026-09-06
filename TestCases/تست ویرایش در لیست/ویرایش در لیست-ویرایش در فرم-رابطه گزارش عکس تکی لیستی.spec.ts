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
  await page.getByText("ویرایش در لیست", { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page
    .getByText(
      "گزارش از نوع فرم-(دانشجو)ویراش در فرم -رابطه گزارش عکس تکی لیستی"
    )
    .click();
  await page
    .getByRole("row", { name: "‫سارا‬ ‫کمالی‬ ‫‪9878‬ " })
    .getByRole("button")
    .click();
  await page.getByRole("cell", { name: "‫فرزند‬" }).click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.locator("#fd-list-item-73").click();
  await page.getByTitle('ویرایش در لیست').click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page
    .getByRole("row", { name: "‫سارا‬ ‫کمالی‬ ‫‪9878‬ " })
    .getByRole("button")
    .click();
  await expect(page.getByRole("cell", { name: "‫همسر‬" })).toBeVisible();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
