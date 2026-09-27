import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("تست نما Wizard").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await expect(page.locator("bsu-layout-actions")).toMatchAriaSnapshot(`
    - button "arrow right"
    - button "arrow left"
    `);
  await page.getByRole("button", { name: "arrow left" }).click();
  await page.getByRole("button", { name: "select day" }).click();
  await page.getByRole("button", { name: "امروز" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "arrow left" }).click();
  await page.getByRole("button", { name: "arrow right" }).click();
  await expect(page.getByText("تاریخ شروع:")).toBeVisible();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "arrow left" }).click();
  await page.getByRole('combobox', { name: 'Select an Option' }).click();
  await page.getByText("دانشگاه").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByRole("region", { name: "Wizard" }).locator("bsu-ui-ulv-main-ui"),
  ).toBeVisible();
});
