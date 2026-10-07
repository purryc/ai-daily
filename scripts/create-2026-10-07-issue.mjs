import fs from "node:fs/promises";
import path from "node:path";
import { freshTopics } from "./fresh-2026-10-07.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-10-07";
const previousDate = "2026-10-06";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const previousIssueDir = path.join(root, previousDate);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const previousDeck = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`);
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const labels = {
  zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "用户原声", "新技术", "可用性", "限制 / 未知", "产品判断"],
  en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "User voice", "New tech", "Availability", "Limits / unknowns", "Product read"]
};

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`Missing previous issue ${previousDate}`);
const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "Agent 进入团队与设备：今天验收判断、协作和端侧成本";
issue.enTitle = "Agents enter teams and devices: acceptance moves to judgement, collaboration, and edge cost";
issue.zhSummary = "Atlassian AMP 把 Agent 的身份、上下文、权限和审计接入团队工作流；OpenAI Decisions API 把下一步判断拆成可调用的 predicate、choice 与 score；femtoAI 则开放 SPU 与压缩工具，试图把本地语音和传感推向更小设备。Microsoft 的本地 AI 活动尚未开始，Torch It 仍是全球弱信号。";
issue.enSummary = "Atlassian AMP connects agent identity, context, permissions, and audit to team work; OpenAI Decisions API turns next-step judgement into predicates, choices, and scores; femtoAI opens an SPU and compression toolchain for smaller local voice and sensing systems. Microsoft's local-AI event had not started, while Torch It remains a weak global signal.";
issue.tags = [...new Set(["team agents", "Atlassian AMP", "Decisions API", "edge AI silicon", "local AI", "assistive glasses", ...(issue.tags || [])])];
issue.sourceTypes = ["official", "developer docs", "reviews", "community", "startup signal", "wild", "research", "patent", "china", "global"];
issue.topics = [...freshTopics, ...issue.topics.filter((item) => !freshTopics.some((candidate) => candidate.id === item.id))];
issue.coverStory = {
  topicId: freshTopics[0].id,
  zhTitle: "Agent 进入团队：身份、判断与端侧成本成为新产品面",
  enTitle: "Agents enter the team: identity, judgement, and edge cost become product surfaces",
  zhSummary: ["Atlassian AMP 把 Agent 放进共享工作空间，让身份、权限、归属和审计可见。", "OpenAI Decisions API 把判断下一步从自然语言里抽出，成为可约束的系统状态。", "femtoAI 则从芯片、模型和编译器侧压缩端侧成本；今天的预告和弱信号继续保留边界。"],
  enSummary: ["Atlassian AMP puts agents in shared workspaces where identity, authority, ownership, and audit are visible.", "OpenAI Decisions API extracts next-step judgement from prose and makes it a constrained system state.", "femtoAI attacks edge cost from silicon, model, and compiler layers, while today's preview and weak signal keep their evidence boundaries."],
  imagePath: freshTopics[0].visual.path,
  imageWidth: freshTopics[0].visual.width,
  imageHeight: freshTopics[0].visual.height,
  imageSourceUrl: freshTopics[0].visual.sourceUrl,
  primarySourceUrl: freshTopics[0].sources[0].url,
  evidenceStrength: freshTopics[0].evidenceStrength,
  whyCover: "An agent becomes a product when its identity, judgement, authority, and cost are visible where people work."
};
issue.watchlistZh = Array.from(new Set([
  "Atlassian AMP：Agent identity、Jira Agent Sessions、非人身份撤销、跨工具回写和团队通知噪声。",
  "Decisions API：正式文档、缓存、价格、confidence 校准、图像输入、schema 漂移和人工 fallback。",
  "femtoAI SPU：评估套件获取、算子覆盖、10 倍功耗/内存口径、独立测量和量产终端。",
  "Microsoft Windows / Surface 活动：会后官方资料、本地/云端路由、RTX Spark SKU、价格与续航。",
  ...issue.watchlistZh
])).slice(0, 20);
issue.watchlistEn = Array.from(new Set([
  "Atlassian AMP: agent identity, Jira Agent Sessions, non-human revocation, cross-tool write-back, and notification noise.",
  "Decisions API: formal docs, caching, pricing, confidence calibration, image input, schema drift, and human fallback.",
  "femtoAI SPU: evaluation-kit access, operator coverage, 10x power/memory claims, independent measurement, and production devices.",
  "Microsoft Windows / Surface event: post-event official material, local/cloud routing, RTX Spark SKUs, price, and battery.",
  ...issue.watchlistEn
])).slice(0, 20);
issue.sourcesPath = `./${date}/sources.md`;
issue.zhPath = `./${date}/zh/`;
issue.enPath = `./${date}/en/`;
const index = issues.findIndex((item) => item.date === date);
if (index >= 0) issues[index] = issue; else issues.unshift(issue);
issues.sort((a, b) => b.date.localeCompare(a.date));
await fs.writeFile(dataPath, JSON.stringify(issues, null, 2) + "\n");

await fs.mkdir(path.join(issueDir, "assets"), { recursive: true });
await fs.cp(path.join(previousIssueDir, "assets"), path.join(issueDir, "assets"), { recursive: true, force: false, errorOnExist: false });
await fs.rm(deckDir, { recursive: true, force: true });
await fs.cp(previousDeck, deckDir, { recursive: true, filter: (sourcePath) => !sourcePath.includes(path.sep + "dist" + path.sep) && !sourcePath.endsWith(path.sep + "dist") });
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });

const dossierText = (locale, item) => fields.map((field, i) => `**${labels[locale][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="./public/${issue.coverStory.imagePath}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(freshTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${freshTopics.map((item) => item.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue.`,
  ...freshTopics.flatMap((item) => [
    `# ${item.zhHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("zh", item)}\n\n**Sources** — ${links(item)}`,
    `# ${item.enHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("en", item)}\n\n**Sources** — ${links(item)}`
  ]),
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n${issue.watchlistEn.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url)))).slice(0, 240).map((url, i) => `${i + 1}. ${url}`).join("\n")}`
];
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const lanes = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"];
const laneRows = lanes.map((lane) => `| ${lane} | ${issue.topics.some((item) => item.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((item) => `| ${item.id} | ${item.visual.path} | ${item.visual.sourceUrl} | ${item.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, pre-launch, crowdfunding, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n- Design Desk is a product/HCI synthesis layer, not a substitute for source evidence.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, fresh: freshTopics.length, sources: allSources.length, visuals: new Set([issue.coverStory.imagePath, ...issue.topics.map((item) => item.visual.path)]).size, deckDir }));
