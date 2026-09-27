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
  await page
    .getByRole("link", { name: "پنهان شدن هدر گرید در اسکرول" }).last()
    .click();
  await page.getByText("‫تست59‬").click();
  await expect(
    page.getByRole("toolbar").filter({ hasText: "جدید" })
  ).toBeVisible();
  await page.getByText("‫تست0‬").dblclick();
  await page.getByText("‫تست59‬").click();
  await expect(
    page.getByRole("toolbar").filter({ hasText: "جدید" })
  ).toBeVisible();
});
