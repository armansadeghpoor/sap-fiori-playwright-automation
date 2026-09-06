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
  await page.getByText("تنظیمات نحوه نمایش").click();
  await page.getByText("فیلد متنی- بررسی نمایش شرطی سطرها").click();
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
        - row "نام سن":
          - cell
          - cell "نام"
          - cell "سن"
          - cell
      - rowgroup:
        - row /‫تست انتخاب شرط کد‬ ‫‪\\d+‬ /:
          - cell
          - cell "‫تست انتخاب شرط کد‬"
          - cell /‫‪\\d+‬/
          - cell "":
            - button ""
        - row
    `);
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
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
        - row "نام سن":
          - cell
          - cell "نام"
          - cell "سن"
          - cell
      - rowgroup:
        - row /‫تست انتخاب شرط کد‬ ‫‪\\d+‬ /:
          - cell
          - cell "‫تست انتخاب شرط کد‬"
          - cell /‫‪\\d+‬/
          - cell "":
            - button ""
        - row
        - row "‫تست‬ ":
          - cell
          - cell "‫تست‬"
          - cell
          - cell "":
            - button ""
        - row
    `);
});
