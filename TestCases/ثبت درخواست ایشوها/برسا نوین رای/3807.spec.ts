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
  //   await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page.getByRole("link", { name: "3807" }).last().click();
  await page.getByRole('button', { name: 'جدید' }).click();
  await page.getByRole("tab", { name: "شمسی default" }).click();
  await page.getByRole("button", { name: "select day" }).click();
  await page.getByRole("button", { name: "امروز" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "select day" }).click();
  await page
    .locator('fd-popover-body button.fd-button[title="More actions"]')
    .click();
  await page.getByTitle("میلادی").click();
  await page.getByRole("button", { name: "امروز" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "select day" }).click();
  await page.locator("fd-popover-body fd-toolbar > button").nth(2).click(); //prev
  await page.locator("fd-popover-body fd-toolbar > button").nth(2).click(); //prev
  await page.locator("fd-popover-body fd-toolbar > button").nth(2).click(); //prev
  await page.locator("fd-popover-body fd-toolbar > button").nth(1).click(); //next
  const targetElement = page.getByRole("button", { name: "10", exact: true });
  await expect(targetElement).toBeVisible();
  await expect(targetElement).not.toHaveText("Invalid Date");
});
