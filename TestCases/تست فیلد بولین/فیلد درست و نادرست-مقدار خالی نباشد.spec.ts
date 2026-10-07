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
  await page.getByText("فیلد بولین").click();
  await page.getByText("درست/نادرست-مقدار خالی نباشد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.locator("div").filter({
      hasText:
        /^اشکال در مقادیر فرم مقدار خالی نباشد: فیلد `مقدار خالی نباشد` اجباری میباشد\.$/,
    })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.locator("label").filter({ hasText: "نادرست" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByRole('link', { name: 'نادرست' })).toBeVisible();
});
