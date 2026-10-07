import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
test.setTimeout(45000);
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
  await page.getByRole("link", { name: "3853" }).last().click();
  await expect(page.getByText("(موردی یافت نشد)")).toBeVisible();
  await page.waitForTimeout(500);
  const processBtn = page.getByRole("button", { name: "اجرای فرآیند" });
  await processBtn.dblclick({ delay: 50 });
  await page.waitForTimeout(5000);
  await page.getByTitle('Close').click();
  await page.getByTitle("بازآوری").click();
  const rows = page.locator('bsu-barsa-table-row');
  await expect(rows).toHaveCount(1);
});
