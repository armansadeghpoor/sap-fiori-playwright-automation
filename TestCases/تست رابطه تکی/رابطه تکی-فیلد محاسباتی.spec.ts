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
  await page
    .getByText("دانشجو-رابطه تکی-فیلد محاسباتی و مقدار پیش فرض")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator('button:has(.sap-icon--synchronize)').click();//دکمه محاسبه فیلد محاسباتی

  await expect(
    page.locator("bsu-ui-mo-info-combo-viewer").getByRole("textbox")
  ).toHaveValue("location 111");
  await page.locator("bsu-ui-text-field").getByRole("textbox").click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").fill("رضا");
  await page.locator('button:has(.sap-icon--synchronize)').click();
  await expect(
    page.locator("bsu-ui-mo-info-combo-viewer").getByRole("textbox")
  ).toHaveValue("location 222");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-ui-table-view")).toContainText(
    "نام انتخاب محل امتحان اسم درس-مقدار پیش فرض ‫رضا‬‫location 222‬‫جغرافیا‬"
  );
});
