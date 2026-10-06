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
  await page.getByText("رابطه لیستی").click();
  await page.getByText("فیلد رابطه لیستی-رابطه دارد-انواع نمایش").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("#fd-input-group-button-id-0").click();
  await page.getByRole("option", { name: "58" }).locator("label span").click();
  await page.getByRole("option", { name: "18" }).locator("label span").click();
  await page.locator(".empty-space > div").first().click();
  await expect(page.getByRole("listbox")).toContainText("18");
  await expect(page.getByRole("listbox")).toContainText("58");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: '‫58‬' }).dblclick();
  await expect(page.getByRole("listbox")).toContainText("18");
  await expect(page.getByRole("listbox")).toContainText("58");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
