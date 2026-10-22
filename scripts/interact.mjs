import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const out = "shots3";
await mkdir(out, { recursive: true });

const browser = await chromium.launch();

async function open(width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:3000", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await page.waitForLoadState("load", { timeout: 120000 }).catch(() => {});
  await page.waitForTimeout(1800);
  return page;
}

// 1. Project modal
{
  const page = await open(1440, 900);
  await page.evaluate(() => window.scrollTo(0, 1100));
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: /SAMCO SLC/ }).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/modal.png` });

  const focusInside = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return dialog ? dialog.contains(document.activeElement) : false;
  });
  console.log("focus moved into dialog:", focusInside);

  const locked = await page.evaluate(() => document.body.style.overflow);
  console.log("body scroll locked:", locked);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  const closed = (await page.locator('[role="dialog"]').count()) === 0;
  console.log("closed on Escape:", closed);

  const restored = await page.evaluate(() => document.body.style.overflow);
  console.log("scroll restored:", JSON.stringify(restored));
  await page.close();
}

// 2. Mobile menu
{
  const page = await open(390, 844);
  await page.getByRole("button", { name: "Buka menu" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/mobile-menu.png` });
  const expanded = await page
    .getByRole("button", { name: "Tutup menu" })
    .getAttribute("aria-expanded");
  console.log("menu aria-expanded:", expanded);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const closed = await page
    .getByRole("button", { name: "Buka menu" })
    .count();
  console.log("menu closes on Escape:", closed === 1);
  await page.close();
}

// 3. Theme toggle persistence
{
  const page = await open(1440, 900);
  await page.getByRole("button", { name: /mode gelap/ }).click();
  await page.waitForTimeout(500);
  const attr = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme"),
  );
  console.log("theme attr after toggle:", attr);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  const afterReload = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme"),
  );
  console.log("theme persisted after reload:", afterReload);
  await page.screenshot({ path: `${out}/dark-full.png` });
  await page.close();
}

// 4. Keyboard focus visibility
{
  const page = await open(1440, 900);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${out}/focus.png`, clip: { x: 0, y: 0, width: 1440, height: 120 } });
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? `${el.tagName}:${el.textContent?.trim().slice(0, 30)}` : null;
  });
  console.log("focused element:", focused);
  await page.close();
}

await browser.close();
console.log("done");
