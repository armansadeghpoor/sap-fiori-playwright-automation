import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:8000/#/login");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .fill("راهبر");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند", { exact: true }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("فرم-اتصال خروجی-قاعده کاری").click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("15");
  await page.getByRole("button", { name: "چک قاعده کاری" }).click();
  await expect(page.locator("fd-dialog-body")).toContainText(
    "سن کمتر از 20 است"
  );
  await page.getByRole("button", { name: "تایید" }).click();
  await page.locator(".fd-col.fd-col--12").click();
});
