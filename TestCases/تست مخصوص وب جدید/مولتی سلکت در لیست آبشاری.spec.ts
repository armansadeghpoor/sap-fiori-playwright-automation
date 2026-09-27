import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page
    .getByRole("heading", { name: "به هم ریختگی نما در مولتی سلکت ها" })
    .click();
  await page.getByRole('link', { name: '‫*حذف نشود*‬' }).dblclick();
  await page.getByRole('button', { name: 'value-help' }).click();
  await page.getByTitle('Close').click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "value-help" }).click();
  await page.locator(".fd-checkbox__checkmark").first().click();
  await page.locator(".fd-checkbox__checkmark").nth(1).click();
  await page.locator(".fd-checkbox__checkmark").nth(2).click();
  await page.locator(".fd-checkbox__checkmark").nth(3).click();
  await page.locator(".fd-checkbox__checkmark").nth(4).click();
  await page.locator(".fd-checkbox__checkmark").nth(5).click();
  await page.locator(".fd-checkbox__checkmark").nth(6).click();
  await page.locator(".fd-checkbox__checkmark").nth(7).click();
  await page.locator(".fd-checkbox__checkmark").nth(8).click();
  await page.locator(".fd-checkbox__checkmark").nth(9).click();
  await page.locator(".fd-checkbox__checkmark").nth(10).click();
  await page
    .getByRole("heading", { name: "به هم ریختگی نما در مولتی سلکت ها : *" })
    .click();
  await expect(page.locator("fd-multi-input")).toBeVisible();
});
