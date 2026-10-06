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
  await page.getByRole("row", { name: "1" }).locator("label span").click();
  await page.getByRole("row", { name: "2" }).locator("label span").click();
  await page
    .getByRole("button", { name: "دستور پویا(لیست-چند انتخابی)" })
    .click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("برند");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
