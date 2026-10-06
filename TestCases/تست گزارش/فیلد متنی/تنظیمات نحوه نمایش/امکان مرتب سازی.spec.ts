import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../../framework/api/environment.api";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
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
