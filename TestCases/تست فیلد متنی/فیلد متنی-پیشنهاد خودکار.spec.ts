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
  await page.getByRole("combobox").click();
  await page.getByRole("combobox").fill("سارا");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.locator("fd-menu-addon").click();
  await page.getByRole("combobox").click();
  await page.waitForTimeout(4000);
  await page.getByRole("combobox").type("س");
  await page.getByRole("combobox").type("ا");
  await page.getByRole("combobox").type("ر");
  await page.waitForTimeout(4000);
  await page.getByRole("combobox").type("ا");
  await page.keyboard.press("Backspace");
  await page.getByText("سارا").click();
  await page.getByRole("combobox").click();
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("tbody")).toContainText("سارا");
});
