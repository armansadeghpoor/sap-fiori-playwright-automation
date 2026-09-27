import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("فیلد فایل از نوع کنترل تکی").click();
  await page.waitForTimeout(2000);
  // await page.getByRole("button", { name: "" }).click();
  await page.getByRole('link', { name: '‫تست ابزار خودکار‬' }).dblclick();
  // await page.getByRole("button", { name: "" }).click();
  await page.waitForTimeout(500);
  await page.getByTitle('Close').click();
  await page.getByRole('link', { name: '‫تست ابزار خودکار‬' }).dblclick();
});
