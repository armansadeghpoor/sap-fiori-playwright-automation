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
