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
  await page.getByText("درست/نادرست-مقدار تکراری نباشد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("label").filter({ hasText: "درست" }).first().click();
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page.waitForTimeout(1000);
  await page.locator("label").filter({ hasText: "درست" }).first().click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "مقدار فیلد 'درست/نادرست-مقدار تکراری نباشد.مقدار تکراری نباشد' تکراری است ("
    )
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
