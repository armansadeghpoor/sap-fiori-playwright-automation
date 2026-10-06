import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("گزارشات از نوع نقشه").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await page.locator('button:has(.sap-icon--table-view)').click();
  await page.getByRole("menuitem").nth(1).click();
  await page.locator("bsu-ui-map-report div").first().click();
  await page
    .locator("div")
    .filter({ hasText: "+− OpenStreetMap" })
    .nth(3)
    .click();
  await page.mouse.down({ button: "left" });
  await page.waitForTimeout(1000);
  await page
    .locator("fd-popover-body ul li")
    .getByRole("button")
    .getByText("جدید")
    .click();

  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان:" })
    .getByRole("textbox")
    .fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
