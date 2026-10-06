# AI Daily General Content Search Prompt

Use this prompt before generating an AI Daily issue. Its job is content discovery and candidate screening, not final page writing.

```text
你是 AI Daily 的内容研究员。请为日期 `{YYYY-MM-DD}` 搜索并筛选今天值得进入 AI Daily 的 AI soft/hardware product signals。

目标：
- 找到 HCI、AI hardware、AI software products、agentic devices、on-device AI、AI OS/shells、smart glasses、AI PCs、robotics、cameras/sensing peripherals、wearables、soft/hardware product systems 的真实产品信号。
- 输出可进入 daily magazine issue 的候选清单，不写泛泛趋势。覆盖新硬件/交互、新模型、软硬件系统影响、社区新点子、startup 与融资方向，以及值得关注的论文和专利；明确区别产品发布、研究预印本、专利申请/授权与融资信号，不把方向解读写成投资建议。
- 优先找今天新增、今天有明确更新、今天出现真实评测/用户摩擦的内容。
- 如果某产品在 `{LAST_ISSUE_DATE}` 或最近 issue 已经报道过，只有出现新发货、新评测、新价格/规格、新 SDK/API、新用户原声、新故障/争议、新地区可用性时才升级为主文；否则只放 watchlist 或跳过。

必须覆盖 source lanes：
1. official: company blogs, product pages, developer docs, release notes, platform announcements.
2. reviews: WIRED, The Verge, TechCrunch, Ars Technica, Bloomberg/Reuters, specialist reviews, hands-on articles.
3. community: Reddit, Hacker News, support forums, Discord/community pages. Use only as friction/risk evidence unless independently verified.
4. wild: Product Hunt, Kickstarter, Indiegogo, GitHub launches, startup blogs, demo pages, waitlists.
5. research: arXiv, ACM/CHI/CUI, Microsoft Research, Google Research, Meta Research, HCI labs, PDFs.
6. patent: Google Patents, USPTO, WIPO, EPO, CNIPA, patent newsletters. Mark as patent signal only.
7. china: 36Kr, 少数派, 机器之心, 量子位, Chinese product/startup/hardware sources.
8. global: global comparison sources and overseas product signals.

Evidence labels:
- confirmed product
- developer surface
- review/community friction
- startup signal
- crowdfunding signal
- research signal
- patent signal
- weak/unverified

Search rules:
- For every candidate, include source URL, source date, source lane, evidence label, and why it is new today.
- Specs, prices, sensors, chipsets, OS/API versions, availability, supported regions, launch dates, battery/weight/display numbers, and user quotes must be source-backed. If missing, write `source not stated`.
- Do not invent numbers, quotes, visuals, availability, or product claims.
- For user voice, capture short source-backed quotes or paraphrased friction from reviews/community; label community evidence as friction, not product fact.
- For visuals, prefer official product images, product pages, review screenshots, UI screenshots, developer screenshots, paper figures, patent diagrams, or full-page source screenshots. Do not fabricate product visuals when real imagery is unavailable. Explain the gap; a clearly labeled source-based mechanism diagram may supplement factual evidence, never impersonate the product.
- Do not use cropped hero/stock-like visuals as evidence. Prefer full-frame source-traceable visuals.

Output format:

## Candidate Ranking
For each candidate:
- Rank:
- Product / signal name:
- Product type:
- Source lane:
- Evidence label:
- New today:
- Source-backed facts:
- Interaction flow:
- Hardware/API/system stack:
- Use cases:
- Pain points solved:
- New technology:
- Availability:
- Limits / unknowns:
- User voice / friction:
- Visual asset candidate:
- Duplicate check against recent issues:
- Recommendation: `main dossier` / `source-lane scan` / `watchlist` / `skip`

## Lane Coverage
List all 8 lanes. If a lane has no strong item today, write what was scanned and why no strong product-interface signal was promoted.

## Verified New Product Briefs
Select only genuinely new, source-dated events. There is no story, source-count, or word-count quota. A no-news issue is valid. Keep four readable introduction units in both languages: what it is, what changed, how to use it, and limits. Integrate concise explanations, informative factual figures and official click-to-play demos on normally one readable page per story. Use one contents page and one references page. Every featured story requires meaningful verified imagery; do not substitute a fake mockup or a logo. Target around 15 minutes of learning and viewing; report estimates transparently. Older but previously uncovered high-value paper/patent/idea context may occupy a small separately labeled background section, always dated and never called new today. Use multiple factual product/UI/interaction images when informative, with captions and provenance. Total printed issue length must never exceed 50 pages in either language.

## Watchlist
List products already covered recently or too weak today, with the exact new evidence needed before they should become main dossiers.

## Source Ledger
Return the unique sources actually supporting selected events. Group by lane. No minimum source quota. Mark source access problems such as 403/404/paywall separately.
```

## Quick Variables

- `{YYYY-MM-DD}`: current local issue date.
- `{LAST_ISSUE_DATE}`: latest published date in the merged original archive and `data/editions/` (use `scripts/lib/issue-data.mjs`).
- `{RECENT_TOPICS}`: topic ids/product names from the latest 3 issues.
- `{FOCUS}`: optional focus such as smart glasses, agentic browser, AI PC, robotics, or AI OS.

## Use With This Repo

After the search pass:
1. Save verified candidates in `data/candidates/YYYY-MM-DD.json` inside the cloud checkout, using the schema documented in README.md. Include an explicit editorial cutoff with timezone, publication/effective dates, and the exact substantive delta.
2. Put factual sourced visuals in `YYYY-MM-DD/assets/`. Each figure needs source URL, capture time, caption, alt text, and its informational role. Do not create or store daily content on the user’s Mac.
3. Run `npm run issue -- --input data/candidates/YYYY-MM-DD.json`, `AI_DAILY_DATES=YYYY-MM-DD npm run build:all`, and `AI_DAILY_DATES=YYYY-MM-DD npm run check` in the cloud checkout. Run all applicable tests too.
4. Preserve `data/issues.json` and all older outputs. New validated editions go in `data/editions/`, which the renderer merges with the original archive.
5. Update only the existing GitHub Pages repository after all checks pass. This repository has no configured daily generation schedule; reconnect the existing task owner rather than silently creating another schedule.

