import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(2500);

// Walk the page like a reader.
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= h; y += 500) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(220);
}
await page.waitForTimeout(1200);

const report = await page.evaluate(() => {
  const sel = ".project-row, .exp-entry, .cap-group";
  const els = [...document.querySelectorAll(sel)];
  const hidden = els.filter(e => Number(getComputedStyle(e).opacity) < 0.95);
  return { total: els.length, hidden: hidden.length, labels: hidden.slice(0,4).map(e => e.textContent.slice(0,30)) };
});
console.log(JSON.stringify(report));

// Jump test: fresh page, jump straight to the bottom (deep-link / restore).
const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await p2.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 120000 });
await p2.waitForTimeout(2000);
await p2.evaluate(() => window.scrollTo(0, 5200));
await p2.waitForTimeout(1600);
const jump = await p2.evaluate(() => {
  const els = [...document.querySelectorAll(".project-row, .exp-entry, .cap-group")];
  return { total: els.length, hidden: els.filter(e => Number(getComputedStyle(e).opacity) < 0.95).length };
});
console.log("after jump:", JSON.stringify(jump));
await browser.close();
