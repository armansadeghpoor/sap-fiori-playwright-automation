import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("MoList").click();
  await page.getByText("تست حذف از لیست با کد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("1");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByText("1").click();
  await page.getByRole("button", { name: "حذف رکورد با Id" }).click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.getByText('(موردی یافت نشد)')).toBeVisible();
});
