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
  await page.getByText("فیلد چندمقداری").click();
  await page.getByText("فیلد چندمقداری-محاسباتی").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("spinbutton").click();
  await page.getByRole("spinbutton").fill("1");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  99 - 0;
});
