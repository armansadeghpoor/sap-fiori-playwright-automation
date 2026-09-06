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


  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد عددی").click();
  await page.getByText("عددی-کمترین مقدار").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .fill("66.6660");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("fd-dialog-body div")).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .press("End");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .fill("6600.000");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .press("ArrowRight");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "کمترین مقدار اعشاری:" })
    .getByRole("textbox")
    .fill("120.6530");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
