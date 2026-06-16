import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const siteBase = "/ai-daily";

const issues = JSON.parse(await fs.readFile(dataPath, "utf8")).sort((a, b) => b.date.localeCompare(a.date));

const sectionLabels = {
  zh: {
    all: "All",
    official: "大厂官方",
    wild: "野生信号",
    research: "论文",
    patent: "专利",
    china: "中国",
    global: "海外",
    sources: "来源"
  },
  en: {
    all: "All",
    official: "Official",
    wild: "Wild",
    research: "Research",
    patent: "Patent",
    china: "China",
    global: "Global",
    sources: "Sources"
  }
};

const sectionNames = {
  zh: {
    official: "Official Desk / 大厂官方",
    wild: "Wild Desk / 野生信号",
    research: "Research Watch / 论文",
    patent: "Patent Watch / 专利",
    china: "China / Global Compare",
    global: "Global Signals"
  },
  en: {
    official: "Official Desk",
    wild: "Wild Desk",
    research: "Research Watch",
    patent: "Patent Watch",
    china: "China / Global Compare",
    global: "Global Signals"
  }
};

function html(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function attrs(attributes) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}="${html(value)}"`)
    .join(" ");
}

function assetUrl(issue, assetPath) {
  if (/^https?:\/\//.test(assetPath)) return assetPath;
  return `${siteBase}/${issue.date}/${assetPath}`;
}

function relAssetUrl(assetPath) {
  return `../${assetPath}`;
}

function sourceLinks(sources, locale) {
  const prefix = locale === "zh" ? "来源：" : "Sources:";
  return `<p class="source-row"><strong>${prefix}</strong> ${sources
    .map((source) => `<a href="${html(source.url)}" target="_blank" rel="noreferrer">${html(source.label)}</a>`)
    .join(" · ")}</p>`;
}

function figure(issue, visual, locale, rootRelative = true) {
  const imageUrl = rootRelative ? assetUrl(issue, visual.path) : relAssetUrl(visual.path);
  const alt = locale === "zh" ? visual.altZh : visual.altEn;
  const caption = locale === "zh" ? visual.captionZh : visual.captionEn;
  return `
    <figure class="evidence-figure">
      <a href="${html(visual.sourceUrl)}" target="_blank" rel="noreferrer" aria-label="${html(caption)}">
        <img ${attrs({ src: imageUrl, alt, width: visual.width, height: visual.height, loading: "lazy", decoding: "async" })} />
      </a>
      <figcaption>${html(caption)}</figcaption>
    </figure>`;
}

function chips(items) {
  return items.map((item) => `<span>${html(item)}</span>`).join("");
}

function layout({ locale, title, description, body, rootPrefix = "" }) {
  const language = locale === "zh" ? "zh-CN" : "en";
  const favicon = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2f2234"/><text x="13" y="42" font-family="Arial" font-size="26" font-weight="900" fill="#fff">AI</text></svg>'
  )}`;
  return `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${html(title)}</title>
    <meta name="description" content="${html(description)}" />
    <link rel="icon" href="${favicon}" />
    <link rel="stylesheet" href="${rootPrefix}assets/site.css" />
  </head>
  <body>
${body}
    <script>
      document.querySelectorAll("[data-filter]").forEach((button) => {
        button.addEventListener("click", () => {
          const filter = button.dataset.filter;
          document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
          document.querySelectorAll("[data-sections]").forEach((card) => {
            const sections = card.dataset.sections.split(" ");
            card.hidden = filter !== "all" && !sections.includes(filter);
          });
        });
      });
    </script>
  </body>
</html>
`;
}

function homepage(locale) {
  const latest = issues[0];
  const isZh = locale === "zh";
  const rootPrefix = isZh ? "" : "../";
  const cover = latest.coverStory;
  const title = "AI Daily";
  const description = isZh
    ? "AI Daily：面向 HCI、AI 硬件、AI 软件与软硬件系统的产品晨报。"
    : "AI Daily: product briefings for HCI, AI hardware, AI software, and soft/hardware systems.";
  const allSections = ["official", "wild", "research", "patent", "china", "global"];

  const issueCards = issues
    .map((issue) => {
      const sections = [...new Set(issue.topics.map((topic) => topic.section))].join(" ");
      const issueTitle = isZh ? issue.zhTitle : issue.enTitle;
      const issueSummary = isZh ? issue.zhSummary : issue.enSummary;
      const coverTitle = isZh ? issue.coverStory.zhTitle : issue.coverStory.enTitle;
      return `
        <article class="issue-card" data-sections="${html(sections)}">
          <figure class="issue-thumb">
            <img ${attrs({
              src: assetUrl(issue, issue.coverStory.imagePath),
              alt: coverTitle,
              width: issue.coverStory.imageWidth,
              height: issue.coverStory.imageHeight,
              loading: "lazy",
              decoding: "async"
            })} />
          </figure>
          <div class="issue-main">
            <div class="issue-kicker">${html(issue.date)} · ${html(issue.timezone)}</div>
            <h2>${html(issueTitle)}</h2>
            <p>${html(issueSummary)}</p>
            <div class="chip-row">${chips(issue.tags.slice(0, 7))}</div>
            <div class="mini-source">${html(isZh ? "封面：" : "Cover:")} <a href="${html(issue.coverStory.primarySourceUrl)}" target="_blank" rel="noreferrer">${html(coverTitle)}</a></div>
          </div>
          <div class="issue-actions">
            <a class="primary" href="${html(issue.zhPath)}">${isZh ? "中文版" : "Chinese"}</a>
            <a href="${html(issue.enPath)}">English</a>
            <a href="${html(issue.sourcesPath)}">${sectionLabels[locale].sources}</a>
          </div>
        </article>`;
    })
    .join("");

  const body = `
    <main class="app-shell">
      <aside class="rail" aria-label="AI Daily">
        <a class="mark" href="${siteBase}/">AI</a>
        <a class="rail-icon active" href="${isZh ? siteBase + "/" : siteBase + "/en/"}" aria-label="Home">⌂</a>
        <a class="rail-icon" href="#archive" aria-label="Archive">≡</a>
      </aside>
      <section class="workspace">
        <nav class="topbar" aria-label="Primary">
          <div class="search-pill">${isZh ? "Search the product surface, not model hype" : "Search the product surface, not model hype"}</div>
          <div class="nav-links">
            <a href="#archive">${isZh ? "日报" : "Archive"}</a>
            <a href="#filters">${isZh ? "筛选" : "Filters"}</a>
            <a href="${latest.sourcesPath}">${isZh ? "来源" : "Sources"}</a>
          </div>
          <div class="lang-switch">
            <a class="${isZh ? "active" : ""}" href="${siteBase}/">中文</a>
            <a class="${isZh ? "" : "active"}" href="${siteBase}/en/">English</a>
          </div>
        </nav>

        <section class="hero-card">
          <div class="hero-copy">
            <p class="eyebrow">${html(latest.date)} · AI Daily</p>
            <h1>${html(isZh ? cover.zhTitle : cover.enTitle)}</h1>
            <div class="hero-lines">
              ${(isZh ? cover.zhSummary : cover.enSummary).map((line) => `<p>${html(line)}</p>`).join("")}
            </div>
            <div class="hero-actions">
              <a class="primary" href="${html(isZh ? latest.zhPath : latest.enPath)}">${isZh ? "阅读全文" : "Read issue"}</a>
              <a href="${html(cover.primarySourceUrl)}" target="_blank" rel="noreferrer">${isZh ? "原文来源" : "Original source"}</a>
            </div>
          </div>
          <figure class="hero-media">
            <img ${attrs({
              src: assetUrl(latest, cover.imagePath),
              alt: isZh ? cover.zhTitle : cover.enTitle,
              width: cover.imageWidth,
              height: cover.imageHeight,
              decoding: "async"
            })} />
            <figcaption>${html(cover.evidenceStrength)} · ${html(isZh ? cover.whyCover : cover.whyCover)}</figcaption>
          </figure>
        </section>

        <section class="filter-bar" id="filters" aria-label="Filters">
          <button class="active" data-filter="all">${sectionLabels[locale].all}</button>
          ${allSections.map((section) => `<button data-filter="${section}">${sectionLabels[locale][section]}</button>`).join("")}
        </section>

        <section class="issue-list" id="archive" aria-label="Daily issues">
          ${issueCards}
        </section>
      </section>
    </main>`;

  return layout({ locale, title, description, body, rootPrefix });
}

function topicCard(issue, topic, locale) {
  const isZh = locale === "zh";
  const headline = isZh ? topic.zhHeadline : topic.enHeadline;
  const fact = isZh ? topic.zhFact : topic.enFact;
  const value = isZh ? topic.zhValue : topic.enValue;
  const implication = isZh ? topic.zhImplication : topic.enImplication;
  const lens = isZh ? topic.zhHciLens : topic.enHciLens;
  return `
    <article class="topic-card" id="${html(topic.id)}" data-sections="${html(topic.section)}">
      ${figure(issue, topic.visual, locale, false)}
      <div class="topic-main">
        <div class="topic-topline">
          <span class="section-chip">${html(sectionLabels[locale][topic.section] ?? topic.section)}</span>
          <span>${html(topic.evidenceStrength)}</span>
          <span>${html(topic.sourceDate)}</span>
        </div>
        <h3>${html(headline)}</h3>
        <p><strong>${isZh ? "事实：" : "Fact:"}</strong> ${html(fact)}</p>
        <p><strong>${isZh ? "价值：" : "Value:"}</strong> ${html(value)}</p>
        <div class="lens-grid">
          ${lens.map((item) => `<span>${html(item)}</span>`).join("")}
        </div>
        <p><strong>${isZh ? "产品影响：" : "Product implication:"}</strong> ${html(implication)}</p>
        ${sourceLinks(topic.sources, locale)}
      </div>
    </article>`;
}

function issuePage(issue, locale) {
  const isZh = locale === "zh";
  const rootPrefix = "../../";
  const title = isZh ? `${issue.zhTitle} · AI Daily` : `${issue.enTitle} · AI Daily`;
  const description = isZh ? issue.zhSummary : issue.enSummary;
  const cover = issue.coverStory;
  const grouped = issue.topics.reduce((acc, topic) => {
    acc[topic.section] ??= [];
    acc[topic.section].push(topic);
    return acc;
  }, {});
  const sectionOrder = ["official", "wild", "research", "patent", "china", "global"];
  const navSections = sectionOrder.filter((section) => grouped[section]?.length);

  const sections = navSections
    .map(
      (section) => `
        <section class="desk-section" id="${section}">
          <div class="section-heading">
            <p>${html(sectionLabels[locale][section] ?? section)}</p>
            <h2>${html(sectionNames[locale][section] ?? section)}</h2>
          </div>
          <div class="topic-list">
            ${grouped[section].map((topic) => topicCard(issue, topic, locale)).join("")}
          </div>
        </section>`
    )
    .join("");

  const body = `
    <main class="issue-shell">
      <nav class="issue-nav" aria-label="Issue navigation">
        <a class="brand" href="${siteBase}/">AI Daily</a>
        <div>
          <a class="${isZh ? "active" : ""}" href="${siteBase}/${issue.date}/zh/">中文</a>
          <a class="${isZh ? "" : "active"}" href="${siteBase}/${issue.date}/en/">English</a>
          <a href="${siteBase}/${issue.date}/sources.md">${isZh ? "来源总表" : "Source ledger"}</a>
        </div>
      </nav>

      <header class="issue-hero">
        <div class="issue-hero-copy">
          <p class="eyebrow">${html(issue.date)} · ${html(issue.timezone)}</p>
          <h1>${html(isZh ? issue.zhTitle : issue.enTitle)}</h1>
          <div class="hero-lines">
            ${(isZh ? cover.zhSummary : cover.enSummary).map((line) => `<p>${html(line)}</p>`).join("")}
          </div>
          <div class="chip-row">${chips(issue.tags)}</div>
          ${sourceLinks([{ label: isZh ? "封面原文" : "Cover source", url: cover.primarySourceUrl }], locale)}
        </div>
        <figure class="issue-cover-image">
          <img ${attrs({
            src: relAssetUrl(cover.imagePath),
            alt: isZh ? cover.zhTitle : cover.enTitle,
            width: cover.imageWidth,
            height: cover.imageHeight,
            decoding: "async"
          })} />
          <figcaption>${html(cover.evidenceStrength)} · ${html(cover.whyCover)}</figcaption>
        </figure>
      </header>

      <section class="section-jump" aria-label="Sections">
        ${navSections.map((section) => `<a href="#${section}">${html(sectionLabels[locale][section] ?? section)}</a>`).join("")}
      </section>

      ${sections}

      <section class="watchlist">
        <div class="section-heading">
          <p>${isZh ? "Next scan" : "Next scan"}</p>
          <h2>${isZh ? "Watchlist" : "Watchlist"}</h2>
        </div>
        <ul>
          ${(isZh ? issue.watchlistZh : issue.watchlistEn).map((item) => `<li>${html(item)}</li>`).join("")}
        </ul>
      </section>
    </main>`;

  return layout({ locale, title, description, body, rootPrefix });
}

function rootManifest() {
  return JSON.stringify(
    issues.map((issue) => ({
      date: issue.date,
      zhTitle: issue.zhTitle,
      enTitle: issue.enTitle,
      zhSummary: issue.zhSummary,
      enSummary: issue.enSummary,
      tags: issue.tags,
      sourceTypes: issue.sourceTypes,
      coverStory: issue.coverStory,
      zhPath: issue.zhPath,
      enPath: issue.enPath,
      sourcesPath: issue.sourcesPath
    })),
    null,
    2
  );
}

function issueManifest(issue) {
  return JSON.stringify(
    {
      date: issue.date,
      timezone: issue.timezone,
      zhTitle: issue.zhTitle,
      enTitle: issue.enTitle,
      zhSummary: issue.zhSummary,
      enSummary: issue.enSummary,
      tags: issue.tags,
      sourceTypes: issue.sourceTypes,
      coverStory: issue.coverStory,
      topics: issue.topics.map((topic) => ({
        id: topic.id,
        section: topic.section,
        zhHeadline: topic.zhHeadline,
        enHeadline: topic.enHeadline,
        visual: topic.visual,
        sources: topic.sources,
        evidenceStrength: topic.evidenceStrength
      })),
      zhPath: "./zh/",
      enPath: "./en/",
      sourcesPath: "./sources.md"
    },
    null,
    2
  );
}

function sourcesMarkdown(issue) {
  const sourceRows = [];
  const seenSources = new Set();
  for (const topic of issue.topics) {
    for (const source of topic.sources) {
      const key = source.url;
      if (seenSources.has(key)) continue;
      seenSources.add(key);
      sourceRows.push({ source, usedFor: topic.id, evidence: topic.evidenceStrength, date: topic.sourceDate });
    }
  }

  const visualRows = issue.topics.map((topic) => ({
    asset: topic.visual.captionEn,
    local: topic.visual.path,
    source: topic.visual.sourceUrl,
    role: `${topic.id} / ${topic.evidenceStrength}`
  }));

  return `# AI Daily Sources

Date: ${issue.date}
Timezone: ${issue.timezone}
Scope: HCI, AI hardware, AI software products, agentic devices, on-device AI, AI OS/shells, smart glasses, AI PCs, robotics, cameras/sensing peripherals, wearables, soft/hardware systems, community/startup signals, research papers, and patent watch.

## Source Index

| ID | Source | Date | Evidence strength | Used for |
| --- | --- | --- | --- | --- |
${sourceRows
  .map(
    (row, index) =>
      `| S${index + 1} | ${row.source.label}: ${row.source.url} | ${row.date} | ${row.evidence}; ${row.source.type ?? ""} | ${row.usedFor} |`
  )
  .join("\n")}

## Visual Asset Index

| Asset | Local path | Source | Evidence role |
| --- | --- | --- | --- |
| ${issue.coverStory.enTitle} | \`${issue.coverStory.imagePath}\` | ${issue.coverStory.imageSourceUrl} | Homepage and issue cover visual |
${visualRows.map((row) => `| ${row.asset} | \`${row.local}\` | ${row.source} | ${row.role} |`).join("\n")}

## Evidence Rules

- Official facts are linked to company announcements, product pages, developer docs, or company blogs.
- Product Hunt, Kickstarter, Reddit, startup, and review signals are labeled as weak, community, startup, or crowdfunding signals unless corroborated.
- Research claims link to arXiv, conference pages, Microsoft Research, ACM-style publication pages, or PDFs.
- Patent material is treated as a patent signal only, not a confirmed product launch, availability, or roadmap.
- Every topic card in the published Chinese and English issue pages includes inline source links; this file is the audit ledger, not the only source surface.
- Evidence visuals use source-traceable product images, source-based screenshots, or clearly labeled self-drawn mechanism diagrams. No generic stock or decorative images are used.
- Public HTML/CSS must not use cropped image-fit rules for evidence visuals.
`;
}

function siteCss() {
  return `:root {
  --red: #c7000b;
  --ink: #171413;
  --muted: #6f6a66;
  --soft: #f6f4ef;
  --paper: #fffdfa;
  --line: #e8e3dc;
  --chip: #f2efea;
  --shadow: 0 22px 60px rgba(35, 25, 16, 0.08);
  --radius: 28px;
  color-scheme: light;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background:
    radial-gradient(circle at 12% -10%, #fff3d5 0, transparent 34rem),
    linear-gradient(145deg, #fff7df 0%, #fff 34%, #f4f7fb 100%);
  color: var(--ink);
  font-family: "Aptos", "IBM Plex Sans", "Microsoft YaHei", "Source Han Sans SC", sans-serif;
}

a { color: inherit; text-decoration: none; }
a:hover { color: var(--red); }

button {
  border: 0;
  font: inherit;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center;
}

.app-shell {
  width: min(1780px, calc(100% - 40px));
  margin: 58px auto;
  display: grid;
  grid-template-columns: 90px 1fr;
  min-height: calc(100vh - 116px);
  background: rgba(255, 253, 250, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.86);
  border-radius: 34px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.rail {
  border-right: 1px solid var(--line);
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  background: linear-gradient(#fffefa, #fbfaf7);
}

.mark {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: #2f2234;
  color: #fff;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.rail-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  color: #8d8781;
  border: 1px solid transparent;
}

.rail-icon.active {
  background: #f2e8f0;
  color: var(--red);
  border-color: #eadce7;
}

.workspace {
  padding: 30px;
  min-width: 0;
}

.topbar,
.issue-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.search-pill {
  width: min(390px, 100%);
  border-radius: 999px;
  background: #f4f2ef;
  color: var(--muted);
  padding: 15px 22px;
  font-size: 15px;
}

.nav-links,
.lang-switch,
.issue-nav div,
.hero-actions,
.issue-actions,
.section-jump {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.nav-links a,
.lang-switch a,
.issue-nav a,
.hero-actions a,
.issue-actions a,
.section-jump a {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 10px 15px;
  background: #fff;
  color: var(--ink);
  font-size: 14px;
  font-weight: 760;
}

.lang-switch a.active,
.issue-nav a.active,
.hero-actions a.primary,
.issue-actions a.primary {
  background: #2f2234;
  border-color: #2f2234;
  color: #fff;
}

.hero-card {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
  gap: clamp(24px, 4vw, 64px);
  align-items: center;
  padding: clamp(30px, 5vw, 72px) 0 40px;
}

.eyebrow,
.issue-kicker,
.section-heading p {
  color: var(--red);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 0 12px;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  max-width: 930px;
  font-size: clamp(44px, 7vw, 108px);
  line-height: 0.98;
  letter-spacing: -0.07em;
  margin-bottom: 26px;
}

.hero-lines {
  display: grid;
  gap: 10px;
  color: #312c28;
  font-size: clamp(17px, 1.6vw, 24px);
  line-height: 1.45;
  font-weight: 680;
  max-width: 900px;
}

.hero-media,
.issue-cover-image,
.evidence-figure,
.issue-thumb {
  margin: 0;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
}

.hero-media {
  padding: 18px;
}

.hero-media img,
.issue-cover-image img,
.evidence-figure img,
.issue-thumb img {
  width: 100%;
  height: auto;
  background: #fff;
}

figcaption {
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 12px;
  line-height: 1.35;
  padding: 12px 14px;
  background: #fffdfa;
}

.hero-actions {
  margin-top: 28px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0 0 24px;
  padding: 14px;
  background: #f5f3f0;
  border: 1px solid var(--line);
  border-radius: 24px;
}

.filter-bar button {
  border-radius: 999px;
  padding: 11px 17px;
  background: transparent;
  color: #5d5751;
  cursor: pointer;
}

.filter-bar button.active {
  background: #fff;
  color: var(--ink);
  box-shadow: 0 8px 20px rgba(20, 16, 12, 0.06);
}

.issue-list,
.topic-list {
  display: grid;
  gap: 22px;
}

.issue-card {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr) auto;
  gap: 28px;
  align-items: stretch;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
}

.issue-thumb {
  border-radius: 18px;
  display: grid;
  place-items: center;
}

.issue-main {
  padding: 14px 0;
}

.issue-main h2 {
  font-size: clamp(26px, 2.4vw, 42px);
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin-bottom: 12px;
}

.issue-main p {
  color: #4d4843;
  font-size: 16px;
  line-height: 1.58;
  max-width: 860px;
}

.chip-row,
.lens-grid,
.topic-topline {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-row span,
.lens-grid span,
.topic-topline span,
.section-chip {
  background: var(--chip);
  border: 1px solid var(--line);
  border-radius: 10px;
  color: #4b4540;
  font-size: 12px;
  font-weight: 780;
  padding: 7px 9px;
}

.section-chip {
  background: #fff0ef;
  color: var(--red);
  border-color: #ffd7d4;
}

.mini-source,
.source-row {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.45;
  margin: 14px 0 0;
}

.mini-source a,
.source-row a {
  color: var(--red);
  font-weight: 820;
}

.issue-actions {
  align-content: center;
  justify-content: flex-end;
  min-width: 132px;
}

.issue-actions a {
  width: 100%;
  justify-content: center;
  display: inline-flex;
}

.issue-shell {
  width: min(1480px, calc(100% - 40px));
  margin: 42px auto 70px;
  background: rgba(255, 253, 250, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 34px;
  box-shadow: var(--shadow);
  padding: clamp(22px, 4vw, 46px);
}

.issue-nav .brand {
  font-size: 22px;
  font-weight: 950;
  color: var(--red);
  border: 0;
  background: transparent;
  padding-left: 0;
}

.issue-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.72fr);
  gap: clamp(24px, 5vw, 70px);
  align-items: center;
  padding: clamp(34px, 5vw, 78px) 0 34px;
}

.issue-hero h1 {
  font-size: clamp(40px, 6.5vw, 92px);
}

.issue-cover-image {
  padding: 16px;
}

.section-jump {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 18px 0;
  margin-bottom: 42px;
}

.desk-section {
  margin-top: 54px;
}

.section-heading h2 {
  font-size: clamp(28px, 3.4vw, 54px);
  letter-spacing: -0.05em;
  line-height: 1;
  margin-bottom: 20px;
}

.topic-card {
  display: grid;
  grid-template-columns: minmax(260px, 390px) minmax(0, 1fr);
  gap: 26px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: #fff;
  padding: 16px;
}

.topic-main {
  padding: 10px 8px 8px 0;
}

.topic-main h3 {
  font-size: clamp(24px, 2.2vw, 36px);
  letter-spacing: -0.035em;
  line-height: 1.08;
  margin: 12px 0 14px;
}

.topic-main p {
  color: #3c3732;
  font-size: 15px;
  line-height: 1.62;
  margin-bottom: 10px;
}

.lens-grid {
  margin: 14px 0;
}

.watchlist {
  margin-top: 58px;
  border: 1px solid var(--line);
  border-radius: 26px;
  background: #fff;
  padding: 28px;
}

.watchlist ul {
  margin: 0;
  padding-left: 20px;
  color: #3c3732;
  line-height: 1.7;
}

[hidden] { display: none !important; }

@media (max-width: 1040px) {
  .app-shell {
    grid-template-columns: 1fr;
    margin: 20px auto;
    width: min(100% - 24px, 900px);
  }

  .rail {
    display: none;
  }

  .topbar,
  .issue-nav,
  .hero-card,
  .issue-card,
  .issue-hero,
  .topic-card {
    grid-template-columns: 1fr;
  }

  .topbar,
  .issue-nav {
    align-items: flex-start;
  }

  .issue-actions {
    justify-content: stretch;
  }
}

@media (max-width: 720px) {
  .workspace,
  .issue-shell {
    padding: 18px;
  }

  .issue-shell {
    width: min(100% - 20px, 680px);
    margin-top: 16px;
  }

  h1 {
    font-size: clamp(38px, 13vw, 58px);
  }

  .hero-card,
  .issue-hero {
    padding-top: 28px;
  }

  .issue-card,
  .topic-card {
    padding: 12px;
    gap: 16px;
  }
}
`;
}

function svgDiagram(title, subtitle, columns) {
  const colWidth = 305;
  const startX = 96;
  const blocks = columns
    .map((column, index) => {
      const x = startX + index * 350;
      const items = column.items
        .map(
          (item, itemIndex) => `
            <rect x="${x + 22}" y="${300 + itemIndex * 78}" width="${colWidth - 44}" height="52" rx="16" fill="#fffdfa" stroke="#e5ddd4"/>
            <text x="${x + 44}" y="${333 + itemIndex * 78}" font-size="20" font-weight="700" fill="#3b332d">${html(item)}</text>`
        )
        .join("");
      return `
        <rect x="${x}" y="210" width="${colWidth}" height="410" rx="32" fill="#f7f3ed" stroke="#e3d9ce"/>
        <text x="${x + 24}" y="260" font-size="25" font-weight="900" fill="#c7000b">${html(column.title)}</text>
        ${items}`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760" role="img" aria-label="${html(title)}">
  <rect width="1200" height="760" fill="#fffdfa"/>
  <rect x="40" y="40" width="1120" height="680" rx="44" fill="#ffffff" stroke="#e8e3dc"/>
  <text x="82" y="118" font-family="Aptos, Arial, sans-serif" font-size="54" font-weight="950" letter-spacing="-2" fill="#171413">${html(title)}</text>
  <text x="86" y="160" font-family="Aptos, Arial, sans-serif" font-size="22" font-weight="700" fill="#6f6a66">${html(subtitle)}</text>
  ${blocks}
  <text x="84" y="682" font-family="Aptos, Arial, sans-serif" font-size="18" font-weight="700" fill="#8c837a">Source-based diagram · not a product render</text>
</svg>`;
}

function diagramAssets() {
  return {
    "diagram-solara-agent-shell.svg": svgDiagram("Agent-first device stack", "MDEP + Agent Shell + identity + just-in-time UI", [
      { title: "Device", items: ["MDEP base", "physical mic state", "sensor policy"] },
      { title: "Shell", items: ["Agent Shell", "temporary UI", "privacy indicator"] },
      { title: "Enterprise", items: ["Intune", "Entra ID", "audit trail"] }
    ]),
    "diagram-wild-signal-map.svg": svgDiagram("Wild wearable signals", "Startup, crowdfunding, and community evidence lanes", [
      { title: "Product Hunt", items: ["coding HUD", "gesture input", "reservation signal"] },
      { title: "Kickstarter", items: ["AR display", "tap-to-AI", "translation"] },
      { title: "Reddit", items: ["battery worry", "privacy worry", "AI slop worry"] }
    ]),
    "diagram-research-agency-ring.svg": svgDiagram("Agency moves off-screen", "Conversational AI + wearable ring research implications", [
      { title: "Input", items: ["low friction", "ring gesture", "voice tension"] },
      { title: "Control", items: ["process agency", "pause", "undo"] },
      { title: "Feedback", items: ["confidence gap", "status cue", "recovery"] }
    ]),
    "diagram-patent-watch.svg": svgDiagram("Patent signal handling", "Patents are direction signals, not launch facts", [
      { title: "Search", items: ["Google Patents", "CNIPA", "fresh filings"] },
      { title: "Classify", items: ["device form", "sensor stack", "interaction claim"] },
      { title: "Label", items: ["patent signal", "weak evidence", "no launch claim"] }
    ]),
    "diagram-china-global-compare.svg": svgDiagram("China / global compare", "Separate platform facts from wild market probes", [
      { title: "Global official", items: ["OS agents", "AI PC", "Android XR"] },
      { title: "China-linked", items: ["Rokid lane", "startup devices", "crowdfunding"] },
      { title: "Readout", items: ["evidence strength", "availability", "workflow impact"] }
    ])
  };
}

async function writeFile(filePath, contents) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents.replace(/[ \t]+$/gm, ""));
}

async function copyAssets(issue) {
  const outputDir = path.join(root, issue.date, "assets");
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  const sourceDir = path.resolve(root, "..", "Survey", "output", "slidev", `ai-product-morning-brief-${issue.date}`, "public", "assets");
  const officialAssets = [
    "apple-siri-onscreen.jpg",
    "google-xr-hero.webp",
    "googlebook-hero.png"
  ];
  for (const asset of officialAssets) {
    await fs.copyFile(path.join(sourceDir, asset), path.join(outputDir, asset));
  }
  for (const [filename, svg] of Object.entries(diagramAssets())) {
    await fs.writeFile(path.join(outputDir, filename), svg);
  }
}

await writeFile(path.join(root, "assets", "site.css"), siteCss());
await writeFile(path.join(root, "index.html"), homepage("zh"));
await writeFile(path.join(root, "en", "index.html"), homepage("en"));
await writeFile(path.join(root, "manifest.json"), `${rootManifest()}\n`);

for (const issue of issues) {
  await copyAssets(issue);
  await writeFile(path.join(root, issue.date, "zh", "index.html"), issuePage(issue, "zh"));
  await writeFile(path.join(root, issue.date, "en", "index.html"), issuePage(issue, "en"));
  await writeFile(path.join(root, issue.date, "manifest.json"), `${issueManifest(issue)}\n`);
  await writeFile(path.join(root, issue.date, "sources.md"), sourcesMarkdown(issue));
}

console.log(`Rendered ${issues.length} AI Daily issue(s).`);
