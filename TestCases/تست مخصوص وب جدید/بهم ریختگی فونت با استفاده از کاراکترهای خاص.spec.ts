import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("بهم ریختگی فونت با کاراکتر های خاص").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page
    .getByRole("textbox")
    .fill("سلام!تست@برسا#وب جدید$سیستم%فونت^تست&50*60*70");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await expect(page.locator("bsu-column-renderer").nth(1)).toContainText(
    "‫سلام!تست@برسا#وب جدید$سیستم%فونت^تست&50*60*70‬"
  );
});
