# Validated-draft receipt relocation

This development branch preserves a verified migration fix. It does not establish
cross-instance storage, enable a recurring task, or deploy publisher software.
Its base is `60c157384150749c97ddae9618e7a4fc541514cb`, the previously authorized
cloud preservation commit, rather than the current publication branch.

## Preserved fix

Previously, a restored receipt still referenced its old absolute output paths.
The runner swallowed a missing old artifact's ENOENT as though the receipt itself
were absent, then attempted to rebuild into an existing restored directory and
failed with EEXIST.

The fix uses the invocation's explicit output directory to locate a complete
restored draft. It checks the current rule snapshot, reviewed input hash,
repository HEAD/publication baseline, receipt identity, artifact-tree hash and
public release-set hash before atomically updating the private receipt's output
and target paths. Daily receipts also update the standard Slidev source path.
The original completion time and review hashes remain unchanged. Intact repeated
invocations reuse the draft without rewriting publication files.

Missing files now fail explicitly with restoration/review instructions; changed
artifacts or navigation fail their hashes. A missing artifact no longer silently
starts a new build. Output inside the public checkout is rejected.

The original code/test patch SHA256 is:

`73368efb85cd5d25a7cafc359ac73ccc5b611f0511b4a72cabc189efa0595799`

It changes `scripts/cloud-run.mjs` and adds `tests/cloud-recovery.test.mjs`.
The additional documentation does not alter those previously tested bytes.

## Validation and the current PDF restriction

Before this fix, six regression cases failed, including a real isolated weekly
fixture reproducing EEXIST; an additional public-output boundary test also failed.
After the fix, all seven regression cases passed. The complete suite then passed
132 tests with zero failures/skips, using Node v24.19.0 and locked Playwright
1.61.0. That historical run included PDF fixtures and occurred before the user's
web-only instruction. Its log SHA256 was:

`b8ed1d75a173dae60ecd3e7c05e17558524a7752ecfe06fffad259f88f7245f1`

The user's latest instruction cancels all new daily/weekly PDF generation and
preserves historical PDFs. Do not rerun the PDF-dependent full suite or the
receipt fixture suite under that instruction: some receipt fixtures themselves
create PDF-named files. Code preservation can instead verify patch identity,
syntax, whitespace/applicability, and the non-rendering tests:

```sh
node --check scripts/cloud-run.mjs
node --check tests/cloud-recovery.test.mjs
node --test --test-skip-pattern='independent weekly dry build' \
  tests/cloud-publisher.test.mjs tests/notion-rules.test.mjs \
  tests/weekly-time.test.mjs
```

That targeted command intentionally excludes the browser/PDF weekly fixture.
Report its fresh result separately from the historical 132-test result; do not
describe it as a new full-suite or browser acceptance run.

For this preservation step, patch identity, both syntax checks, patch
applicability and whitespace checks passed. The targeted command above freshly
passed 15 non-rendering tests with zero failures; no PDF work was executed.

## What a new cloud task still needs

- A real durable private storage location and a verified restore/mount procedure.
  Setting AI_DAILY_PRIVATE_ROOT or reusing an environment configuration ID does
  not prove disk persistence. Git stores software/published history, not the
  private raw ledger, reviewed inputs, draft artifacts or recovery journals.
- A genuine fresh-instance restore and deduplication test. Same-host processes
  and copied fixture directories have been tested; actual cloud-instance
  persistence has not. No storage service or transfer of private state is part
  of this branch preservation.
- An operational single-writer policy and lock recovery. Stale run/ledger locks,
  other-host release locks and abandoned acquisition guards remain fail-closed.
  This change does not implement distributed leases or unattended reclamation.
- Stable publication-checkout paths or separately reviewed transaction recovery.
  Release journal identity still includes the repository's absolute path; daily
  dry inputs can contain an archive symlink. This receipt fix does not make all
  partially prepared releases portable.
- A separately verified timer/coordinator/cloud-execution route and failure
  reporting. This package does not create a timer or independently conduct
  product research. No schedule is enabled by saving this branch.
- Reconciliation with the current web-only publishing and editorial brief.
  Preserved cloud:build still invokes PDF-dependent stages, and its old dense
  editorial gate is not proof of compliance with the owner's current research
  and presentation requirements. Do not invoke that formal publishing flow
  until the web-only transition has been separately implemented and accepted.
- Reviewed handling of true post-cutoff verification times for daily editions.
  The one-time October 15 web publication used an explicitly audited local
  compatibility checker; that separate temporal change is not included here.

No credentials, private rules, raw observations, runtime receipts or published
editions are added by this fix/documentation commit. Do not merge it into main
without owner review, and do not treat branch upload as deployment or evidence
that independent scheduled execution is ready.
