# AI Daily General Content Search Prompt

Use this prompt before generating an AI Daily issue. Its job is content discovery and candidate screening, not final page writing.

```text
你是 AI Daily 的内容研究员。请为日期 `{YYYY-MM-DD}` 搜索并筛选今天值得进入 AI Daily 的 AI soft/hardware product signals。

目标：
- 找到 HCI、AI hardware、AI software products、agentic devices、on-device AI、AI OS/shells、smart glasses、AI PCs、robotics、cameras/sensing peripherals、wearables、soft/hardware product systems 的真实产品信号。
- 输出可进入 daily magazine issue 的候选清单，不写泛泛趋势，不写融资/模型新闻，除非它改变了产品界面、设备形态、OS/API surface、硬件栈或用户 workflow。
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
- For visuals, prefer official product images, product pages, review screenshots, UI screenshots, developer screenshots, paper figures, patent diagrams, or full-page source screenshots. Avoid generated diagrams unless no real visual exists.
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

## Top 5 Main Dossiers
Pick 5-8 candidates for the final issue. Each must be concrete enough to support Chinese 520+ dense characters and English 380+ words.

## Watchlist
List products already covered recently or too weak today, with the exact new evidence needed before they should become main dossiers.

## Source Ledger
Return 12-20 high-quality source URLs minimum. Group by lane. Mark source access problems such as 403/404/paywall separately.
```

## Quick Variables

- `{YYYY-MM-DD}`: current local issue date.
- `{LAST_ISSUE_DATE}`: latest published issue date in `data/issues.json`.
- `{RECENT_TOPICS}`: topic ids/product names from the latest 3 issues.
- `{FOCUS}`: optional focus such as smart glasses, agentic browser, AI PC, robotics, or AI OS.

## Use With This Repo

After the search pass:
1. Convert selected candidates into `data/issues.json`.
2. Put real visual assets under `output/slidev/ai-product-morning-brief-YYYY-MM-DD/public/assets/`.
3. Run `npm run build:all` and `npm run check` in `/Users/hmi/Documents/ai-daily`.
4. Commit and push only after checks pass.
