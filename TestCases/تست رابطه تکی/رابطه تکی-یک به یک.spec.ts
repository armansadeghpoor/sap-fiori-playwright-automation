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
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه تکی").click();
  await page.getByText("رابطه تکی-یک به یک", { exact: true }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .fill("تست");
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.getByRole('button', { name: 'جدید', exact: true }).click();
  await page.locator("label").filter({ hasText: "دکتری" }).click();
  await page.getByRole("button", { name: "select day" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "1405" }).click();
  await page.waitForTimeout(1000);
  await page.getByLabel("1405").click();
  await page.waitForTimeout(1000);
  // await page.getByRole("button", { name: "تیر" }).click();
  await page.locator("fd-toolbar div").getByRole("button").nth(2).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "تیر" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "۲۴" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("combobox", { name: "انتخاب کنید" }).click();
  await page.getByRole("combobox", { name: "انتخاب کنید" }).fill("5");
  await page.keyboard.press("Backspace");
  await page.getByRole("combobox", { name: "انتخاب کنید" }).fill("5");
  await page.getByText("/04/24").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "مقدار فیلد 'آخرین مدرک تحصیلی' در موجودیت 'رابطه تکی-یک به یک' تکراری است!"
    )
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
