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
  await page.getByText("تست قاعده کاری").click();
  await page.getByText("رویداد فیلد").click();
  await page
    .getByText(
      "-قاعده کاری-رویداد فیلد(تغییر فیلد و ابتدای باز شدن فرم)-عملیات اعمال نما"
    )
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "رنگ:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "رنگ:" })
    .getByRole("textbox")
    .fill("زرد");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان کالا:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان کالا:" })
    .getByRole("textbox")
    .fill("کتاب");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page
    .getByRole("row", { name: "‫کتاب‬ ‫زرد‬ " })
    .getByRole("button")
    .click();
  await page.locator("fd-text").click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "عنوان کالا:"
    - textbox "کتاب"
    - text: "رنگ:"
    - paragraph: زرد
    `);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان کالا:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان کالا:" })
    .getByRole("textbox")
    .fill("تست");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "رنگ:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "رنگ:" })
    .getByRole("textbox")
    .fill("زرد");

  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page
    .getByRole("row", { name: "‫تست‬ ‫زرد‬ " })
    .getByRole("button")
    .click();
  await page.getByRole("textbox", { name: "زرد" }).click();
  await page.getByRole("textbox", { name: "زرد" }).fill("زرد تستی");
  await expect(page.getByRole("textbox", { name: "زرد تستی" })).toHaveValue(
    "زرد تستی"
  );
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
