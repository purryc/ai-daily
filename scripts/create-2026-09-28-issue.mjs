import fs from "node:fs/promises";
import path from "node:path";
import { freshTopics } from "./fresh-2026-09-28.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-28";
const previousDate = "2026-09-25";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const deckDir = path.join(surveyRoot, "output", "slidev", "ai-product-morning-brief-" + date);
const previousDeck = path.join(surveyRoot, "output", "slidev", "ai-product-morning-brief-" + previousDate);
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const labels = {
  zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "用户原声", "新技术", "可用性", "限制 / 未知", "产品判断"],
  en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "User voice", "New tech", "Availability", "Limits / unknowns", "Product read"]
};

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error("Missing previous issue " + previousDate);
const issue = JSON.parse(JSON.stringify(previous));
issue.date = date;
issue.zhTitle = "Agent 开始进入默认系统：手机、桌面与现实上下文";
issue.enTitle = "Agents enter the default system: phones, desktops, and real-world context";
issue.zhSummary = "荣耀 Magic9 把 Qwen Intelligence 放进手机系统路径，Qwen Book 与 QwenNote A2 把 OS 和线下语音变成 Agent 上下文，SoundHound OASYS Edge 把端侧部署推进到车与智能设备；Engram 作为降级众筹扫描提醒我们，AI 硬件还要用可重复、可撤销的触觉控制证明自己。";
issue.enSummary = "HONOR Magic9 puts Qwen Intelligence on the phone's system path, Qwen Book and QwenNote A2 connect agents to desktop and offline context, and SoundHound OASYS Edge pushes deployment toward cars and smart devices. Engram remains a downgraded crowdfunding scan: AI hardware still has to prove repeatable, reversible, tactile control.";
issue.tags = [...new Set(["agentic phones", "Qwen Intelligence", "MagicOS 11", "Qwen Book", "QwenNote A2", "OASYS Edge", "edge AI", "crowdfunding", ...(issue.tags || [])])];
issue.sourceTypes = ["official", "developer docs", "reviews", "community", "wild", "research", "patent", "china", "global"];
issue.topics = [...freshTopics, ...issue.topics];
issue.coverStory = {
  topicId: freshTopics[0].id,
  zhTitle: "Agent 不再只是 App：它开始接管手机的默认路径",
  enTitle: "The agent is no longer just an app: it is entering the phone's default path",
  zhSummary: ["Magic9 把 Qwen Intelligence 放到系统级任务执行的位置，Qwen Book 与 QwenNote A2 把文件和线下语音接入同一条 Agent 链。", "今天的产品变化不在于多一个聊天框，而在于 Agent 开始读写手机、桌面和现实对话。", "验收重点转向对象可见、动作可撤销、数据可删除，以及断网和失败时谁仍然掌控任务。"],
  enSummary: ["Magic9 places Qwen Intelligence on a system-level task path, while Qwen Book and QwenNote A2 connect files and offline speech to the same agent chain.", "The product shift is not another chat box; agents are beginning to read and write across phones, desktops, and real conversations.", "The acceptance test moves to visible objects, reversible actions, deletable data, and control during offline or failed execution."],
  imagePath: freshTopics[0].visual.path, imageWidth: 1600, imageHeight: 900,
  imageSourceUrl: freshTopics[0].visual.sourceUrl, primarySourceUrl: freshTopics[0].visual.sourceUrl,
  evidenceStrength: "HONOR official launch · Qwen Intelligence product integration",
  whyCover: "The strongest new product signal moves an agent from a separate app into the phone's default operating path, where permissions and recovery become product requirements."
};
issue.watchlistZh = Array.from(new Set([
  "Magic9 / Qwen Intelligence：跨 App 权限、GUI fallback 审计、任务回滚、支付确认、非中文与弱网成功率。",
  "Qwen Book：零售硬件、文件 diff、第三方应用、离线与企业私有部署、手机审批是否可恢复。",
  "QwenNote A2：录音灯、旁人同意、文本级联删除、组织后台权限、多语言和多人噪声。",
  "OASYS Edge：真实客户硬件、端云切换、模型尺寸、离线准确率、晚 2026 部署与 CES 2027 演示。",
  "Engram：原始 Kickstarter 页、样机音频、接口、延迟、版权、退款和发货条件。",
  ...issue.watchlistZh
])).slice(0, 20);
issue.watchlistEn = Array.from(new Set([
  "Magic9 / Qwen Intelligence: cross-app authority, GUI-fallback audit, rollback, payment approval, non-Chinese and weak-network success.",
  "Qwen Book: retail hardware, file diffs, third-party apps, offline and private deployment, and recoverable phone approval.",
  "QwenNote A2: recording light, bystander consent, cascading text deletion, organisation access, multilingual and noisy-room accuracy.",
  "OASYS Edge: customer hardware, cloud-edge handoff, model size, offline accuracy, late-2026 deployment, and CES 2027 demo.",
  "Engram: original Kickstarter page, prototype audio, I/O, latency, copyright, refunds, and delivery.",
  ...issue.watchlistEn
])).slice(0, 20);
issue.sourcesPath = "./" + date + "/sources.md";
issue.zhPath = "./" + date + "/zh/";
issue.enPath = "./" + date + "/en/";
const index = issues.findIndex((item) => item.date === date);
if (index >= 0) issues[index] = issue; else issues.unshift(issue);
issues.sort((a, b) => b.date.localeCompare(a.date));
await fs.writeFile(dataPath, JSON.stringify(issues, null, 2) + "\n");

await fs.mkdir(path.join(issueDir, "assets"), { recursive: true });
await fs.cp(path.join(root, previousDate, "assets"), path.join(issueDir, "assets"), { recursive: true, force: false, errorOnExist: false });
await fs.rm(deckDir, { recursive: true, force: true });
await fs.cp(previousDeck, deckDir, { recursive: true, filter: (sourcePath) => !sourcePath.includes(path.sep + "dist" + path.sep) && !sourcePath.endsWith(path.sep + "dist") });
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });

const dossierText = (locale, item) => fields.map((field, i) => "**" + labels[locale][i] + "** — " + item.dossier[locale][field]).join("\n\n");
const links = (item) => item.sources.map((s) => "[" + s.label + "](" + s.url + ")").join(" · ");
const slides = [
  "---\ntheme: default\ntitle: AI Daily " + date + "\nlayout: cover\n---\n\n# AI Daily " + date + "\n\n" + issue.coverStory.zhTitle + " / " + issue.coverStory.enTitle + "\n\n<img src=\"./public/" + freshTopics[0].visual.path + "\" style=\"width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px\" />\n\n**" + issue.coverStory.evidenceStrength + "**\n\n" + issue.coverStory.zhSummary.join(" ") + "\n\n" + links(freshTopics[0]),
  "# Issue map\n\n**Cover** — " + issue.coverStory.zhTitle + "\n\n**Today’s additions** — " + freshTopics.map((item) => item.zhHeadline).join("；") + "。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue.",
  ...freshTopics.flatMap((item) => [
    "# " + item.zhHeadline + "\n\n<img src=\"./public/" + item.visual.path + "\" style=\"width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px\" />\n\n**" + item.evidenceLabel + " · " + item.evidenceStrength + " · " + item.sourceDate + "**\n\n" + dossierText("zh", item) + "\n\n**Sources** — " + links(item),
    "# " + item.enHeadline + "\n\n<img src=\"./public/" + item.visual.path + "\" style=\"width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px\" />\n\n**" + item.evidenceLabel + " · " + item.evidenceStrength + " · " + item.sourceDate + "**\n\n" + dossierText("en", item) + "\n\n**Sources** — " + links(item)
  ]),
  "# Watchlist / 继续观察\n\n" + issue.watchlistZh.map((x, i) => (i + 1) + ". " + x).join("\n") + "\n\n" + issue.watchlistEn.map((x, i) => (i + 1) + ". " + x).join("\n"),
  "# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n" + Array.from(new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url)))).slice(0, 180).map((url, i) => (i + 1) + ". " + url).join("\n")
];
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const lanes = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"];
const laneRows = lanes.map((lane) => "| " + lane + " | " + (issue.topics.some((item) => item.section === lane) ? "covered" : "scan required") + " | " + (issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan") + " |").join("\n");
const visualRows = issue.topics.map((item) => "| " + item.id + " | " + item.visual.path + " | " + item.visual.sourceUrl + " | " + item.evidenceLabel + " |").join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), "# AI Daily " + date + " source ledger\n\n## Source index\n\n" + allSources.map((s, i) => (i + 1) + ". " + s.label + " — " + s.url + " — " + (s.type || "source not stated")).join("\n") + "\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n" + laneRows + "\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | ---\n" + visualRows + "\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, pre-launch, crowdfunding, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n");
console.log(JSON.stringify({ date, topics: issue.topics.length, fresh: freshTopics.length, sources: new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url))).size, visuals: new Set([issue.coverStory.imagePath, ...issue.topics.map((item) => item.visual.path)]).size, deckDir }));
