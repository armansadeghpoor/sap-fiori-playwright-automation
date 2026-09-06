import { test, expect } from "@playwright/test";

test.use({
  storageState: "localstorage.json",
});

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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page
    .getByRole("heading", { name: "نمایش دکمه ها در اورفلو فرم" })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  const formToolbar = page.locator('bsu-form-toolbar');
  await expect(formToolbar).toContainText('دستور تست 1دستور تست 2دستور تست 3دستور تست 4دستور تست 5دستور تست 6دستور تست 7دستور تست 8دستور تست 9دستور تست 10 ذخیره');
  await page.getByRole("button", { name: "More" }).click();
  await expect(page.getByText('ذخیره و جدید')).toBeVisible();
});
