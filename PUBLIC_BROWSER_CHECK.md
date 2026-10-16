# Nonpublishing Actions browser probe

This diagnostic captures only `https://nodejs.org/en/download`, a real public
software download interface on a host present in this environment's published
allowlist. The target has not been requested or refused during preparation.
It is unrelated to the denied AI product pages and does not retrieve their content.

The independent branch is `cloud/actions-public-browser-check-2026-10-16`.
The push workflow needs no default-branch merge. A job is eligible only for this
repository, a public repository payload, and an explicit commit-message marker
`[run-public-browser-check]`. Preparation commits omit that marker. Do not add it
until repository visibility, Actions permissions, included artifact capacity and
the permitted run/artifact retrieval path have been checked. No schedule, Pages,
deployment, release, model, secret or write-token permission is configured.

The standard `ubuntu-24.04` runner reuses its Chrome and the project's locked npm
dependencies. No browser install, proxy override, certificate change or TLS bypass
is performed. Missing Chrome fails the check. Normal HTTPS validation remains on.
Only nodejs.org/www.nodejs.org requests are permitted in the product context;
external requests are stopped before network. HTTP refusal stops that source host.
The script takes no login, download, form-submission or purchase actions.

The isolated runner-temp output contains exactly one viewport PNG, one HTML page
that loads it locally, and a JSON receipt with actual timestamps, PNG dimensions,
file hashes and run/commit identifiers. Original publication date remains unknown.
The workflow uploads only those three paths for one day, with a 2 MiB content
bound. A failed capture uploads its failure receipt instead of a product image.
It never reads rules, research, private ledgers, credentials or daily build inputs.

A successful Actions job proves capture and local HTML reading only. Download the
actual artifact through an authorized path, verify receipt/commit/file hashes and
view product.png before reporting the complete probe as passed. The receipt's
pixel-review status deliberately remains pending. An artifact URL alone is not
proof that an image was saved or visually reviewed in this workspace.

Local verification uses labeled loopback fixtures, never the real external target:

    AI_DAILY_CHROMIUM_PATH=/usr/bin/chromium node --test tests/public-browser-check.test.mjs

Repository settings, visibility, billing balance and Actions runtime permissions
cannot be inferred from Git read/push access. The previously refused GitHub API
path remains stopped; do not use another connector to bypass it. If these facts or
artifact retrieval cannot be verified by an allowed route, retain the preparation
and report the exact blocker rather than claiming a remote run or requesting
expanded token permissions.
