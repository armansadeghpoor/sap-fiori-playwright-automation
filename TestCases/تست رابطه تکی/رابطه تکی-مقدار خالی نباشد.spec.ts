import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه تکی").click();
  await page.getByText("رابطه تکی-مقدار خالی نباشد-کودک").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "اشکال در مقادیر فرم لیست ورود و خروج- مقدار خالی نباشد: فیلد `لیست ورود و خروج- "
    )
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.getByText(":30 ب.ظ").click();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-ui-table-view")).toContainText(
    "نام لیست ورود و خروج- مقدار خالی نباشد ‫نام2‬‫ 01:50 ب.ظ‬‫سارا‬‫ 03:32 ب.ظ‬‫تست‬‫ 07:30 ب.ظ‬"
  );
});
