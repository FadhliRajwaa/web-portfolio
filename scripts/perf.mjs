import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
let total = 0, js = 0, img = 0, font = 0;
page.on("response", (r) => {
  const len = Number(r.headers()["content-length"] || 0);
  const t = r.headers()["content-type"] || "";
  total += len;
  if (t.includes("javascript")) js += len;
  else if (t.includes("image")) img += len;
  else if (t.includes("font") || r.url().endsWith(".woff2")) font += len;
});
await page.goto("http://localhost:3140", { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(3200);
const v = await page.evaluate(() => new Promise((res) => {
  const out = {};
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) { out.lcp = Math.round(e.startTime); out.lcpTag = e.element?.tagName; }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  const nav = performance.getEntriesByType("navigation")[0];
  out.dcl = Math.round(nav.domContentLoadedEventEnd);
  out.load = Math.round(nav.loadEventEnd);
  setTimeout(() => res(out), 1200);
}));
console.log(`total=${(total/1024).toFixed(0)}KB js=${(js/1024).toFixed(0)}KB img=${(img/1024).toFixed(0)}KB font=${(font/1024).toFixed(0)}KB`);
console.log(JSON.stringify(v));
await browser.close();
