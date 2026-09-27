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
  await page.getByRole("link", { name: "3834" }).last().click();
  await page.getByRole("button", { name: "جدید" }).click();
  const combobox = page.getByRole('combobox', { name: 'Select an Option' });
  await page.getByRole('combobox', { name: 'Select an Option' }).click();
  await expect(combobox).toHaveClass(/is-readonly/);
  await page.getByRole("textbox").last().click();
  await page.getByRole("textbox").last().fill("تست");
  await page.getByRole('combobox', { name: 'Select an Option' }).click();
  await expect(page.getByText("انتخاب کنید")).toBeVisible();
  await page.getByRole("textbox", { name: "تست" }).click();
  await page.getByRole("textbox", { name: "تست" }).fill("");
  await expect(page.getByRole('combobox', { name: 'Select an Option' })).toHaveClass(/is-readonly/);
});
