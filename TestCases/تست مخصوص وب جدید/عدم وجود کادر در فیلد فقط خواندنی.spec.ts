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
  await page.getByText("تست وب جدید").click();
  await page.getByText("عدم وجود کادر در فیلد فقط خواندنی").click();
  await page.getByRole('link', { name: '‫تست 1‬' }).dblclick();
  await expect(page.locator("bsu-ly-vertical-layout")).toMatchAriaSnapshot(
    `- paragraph: تست 1`
  );
  await expect(page.locator("bsu-ly-vertical-layout")).toMatchAriaSnapshot(
    `- paragraph: تست 2`
  );
  await page.waitForTimeout(3000);
});
