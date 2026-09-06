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
  await page
    .locator("bsu-ui-button")
    .filter({ hasText: /^ورود$/ })
    .click();
  await page.getByRole("button", { name: "Navigation" }).click();

  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد عددی").click();
  await page
    .getByText("عددی-غیرترکیبی(تکراری نباشد-غیر قابل ویرایش و آیکون)")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عددی-تکراری نباشد:" })
    .getByRole("spinbutton")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عددی-تکراری نباشد:" })
    .getByRole("spinbutton")
    .fill("100");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عددی-تکراری نباشد:" })
    .getByRole("spinbutton")
    .click();
  await page.waitForTimeout(2000);
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عددی-تکراری نباشد:" })
    .getByRole("spinbutton")
    .fill("100");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("fd-dialog-body div")).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
