import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.waitForTimeout(10000);
  await page.locator('fd-shellbar-context-area span[glyph="search"]').click();
  await page
    .locator('#fd-input-group-input-id-0')
    .pressSequentially("wizard", { delay: 100 });
  await page.getByRole('button', { name: 'همه 1' }).click();
  await page.getByRole('button', { name: 'گزارشات' }).click();
  await page.getByRole('link', { name: 'تست نما Wizard' }).click();
  await expect(
    page.getByLabel("Breadcrumb Trail").getByText("تست نما Wizard")
  ).toBeVisible();
});
