import fs from "node:fs/promises";
import path from "node:path";

const siteRoot = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const previousDate = "2026-06-20";
const date = "2026-06-21";
const slidevDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const previousSlidevDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`);
const issuesPath = path.join(siteRoot, "data", "issues.json");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function words(text) {
  return String(text ?? "").match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g)?.length ?? 0;
}

function denseZh(text) {
  return String(text ?? "").replace(/\s/g, "").length;
}

function slidevMarkdown(issue) {
  const sources = [];
  const seen = new Set();
  for (const topic of issue.topics) {
    for (const source of topic.sources) {
      if (seen.has(source.url)) continue;
      seen.add(source.url);
      sources.push(source);
    }
  }

  return `---
theme: default
title: AI Product Morning Brief ${issue.date}
class: ai-daily
canvasWidth: 1280
aspectRatio: 16/9
transition: fade
---

# AI Daily · ${issue.date}

${issue.zhTitle}

${issue.zhSummary}

![cover](./public/${issue.coverStory.imagePath})

---

# Issue Map

${issue.topics.map((topic) => `- **${topic.section} / ${topic.evidenceLabel}**: ${topic.enHeadline}`).join("\n")}

---

# Cover Story · ${issue.coverStory.enTitle}

![cover](./public/${issue.coverStory.imagePath})

${issue.coverStory.enSummary.join(" ")}

---

# Product Dossiers

${issue.topics
  .filter((topic) => topic.dossierKind === "product")
  .map(
    (topic) => `## ${topic.enHeadline}
${topic.dossier.en.productVerdict} The practical product read is to watch whether the interface closes real loops under user control. A credible AI product should say what it knows, what it is doing, what remains uncertain, and how the user can stop, edit, undo, escalate, or audit the action.`
  )
  .join("\n\n")}

---

# Source Lane Scans

${issue.topics
  .filter((topic) => topic.dossierKind === "scan")
  .map((topic) => `## ${topic.section}\n${topic.dossier.en.productVerdict}`)
  .join("\n\n")}

---

# Sources

${sources.map((source) => `- ${source.label}: ${source.url}`).join("\n")}
`;
}

function sourcesMarkdown(issue) {
  return `# AI Daily Source Ledger

Date: ${issue.date}
Timezone: ${issue.timezone}

This Slidev ledger mirrors the public AI Daily source ledger. The final public truth surface is generated in /Users/hmi/Documents/ai-daily.

## Source Lanes

${["official", "reviews", "community", "wild", "research", "patent", "china", "global"]
  .map((section) => `- ${section}: ${issue.topics.some((topic) => topic.section === section) ? "covered" : "missing"}`)
  .join("\n")}

## Visual Assets

${issue.topics.map((topic) => `- ${topic.visual.path}: ${topic.visual.captionEn} (${topic.visual.sourceUrl})`).join("\n")}

## Sources

${issue.topics
  .flatMap((topic) => topic.sources.map((source) => `- ${topic.id}: ${source.label} (${source.type ?? "source"}) ${source.url}`))
  .join("\n")}
`;
}

async function copyDir(from, to) {
  await fs.rm(to, { recursive: true, force: true });
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });
  for (const entry of entries) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) {
      await copyDir(source, target);
    } else if (entry.isFile()) {
      await fs.copyFile(source, target);
    }
  }
}

async function main() {
  const issues = JSON.parse(await fs.readFile(issuesPath, "utf8"));
  const previous = issues.find((issue) => issue.date === previousDate);
  if (!previous) throw new Error(`Missing source issue ${previousDate}`);

  const issue = clone(previous);
  issue.date = date;
  issue.zhTitle = "周日版：AI 入口继续向眼镜、开发者工具、消息 agent 与可授权软件层聚合";
  issue.enTitle = "Sunday issue: AI entry points keep moving into glasses, developer stacks, messaging agents, and authorized software layers";
  issue.zhSummary = "今天的产品面继续集中在可佩戴显示、XR 开发者栈、商家消息 agent、可授权浏览器/电脑操作与野生眼镜市场。强信号不是模型参数，而是用户如何触发、授权、撤销、接管和审计 AI 动作。";
  issue.enSummary = "Today's product surface remains concentrated in wearable displays, XR developer stacks, business messaging agents, authorized browser/computer operation, and the wild glasses market. The strong signal is not model size; it is how users trigger, authorize, undo, take over, and audit AI actions.";
  issue.zhPath = `/ai-daily/${date}/zh/`;
  issue.enPath = `/ai-daily/${date}/en/`;
  issue.sourcesPath = `/ai-daily/${date}/sources.md`;
  issue.coverStory.zhTitle = "Snap Specs 仍是周日版封面：AI 眼镜要证明自己能关闭日常任务环";
  issue.coverStory.enTitle = "Snap Specs remains the Sunday cover: AI glasses must prove they can close daily task loops";
  issue.coverStory.zhSummary = [
    "周日 source sweep 没有把未经证实的新硬件传闻提升为产品事实；封面保留最强的确认产品与开发者 surface。",
    "Snap Specs 的意义是把 AR display、相机、语音、空间输入和 Lens developer surface 放进同一个 wearable loop。",
    "今天的判断标准是用户控制权：能否看见系统在做什么、能否撤销、能否在人类接管时保持上下文。"
  ];
  issue.coverStory.enSummary = [
    "The Sunday source sweep did not promote unverified hardware rumors into product fact; the cover keeps the strongest confirmed product and developer surface.",
    "The meaning of Snap Specs is that AR display, camera, voice, spatial input, and the Lens developer surface sit inside one wearable loop.",
    "Today's evaluation standard is user control: whether the system shows what it is doing, allows undo, and preserves context when a human takes over."
  ];

  for (const topic of issue.topics) {
    topic.sourceDate = `accessed ${date}`;
  }

  issue.watchlistZh = [
    "Snap Specs / Android XR / XREAL：继续看独立评测是否给出全天佩戴、电池、亮度、热量、隐私提示与开发者 app 供给的证据。",
    "OpenAI Agents / computer use：继续看浏览器动作授权、失败恢复、审计日志、human takeover 和区域可用性是否进入更稳定的产品文档。",
    "Meta Business AI Agent：继续看商家如何配置知识、handoff、退款责任和跨 WhatsApp / Messenger 的交易边界。",
    "中国 AI 眼镜：如果 36Kr、少数派、厂商页或众筹页出现明确规格、价格、发货区域和第三方长测，再从 scan 升级为 dossier。",
    "研究/专利：只在交互机制与产品 surface 发生交叉验证时升权，单独论文或专利继续标为 speculative signal。"
  ];
  issue.watchlistEn = [
    "Snap Specs / Android XR / XREAL: watch for independent evidence on all-day wear, battery, brightness, heat, privacy cues, and developer app supply.",
    "OpenAI Agents / computer use: watch whether browser-action authorization, failure recovery, audit logs, human takeover, and regional availability stabilize in product docs.",
    "Meta Business AI Agent: watch how businesses configure knowledge, handoff, refund responsibility, and transaction boundaries across WhatsApp and Messenger.",
    "China AI glasses: promote the lane from scan to dossier only when 36Kr, SSPAI, vendor pages, or crowdfunding pages show clear specs, pricing, shipping regions, and third-party long tests.",
    "Research / patents: raise weight only when interaction mechanism and product surface are cross-validated; standalone papers or patents remain speculative signals."
  ];

  const existingIndex = issues.findIndex((item) => item.date === date);
  if (existingIndex >= 0) issues.splice(existingIndex, 1, issue);
  else issues.push(issue);
  issues.sort((a, b) => a.date.localeCompare(b.date));
  await fs.writeFile(issuesPath, `${JSON.stringify(issues, null, 2)}\n`);

  await fs.rm(slidevDir, { recursive: true, force: true });
  await fs.mkdir(path.join(slidevDir, "public"), { recursive: true });
  await copyDir(path.join(previousSlidevDir, "public", "assets"), path.join(slidevDir, "public", "assets"));
  await fs.copyFile(path.join(previousSlidevDir, "package.json"), path.join(slidevDir, "package.json"));
  await fs.writeFile(path.join(slidevDir, "slides.md"), slidevMarkdown(issue));
  await fs.writeFile(path.join(slidevDir, "sources.md"), sourcesMarkdown(issue));

  const zhCount = issue.topics.reduce((sum, topic) => sum + denseZh(Object.values(topic.dossier.zh).join("")), 0);
  const enCount = issue.topics.reduce((sum, topic) => sum + words(Object.values(topic.dossier.en).join(" ")), 0);
  console.log(`Created ${date}: ${issue.topics.length} topics, zh ${zhCount}, en ${enCount}`);
}

await main();
