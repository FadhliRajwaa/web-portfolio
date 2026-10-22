import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const browser = await chromium.launch();
for (const scheme of ["light", "dark"]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForLoadState("load", { timeout: 120000 }).catch(()=>{});
  await page.waitForTimeout(1800);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  console.log(`\n=== ${scheme} === violations: ${results.violations.length}`);
  for (const v of results.violations) {
    console.log(`- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
    for (const n of v.nodes.slice(0, 3)) {
      console.log("    target:", n.target.join(" "));
      console.log("    why:", (n.failureSummary || "").split("\n").slice(1,3).join(" | "));
    }
  }
  await context.close();
}
await browser.close();
