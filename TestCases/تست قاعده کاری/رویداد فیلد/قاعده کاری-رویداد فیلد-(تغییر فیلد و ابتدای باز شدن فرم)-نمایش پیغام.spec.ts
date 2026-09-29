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
      "قاعده کاری-رویداد فیلد(تغییر فیلد و ابتدای باز شدن فرم)-عملبات نمایش پیغام"
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
    .fill("کتا");
  // await expect(page.locator("#cdk-overlay-2")).toContainText("اطلاعات");
  await expect(page.locator('#cdk-overlay-1')).toContainText('اطلاعات');
  await expect(page.locator('#cdk-overlay-1')).toContainText(
    'عنوان کالا نباید شامل کاراکتر "الف" باشد'
  );
  await page.locator('button[fd-dialog-decisive-button]', { hasText: 'تایید' }).first().click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("textbox", { name: "کتا" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
