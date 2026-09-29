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
      "قاعده کاری-رویداد فیلد(تغییر فیلد و ابتدای باز شدن فرم)-عملیات تغییر فیلد"
    )
    .click();
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
    .fill("میز");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان کالا:" })
    .getByRole("textbox")
    .press("Tab");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "رنگ:" })
    .getByRole("textbox")
    .fill("آبی");
  await page.getByRole("textbox", { name: "میز" }).click();
  await page.getByRole("textbox", { name: "میز" }).fill("میز ها");
  await page.getByRole("textbox", { name: "آبی" }).click();
  await expect(page.getByRole("textbox", { name: "آبی" })).toHaveValue("آبی");
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "عنوان کالا:"
    - textbox "میز ها"
    - text: "رنگ:"
    - textbox "آبی"
    `);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
