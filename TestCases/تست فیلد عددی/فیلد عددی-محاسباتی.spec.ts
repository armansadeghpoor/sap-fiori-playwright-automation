import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد عددی").click();
  await page.getByText("عددی-محاسباتی").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("spinbutton").click();
  await page.getByRole("spinbutton").fill("5");
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("7");
  await expect(page.getByRole("spinbutton")).toHaveValue("5");
  await page.getByRole("textbox").click();
  await expect(page.getByRole("textbox")).toHaveValue("7");
  await expect(page.locator("fd-text")).toContainText("‪12");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
