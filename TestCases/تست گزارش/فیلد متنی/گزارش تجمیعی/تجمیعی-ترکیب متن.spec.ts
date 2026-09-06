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
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد متنی").click();
  await page.getByText("گزارش تجمیعی").click();
  await page.getByText("انتخاب ستون- تجمیعی- ترکیب متن").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("مداد");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page.waitForTimeout(1000);
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("کتاب");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page.waitForTimeout(1000);
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("کلاس");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page.waitForTimeout(1000);
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("دفتر");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page.waitForTimeout(1000);
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("قلم");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page.waitForTimeout(1000);
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("میز");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
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
        - row "ترکیب متن(گزارش رابطه موجودیت گزارش تجمیعی)":
          - cell
          - cell "ترکیب متن(گزارش رابطه موجودیت گزارش تجمیعی)"
          - cell
      - rowgroup:
        - row "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬ ":
          - cell
          - cell "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬"
          - cell "":
            - button ""
        - row
        - row "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬ ":
          - cell
          - cell "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬"
          - cell "":
            - button ""
        - row
        - row "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬ ":
          - cell
          - cell "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬"
          - cell "":
            - button ""
        - row
        - row "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬ ":
          - cell
          - cell "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬"
          - cell "":
            - button ""
        - row
        - row "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬ ":
          - cell
          - cell "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬"
          - cell "":
            - button ""
        - row
        - row "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬ ":
          - cell
          - cell "‫مداد- کتاب- کلاس- دفتر- قلم- میز‬"
          - cell "":
            - button ""
        - row
    `);
});
