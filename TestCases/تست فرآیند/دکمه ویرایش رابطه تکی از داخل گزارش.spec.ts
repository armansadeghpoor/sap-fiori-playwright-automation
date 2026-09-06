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
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند", { exact: true }).click();
  await page.getByText("محل باز شدن فرم").click();
  await page.getByText("دکمه ویرایش رابطه تکی").click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("combobox", { name: "انتخاب کنید" }).click();
  await page
    .getByRole("combobox", { name: "انتخاب کنید" })
    .fill("آدرس تست 5.1.1");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-column-renderer")).toContainText(
    "‫آدرس تست 5.1‬"
  );
});
