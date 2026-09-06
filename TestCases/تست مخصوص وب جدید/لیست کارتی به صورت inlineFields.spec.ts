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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page.getByRole("heading", { name: "نمایش توضیحات در گرید" }).click();
  await expect(page.locator("bsu-card-view-content")).toContainText(
    "تست 2عنوان‫تست 2‬توضیحات‫تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36‬"
  );
});
