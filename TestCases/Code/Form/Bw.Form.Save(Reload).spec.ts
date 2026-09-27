import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Form").click();
  await page.getByText("Save(Reload) //Save(SuccessFn)").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .fill("تست");
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").click();
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").fill("123");
  await page.getByRole("button", { name: "Save Reload" }).click();
  await page.waitForTimeout(3000);
  await expect(
    page.locator("div").filter({ hasText: /^ReloadIsDone:true$/ })
  ).toBeVisible();
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "تایید" }).click();
});
