import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("تست دکمه های سرچ پنل").click();
  await expect(
    page.getByRole("region", { name: "Collapsed Header" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Collapse Header" }).click();
  await page.getByRole("button", { name: "Collapse Header" }).click();
  await expect(
    page.getByRole("region", { name: "Collapsed Header" }),
  ).toBeVisible();
});
