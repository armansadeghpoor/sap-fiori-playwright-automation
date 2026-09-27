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
  await page.getByRole("link", { name: "3804" }).last().click();
  await page.getByRole("button", { name: "جدید" }).click();
  //فایل اول
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "پیوست فایل" }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles("logo.png");

  //فایل دوم
  const fileChooserPromise1 = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "پیوست فایل" }).click();
  const fileChooser1 = await fileChooserPromise;
  await fileChooser.setFiles("logo.png");

  //فایل سوم
  const fileChooserPromise2 = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "پیوست فایل" }).click();
  const fileChooser2 = await fileChooserPromise;
  await fileChooser.setFiles("logo.png");

  await expect(page.getByText("logo.png logo.png logo.png")).toBeVisible();

  //دوباره فایل سوم
  const fileChooserPromise3 = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "پیوست فایل" }).click();
  const fileChooser3 = await fileChooserPromise;
  await fileChooser.setFiles("logo.png");
  await expect(page.getByText("logo.png logo.png logo.png")).toBeVisible();
});
