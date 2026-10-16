# Nonpublishing Actions browser probe

This diagnostic captures only `https://nodejs.org/en/download`, a real public
software download interface on the selected environment's published allowlist.
It never retrieves the refused AI product pages or images.

The independent branch is `cloud/actions-public-browser-check-2026-10-16`.
A push is eligible only for purryc/ai-daily, with both a public visibility payload
and private:false, and an explicit `[run-public-browser-check]` commit marker.
Private or unknown visibility skips the job. No default-branch merge is needed.
Standard Ubuntu public-repository execution is free under GitHub's published
billing policy. This workflow has no artifact upload, cache action, automatic
package-manager cache, custom image, larger runner, paid model, schedule, Pages,
deployment or release step. Its only token permission is contents:read. No custom
secret, credential, proxy, certificate or TLS configuration is read or changed.

The runner's existing Chrome and the project's locked npm dependencies are reused.
Missing Chrome fails without installing a browser. Normal HTTPS validation stays
enabled. Product-context requests are limited to nodejs.org/www.nodejs.org; other
hosts are aborted before network. Refused source hosts stop without retries.
No login, product download, form submission or purchase action is performed.

The isolated runner-temp directory holds one 1440x1080 PNG, one HTML page that is
served locally to verify the saved PNG loads, and a JSON receipt with actual time,
hashes and run/commit identifiers. Original page publication date stays unknown.
An error produces only a sanitized failure receipt. A receipt's successful capture
status still leaves visual review pending until its actual pixels are inspected.

## Bounded log delivery

Only product.png, index.html and receipt.json can enter the log. Extra files,
symlinks, unexpected receipt fields, wrong sources and incorrect hashes fail
before any file bytes are emitted. The complete file set is limited to 2 MiB;
encoded output is limited to 3 MiB with 4096-character chunks. It is printed in
the step **Export bounded public files to log**, between
PUBLIC_BROWSER_BUNDLE_V1_BEGIN and PUBLIC_BROWSER_BUNDLE_V1_END. Failed captures
send only their sanitized receipt. The final step writes a compact run receipt
to the log and job summary. Logs/summary do not use artifact storage allowance.
No private rules, ledger, research directory or environment dump is included.

After the single execution push, open the repository Actions list, filter to this
branch and workflow **Nonpublishing public browser check**, then select the commit
carrying the execution marker (not the older Skipped preparation run).
Open job **capture**, step **Export bounded public files to log**. From that run's
menu choose **Download log archive** and return that ZIP, or return the downloaded
plain-text log for this step. GitHub UI wording may vary; no API token is needed.

The executing agent extracts the step log and restores it outside the checkout:

    node scripts/public-browser-log.mjs decode --input <step-log.txt> --output <isolated-directory>

The decoder rejects missing, duplicate, oversized or corrupted bundles and checks
every file hash before writing anything. View the restored product.png and confirm
receipt/commit/source/time before marking the real probe passed. A summary, URL,
local fixture or green Actions status alone does not complete pixel acceptance.

Local tests use labeled loopback fixtures, never the public target:

    AI_DAILY_CHROMIUM_PATH=/usr/bin/chromium node --test tests/public-browser-check.test.mjs tests/public-browser-log.test.mjs

The previously refused GitHub API and storage paths remain stopped. A successful
Git push requests the workflow but does not prove that the remote runner executed.
