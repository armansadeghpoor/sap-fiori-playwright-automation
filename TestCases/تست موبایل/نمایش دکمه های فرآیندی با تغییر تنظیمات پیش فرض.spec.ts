import { test, expect, devices } from "@playwright/test";
const iPhone = devices["Pixel 7"];
test.setTimeout(45000);
test.use({ ...iPhone });
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
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.waitForTimeout(1000);
  await page.getByText("فرم مودال-تغییر تنظیمات پیش فرض فرآیند").click();
  await expect(
    page.getByText("انتخاب کنید ارسال ذخیره و بستن انصراف"),
  ).toBeVisible();
  await page.getByRole("button", { name: "انتخاب کنید" }).click();
  await page.getByText("رد", { exact: true }).click();
  await page.getByRole("button", { name: "ارسال" }).click();
  await expect(page.getByText("ثبت درخواست ذخیره و بستن انصراف")).toBeVisible();
  await page.getByRole("button", { name: "ثبت درخواست" }).click();
});
