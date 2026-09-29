import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("Mo", { exact: true })
    .click();
  await page.getByText("GetId").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("bsu-ui-text-field").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("fd-dialog-header")).toContainText("اطلاعات");
  await page.getByRole("button", { name: "تایید" }).click();
});
