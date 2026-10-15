# Cloud daily and independent weekly publisher

The cloud checkout is /workspace/ai-daily. Read AGENTS.md and the private methods
before each research run. Research is performed by the executing agent using connected
search/read tools; this package validates and publishes reviewed inputs. It does not
claim to be an autonomous crawler or to have already collected a historical panel.

## Storage and prerequisites

Set AI_DAILY_PRIVATE_ROOT=/workspace/ai-daily-private and
AI_DAILY_CHROMIUM_PATH=/usr/bin/chromium. Keep this private root outside the public
checkout and persist it between executions. Its layout is:

    rules/manifest.json
    rules/daily-method.md
    rules/weekly-method.md
    rules/collection-handbook.md
    rules/execution-prompt.md
    rules/HANDOFF.md
    signals/queries/<query_id>.json
    signals/observations/<signal_id>.json
    signals/decisions/<decision_hash>.json
    signals/index.json
    runs/daily-<date>.json
    runs/weekly-<covered Monday>.json

Materialize the six Library migration files using the CURRENT Library skill and
its supported helper into rules/. Do not reconstruct them from a blocked transfer,
reuse another environment's paths, or migrate keys. cloud:preflight validates the
five text files against the supplied manifest's exact byte counts and SHA256 hashes.
An absent or changed rule fails before any formal build. Library materialization is
an operator prerequisite, not an ability this Node package silently substitutes.

Node >=22.12, npm, Chromium, Poppler/pdfinfo, bilingual fonts and network access to
the official npm registry are needed. Main dependency installation:

    npm ci --cache /tmp/ai-daily-npm-cache
    AI_DAILY_CHROMIUM_PATH=/usr/bin/chromium npm run test:all

The independent daily Slidev source has its own exact direct dependency versions,
package-lock.json, bilingual Markdown, sources, reviewed public/assets, dist and
dist-en. Its lock is generated in the private dry run and retained there for exact
rebuilds; node_modules never enters the public release set. The final public
magazine is still the existing HTML/PDF publisher.

## Scheduling ownership and first complete week

The coordinating thread owns scheduling: daily every day at 10:00 America/Toronto,
weekly every Monday at 10:00 America/Toronto. This package creates no schedule.
The local AI Product Morning Brief stays active until the coordinator verifies cloud
readiness, pauses it through the supported local app, reads back that status, then
activates a single cloud owner. Never run both publishers in parallel.

First eligible formal weekly: October 19, 2026, covering October 12 through 18.
A partial pilot does not satisfy the complete-week key. plan selects the most recent
completed unproduced week on a later run as a catch-up, with daily and weekly due flags
separate. A failed daily never prevents the separate weekly invocation.

## Agent invocation

Start every invocation in this checkout and run:

    export AI_DAILY_PRIVATE_ROOT=/workspace/ai-daily-private
    export AI_DAILY_CHROMIUM_PATH=/usr/bin/chromium
    npm run cloud:preflight
    npm run cloud:plan

Freeze the returned researchCutoff at research start; do not move it while writing.
For daily research, the main interval is [cutoff-24h, cutoff). Supplementary 72h and
7-day items need explicit freshness labels; date-only events need boundary uncertainty.
Use at least eight weeks of available ledger plus historical coverage/event keys for
deduplication, disclosing insufficient coverage. Archived generated prose is a lead,
never independent evidence.

Each research batch has queries, observations and decisions arrays. Core fields follow
the private daily/weekly methods. Include actual query scope/window/counts/access/panel;
original URLs and locators; stable signal/product/event/origin IDs; separate timestamps;
verification, task/interaction/stack/availability; limits, counterevidence and visuals.
Unknown source publication dates stay null. Decision records include exclusions as
well as selections. Corrections use new IDs linked to the prior signal, rather than
mutating immutable evidence. Repeat identical imports are idempotent; conflicting IDs
and concurrent locks fail visibly.

    npm run ledger:ingest -- /workspace/ai-daily-private/incoming/batch.json

Daily reviewed input retains the existing candidate schema and adds:

- cloudEditorialContract: dense-v1; lookbackDays up to 7 only for explicit backfill.
- primaryWindowStart: exact ISO cutoff minus 24 hours.
- Per candidate: signalIds, freshnessClass, dossier.zh/en with productName,
  productType, interactionFlow, specsOrStack, useCases, painPointsSolved, newTech,
  availability, limitsOrUnknowns and productVerdict.
- Optional dossierPageFields: explicit arrays partitioning all 11 renderer fields
  (including userVoice) exactly once. Both languages share the page plan. Split a
  dense dossier rather than clipping, scrolling within a page or dropping fields.

    npm run cloud:build -- --kind daily \
      --input /workspace/ai-daily-private/incoming/daily-YYYY-MM-DD.json \
      --assets /workspace/ai-daily-private/incoming/daily-assets \
      --output /workspace/ai-daily-private/dry/daily-YYYY-MM-DD

The cloud gate enforces 5–8 products, 12–20 normalized sources, at least six distinct
traceable figures and one per product, all dossier units, Chinese product body >=6000
dense characters, English >=4500 words, product minima 520/380 and scan minima 180/140.
Eight lanes must be recorded. Passing the historic concise/no-news validator alone
does not pass this cloud gate. Insufficient facts are a failed/unmet run, never padding.
Source-backed specs, substantive bilingual parity, the absence of recycled/filler
prose, source independence, nonofficial opportunities and visual reuse boundaries
also require editorial review; numerical checks do not certify those judgments.

Daily staging reuses immutable legacy bytes through a read-only input symlink, copies
only edition/coverage metadata and current assets, and rebuilds only the chosen date.
It does not copy historical PDFs. Render/build/check use AI_DAILY_ROOT for isolated
output; AI_DAILY_DATES must always be explicit.

## Weekly schema and independent workflow

Reviewed weekly input has weekStart (covered Monday), timezone, windowStart/windowEnd
(actual Toronto midnight offsets, DST respected), cutoff at/after the complete week,
partialWeek:false, bilingual title/summary/coverageLimitations/watchlist,
baselineStatus (establishing/comparable), reviewed sources and eight laneScans.
Each source has id,label,url,publishedAt and signalId matching the shared original.
Scanned/blocked lanes need actual queryIds; incomplete lanes explicitly disclose gaps.

Highlights have id,title,signalIds and explicit bilingual pages. Each page has title,
paragraphs,sourceIds and optional provenance-complete visuals (assets/ paths, bilingual
alt/caption, sourceUrl, kind and capturedAt).

Trends have stable id, title, state (new/strengthening/continuing/weakening/conflicted/
withdrawn), classification (trend/emerging), confidence (low/moderate/high), claimType,
signalIds, pages, and bilingual thisWeek, baseline, counterevidence,
alternativeExplanation, confidenceReason, hciImpact, experiment and falsifiableWatch.
matrix has attention/friction/feasibility/payment_intent; each cell has status
(support/contradiction/unknown), signalIds and bilingual note. Unknown cells stay empty.
Each known cell references shared observations tagged with that dimension.

A trend needs independent events >=3, organizations >=2, non-geography source
classes >=2 and time points >=2. China/global never add independent source classes.
Otherwise use emerging. Demand and commercial claims require separate reviewed
behavior/payment validation; the event threshold does not prove market demand.
Maintain fixed and discovery panels separately. Without comparable 4–8-week records,
use establishing, dated qualitative baselines and explicit unknowns.

    npm run cloud:build -- --kind weekly \
      --input /workspace/ai-daily-private/incoming/weekly-YYYY-MM-DD.json \
      --assets /workspace/ai-daily-private/incoming/weekly-assets \
      --output /workspace/ai-daily-private/dry/weekly-YYYY-MM-DD

The weekly command independently emits weekly/<Monday>/zh,en,assets,sources,manifest,
PDFs and qa.json plus its own weekly index. It never changes daily current or the
daily body. Typical highlight/trend counts are editorial aims; weak evidence reduces
counts. Explicit pages are retained bilingually, and all desktop/mobile pages and
real PDF page counts are checked. Long pages fail rather than auto-shrink.
Each validated draft has input, artifact and release-set hashes in its private
receipt. Repeated identical validated builds reuse the intact draft; changed
artifacts/inputs fail visibly. Resolve failed/revised drafts and stale locks explicitly.

Receipt validity also requires the current repository HEAD and publication baseline
(daily/weekly navigation, styles, legacy archive and edition/coverage/weekly inputs)
to match their build-time hashes. A later prepared or published issue makes an older
navigation snapshot stale: rebuild its draft and repeat QA/editorial review instead
of overwriting the newer index.

All cutoff/window and observation timestamps must be real ISO instants with offsets.
Source publications and events at/after cutoff cannot enter the weekly or its matrix.
Known date-only sources on the cutoff date need dateBoundaryUncertain and a bilingual
temporalNote. Unknown publication dates need temporalStatus:publication-date-unknown.
Legitimate later verification of an already dated public source is allowed only with
snapshotStatus:current-page-not-historical, asOfCutoff matching this weekly's cutoff,
and bilingual temporalNote. Actual observed/research times remain unchanged. The
public source index displays the late-read/nonhistorical-snapshot caveat. An undated
later reading cannot prove earlier existence; live metrics need their own dated
measurement rather than borrowing an old page publication date.

The lower-level weekly:build and weekly:check commands exist for isolated engineering
tests; formal automation must use cloud:build so rule preflight, locks and receipts
cannot be omitted.

## Prepare reviewed public files, then publish separately

After source, privacy and bilingual editorial review:

    npm run cloud:prepare-release -- --reviewed \
      --receipt /workspace/ai-daily-private/runs/weekly-YYYY-MM-DD.json \
      --input /workspace/ai-daily-private/incoming/weekly-YYYY-MM-DD.json

For daily use its separate receipt/input. This verifies reviewed hashes and copies
only the public allowlist. Weekly can update only its dated weekly folder, weekly
index/manifest and data/weekly/<Monday>.json. It preserves pilots and daily files.
Daily can update only its dated edition and daily global navigation/styles/manifest.
Rules, raw signals, receipts, npm caches, Slidev node_modules and historical PDF
copies never enter the release set.

This command prepares a git diff; it does not commit, push, merge or schedule.
Review the explicit diff, preserve history/unrelated work, commit on an independent
branch, and use the authorized GitHub connection with exact-head/lease protection.
Check the exact Pages deployment and live bilingual desktop/mobile navigation,
images, overflow and PDF links. Build/commit/deployment/live states are separate.
The software PR stays draft until the coordinating owner merges it.

Only explicitly referenced image files are copied from the approved assets directory;
unreferenced siblings and source symlinks are never imported. Release copies individual
regular files from an exact allowlist, including reviewed assets and bilingual PDF
links. Private/output roots resolve symlink ancestors before the public-checkout check.

Publication preparation is serialized by a private release lock. Private backup/journal
state and per-file atomic replacement permit exception rollback and recovery after a
process crash. A provably dead owner on this host can be recovered; an active, unknown
or other-host owner requires inspection. Recovery refuses unrelated newer file edits
or a changed repository HEAD. Repeating an intact already-prepared release is a no-op;
it never replays old navigation over another issue. Do not commit a partial failed
preparation or remove recovery state before inspecting it.

Lock creation and dead-owner takeover are serialized by an atomic
release.lock.acquire directory. Concurrent reclaimers cannot delete a newly registered
live lock. The lock has a unique instance ID; normal cleanup checks that ID and owner.
An acquisition guard left by a crash is deliberately fail-closed and never automatically
reclaimed: confirm no publisher/acquirer is active before operator recovery.

For direct checks of a reviewed weekly draft:

    npm run weekly:check -- --root DRY_DIRECTORY --week YYYY-MM-DD --pdf

For read-only checking of the existing pilot (writes no archive file):

    npm run weekly:check -- --root /workspace/ai-daily --week 2026-10-12 --pilot

If runtime HTTPS is blocked, report the exact browser/network error and use another
authorized read-only connector for HTTP availability. HTTP 200 is not visual QA.
Never claim that a local result is the deployed screenshot.
