import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های نوع پیشرفته").click();
  await page.getByText("فیلد بازه زمانی").click();
  await page
    .getByText(
      "فیلد بازه زمانی-نمایش زمان-تکراری نباشد-غیرقابل ویرایش-مقدار پیش فرض"
    )
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "مقدار تکراری نباشد:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "مقدار تکراری نباشد:" })
    .getByRole("textbox")
    .fill("23.000");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "مقدار تکراری نباشد:" })
    .getByRole("textbox")
    .click();
  await page.waitForTimeout(2000);
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "مقدار تکراری نباشد:" })
    .getByRole("textbox")
    .fill("23.000");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.getByText(
      "مقدار فیلد 'فیلد بازه زمانی-نمایش زمان-تکراری نباشد-غیرقابل ویرایش-مقدار پیش فرض"
    )
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
