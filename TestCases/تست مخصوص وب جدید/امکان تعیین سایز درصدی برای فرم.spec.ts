import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("امکان تعیین سایز درصدی برای فرم").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "fullscreen" }).click();
  await page.getByRole("button", { name: "fullscreen" }).click();
  await page.locator(".fd-dialog__resize-handle").click();
});
