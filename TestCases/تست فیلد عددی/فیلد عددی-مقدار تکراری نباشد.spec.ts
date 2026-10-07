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
  await page.getByText("فیلد عددی").click();
  await page
    .getByText("عددی-غیرترکیبی(تکراری نباشد-غیر قابل ویرایش و آیکون)")
    .click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عددی-تکراری نباشد:" })
    .getByRole("spinbutton")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عددی-تکراری نباشد:" })
    .getByRole("spinbutton")
    .fill("100");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عددی-تکراری نباشد:" })
    .getByRole("spinbutton")
    .click();
  await page.waitForTimeout(2000);
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عددی-تکراری نباشد:" })
    .getByRole("spinbutton")
    .fill("100");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("fd-dialog-body div")).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
});
