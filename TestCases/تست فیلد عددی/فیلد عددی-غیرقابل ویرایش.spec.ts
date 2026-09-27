import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد عددی").click();
  await page
    .getByText("عددی-غیرترکیبی(تکراری نباشد-غیر قابل ویرایش و آیکون)")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("fd-text").click();
  await expect(page.locator("fd-text")).toBeVisible();
  await page.locator("fd-text").click();
});
