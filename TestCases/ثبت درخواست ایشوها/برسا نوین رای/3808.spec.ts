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
  await page.getByRole("link", { name: "3808" }).last().click();
  await page.getByText("‫*حذف نشود*‬").dblclick();
  await page.getByText("داکیومنت ویزارد.pdf").click();
  const downloadBtn = page.locator('fd-button-bar[glyph="download"] button');
  await expect(downloadBtn).toBeVisible();
  const resizeBtn = page.locator('fd-button-bar[glyph="resize"] button');
  await expect(resizeBtn).toBeVisible();
  await page.getByRole('button', { name: 'دانلود' }).click();
  await expect(page.getByText(".zip")).toBeVisible();
  await expect(page.getByText('دانلودهمه')).toBeVisible();
});
