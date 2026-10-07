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
  await page.getByText("رابطه تکی-یک به یک", { exact: true }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .fill("تست");
  await page.getByRole('combobox', { name: 'انتخاب کنید' }).click();
  await page.getByRole('button', { name: 'جدید', exact: true }).click();
  await page.locator("label").filter({ hasText: "دکتری" }).click();
  await page.getByRole("button", { name: "select day" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "1405" }).click();
  await page.waitForTimeout(1000);
  await page.getByLabel("1405").click();
  await page.waitForTimeout(1000);
  // await page.getByRole("button", { name: "تیر" }).click();
  await page.locator("fd-toolbar div").getByRole("button").nth(2).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "تیر" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "۲۴" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("combobox", { name: "انتخاب کنید" }).click();
  await page.getByRole("combobox", { name: "انتخاب کنید" }).fill("5");
  await page.keyboard.press("Backspace");
  await page.getByRole("combobox", { name: "انتخاب کنید" }).fill("5");
  await page.getByText("/04/24").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "مقدار فیلد 'آخرین مدرک تحصیلی' در موجودیت 'رابطه تکی-یک به یک' تکراری است!"
    )
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
