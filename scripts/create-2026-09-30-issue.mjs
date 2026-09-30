import fs from "node:fs/promises";
import path from "node:path";
import { freshTopics } from "./fresh-2026-09-30.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-30";
const previousDate = "2026-09-29";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
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
issue.zhTitle = "Agent 开始长期运行：今天的产品把权限、记忆与执行放在哪里？";
issue.enTitle = "Agents start running for longer: where do products put authority, memory, and execution?";
issue.zhSummary = "OpenAI Dots 把 Agent 从一次性聊天推向持续工作对象；NVIDIA Open Agent Safety Platform 把权限边界放到模型之外；MongoDB Atlas Agent Engine 把执行、记忆、检索与治理合成生产栈；Microsoft Copilot 则把工作入口、构建和主动执行拆开。今天的验收重点是后台状态可见、权限可审计、失败可恢复。";
issue.enSummary = "OpenAI Dots turns an agent from a one-shot chat into a persistent work object; NVIDIA moves authority outside the model; MongoDB packages execution, memory, retrieval, and governance for production; Microsoft splits work into entry, build, and proactive execution. Today's acceptance test is visible background state, auditable authority, and recoverable failure.";
issue.tags = [...new Set(["persistent agents", "OpenAI Dots", "agent safety", "OpenShell", "Atlas Agent Engine", "Microsoft Copilot", "authority", "memory", ...(issue.tags || [])])];
issue.sourceTypes = ["official", "developer docs", "reviews", "community", "wild", "research", "patent", "china", "global"];
issue.topics = [...freshTopics, ...issue.topics];
issue.coverStory = {
  topicId: freshTopics[0].id,
  zhTitle: "Agent 开始长期运行：权限、记忆与执行被重新分层",
  enTitle: "Agents start running for longer: authority, memory, and execution are being split apart",
  zhSummary: ["OpenAI Dots 把目标交给持续运行的个人 Agent，用户不必一直守在聊天窗口。", "NVIDIA、MongoDB 和 Microsoft 分别在运行时安全、生产数据层和办公工作面上补齐 Agent 的执行基础。", "新产品共同把验收标准从“回答得像不像”推到“做了什么、凭什么做、出错如何停”。"],
  enSummary: ["OpenAI Dots lets a persistent personal agent keep working after the user leaves the chat window.", "NVIDIA, MongoDB, and Microsoft fill in the execution foundation across runtime security, production data, and work surfaces.", "Together they move acceptance from whether an answer sounds right to what happened, why it was authorised, and how it stops when wrong."],
  imagePath: freshTopics[0].visual.path, imageWidth: 1600, imageHeight: 900,
  imageSourceUrl: freshTopics[0].visual.sourceUrl, primarySourceUrl: freshTopics[0].visual.sourceUrl,
  evidenceStrength: "OpenAI Dots · product reporting and developer-community evidence; official product surface pending",
  whyCover: "Long-running agents make authority, memory, and recovery visible product requirements rather than backend concerns."
};
issue.watchlistZh = Array.from(new Set([
  "OpenAI Dots：官方产品页、套餐/价格、云端权限、后台通知、记忆删除、停止与审计。",
  "NVIDIA OpenShell / Sentry：非 NVIDIA 平台等价性、真实策略案例、自动批准、误报与隔离评测。",
  "MongoDB Atlas Agent Engine：正式 API、模型/框架矩阵、数据驻留、记忆删除、成本与客户实测。",
  "Microsoft Autopilot：触发机制、运行频率、Office 变更历史、代码隔离、企业管理员控制。",
  ...issue.watchlistZh
])).slice(0, 20);
issue.watchlistEn = Array.from(new Set([
  "OpenAI Dots: official product page, plans/pricing, cloud authority, background notices, memory deletion, stop, and audit.",
  "NVIDIA OpenShell / Sentry: non-NVIDIA equivalence, real policy cases, auto-approval, false positives, and quarantine tests.",
  "MongoDB Atlas Agent Engine: formal API, model/framework matrix, data residency, memory deletion, cost, and customer evidence.",
  "Microsoft Autopilot: triggers, run frequency, Office history, code isolation, and enterprise-admin controls.",
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
await fs.cp(path.join(root, previousDate, "assets"), path.join(issueDir, "assets"), { recursive: true, force: false, errorOnExist: false });
await fs.rm(deckDir, { recursive: true, force: true });
await fs.cp(previousDeck, deckDir, { recursive: true, filter: (sourcePath) => !sourcePath.includes(path.sep + "dist" + path.sep) && !sourcePath.endsWith(path.sep + "dist") });
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });

const dossierText = (locale, item) => fields.map((field, i) => `**${labels[locale][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="./public/${freshTopics[0].visual.path}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(freshTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${freshTopics.map((item) => item.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue.`,
  ...freshTopics.flatMap((item) => [
    `# ${item.zhHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("zh", item)}\n\n**Sources** — ${links(item)}`,
    `# ${item.enHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("en", item)}\n\n**Sources** — ${links(item)}`
  ]),
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n${issue.watchlistEn.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url)))).slice(0, 200).map((url, i) => `${i + 1}. ${url}`).join("\n")}`
];
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const lanes = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"];
const laneRows = lanes.map((lane) => `| ${lane} | ${issue.topics.some((item) => item.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((item) => `| ${item.id} | ${item.visual.path} | ${item.visual.sourceUrl} | ${item.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, pre-launch, crowdfunding, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, fresh: freshTopics.length, sources: new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url))).size, visuals: new Set([issue.coverStory.imagePath, ...issue.topics.map((item) => item.visual.path)]).size, deckDir }));
