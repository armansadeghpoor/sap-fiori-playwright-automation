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
  await page.getByText("فیلد تاریخ و زمان").click();
  await page.getByText("فیلد تاریخ وزمان- نمایش جدید در وب جدید").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "select day" }).click();
  await page.locator("fd-toolbar div").getByRole("button").nth(3).click(); //   await page.getByRole('button', { name: '1404' }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "1382" }).click();
  await page.locator("fd-toolbar").getByRole("button").nth(6).click(); //   await page.getByRole('button', { name: 'مهر' }).click();
  // await page
  //   .getByRole("button", { name: "بهمن", exact: true })
  //   .and(page.locator('[aria-label="بهمن"]'))
  //   .click();
  await page.getByRole('button', { name: 'بهمن' }).click();
  await page.getByRole("button", { name: "۱۹" }).click();
  await page.getByRole("spinbutton").nth(1).click();
  await page.getByRole("spinbutton").nth(1).fill("12");
  await page.getByRole("spinbutton").first().click();
  await page.getByRole("spinbutton").first().fill("12");
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(
    page.getByRole("textbox", { name: "YYYY/MM/DD HH:mm" })
  ).toHaveValue("۱۳۸۲/۱۱/۱۹ ۱۲:۱۲");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "" }).click();
  await expect(
    page.getByRole("textbox", { name: "YYYY/MM/DD HH:mm" })
  ).toBeVisible();
});
