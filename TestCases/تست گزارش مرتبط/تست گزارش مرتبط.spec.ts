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
  await page.getByText("گزارش مرتبط").click();
  await page.getByText("مرجع گزارش مرتبط-دانش آموزان").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").click();
  await page.locator("bsu-ui-text-field").getByRole("textbox").fill("تست");
  await page.locator("bsu-ui-text-field").getByRole("textbox").press("Tab");
  await page.locator("bsu-ui-num-int-ui").getByRole("textbox").fill("16.960");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("گزارش مرتبط-وضعیت نمرات دانش آموزان").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("99");
  await expect(page.locator("fdp-icon-tab-bar-tab-content")).toContainText(
    "جدید نام معدل ‫ali‬‫‪14.96‬‫reza‬‫‪18.89‬‫تست‬‫‪16.96‬"
  );
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "" }).nth(0).click();
});
