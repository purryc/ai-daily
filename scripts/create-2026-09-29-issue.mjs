import fs from "node:fs/promises";
import path from "node:path";
import { freshTopics } from "./fresh-2026-09-29.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-29";
const previousDate = "2026-09-28";
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
issue.zhTitle = "AI 进入边缘、房间与开发者运行时：今天的产品边界在哪里";
issue.enTitle = "AI moves into edge hardware, rooms, and developer runtimes: where is the boundary?";
issue.zhSummary = "Advantech ASR-D501 把感知、定位与任务推理压进无人机边缘计算；Sonos 27 用 Beam Ultra 与 Ace Ultra 让声音在房间和耳边接力；OpenAI DevDay 只确认 API 与工具入口，现场新品保持扫描。今天的共同问题是：当 AI 获得更多物理或系统权限，用户能否看见状态、撤销动作并在失败时接管。";
issue.enSummary = "Advantech's ASR-D501 moves perception, localisation, and mission reasoning onto drone edge hardware; Sonos 27 uses Beam Ultra and Ace Ultra to hand sound between room and person; OpenAI DevDay confirms the API and tools surface while its live product list remains a scan. The shared question is whether users can see state, undo actions, and take over when AI gains more physical or system authority.";
issue.tags = [...new Set(["edge AI", "autonomous UAV", "Sonos 27", "agentic audio", "OpenAI DevDay", "developer surface", ...(issue.tags || [])])];
issue.sourceTypes = ["official", "developer docs", "reviews", "community", "wild", "research", "patent", "china", "global"];
issue.topics = [...freshTopics, ...issue.topics];
issue.coverStory = {
  topicId: freshTopics[0].id,
  zhTitle: "边缘 AI 不再是模型演示：它开始接管飞行、房间与系统运行时",
  enTitle: "Edge AI is no longer a model demo: it is entering flight, rooms, and runtimes",
  zhSummary: ["ASR-D501 把无人机的感知与任务推理放到机载边缘计算层，飞控仍保留实时稳定与执行器控制。", "Sonos 27 把家庭音频和个人耳机连成可切换的系统，开发者平台则把长任务 Agent 的 sandbox、tools 与上下文管理产品化。", "三条路线的验收共同指向状态可见、权限可审计、失败可恢复，而不是只看 TOPS、音质或 keynote。"],
  enSummary: ["ASR-D501 puts drone perception and mission reasoning on airborne edge compute while leaving real-time stabilisation and actuators to the flight controller.", "Sonos 27 connects home audio and personal headphones into a handoff system, while developer platforms productise sandboxes, tools, and context management for long-running agents.", "All three routes share an acceptance test: visible state, auditable authority, and recoverable failure, not just TOPS, sound quality, or keynote language."],
  imagePath: freshTopics[0].visual.path, imageWidth: 1600, imageHeight: 900,
  imageSourceUrl: freshTopics[0].visual.sourceUrl, primarySourceUrl: freshTopics[0].visual.sourceUrl,
  evidenceStrength: "Advantech official launch · edge AI infrastructure for autonomous UAVs",
  whyCover: "The clearest new product boundary is where AI inference meets physical authority: a drone can perceive locally, but the system must still show who controls motion and how failure is recovered."
};
issue.watchlistZh = Array.from(new Set([
  "ASR-D501：真实机型、模型/框架、功耗与续航、GNSS-denied 成功率、飞控接管、认证和客户部署。",
  "Sonos 27：27voice / 27mcp 权限、跨房间目标反馈、多人账号、离线能力、Ace Ultra Early Access 退出时间。",
  "OpenAI DevDay：官方 release notes、API/SDK 版本、sandbox 清理、成本、权限、回滚和 keynote 后新增产品。",
  ...issue.watchlistZh
])).slice(0, 20);
issue.watchlistEn = Array.from(new Set([
  "ASR-D501: real airframes, models/frameworks, power and endurance, GNSS-denied success, flight-control takeover, certification, customers.",
  "Sonos 27: 27voice/27mcp authority, cross-room target feedback, multi-account, offline behaviour, and Ace Ultra Early Access exit.",
  "OpenAI DevDay: official release notes, API/SDK versions, sandbox cleanup, cost, authority, rollback, and post-keynote products.",
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
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url)))).slice(0, 180).map((url, i) => `${i + 1}. ${url}`).join("\n")}`
];
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const lanes = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"];
const laneRows = lanes.map((lane) => `| ${lane} | ${issue.topics.some((item) => item.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((item) => `| ${item.id} | ${item.visual.path} | ${item.visual.sourceUrl} | ${item.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, pre-launch, crowdfunding, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, fresh: freshTopics.length, sources: new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url))).size, visuals: new Set([issue.coverStory.imagePath, ...issue.topics.map((item) => item.visual.path)]).size, deckDir }));
