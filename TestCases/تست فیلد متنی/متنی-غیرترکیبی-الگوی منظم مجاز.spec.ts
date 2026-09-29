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
  await page.getByText("غیرترکیبی-الگوی منظم مجاز").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("d34g");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await page.getByRole("textbox", { name: "d34g" }).click();
  await page.getByRole("textbox", { name: "d34g" }).fill("4567_");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.getByRole('textbox', { name: '4567_' })).toBeVisible();
});
