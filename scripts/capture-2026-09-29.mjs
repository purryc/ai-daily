import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const assetDir = path.join(root, "2026-09-29", "assets");
await fs.mkdir(assetDir, { recursive: true });
const targets = [
  ["advantech-asr-d501-official-2026-09-29.png", "https://adv-www-jp.azurewebsites.net/en-us/resources/news/asr-d501-grand-launch"],
  ["sonos-27-ace-beam-ultra-official-2026-09-29.png", "https://newsroom.sonos.com/269852-sonos-welcomes-beam-ultra-and-sonos-ace-ultra-to-its-system/"],
  ["openai-devday-2026-official-2026-09-29.png", "https://devday.openai.com/"]
];
const browser = await chromium.launch({ headless: true });
try {
  for (const [file, url] of targets) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(assetDir, file), type: "png" });
    console.log(JSON.stringify({ file, url, title: await page.title() }));
    await page.close();
  }
} finally {
  await browser.close();
}
