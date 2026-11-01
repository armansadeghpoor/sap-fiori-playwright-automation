const fs = require("node:fs");
const path = require("node:path");
const { fixture, cleanup, fingerprint } = require("./standalone-fixture.cjs");
const { withRunner } = require("./fixture.cjs");
function explorerFixture() {
  const f = fixture(); withRunner(f.root);
  const config = path.join(f.root, "playwright.config.cjs");
  fs.writeFileSync(config, `require('node:fs').appendFileSync(require('node:path').join(__dirname,'config-loaded'),'1'); module.exports={testDir:'./TestCases',projects:[{name:'Chrome'},{name:'Mobile'}]};`);
  const body = `() => { require('node:fs').writeFileSync(${JSON.stringify(path.join(f.root,"BODY_MUST_NOT_RUN"))}, 'unsafe'); throw Error('BODY_EXECUTED'); }`;
  fs.writeFileSync(f.source, `const {test}=require('@playwright/test');\ntest.describe('گروه اول',()=>{test('عنوان یکسان',${body});});\ntest.describe('گروه دوم',()=>{test('عنوان یکسان',${body});});\n`);
  const nested = path.join(path.dirname(f.source), "زیرپوشه فارسی با فاصله و مسیر نسبتاً طولانی برای بررسی", "دوم.spec.ts");
  const other = path.join(f.root, "TestCases", "other", "third.spec.ts");
  const empty = path.join(f.root, "TestCases", "empty.spec.ts");
  for (const file of [nested, other]) { fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file, `const {test}=require('@playwright/test');test(${JSON.stringify(file===nested?"Nested Persian":"Other test")},${body});`); }
  fs.writeFileSync(empty,"// spec without tests\n"); fs.mkdirSync(path.join(f.root,"TestCases","empty folder"));
  return {...f, config, nested, other, empty};
}
module.exports = { explorerFixture, cleanup, fingerprint };
