import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست فیلد").click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("فیلد های ساده")
    .click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("فیلد انتخاب کاربر")
    .click();
  await page.getByText("انتخاب کاربر-انواع مشخصات").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("#fd-input-group-button-id-0").click();
  await page.getByText("کاربر1").click();
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page.locator("#fd-input-group-button-id-3").click();
  await page.getByText("کاربر1").click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("fd-dialog-body div")).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
