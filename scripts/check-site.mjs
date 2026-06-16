import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const forbidden = ["TODO", "PLACEHOLDER", "待补", "undefined"];
const requiredFiles = [
  "index.html",
  "en/index.html",
  "2026-06-16/zh/index.html",
  "2026-06-16/en/index.html",
  "2026-06-16/ai-daily-2026-06-16-zh.pdf",
  "2026-06-16/ai-daily-2026-06-16-en.pdf",
  "2026-06-16/sources.md",
  "2026-06-16/manifest.json",
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

for (const file of [...htmlFiles, "2026-06-16/sources.md"]) {
  const text = await read(file);
  for (const token of forbidden) {
    if (text.includes(token)) {
      throw new Error(`${file} contains forbidden placeholder token: ${token}`);
    }
  }
}

for (const file of ["2026-06-16/zh/index.html", "2026-06-16/en/index.html"]) {
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

const manifest = JSON.parse(await read("manifest.json"));
if (!manifest[0]?.coverStory?.imagePath) {
  throw new Error("manifest.json missing coverStory.imagePath");
}

console.log("AI Daily static site checks passed.");
