import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  test.setTimeout(80000);
  await restoreSnapshot(request);
  await loginAs(page, users.user1);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("انجام فرم-مشاهده فرم-نمای فعالیت جاری فرم").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام:" })
    .getByRole("textbox")
    .fill("نام تست");
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByRole("button", { name: "close", exact: true }).click();
  await page.waitForTimeout(5000);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("متغیر گردش").click();
  await page.getByText("انجام فرم-مشاهده فرم-نمای فعالیت جاری فرم").click();
  await page
    .getByRole("row", { name: "‫نام تست‬ " })
    .getByRole("button")
    .click();
  await expect(page.locator("fd-layout-grid")).toContainText(
    "نما2نام:نام تستسمت:"
  );
  await page.getByTitle('Close').click();
});
