import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
import { snapshot } from "node:test";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await expect(page).toHaveURL('http://localhost:8000/#/home');
  await page.getByRole("heading", { name: "3864" }).click();
  await page.getByRole("button", { name: "ذخیره", exact: true }).click();
  await page.waitForTimeout(1000);
  await page.getByTitle('Close').click();
  await expect(page).toHaveURL('http://localhost:8000/#/home');
  await expect(
    page.getByRole("tab", { name: "تست مخصوص وب جدید - تایل" }),
  ).toBeVisible();
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await expect(page.getByRole('button', { name: 'App Launcher' })).toBeVisible();
  await page.getByRole("heading", { name: "3864" }).last().click();
  await page.getByRole("button", { name: "ذخیره", exact: true }).click();
  await page.waitForTimeout(1000);
  await page.getByTitle('Close').click();
  await expect(page.getByRole('button', { name: 'App Launcher' })).toBeVisible();
  await expect(
    page.getByRole("tab", { name: "تست مخصوص وب جدید - تایل" }),
  ).toBeVisible();
});
