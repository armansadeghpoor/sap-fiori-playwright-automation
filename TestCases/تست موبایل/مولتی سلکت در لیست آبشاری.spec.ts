import { test, expect, devices } from "@playwright/test";
test.use({
  ...devices["Pixel 7"],
});
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
  await page.getByRole("textbox", { name: "xxxxxxx" }).press("Enter");
  await page
    .getByRole("heading", { name: "به هم ریختگی نما در مولتی سلکت ها" })
    .click();
  await page.getByTitle("*حذف نشود*").first().dblclick();
  await expect(page.getByRole("button", { name: "more" })).toBeVisible();
  await page.waitForTimeout(1500);
  await page.getByTitle('Close').click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "value-help" }).click();
  await page.locator(".fd-checkbox__checkmark").first().click();
  await page
    .locator(
      "#fd-list-item-25 > .fd-list__form-item > fd-checkbox > .fd-checkbox__label > .fd-checkbox__checkmark",
    )
    .click();
  await page
    .locator(
      "#fd-list-item-26 > .fd-list__form-item > fd-checkbox > .fd-checkbox__label > .fd-checkbox__checkmark",
    )
    .click();
  await page
    .locator(
      "#fd-list-item-27 > .fd-list__form-item > fd-checkbox > .fd-checkbox__label > .fd-checkbox__checkmark",
    )
    .click();
  await page
    .locator(
      "#fd-list-item-28 > .fd-list__form-item > fd-checkbox > .fd-checkbox__label > .fd-checkbox__checkmark",
    )
    .click();
  await page
    .locator(
      "#fd-list-item-29 > .fd-list__form-item > fd-checkbox > .fd-checkbox__label > .fd-checkbox__checkmark",
    )
    .click();
  await page
    .locator(
      "#fd-list-item-30 > .fd-list__form-item > fd-checkbox > .fd-checkbox__label > .fd-checkbox__checkmark",
    )
    .click();
  await page
    .locator(
      "#fd-list-item-31 > .fd-list__form-item > fd-checkbox > .fd-checkbox__label > .fd-checkbox__checkmark",
    )
    .click();
  await page
    .locator(
      "#fd-list-item-32 > .fd-list__form-item > fd-checkbox > .fd-checkbox__label > .fd-checkbox__checkmark",
    )
    .click();
  await page
    .locator(
      "#fd-list-item-33 > .fd-list__form-item > fd-checkbox > .fd-checkbox__label > .fd-checkbox__checkmark",
    )
    .click();
  await expect(page.locator("fd-multi-input")).toBeVisible();
});
