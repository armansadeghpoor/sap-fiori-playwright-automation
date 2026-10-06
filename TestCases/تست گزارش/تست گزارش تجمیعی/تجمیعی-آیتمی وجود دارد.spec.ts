import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../framework/api/environment.api";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست گزارش").click();
  await page.getByText("گزارش در فیلد عددی").click();
  await page.getByText("گزارش تجمیعی").click();
  await page
    .getByText(
      "مشتری-تجمیعی-آیتمی وجود دارد-شرط داخلی پارامتر-معرف مشتری برابر کاربر جاری باشد"
    )
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام مشتری:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام مشتری:" })
    .getByRole("textbox")
    .fill("تست");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام مشتری:" })
    .getByRole("textbox")
    .press("Tab");
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").fill("123");
  await page.getByRole('button', { name: 'navigation-down-arrow' }).click();
  await page.getByText("راهبر سیستم").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").click();
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").fill("555");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان محصول:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان محصول:" })
    .getByRole("textbox")
    .fill("تست");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان محصول:" })
    .getByRole("textbox")
    .click({
      button: "right",
    });
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان محصول:" })
    .getByRole("textbox")
    .click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-barsa-table-row")).toContainText(
    "‫راهبر سیستم‬"
  );
});
