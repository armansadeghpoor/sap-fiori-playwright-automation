import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
  await page.goto("http://localhost:8000/#/login");
  await page.getByRole("button", { name: "Select Options" }).click();
  await page.getByText("English").click();
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
  await page.getByRole("button", { name: "SignIn" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await expect(page.locator("bt-barsa-shellbar")).toMatchAriaSnapshot(`
    - list:
      - listitem:
        - button ""
        - text: تست فیلد
      - listitem:
        - button ""
        - text: تست کد
      - listitem:
        - button ""
        - text: تست گزارش
      - listitem:
        - button ""
        - text: تست فرآیند
      - listitem:
        - button ""
        - text: ویرایش در لیست
      - listitem:
        - button ""
        - text: تست قاعده کاری
      - listitem:
        - button ""
        - text: تست نما
      - listitem:
        - button ""
        - text: تست دستور پویا
      - listitem:
        - button ""
        - text: تست وب جدید
    `);
});
