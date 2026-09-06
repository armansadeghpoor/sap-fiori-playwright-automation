import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:5126/api2/ModernWebTest/0.1/RestoreSnapshot"
  );
  await page.goto("http://localhost:8000/#/login");
  await page.waitForTimeout(2000);
  await page.reload();
  await page.reload();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .fill("راهبر");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "نام کاربری*" })
    .getByRole("textbox")
    .press("Tab");
  await page.getByRole("textbox", { name: "xxxxxxx" }).fill("123");
  await page.getByRole("button", { name: "ورود" }).click();
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
