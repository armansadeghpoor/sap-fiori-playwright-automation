import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("ثبت درخواست ایشوها").last().click();
  await page.getByRole("link", { name: "3866" }).last().click();
  await expect(page.locator("bsu-ui-table-view")).toBeVisible();
  await expect(page.locator("bsu-ui-table-view")).toContainText(
    "عنوان ‫تست 1‬‫تست 2‬‫تست 3‬‫تست 4‬‫تست 5‬‫تست 6‬‫تست 7‬‫تست 8‬‫تست 9‬‫تست 10‬",
  );
  await page.getByText("‫تست 1‬").dblclick();
  await page.waitForTimeout(1000);
  await page.getByTitle('Close').click();
  await page.getByText("‫تست 1‬").dblclick();
  await page.locator("fd-toolbar").getByRole("button").nth(1).click(); //دکمه پایین تولبار
  await page.waitForTimeout(1000);
  await page.locator("fd-toolbar").getByRole("button").nth(1).click(); //دکمه پایین تولبار
  await page.waitForTimeout(1500);
  await page.locator("fd-toolbar").getByRole("button").nth(1).click(); //دکمه پایین تولبار
  await page.getByTitle('Close').click();
  await expect(page.locator('bsu-ui-table-view')).toContainText('عنوان ‫تست 1‬‫تست 2‬‫تست 3‬‫تست 4‬‫تست 5‬‫تست 6‬‫تست 7‬‫تست 8‬‫تست 9‬‫تست 10‬');
  await page.getByText("‫تست 1‬").dblclick();
  await expect(page.getByRole("textbox", { name: "تست" })).toHaveValue("تست 1");
  await page.getByTitle('Close').click();
  await page.locator("fd-toolbar").getByRole("button").nth(2).click(); //دکمه بالای تولبار
});
