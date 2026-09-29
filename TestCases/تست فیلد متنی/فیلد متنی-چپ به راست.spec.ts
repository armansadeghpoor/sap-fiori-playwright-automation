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
    .filter({ hasText: "فیلد چپ به راست:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "فیلد چپ به راست:" })
    .getByRole("textbox")
    .fill("New Web Ui Automation Test");
  await expect(
    page.getByRole("textbox", { name: "New Web Ui Automation Test" })
  ).toHaveValue("New Web Ui Automation Test");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByText("‫New Web Ui Automation Test‬").click();
});
