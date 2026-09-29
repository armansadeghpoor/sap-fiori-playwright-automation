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
    .getByText("قاعده کاری-رویداد فرم(قبل از ذخیره فرم)-نمایش پیغام", {
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByRole("banner")).toContainText("اطلاعات");
  await expect(page.locator("fd-dialog-body")).toContainText(
    "عنوان کالا مقدار ندارد"
  );
  await page.getByRole("button", { name: "تایید" }).click();
});
