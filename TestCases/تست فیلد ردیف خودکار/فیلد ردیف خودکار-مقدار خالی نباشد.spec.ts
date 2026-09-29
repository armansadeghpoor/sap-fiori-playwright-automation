import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های نوع خودکار").click();
  await page.getByText("فیلد ردیف خودکار").click();
  await page.getByText("ردیف خودکار-مقدار خالی نباشد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "ردیف خودکار-مقدار خالی نباشد:"
    - strong: "*"
    - text: "1"
    `);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
