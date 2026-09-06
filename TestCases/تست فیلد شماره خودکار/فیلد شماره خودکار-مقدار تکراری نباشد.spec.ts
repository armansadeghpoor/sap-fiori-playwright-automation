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
  await page.getByText("فیلد های نوع خودکار").click();
  await page.getByText("فیلد شماره خودکار").click();
  await page.getByText("شماره خودکار-انواع تنظیمات").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره خودکار-مقدار تکراری نباشد: شماره دهی" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره خودکار-مقدار تکراری نباشد: شماره دهی" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره خودکار-مقدار تکراری نباشد: شماره دهی" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();

  const count0 = await page.getByTitle("-20").locator("div").count();
  expect(count0).toBeGreaterThan(-1);
  const count = await page.getByTitle("-21").locator("div").count();
  expect(count).toBeGreaterThan(-1);
});
