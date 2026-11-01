import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
await mkdir("grabs-vibe", { recursive: true });
const browser = await chromium.launch();
for (const [name, url] of [
  ["home", "https://www.vibe2dev.my.id"],
  ["roadmap", "https://www.vibe2dev.my.id/roadmap"],
  ["courses", "https://www.vibe2dev.my.id/courses"],
]) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(3200);
    await page.screenshot({ path: `grabs-vibe/${name}.png` });
    console.log("ok", name, await page.title());
  } catch (e) { console.log("fail", name, e.message.slice(0, 90)); }
  await page.close();
}
await browser.close();
