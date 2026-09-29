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
  await page.getByText("رابطه عکس تکی تکی").click();
  await page
    .getByText(
      "رابطه عکس تکی تکی-بلیط--نمای مرتبط-مقدار خالی نباشد-بازآوری هر بار لیست آبشاری"
    )
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").fill("555");
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("هومن").click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("textbox", { name: "هومن" }).click();
  await page.getByRole("textbox", { name: "هومن" }).fill("هومن محمدی");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("هومن محمدی").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("‫هومن محمدی‬");
});
