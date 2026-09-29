import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();

  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های سیستمی").click();
  await page.getByText("فیلد کاربر ایجاد کننده").click();
  await page.getByText("کاربر ایجاد کننده-مقدار خالی نباشد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "کاربر ایجاد کننده-مقدار خالی نباشد:"
    - strong: "*"
    - textbox "راهبر سیستم"
    `);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
