import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page
    .locator("bsu-barsa-tree-item li")
    .getByText("تست دستور پویا")
    .click();
  await page.getByText("دستور پویا در فرم و نوار ابزار").click();
  await page.getByRole('link', { name: '‫1‬' }).dblclick();
  await page.getByRole("button", { name: "دستور پویا(نوار ابزار)" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
