import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("انواع شرط در گزارش").click();
  await page.getByText("جستجو").click();
  await page.getByText("بررسی اتوکامپلیت در جستجو رابطه عکس تکی تکی").click();
  await page.getByRole("combobox").click();
  await page.getByRole("combobox").fill("معاو");
  await page.keyboard.press("Backspace");
  await page.waitForTimeout(1000);
  await expect(page.getByText("معاون")).toContainText("معاون");
  await page.getByRole("combobox").click();
  await page.getByRole("combobox").press("ArrowDown");
  await page.getByText("معاون").press("Enter");
  await page.getByRole("button", { name: "جستجو", exact: true }).click();
  await expect(page.getByText("‫علوی‬")).toBeVisible();
});
