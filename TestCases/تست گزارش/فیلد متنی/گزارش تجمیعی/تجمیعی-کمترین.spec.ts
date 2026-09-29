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
  await page.getByText("گزارش تجمیعی").click();
  await page.getByText("انتخاب ستون- تجمیعی-کمترین").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("کتاب");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("کتاب");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("دفتر");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("کتاب");
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
        - row "کمترین(گزارش رابطه موجودیت گزارش تجمیعی)":
          - cell
          - cell "کمترین(گزارش رابطه موجودیت گزارش تجمیعی)"
          - cell
      - rowgroup:
        - row "‫کتاب‬ ":
          - cell
          - cell "‫کتاب‬"
          - cell "":
            - button ""
        - row
        - row "‫کتاب‬ ":
          - cell
          - cell "‫کتاب‬"
          - cell "":
            - button ""
        - row
        - row "‫دفتر‬ ":
          - cell
          - cell "‫دفتر‬"
          - cell "":
            - button ""
        - row
        - row "‫دفتر‬ ":
          - cell
          - cell "‫دفتر‬"
          - cell "":
            - button ""
        - row
    `);
});
