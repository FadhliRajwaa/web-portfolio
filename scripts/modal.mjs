import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 940 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo(0, 1200));
await page.waitForTimeout(1200);
await page.getByRole("button", { name: /SASTRO PACS/ }).click();
await page.waitForTimeout(1800);
await page.screenshot({ path: ".preview/modal-pacs.png" });

const focus = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  return d ? d.contains(document.activeElement) : false;
});
console.log("focus trapped:", focus);
console.log("scroll locked:", await page.evaluate(() => document.body.style.overflow));

await page.keyboard.press("Escape");
await page.waitForTimeout(700);
console.log("closed:", (await page.locator('[role="dialog"]').count()) === 0);

await page.getByRole("button", { name: /SAMCO SLC/ }).click();
await page.waitForTimeout(1500);
await page.screenshot({ path: ".preview/modal-nda.png" });
await browser.close();
