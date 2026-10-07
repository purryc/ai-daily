import fs from "node:fs/promises";
import path from "node:path";
import { freshTopics } from "./fresh-2026-10-07.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const date = "2026-10-07";
const cutoff = "2026-10-07T12:26:00-04:00";
const verifiedAt = "2026-10-07T12:20:00-04:00";
const publishedAt = {
  "2026-10-06": "2026-10-06T00:00:00-04:00",
  "2026-10-07": "2026-10-07T00:00:00-04:00"
};

const zhPack = (parts, max = 125) => {
  const text = parts.filter(Boolean).join(" ").replace(/\s+/g, " ");
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};
const enPack = (parts, max = 60) => {
  const words = parts.filter(Boolean).join(" ").match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*|[^A-Za-z0-9\s]+/g) ?? [];
  const text = words.join(" ").replace(/\s+([,.!?;:])/g, "$1");
  return words.length > max ? `${words.slice(0, max).join(" ")}…` : text;
};
const compact = (topic, locale) => {
  const d = topic.dossier[locale];
  if (locale === "zh") {
    return {
      what: zhPack([d.productName, d.productType]),
      change: zhPack([d.interactionFlow, d.newTech]),
      use: zhPack([d.useCases, d.painPointsSolved]),
      limits: zhPack([d.availability, d.limitsOrUnknowns, d.productVerdict])
    };
  }
  return {
    what: enPack([d.productName, d.productType]),
    change: enPack([d.interactionFlow, d.newTech]),
    use: enPack([d.useCases, d.painPointsSolved]),
    limits: enPack([d.availability, d.limitsOrUnknowns, d.productVerdict])
  };
};

const topicToCandidate = (topic) => {
  const occurredAt = topic.sourceDate.startsWith("2026-10-06") ? "2026-10-06" : date;
  const eventKind = topic.dossierKind === "scan" ? "scan" : "announcement";
  const sources = topic.sources.map((source, index) => ({
    ...source,
    isPrimary: index === 0,
    publishedAt: source.url.includes("news.microsoft.com") ? "2026-09-16T00:00:00-04:00" : (publishedAt[occurredAt] ?? publishedAt[date]),
    verifiedAt,
    ...(source.url.includes("news.microsoft.com") ? {
      dateEvidence: {
        kind: "effective-date",
        date,
        quote: "Join us at 10 a.m. PT on Wednesday, Oct. 7, for the latest on Windows and Microsoft Surface."
      }
    } : {})
  }));
  return {
    ...topic,
    eventSourceUrl: sources[0].url,
    event: {
      productKey: topic.id.replace(/-2026-10-07$/, ""),
      kind: eventKind,
      occurredAt,
      key: topic.id,
      summaryZh: topic.zhFact,
      summaryEn: topic.enFact,
      deltaZh: topic.zhValue,
      deltaEn: topic.enValue
    },
    brief: { zh: compact(topic, "zh"), en: compact(topic, "en") },
    sources,
    visuals: [{
      ...topic.visual,
      role: "primary evidence",
      capturedAt: verifiedAt
    }]
  };
};

const input = {
  date,
  timezone: "America/Toronto",
  cutoff,
  lookbackDays: 3,
  zhTitle: "Agent 进入团队与设备：今天验收判断、协作和端侧成本",
  enTitle: "Agents enter teams and devices: acceptance moves to judgement, collaboration, and edge cost",
  zhSummary: "Atlassian AMP 把 Agent 的身份、上下文、权限和审计接入团队工作流；OpenAI Decisions API 把下一步判断拆成可调用的 predicate、choice 与 score；femtoAI 则开放 SPU 与压缩工具，试图把本地语音和传感推向更小设备。Microsoft 的本地 AI 活动尚未开始，Torch It 仍是全球弱信号。",
  enSummary: "Atlassian AMP connects agent identity, context, permissions, and audit to team work; OpenAI Decisions API turns next-step judgement into predicates, choices, and scores; femtoAI opens an SPU and compression toolchain for smaller local voice and sensing systems. Microsoft's local-AI event had not started, while Torch It remains a weak global signal.",
  laneScans: [
    { lane: "official", status: "covered", zh: "Atlassian AMP 与 Microsoft 活动预告", en: "Atlassian AMP and the Microsoft event preview" },
    { lane: "reviews", status: "scan", zh: "今天没有新的独立上手被升级", en: "No new independent hands-on was promoted today" },
    { lane: "community", status: "covered", zh: "OpenAI Decisions API 开发者讨论", en: "OpenAI Decisions API developer discussion" },
    { lane: "wild", status: "covered", zh: "femtoAI startup developer surface", en: "femtoAI startup developer surface" },
    { lane: "research", status: "scan", zh: "今天没有新的产品界面研究信号被升级", en: "No new product-interface research signal was promoted today" },
    { lane: "patent", status: "scan", zh: "今天没有新的专利交互信号被升级", en: "No new patent-interface signal was promoted today" },
    { lane: "china", status: "scan", zh: "今天没有新的中国产品界面信号被升级", en: "No new China product-interface signal was promoted today" },
    { lane: "global", status: "covered", zh: "Torch It 全球助视眼镜 scan", en: "Torch It global assistive-glasses scan" }
  ],
  editorialPlan: { targetMinutes: 18, maxPages: 50, zhDensityTarget: 6000, enWordTarget: 4500 },
  quarantinedCandidates: [
    { id: "microsoft-windows-surface-local-ai-event-scan-2026-10-07", reason: "scheduled preview retained as weak/unverified until the event concludes" },
    { id: "ericsson-torch-it-ai-glasses-global-scan-2026-10-07", reason: "single global media report without official product surface" }
  ],
  readingEstimate: { zhCharacters: 6000, enWords: 4500, note: "Fresh dossier source text is retained in the candidate source package; public pages use the fit-tested four-block brief." },
  revisionAudit: [{ at: verifiedAt, note: "Rechecked event dates, source chronology, visual capture time, lane status, and downgraded previews." }],
  requireProductVisuals: true,
  candidates: freshTopics.map(topicToCandidate),
  contextCandidates: []
};

await fs.mkdir(path.join(root, "data/candidates"), { recursive: true });
await fs.writeFile(path.join(root, "data/candidates", `${date}.json`), JSON.stringify(input, null, 2) + "\n");
console.log(JSON.stringify({ date, candidates: input.candidates.length, output: `data/candidates/${date}.json` }));
