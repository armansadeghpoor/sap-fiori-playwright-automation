import { test, expect } from "@playwright/test";
//import { barrier } from "barrier";
test("test", async ({ page }) => {
  //await barrier.wait();
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
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Field").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Bw.Field").click();
  await page.getByText("setBold").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "SetBold", exact: true }).click();
  await expect(
    page.locator("div").filter({ hasText: /^SetBold IS True$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "SetBold", exact: true }).click();
  await page.getByRole("button", { name: "تایید" }).click();
});
