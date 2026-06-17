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
}

for (const file of requiredFiles.filter((item) => item.endsWith(".pdf"))) {
  const stats = await fs.stat(path.join(root, file));
  if (stats.size < 10_000) throw new Error(`${file} looks too small to be a valid PDF`);
}

if (!manifest[0]?.coverStory?.imagePath) {
  throw new Error("manifest.json missing coverStory.imagePath");
}

console.log("AI Daily static site checks passed.");
