import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../../framework/api/environment.api";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد متنی").click();
  await page.getByText("گزارش تجمیعی").click();
  await page.getByText("انتخاب ستون-تجمیعی-سطر جمع بندی").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByTitle("تست").locator("div")).toBeVisible();
  await expect(
    page.locator(
      ".fd-table__row.fd-table__row--hoverable.fd-table__row--focusable.fd-table__row--main.ng-star-inserted > td:nth-child(3) > bsu-barsa-table-column > div > bsu-column-renderer > .renderGeneral > .ellapsis"
    )
  ).toBeVisible();
});
