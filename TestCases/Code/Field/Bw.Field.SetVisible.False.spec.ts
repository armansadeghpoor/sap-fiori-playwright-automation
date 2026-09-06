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
  await page
    .locator("bsu-ui-button")
    .filter({ hasText: /^ورود$/ })
    .click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Field").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Bw.Field").click();
  await page.getByText("SetVisible").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "Hide Field" }).click();
  await expect(
    page.locator("div").filter({ hasText: /^SetVisibleIsDone:false$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole('link', { name: '‫تست‬' }).dblclick();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Hide Field" }).click();
  await expect(
    page.locator("div").filter({ hasText: /^SetVisibleIsDone:false$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
