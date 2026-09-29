import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Form").click();
  await page.getByText("GetIsChanged").click();
  await page.getByText("تهران").click();
  await page
    .locator("bsu-barsa-table-row td")
    .getByRole("button")
    .first()
    .click();
  await page.getByRole("textbox", { name: "تهران" }).click();
  await page.getByRole("textbox", { name: "تهران" }).fill("تهرا");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByText("GetIsChangedIs:false")).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
