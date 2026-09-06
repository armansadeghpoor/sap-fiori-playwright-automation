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
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد متنی").click();
  await page.getByText("انتخاب ستون و انتخاب شرط").click();
  await page
    .getByText("فیلد متنی-انتخاب شرط-موجودیت پارامتر با اپراتور=")
    .click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(page.locator("fd-dynamic-page-content")).toMatchAriaSnapshot(`
    - toolbar:
      - button "جدید"
      - button "" [disabled]
      - button "" [disabled]
      - button ""
      - button ""
      - button " "
    - table:
      - rowgroup:
        - row "سن نام":
          - cell
          - cell "سن"
          - cell "نام"
          - cell
      - rowgroup:
        - row /‫‪\\d+‬ ‫تست انتخاب شرط کد‬ /:
          - cell
          - cell /‫‪\\d+‬/
          - cell "‫تست انتخاب شرط کد‬"
          - cell "":
            - button ""
        - row
    `);
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست پارامتر");
  await page.getByRole("textbox").press("Tab");
  await page.getByRole("spinbutton").fill("20");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("textbox").click();
  await page.waitForTimeout(1500);
  await page.getByRole("textbox").fill("پارامتر");
  await page.getByRole("button", { name: "جستجو" }).click();
  await page.getByRole("textbox", { name: "پارامتر" }).click();
  await page.getByRole("textbox", { name: "پارامتر" }).fill("تست پارامتر");
  await page.getByRole("button", { name: "جستجو" }).click();
  await expect(page.locator("fd-dynamic-page-content")).toMatchAriaSnapshot(`
    - toolbar:
      - button "جدید"
      - button "" [disabled]
      - button "" [disabled]
      - button ""
      - button ""
      - button " "
    - table:
      - rowgroup:
        - row "سن نام":
          - cell
          - cell "سن"
          - cell "نام"
          - cell
      - rowgroup:
        - row /‫‪\\d+‬ ‫تست پارامتر‬ /:
          - cell
          - cell /‫‪\\d+‬/
          - cell "‫تست پارامتر‬"
          - cell "":
            - button ""
        - row
    `);
});
