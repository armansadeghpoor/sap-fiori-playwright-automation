import { test, expect, devices } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "" }).click();
  await page.locator("a").filter({ hasText: "fa-IR" }).click();
await page.locator('button.fd-shellbar__button:not(.fdp-search-field__submit)', { 
  has: page.locator('.sap-icon--search') 
}).click();
  await expect(page.getByRole("searchbox", { name: "Search" })).toBeVisible();
});
