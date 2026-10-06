import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
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
