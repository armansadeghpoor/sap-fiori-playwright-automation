import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست کد").click();
  await page.getByText('Form', { exact: true }).click();
  await page.getByText("InfoBar").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "Info", exact: true }).click();
  await expect(page.getByRole("paragraph")).toMatchAriaSnapshot(
    `- text: test infobar`
  );
});
