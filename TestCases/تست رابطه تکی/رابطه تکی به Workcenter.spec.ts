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
  await page.getByText("رابطه تکی به workcenter").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("combobox", { name: "انتخاب کنید" }).click();
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.getByText("کارشناس ارشد نرم افزار").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByTitle("تست").locator("div")).toBeVisible();
});
