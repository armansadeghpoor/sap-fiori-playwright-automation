import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.user1);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("فرم-بررسی نمای اعمال شده به فرم").click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - heading "نما1" [level=5]
    - region:
      - text: "سن:"
      - textbox
      - text: "نام:"
      - textbox
    `);
});
