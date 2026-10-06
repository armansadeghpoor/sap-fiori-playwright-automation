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
  await page.getByText("تاریخ و زمان-نمایش جدید-میلادی").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "select day" }).click();

  await page.locator("fd-toolbar div").getByRole("button").nth(3).click(); //   await page.getByRole("button", { name: "2025" }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "2004" }).click();

  await page.locator("fd-toolbar").getByRole("button").nth(6).click(); //   await page.getByRole("button", { name: "September" }).click();
  await page.getByRole("button", { name: "February" }).click();
  await page.getByRole("button", { name: "8", exact: true }).click();
  await page.getByRole("spinbutton").nth(1).click();
  await page.getByRole("spinbutton").nth(1).fill("12");
  await page.getByRole("spinbutton").first().click();
  await page.getByRole("spinbutton").first().fill("12");
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(
    page.getByRole("textbox", { name: "YYYY/MM/DD HH:mm" })
  ).toHaveValue("2004/02/08 12:12");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByText("‫2004/02/08 12:12‬")).toBeVisible();
});
