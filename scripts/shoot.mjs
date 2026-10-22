import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const outDir = process.argv[2] ?? ".preview";
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

async function shot(name, width, height, opts = {}) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: opts.scheme ?? "light",
  });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForLoadState("load", { timeout: 120000 }).catch(() => {});
  await page.waitForTimeout(3200);
  if (opts.scrollTo) {
    await page.evaluate((y) => window.scrollTo(0, y), opts.scrollTo);
    await page.waitForTimeout(1600);
  }
  await page.screenshot({ path: `${outDir}/${name}.png` });
  await page.close();
}

await shot("hero", 1440, 940);
await shot("work", 1440, 940, { scrollTo: 1150 });
await shot("exp", 1440, 940, { scrollTo: 2350 });
await shot("cap", 1440, 940, { scrollTo: 3400 });
await shot("contact", 1440, 940, { scrollTo: 4400 });
await shot("mobile-hero", 390, 844);
await shot("mobile-work", 390, 844, { scrollTo: 1200 });
await shot("dark-hero", 1440, 940, { scheme: "dark" });
await browser.close();
console.log("done");
