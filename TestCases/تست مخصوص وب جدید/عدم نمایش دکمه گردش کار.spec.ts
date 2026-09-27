import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page
    .getByRole("heading", { name: "به هم ریختگی نما در مولتی سلکت ها" })
    .click();
  await expect(page.locator('#fd-toolbar-3')).toMatchAriaSnapshot(`
    - toolbar:
      - button "تنظیمات"
      - button "جدید"
      - button "ویرایش" [disabled]
      - button "حذف" [disabled]
      - button "بازآوری"
    `);
});
