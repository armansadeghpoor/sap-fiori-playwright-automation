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
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد متنی").click();
  await page.getByText("تنظیمات نحوه نمایش").click();
  await page.getByText("نمایش شماره سطر").click();
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
        - row "نام نام خانوادگی":
          - cell
          - cell "نام"
          - cell "نام خانوادگی"
          - cell
      - rowgroup:
        - row "1 ‫رها‬ ‫اعتمادی‬ ":
          - cell "1"
          - cell "‫رها‬"
          - cell "‫اعتمادی‬"
          - cell "":
            - button ""
        - row
        - row "2 ‫رها‬ ‫نوری‬ ":
          - cell "2"
          - cell "‫رها‬"
          - cell "‫نوری‬"
          - cell "":
            - button ""
        - row
        - row "3 ‫یلدا‬ ‫اعتمادی‬ ":
          - cell "3"
          - cell "‫یلدا‬"
          - cell "‫اعتمادی‬"
          - cell "":
            - button ""
        - row
        - row "4 ‫فروزان‬ ‫اعوانی‬ ":
          - cell "4"
          - cell "‫فروزان‬"
          - cell "‫اعوانی‬"
          - cell "":
            - button ""
        - row
        - row "5 ‫آوا‬ ‫رحمتی‬ ":
          - cell "5"
          - cell "‫آوا‬"
          - cell "‫رحمتی‬"
          - cell "":
            - button ""
        - row
        - row "6 ‫شهاب‬ ‫رمضانی‬ ":
          - cell "6"
          - cell "‫شهاب‬"
          - cell "‫رمضانی‬"
          - cell "":
            - button ""
        - row
        - row "7 ‫رضا ‬ ‫بهرامی‬ ":
          - cell "7"
          - cell "‫رضا ‬"
          - cell "‫بهرامی‬"
          - cell "":
            - button ""
        - row
        - row "8 ‫یلدا‬ ‫زاهدی‬ ":
          - cell "8"
          - cell "‫یلدا‬"
          - cell "‫زاهدی‬"
          - cell "":
            - button ""
        - row
    `);
});
