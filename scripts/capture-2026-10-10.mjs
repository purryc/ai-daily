import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const assetDir = path.join(root, "2026-10-10", "assets");
await fs.mkdir(assetDir, { recursive: true });

const targets = [
  ["amazon-alexa-tablets-2026-10-10.png", "https://www.aboutamazon.com/news/devices/new-amazon-alexa-tablets-alexa-plus"],
  ["ghost-core-2026-10-10.png", "https://ghost.ai/core"],
  ["natura-interface-ring-2026-10-10.png", "https://natura.inc/interface"],
  ["goodfire-monitors-2026-10-10.png", "https://techcrunch.com/2026/10/08/goodfire-says-its-new-inside-out-monitors-catch-rogue-ai-agents-at-a-fraction-of-the-cost/"],
  ["cybopal-one-2026-10-10.png", "https://www.techradar.com/pro/this-usd1599-smart-monitor-robotic-arm-has-its-own-built-in-pc-and-its-27-inch-4k-display-will-follow-you-around-thanks-to-its-binocular-3d-sensor"],
  ["amazon-alexa-tablet-review-2026-10-10.png", "https://inside-digital.de/news/amazon-alexa-tablet-12-pro-ausprobiert/amp/"],
  ["danu-hero-recycling-robot-2026-10-10.png", "https://techcrunch.com/2026/10/09/danu-robotics-fight-to-build-a-better-recycling-robot/"],
];

const browser = await chromium.launch({ headless: true });
try {
  for (const [file, url] of targets) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
      await page.waitForTimeout(1800);
      await page.screenshot({ path: path.join(assetDir, file), type: "png", fullPage: true });
      console.log(JSON.stringify({ file, url, title: await page.title() }));
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
