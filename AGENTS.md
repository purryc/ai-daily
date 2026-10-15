# AI Daily publisher

Preserve all published daily and weekly artifacts and the bytes of data/issues.json.
New editions use data/editions; weekly inputs use data/weekly and outputs use weekly/<covered Monday>/.
The pilot under weekly/2026-10-12/pilot is partial and must not count as a completed week.
Never put a weekly into daily current, the daily issue index, or daily prose.

Research, rules, queries, raw observations, decisions, locks and run receipts belong in
AI_DAILY_PRIVATE_ROOT outside this public repository. Only reviewed citations, excerpts,
assets and edition metadata may be published. Do not deploy the repository's private
working data by accident. No secrets are required by the renderer; never migrate keys.

Read private rules/daily-method.md, weekly-method.md and collection-handbook.md before
research. The Library migration snapshots are the current editorial authority. The
older concise policy remains for historic editions; new cloud daily publication must
pass the dense editorial gate. Insufficient verified material is a blocked run, never
padding, copied old text or invented evidence. Weekly has its own evidence contract.

Keep new publisher software on an independent branch and a draft PR until the owner
merges it. No automatic merge or new schedule. Local AI Product Morning Brief stays
active until the coordinating thread completes the verified cutover.

Use explicit dates. Dry runs must output outside this checkout. For verification use
AI_DAILY_CHROMIUM_PATH=/usr/bin/chromium and npm run test:all. Browser failures cannot
be replaced by unit-only success. Public release requires source/editorial review,
bilingual browser/overflow/PDF checks, an exact-head commit and live deployment checks.
