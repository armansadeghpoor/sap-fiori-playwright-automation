import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole("listitem").filter({ hasText: "تست گزارش" }).click();
  await page.waitForTimeout(500);
  await page.getByTitle("تست گزارش از نوع گانت").first().click();
  await page
    .getByRole("link", {
      name: "تست گزارش از نوع ماتریسی-مقدار از نوع چندمقداری",
    })
    .click();
  await page.locator("fd-popover-control > span").first().click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("پروژه").click();
  await page
    .locator(
      "#fd-popover-34 > .fd-popover__control > fd-popover-control > span"
    )
    .click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("زیرساخت").click();
  await page.getByRole("button", { name: "ذخیره" }).click();
  await page.reload();
  await expect(page.locator(".viewer-container")).toBeVisible();
  await expect(
    page.getByText(
      "جدید ذخیره شیفت صبح شیفت ظهر شیفت عصر شیفت شب شنبهپروژهیکشنبهدوشنبهسه شنبهچهارشن"
    )
  ).toBeVisible();
});
