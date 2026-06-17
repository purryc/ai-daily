import fs from "node:fs/promises";
import path from "node:path";

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

async function read(relativePath) {
  return fs.readFile(path.join(root, relativePath), "utf8");
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

console.log("AI Daily static site checks passed.");
