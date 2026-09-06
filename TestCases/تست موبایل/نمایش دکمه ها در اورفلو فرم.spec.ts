import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["Pixel 7"],
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
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("tab", { name: "تست موبایل-تایل default" }).click();
  await page
    .getByRole("heading", { name: "نمایش دکمه ها در اورفلو فرم" })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.locator("fd-dynamic-page-header")).toContainText(
    "نمایش دکمه ها در اورفلو فرم دستور تست 1",
  );
  await page.getByRole("button", { name: "More" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "دستور تست 2دستور تست 3دستور تست 4دستور تست 5دستور تست 6دستور تست 7دستور تست 8دستور تست 9دستور تست 10 ذخیره",
  );
});
