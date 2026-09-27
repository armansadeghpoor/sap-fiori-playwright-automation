import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست نما").click();
  await page.getByText("بازنویسی شرط پشت گزارش").click();
  await page
    .locator("#fd-list-item-13")
    .getByText("بازنویسی شرط پشت گزارش")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "عنوان:"
    - textbox
    - text: "تکی:"
    - combobox "انتخاب کنید":
      - listbox:
        - listitem: تست 1.1
        - listitem: تست 1.2
    - button "Select Options"
    `);
  await page.getByTitle('Close').click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("بازنویسی شرط پشت - بازنویسی شده").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "Select Options" }).click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "عنوان:"
    - textbox
    - text: "تکی:"
    - combobox "انتخاب کنید":
      - listbox:
        - listitem: تست 2.1
        - listitem: تست 2.2
    - button "Select Options"
    `);
  await page.getByTitle('Close').click();
});
