import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:8000/#/login");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .locator("bsu-ui-text-field")
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
  await page.locator("bsu-barsa-tree-item li").getByText("Field").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Bw.Msg").click();
  await page.getByText("Bw.Msg(Info-Warning-Error)").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("fd-toolbar")
    .getByRole("button", { name: "Info" })
    .click();
  await page.waitForTimeout(1000);
  await expect(
    page.locator("div").filter({ hasText: /^Msg\.Info$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
