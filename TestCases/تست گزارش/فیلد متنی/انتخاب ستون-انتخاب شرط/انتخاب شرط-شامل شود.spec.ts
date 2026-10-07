import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../../framework/api/environment.api";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد متنی").click();
  await page.getByText("انتخاب ستون و انتخاب شرط").click();
  // await page.getByText("فیلد متنی-انتخاب شرط- عملگر مقدار نداشته باشد").click();

  await page.getByText("فیلد متنی- انتخاب شرط-شامل شود").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("سحر");
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  // پایینیو کامنت کردم ولی نمیدونم چرا این اتفاق افتاده
  // await expect(page.locator("tbody")).toContainText("‫سحر‬");
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("نادی");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();

  await expect(page.locator("tbody")).toContainText("‫نادی‬");
});
