import { test, expect } from "@playwright/test";

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
  await page.getByText('تست فیلد').click();
  await page.getByText('فیلد های ساده').click();
  await page.getByText('فیلد بولین').click();
  await page.getByText("درست/نادرست-انواع نمایش").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .getByTitle("درست/نادرست-نمایش پیش فرض", { exact: true })
    .locator("label span")
    .click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
