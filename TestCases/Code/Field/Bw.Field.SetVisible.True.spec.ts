import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
//import { barrier } from "barrier";

test("test", async ({ page }) => {
  //await barrier.wait();
  await loginAs(page, users.rahbar);
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
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "show Field" }).click();
  await expect(
    page.locator("div").filter({ hasText: /^SetVisibleIsDone:true$/ })
  ).toBeVisible();
});
