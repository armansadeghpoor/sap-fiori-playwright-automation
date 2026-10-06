import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.user1);
  await page.locator("#fd-avatar-0").click();
  await page.getByRole("menuitem", { name: "بازآوری ساختار" }).click();
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست فرآیند").click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("حذف اشیا و فرم مرتبط با حذف فرم").click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("تست");
  await page.getByRole("textbox").press("Tab");
  await page.getByRole("spinbutton").fill("110");
  await page.getByTitle('Close').click();
  await page.getByRole("button", { name: "خیر", exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("اجرای فرآیندها").click();
  await page.getByText("تنظیمات فرم").click();
  await page.getByText("حذف اشیا مرتبط و فرآیند با حذف فرم").click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("fd-dynamic-page-content")).toContainText(
    "جدید نام شماره (موردی یافت نشد)"
  );
});
