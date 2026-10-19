# October 19 public acceptance candidate

This branch holds only candidate public pages, product illustrations and browser acceptance code. It does not deploy a website. Publication requires successful browser checks and subsequent editorial and visual review.

The workflow runs only on this dedicated branch with `[run-ai-daily-public-qa]` in the push commit message, only in the public `purryc/ai-daily` repository. It uses a standard Ubuntu runner, read-only repository permissions and a ten-minute limit. It installs pinned npm dependencies with lifecycle scripts disabled, uses the runner's Chrome with its sandbox enabled, and fails if the sandbox cannot be verified. It does not change host security settings.

The browser captures the actual DeepSeek Search/Fetch API documentation at `https://api-docs.deepseek.com/guides/search/`. This is documentation, not a tested client or executed API call. These captures occur after the edition cutoff and do not establish the historical page state. Only GET requests to that documentation host are permitted in its browser context.

The candidate is checked locally in the runner: Chinese and English, 28 slides each, at 1600×900 and 1920×1080, with overflow, images, references and navigation checks. There are 56 page screenshots and four documentation screenshots. The candidate homepages are included; older archive editions are outside this branch's scope. No PDF is generated.

Only explicitly named public files are exported, as base64 chunks with SHA-256 digests, in bounded job logs (24 MiB raw maximum). There are no uploaded artifacts, caches, new credentials, scheduled jobs, self-hosted runners or deployment steps. Standard hosted runner execution in a public repository is free under [GitHub's published billing rules](https://docs.github.com/en/billing/concepts/product-billing/github-actions). The workflow makes no billing or plan changes.

`npm run check:static` checks local bytes and structure. `node qa/check.mjs --output /absolute/empty/directory` performs browser checks and saves evidence. A passing machine check still requires pixel and editorial review.
