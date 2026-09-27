import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  // await page.getByTitle("سیستم تست وب جدید").click();
  await page.getByRole("link", { name: "رفتار لیست خطی با Enter" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox", { name: "Multi Value Input" }).click();
  await page.getByRole("textbox", { name: "Multi Value Input" }).fill("تست");
  await page
    .getByRole("textbox", { name: "Multi Value Input" })
    .press("ArrowDown");
  await page.getByRole("option", { name: "تست 1", exact: true }).press("Enter");
  await page.getByRole("textbox", { name: "Multi Value Input" }).fill("تست");
  await page
    .getByRole("textbox", { name: "Multi Value Input" })
    .press("ArrowDown");
  await page.getByRole("option", { name: "تست 2", exact: true }).press("Enter");
  await page.getByRole("textbox", { name: "Multi Value Input" }).fill("تست");
  await page
    .getByRole("textbox", { name: "Multi Value Input" })
    .press("ArrowDown");
  await page
    .getByRole("option", { name: "تست 3", exact: true })
    .press("Escape");
  await expect(page.locator("fd-multi-input")).toContainText("تست 1تست 2");
});
