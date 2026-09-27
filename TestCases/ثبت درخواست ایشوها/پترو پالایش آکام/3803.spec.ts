import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page.getByRole("link", { name: "3803" }).last().click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("tab", { name: "مورد سوم default" }).click();
  await page.getByRole("textbox").last().click();
  await page.getByRole("textbox").last().fill("");
});
