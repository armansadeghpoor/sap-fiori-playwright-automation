import { test, expect, devices } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
test.use({
  ...devices["Pixel 7"],
});
test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
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
