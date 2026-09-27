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
  await page.waitForTimeout(4000);
  await page.locator('fd-shellbar-context-area span[glyph="search"]').click();
  await page.locator("#fd-input-group-input-id-0").fill("@@@");
  await expect(page.getByRole('link', { name: 'تست @@@ سیستم ثبت درخواست ایشوها > برسا نوین رای > 3854' })).toBeVisible();
  await page.locator("#fd-input-group-input-id-0").fill("$$$");
  await expect(
    page.locator("a").filter({ hasText: "تست $$$Default" }),
  ).toBeVisible();
});
