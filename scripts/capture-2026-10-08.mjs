import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const assetDir = path.join(root, "2026-10-08", "assets");
await fs.mkdir(assetDir, { recursive: true });

const targets = [
  ["google-gemini-agent-2026-10-08.png", "https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026"],
  ["google-workspace-inline-agent-2026-10-08.png", "https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026"],
  ["microsoft-surface-laptop-ultra-2026-10-08.png", "https://news.microsoft.com/windows-surface-october-2026-news/"],
  ["microsoft-execution-containers-2026-10-08.png", "https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/"],
  ["github-copilot-local-models-2026-10-08.png", "https://github.blog/changelog/2026-10-07-discover-local-models-in-github-copilot-cli/"],
  ["devally-agent-2026-10-08.png", "https://devally.com/"]
];

const browser = await chromium.launch({ headless: true });
try {
  for (const [file, url] of targets) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
      await page.waitForTimeout(1800);
      await page.screenshot({ path: path.join(assetDir, file), type: "png" });
      console.log(JSON.stringify({ file, url, title: await page.title() }));
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
