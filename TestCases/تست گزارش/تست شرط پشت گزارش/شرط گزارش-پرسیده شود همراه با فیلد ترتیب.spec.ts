import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("انواع شرط در گزارش").click();
  await page.getByText("شرط گزارش-پرسیده شود").click();
  await page.getByText("شرط گزارش-پرسیده شود همراه با فیلد ترتیب").click();
  await page.getByRole("combobox").click();
  await page.getByRole("combobox").fill("تست");
  await page.keyboard.press("Backspace");
  await page.getByRole("combobox").click();
  await page.getByRole("combobox").fill("تست");
  await expect(page.locator('fd-popover-body').last()).toContainText(
    "تست 639تست 640تست 641تست 642تست 643تست 644تست 645"
  );
});
