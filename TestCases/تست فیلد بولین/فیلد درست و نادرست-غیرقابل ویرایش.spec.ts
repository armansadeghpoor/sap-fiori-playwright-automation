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
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد بولین").click();

  await page.getByText("درست/نادرست-غیر قابل ویرایش-مقدار پیش فرض").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await expect(page.locator("bsu-ly-vertical-layout")).toMatchAriaSnapshot(`
    - radio "درست" [disabled]
    - text: درست
    `);
  await expect(
    page.locator("bsu-ly-vertical-layout div").filter({ hasText: "نادرست" })
  ).toMatchAriaSnapshot(`
    - radio "نادرست" [disabled]
    - text: نادرست
    `);
});
