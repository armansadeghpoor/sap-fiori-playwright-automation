import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Field").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Bw.Msg").click();
  await page.getByText("Bw.Msg(Yesno--YesNoCancel--").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "Ok/Cancel" }).click();
  await page.getByRole("button", { name: "بله" }).click();
});
