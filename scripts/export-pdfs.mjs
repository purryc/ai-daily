import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { readIssues } from "./lib/issue-data.mjs";
import {
  selectIssueDates,
  validatePageCount,
  assertCloudOutput,
} from "./lib/issue-policy.mjs";
import { createStaticServer } from "./lib/static-server.mjs";
import { checkPdfPages } from "./lib/pdf-check.mjs";
const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const issues = await readIssues(root);
const dates = selectIssueDates(issues, process.env.AI_DAILY_DATES);
const { server, origin } = await createStaticServer(root);
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.AI_DAILY_CHROMIUM_PATH
      ? { executablePath: process.env.AI_DAILY_CHROMIUM_PATH }
      : {}),
  });
  for (const date of dates)
  {
    const counts = {};
    for (const locale of ["zh", "en"]) {
      const output = assertCloudOutput(
        path.join(root, date, `ai-daily-${date}-${locale}.pdf`),
        root,
      );
      const temporary = output + ".tmp";
      const page = await browser.newPage({
        viewport: { width: 1600, height: 900 },
        deviceScaleFactor: 1,
      });
      try {
        await page.goto(`${origin}/${date}/${locale}/`, {
          waitUntil: "networkidle",
          timeout: 30000,
        });
        await page.evaluate(() => document.fonts.ready);
        const info = await page.evaluate(() => ({
          pages: document.querySelectorAll("[data-slide]").length,
          broken: [...document.images]
            .filter((image) => !image.complete || !image.naturalWidth)
            .map((image) => image.src),
        }));
        validatePageCount(info.pages);
        if (info.broken.length)
          throw new Error(
            `PDF has unavailable evidence images: ${info.broken.join(", ")}`,
          );
        await page.emulateMedia({ media: "print" });
        await page.pdf({
          path: temporary,
          printBackground: true,
          preferCSSPageSize: true,
          width: "16in",
          height: "9in",
          margin: { top: "0", right: "0", bottom: "0", left: "0" },
          timeout: 60000,
        });
        const pages = await checkPdfPages(temporary);
        if (pages !== info.pages)
          throw new Error(
            `PDF pages ${pages} differ from rendered pages ${info.pages}; check print overflow`,
          );
        await fs.rename(temporary, output);
        counts[locale] = pages;
        console.log(`Exported ${path.relative(root, output)}: ${pages} pages`);
      } finally {
        await page.close();
        await fs.rm(temporary, { force: true });
      }
    }
    let sourceBytes;
    try { sourceBytes = await fs.readFile(path.join(root, `data/editions/${date}.json`)); }
    catch (error) { if (error.code !== "ENOENT") throw error; sourceBytes = Buffer.from(JSON.stringify(issues.find(issue => issue.date === date))); }
    const metadataFile = path.join(root, date, "pdf-export.json");
    await fs.writeFile(metadataFile + ".tmp", JSON.stringify({ renderer: "chromium", date, pages: counts, sourceDataSha256: createHash("sha256").update(sourceBytes).digest("hex"), note: "Browser print layout with verified HTML page parity." }, null, 2) + "\n");
    await fs.rename(metadataFile + ".tmp", metadataFile);
  }
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
