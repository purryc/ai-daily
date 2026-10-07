# AI Daily

A bilingual AI product briefing at the existing GitHub Pages site:
https://purryc.github.io/ai-daily/

## Editorial contract

- Report real, dated product advances. A source's retrieval time is not its publication date
- Deduplicate by product, event/version, normalized source URL and source date, within an issue and against the archive
- A same-product follow-up needs a substantive Chinese/English delta and new evidence. Link its previous issue
- Legacy records lack structured event dates. A new event on an already-used stable legacy URL is conservatively quarantined until its old coverage can be reviewed and migrated; a newly dated secondary recap cannot override that protection
- Use four clear introduction units in both languages: what it is, what changed, how to use it, and limits. Integrate essential sourced explanations, figures and demo controls on one readable page per story. Aim for about 15 minutes of useful reading and viewing; there are no artificial word/story quotas
- Prefer several informative factual product, UI and interaction figures, each with source, caption, alt text and role. Explain unavailable imagery explicitly. Never manufacture a product visual
- One contents page, normally one substantial illustrated page per story, and one references page with all provenance links. The full source ledger stays outside the main reading route
- Maximum 50 printed pages per language, checked against both HTML and the actual PDF. An honest no-news issue is valid
- Research, build and verify in the cloud. Do not write daily copies into a Mac folder
- Preserve the historical archive and assets. Update only this existing Pages site

## Files

- `data/issues.json`: original legacy archive, preserved byte-for-byte
- `data/candidates/YYYY-MM-DD.json`: verified research input
- `data/editions/YYYY-MM-DD.json`: validated concise edition; overrides only that date in the legacy archive
- `data/quarantine/2026-10-06-legacy.json`: five original additions withheld from the current news gate; original full dossiers remain in the preserved legacy archive
- `YYYY-MM-DD/assets/`: factual figures, already materialized inside the cloud checkout
- `YYYY-MM-DD/zh/` and `YYYY-MM-DD/en/`: Chinese and English report pages
- `YYYY-MM-DD/manifest.json` and `sources.md`: event metadata and source/visual ledger
- `scripts/lib/issue-data.mjs`: merges new editions with the preserved archive for every consumer

## Candidate schema

The input contains `date`, `timezone` (normally `America/Toronto`), an ISO `cutoff` timestamp with timezone, bilingual titles/summaries, and a `candidates` array. The cutoff must fall on the declared issue date in that timezone. `lookbackDays` may be 1–3; the default is 3. Every promoted event remains labeled with its actual date.

Each candidate needs:

- `id`, `section`, `evidenceLabel`, `zhHeadline`, `enHeadline`
- `event`: `productKey`, `kind`, a stable `version` or `key`, `occurredAt`, `summaryZh`, `summaryEn`, `deltaZh`, `deltaEn`
- `eventSourceUrl`: the specific source proving this event, especially when old product references also appear
- `sources[]`: `label`, `url`, `type`, `publishedAt`, `verifiedAt`, `isPrimary`
- `brief.zh` and `brief.en`: `what`, `change`, `use`, `limits`
- `visuals[]`: `path` such as `assets/product.webp`, `kind` containing `source-backed`, `sourceUrl`, `capturedAt`, `altZh`, `altEn`, `captionZh`, `captionEn`, `role`
- Research drafts may use `visualMissing: { zh, en }`; final inputs with `requireProductVisuals: true` must have a verified meaningful figure for every featured fresh/background story
- Optional `detailPages[]`: `id`, `zhTitle`, `enTitle`, bilingual `points[]` with retained `sourceUrls`, and additional factual `visuals[]`, integrated into the same story page rather than automatically producing continuation pages
- Optional `media[]` on a topic or detail page: `kind` video/gif/official-link, official `url`, `sourceUrl`, full factual `poster` object, bilingual captions/what-to-observe and `verifiedAt`. Click-to-play only; the PDF uses the verified static frame and source. Large demos are not rehosted
- Optional small `contextCandidates[]` pool uses `coverageKind: first-inclusion-context`, the actual older event/publication date, and a separate background-learning section. It is still deduplicated against history and is never labeled new today
- Optional `editorialPlan` and `readingEstimate` describe the approximately 15-minute reading route and transparent speed/figure assumptions, not guaranteed completion time

For an explicit primary-source effective date with no publication date, use `publishedAt: null` and `dateEvidence: { kind: "effective-date", date: "YYYY-MM-DD", quote: "short exact effective-date excerpt" }`. This is not allowed for vague labels like “updated this week.” Keep quotes within source quotation limits.

Optional `laneScans[]` record `lane`, `status`, `zh`, `en` and `sourceUrls`. Scanning all lanes is research discipline; a lane without a strong update is not padded with an old story.

## Cloud build and verification

The build machine needs Node, Playwright Chromium, and Poppler's `pdfinfo`. If using a supported already-installed Chromium, set `AI_DAILY_CHROMIUM_PATH` to its executable. Do not weaken browser or system security to make tests run.

```sh
npm ci
npm run issue -- --input data/candidates/2026-10-06.json
AI_DAILY_DATES=2026-10-06 npm run build:all
AI_DAILY_DATES=2026-10-06 npm run check
npm run test:all
```

`npm test` runs the complete suite, including real Chromium PDF rendering. `npm run test:unit` covers policy, archive preservation, server paths and actual PDF page-count boundaries without launching a browser. `npm run test:browser` runs the browser stage alone. A blocked browser stage must be reported as not run; passing unit tests alone does not authorize a completion claim.

The standard browser PDF export remains available on build machines that support Chromium. When browser printing is unavailable, install the pinned Python dependencies with `python3 -m pip install -r requirements-pdf.txt`, provide an installed Noto Sans CJK font, and run `AI_DAILY_DATES=2026-10-06 npm run pdf:static`. This invokes a separate data-driven ReportLab layout; inspect its actual page count, text completeness and rendered images before delivery. Do not claim that it is an exact browser-print rendering. `pdf-export.json` records the renderer, actual bilingual page counts and the SHA256 of the exact edition input. Validation rejects stale sidecars; shared editorial exports require matching story-page plans and page counts; only their physical layout differs from browser printing.

Build and PDF commands default to the latest issue only. `AI_DAILY_DATES` may explicitly select comma-separated dates, but never silently regenerates the archive. Missing evidence assets fail clearly and are not replaced with generated diagrams. PDFs are written atomically only after page-count validation.

The existing dated Oct 6 entrypoint delegates to the new candidate-driven generator for compatibility. The repository has no configured daily generation schedule. The existing external task `AI Product Morning Brief` (`ai-product-morning-brief`) was identified as active at 10:00 America/Toronto; its existing local configuration and cloud migration require a separate verified update. Repository changes alone do not change that recurring task. Do not create an unrequested parallel schedule.

Publish only after the source review, chosen design, rendering checks and PDF checks are complete. Use a compare-and-swap GitHub ref update against the verified repository head, then verify the exact Pages deployment and live result.
