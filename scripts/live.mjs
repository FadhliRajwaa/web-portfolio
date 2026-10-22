import { chromium } from "playwright";
const URL = "https://web-portfolio-nine-gamma-93.vercel.app";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 140)); });
page.on("pageerror", (e) => errs.push("ERR " + e.message.slice(0, 140)));

const t0 = Date.now();
await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
console.log("load ms:", Date.now() - t0);

const r = await page.evaluate(() => ({
  title: document.title,
  h1: document.querySelector("h1")?.innerText.replace(/\n/g, " "),
  photo: !!document.querySelector('img[src*="fadhli"]'),
  editorFile: document.body.innerText.match(/\w+\.cs/)?.[0],
  theme: document.documentElement.getAttribute("data-theme") ?? "light",
  overflow: document.documentElement.scrollWidth - window.innerWidth,
  projects: document.querySelectorAll(".project-row").length,
}));
console.log(JSON.stringify(r, null, 1));
console.log("console errors:", errs.length ? errs.join(" | ") : "none");
await page.waitForTimeout(2500);
await page.screenshot({ path: ".preview/live.png" });
await page.evaluate(() => window.scrollTo(0, 1200));
await page.waitForTimeout(1500);
await page.screenshot({ path: ".preview/live-work.png" });
await browser.close();
