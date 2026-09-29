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
  await page.getByText("GetHostField").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByText("فیلد تستی:").click();
  await page
    .locator("bsu-layout-control bsu-ui-text-field input")
    .last()
    .click();
  await page
    .locator("bsu-layout-control bsu-ui-text-field input")
    .last()
    .fill("1");
  await expect(page.locator("fd-dialog-body div")).toBeVisible();
  await page.locator("fd-dialog-body div").click();
  await expect(page.locator("fd-dialog-body")).toContainText(
    "frm.GetHostFieldIsDone"
  );
});
