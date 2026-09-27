import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست قاعده کاری").click();
  await page.getByText("رویداد فرم").click();
  await page
    .getByText("قاعده کاری-رویداد فرم(قبل از باز شدن فرم)-اعمال نما")
    .click();
  await page
    .getByRole("row", { name: "‫سمنان‬ ‫گرمسیری‬ " })
    .getByRole("button")
    .click();
  await page.locator("fd-text").click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "عنوان شهر:"
    - textbox "سمنان"
    - text: "اقلیم:"
    - paragraph: گرمسیری
    `);
  await page.getByTitle('Close').click();
});
