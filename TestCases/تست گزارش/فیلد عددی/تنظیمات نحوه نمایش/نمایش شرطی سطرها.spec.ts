import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../../framework/api/environment.api";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد عددی").click();
  await page.getByText("تنظیمات نحوه نمایش").click();
  await page.getByText("فیلدعددی-نمایش شرطی سطرها").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "تعداد فرزند:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "تعداد فرزند:" })
    .getByRole("textbox")
    .fill("6");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toMatchAriaSnapshot(
    `- cell "‫‪6‬"`,
  );

  await expect(page.getByText("‫‪6‬")).toBeVisible();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "تعداد فرزند:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "تعداد فرزند:" })
    .getByRole("textbox")
    .fill("5");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();

  await expect(page.getByText("‫‪5‬")).toBeVisible();
});
