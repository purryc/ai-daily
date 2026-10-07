import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { readIssues } from "./lib/issue-data.mjs";
import {
  validateIssue,
  validatePageCount,
  selectIssueDates,
  validateIllustratedIssue,
} from "./lib/issue-policy.mjs";
import { checkPdfPages, validatePdfExportMetadata } from "./lib/pdf-check.mjs";
import { allIssueTopics } from "./lib/topic-content.mjs";
import { buildVisualSlides } from "./lib/issue-visuals.mjs";
import { createStaticServer } from "./lib/static-server.mjs";
const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const issues = await readIssues(root);
const dates = selectIssueDates(issues, process.env.AI_DAILY_DATES);
const read = (file) => fs.readFile(path.join(root, file), "utf8");
const manifest = JSON.parse(await read("manifest.json"));
if (manifest[0]?.date !== issues[0].date)
  throw new Error("homepage manifest latest date is stale");
for (const file of ["index.html", "en/index.html", "assets/site.css"])
  await fs.access(path.join(root, file));
const { server, origin } = await createStaticServer(root);
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.AI_DAILY_CHROMIUM_PATH
      ? { executablePath: process.env.AI_DAILY_CHROMIUM_PATH }
      : {}),
  });
  for (const date of dates) {
    const issue = issues.find((issue) => issue.date === date);
    validateIssue(issue, issues);
    if (issue.requireProductVisuals) validateIllustratedIssue(issue);
    const dailyManifest = JSON.parse(await read(`${date}/manifest.json`));
    if (
      dailyManifest.cutoff !== issue.cutoff ||
      JSON.stringify(dailyManifest.topics.map((topic) => topic.id)) !==
        JSON.stringify(issue.topics.map((topic) => topic.id))
    )
      throw new Error(`manifest content mismatch: ${date}`);
    const ledger = await read(`${date}/sources.md`);
    for (const topic of allIssueTopics(issue))
      for (const source of topic.sources)
        if (!ledger.includes(source.url))
          throw new Error(`source ledger omits ${source.url}`);
    const counts = [];
    for (const locale of ["zh", "en"]) {
      const file = `${date}/${locale}/index.html`;
      const html = await read(file);
      if (/TODO|PLACEHOLDER|undefined|待补/.test(html))
        throw new Error(`placeholder in ${file}`);
      if (!html.includes(issue.cutoff))
        throw new Error(`missing verified cutoff in ${file}`);
      for (const topic of allIssueTopics(issue))
        if (!html.includes(topic.event.occurredAt))
          throw new Error(`missing source/event date in ${file}`);
      for (const viewport of [
        { width: 1920, height: 1080 },
        { width: 1440, height: 810 },
        { width: 390, height: 844 },
      ]) {
        const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
        try {
          await page.goto(`${origin}/${date}/${locale}/`, {
            waitUntil: "networkidle",
          });
          await page.evaluate(() => document.fonts.ready);
          const result = await page.evaluate(() => {
            const slides = [...document.querySelectorAll("[data-slide]")];
            return {
              pages: slides.length,
              brokenImages: [...document.images]
                .filter((image) => !image.complete || !image.naturalWidth)
                .map((image) => image.src),
              croppedImages: [...document.images]
                .filter(
                  (image) => getComputedStyle(image).objectFit === "cover",
                )
                .map((image) => image.src),
              overflow: slides
                .filter(
                  (slide) =>
                    slide.scrollWidth - slide.clientWidth > 4 ||
                    slide.scrollHeight - slide.clientHeight > 4,
                )
                .map((slide) => slide.id),
              bodyOverflow: document.documentElement.scrollWidth - innerWidth,
            };
          });
          validatePageCount(result.pages);
          if (result.brokenImages.length)
            throw new Error(
              `${file} has broken evidence images: ${result.brokenImages.join(", ")}`,
            );
          if (result.croppedImages.length)
            throw new Error(`${file} crops evidence images`);
          if (result.overflow.length || result.bodyOverflow > 4)
            throw new Error(
              `${file} clips content at ${viewport.width}px: ${result.overflow.join(", ")}`,
            );
          if (viewport.width === 1920) {
            counts.push(result.pages);
            const pdfPages = await checkPdfPages(
              path.join(root, date, `ai-daily-${date}-${locale}.pdf`),
            );
            let metadata;
            try { metadata = JSON.parse(await read(`${date}/pdf-export.json`)); }
            catch (error) { if (error.code !== "ENOENT") throw error; }
            let sourceBytes;
            try { sourceBytes = await fs.readFile(path.join(root, `data/editions/${date}.json`)); }
            catch (error) { if (error.code !== "ENOENT") throw error; sourceBytes = Buffer.from(JSON.stringify(issue)); }
            const editorialPagePlan = buildVisualSlides(issue, locale).map(({id,type,topicIds})=>({id,type,topicIds}));
            validatePdfExportMetadata({ metadata, date, locale, sourceBytes, pdfPages, htmlPages: result.pages, editorialPagePlan });
          }
          // Inspect every active page; hidden slides have zero geometry on screen.
          const next = page.locator("[data-next-slide]");
          const previous = page.locator("[data-prev-slide]");
          if (await next.count()) {
            for (let index = 0; index < result.pages; index++) {
              const diagnostic = await page.evaluate(() => {
                const active = document.querySelector(
                  '[data-slide][aria-hidden="false"]',
                );
                return {
                  id: active?.id,
                  x: active ? active.scrollWidth - active.clientWidth : 0,
                  y: active ? active.scrollHeight - active.clientHeight : 0,
                  activeCount: document.querySelectorAll(
                    '[data-slide][aria-hidden="false"]',
                  ).length,
                };
              });
              if (
                diagnostic.activeCount !== 1 ||
                diagnostic.x > 4 ||
                diagnostic.y > 4
              )
                throw new Error(
                  `${file} navigation or layout failure on ${diagnostic.id}`,
                );
              if (index < result.pages - 1) await next.click();
            }
            if (await next.isEnabled())
              throw new Error(`${file} next remains enabled at the last page`);
            // Returning to the beginning repeatedly must preserve one active page.
            for (let index = result.pages - 1; index > 0; index--)
              await previous.click();
            if (await previous.isEnabled())
              throw new Error(
                `${file} previous remains enabled at the first page`,
              );
            const visible = await page
              .locator('[data-slide][aria-hidden="false"]')
              .count();
            if (visible !== 1)
              throw new Error(`${file} navigation loses the active page`);
          }
          await page.emulateMedia({ media: "print" });
          const clippedPrint = await page.evaluate(() =>
            [...document.querySelectorAll("[data-slide]")]
              .filter(
                (slide) =>
                  slide.scrollWidth - slide.clientWidth > 4 ||
                  slide.scrollHeight - slide.clientHeight > 4,
              )
              .map((slide) => slide.id),
          );
          if (clippedPrint.length)
            throw new Error(
              `${file} clips printed content: ${clippedPrint.join(", ")}`,
            );
        } finally {
          await page.close();
        }
      }
    }
    if (counts[0] !== counts[1])
      throw new Error(`${date} bilingual page count mismatch`);
    console.log(
      `Checked ${date}: ${counts[0]} pages per locale, dated events, source ledger, images, PDFs and responsive layouts`,
    );
  }
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
console.log("AI Daily static site checks passed.");
