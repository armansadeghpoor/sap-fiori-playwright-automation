import { test, expect } from "@playwright/test";
import { snapshot } from "node:test";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot",
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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await expect(page).toHaveURL('http://localhost:8000/#/home');
  await page.getByRole("heading", { name: "3864" }).click();
  await page.getByRole("button", { name: "ذخیره", exact: true }).click();
  await page.waitForTimeout(1000);
  await page.getByTitle('Close').click();
  await expect(page).toHaveURL('http://localhost:8000/#/home');
  await expect(
    page.getByRole("tab", { name: "تست مخصوص وب جدید - تایل" }),
  ).toBeVisible();
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await expect(
    page.getByRole("button", { name: "Product Switch" }),
  ).toBeVisible();
  await page.getByRole("heading", { name: "3864" }).last().click();
  await page.getByRole("button", { name: "ذخیره", exact: true }).click();
  await page.waitForTimeout(1000);
  await page.getByTitle('Close').click();
  await expect(
    page.getByRole("button", { name: "Product Switch" }),
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: "تست مخصوص وب جدید - تایل" }),
  ).toBeVisible();
});
