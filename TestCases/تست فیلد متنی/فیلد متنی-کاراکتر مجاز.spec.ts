import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();

  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های ساده").click();
  await page.getByText("فیلد متنی").click();
  await page.getByText("متنی-غیرترکیبی(به جز فیلد اجباری)").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "فیلد کاراکترهای مجاز(ا تا ش ):" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "فیلد کاراکترهای مجاز(ا تا ش ):" })
    .getByRole("textbox")
    .fill("ا ب پ ت ث ج چ ش ه");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
