import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page
    .getByRole("heading", { name: "نمایش فیلد تاریخ در اخبار" })
    .click();
  await expect(page.getByText("تست 1‫1404/09/19 ‬‫تست 1.1‬")).toBeVisible();
  await expect(page.getByText("تست 2‫1404/09/20 ‬‫تست 1.2‬")).toBeVisible();
  await expect(page.getByText("تست 3‫1404/09/21 ‬‫تست 1.3‬")).toBeVisible();
  await page.getByTitle("تست 3").first().click();
  await page.getByTitle("تست 3").first().dblclick();
});
