import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test.use({
  storageState: "localstorage.json",
});

test("test", async ({ page }) => {
  await loginAs(page, users.rahbar);
  await page.locator('button.fd-shellbar__button--menu').click();
  await page.locator("a").filter({ hasText: "نویگیتور" }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByText("تست مخصوص وب جدید", { exact: true }).click();
  // await page.getByTitle("سیستم تست وب جدید").click();
  await page.getByRole("link", { name: "نمایش اسپلیتر در وب جدید" }).click();
  await page.getByText("‫*حذف نشود*‬").dblclick();

  const splitter = page.locator(".grip-handle");
  const box = await splitter.boundingBox();
  if (!box) {
    throw new Error("Splitter not found");
  }
  await page.mouse.move(box.x + box.width / 2 + 250, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 250, box.y + box.height / 2, {
    steps: 20,
  });
  await page.mouse.up();
});
