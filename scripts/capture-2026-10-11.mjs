import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const assetDir = path.join(root, "2026-10-11", "assets");
await fs.mkdir(assetDir, { recursive: true });

const targets = [
  ["gmktec-evo-x5-pro-2026-10-11.png", "https://www.gmktec.com/products/gmktec-evo-x5-pro-amd-ryzen-ai-max-pro-495-ai-mini-pc"],
  ["ultra-robotics-op1-2026-10-11.png", "https://ultra.tech/contact"],
  ["cloudflare-clef-omni-2026-10-11.png", "https://developers.cloudflare.com/changelog/product-group/ai/"],
  ["strands-decider-2026-10-11.png", "https://huggingface.co/amazon/strands-decider-E2B-gemma4-v1-2610"],
  ["maven-robotics-2026-10-11.png", "https://www.mavenrobotics.ai/"],
  ["aws-physical-ai-toolchain-2026-10-11.png", "https://aws.amazon.com/blogs/physical-ai/introducing-aws-physical-ai-toolchain/"],
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
