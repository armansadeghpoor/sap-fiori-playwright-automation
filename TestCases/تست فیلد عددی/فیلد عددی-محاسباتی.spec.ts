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
  await page.getByText("عددی-محاسباتی").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("spinbutton").click();
  await page.getByRole("spinbutton").fill("5");
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("7");
  await expect(page.getByRole("spinbutton")).toHaveValue("5");
  await page.getByRole("textbox").click();
  await expect(page.getByRole("textbox")).toHaveValue("7");
  await expect(page.locator("fd-text")).toContainText("‪12");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
