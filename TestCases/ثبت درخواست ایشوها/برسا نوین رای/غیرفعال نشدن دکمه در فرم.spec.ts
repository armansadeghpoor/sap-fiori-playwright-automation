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
  await page.getByRole("link", { name: "غیرفعال نشدن دکمه در فرم" }).last().click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(
    page.getByText("غیرفعال نشدن دکمه در فرم : دستور 1 ذخیره")
  ).toBeVisible();
  await page.getByRole("button", { name: "Disable Button" }).click();
  await expect(
    page.getByText("غیرفعال نشدن دکمه در فرم : ذخیره")
  ).toBeVisible();
});
