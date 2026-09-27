import { test, expect } from "@playwright/test";
import { loginAs } from "../../../framework/auth/auth.service";
import { users } from "../../../framework/auth/users";
//import { barrier } from "barrier";

test("test", async ({ page }) => {
  //await barrier.wait();
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.locator("bsu-barsa-tree-item li").getByText("تست کد").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Field").click();
  await page.locator("bsu-barsa-tree-item li").getByText("Bw.Field").click();
  await page.getByText("SetEnable").click();
  await page.getByRole("button", { name: "جدید" }).click();
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("111");
  await page.getByRole("button", { name: "SetDisable" }).click();
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "نام(فعال):"
    - textbox /\\d+/ [disabled]
    `);
    await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "SetEnable", exact: true }).click();
  await expect(
    page.locator("div").filter({ hasText: /^SetEnableIsDone:true$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(page.locator("fd-layout-grid")).toMatchAriaSnapshot(`
    - text: "نام(فعال):"
    - textbox /\\d+/
    `);
});
