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
    .locator("bsu-ui-text-field")
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
  await page.getByText("فیلد متنی-گزارش-تیک امکان مرتب سازی").click();
  await page.getByRole("button", { name: " " }).click();
  await page.getByText('مرتب سازی', { exact: true }).click();
  await page.locator("#fd-select-0 fd-icon").click();
  await page
    .getByRole("option", { name: "نام", exact: true })
    .locator("span")
    .click();
  await page.getByTitle(" ", { exact: true }).locator("fd-icon").click();
  await page.getByText("صعودی").click();
  await page.getByRole("button", { name: "تایید" }).click();
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
        - row "‫آوا‬ ‫رحمتی‬ ":
          - cell
          - cell "‫آوا‬"
          - cell "‫رحمتی‬"
          - cell "":
            - button ""
        - row
        - row "‫رضا ‬ ‫بهرامی‬ ":
          - cell
          - cell "‫رضا ‬"
          - cell "‫بهرامی‬"
          - cell "":
            - button ""
        - row
        - row "‫رها‬ ‫اعتمادی‬ ":
          - cell
          - cell "‫رها‬"
          - cell "‫اعتمادی‬"
          - cell "":
            - button ""
        - row
        - row "‫رها‬ ‫نوری‬ ":
          - cell
          - cell "‫رها‬"
          - cell "‫نوری‬"
          - cell "":
            - button ""
        - row
        - row "‫شهاب‬ ‫رمضانی‬ ":
          - cell
          - cell "‫شهاب‬"
          - cell "‫رمضانی‬"
          - cell "":
            - button ""
        - row
        - row "‫فروزان‬ ‫اعوانی‬ ":
          - cell
          - cell "‫فروزان‬"
          - cell "‫اعوانی‬"
          - cell "":
            - button ""
        - row
        - row "‫یلدا‬ ‫اعتمادی‬ ":
          - cell
          - cell "‫یلدا‬"
          - cell "‫اعتمادی‬"
          - cell "":
            - button ""
        - row
        - row "‫یلدا‬ ‫زاهدی‬ ":
          - cell
          - cell "‫یلدا‬"
          - cell "‫زاهدی‬"
          - cell "":
            - button ""
        - row
    `);
  await page.getByRole("button", { name: " " }).click();
  await page.getByText("مرتب سازی", { exact: true }).click();
  await page.getByRole("button", { name: "", exact: true }).click();
  await page.locator("#fd-select-4 fd-icon").click();
  await page
    .getByRole("option", { name: "نام خانوادگی" })
    .locator("span")
    .click();
  await page.getByTitle(" ", { exact: true }).locator("fd-icon").click();
  await page.getByText("نزولی").click();
  await page.getByRole("button", { name: "تایید" }).click();
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
        - row "‫آوا‬ ‫رحمتی‬ ":
          - cell
          - cell "‫آوا‬"
          - cell "‫رحمتی‬"
          - cell "":
            - button ""
        - row
        - row "‫رضا ‬ ‫بهرامی‬ ":
          - cell
          - cell "‫رضا ‬"
          - cell "‫بهرامی‬"
          - cell "":
            - button ""
        - row
        - row "‫رها‬ ‫نوری‬ ":
          - cell
          - cell "‫رها‬"
          - cell "‫نوری‬"
          - cell "":
            - button ""
        - row
        - row "‫رها‬ ‫اعتمادی‬ ":
          - cell
          - cell "‫رها‬"
          - cell "‫اعتمادی‬"
          - cell "":
            - button ""
        - row
        - row "‫شهاب‬ ‫رمضانی‬ ":
          - cell
          - cell "‫شهاب‬"
          - cell "‫رمضانی‬"
          - cell "":
            - button ""
        - row
        - row "‫فروزان‬ ‫اعوانی‬ ":
          - cell
          - cell "‫فروزان‬"
          - cell "‫اعوانی‬"
          - cell "":
            - button ""
        - row
        - row "‫یلدا‬ ‫زاهدی‬ ":
          - cell
          - cell "‫یلدا‬"
          - cell "‫زاهدی‬"
          - cell "":
            - button ""
        - row
        - row "‫یلدا‬ ‫اعتمادی‬ ":
          - cell
          - cell "‫یلدا‬"
          - cell "‫اعتمادی‬"
          - cell "":
            - button ""
        - row
    `);
});
