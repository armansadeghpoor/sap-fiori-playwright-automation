
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
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("کندی در تایپ فیلد متن").click();
  await page.getByTitle("تست 1", { exact: true }).locator("div").click();
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "تست" })
    .fill("تست 1 تست تست تست ست تست تست ");
  await page.getByRole("textbox", { name: "تست" }).press("Tab");
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "تست" })
    .fill("تست 1.1 تست تست تست تست تست ");
  await page.getByRole("textbox", { name: "تست" }).press("Tab");
  await page.waitForTimeout(500);
  await page.getByTitle("تست 1.1 تست تست تست تست تست ").locator("div").click();
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "تست 1.1 تست تست تست تست تست" })
    .fill("تست 1.1 تست تست ");
});
