import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const assetDir = path.join(root, "2026-10-07", "assets");
await fs.mkdir(assetDir, { recursive: true });

const targets = [
  ["atlassian-amp-agentic-multiplayer-2026-10-07.png", "https://www.atlassian.com/blog/company-news/team26-europe-founder-update"],
  ["openai-decisions-api-beta-2026-10-07.png", "https://community.openai.com/t/decisions-api-is-now-available-in-public-beta/1403877"],
  ["femtoai-developer-community-2026-10-07.png", "https://developer.femto.ai/"],
  ["microsoft-windows-surface-event-2026-10-07.png", "https://news.microsoft.com/windows-surface-october-2026-news/"],
  ["ericsson-torch-it-global-scan-2026-10-07.png", "https://gadgetsnow.indiatimes.com/tech-news/ericssons-torch-it-ai-glasses-turn-text-diagrams-and-images-into-sound-for-visually-impaired-users/articleshow/134762340.cms"]
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
