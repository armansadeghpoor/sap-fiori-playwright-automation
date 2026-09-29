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
  await expect(
    page.getByRole("textbox", { name: "متن را وارد کنید" })
  ).toBeVisible();
  await page.getByRole("textbox", { name: "متن را وارد کنید" }).click();
  await page.getByRole("textbox", { name: "متن را وارد کنید" }).fill("تست");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
});
