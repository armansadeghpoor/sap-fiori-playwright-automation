import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto("http://localhost:8000/#/login");
  await page.waitForTimeout(2000);
  await page.reload();
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
  await page.getByText("امضا در وب جدید").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 791,
        y: 193,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 650,
        y: 180,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 430,
        y: 196,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 442,
        y: 292,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 540,
        y: 119,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 671,
        y: 310,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 874,
        y: 74,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 257,
        y: 145,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 188,
        y: 288,
      },
    });
  await page
    .getByRole("article")
    .locator("canvas")
    .click({
      position: {
        x: 872,
        y: 310,
      },
    });
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole('link', { name: '‫تست‬' }).dblclick();
  await expect(page.locator('#fd-toolbar-12')).toMatchAriaSnapshot(`
    - toolbar:
      - button
      - button
      - button
    `);
  await page.locator("img").click();
});
