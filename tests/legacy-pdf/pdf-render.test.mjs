import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { createStaticServer } from "../../scripts/lib/static-server.mjs";
import { checkPdfPages } from "../../scripts/lib/pdf-check.mjs";
test("actual PDF pages at 50 pass and 51 fail the publication gate", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ai-daily-pdf-"));
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.AI_DAILY_CHROMIUM_PATH ?? "/usr/bin/chromium",
    });
    const page = await browser.newPage();
    for (const pages of [50, 51]) {
      await page.setContent(
        "<style>@page{size:16in 9in;margin:0}body{margin:0}section{width:16in;height:9in;break-after:page}</style>" +
          Array.from(
            { length: pages },
            (_, i) => `<section>Page ${i + 1}</section>`,
          ).join(""),
      );
      const file = path.join(root, `pages-${pages}.pdf`);
      await page.pdf({ path: file, preferCSSPageSize: true });
      if (pages === 50) assert.equal(await checkPdfPages(file), 50);
      else await assert.rejects(checkPdfPages(file), /50 printed pages/);
    }
    await page.close();
  } finally {
    if (browser) await browser.close();
    await fs.rm(root, { recursive: true, force: true });
  }
});
