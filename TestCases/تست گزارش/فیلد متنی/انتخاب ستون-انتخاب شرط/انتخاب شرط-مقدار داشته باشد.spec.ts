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
  await page.getByText("فیلد متنی- انتخاب شرط-مقدار داشته باشد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("spinbutton").click();
  await page.getByRole("spinbutton").fill("20");
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
    `);
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست 20");
  await page.getByRole("textbox").press("Tab");
  await page.getByRole("spinbutton").fill("20");
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
        - row /‫تست \\d+‬ ‫‪\\d+‬ /:
          - cell
          - cell /‫تست \\d+‬/
          - cell /‫‪\\d+‬/
          - cell "":
            - button ""
        - row
    `);
});
