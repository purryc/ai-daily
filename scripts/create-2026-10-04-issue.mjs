import fs from "node:fs/promises";
import path from "node:path";
import { freshTopics } from "./fresh-2026-10-04.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-10-04";
const previousDate = "2026-10-01";
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
issue.zhTitle = "当 AI 进入镜片与身体：显示、辅助与端侧连接开始合流";
issue.enTitle = "When AI enters lenses and bodies: displays, assistance, and edge links converge";
issue.zhSummary = "TDK 用 150nm meta-optic mirror 演示把视网膜投影嵌进普通镜片；smartARM 把 Meta AI 眼镜的第一视角上下文接入视觉义肢；Ixana Wi-R 把摄像头留在眼镜、把较重算力移到口袋；Vuzix Shrike 则把任务型 waveguide 显示交给防务客户评估。今天的验收重点是视觉反馈是否私密、身体动作是否可控、端点与断链是否可理解。";
issue.enSummary = "TDK demonstrates a 150nm meta-optic mirror for retinal projection inside an ordinary lens; smartARM adds first-person context from Meta AI glasses to a vision-first prosthesis; Ixana keeps cameras on glasses while moving heavier compute to a pocket; Vuzix gives defense customers a configurable waveguide display to evaluate. Today's acceptance test is private visual feedback, controllable physical action, and legible endpoint and link failure.";
issue.tags = [...new Set(["smart glasses", "retinal projection", "assistive AI", "Ixana Wi-R", "Vuzix Shrike", "edge compute", "physical AI", "wearable HCI", ...(issue.tags || [])])];
issue.sourceTypes = ["official", "developer docs", "reviews", "community", "wild", "research", "patent", "china", "global"];
issue.topics = [...freshTopics, ...issue.topics];
issue.coverStory = {
  topicId: freshTopics[0].id,
  zhTitle: "当 AI 进入镜片与身体：显示、辅助与端侧连接开始合流",
  enTitle: "When AI enters lenses and bodies: displays, assistance, and edge links converge",
  zhSummary: ["TDK 把视网膜投影压进透明镜片，目标是让显示眼镜看起来更像普通眼镜。", "smartARM、Ixana 与 Vuzix 分别从辅助动作、分布式算力和任务显示补齐身体端 AI 的执行链。", "新产品共同把验收标准推向“谁在看、谁在算、谁能停、旁人能否看见”。"],
  enSummary: ["TDK pushes retinal projection into a transparent lens so display glasses can look more ordinary.", "smartARM, Ixana, and Vuzix fill different parts of the body-side AI stack: assistive action, distributed compute, and mission display.", "Together they move acceptance toward who is sensing, where compute runs, who can stop an action, and what bystanders can see."],
  imagePath: freshTopics[0].visual.path, imageWidth: 1600, imageHeight: 900,
  imageSourceUrl: freshTopics[0].visual.sourceUrl, primarySourceUrl: freshTopics[0].visual.sourceUrl,
  evidenceStrength: "TDK official prototype announcement with third-party DRP visual; full-colour and consumer product surface pending",
  whyCover: "Wearable AI is becoming a system of lenses, bodies, and nearby compute; optical privacy and physical control are now product requirements."
};
issue.watchlistZh = Array.from(new Set([
  "TDK meta-optic mirror：全彩演示、眼盒、视场角、激光安全、功耗与量产路径。",
  "smartARM：临床安全、低置信度停机、手动接管、误抓率、Meta 眼镜是否必需。",
  "Ixana Wi-R：端到端延迟、人体差异、断链降级、加密与客户集成证据。",
  "Vuzix Shrike：AUSA 演示、命名客户配置、强光/夜视、任务链路和认证。",
  ...issue.watchlistZh
])).slice(0, 20);
issue.watchlistEn = Array.from(new Set([
  "TDK meta-optic mirror: full-colour demonstration, eyebox, field of view, laser safety, power, and manufacturing path.",
  "smartARM: clinical safety, low-confidence stopping, manual takeover, mis-grip rate, and whether Meta glasses are required.",
  "Ixana Wi-R: end-to-end latency, body variation, link-loss degradation, encryption, and customer integration evidence.",
  "Vuzix Shrike: AUSA demonstration, named customer configurations, sunlight/night vision, mission links, and certification.",
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
