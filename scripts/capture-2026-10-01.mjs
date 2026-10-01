import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const assetDir = path.join(root, "2026-10-01", "assets");
await fs.mkdir(assetDir, { recursive: true });
const targets = [
  ["snap-specs-first-look-official-2026-10-01.png", "https://www.tomsguide.com/computing/smart-glasses/snap-specs-hands-on-review"],
  ["memomind-one-developer-access-2026-10-01.png", "https://en.prnasia.com/releases/global/memomind-one-rolls-out-new-features-and-prepares-for-a-new-stage-of-developer-access-550240.shtml"],
  ["meta-wearables-toolkit-rollout-2026-10-01.png", "https://developers.meta.com/blog/meta-connect-recap-ai-glasses/"],
  ["hojo-agenticos-startup-2026-10-01.png", "https://hojo.ai/"],
  ["wuqi-wq7036-hawk-dolphin-2026-10-01.png", "https://www.wuqi-micro.com/about-wuqi/news-and-events/newss/85"]
];
const browser = await chromium.launch({ headless: true });
try {
  for (const [file, url] of targets) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
      await page.waitForTimeout(1600);
      await page.screenshot({ path: path.join(assetDir, file), type: "png" });
      console.log(JSON.stringify({ file, url, title: await page.title() }));
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
