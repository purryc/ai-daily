import path from "node:path";
import {
  allIssueTopics,
  allTopicVisuals,
  allTopicMedia,
} from "./topic-content.mjs";
export const MAX_PAGES = 50;
export const SOURCE_LANES = [
  "official",
  "reviews",
  "community",
  "wild",
  "research",
  "patent",
  "china",
  "global",
];
export function validateIllustratedIssue(issue) {
  for (const topic of allIssueTopics(issue))
    if (!allTopicVisuals(topic).length)
      throw new Error(`Verified factual visual required for featured story ${topic.id}; obtain evidence imagery or withhold the story, never invent it`);
  return true;
}
const labels = new Set([
  "confirmed product",
  "developer surface",
  "review/community friction",
  "startup signal",
  "crowdfunding signal",
  "research signal",
  "patent signal",
  "weak/unverified",
]);
const DAY = 86400000;
const text = (v) => typeof v === "string" && v.trim().length > 0;
const normalized = (v) =>
  String(v ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
const semanticKey = (value) =>
  normalized(String(value ?? "").replace(/20\d{2}[-/]\d{2}[-/]\d{2}/g, ""));
const version = (v) =>
  normalized(v)
    .replace(/^v\s*/, "")
    .replace(/(?:[ .]0)+$/, "");
const kind = (v) =>
  ["launch", "released", "release", "announcement"].includes(normalized(v))
    ? "release"
    : normalized(v);
export function normalizeUrl(value) {
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol))
    throw new Error("source URL must be HTTP(S)");
  url.hash = "";
  url.hostname = url.hostname.replace(/^www\./, "").toLowerCase();
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  for (const key of [...url.searchParams.keys()])
    if (/^(utm_|fbclid$|gclid$|mc_|ref$|ref_src$)/i.test(key))
      url.searchParams.delete(key);
  url.searchParams.sort();
  return url.toString().replace(/\/$/, "");
}
function instant(value) {
  if (
    !text(value) ||
    !/^\d{4}-\d{2}-\d{2}(?:T.*(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)
  )
    return NaN;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return NaN;
  if (
    value.length === 10 &&
    new Date(parsed).toISOString().slice(0, 10) !== value
  )
    return NaN;
  return parsed;
}
function sameEvent(a, b) {
  if (!a.event || !b.event) return a.id === b.id;
  if (
    normalized(a.event.productKey) !== normalized(b.event.productKey) ||
    kind(a.event.kind) !== kind(b.event.kind)
  )
    return false;
  if (a.event.version || b.event.version)
    return (
      version(a.event.version) === version(b.event.version) &&
      semanticKey(a.event.key) === semanticKey(b.event.key)
    );
  const tokens = (e) =>
    new Set(
      normalized(String(e.key ?? "").replace(/20\d{2}[-/]\d{2}[-/]\d{2}/g, ""))
        .split(" ")
        .filter(
          (t) => !["of", "the", "a", "an", "for", "to", "new"].includes(t),
        ),
    );
  const aa = tokens(a.event),
    bb = tokens(b.event),
    union = new Set([...aa, ...bb]);
  return (
    union.size > 0 &&
    [...aa].filter((t) => bb.has(t)).length / union.size >= 0.8
  );
}
function eligibleDate(source, topic) {
  const explicit =
    source.isPrimary === true &&
    source.dateEvidence?.kind === "effective-date" &&
    text(source.dateEvidence.quote) &&
    source.dateEvidence.date === topic.event.occurredAt;
  return explicit ? source.dateEvidence.date : source.publishedAt;
}
function eligibleSource(source, topic, cutoff, lookbackDays = 3) {
  const date = instant(eligibleDate(source, topic));
  const verified = instant(source.verifiedAt);
  const end = instant(cutoff);
  return (
    Number.isFinite(date) &&
    Number.isFinite(verified) &&
    date <= end &&
    date >= end - lookbackDays * DAY &&
    verified <= end &&
    verified >= date
  );
}
function freshEvidence(topic, cutoff, lookbackDays = 3) {
  const end = instant(cutoff),
    occurred = instant(topic.event?.occurredAt);
  return (
    Number.isFinite(end) &&
    Number.isFinite(occurred) &&
    occurred <= end &&
    occurred >= end - lookbackDays * DAY &&
    Boolean(eventEvidenceSource(topic, cutoff, lookbackDays))
  );
}
function validSourceChronology(topic, cutoff) {
  const end = instant(cutoff);
  return (topic.sources ?? []).every((source) => {
    const verified = instant(source.verifiedAt);
    if (!Number.isFinite(verified) || verified > end) return false;
    if (source.publishedAt !== undefined && source.publishedAt !== null) {
      const published = instant(source.publishedAt);
      if (
        !Number.isFinite(published) ||
        published > end ||
        verified < published
      )
        return false;
    }
    return true;
  });
}
function eventEvidenceSource(topic, cutoff, lookbackDays = 3) {
  const candidates = (topic.sources ?? []).filter(
    (source) =>
      eligibleSource(source, topic, cutoff, lookbackDays) &&
      eligibleDate(source, topic).slice(0, 10) ===
        topic.event.occurredAt.slice(0, 10),
  );
  if (topic.eventSourceUrl)
    return candidates.find(
      (source) =>
        normalizeUrl(source.url) === normalizeUrl(topic.eventSourceUrl),
    );
  return (
    candidates.find((source) => source.isPrimary === true) ?? candidates[0]
  );
}
function uniqueSources(sources) {
  const map = new Map();
  for (const source of sources) {
    const key = normalizeUrl(source.url);
    const existing = map.get(key);
    if (
      !existing ||
      instant(source.publishedAt ?? source.dateEvidence?.date) >
        instant(existing.publishedAt ?? existing.dateEvidence?.date) ||
      (!Number.isFinite(
        instant(existing.publishedAt ?? existing.dateEvidence?.date),
      ) &&
        Number.isFinite(
          instant(source.publishedAt ?? source.dateEvidence?.date),
        ))
    )
      map.set(key, { ...source, url: key });
  }
  return [...map.values()];
}
export function selectEvents(
  candidates,
  archive,
  { date, cutoff, lookbackDays = 3 },
) {
  const topics = [],
    excluded = [];
  const history = archive
    .filter((i) => i.date < date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .flatMap((i) =>
      [...allIssueTopics(i),...(i.coveredTopics??[])].map((topic) => ({ topic, date: i.date })),
    );
  for (const input of candidates) {
    const topic = structuredClone(input);
    if (!text(topic.event?.deltaZh) || !text(topic.event?.deltaEn)) {
      excluded.push({ id: topic.id, reason: "missing-substantive-delta" });
      continue;
    }
    if (!validSourceChronology(topic, cutoff)) {
      excluded.push({ id: topic.id, reason: "invalid-source-chronology" });
      continue;
    }
    const priorEvent = history.find((item) => sameEvent(item.topic, topic));
    if (priorEvent) {
      excluded.push({
        id: topic.id,
        reason: "already-covered",
        previousIssue: priorEvent.date,
      });
      continue;
    }
    if (
      topic.eventSourceUrl &&
      !eventEvidenceSource(topic, cutoff, lookbackDays)
    ) {
      excluded.push({ id: topic.id, reason: "unverified-event-source" });
      continue;
    }
    if (!freshEvidence(topic, cutoff, lookbackDays)) {
      excluded.push({ id: topic.id, reason: "unverified-recency" });
      continue;
    }
    topic.sources = uniqueSources(topic.sources ?? []);
    const duplicate = topics.find((t) => sameEvent(t, topic));
    if (duplicate) {
      duplicate.sources = uniqueSources([
        ...duplicate.sources,
        ...topic.sources,
      ]);
      excluded.push({
        id: topic.id,
        reason: "duplicate-in-issue",
        canonicalId: duplicate.id,
      });
      continue;
    }
    const urls = new Set(topic.sources.map((s) => s.url));
    const legacyUrls = new Set(
      history
        .filter((i) => !i.topic.event)
        .flatMap((i) =>
          (i.topic.sources ?? []).map((s) => normalizeUrl(s.url)),
        ),
    );
    const evidence = eventEvidenceSource(topic, cutoff, lookbackDays);
    const newDatedEvidence = evidence && !legacyUrls.has(evidence.url);
    if (evidence) topic.eventSourceUrl = evidence.url;
    const sameProductHistory = history.filter(
      (item) =>
        item.topic.event &&
        normalized(item.topic.event.productKey) ===
          normalized(topic.event.productKey),
    );
    const sourceIdentity = (source) =>
      `${normalizeUrl(source.url)}|${instant(source.publishedAt ?? source.dateEvidence?.date)}`;
    const knownEvidence = new Set(
      sameProductHistory.flatMap((item) =>
        (item.topic.sources ?? []).map(sourceIdentity),
      ),
    );
    const datedSources = topic.sources.filter((source) =>
      Number.isFinite(instant(source.publishedAt ?? source.dateEvidence?.date)),
    );
    const reusedEvidence =
      sameProductHistory.length > 0 &&
      datedSources.length > 0 &&
      datedSources.every((source) => knownEvidence.has(sourceIdentity(source)));
    const oldEvent = history.find(
      (i) =>
        sameEvent(i.topic, topic) ||
        (!newDatedEvidence &&
          !i.topic.event &&
          i.topic.sources?.some((s) => urls.has(normalizeUrl(s.url)))),
    );
    if (oldEvent || reusedEvidence) {
      excluded.push({
        id: topic.id,
        reason: "already-covered",
        previousIssue: (oldEvent ?? sameProductHistory[0]).date,
      });
      continue;
    }
    const previous = history.find(
      (i) =>
        i.topic.event &&
        normalized(i.topic.event.productKey) ===
          normalized(topic.event?.productKey),
    );
    if (previous) {
      topic.event.previousIssue = previous.date;
      if(previous.topic.publicationCommit)topic.event.previousPublicationCommit=previous.topic.publicationCommit;
    }
    topics.push(topic);
  }
  return { topics, excluded };
}
export function selectContextEvents(candidates, archive, options) {
  for (const topic of candidates)
    if (topic.coverageKind !== "first-inclusion-context")
      throw new Error(
        "context must be explicitly separate first-inclusion context",
      );
  const result = selectEvents(candidates, archive, {
    ...options,
    lookbackDays: Infinity,
  });
  for (const topic of result.topics) {
    topic.isNewToday = false;
    topic.firstIncludedOn = options.date;
  }
  return result;
}
export function validateIssue(issue, archive = []) {
  const requireText = (v, n) => {
    if (!text(v)) throw new Error(`missing ${n}`);
  };
  if (issue.editorialVersion !== 2)
    throw new Error("editorialVersion must be 2");
  if (!Number.isFinite(instant(issue.date)) || issue.date.length !== 10)
    throw new Error("invalid issue date");
  if (!Number.isFinite(instant(issue.cutoff)) || issue.cutoff.length <= 10)
    throw new Error("cutoff must be an explicit timestamp with timezone");
  requireText(issue.timezone, "timezone");
  if (
    issue.lookbackDays !== undefined &&
    (!Number.isInteger(issue.lookbackDays) ||
      issue.lookbackDays < 1 ||
      issue.lookbackDays > 3)
  )
    throw new Error("lookbackDays must be between 1 and 3");
  try {
    new Intl.DateTimeFormat("en", { timeZone: issue.timezone }).format();
  } catch {
    throw new Error("invalid issue timezone");
  }
  const cutoffParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: issue.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(issue.cutoff));
  const part = (type) => cutoffParts.find((item) => item.type === type).value;
  if (`${part("year")}-${part("month")}-${part("day")}` !== issue.date)
    throw new Error("issue date differs from the local editorial cutoff date");
  for (const name of ["zhTitle", "enTitle", "zhSummary", "enSummary"])
    requireText(issue[name], name);
  if (!Array.isArray(issue.topics)) throw new Error("topics must be an array");
  const topicIds = new Set();
  for (const topic of allIssueTopics(issue)) {
    const isContext = (issue.contextTopics ?? []).includes(topic);
    if (isContext && topic.coverageKind !== "first-inclusion-context")
      throw new Error("context must be explicitly separate");
    if (!isContext && topic.coverageKind === "first-inclusion-context")
      throw new Error("context must remain separate from new advances");
    const windowDays = isContext ? Infinity : issue.lookbackDays;
    if (topicIds.has(topic.id))
      throw new Error(`duplicate topic id: ${topic.id}`);
    topicIds.add(topic.id);
    requireText(topic.id, "topic id");
    if (!SOURCE_LANES.includes(topic.section))
      throw new Error(`invalid source lane ${topic.section}`);
    if (!labels.has(topic.evidenceLabel))
      throw new Error(`invalid evidenceLabel ${topic.id}`);
    for (const field of [
      "productKey",
      "kind",
      "occurredAt",
      "summaryZh",
      "summaryEn",
      "deltaZh",
      "deltaEn",
    ])
      requireText(topic.event?.[field], `event.${field}`);
    if (!text(topic.event.version) && !text(topic.event.key))
      throw new Error("event needs version or stable key");
    for (const field of ["zhHeadline", "enHeadline"])
      requireText(topic[field], field);
    for (const locale of ["zh", "en"])
      for (const field of ["what", "change", "use", "limits"])
        requireText(topic.brief?.[locale]?.[field], `brief.${locale}.${field}`);
    if (!validSourceChronology(topic, issue.cutoff))
      throw new Error(`invalid source chronology: ${topic.id}`);
    if (
      topic.eventSourceUrl &&
      !eventEvidenceSource(topic, issue.cutoff, windowDays)
    )
      throw new Error(`unverified event source: ${topic.id}`);
    if (!freshEvidence(topic, issue.cutoff, windowDays))
      throw new Error(`unverified recency: ${topic.id}`);
    if (!topic.sources?.length) throw new Error(`missing sources: ${topic.id}`);
    for (const source of topic.sources) {
      normalizeUrl(source.url);
      requireText(source.label, "source label");
    }
    const pointTexts = new Set();
    const knownSources = new Set(
      topic.sources.map((source) => normalizeUrl(source.url)),
    );
    const detailIds = new Set();
    for (const page of topic.detailPages ?? []) {
      requireText(page.id, "detail id");
      if (detailIds.has(page.id)) throw new Error("duplicate detail id");
      detailIds.add(page.id);
      requireText(page.zhTitle, "detail zhTitle");
      requireText(page.enTitle, "detail enTitle");
      if (!page.points?.length) throw new Error("detail needs sourced points");
      for (const point of page.points) {
        for (const locale of ["zh", "en"]) {
          requireText(point[locale], `detail ${locale} point`);
          const key = locale + normalized(point[locale]);
          if (pointTexts.has(key)) throw new Error("duplicate detail point");
          pointTexts.add(key);
        }
        if (
          !point.sourceUrls?.length ||
          point.sourceUrls.some((url) => !knownSources.has(normalizeUrl(url)))
        )
          throw new Error("detail point has missing retained source");
      }
    }
    for (const media of allTopicMedia(topic)) {
      if (!["video", "gif", "official-link"].includes(media.kind))
        throw new Error("invalid media kind");
      normalizeUrl(media.url);
      normalizeUrl(media.sourceUrl);
      if (!media.poster)
        throw new Error("media needs a verified static poster");
      for (const field of [
        "captionZh",
        "captionEn",
        "whatToSeeZh",
        "whatToSeeEn",
      ])
        requireText(media[field], `media ${field}`);
      if (
        !Number.isFinite(instant(media.verifiedAt)) ||
        instant(media.verifiedAt) > instant(issue.cutoff)
      )
        throw new Error("invalid media verification time");
    }
    const visuals = allTopicVisuals(topic);
    if (visuals.length) {
      for (const visual of visuals) {
        if (topic.visuals) {
          for (const field of ["captionZh", "captionEn"])
            requireText(visual[field], `visual.${field}`);
          requireText(visual.role, "visual.role");
        }
        if (!visual.kind?.includes("source-backed"))
          throw new Error("visual must be source-backed");
        if (!/^assets\/[^/]+\.(png|jpe?g|webp|avif)$/i.test(visual.path))
          throw new Error("visual must be a local factual image");
        normalizeUrl(visual.sourceUrl);
        for (const field of ["altZh", "altEn"])
          requireText(visual[field], `visual.${field}`);
        if (!Number.isFinite(instant(visual.capturedAt)))
          throw new Error("missing visual capturedAt");
        if (instant(visual.capturedAt) > instant(issue.cutoff))
          throw new Error("visual capture exceeds editorial cutoff");
      }
    } else
      for (const locale of ["zh", "en"])
        requireText(topic.visualMissing?.[locale], `visualMissing.${locale}`);
  }
  const selected = selectEvents(issue.topics, archive, issue);
  if (selected.excluded.length)
    throw new Error(
      `issue contains duplicate or invalid events: ${JSON.stringify(selected.excluded)}`,
    );
  const contextSelection = selectContextEvents(
    issue.contextTopics ?? [],
    archive,
    issue,
  );
  if (contextSelection.excluded.length)
    throw new Error(
      `context contains duplicate or invalid events: ${JSON.stringify(contextSelection.excluded)}`,
    );
  const combined = selectEvents(allIssueTopics(issue), archive, {
    ...issue,
    lookbackDays: Infinity,
  });
  if (combined.excluded.length)
    throw new Error(
      `duplicate event across fresh and context sections: ${JSON.stringify(combined.excluded)}`,
    );
  return issue;
}
export function validatePageCount(count) {
  if (!Number.isInteger(count) || count < 1)
    throw new Error("invalid page count");
  if (count > MAX_PAGES)
    throw new Error(`issue exceeds ${MAX_PAGES} printed pages: ${count}`);
}
export function assertCloudOutput(output, root) {
  const dest = path.resolve(output),
    checkout = path.resolve(root);
  if (
    /^\/Users\//.test(dest) ||
    (dest !== checkout && !dest.startsWith(checkout + path.sep))
  )
    throw new Error("output must remain inside the cloud checkout");
  return dest;
}
export function selectIssueDates(issues, requested) {
  const available = [...new Set(issues.map((i) => i.date))].sort().reverse();
  const dates = requested
    ? [
        ...new Set(
          requested
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
        ),
      ]
    : available.slice(0, 1);
  if (!dates.length) throw new Error("no issue dates selected");
  for (const date of dates)
    if (!available.includes(date))
      throw new Error(`unknown issue date: ${date}`);
  return dates;
}
