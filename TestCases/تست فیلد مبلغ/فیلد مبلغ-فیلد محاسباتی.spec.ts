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
  await page.getByText("فیلد مبلغ").click();
  await page.getByText("مبلغ-فیلد محاسباتی").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("355");
  await expect(page.locator("fd-text")).toContainText("365 ریال");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("365 ریال");
});
