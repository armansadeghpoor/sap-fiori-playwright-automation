import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد چندمقداری").click();
  await page.getByText("فیلد چندمقداری-انواع نمایش متن و تصویر").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("bsu-ui-simple-combo").getByRole("button").nth(1).click();
  await expect(page.getByRole("dialog")).toMatchAriaSnapshot(`
    - button "[بدون مقدار]"
    - button "بالا":
      - img
    - button "پایین":
      - img
    - button "چپ":
      - img
    - button "راست":
      - img
    `);
  await page.locator("div.fd-scrollbar").getByRole("button").nth(5).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("img")).toBeVisible();
});
