import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
test("test", async ({ page, request }) => {
  test.setTimeout(40000);
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page.getByText("محل باز شدن فرم").click();
  await page.getByText("پاس دادن فرم به فرآیند-گزارش").click();
  await page
    .getByRole("row", { name: "‫کتاب‬ ‫‪6‬ " })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "اجرای فرآیند" }).click();
  await page.getByRole("button", { name: "ok" }).click();
});
