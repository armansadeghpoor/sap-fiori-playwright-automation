import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Field").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Bw.Field").click();
  await page.getByText("Field.GetSetting").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("label").nth(2).click();
  await page.getByRole("button", { name: "GetSetting", exact: true }).click();
  await expect(
    page.locator("div").filter({ hasText: /^setting\.ViewType\.Is=RadioBox$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "ذخیره", exact: true }).click();
  await page.locator("label").filter({ hasText: "نادرست" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "GetSetting", exact: true }).click();
  await expect(
    page.locator("div").filter({ hasText: /^setting\.ViewType\.Is=RadioBox$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
