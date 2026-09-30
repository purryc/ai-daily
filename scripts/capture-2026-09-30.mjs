import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const assetDir = path.join(root, "2026-09-30", "assets");
await fs.mkdir(assetDir, { recursive: true });
const targets = [
  ["openai-dots-devday-media-2026-09-30.png", "https://community.openai.com/t/devday-2026-announcements-and-developer-resources/1402006"],
  ["nvidia-open-agent-safety-official-2026-09-30.png", "https://www.nvidia.com/en-us/ai/openshell/"],
  ["mongodb-atlas-agent-engine-official-2026-09-30.png", "https://www.mongodb.com/company/newsroom/press-releases/mongodb-launches-atlas-agent-engine-to-put-ai-agents-in-production-without-a-new-stack"],
  ["microsoft-copilot-home-code-autopilot-official-2026-09-30.png", "https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/"]
];
const browser = await chromium.launch({ headless: true });
try {
  for (const [file, url] of targets) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
      await page.waitForTimeout(1800);
      if (url.includes("nvidia.com")) {
        for (const label of ["Reject Optional", "Continue"]) {
          const button = page.getByRole("button", { name: label, exact: true }).first();
          if (await button.count()) {
            try { await button.click({ timeout: 3_000 }); } catch {}
            await page.waitForTimeout(500);
          }
        }
      }
      await page.screenshot({ path: path.join(assetDir, file), type: "png" });
      console.log(JSON.stringify({ file, url, title: await page.title() }));
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
