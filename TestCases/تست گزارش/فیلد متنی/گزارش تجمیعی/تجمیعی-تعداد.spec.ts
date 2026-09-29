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
  await page.getByText("انتخاب ستون- تجمیعی-تعداد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-column-renderer")).toContainText("‫1‬");
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("وب جدید");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("‫2‬");
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("سییستم ساز");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("‫3‬");
  await page.getByRole("button", { name: "" }).click();
  await page.getByRole("button", { name: "" }).click();
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
        - row "تعداد(گزارش رابطه موجودیت گزارش تجمیعی)":
          - cell
          - cell "تعداد(گزارش رابطه موجودیت گزارش تجمیعی)"
          - cell
      - rowgroup:
        - row "‫3‬ ":
          - cell
          - cell "‫3‬"
          - cell "":
            - button ""
        - row
        - row "‫3‬ ":
          - cell
          - cell "‫3‬"
          - cell "":
            - button ""
        - row
        - row "‫3‬ ":
          - cell
          - cell "‫3‬"
          - cell "":
            - button ""
        - row
    `);
});
