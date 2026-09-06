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
  await page.getByRole("textbox", { name: "xxxxxxx" }).click();
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Field").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Bw.Msg").click();
  await page.getByText("Bw.Msg(Yesno--YesNoCancel--").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "Yes/No", exact: true }).click();
  await expect(
    page.locator("div").filter({ hasText: /^This is a test Message$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "بله" }).click();
  await expect(
    page.locator("div").filter({ hasText: /^Yes is pressed$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
