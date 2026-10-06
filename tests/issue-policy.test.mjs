import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeUrl,
  selectEvents,
  validateIssue,
  validatePageCount,
  assertCloudOutput,
  selectIssueDates,
} from "../scripts/lib/issue-policy.mjs";

const cutoff = "2026-10-06T12:00:00-04:00";
const candidate = (overrides = {}) => ({
  id: "acme-launch-2",
  section: "official",
  dossierKind: "product",
  evidenceLabel: "confirmed product",
  zhHeadline: "Acme 2 发布",
  enHeadline: "Acme 2 launches",
  event: {
    productKey: "acme",
    kind: "release",
    version: "2",
    occurredAt: "2026-10-05",
    summaryZh: "新版本增加离线语音",
    summaryEn: "Adds offline voice",
    deltaZh: "新增离线语音",
    deltaEn: "New offline voice",
  },
  sources: [
    {
      label: "Release notes",
      url: "https://acme.example/releases/2",
      publishedAt: "2026-10-05",
      verifiedAt: cutoff,
      isPrimary: true,
    },
  ],
  brief: {
    zh: {
      what: "语音助手",
      change: "新增离线模式",
      use: "断网时语音输入",
      limits: "续航未公布",
    },
    en: {
      what: "Voice assistant",
      change: "New offline mode",
      use: "Voice input offline",
      limits: "Battery life not stated",
    },
  },
  visual: {
    path: "assets/acme.png",
    kind: "source-backed official screenshot",
    sourceUrl: "https://acme.example/releases/2",
    altZh: "官方界面截图",
    altEn: "Official UI screenshot",
    capturedAt: cutoff,
  },
  ...overrides,
});
const options = { date: "2026-10-06", cutoff };
const issue = (topics = []) => ({
  ...options,
  editorialVersion: 2,
  timezone: "America/Toronto",
  zhTitle: "日报",
  enTitle: "Daily",
  zhSummary: "已核实更新",
  enSummary: "Verified updates",
  topics,
  laneScans: [],
});

test("normalizes tracking, fragments, query order and trailing slash", () => {
  assert.equal(
    normalizeUrl(
      "https://www.acme.example/releases/2/?utm_source=x&b=2&a=1#top",
    ),
    "https://acme.example/releases/2?a=1&b=2",
  );
});
test("deduplicates exact IDs and merges all unique evidence sources", () => {
  const a = candidate(),
    b = candidate({
      sources: [
        ...a.sources,
        { ...a.sources[0], url: "https://acme.example/blog/launch" },
      ],
    });
  const result = selectEvents([a, b], [], options);
  assert.equal(result.topics.length, 1);
  assert.equal(result.topics[0].sources.length, 2);
  assert.equal(result.excluded[0].reason, "duplicate-in-issue");
});
test("deduplicates equivalent event names even when article IDs differ", () => {
  const a = candidate(),
    b = candidate({
      id: "translated-title",
      event: {
        ...a.event,
        productKey: "ACME",
        kind: "Launch",
        version: "v2.0",
      },
    });
  assert.equal(selectEvents([a, b], [], options).topics.length, 1);
});
test("deduplicates near-equivalent unversioned events conservatively", () => {
  const a = candidate();
  delete a.event.version;
  a.event.key = "offline voice rollout";
  const b = candidate({
    id: "another",
    event: { ...a.event, key: "rollout of offline voice" },
  });
  assert.equal(selectEvents([a, b], [], options).topics.length, 1);
});
test("does not reprint yesterday's unchanged event with a new ID/date", () => {
  const a = candidate();
  const prior = { date: "2026-10-05", topics: [a] };
  const result = selectEvents(
    [
      candidate({
        id: "today",
        event: { ...a.event, occurredAt: "2026-10-06" },
      }),
    ],
    [prior],
    options,
  );
  assert.equal(result.topics.length, 0);
  assert.equal(result.excluded[0].reason, "already-covered");
});
test("legacy archive source URLs suppress repeats without modifying history", () => {
  const archive = [
    {
      date: "2026-10-05",
      topics: [
        {
          id: "old",
          sources: [
            { url: "https://acme.example/releases/2?utm_campaign=old" },
          ],
        },
      ],
    },
  ];
  const before = JSON.stringify(archive);
  assert.equal(selectEvents([candidate()], archive, options).topics.length, 0);
  assert.equal(JSON.stringify(archive), before);
});
test("allows a substantive new release of the same product and links prior issue", () => {
  const old = candidate();
  old.event.version = "1";
  old.sources[0].url = "https://acme.example/releases/1";
  const result = selectEvents(
    [candidate()],
    [{ date: "2026-10-05", topics: [old] }],
    options,
  );
  assert.equal(result.topics.length, 1);
  assert.equal(result.topics[0].event.previousIssue, "2026-10-05");
});
test("rejects same product follow-up without a bilingual delta", () => {
  const old = candidate();
  old.event.version = "1";
  const next = candidate();
  next.event.deltaEn = "";
  assert.equal(
    selectEvents([next], [{ date: "2026-10-04", topics: [old] }], options)
      .excluded[0].reason,
    "missing-substantive-delta",
  );
});
test("does not promote undated product pages or invented follow-up dates", () => {
  const a = candidate();
  a.sources[0].publishedAt = null;
  assert.equal(
    selectEvents([a], [], options).excluded[0].reason,
    "unverified-recency",
  );
});
test("does not promote sources or events after the editorial cutoff", () => {
  const a = candidate();
  a.event.occurredAt = "2026-10-07";
  assert.equal(selectEvents([a], [], options).topics.length, 0);
});
test("does not call old background the latest advance", () => {
  const a = candidate();
  a.event.occurredAt = "2026-09-03";
  a.sources[0].publishedAt = "2026-09-03";
  assert.equal(selectEvents([a], [], options).topics.length, 0);
});
test("no-news days validate without source, length or lane quotas", () => {
  assert.doesNotThrow(() => validateIssue(issue()));
});
test("concise bilingual brief validates without minimum word counts", () => {
  assert.doesNotThrow(() => validateIssue(issue([candidate()])));
});
test("rejects missing locale information units", () => {
  const a = candidate();
  delete a.brief.en.change;
  assert.throws(() => validateIssue(issue([a])), /brief.en.change/);
});
test("missing imagery must be explicitly explained in both languages", () => {
  const a = candidate();
  delete a.visual;
  assert.throws(() => validateIssue(issue([a])), /visualMissing/);
  a.visualMissing = {
    zh: "来源没有可核实截图",
    en: "No verifiable image in source",
  };
  assert.doesNotThrow(() => validateIssue(issue([a])));
});
test("visual provenance must be source-backed, never an invented product render", () => {
  const a = candidate();
  a.visual.kind = "generated product render";
  assert.throws(() => validateIssue(issue([a])), /source-backed/);
});
test("validates a hard 50-page ceiling and actual nonempty page count", () => {
  assert.doesNotThrow(() => validatePageCount(50));
  assert.throws(() => validatePageCount(51), /50/);
  assert.throws(() => validatePageCount(0), /page count/);
});
test("forbids Mac paths and outputs outside the cloud checkout", () => {
  assert.throws(
    () => assertCloudOutput("/Users/hmi/Documents/Survey", "/workspace/repo"),
    /cloud checkout/,
  );
  assert.throws(
    () => assertCloudOutput("/workspace/repo-other", "/workspace/repo"),
    /cloud checkout/,
  );
  assert.doesNotThrow(() =>
    assertCloudOutput("/workspace/repo/2026-10-06/assets", "/workspace/repo"),
  );
});
test("renderer and PDF default to latest issue; explicit dates preserve archive", () => {
  const issues = [{ date: "2026-10-05" }, { date: "2026-10-06" }];
  assert.deepEqual(selectIssueDates(issues), ["2026-10-06"]);
  assert.deepEqual(selectIssueDates(issues, "2026-10-05"), ["2026-10-05"]);
  assert.throws(() => selectIssueDates(issues, "2026-10-09"), /unknown issue/);
});

test("accepts multiple factual images with source, caption and role", () => {
  const a = candidate();
  a.visuals = [
    {
      ...a.visual,
      role: "product",
      captionZh: "产品外观",
      captionEn: "Product exterior",
    },
    {
      ...a.visual,
      path: "assets/ui.png",
      role: "interface",
      captionZh: "界面",
      captionEn: "Interface",
    },
  ];
  delete a.visual;
  assert.doesNotThrow(() => validateIssue(issue([a])));
  a.visuals[1].sourceUrl = "javascript:alert(1)";
  assert.throws(() => validateIssue(issue([a])), /HTTP/);
});
test("detects exact copied event content across changed IDs and tracking URLs", () => {
  const a = candidate();
  const b = candidate({
    id: "changed-id",
    sources: [{ ...a.sources[0], url: a.sources[0].url + "?utm_source=new" }],
  });
  assert.equal(
    selectEvents([b], [{ date: "2026-10-05", topics: [a] }], options).topics
      .length,
    0,
  );
});
test("accepts a new review event with a new dated URL despite shared product reference", () => {
  const a = candidate();
  const b = candidate({
    id: "review",
    event: {
      ...a.event,
      kind: "review",
      key: "battery endurance review",
      version: undefined,
    },
    sources: [
      ...a.sources,
      { ...a.sources[0], url: "https://review.example/acme-test" },
    ],
  });
  b.eventSourceUrl = "https://review.example/acme-test";
  const archive = [
    {
      date: "2026-10-05",
      topics: [{ id: "legacy", sources: [{ url: a.sources[0].url }] }],
    },
  ];
  assert.equal(selectEvents([b], archive, options).topics.length, 1);
});
test("rejects duplicate DOM topic IDs even for distinct events", () => {
  const a = candidate(),
    b = candidate();
  b.event.version = "3";
  b.sources[0].url = "https://acme.example/releases/3";
  assert.throws(() => validateIssue(issue([a, b])), /duplicate topic id/);
});
test("requires an explicit timezone and bounds the recency window", () => {
  assert.throws(
    () => validateIssue({ ...issue(), timezone: undefined }),
    /timezone/,
  );
  assert.throws(
    () => validateIssue({ ...issue(), lookbackDays: 999 }),
    /lookback/,
  );
});
test("rejects figures missing captions and informational roles", () => {
  const a = candidate();
  a.visuals = [{ ...a.visual }];
  delete a.visual;
  assert.throws(() => validateIssue(issue([a])), /caption/);
  a.visuals[0].captionZh = "官方界面";
  a.visuals[0].captionEn = "Official interface";
  assert.throws(() => validateIssue(issue([a])), /role/);
});
test("accepts an explicit primary effective date with unknown publication date", () => {
  const a = candidate();
  a.event.occurredAt = "2026-10-06";
  a.sources[0].publishedAt = null;
  a.sources[0].dateEvidence = {
    kind: "effective-date",
    date: "2026-10-06",
    quote: "Starting October 6, cloud execution is available.",
  };
  assert.equal(selectEvents([a], [], options).topics.length, 1);
});
test("does not infer an absolute source date from an updated-this-week label", () => {
  const a = candidate();
  a.sources[0].publishedAt = null;
  a.sources[0].dateEvidence = {
    kind: "relative-update",
    date: "2026-10-06",
    quote: "Updated this week",
  };
  assert.equal(selectEvents([a], [], options).topics.length, 0);
});
test("issue date matches the editorial cutoff in its declared timezone", () => {
  assert.throws(
    () => validateIssue({ ...issue(), date: "2026-10-07" }),
    /cutoff date/,
  );
});
test("visual capture after the editorial cutoff is rejected", () => {
  const a = candidate();
  a.visual.capturedAt = "2026-10-07T00:00:00Z";
  assert.throws(() => validateIssue(issue([a])), /capture.*cutoff/);
});
test("date-stamped event keys cannot disguise yesterday’s same evidence", () => {
  const a = candidate();
  delete a.event.version;
  a.event.key = "offline voice rollout 2026-10-05";
  const b = candidate({
    id: "new-date-label",
    event: {
      ...a.event,
      key: "offline voice rollout 2026-10-06",
      occurredAt: "2026-10-06",
    },
  });
  assert.equal(
    selectEvents([b], [{ date: "2026-10-05", topics: [a] }], options).topics
      .length,
    0,
  );
});
test("new version on a stable changelog URL needs genuinely new dated evidence", () => {
  const old = candidate();
  old.event.version = "1";
  const next = candidate();
  assert.equal(
    selectEvents([next], [{ date: "2026-10-05", topics: [old] }], options)
      .topics.length,
    0,
  );
  next.sources[0].publishedAt = "2026-10-06";
  next.event.occurredAt = "2026-10-06";
  assert.equal(
    selectEvents([next], [{ date: "2026-10-05", topics: [old] }], options)
      .topics.length,
    1,
  );
});
test("distinct platform rollout key on the same version remains reportable", () => {
  const old = candidate();
  old.event.key = "base-release";
  const next = candidate({
    id: "android-rollout",
    event: {
      ...old.event,
      key: "android-availability",
      occurredAt: "2026-10-06",
    },
    sources: [
      {
        ...old.sources[0],
        url: "https://acme.example/android",
        publishedAt: "2026-10-06",
      },
    ],
  });
  assert.equal(
    selectEvents([next], [{ date: "2026-10-05", topics: [old] }], options)
      .topics.length,
    1,
  );
});
test("legacy release cannot become new through a dated secondary recap", () => {
  const a = candidate({
    sources: [
      { ...candidate().sources[0], url: "https://acme.example/release" },
      {
        ...candidate().sources[0],
        url: "https://news.example/repeated-release",
        publishedAt: "2026-10-06",
        isPrimary: false,
      },
    ],
  });
  const prior = [
    {
      date: "2026-10-05",
      topics: [
        { id: "old", sources: [{ url: "https://acme.example/release" }] },
      ],
    },
  ];
  assert.equal(selectEvents([a], prior, options).topics.length, 0);
});
test("new changelog date survives an earlier record of the same URL", () => {
  const old = candidate();
  old.event.version = "1";
  old.sources[0].url = "https://acme.example/changelog";
  const next = candidate({
    event: { ...old.event, version: "2", occurredAt: "2026-10-06" },
    sources: [old.sources[0], { ...old.sources[0], publishedAt: "2026-10-06" }],
  });
  const result = selectEvents(
    [next],
    [{ date: "2026-10-05", topics: [old] }],
    options,
  );
  assert.equal(result.topics.length, 1);
  assert.equal(result.topics[0].sources[0].publishedAt, "2026-10-06");
});
test("a valid second source does not launder a future first source", () => {
  const a = candidate();
  a.sources.unshift({
    ...a.sources[0],
    url: "https://acme.example/future",
    publishedAt: "2026-10-07",
  });
  assert.equal(
    selectEvents([a], [], options).excluded[0].reason,
    "invalid-source-chronology",
  );
  assert.throws(() => validateIssue(issue([a])), /source.*chronology/);
});
test("verification-before-publication is rejected for every retained source", () => {
  const a = candidate();
  a.sources.unshift({
    ...a.sources[0],
    url: "https://acme.example/early",
    verifiedAt: "2026-10-04T00:00:00Z",
  });
  assert.equal(
    selectEvents([a], [], options).excluded[0].reason,
    "invalid-source-chronology",
  );
});
test("eventSourceUrl must identify the actual retained dated event evidence", () => {
  const a = candidate();
  a.eventSourceUrl = "https://acme.example/not-a-source";
  assert.throws(() => validateIssue(issue([a])), /event source/);
  assert.equal(selectEvents([a], [], options).topics.length, 0);
});
test("a newer supporting article cannot date a different primary event", () => {
  const a = candidate();
  a.event.occurredAt = "2026-10-06";
  a.eventSourceUrl = a.sources[0].url;
  a.sources.push({
    ...a.sources[0],
    url: "https://news.example/recap",
    publishedAt: "2026-10-06",
    isPrimary: false,
  });
  assert.equal(selectEvents([a], [], options).topics.length, 0);
});
test("versioned date-stamped keys cannot revive a known event with a recap URL", () => {
  const old = candidate();
  old.event.key = "offline voice rollout 2026-10-05";
  const next = candidate({
    id: "recap",
    event: {
      ...old.event,
      key: "offline voice rollout 2026-10-06",
      occurredAt: "2026-10-06",
    },
    sources: [
      {
        ...old.sources[0],
        url: "https://acme.example/recap",
        publishedAt: "2026-10-06",
      },
    ],
  });
  assert.equal(
    selectEvents([next], [{ date: "2026-10-05", topics: [old] }], options)
      .topics.length,
    0,
  );
});
test("relative nonprimary date proof cannot become selected event evidence", () => {
  const a = candidate();
  a.eventSourceUrl = "https://acme.example/undated";
  a.sources.unshift({
    label: "Undated background",
    url: a.eventSourceUrl,
    publishedAt: null,
    verifiedAt: cutoff,
    isPrimary: false,
    dateEvidence: {
      kind: "relative-update",
      date: "2026-10-05",
      quote: "Updated this week",
    },
  });
  assert.equal(selectEvents([a], [], options).topics.length, 0);
});
test("equivalent publication instants do not constitute fresh changelog evidence", () => {
  const old = candidate();
  old.event.version = "1";
  const next = candidate();
  next.sources[0].publishedAt = "2026-10-05T00:00:00Z";
  assert.equal(
    selectEvents([next], [{ date: "2026-10-05", topics: [old] }], options)
      .topics.length,
    0,
  );
});
test("older first-inclusion context is separate, dated and still deduplicated", () => {
  const a = candidate();
  a.coverageKind = "first-inclusion-context";
  a.event.occurredAt = "2026-10-01";
  a.sources[0].publishedAt = "2026-10-01";
  assert.doesNotThrow(() => validateIssue({ ...issue(), contextTopics: [a] }));
  assert.throws(
    () =>
      validateIssue({ ...issue(), contextTopics: [a] }, [
        { date: "2026-10-05", topics: [a] },
      ]),
    /duplicate/,
  );
  assert.throws(() => validateIssue(issue([a])), /context.*separate/);
});
test("detail points must be bilingual, sourced and not duplicated", () => {
  const a = candidate();
  a.detailPages = [
    {
      id: "how",
      zhTitle: "机制",
      enTitle: "Mechanism",
      points: [
        {
          zh: "细节说明",
          en: "A specific mechanism",
          sourceUrls: [a.sources[0].url],
        },
      ],
    },
  ];
  assert.doesNotThrow(() => validateIssue(issue([a])));
  a.detailPages[0].points[0].sourceUrls = ["https://missing.example/"];
  assert.throws(() => validateIssue(issue([a])), /detail.*source/);
});
test("media requires a factual verified poster and bilingual captions", () => {
  const a = candidate();
  a.media = [
    {
      kind: "gif",
      url: "https://acme.example/demo.gif",
      sourceUrl: a.sources[0].url,
      poster: a.visual,
      captionZh: "演示",
      captionEn: "Demo",
      whatToSeeZh: "观察切换",
      whatToSeeEn: "Observe transitions",
      verifiedAt: cutoff,
    },
  ];
  assert.doesNotThrow(() => validateIssue(issue([a])));
  delete a.media[0].poster;
  assert.throws(() => validateIssue(issue([a])), /poster/);
});
