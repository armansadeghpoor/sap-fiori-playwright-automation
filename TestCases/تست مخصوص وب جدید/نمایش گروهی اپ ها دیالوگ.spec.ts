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
  await page.getByRole("heading", { name: "نمایش گروهی اپ ها دیالوگ" }).click();
  await expect(
    page.getByRole("heading", { name: "دانلود فایل در موبایل" }),
  ).toBeVisible();
  await page.getByRole("heading", { name: "دانلود فایل در موبایل" }).click();
  await expect(
    page.getByLabel("Breadcrumb Trail").getByText("دانلود فایل در موبایل"),
  ).toBeVisible();
});
