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

  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد متنی").click();
  await page.getByText("متنی-غیرترکیبی(به جز فیلد اجباری)").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("combobox").click();
  await page.getByRole("combobox").fill("سارا");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.locator("fd-menu-addon").click();
  await page.getByRole("combobox").click();
  await page.waitForTimeout(4000);
  await page.getByRole("combobox").type("س");
  await page.getByRole("combobox").type("ا");
  await page.getByRole("combobox").type("ر");
  await page.waitForTimeout(4000);
  await page.getByRole("combobox").type("ا");
  await page.keyboard.press("Backspace");
  await page.getByText("سارا").click();
  await page.getByRole("combobox").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("سارا");
});
