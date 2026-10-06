import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های نوع فایل").click();
  await page.getByText("فیلد فایل word").click();
  await page.getByText("فایل word", { exact: true }).click();
  await page
    .getByRole("row", { name: '‫"حذف نشود"‬ ' })
    .getByRole("button")
    .click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "" }).click(); //زدن دکمه حذف
  await page.locator("bsu-ui-pdf-viewer").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page
    .getByRole("row", { name: '‫"حذف نشود"‬ ' })
    .getByRole("button")
    .click();
  await page.locator("bsu-ui-pdf-viewer").click();
});
