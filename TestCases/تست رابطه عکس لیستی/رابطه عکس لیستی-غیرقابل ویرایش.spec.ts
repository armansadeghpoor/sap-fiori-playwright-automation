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
  await page.getByText("رابطه عکس لیستی").click();
  await page.getByText("رابطه لیستی-شامل است-پرسنل").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").fill("علی");
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox", { name: "YYYY/MM/DD" }).click();
  await page.getByRole("textbox", { name: "YYYY/MM/DD" }).fill("1403/10/10");
  await page.getByRole("textbox", { name: "HH:mm" }).click();
  await page.getByRole("textbox", { name: "HH:mm" }).fill("09:00");
  await page
    .locator("div")
    .filter({ hasText: "تاریخ:زمان: پرسنل مرتبط" })
    .nth(3)
    .click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page
    .getByText("رابطه عکس لیستی-شامل است-غیر قابل ویرایش-چپ به راست-تردد")
    .click();
  await page.getByRole("button", { name: "" }).click();
  // await expect(
  //   page.locator("#fdp-icon-tab-bar-tab-2").getByRole("toolbar")
  // ).toBeVisible();
  await page.getByRole("button", { name: "" }).click();
});
