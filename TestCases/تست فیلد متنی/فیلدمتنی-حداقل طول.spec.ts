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
    .filter({ hasText: "فیلد حداقل طول(2):" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "فیلد حداقل طول(2):" })
    .getByRole("textbox")
    .fill("3");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(
    page.locator("div").filter({
      hasText:
        /^اشکال در مقادیر فرم فیلد حداقل طول\(2\): طول متن \(1\) کمتر از حداقل مجاز 2 است !$/,
    })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("textbox", { name: "3" }).click();
  await page.getByRole("textbox", { name: "3" }).fill("36");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
