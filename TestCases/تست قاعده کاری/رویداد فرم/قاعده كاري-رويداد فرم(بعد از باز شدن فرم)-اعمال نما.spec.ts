import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست قاعده کاری").click();
  await page.getByText("رویداد فرم").click();
  await page
    .getByText("قاعده کاری-رویداد فرم(بعد از باز شدن فرم)-اعمال نما")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان جلسه:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان جلسه:" })
    .getByRole("textbox")
    .fill("سیستم آموزش");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان جلسه:" })
    .getByRole("textbox")
    .press("Tab");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "دبیرجلسه:" })
    .getByRole("textbox")
    .fill("کرمی");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "عنوان جلسه:"
    - paragraph: سیستم آموزش
    - text: "دبیرجلسه:"
    - paragraph: کرمی
    `);
  await page.locator("bsu-ly-vertical-layout").getByText("سیستم آموزش").click();
  await page.getByText("کرمی").click();
});
