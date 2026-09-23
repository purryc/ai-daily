import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const out = path.join(root, "2026-09-23", "assets");
await fs.mkdir(out, { recursive: true });

const pages = [
  ["rabbit-os3-official-2026-09-23.png", "https://www.rabbit.tech/newsroom/rabbitos-3-launch"],
  ["meta-muse-official-2026-09-23.png", "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/"],
  ["vonder-prnews-2026-09-23.png", "https://www.prnewswire.com/news-releases/vonder-launches-intelligent-eyewear-built-as-eyewear-first-made-for-your-eyes-your-mind-and-your-privacy-302886076.html"],
  ["meta-wearables-dev-2026-09-23.png", "https://developers.meta.com/wearables/"],
  ["openjiuwen-official-2026-09-23.png", "https://www.openjiuwen.com/"],
  ["qwen-platform-aliyun-2026-09-23.png", "https://cn.aliyun.com/product/bailian?from_alibabacloud=&userCode=t1dwdo7u"]
];

const browser = await chromium.launch({ headless: true });
try {
  for (const [file, url] of pages) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(out, file), fullPage: false });
    console.log(JSON.stringify({ file, url, title: await page.title() }));
    await page.close();
  }
} finally {
  await browser.close();
}
