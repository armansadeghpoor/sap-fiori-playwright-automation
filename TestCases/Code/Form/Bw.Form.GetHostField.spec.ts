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
  await page.locator("bsu-barsa-tree-item li").getByText("Form").click();
  await page.getByText("GetHostField").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByText("فیلد تستی:").click();
  await page
    .locator("bsu-layout-control bsu-ui-text-field input")
    .last()
    .click();
  await page
    .locator("bsu-layout-control bsu-ui-text-field input")
    .last()
    .fill("1");
  await expect(page.locator("fd-dialog-body div")).toBeVisible();
  await page.locator("fd-dialog-body div").click();
  await expect(page.locator("fd-dialog-body")).toContainText(
    "frm.GetHostFieldIsDone"
  );
});
