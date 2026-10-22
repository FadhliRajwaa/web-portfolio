import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const logs = [];
page.on("console", (m) => { if (["error","warning"].includes(m.type())) logs.push(`[${m.type()}] ${m.text().slice(0,160)}`); });
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message.slice(0,160)}`));

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(3000);

for (const w of [360, 390, 768, 1024, 1280, 1440, 1920]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(320);
  const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`overflow@${w} = ${o}`);
}

// Check that no GSAP-animated row is stuck invisible.
const hidden = await page.evaluate(() => {
  const els = [...document.querySelectorAll(".project-row, .exp-entry, .cap-group")];
  return els.filter(e => Number(getComputedStyle(e).opacity) < 0.9).length;
});
console.log("stuck-invisible rows:", hidden);
console.log("console:", logs.length ? logs.join("\n") : "clean");
await browser.close();
