import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const manifest = JSON.parse(await fs.readFile(path.join(root, "manifest.json"), "utf8"));
const latest = manifest[0];
if (!latest?.date) {
  throw new Error("manifest.json missing latest issue date");
}
const latestDate = latest.date;
const forbidden = ["TODO", "PLACEHOLDER", "待补", "undefined"];
const requiredSections = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"];
const allowedEvidenceLabels = new Set([
  "confirmed product",
  "developer surface",
  "review/community friction",
  "startup signal",
  "crowdfunding signal",
  "research signal",
  "patent signal",
  "weak/unverified"
]);
const requiredFiles = [
  "index.html",
  "en/index.html",
  `${latestDate}/zh/index.html`,
  `${latestDate}/en/index.html`,
  `${latestDate}/ai-daily-${latestDate}-zh.pdf`,
  `${latestDate}/ai-daily-${latestDate}-en.pdf`,
  `${latestDate}/sources.md`,
  `${latestDate}/manifest.json`,
  "assets/site.css"
];
const deckViewports = [
  { name: "2048x1152", width: 2048, height: 1152 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1440x810", width: 1440, height: 810 }
];
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"]
]);

async function read(relativePath) {
  return fs.readFile(path.join(root, relativePath), "utf8");
}

function createStaticServer() {
  const server = http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url, "http://127.0.0.1");
      let pathname = decodeURIComponent(requestUrl.pathname);
      if (pathname.endsWith("/")) pathname += "index.html";
      const filePath = path.normalize(path.join(root, pathname));
      if (!filePath.startsWith(root)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }
      const contents = await fs.readFile(filePath);
      response.writeHead(200, { "content-type": mimeTypes.get(path.extname(filePath)) ?? "application/octet-stream" });
      response.end(contents);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

async function checkDeckOverflow(origin, relativePath) {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of deckViewports) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1
      });
      await page.goto(`${origin}/${relativePath}`, { waitUntil: "networkidle", timeout: 30_000 });
      await page.evaluate(() => document.fonts?.ready);
      const result = await page.evaluate(() => {
        const stage = document.querySelector(".deck-stage");
        const stageRect = stage?.getBoundingClientRect();
        const ratio = stageRect ? stageRect.width / stageRect.height : null;
        const slides = Array.from(document.querySelectorAll(".deck-slide"));
        const overflows = slides
          .map((slide) => {
            const overflowX = slide.scrollWidth - slide.clientWidth;
            const overflowY = slide.scrollHeight - slide.clientHeight;
            const title = slide.querySelector("h1, h2, h3")?.textContent?.trim().replace(/\s+/g, " ").slice(0, 96) ?? "";
            return {
              id: slide.id,
              title,
              className: slide.className,
              overflowX,
              overflowY,
              clientWidth: slide.clientWidth,
              clientHeight: slide.clientHeight,
              scrollWidth: slide.scrollWidth,
              scrollHeight: slide.scrollHeight
            };
          })
          .filter((slide) => slide.overflowX > 4 || slide.overflowY > 4);
        return { ratio, slideCount: slides.length, overflows };
      });
      await page.close();

      if (Math.abs((result.ratio ?? 0) - 16 / 9) > 0.015) {
        throw new Error(`${relativePath} deck stage is not 16:9 at ${viewport.name}`);
      }
      if (result.overflows.length) {
        const details = result.overflows
          .map((slide) => `${slide.id} ${slide.title} overflow ${slide.overflowX}x${slide.overflowY}`)
          .join("; ");
        throw new Error(`${relativePath} has clipped slide content at ${viewport.name}: ${details}`);
      }
    }
  } finally {
    await browser.close();
  }
}

for (const file of requiredFiles) {
  await fs.access(path.join(root, file));
}

const issues = JSON.parse(await read("data/issues.json"));
const latestIssue = issues.find((issue) => issue.date === latestDate);
if (!latestIssue) {
  throw new Error(`data/issues.json missing latest issue ${latestDate}`);
}

const latestSections = new Set(latestIssue.topics.map((topic) => topic.section));
for (const section of requiredSections) {
  if (!latestSections.has(section)) {
    throw new Error(`latest issue missing required source lane: ${section}`);
  }
}

if (!latestIssue.watchlistZh?.length || !latestIssue.watchlistEn?.length) {
  throw new Error("latest issue missing watchlist entries");
}

const sourceUrls = new Set(latestIssue.topics.flatMap((topic) => topic.sources.map((source) => source.url)));
if (sourceUrls.size < 12) {
  throw new Error(`latest issue has ${sourceUrls.size} unique sources; expected at least 12`);
}

const visualAssets = new Set([
  latestIssue.coverStory.imagePath,
  ...latestIssue.topics.map((topic) => topic.visual.path)
]);
if (visualAssets.size < 6) {
  throw new Error(`latest issue has ${visualAssets.size} unique visuals; expected at least 6`);
}

for (const topic of latestIssue.topics) {
  if (!allowedEvidenceLabels.has(topic.evidenceLabel)) {
    throw new Error(`${topic.id} has invalid or missing evidenceLabel: ${topic.evidenceLabel}`);
  }
}

const htmlFiles = requiredFiles.filter((file) => file.endsWith(".html"));
const css = await read("assets/site.css");
if (css.includes("object-fit: cover")) {
  throw new Error("Evidence CSS must not use object-fit: cover");
}

for (const file of [...htmlFiles, `${latestDate}/sources.md`]) {
  const text = await read(file);
  for (const token of forbidden) {
    if (text.includes(token)) {
      throw new Error(`${file} contains forbidden placeholder token: ${token}`);
    }
  }
}

for (const file of [`${latestDate}/zh/index.html`, `${latestDate}/en/index.html`]) {
  const text = await read(file);
  const hasSources = text.includes("来源：") || text.includes("Sources:");
  const hasImages = text.includes("<img ");
  const isDeck = text.includes("data-deck") && text.includes("data-slide") && text.includes("deck-controls");
  if (!hasSources) throw new Error(`${file} is missing inline source links`);
  if (!hasImages) throw new Error(`${file} is missing evidence images`);
  if (!isDeck) throw new Error(`${file} is not rendered as a slide deck`);
  if (!text.includes("mag-topic-slide")) throw new Error(`${file} is missing magazine-style topic slides`);
  if (text.includes("magazine-spread")) throw new Error(`${file} still contains the long-scroll magazine layout`);
  if (!text.includes(".pdf")) throw new Error(`${file} is missing a PDF download link`);
  for (const section of requiredSections) {
    if (!text.includes(section)) throw new Error(`${file} is missing source lane marker: ${section}`);
  }
}

for (const file of requiredFiles.filter((item) => item.endsWith(".pdf"))) {
  const stats = await fs.stat(path.join(root, file));
  if (stats.size < 10_000) throw new Error(`${file} looks too small to be a valid PDF`);
}

if (!manifest[0]?.coverStory?.imagePath) {
  throw new Error("manifest.json missing coverStory.imagePath");
}

const latestManifest = JSON.parse(await read(`${latestDate}/manifest.json`));
const manifestSections = new Set(latestManifest.topics.map((topic) => topic.section));
for (const section of requiredSections) {
  if (!manifestSections.has(section)) {
    throw new Error(`${latestDate}/manifest.json missing source lane: ${section}`);
  }
}

const sourceLedger = await read(`${latestDate}/sources.md`);
for (const section of requiredSections) {
  if (!sourceLedger.includes(`| ${section} | covered |`)) {
    throw new Error(`${latestDate}/sources.md missing covered lane: ${section}`);
  }
}

const { server, origin } = await createStaticServer();
try {
  await checkDeckOverflow(origin, `${latestDate}/zh/`);
  await checkDeckOverflow(origin, `${latestDate}/en/`);
} finally {
  server.close();
}

console.log("AI Daily static site checks passed.");
