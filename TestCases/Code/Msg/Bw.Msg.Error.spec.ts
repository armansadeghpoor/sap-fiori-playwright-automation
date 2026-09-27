import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Field").click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("Bw.Msg", { exact: true })
    .click();
  await page.getByText("Bw.Msg(Info-Warning-Error)").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("fd-toolbar")
    .getByRole("button", { name: "Error" })
    .click();
  await expect(
    page.locator("div").filter({ hasText: /^Msg\.Error$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
