import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator(".fd-avatar__icon").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  await page.getByRole("link", { name: "نمایش توضیحات در گرید" }).click();
  await expect(page.locator("bsu-ui-table-view")).toBeVisible();
  await expect(page.locator("tbody")).toContainText(
    "‫تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36تست 88-36‬"
  );
});
