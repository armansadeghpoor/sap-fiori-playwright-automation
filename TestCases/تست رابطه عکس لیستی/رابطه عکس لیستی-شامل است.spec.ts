import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فیلد").click();
  await page.getByText("فیلد های رابطه ای").click();
  await page.getByText("رابطه عکس لیستی").click();
  await page.getByText("رابطه لیستی-شامل است-پرسنل").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").fill("تست");
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").click();
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").fill("40");
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("#fd-input-group-button-id-0").click();
  await page.getByRole("button", { name: "امروز" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.locator("#fd-input-group-button-id-1").click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page
    .getByText("رابطه عکس لیستی-شامل است-غیر قابل ویرایش-چپ به راست-تردد")
    .click();
  await page.getByRole("button", { name: "" }).nth(0).click();
  await expect(
    page.locator("bsu-column-renderer").getByText("تست")
  ).toContainText("تست");
  await expect(
    page.locator("bsu-column-renderer").getByText("40")
  ).toContainText("40");
});
