import { test, expect } from "@playwright/test";
import { restoreSnapshot } from "../../framework/api/environment.api";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";

test("test", async ({ page, request }) => {
  await restoreSnapshot(request);
  await loginAs(page, users.rahbar);
  await page.getByRole("button", { name: "Navigation" }).click();
  await page.getByText("تست وب جدید").click();
  await page.getByText("گزارشات از نوع نقشه").click();
  await page.getByRole("button", { name: "جستجو" }).click();
  await page.locator('button:has(.sap-icon--table-view)').click();
  await page.getByRole("menuitem").nth(1).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Zoom in" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Zoom in" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Zoom in" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Zoom in" }).click();
  await page
    .locator("div")
    .filter({ hasText: "+− OpenStreetMap" })
    .nth(3)
    .click();

  await page
    .locator("div")
    .filter({ hasText: "+− OpenStreetMap" })
    .nth(3)
    .click();
  await page.mouse.down({ button: "left" });
  await page.waitForTimeout(500);
  await page
    .locator("fd-popover-body ul li")
    .getByRole("button")
    .getByText("جدید")
    .click();

  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان:" })
    .getByRole("textbox")
    .fill("تست 1.1");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();

  await page.locator('button', { has: page.locator('.sap-icon--map2') }).click();
  await page.locator(".fd-menu__title").first().click();

  await page.getByRole("button", { name: "جدید" }).click();

  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "lng:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "lng:" })
    .getByRole("textbox")
    .fill("51.402401885805496");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "lng:" })
    .getByRole("textbox")
    .press("Tab");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "lat:" })
    .getByRole("textbox")
    .fill("35.74996587723714");
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان:" })
    .getByRole("textbox")
    .click();
  await page
    .locator("bsu-layout-control")
    .filter({ hasText: "عنوان:" })
    .getByRole("textbox")
    .fill("تست 1.2");
  await page.getByRole("button", { name: "ذخیره و بستن" }).click();
  await page.locator('button:has(.sap-icon--table-view)').click();
  await page.getByRole("menuitem").nth(1).click();
  await expect(page.locator("bsu-ui-map-report")).toMatchAriaSnapshot(`
      - img
      - img
      - img
      - button "Zoom in"
      - button "Zoom out"
      - link "Nominatim Search":
        - /url: "#"
      - link "Layers":
        - /url: "#"
      - link "Leaflet":
        - /url: https://leafletjs.com
      - text: "| © OpenStreetMap, © OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France, Map data ©"
      - link "OpenStreetMap":
        - /url: http://openstreetmap.org
      - text: contributors,
      - link "CC-BY-SA":
        - /url: http://creativecommons.org/licenses/by-sa/2.0/
      - text: ", Imagery ©"
      - link "Mapbox":
        - /url: http://mapbox.com
      `);
  await page.waitForTimeout(3000);
});
