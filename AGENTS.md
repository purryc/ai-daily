# AI Daily publisher

Coordinator update, 2026-10-15: new daily and weekly delivery is web-only.
Do not generate or export PDFs; preserve historical PDFs unchanged. This
preservation branch still contains older PDF-dependent build/test paths and
editorial gates. Read CLOUD_RECEIPT_RECOVERY.md before continuing; those older
paths below are not authorization to run PDF work or enable a schedule. The
current task only saves migration code, tests and documentation on a separate
development branch, without changing main or published editions.

Preserve all published daily and weekly artifacts and the bytes of data/issues.json.
New editions use data/editions; weekly inputs use data/weekly and outputs use weekly/<covered Monday>/.
The pilot under weekly/2026-10-12/pilot is partial and must not count as a completed week.
Never put a weekly into daily current, the daily issue index, or daily prose.

Research, rules, queries, raw observations, decisions, locks and run receipts belong in
AI_DAILY_PRIVATE_ROOT outside this public repository. Only reviewed citations, excerpts,
assets and edition metadata may be published. Do not deploy the repository's private
working data by accident. No secrets are required by the renderer; never migrate keys.

Refresh the designated Notion rule page through the authorized native connector and
read private rules/notion-rulebook.md before research. Bind reviewed inputs and release
receipts to its verified snapshot hash. User instructions override stale operational
status in that document. The separate Library migration bundle remains unmaterialized
while its supported download is blocked; never reconstruct it through another route. The
older concise policy remains for historic editions; new cloud daily publication must
pass the dense editorial gate. Insufficient verified material is a blocked run, never
padding, copied old text or invented evidence. Weekly has its own evidence contract.

Keep new publisher software on an independent branch and a draft PR until the owner
merges it. No automatic merge or recurring schedule. The old local recurring task was
deleted; there is no active local fallback. For the October 15 one-time backfill, wait
for the coordinator's confirmation that the local writer stopped before cloud release.

Use explicit dates. Dry runs must output outside this checkout. For verification use
AI_DAILY_CHROMIUM_PATH=/usr/bin/chromium and npm run test:all. Browser failures cannot
be replaced by unit-only success. Public release requires source/editorial review,
bilingual browser/overflow/PDF checks, an exact-head commit and live deployment checks.
