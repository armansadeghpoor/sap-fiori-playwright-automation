import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  test.setTimeout(60000);
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("فرم-محل بازشدن فرم-گزارش لیستی").click();
  await page.getByRole("button", { name: "close", exact: true }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "تایید" }).click();
  await page
    .locator("bt-barsa-shellbar")
    .getByRole("button", { name: "Navigation" })
    .click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("محل باز شدن فرم").click();
  await page.getByText("گزارش-لیست", { exact: true }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByTitle("تست").locator("div")).toBeVisible();
});
