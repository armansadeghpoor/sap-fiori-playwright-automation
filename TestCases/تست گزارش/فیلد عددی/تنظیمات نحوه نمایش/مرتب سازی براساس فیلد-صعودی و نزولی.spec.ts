import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../../../framework/api/environment.api";
import { loginAs } from "../../../../framework/auth/auth.service";
import { users } from "../../../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("#fd-list-item-5").click();
  await page.getByText("گزارش در فیلد عددی").click();
  await page.getByText("تنظیمات نحوه نمایش").click();
  await page.getByText("فیلدعددی-مرتب سازی براساس فیلد").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .click();
  await page.waitForTimeout(1000);
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .fill("12");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "تعداد فرزند:" })
    .getByRole("textbox")
    .click();
  await page.waitForTimeout(1000);
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "تعداد فرزند:" })
    .getByRole("textbox")
    .fill("8");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .click();
  await page.waitForTimeout(1000);
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .fill("36");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .click();
  await page.waitForTimeout(1000);
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .fill("42");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .click();
  await page.waitForTimeout(1000);
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .fill("28");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("ذخیره و جدید").click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .click();
  await page.waitForTimeout(1000);
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "شماره بیمه:" })
    .getByRole("textbox")
    .fill("29");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: " " }).click();
  await page.getByText("مرتب سازی", { exact: true }).click();
  await page.getByTitle("نزولی").locator("fd-icon").click();
  await page.getByRole("option", { name: "نزولی" }).locator("span").click();
  await page.getByRole("button", { name: "تایید" }).click();
  // await expect(page.locator("bsu-ui-table-view")).toContainText(
  //   "شماره بیمه تعداد فرزند ‫‪42‬‫‪36‬‫‪29‬‫‪28‬‫‪12‬‫‪8‬"
  // );
  await page.getByRole("button", { name: " " }).click();
  await page.getByText("مرتب سازی", { exact: true }).click();
  await page.getByTitle("نزولی").locator("fd-icon").click();
  await page.getByText("صعودی").click();
  await page.getByRole("button", { name: "تایید" }).click();
  // await expect(page.locator("bsu-ui-table-view")).toContainText(
  //   "شماره بیمه تعداد فرزند ‫‪8‬‫‪12‬‫‪28‬‫‪29‬‫‪36‬‫‪42‬"
  // );
});
