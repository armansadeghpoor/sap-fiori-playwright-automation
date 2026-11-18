import { test, expect } from "@playwright/test";
import { loginAs } from "../../framework/auth/auth.service";
import { users } from "../../framework/auth/users";
import { recordingDevices } from "../../framework/config/recording-devices";

test.use({
  ...recordingDevices["desktop"],
  browserName: "chromium",
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

test("بهم ریختگی در فرم ها", async ({ page }) => {
  await loginAs(page, users.rahbar);

  // Paste the recorded business actions and assertions here.
   await page.locator('.fd-avatar__icon').click();
  await page.getByRole('menuitem', { name: 'نویگیتور' }).click();
  await page.getByRole('button', { name: 'App Launcher' }).click();
  await page.getByRole('menuitem', { name: 'تست مخصوص وب جدید سناریو برای بخش های مختلف وب جدید' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).click();
  await page.getByRole('searchbox', { name: 'جستجو در گزارش‌ها' }).fill('بهم ریختگی در فرم ها');
  await page.getByRole('link', { name: 'بهم ریختگی در فرم ها' }).click();
  await page.getByRole('link', { name: '‫TEST-PR-1405-0001‬' }).dblclick();
  await expect(page.locator('[id="ایجاد گروه"]')).toMatchAriaSnapshot(`
    - text: "درخواست‌دهنده:"
    - textbox
    - text: "واحد درخواست‌دهنده:"
    - textbox: این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد
    - text: "تاریخ درخواست:"
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - text: "شماره درخواست:"
    - paragraph: /TEST-PR-\\d+-\\d+/
    - text: "روش ثبت:"
    - textbox: این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد
    - tablist:
      - listitem:
        - tab "درخواست/سفارش خرید default" [selected]
      - listitem:
        - tab "قرارداد/الحاقیه default"
      - listitem:
        - tab "صورت وضعیت/فاکتور default"
      - listitem:
        - tab "حساب هزینه default"
      - listitem:
        - tab "لیست اموال default"
    - button "جزییات درخواست خرید":
      - img
      - text: ""
    - button "جزییات سفارش خرید":
      - img
      - text: ""
    - text: "نوع طرف حساب *:"
    - textbox: این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد
    - text: "طرف حساب *:"
    - textbox
    - text: "شرکت واسط پرداخت:"
    - combobox: این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد
    - button "navigation-down-arrow"
    - button "حذف"
    - text: "مبنای پرداخت :"
    - strong: "*"
    - combobox: این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد
    - button "navigation-down-arrow"
    - button "حذف"
    - text: "موضوع پرداخت:"
    - strong: "*"
    - combobox: این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد
    - button "navigation-down-arrow"
    - button "حذف"
    - text: "نوع تضمین :"
    - strong: "*"
    - combobox: این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد
    - button "navigation-down-arrow"
    - button "حذف"
    - text: "اولویت پرداخت :"
    - strong: "*"
    - combobox: این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد
    - button "navigation-down-arrow"
    - button "حذف"
    - text: "محاسبه مبلغ متناسب با موضوع پرداخت بر اساس حساب پیمانکار در پروژه:"
    - checkbox
    - text: "نوع مبالغ:"
    - strong: "*"
    - radio "ریالی/ارزی" [checked]
    - text: ریالی/ارزی
    - radio "ارزی"
    - text: "ارزی مبلغ درخواستی ریالی:"
    - textbox
    - text: "مبلغ درخواستی ارزی:"
    - textbox
    - text: "نوع ارز:"
    - combobox: این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد
    - button "navigation-down-arrow"
    - button "حذف"
    - text: "نرخ تسعیر ارز:"
    - textbox: "1"
    - text: "مبلغ معادل (ریال):"
    - paragraph: ‪-1
    - text: "مبلغ کل:"
    - paragraph: ‪-1
    - paragraph: "[خطا!]"
    - text: "توضیحات درخواست پرداخت:"
    - textbox "رکورد آزمایشی برای بررسی فرم درخواست پرداخت و صحت انتقال فیلدها و نماها.":
      - /placeholder: ""
    - text: "توضیحات مراحل پراخت:"
    - textbox
    - text: "توضیحات حساب پرداخت:"
    - textbox
    - region:
      - text: "اقدام:"
      - strong: "*"
      - combobox: این یک رکورد با متنی بسیار طولانی در جهت تست شرکت فکور صنعت می باشد
      - button "navigation-down-arrow"
      - button "حذف"
      - button "مشاهده گردش و نظرات":
        - img
        - text: ""
      - text: "ثبت نظر:"
      - textbox "رکورد آزمایشی برای بررسی فرم درخواست پرداخت و صحت انتقال فیلدها و نماها.":
        - /placeholder: ""
      - text: "اصل کلیه اسناد با امضای گرم پیوست شده، با تصویر پیوست تطابق دارد، و پس از تاییدات، به واحد کنترل اسناد ارسال خواهد شد:"
      - checkbox
      - text: "رمز یکبارمصرف:"
      - textbox "رمز یکبارمصرف"
      - button "دریافت رمز":
        - img
        - text: ""
      - button "دریافت مجدد":
        - img
        - text: ""
      - text: "پیامک شد:"
      - checkbox
    `);
  await expect(page.locator('[id="ایجاد گروه"]')).toContainText('درخواست‌دهنده:واحد درخواست‌دهنده:تاریخ درخواست:1405/08/16 شماره درخواست:TEST-PR-1405-0001روش ثبت: درخواست/سفارش خرید default قرارداد/الحاقیه default صورت وضعیت/فاکتور default حساب هزینه default لیست اموال default جزییات درخواست خریدجزییات سفارش خریدنوع طرف حساب *:طرف حساب *:شرکت واسط پرداخت:مبنای پرداخت :*موضوع پرداخت:*نوع تضمین :*اولویت پرداخت :*محاسبه مبلغ متناسب با موضوع پرداخت بر اساس حساب پیمانکار در پروژه:نوع مبالغ:* ریالی/ارزی ارزی مبلغ درخواستی ریالی:مبلغ درخواستی ارزی:نوع ارز:نرخ تسعیر ارز:مبلغ معادل (ریال):‪-1مبلغ کل:‪-1[خطا!]توضیحات درخواست پرداخت:توضیحات مراحل پراخت:توضیحات حساب پرداخت:اقدام:*مشاهده گردش و نظراتثبت نظر:اصل کلیه اسناد با امضای گرم پیوست شده، با تصویر پیوست تطابق دارد، و پس از تاییدات، به واحد کنترل اسناد ارسال خواهد شد:رمز یکبارمصرف:دریافت رمزدریافت مجددپیامک شد:');
});

