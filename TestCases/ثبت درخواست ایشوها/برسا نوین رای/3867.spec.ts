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
  await page.getByRole("link", { name: "3867" }).last().click();
  await page.getByRole('button', { name: 'تنظیمات' }).click();
  const activeMenu = page.locator('.cdk-overlay-pane').getByRole('menu');
  await expect(activeMenu).toContainText('چند انتخابی');
  await expect(activeMenu).toContainText('ستون ها');
  await expect(activeMenu).toContainText('گروه بندی');
});
