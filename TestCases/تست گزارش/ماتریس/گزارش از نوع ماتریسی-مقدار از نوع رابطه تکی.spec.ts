import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator(".fd-avatar__icon").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole("listitem").filter({ hasText: "تست گزارش" }).click();
  await page.waitForTimeout(500);
  await page
    .getByRole("link", {
      name: "تست گزارش از نوع ماتریسی-مقدار از نوع رابطه تکی",
    })
    .click();
  await page.locator("fd-popover-control > span").first().click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.waitForTimeout(500);
  await page.getByText("فروش").click();
  await page
    .locator(
      "#fd-popover-30 > .fd-popover__control > fd-popover-control > span"
    )
    .click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("پشتیبانی").click();
  await page.getByRole("button", { name: "ذخیره" }).click();
  await page.reload();
  await page.waitForTimeout(1500);
  await expect(
    page.getByText(
      "جدید ذخیره شیفت صبح شیفت ظهر شیفت عصر شیفت شب شنبهفروشیکشنبهدوشنبهسه شنبهچهارشنب"
    )
  ).toBeVisible();
});
