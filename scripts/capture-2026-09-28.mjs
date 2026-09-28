import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const assetDir = path.join(root, "2026-09-28", "assets");
await fs.mkdir(assetDir, { recursive: true });

const targets = [
  [
    "alibaba-qwen-book-wearables-a2-official-2026-09-28.png",
    "https://www.alibabacloud.com/blog/alibaba-unveils-agentic-computer-ai-wearables-and-more-at-2026-apsara-conference_603599"
  ],
  [
    "alibaba-qwen-intelligence-honor-official-2026-09-28.png",
    "https://www.alibabacloud.com/blog/alibaba-launches-qwen-intelligence-to-power-next-generation-agentic-smartphones_603597"
  ],
  [
    "honor-magic9-official-launch-2026-09-28.png",
    "https://www.honor.com/cn/activity/honor-magic9-series-launch/"
  ],
  [
    "prismml-bonsai-smart-glasses-techcrunch-2026-09-28.png",
    "https://techcrunch.com/2026/09/24/prismml-brings-its-tiny-llms-to-qualcomm-powered-smart-glasses/"
  ],
  [
    "ai-smart-glasses-wearable-intelligence-arxiv-2026-09-28.png",
    "https://arxiv.org/abs/2609.19793"
  ],
  [
    "soundhound-oasys-edge-official-2026-09-28.png",
    "https://www.soundhound.com/newsroom/soundhound-ai-introduces-oasys-edge-bringing-fully-embedded-agentic-voice-ai-to-vehicles-and-smart-devices"
  ],
  [
    "engram-kickstarter-scan-2026-09-28.png",
    "https://aitoolly.com/ai-news/2026-09-28"
  ]
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
