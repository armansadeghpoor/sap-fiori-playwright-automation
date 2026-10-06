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
