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
