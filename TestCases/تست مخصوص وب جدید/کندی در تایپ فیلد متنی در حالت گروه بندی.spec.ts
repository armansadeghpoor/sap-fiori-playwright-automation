
import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("کندی در تایپ فیلد متن").click();
  await page.getByTitle("تست 1", { exact: true }).locator("div").click();
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "تست" })
    .fill("تست 1 تست تست تست ست تست تست ");
  await page.getByRole("textbox", { name: "تست" }).press("Tab");
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "تست" })
    .fill("تست 1.1 تست تست تست تست تست ");
  await page.getByRole("textbox", { name: "تست" }).press("Tab");
  await page.waitForTimeout(500);
  await page.getByTitle("تست 1.1 تست تست تست تست تست ").locator("div").click();
  await page.waitForTimeout(500);
  await page
    .getByRole("textbox", { name: "تست 1.1 تست تست تست تست تست" })
    .fill("تست 1.1 تست تست ");
});
