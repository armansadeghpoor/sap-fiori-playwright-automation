import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page
    .getByRole("listitem")
    .filter({ has: page.getByText("تست مخصوص وب جدید", { exact: true }) })
    .click();
  await page.getByTitle("سیستم تست وب جدید").click();
  await page.getByRole("link", { name: "نشانه گذاری متن پیشرفته" }).click();
  await page.getByRole("cell", { name: "" }).click();
  await expect(
    page
      .locator('iframe[title="Rich Text Area"]')
      .contentFrame()
      .locator("html"),
  ).toContainText("تست نقطهاندرلاینتست شمارهایتالیکتست بولد");
  await page.getByRole("tab", { name: "غیرقابل ویرایش default" }).click();
  await expect(page.locator("bsu-ui-tinymce")).toContainText(
    "تست نقطه اندرلاین تست شماره تست ایتالیک تست بولد",
  );
  await expect(page.locator("bsu-ui-tinymce")).toContainText(
    "تست نقطه اندرلاین",
  );
  await expect(page.locator("ol")).toContainText(
    "تست شماره تست ایتالیک تست بولد",
  );
  await page.waitForTimeout(2000);
});
