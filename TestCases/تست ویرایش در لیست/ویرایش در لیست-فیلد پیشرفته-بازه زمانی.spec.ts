import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText('ویرایش در لیست', { exact: true }).click();
  await page.getByText("انواع فیلد").click();
  await page.getByText("ویرایش در لیست-فیلد پیشرفته").click();
  await page.getByTitle(":32").locator("div").click();
  await page.getByRole("textbox").press("ArrowRight");
  await page.getByRole("textbox").press("ArrowRight");
  await page.getByRole("textbox").press("ArrowLeft");
  await page.getByRole("textbox").fill("95.2");
  await page.getByRole("textbox").press("ArrowLeft");
  await page.getByRole("textbox").fill("95.290");
  await page
    .locator("fd-dynamic-page-content div")
    .filter({ hasText: "جدید بازه زمانی ‫15:00‬" })
    .click();
  await page.getByTitle(":00").locator("div").click();
  await page.getByTitle("95.29").locator("div").click();
  await page.getByTitle(":00").locator("div").click();
  await page.getByRole("button", { name: "" }).click();
  await expect(page.locator("tbody")).toContainText("‫95:29‬");
});
