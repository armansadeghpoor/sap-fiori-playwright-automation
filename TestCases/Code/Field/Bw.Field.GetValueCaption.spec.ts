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
  await page.getByText("GetValue- GetValueCaption-").click();
  await page.getByText("6666").click();
  await page.getByRole("row", { name: "6666" }).getByRole("button").click();
  await page.getByRole("button", { name: "دکمه نمایش Caption" }).click();
  await expect(
    page.locator("div").filter({ hasText: /^caption of Field IS6666$/ })
  ).toBeVisible();
});
