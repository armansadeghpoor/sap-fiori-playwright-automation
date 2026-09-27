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
  await page.getByLabel('ثبت درخواست ایشوها ایشوها ثبت شده در سامانه ثبت درخواست').getByText('ثبت درخواست ایشوها').click();
  await page.getByRole('link', { name: '4100' }).last().click();
  const weekDays = page.locator('bc-calendar-week td.weekday-header');
  await expect(weekDays).toHaveCount(2);
  await expect(weekDays).toHaveText([
    /دوشنبه/,
    /سه‌شنبه/
  ]);
});
