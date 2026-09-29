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
  await page.getByText("انتخاب کاربر- محاسباتی-فرمول").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").nth(0).click();
  await page.getByRole("textbox").nth(0).fill("تست");
  await page.getByRole("button", { name: "" }).click();
  await expect(
    page.locator("bsu-ui-mo-info-combo-viewer").getByRole("textbox")
  ).toHaveValue("راهبر سیستم");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
