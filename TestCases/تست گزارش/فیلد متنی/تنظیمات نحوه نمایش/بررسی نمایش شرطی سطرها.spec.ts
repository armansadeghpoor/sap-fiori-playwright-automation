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
