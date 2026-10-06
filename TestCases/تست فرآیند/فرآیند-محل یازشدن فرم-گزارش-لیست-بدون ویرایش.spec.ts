import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("محل بازشدن فرم-گزارش لیستی-بدون ویرایش").click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("button", { name: "تایید" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("محل باز شدن فرم").click();
  await page.getByText("گزارش-لیست بدون امکان ویرایش").click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("fd-layout-grid")).toContainText("عنوان کالا:تست");
});
