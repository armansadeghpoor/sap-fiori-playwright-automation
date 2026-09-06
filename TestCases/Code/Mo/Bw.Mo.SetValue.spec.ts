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

  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("Mo", { exact: true })
    .click();
  await page.getByText("SetValue").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(
    page.locator("div").filter({ hasText: /^Value of Mo IsTestSetValue$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(page.getByRole("textbox", { name: "TestSetValue" })).toHaveValue(
    "TestSetValue"
  );
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();

  await expect(page.getByText("‫TestSetValue‬")).toBeVisible();
});
