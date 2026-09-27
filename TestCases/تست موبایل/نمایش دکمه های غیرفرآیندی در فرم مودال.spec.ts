import { test, expect, devices } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page
    .locator("#fd-list-item-28")
    .getByText("نمایش دکمه های غیر فرآیندی در فرم مودال")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.getByRole("group")).toBeVisible();
  await page
    .locator("fd-popover-control")
    .locator('button[fd-button][aria-label="More"][glyph="overflow"].is-cozy')
    .click();
  await expect(page.getByText("تاییدانصرافمرحله بعدی")).toBeVisible();
});
