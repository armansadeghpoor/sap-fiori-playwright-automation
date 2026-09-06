import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  test.setTimeout(65000);
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
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند", { exact: true }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("انتساب نقش-نحوه توزیع کار-همه افراد").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان تیکت:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان تیکت:" })
    .getByRole("textbox")
    .fill("تیکت007");
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("پشتیبانی").click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.locator("#fd-avatar-0 fd-icon").click();
  await page.getByRole("menuitem", { name: "خروج" }).click();
  await page.getByRole("button", { name: "بله" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .fill("کاربر2");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند", { exact: true }).click();
  await page.getByText("زمان مقداردهی انتساب نقش").click();
  await page.getByText("انتساب نقش-نحوه توزیع کار-همه افراد").click();
  await page.getByRole("button", { name: "" }).click();
  await page.waitForTimeout(500);
  await page.getByTitle('Close').click();
  await page.getByTitle("تیکت007").locator("div").dblclick();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("پاسخ007");
  await page.getByRole("button", { name: "تایید" }).click();
});
