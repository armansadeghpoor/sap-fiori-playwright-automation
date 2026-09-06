import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["Pixel 7"],
});

test("test", async ({ page }) => {
  await page.goto("http://localhost:8000/#/login");
await expect(page.locator('bsu-ly-layout-container-of-root')).toMatchAriaSnapshot(`
    - img
    - paragraph: برسا نوین رای
    - text: ‌
    - paragraph
    - text: نام کاربری
    - strong: "*"
    - textbox
    - text: رمز عبور
    - strong: "*"
    - textbox "xxxxxxx"
    - text:  زبان
    - combobox "انتخاب کنید"
    - button "Select Options"
    - text: ‌
    - button "ورود"
    - text: ‌
    - button "person placeholder"
    - text: ‌
    - link "ثبت‌نام":
      - /url: /#/signup
    - text: ‌
    - link "رمز‌را‌فراموش‌کرده‌ام":
      - /url: /#/recoverpassword
    - text: ‌
    - paragraph: /برسا نوین رای© \\d+ - \\d+/
    `);
});
