import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const issueDate = "2026-07-04";
const assetDir = path.join(root, "assets");
const lanes = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"];

function source(label, url) {
  return { label, url };
}

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function diagramSvg(title, subtitle, rows) {
  const colors = ["#9f1239", "#0f766e", "#1d4ed8", "#7c2d12", "#4338ca", "#166534"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
  <rect width="1200" height="760" fill="#fffdfa"/>
  <rect x="42" y="42" width="1116" height="676" rx="30" fill="#ffffff" stroke="#e8e3dc" stroke-width="2"/>
  <text x="82" y="112" font-family="Aptos, Arial, sans-serif" font-size="42" font-weight="900" fill="#171413">${esc(title)}</text>
  <text x="84" y="154" font-family="Aptos, Arial, sans-serif" font-size="21" font-weight="700" fill="#6f6a66">${esc(subtitle)}</text>
  <g transform="translate(84 202)">
    ${rows
      .map((row, index) => {
        const y = index * 78;
        const color = colors[index % colors.length];
        return `<g transform="translate(0 ${y})">
          <rect x="0" y="0" width="1032" height="58" rx="17" fill="#f8f5ef" stroke="#e7ded2"/>
          <circle cx="32" cy="29" r="13" fill="${color}"/>
          <text x="62" y="24" font-family="Aptos, Arial, sans-serif" font-size="22" font-weight="850" fill="#171413">${esc(row[0])}</text>
          <text x="62" y="47" font-family="Aptos, Arial, sans-serif" font-size="16" font-weight="650" fill="#6f6a66">${esc(row[1])}</text>
        </g>`;
      })
      .join("")}
  </g>
  <text x="84" y="686" font-family="Aptos, Arial, sans-serif" font-size="17" font-weight="700" fill="#8c837a">AI Daily source-based diagram · not a product render · facts stay in the source ledger</text>
</svg>`;
}

function visual(name, title, subtitle, rows, sourceUrl) {
  return {
    path: `assets/${name}.svg`,
    width: 1200,
    height: 760,
    altZh: `自绘证据图：${title}`,
    altEn: `Self-drawn evidence diagram: ${title}`,
    captionZh: "自绘机制图：依据来源页面整理，非产品渲染；完整来源见 source ledger。",
    captionEn: "Self-drawn mechanism diagram based on cited sources; not a product render. Full source ledger included.",
    sourceUrl,
    svg: diagramSvg(title, subtitle, rows)
  };
}

function productDossierZh(item) {
  return {
    productName: item.name,
    productType: `${item.name} 是${item.type}。本期只采用来源明确披露的产品面：${item.stack}。价格、地区、版本、硬件规格或 API 细节凡未出现在来源中，均写作 source not stated。它进入本期的原因是用户真实触碰到的入口发生变化：${item.entry}。`,
    interactionFlow: `用户流程是：${item.flow}。这个流程的 HCI 重点不在“多一个 AI 按钮”，而在系统如何把上下文、权限、执行状态和结果回写到用户正在工作的地方。若任务失败，产品需要把失败原因、可重试路径、人工接管或撤销动作留在同一个界面。`,
    specsOrStack: `来源支持的系统栈包括：${item.stack}。${item.specs}。未披露的模型路由、企业审计字段、完整权限矩阵、数据保存周期、区域上线、价格稳定性和 SLA 为 source not stated。本期不从营销页推断任何未写明的性能数字。`,
    useCases: `具体使用场景包括：${item.useCases}。这些场景都要求产品把 agent 的工作拆成可检查的中间状态，而不是只给一个最后答案。对用户来说，关键体验是少切换、少解释、少复制粘贴，同时保留审计、改写、暂停和重做的控制。`,
    painPointsSolved: `它解决的痛点是：${item.pain}。过去用户往往要在聊天框、文档、终端、浏览器、数据库和团队沟通工具之间来回搬运上下文；现在产品试图把上下文拉到一个工作台或协作入口里。但这也提高了错误成本，因为 agent 拿到的权限越多，越需要清楚说明它能读什么、能写什么、是否会调用外部系统。`,
    userVoice: `${item.voice}。这部分按 ${item.evidenceLabel} 处理，不能当作全量用户满意度。没有直接用户 quote 的地方写 source not stated；媒体或社区摩擦只用于风险判断。`,
    newTech: `新技术/新界面在于：${item.newTech}。它把 AI 从单轮回答推向“可追踪工作流”：有计划、有工具、有可复现 artifact、有状态反馈，也有权限边界。产品团队需要把这些技术能力翻译成用户看得懂的状态，而不是把复杂度塞进后台。`,
    availability: `可用性：${item.availability}。若来源没有明确说明国家、计划层级、下载入口、管理员开关、硬件平台或 beta 资格，本期不补猜。对读者的实际建议是先看官方入口和管理员配置要求，再看是否有独立评测或社区故障反馈。`,
    limitsOrUnknowns: `限制和未知：${item.limits}。此外，跨工具 agent 的共性风险包括权限过宽、错误执行、上下文污染、结果不可复现、审计不足和用户不知道系统何时在行动。本期把这些风险放进产品判断，而非作为抽象趋势评论。`,
    productVerdict: `产品判断：${item.verdict}。它值得关注的标准不是发布声量，而是是否让用户用更少步骤完成具体任务，同时让权限、状态、证据和撤销保持可见。若后续来源无法证明真实工作流稳定，它应继续降级为 watch signal。`
  };
}

function productDossierEn(item) {
  return {
    productName: item.name,
    productType: `${item.name} is ${item.typeEn}. This dossier only uses product surfaces explicitly supported by the cited sources: ${item.stackEn}. Prices, regions, versions, hardware specifications, API details, or performance numbers that do not appear in those sources remain source not stated. The reason it enters today's issue is an interface change users can actually touch: ${item.entryEn}.`,
    interactionFlow: `The user flow is: ${item.flowEn}. The HCI question is not whether the product adds another AI button. It is whether the system can keep context, permission, execution state, and returned output inside the place where the user is already working. If the task fails, the same interface needs to show why it failed, how to retry, when to hand off to a person, and how to undo or fork the work.`,
    specsOrStack: `The source-backed stack includes: ${item.stackEn}. ${item.specsEn}. Model routing, full enterprise audit fields, exact permission matrix, data retention, regional availability, price stability, and SLA are source not stated unless a cited source names them directly. This issue does not infer performance numbers from marketing language.`,
    useCases: `Concrete use cases include: ${item.useCasesEn}. These are not abstract productivity claims; they require the product to expose intermediate agent state instead of returning only a final answer. The user benefit is fewer switches, less context re-entry, less copy-paste, and more direct return into the active workflow while retaining audit, editing, pause, and redo controls.`,
    painPointsSolved: `The pain point is: ${item.painEn}. Users previously had to move context across chat, documents, terminals, browsers, databases, and team channels. This product tries to bring context into a workbench or collaboration surface. That also raises the cost of mistakes because the more authority an agent receives, the more clearly it must explain what it can read, what it can write, and whether it will call external systems.`,
    userVoice: `${item.voiceEn}. This is treated as ${item.evidenceLabel}, not as a complete satisfaction study. When there is no direct user quote, this issue says source not stated. Media and community friction are used only as risk signals unless corroborated by official or hands-on sources.`,
    newTech: `The new interface or technical idea is: ${item.newTechEn}. AI moves from single-turn response into traceable workflow: planning, tools, reproducible artifacts, state feedback, and permission boundaries. Product teams have to translate those technical capabilities into states users can understand, rather than hiding complexity in the backend.`,
    availability: `Availability: ${item.availabilityEn}. If the sources do not specify country, plan tier, download path, administrator switch, hardware platform, or beta qualification, this issue does not guess. The practical reading is to check the official entry point and admin requirements first, then look for independent reviews or community failure reports.`,
    limitsOrUnknowns: `Limits and unknowns: ${item.limitsEn}. Cross-tool agents share recurring risks: broad permissions, erroneous execution, context pollution, irreproducible outputs, insufficient audit, and users not knowing when the system is acting. Those risks are part of the product read, not generic trend commentary.`,
    productVerdict: `Product verdict: ${item.verdictEn}. The standard is not launch volume. The standard is whether users complete a concrete job in fewer steps while permission, state, evidence, and undo remain visible. If later sources do not prove stable real-world workflow, this should stay downgraded as a watch signal.`
  };
}

function scanDossierZh(item) {
  return {
    productName: item.name,
    productType: `${item.name} 是 source-lane scan，不是确认单品发布。扫描对象：${item.scanned}。本期把它标成 ${item.evidenceLabel}，因为证据更多来自媒体、社区、论文、专利或行业页面。`,
    interactionFlow: `可观察的交互信号是：${item.flow}。没有足够来源支持的产品流程不做推断；缺失的规格、价格、地区、用户 quote 和上线日期均为 source not stated。`,
    specsOrStack: `来源支持的材料包括：${item.stack}。这只能说明方向或摩擦存在，不能证明完整产品体验已经成熟。`,
    useCases: `可能影响的使用场景：${item.useCases}。这些场景需要继续观察是否有官方文档、真实评测、社区反馈或可购买入口支撑。`,
    painPointsSolved: `扫描到的痛点：${item.pain}。本期关注的是用户界面、权限、反馈和工作流的实际阻力，而不是公司叙事。`,
    userVoice: `${item.voice}。`,
    newTech: `新技术/新信号：${item.newTech}。`,
    availability: `可用性：${item.availability}。`,
    limitsOrUnknowns: `限制和未知：${item.limits}。`,
    productVerdict: `产品判断：${item.verdict}。`
  };
}

function scanDossierEn(item) {
  return {
    productName: item.name,
    productType: `${item.name} is a source-lane scan, not a confirmed single-product launch. The scan covers: ${item.scannedEn}. It is labeled ${item.evidenceLabel} because the evidence comes mostly from media, community, research, patent, or industry pages.`,
    interactionFlow: `The observable interaction signal is: ${item.flowEn}. Product flows that are not source-backed are not inferred. Missing specifications, prices, regions, user quotes, and launch dates remain source not stated.`,
    specsOrStack: `The source-backed material includes: ${item.stackEn}. This can show direction or friction, but it does not prove the full product experience is mature.`,
    useCases: `Potentially affected use cases: ${item.useCasesEn}. These need further official docs, hands-on reviews, community reports, or purchasable entry points before they can be upgraded.`,
    painPointsSolved: `The scanned pain point is: ${item.painEn}. This issue focuses on interface, permission, feedback, and workflow resistance rather than company narrative.`,
    userVoice: `${item.voiceEn}.`,
    newTech: `New technical or product signal: ${item.newTechEn}.`,
    availability: `Availability: ${item.availabilityEn}.`,
    limitsOrUnknowns: `Limits and unknowns: ${item.limitsEn}.`,
    productVerdict: `Product verdict: ${item.verdictEn}.`
  };
}

const visuals = {
  science: visual("claude-science-workbench-2026-07-04", "Claude Science workbench", "official · review · auditable scientific agent", [
    ["Workbench", "scientific tools, notebooks, figures, manuscripts, compute"],
    ["Agents", "generalist coordinator, specialist skills, reviewer agent"],
    ["Artifacts", "code, environment, history and reproducible outputs"],
    ["Risk", "beta availability, validation, sensitive data boundaries"]
  ], "https://www.anthropic.com/news/claude-science-ai-workbench"),
  tag: visual("claude-tag-slack-agent-2026-07-04", "Claude Tag in Slack", "official · developer surface · team agent", [
    ["Entry", "tag @Claude inside a Slack channel"],
    ["Scope", "channel memory, tools, spend limits and logs"],
    ["Mode", "multiplayer, asynchronous, proactive when enabled"],
    ["Risk", "permission design and ambient behavior clarity"]
  ], "https://www.anthropic.com/news/introducing-claude-tag"),
  workspace: visual("google-workspace-ai-ad-friction-2026-07-04", "Google Workspace AI collaboration surface", "reviews · community friction · product-message scan", [
    ["Surface", "Docs, Calendar, Meet, e-signatures and Gemini features"],
    ["Ad flow", "collaboration fantasy tests public acceptance"],
    ["Friction", "comments split between playful and tone-deaf AI framing"],
    ["Lesson", "AI features still need credible human workflow fit"]
  ], "https://techcrunch.com/2026/07/04/new-google-commercial-imagines-a-declaration-of-independence-written-with-help-from-ai/"),
  claudeCode: visual("claude-code-enterprise-risk-2026-07-04", "Claude Code enterprise friction", "community · China · security risk signal", [
    ["Signal", "reported enterprise ban classifies tool as high-risk"],
    ["Surface", "coding agent with repo, terminal and tool access"],
    ["Pain", "agent productivity collides with data and code governance"],
    ["Watch", "admin controls, audit, allowed tools and local policy"]
  ], "https://techcrunch.com/2026/07/04/alibaba-reportedly-bans-employees-from-using-claude-code/"),
  wild: visual("product-hunt-agent-browser-2026-07-04", "Product Hunt agent browser scan", "wild · startup signal · global", [
    ["AI Browser", "prompted web automation and cloud sessions"],
    ["Klariqo", "voice/chat agents for SMB booking and phone flows"],
    ["Raydian", "chat-to-build product builder with hosting"],
    ["Risk", "launch heat is not retention or trust evidence"]
  ], "https://www.producthunt.com/topics/artificial-intelligence"),
  research: visual("wearable-agent-research-scan-2026-07-04", "Wearable agent research scan", "research · weak signal · HCI agency", [
    ["VisionClaw", "always-on egocentric agent through smart glasses"],
    ["Breakdowns", "voice-only glasses create timing and feedback problems"],
    ["Agency", "low-friction delegation needs visible state and undo"],
    ["Boundary", "research samples are not market proof"]
  ], "https://arxiv.org/html/2604.03486v2"),
  patent: visual("smart-glasses-patent-lane-2026-07-04", "Smart-glasses patent lane", "patent · weak/unverified · not product fact", [
    ["IP", "AI-supported smart glasses and design patents"],
    ["Litigation", "Solos versus Meta/EssilorLuxottica coverage"],
    ["Risk", "IP can shape feature availability and channels"],
    ["Boundary", "patent publication is not a launch"]
  ], "https://patents.google.com/patent/WO2024129004A1/en"),
  china: visual("china-ai-glasses-enterprise-agent-scan-2026-07-04", "China AI glasses and enterprise agent scan", "china · global compare · downgraded", [
    ["Glasses", "Rokid profile and China AI-glasses market signals"],
    ["Enterprise", "Claude Code ban report shows governance friction"],
    ["Market", "subsidies and domestic services lower trial cost"],
    ["Unknown", "hands-on evidence and API openness remain thin"]
  ], "https://m.36kr.com/p/3855201250507656")
};

const products = [
  {
    id: "claude-science-workbench",
    section: "official",
    zhHeadline: "Claude Science 把科学家的 agent 从聊天框推进可审计工作台",
    enHeadline: "Claude Science moves scientific agents from chat into an auditable workbench",
    sourceDate: "2026-06-30 official beta; 2026-07-03 review coverage",
    evidenceLabel: "confirmed product",
    evidenceStrength: "confirmed product · official beta · review coverage",
    visual: visuals.science,
    sources: [
      source("Anthropic: Claude Science workbench", "https://www.anthropic.com/news/claude-science-ai-workbench"),
      source("Claude product page: Claude Science", "https://claude.com/product/claude-science"),
      source("The Verge: Anthropic wants to develop its own drugs", "https://www.theverge.com/ai-artificial-intelligence/961311/anthropic-claude-science-ai-drug-development"),
      source("NVIDIA BioNeMo Agent Toolkit", "https://nvidianews.nvidia.com/news/nvidia-launches-bionemo-agent-toolkit-giving-ai-agents-the-tools-to-accelerate-scientific-discovery")
    ],
    hciZh: ["可审计 artifact", "科学工具工作台", "HPC/Modal 计算边界"],
    hciEn: ["auditable artifacts", "scientific workbench", "HPC/Modal compute boundary"],
    name: "Claude Science",
    type: "面向科研人员的 AI workbench beta，不是普通聊天机器人",
    typeEn: "a beta AI workbench for scientists rather than a general chatbot",
    entry: "科研人员可以在同一环境里查文献、运行分析、生成图表、管理 compute，并保留可复现历史",
    entryEn: "scientists can search literature, run analyses, generate figures, manage compute, and keep reproducible history in one environment",
    flow: "研究者在 macOS、Linux、本机、SSH、HPC login node 或 Modal 计算环境中打开 Claude Science，向协调 agent 描述任务，agent 调用 60+ curated skills/connectors、专业 agent 和 reviewer agent，生成代码、图、manuscript 与可追踪 history",
    flowEn: "a researcher opens Claude Science on macOS, Linux, a local machine, SSH, an HPC login node, or Modal compute, gives a task to a coordinating agent, and the agent uses 60+ curated skills and connectors, specialist agents, and a reviewer agent to produce code, figures, manuscripts, and traceable history",
    stack: "Claude app、macOS/Linux、本机或远程 SSH/HPC、Modal compute、60+ 科学 skills/connectors、genomics/single-cell/proteomics/structural biology/cheminformatics 工具、NVIDIA BioNeMo Agent Toolkit、reviewer agent",
    stackEn: "the Claude app, macOS/Linux, local or SSH/HPC environments, Modal compute, 60+ scientific skills/connectors, genomics, single-cell, proteomics, structural biology, cheminformatics tooling, NVIDIA BioNeMo Agent Toolkit, and a reviewer agent",
    specs: "官方披露 beta 面向 Claude Pro、Max、Team、Enterprise；可生成 3D protein structures、genome browser tracks、chemical structures、figures 和 manuscripts；可 fork session；申请项目最高 $30,000 credits 与 Modal 最高 $2,000 compute 的细节来自官方说明",
    specsEn: "Anthropic states the beta is for Claude Pro, Max, Team, and Enterprise; it can generate 3D protein structures, genome browser tracks, chemical structures, figures, and manuscripts; it supports session forking; the official page also names up to $30,000 in credits and up to $2,000 in Modal compute for selected projects",
    useCases: "single-cell RNA sequencing analysis、CRISPR screen design、protein structure prediction、cheminformatics、long-form computational review、glioma molecular epidemiology、figure/manuscript iteration",
    useCasesEn: "single-cell RNA sequencing analysis, CRISPR screen design, protein structure prediction, cheminformatics, long-form computational review, glioma molecular epidemiology, and figure/manuscript iteration",
    pain: "科研工作流被 PubMed、Jupyter、R、cluster terminal、不同数据库 schema、文件格式和可视化工具切碎，结果难复现、难审计、难在数月后解释来源",
    painEn: "scientific workflows are fragmented across PubMed, Jupyter, R, cluster terminals, database schemas, file formats, and visualization tools, making results hard to reproduce, audit, or explain months later",
    voice: "The Verge 将它放在 Anthropic 进入 drug-development/AI-for-science 的语境里；官方引用 Manifold Bio、Allen Institute 与 UCSF Brain Tumor Center 使用案例。普通研究者长期反馈仍不足，source not stated",
    voiceEn: "The Verge frames it as Anthropic moving into drug development and AI for science; Anthropic cites Manifold Bio, the Allen Institute, and the UCSF Brain Tumor Center. Long-term ordinary researcher feedback remains source not stated",
    newTech: "generalist coordinating agent + specialist agents + reviewer agent + reproducible artifacts + compute orchestration，把科研 agent 从回答问题变成可审计生产环境",
    newTechEn: "a generalist coordinating agent plus specialist agents, a reviewer agent, reproducible artifacts, and compute orchestration, moving scientific AI from question answering into an auditable production environment",
    availability: "官方称 beta 面向 Claude Pro、Max、Team、Enterprise；Team/Enterprise 需要 admin enable；研究项目申请截止 July 15, 2026，通知 July 31，项目运行 September 1 to December 1, 2026",
    availabilityEn: "Anthropic says the beta is available for Claude Pro, Max, Team, and Enterprise; Team/Enterprise users need an admin to enable it; project applications close July 15, 2026, notifications are July 31, and projects run September 1 to December 1, 2026",
    limits: "科学正确性仍需要独立验证；敏感数据只发送必要 context 的说法需要组织内部安全审查；医疗/药物发现结果不能直接当临床证据；Windows、价格、区域和完整合规细节 source not stated",
    limitsEn: "scientific correctness still requires independent validation; the claim that only needed context is sent needs internal security review; medical or drug-discovery output is not clinical evidence; Windows support, price, region, and full compliance details are source not stated",
    verdict: "这是今天最强 product dossier：它把 agent 的价值放在可复现 artifact 和计算流程里，而不是聊天体验里。科研软件团队应关注 audit trail、session fork、reviewer agent 和 compute permission，而不是只问模型分数",
    verdictEn: "this is the strongest product dossier today because it places agent value in reproducible artifacts and compute workflow rather than chat. Scientific software teams should study audit trails, session forks, reviewer agents, and compute permission rather than only model scores"
  },
  {
    id: "claude-tag-slack-agent",
    section: "global",
    zhHeadline: "Claude Tag 把团队 agent 放进 Slack 频道，并把身份、记忆和成本做成管理面",
    enHeadline: "Claude Tag puts a team agent in Slack and turns identity, memory, and spend into admin surfaces",
    sourceDate: "2026-06-23 official beta",
    evidenceLabel: "developer surface",
    evidenceStrength: "developer surface · official beta · team collaboration agent",
    visual: visuals.tag,
    sources: [
      source("Anthropic: Introducing Claude Tag", "https://www.anthropic.com/news/introducing-claude-tag"),
      source("Claude product page: @Claude", "https://www.claude.com/product/tag"),
      source("Claude Tag docs overview", "https://www.claude.com/docs/claude-tag/overview")
    ],
    hciZh: ["频道内 agent 身份", "ambient 行为", "管理员权限边界"],
    hciEn: ["channel agent identity", "ambient behavior", "admin permission boundary"],
    name: "Claude Tag",
    type: "面向团队的 Slack 内 agent beta",
    typeEn: "a team agent beta that runs inside Slack",
    entry: "任何人在授权频道里 tag @Claude，把代码、指标、支持工单或跨工具任务委派给一个共享 channel identity",
    entryEn: "anyone in an authorized Slack channel can tag @Claude and delegate code, metrics, support-ticket, or cross-tool tasks to a shared channel identity",
    flow: "管理员把 Claude Tag 与 Slack workspace 配对，授予特定 channel、tool、data 和 codebase 访问权限，设置月度 token spend 与日志；用户在 thread 里 @Claude，下达自然语言任务，Claude 分阶段执行并在 thread 中回复产物",
    flowEn: "an administrator pairs Claude Tag with a Slack workspace, grants access to specific channels, tools, data, and codebases, sets monthly token-spend limits and logs; a user tags @Claude in a thread, gives a natural-language task, and Claude works through stages before replying with output",
    stack: "Slack app、Claude Enterprise/Team beta、channel-scoped memory、tools/connectors/codebases、token spend limit、administrator logs、ambient behavior switch、Opus 4.8",
    stackEn: "Slack app, Claude Enterprise/Team beta, channel-scoped memory, tools/connectors/codebases, token-spend limits, administrator logs, ambient behavior switch, and Opus 4.8",
    specs: "官方披露 Claude Tag replaces existing Claude in Slack app；可设置 organization/channel spend limit；可查看 @Claude 做了什么和谁请求；不同 use case 的 Claude identity 与 memory 可分离",
    specsEn: "Anthropic says Claude Tag replaces the existing Claude in Slack app; administrators can set organization and channel spend limits; logs show what @Claude did and who requested it; separate Claude identities and memories can be scoped to different uses",
    useCases: "代码任务、产品指标查询、支持 ticket、bug root cause、异步 follow-up、跨 channel 信息提示、团队多人接续同一 agent 工作",
    useCasesEn: "coding tasks, product-metric queries, support tickets, bug root-cause work, asynchronous follow-up, cross-channel information alerts, and multiplayer continuation of the same agent work",
    pain: "团队 AI 助手过去常被困在个人 chat 或单次任务里，缺少频道上下文、共享历史、管理员授权和组织成本控制",
    painEn: "team AI assistants were often trapped in individual chats or one-off tasks without channel context, shared history, administrator authorization, or organization-level cost control",
    voice: "官方称 Anthropic 内部 product team 65% code 由 internal Claude Tag 创建；这是供应商自述，应按官方产品证据处理，不当作独立 benchmark",
    voiceEn: "Anthropic says 65% of its product team's code is created by an internal version of Claude Tag; that is vendor-stated product evidence, not an independent benchmark",
    newTech: "channel-scoped agent identity、ambient update、multi-user memory 和 admin spend/log 控制共同形成团队 agent 的交互模型",
    newTechEn: "channel-scoped agent identity, ambient updates, multi-user memory, and admin spend/log controls together form the interaction model for a team agent",
    availability: "Claude Enterprise 和 Team customers beta；从 Slack 开始，未来更广泛可用目标未给具体时间；migration credit 和 30-day opt-in 来源于官方说明",
    availabilityEn: "beta for Claude Enterprise and Team customers; starts with Slack; broader availability has no source-stated date; migration credit and a 30-day opt-in are from Anthropic's announcement",
    limits: "ambient agent 很容易被用户误读成“总在监听”；频道记忆可能带来 context bleed；工具权限和 private channel 边界需要管理员持续校准",
    limitsEn: "an ambient agent can be misread as always watching; channel memory can create context bleed; tool access and private-channel boundaries require continuous administrator tuning",
    verdict: "Claude Tag 的产品意义是把 agent 从个人效率工具改造成团队成员。成败取决于管理员是否能把身份、记忆、花费和日志解释给非技术用户",
    verdictEn: "Claude Tag matters because it moves the agent from personal productivity tool toward team member. Success depends on whether administrators can explain identity, memory, spend, and logs to non-technical users"
  },
  {
    id: "google-workspace-ai-ad-friction",
    section: "reviews",
    zhHeadline: "Google Workspace 独立日广告不是新产品，但暴露了协作 AI 的信任摩擦",
    enHeadline: "Google Workspace's Independence Day ad is not a new product, but it exposes collaboration-AI trust friction",
    sourceDate: "2026-07-04 review/community scan",
    evidenceLabel: "review/community friction",
    evidenceStrength: "review/community friction · product-message scan",
    visual: visuals.workspace,
    sources: [
      source("TechCrunch: Google Workspace AI commercial", "https://techcrunch.com/2026/07/04/new-google-commercial-imagines-a-declaration-of-independence-written-with-help-from-ai/"),
      source("The Verge: Google AI commercial response", "https://www.theverge.com/ai-artificial-intelligence/961468/google-ai-commercial-founding-fathers-declaration-of-independence"),
      source("Google Workspace AI", "https://workspace.google.com/solutions/ai/"),
      source("Google Workspace YouTube commercial", "https://www.youtube.com/watch?v=Q3RjZY-rSsc")
    ],
    hciZh: ["协作叙事", "公众接受度", "AI 辅助边界"],
    hciEn: ["collaboration narrative", "public acceptance", "AI assistance boundary"],
    name: "Google Workspace AI collaboration surface",
    type: "Google Workspace 内 AI 协作功能的广告/产品叙事扫描，不是新 SKU",
    typeEn: "an advertising and product-narrative scan of AI collaboration features inside Google Workspace, not a new SKU",
    entry: "TechCrunch 描述广告中的 Docs、Calendar、Meet、e-signatures、Gemini note-taking 与 help me visualize 等功能如何被包装成协作流程",
    entryEn: "TechCrunch describes Docs, Calendar, Meet, e-signatures, Gemini note-taking, and help-me-visualize style features being packaged as a collaboration workflow",
    flow: "广告里的用户通过 text messages 催稿，文档中 suggest edits，Calendar 安排 meeting，Meet 开会，e-signature 完成签署，Gemini 做会议笔记和 chatbot 建议，AI visualization 生成 seal 概念",
    flowEn: "the ad flow uses text messages to chase a draft, suggested edits in Docs, Calendar scheduling, a Meet call, e-signatures, Gemini meeting notes and chatbot advice, and AI visualization for a seal concept",
    stack: "Google Workspace、Docs、Calendar、Meet、e-signatures、Gemini、Help me visualize/AI media feature语境、YouTube/Instagram/Bluesky 反应",
    stackEn: "Google Workspace, Docs, Calendar, Meet, e-signatures, Gemini, help-me-visualize or AI media-feature context, and YouTube/Instagram/Bluesky reaction surfaces",
    specs: "本期不把广告画面当作新功能说明；Workspace AI 的具体 plan、regions、功能 gating、企业数据边界和模型版本需要回到 Google 官方文档逐项确认",
    specsEn: "this issue does not treat an ad scene as a new feature specification; specific Workspace AI plans, regions, feature gating, enterprise data boundaries, and model versions need direct Google documentation",
    useCases: "协作文档起草、会议安排、会议记录、图像概念生成、文档权限请求、签署流程和团队异步推进",
    useCasesEn: "collaborative drafting, meeting scheduling, meeting notes, image concept generation, document access requests, signing flow, and asynchronous team coordination",
    pain: "协作软件真正的痛点不是“能不能写”，而是多人版本、权限请求、会议转写、谁负责下一步、AI 建议是否侵入人类判断",
    painEn: "the real pain in collaboration software is not whether AI can write, but multi-person versions, permission requests, meeting capture, ownership of next steps, and whether AI suggestions intrude on human judgment",
    voice: "TechCrunch 记录 YouTube/Instagram response mostly positive，而 Bluesky 更批评；The Verge 也强调 public discomfort。具体可量化 sentiment 分布 source not stated",
    voiceEn: "TechCrunch reports YouTube and Instagram reaction appearing mostly positive while Bluesky was more critical; The Verge also foregrounds public discomfort. A quantified sentiment distribution is source not stated",
    newTech: "产品信号不是新模型，而是 AI collaboration 的社会接受度测试：用户愿不愿意让 AI 进入历史、政治、写作和会议协作这种高语境场景",
    newTechEn: "the product signal is not a new model but a public acceptance test for AI collaboration inside high-context work such as history, politics, writing, and meetings",
    availability: "Google Workspace AI 功能可用性以 Google 官方 Workspace 页面和管理员文档为准；广告发布日期为 2026-07-04 报道语境",
    availabilityEn: "availability of Google Workspace AI features should be checked against Google's Workspace pages and admin docs; the ad coverage is dated July 4, 2026",
    limits: "广告不能证明真实团队流程更好；用户对 AI 参与创作/政治叙事的反感可能污染原本合理的协作功能；功能是否在企业域默认启用 source not stated",
    limitsEn: "an ad cannot prove the real team workflow is better; discomfort with AI in authorship or political narrative can contaminate otherwise useful collaboration features; whether functions are default-on in enterprise domains is source not stated",
    verdict: "这是 review lane 的好材料：它显示 AI 协作产品的失败不一定来自功能缺失，也可能来自叙事不可信。产品团队应把 AI 的参与边界写进流程，而不是只把 AI 功能剪进广告",
    verdictEn: "this is useful review-lane evidence because AI collaboration can fail through credibility, not only missing features. Product teams should design AI participation boundaries into the workflow rather than merely placing AI features in advertising"
  },
  {
    id: "claude-code-enterprise-risk",
    section: "community",
    zhHeadline: "Alibaba 禁用 Claude Code 报道提示：coding agent 的企业摩擦正在从能力转向治理",
    enHeadline: "Alibaba's reported Claude Code ban shows coding-agent friction moving from capability to governance",
    sourceDate: "2026-07-04 media/community friction",
    evidenceLabel: "review/community friction",
    evidenceStrength: "review/community friction · China enterprise security signal",
    visual: visuals.claudeCode,
    sources: [
      source("TechCrunch: Alibaba reportedly bans Claude Code", "https://techcrunch.com/2026/07/04/alibaba-reportedly-bans-employees-from-using-claude-code/"),
      source("Claude Code product page", "https://claude.com/product/claude-code"),
      source("Claude Code docs", "https://docs.anthropic.com/en/docs/claude-code/overview")
    ],
    hciZh: ["企业风控", "代码权限", "治理 UI"],
    hciEn: ["enterprise risk control", "code permission", "governance UI"],
    name: "Claude Code enterprise risk surface",
    type: "coding agent 的企业治理摩擦扫描",
    typeEn: "a governance-friction scan for a coding agent",
    entry: "TechCrunch 报道 Alibaba reportedly classified Claude Code as high-risk software；这不是 Claude Code 新功能发布，但直接影响 coding agent 在企业中的默认可用性",
    entryEn: "TechCrunch reports that Alibaba reportedly classified Claude Code as high-risk software; this is not a new Claude Code feature launch, but it directly affects default availability of coding agents inside enterprises",
    flow: "开发者通常在 repo/terminal/IDE 或 CLI 中委派 coding task，agent 读取项目、修改文件、运行命令、生成 diff；企业安全团队则评估源代码、凭证、数据出境、日志、模型供应商和工具调用风险",
    flowEn: "a developer delegates a coding task from a repo, terminal, IDE, or CLI; the agent reads the project, edits files, runs commands, and produces diffs, while enterprise security evaluates source code, credentials, data movement, logs, model vendor, and tool-call risk",
    stack: "Claude Code 产品、docs、repo/file/terminal 操作语境、企业 allow/ban policy、source-code governance、China enterprise/security environment",
    stackEn: "Claude Code product and docs, repository/file/terminal operation context, enterprise allow/ban policy, source-code governance, and a China enterprise/security environment",
    specs: "本期不推断 Alibaba 内部 policy 文档全文、禁用范围、执行技术手段、是否涉及所有团队或所有 Anthropic 产品；这些为 source not stated",
    specsEn: "this issue does not infer Alibaba's full internal policy text, ban scope, enforcement mechanism, whether all teams are affected, or whether all Anthropic products are affected; those remain source not stated",
    useCases: "企业代码生成、bug 修复、测试运行、代码审查、迁移、重构、文档生成、数据查询脚本和安全修复",
    useCasesEn: "enterprise code generation, bug fixing, test execution, code review, migration, refactoring, documentation, data-query scripts, and security fixes",
    pain: "coding agent 能力越强，越容易碰到企业风控红线：私有代码能否外发、secret 是否会被读到、自动命令能否破坏环境、日志是否可审计",
    painEn: "the stronger a coding agent becomes, the more it touches enterprise risk boundaries: whether private code can leave, whether secrets may be read, whether automatic commands can damage environments, and whether logs are auditable",
    voice: "该信号来自 TechCrunch in brief 报道和媒体/社区传播；没有 Alibaba 官方英文公告或完整内部通知可验证，source not stated",
    voiceEn: "the signal comes from a TechCrunch in-brief report and media/community circulation; no Alibaba official English announcement or complete internal memo was verified here, so source not stated",
    newTech: "新界面问题是 governance UX：coding agent 需要向管理员和开发者同时展示 repo 权限、工具权限、命令执行、模型边界和数据流向",
    newTechEn: "the new interface problem is governance UX: a coding agent needs to show repository permissions, tool permissions, command execution, model boundaries, and data flow to both administrators and developers",
    availability: "Claude Code 产品页面和 docs 可访问；Alibaba 端禁用范围、时间线、地区和替代工具 source not stated",
    availabilityEn: "Claude Code product and docs are accessible; Alibaba-side scope, timeline, region, and replacement tools are source not stated",
    limits: "单个企业禁用不能代表全市场，但它足以提示 governance 已成为 coding agent 的购买门槛；没有更完整社区样本前，不应扩大成行业结论",
    limitsEn: "one reported enterprise ban does not represent the whole market, but it is enough to show governance becoming a purchase gate for coding agents; without broader community samples, it should not be generalized into an industry conclusion",
    verdict: "这条应作为 community friction，而非产品失败。真实问题是 coding agent 需要企业级权限设计、secret 防护、审计、私有部署/区域承诺和清楚的停用路径",
    verdictEn: "this should be read as community friction, not as product failure. The real issue is that coding agents need enterprise-grade permission design, secret protection, audit, private deployment or regional commitments, and clear disable paths"
  }
];

const scans = [
  {
    id: "product-hunt-agent-browser-wild-scan",
    section: "wild",
    zhHeadline: "Product Hunt wild lane：AI Browser、Klariqo、Raydian 显示 agent 产品正在收窄到具体工作",
    enHeadline: "Product Hunt wild lane: AI Browser, Klariqo, and Raydian show agents narrowing into concrete jobs",
    sourceDate: "2026-07-04 Product Hunt scan",
    evidenceLabel: "startup signal",
    evidenceStrength: "startup signal · wild source-lane scan",
    visual: visuals.wild,
    sources: [
      source("Product Hunt: Artificial Intelligence topic", "https://www.producthunt.com/topics/artificial-intelligence"),
      source("Product Hunt: AI Agents category", "https://www.producthunt.com/categories/ai-agents"),
      source("Product Hunt: AI Browser", "https://www.producthunt.com/products/ai-browser"),
      source("Product Hunt: Klariqo", "https://www.producthunt.com/products/klariqo"),
      source("Product Hunt: Raydian", "https://www.producthunt.com/products/raydian")
    ],
    hciZh: ["野生 agent", "工作流收窄", "热度不等于留存"],
    hciEn: ["wild agents", "workflow narrowing", "heat is not retention"],
    name: "Product Hunt agent wild scan",
    scanned: "Product Hunt AI topic、AI Agents category、AI Browser、Klariqo、Raydian 等近期 AI agent/product-builder 条目",
    scannedEn: "Product Hunt AI topic, AI Agents category, AI Browser, Klariqo, Raydian, and adjacent AI-agent/product-builder listings",
    flow: "AI Browser 把 prompt 转成 web automation/cloud session，Klariqo 把 voice/chat agent 放进 SMB booking 和 phone flow，Raydian 把 chat-to-build、visual editing 和 hosting 连成产品创建入口",
    flowEn: "AI Browser turns prompts into web automation and cloud sessions, Klariqo puts voice/chat agents into SMB booking and phone flows, and Raydian links chat-to-build, visual editing, and hosting into a product-creation entry point",
    stack: "Product Hunt 页面支持 AI agent、AI coding agents、AI browser automation、voice/chat agents、product builders、reviews/ratings/use-by graph 等市场信号",
    stackEn: "Product Hunt pages support market signals around AI agents, AI coding agents, AI browser automation, voice/chat agents, product builders, ratings/reviews, and used-by graphs",
    useCases: "增长运营、网页自动化、服务业预约、电话接线、AI 建站、全栈 app 原型和非工程用户的 prompt-to-workflow",
    useCasesEn: "growth operations, web automation, service booking, phone handling, AI site building, full-stack app prototyping, and prompt-to-workflow for non-engineers",
    pain: "“通用 agent”卖点开始变弱，用户更关心能否替自己完成某个固定场景并减少配置",
    painEn: "the generic agent pitch is weakening; users care more about whether a product completes a fixed job with less configuration",
    voice: "Product Hunt 热度、rating 和 launch wording 是 startup/community signal，不是留存或收入证据；缺少独立长期评测",
    voiceEn: "Product Hunt heat, ratings, and launch wording are startup/community signals, not retention or revenue evidence; independent long-term reviews are missing",
    newTech: "agent 产品从“我能做任何事”转向“浏览器自动化、电话预约、chat-to-build”等窄入口",
    newTechEn: "agent products are shifting from 'I can do anything' toward narrower entries such as browser automation, phone booking, and chat-to-build",
    availability: "各产品可访问性、价格、地区、数据政策和集成清单需逐项看官方页；Product Hunt 本身只证明公开展示和社区互动",
    availabilityEn: "each product's access, price, region, data policy, and integration list must be checked on its own official page; Product Hunt only proves public listing and community interaction",
    limits: "launch 页面可能过度承诺，AI browser automation 涉及 CAPTCHA、账号安全和网站 ToS，voice agent 涉及电话合规和误接单，chat-to-build 涉及生成代码可维护性",
    limitsEn: "launch pages may overclaim; AI browser automation touches CAPTCHA, account security, and website terms; voice agents touch phone compliance and mistaken bookings; chat-to-build touches maintainability of generated code",
    verdict: "wild lane 可提升为产品 dossier 的条件是：有官方文档、稳定价格、真实 case、社区故障样本和可复现 demo。今天保留为 startup signal",
    verdictEn: "the condition for upgrading this wild lane into full product dossiers is official docs, stable pricing, real cases, community failure samples, and reproducible demos. Today it stays a startup signal"
  },
  {
    id: "wearable-agent-research-scan",
    section: "research",
    zhHeadline: "研究 lane：连续感知眼镜 agent 仍是实验室信号，不能升级成产品事实",
    enHeadline: "Research lane: continuous-perception eyewear agents remain lab signals, not product facts",
    sourceDate: "2026 research scan",
    evidenceLabel: "research signal",
    evidenceStrength: "research signal · downgraded HCI watch",
    visual: visuals.research,
    sources: [
      source("arXiv: VisionClaw always-on AI agents through smart glasses", "https://arxiv.org/html/2604.03486v2"),
      source("arXiv: Conversational successes and breakdowns in smart glasses", "https://arxiv.org/html/2602.22340v1"),
      source("ACM CHI 2026", "https://chi2026.acm.org/")
    ],
    hciZh: ["连续感知", "agency 控制", "研究样本降级"],
    hciEn: ["continuous perception", "agency control", "research sample downgrade"],
    name: "Wearable agent research scan",
    scanned: "VisionClaw always-on smart-glasses agent 论文、smart-glasses conversational breakdown 论文与 CHI/HCI 研究语境",
    scannedEn: "the VisionClaw always-on smart-glasses agent paper, smart-glasses conversational breakdown research, and CHI/HCI context",
    flow: "研究原型通过眼镜获得第一人称环境，用户语音委派任务，agent 将环境理解、工具调用和后续动作连接起来；breakdown 研究提醒无屏/少屏交互会在时机、误解和反馈不足上失败",
    flowEn: "the research prototype uses glasses for first-person context, the user delegates tasks by voice, and the agent connects environmental understanding, tool use, and follow-up actions; breakdown research warns that no-screen or low-screen interaction fails around timing, misunderstanding, and insufficient feedback",
    stack: "Meta Ray-Ban smart glasses、Gemini Live、OpenClaw、controlled lab study/autobiographical deployment、voice-only/non-display smart-glasses interaction analysis",
    stackEn: "Meta Ray-Ban smart glasses, Gemini Live, OpenClaw, controlled lab and autobiographical deployment context, and voice-only/non-display smart-glasses interaction analysis",
    useCases: "维修、购物、烹饪、会议、生活记录、无障碍、工业现场和实时翻译等潜在任务",
    useCasesEn: "repair, shopping, cooking, meetings, life logging, accessibility, industrial field work, and real-time translation as potential tasks",
    pain: "手机/桌面 AI 需要用户解释环境，眼镜 agent 试图让系统直接看见；但 continuous perception 会引发旁观者同意、录制状态和错误执行问题",
    painEn: "phone and desktop AI require users to describe the environment, while eyewear agents try to let systems see directly; continuous perception raises bystander consent, recording-state, and erroneous-execution problems",
    voice: "研究样本不是市场反馈；论文样本量、实验设置和自传式部署不能代表普通消费者长期佩戴意愿",
    voiceEn: "research samples are not market feedback; sample sizes, lab settings, and autobiographical deployments cannot represent long-term ordinary-consumer willingness to wear the device",
    newTech: "egocentric perception + general-purpose agent execution，把环境上下文变成任务上下文",
    newTechEn: "egocentric perception plus general-purpose agent execution, turning environmental context into task context",
    availability: "研究论文可读；没有对应商业可购买产品、价格或上线地区",
    availabilityEn: "the papers are readable; there is no corresponding commercial purchasable product, price, or launch region",
    limits: "续航、热量、网络依赖、隐私提示、旁观者同意、失败恢复和误执行成本仍未被消费级产品证明",
    limitsEn: "battery, heat, network dependence, privacy indicators, bystander consent, recovery, and erroneous-execution cost remain unproven in consumer products",
    verdict: "作为 research watch 保留。产品团队现在能学到的是 state indicator、context preview、pause、undo 和 consent 设计，而不是马上复制原型",
    verdictEn: "keep it as a research watch. Product teams can learn state indicators, context preview, pause, undo, and consent design now, but should not treat the prototype as a launchable product"
  },
  {
    id: "smart-glasses-patent-lane-scan",
    section: "patent",
    zhHeadline: "专利 lane：智能眼镜 IP 活跃，但今天没有可升级的上市事实",
    enHeadline: "Patent lane: smart-glasses IP is active, but no patent becomes a launch fact today",
    sourceDate: "2026 patent scan",
    evidenceLabel: "patent signal",
    evidenceStrength: "patent signal · explicitly speculative",
    visual: visuals.patent,
    sources: [
      source("Google Patents: AI-supported smart glasses", "https://patents.google.com/patent/WO2024129004A1/en"),
      source("Google Patents: AI Smart Glasses GS1 design", "https://patents.google.com/patent/CN309755008S/en"),
      source("WIPO Global Awards 2026: Rokid", "https://www.wipo.int/en/web/awards/global/2026"),
      source("Android Central: Solos smart-glasses patent lawsuit", "https://www.androidcentral.com/wearables/solos-is-taking-aim-at-meta-essilorluxottica-for-alleged-smart-glasses-patent-infringement-in-pivotal-case")
    ],
    hciZh: ["IP 风险", "专利降级", "可买事实缺失"],
    hciEn: ["IP risk", "patent downgrade", "purchasable fact missing"],
    name: "Smart-glasses patent lane scan",
    scanned: "AI-supported smart glasses 专利、AI Smart Glasses GS1 外观设计、Rokid WIPO profile、Solos 与 Meta/EssilorLuxottica 专利诉讼报道",
    scannedEn: "AI-supported smart-glasses patent documents, AI Smart Glasses GS1 design, Rokid WIPO profile, and Solos versus Meta/EssilorLuxottica patent-litigation coverage",
    flow: "专利没有真实用户流程，只能提示医疗/工业/外观/传感/显示方向；诉讼可能影响授权、渠道、功能或成本，但不能证明某项功能已上线",
    flowEn: "patents have no real user flow; they only indicate medical, industrial, exterior-design, sensing, or display directions; litigation may influence licensing, channel, function, or cost but cannot prove a feature shipped",
    stack: "patent publication pages、design patent、WIPO company/IP profile、smart-glasses litigation coverage",
    stackEn: "patent publication pages, a design patent, WIPO company/IP profile, and smart-glasses litigation coverage",
    useCases: "产品研究、竞品风险、硬件路线图、光学/音频/传感/外观设计边界判断",
    useCasesEn: "product research, competitive-risk tracking, hardware roadmapping, and boundary checks around optics, audio, sensing, and exterior design",
    pain: "硬件团队如果只看发布会，很容易忽略一个品类在上市前已被 IP 和诉讼塑形",
    painEn: "hardware teams that track only launches can miss how a category is shaped by IP and litigation before products reach users",
    voice: "专利没有用户原声；诉讼报道也不等于消费者反馈",
    voiceEn: "patents provide no user voice; litigation coverage is not consumer feedback",
    newTech: "专利聚集在 AI-supported eyewear、医疗/工业辅助、设计形态和 smart-glasses platform claim 周围",
    newTechEn: "the patent cluster sits around AI-supported eyewear, medical/industrial assistance, design form, and smart-glasses platform claims",
    availability: "专利公开不等于上市；WIPO profile 不等于所有地区可购买；诉讼不等于判决",
    availabilityEn: "patent publication is not launch; a WIPO profile is not availability in every region; a lawsuit is not a court decision",
    limits: "权利要求有效性、实施状态、法院结果、授权费用、用户影响和终端规格均 source not stated",
    limitsEn: "claim validity, implementation status, court outcome, licensing cost, user impact, and final device specs are source not stated",
    verdict: "只作为 patent watch。它提醒产品团队做 IP 风险扫描，但不能替代官方产品页、评测和用户证据",
    verdictEn: "keep this as patent watch only. It reminds product teams to scan IP risk, but it cannot replace official product pages, reviews, and user evidence"
  },
  {
    id: "china-ai-glasses-enterprise-agent-scan",
    section: "china",
    zhHeadline: "中国 lane：AI 眼镜市场升温与 Claude Code 企业禁用共同指向治理型入口",
    enHeadline: "China lane: AI glasses market heat and the reported Claude Code ban both point to governed entry points",
    sourceDate: "2026-07 China/global scan",
    evidenceLabel: "weak/unverified",
    evidenceStrength: "weak/unverified · China source-lane scan",
    visual: visuals.china,
    sources: [
      source("36氪：AI眼镜赛道全面起势", "https://m.36kr.com/p/3855201250507656"),
      source("WIPO Global Awards 2026: Rokid", "https://www.wipo.int/en/web/awards/global/2026"),
      source("Google Patents: AI Smart Glasses GS1 design", "https://patents.google.com/patent/CN309755008S/en"),
      source("TechCrunch: Alibaba reportedly bans Claude Code", "https://techcrunch.com/2026/07/04/alibaba-reportedly-bans-employees-from-using-claude-code/")
    ],
    hciZh: ["AIOS 眼镜", "企业治理", "本地生态闭环"],
    hciEn: ["AIOS eyewear", "enterprise governance", "local ecosystem closure"],
    name: "China AI glasses and enterprise agent scan",
    scanned: "36氪 AI 眼镜报道、WIPO Rokid profile、AI Smart Glasses GS1 外观设计专利、Alibaba reportedly bans Claude Code 的企业治理信号",
    scannedEn: "36Kr smart-glasses coverage, the WIPO Rokid profile, AI Smart Glasses GS1 design patent, and the reported Alibaba Claude Code ban as an enterprise-governance signal",
    flow: "眼镜 lane 描述语音、显示、翻译、导航、会议和本地服务闭环；企业 agent lane 描述 coding agent 进入私有代码和工具权限后的风控阻力",
    flowEn: "the eyewear lane describes voice, display, translation, navigation, meetings, and local-service closure; the enterprise-agent lane describes risk resistance when a coding agent enters private code and tool permissions",
    stack: "36氪中国 AI 眼镜市场报道、WIPO Rokid 专利/商标/出货与部署资料、AI Smart Glasses 设计专利、Claude Code 企业风控报道",
    stackEn: "36Kr China AI-glasses market coverage, WIPO material on Rokid patents/trademarks/shipments/deployments, an AI Smart Glasses design patent, and Claude Code enterprise risk reporting",
    useCases: "翻译字幕、会议记录、导览、工业提示、本地生活服务、地图/支付/办公连接、企业代码生成和安全策略",
    useCasesEn: "translation subtitles, meeting notes, guidance, industrial prompts, local-life services, maps/payments/workplace links, enterprise coding, and security policy",
    pain: "中国市场的 AI 硬件和企业 agent 都在争入口，但入口不是越靠前越好；用户和组织需要知道谁在感知、谁在执行、权限归谁",
    painEn: "China's AI hardware and enterprise agents are both competing for entry points, but earlier entry is not automatically better; users and organizations need to know who senses, who executes, and who owns permission",
    voice: "今天材料更多是媒体/行业和单条企业禁用报道，缺少足够长期用户佩戴、企业管理员访谈和售后数据",
    voiceEn: "today's material is mostly media/industry coverage and one reported enterprise ban, with limited long-term wearer feedback, enterprise-admin interviews, or after-sales data",
    newTech: "AIOS-native glasses 和 governed coding agent 都把 AI 产品从 app 功能推向系统入口与权限治理",
    newTechEn: "AIOS-native glasses and governed coding agents both move AI products from app features into system entry points and permission governance",
    availability: "各眼镜型号、系统/API、地区、价格和售后需回官方页逐项确认；Claude Code 在 Alibaba 的禁用范围 source not stated",
    availabilityEn: "specific eyewear models, systems/APIs, regions, prices, and support require product-by-product official verification; the Claude Code ban scope inside Alibaba is source not stated",
    limits: "AIOS 叙事容易大于 hands-on 证据；补贴和销量不是满意度；单个企业禁用不是行业结论",
    limitsEn: "AIOS narrative can exceed hands-on evidence; subsidies and sales are not satisfaction; one enterprise ban is not an industry-wide conclusion",
    verdict: "中国 lane 今天应降级但不能忽略。它说明 AI 入口竞争的下一步是治理：眼镜要治理感知与外观信任，coding agent 要治理代码和工具权限",
    verdictEn: "the China lane should be downgraded but not ignored. It shows the next stage of AI entry-point competition is governance: glasses must govern perception and form-factor trust, and coding agents must govern code and tool authority"
  }
];

function topicFromProduct(item) {
  return {
    id: item.id,
    section: item.section,
    zhHeadline: item.zhHeadline,
    enHeadline: item.enHeadline,
    zhFact: `${item.name}：${item.type}。本条按 ${item.evidenceLabel} 处理；规格、价格、地区和日期只采用来源明示信息，缺失处写 source not stated。`,
    enFact: `${item.name}: ${item.typeEn}. This item is handled as ${item.evidenceLabel}; specs, price, regions, and dates use cited source claims only, and missing details remain source not stated.`,
    zhValue: item.verdict,
    enValue: item.verdictEn,
    zhHciLens: item.hciZh,
    enHciLens: item.hciEn,
    zhImplication: item.pain,
    enImplication: item.painEn,
    sourceDate: item.sourceDate,
    evidenceLabel: item.evidenceLabel,
    evidenceStrength: item.evidenceStrength,
    visual: Object.fromEntries(Object.entries(item.visual).filter(([key]) => key !== "svg")),
    sources: item.sources,
    dossierKind: "product",
    dossier: {
      zh: productDossierZh(item),
      en: productDossierEn(item)
    }
  };
}

function topicFromScan(item) {
  return {
    id: item.id,
    section: item.section,
    zhHeadline: item.zhHeadline,
    enHeadline: item.enHeadline,
    zhFact: `${item.name}：source-lane scan。本条按 ${item.evidenceLabel} 处理；不把弱信号写成确认产品事实。`,
    enFact: `${item.name}: source-lane scan. This item is handled as ${item.evidenceLabel}; weak signals are not written as confirmed product facts.`,
    zhValue: item.verdict,
    enValue: item.verdictEn,
    zhHciLens: item.hciZh,
    enHciLens: item.hciEn,
    zhImplication: item.pain,
    enImplication: item.painEn,
    sourceDate: item.sourceDate,
    evidenceLabel: item.evidenceLabel,
    evidenceStrength: item.evidenceStrength,
    visual: Object.fromEntries(Object.entries(item.visual).filter(([key]) => key !== "svg")),
    sources: item.sources,
    dossierKind: "scan",
    dossier: {
      zh: scanDossierZh(item),
      en: scanDossierEn(item)
    }
  };
}

const topics = [...products.map(topicFromProduct), ...scans.map(topicFromScan)];

const issue = {
  date: issueDate,
  timezone: "America/Toronto",
  zhTitle: "AI Daily 2026-07-04：Agent 工作台开始接受治理测试",
  enTitle: "AI Daily 2026-07-04: Agent Workbenches Meet the Governance Test",
  zhSummary: "Claude Science 和 Claude Tag 把 agent 推进科研与团队工作台；Google Workspace 广告和 Claude Code 企业禁用报道显示公众与组织都在追问 AI 参与边界；Product Hunt、研究、专利与中国 lane 全部降级标注。",
  enSummary: "Claude Science and Claude Tag push agents into scientific and team workbenches; the Google Workspace ad and reported Claude Code enterprise ban show the public and organizations asking where AI participation should stop; Product Hunt, research, patent, and China lanes are explicitly downgraded.",
  tags: ["AI workbench", "agent UX", "Claude Science", "Claude Tag", "enterprise governance", "Google Workspace", "smart glasses", "China scan"],
  sourceTypes: lanes,
  zhPath: `./${issueDate}/zh/`,
  enPath: `./${issueDate}/en/`,
  sourcesPath: `./${issueDate}/sources.md`,
  coverStory: {
    topicId: "claude-science-workbench",
    zhTitle: "Agent 进入真实工作台后，第一产品问题变成可审计",
    enTitle: "When agents enter real workbenches, auditability becomes the first product problem",
    imagePath: visuals.science.path,
    imageWidth: visuals.science.width,
    imageHeight: visuals.science.height,
    primarySourceUrl: "https://www.anthropic.com/news/claude-science-ai-workbench",
    evidenceStrength: "confirmed product · official beta",
    whyCover: "Claude Science makes agent work visible as code, compute, figures, manuscripts, reviewer checks, and history.",
    zhSummary: [
      "今天主线是治理型工作台：科研、Slack、Workspace、coding agent 和眼镜都在争入口。",
      "Claude Science 的价值不只是能回答科学问题，而是能留下 code、environment、history 和 reviewer 检查。",
      "Google 广告与 Alibaba/Claude Code 报道说明：AI 进入真实组织后，边界和信任比功能数量更快变成核心体验。"
    ],
    enSummary: [
      "Today's line is governed workbench: science, Slack, Workspace, coding agents, and eyewear are all fighting for entry points.",
      "Claude Science matters because it keeps code, environment, history, and reviewer checks, not merely scientific answers.",
      "The Google ad and Alibaba/Claude Code report show that once AI enters real organizations, boundaries and trust become core UX faster than feature count."
    ],
    imageSourceUrl: "https://www.anthropic.com/news/claude-science-ai-workbench"
  },
  topics,
  watchlistZh: [
    "Claude Science beta 是否能在真实 lab 中稳定保留可复现 artifact，并让 PI/安全团队理解数据边界。",
    "Claude Tag 的 ambient 行为、频道记忆和 spend log 是否能让非技术团队放心地把 agent 当团队成员。",
    "Claude Code 企业禁用报道是否扩散成更广泛的 coding-agent governance 采购门槛。",
    "Google Workspace AI 的广告争议是否促使协作产品更明确地区分 AI 起草、建议、记录和人类决策。",
    "Product Hunt 的 AI Browser、Klariqo、Raydian 等 narrow-agent 信号是否能拿出独立评测和留存证据。",
    "中国 AI 眼镜市场信号是否出现可复现 API、隐私提示、真实日用评测和售后数据。"
  ],
  watchlistEn: [
    "Whether Claude Science beta keeps reproducible artifacts stable in real labs and makes data boundaries understandable to PIs and security teams.",
    "Whether Claude Tag's ambient behavior, channel memory, and spend logs make non-technical teams comfortable treating an agent as a teammate.",
    "Whether the reported Claude Code enterprise ban spreads into a broader governance purchasing gate for coding agents.",
    "Whether Google Workspace AI's ad backlash pushes collaboration products to separate AI drafting, suggestion, recording, and human decision boundaries more clearly.",
    "Whether Product Hunt's AI Browser, Klariqo, Raydian, and other narrow-agent signals produce independent reviews and retention evidence.",
    "Whether China's AI-glasses market signals produce reproducible APIs, privacy indicators, real daily-use reviews, and support data."
  ]
};

await fs.mkdir(assetDir, { recursive: true });
for (const item of Object.values(visuals)) {
  await fs.writeFile(path.join(root, item.path), item.svg, "utf8");
}

const dataPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const next = [...issues.filter((item) => item.date !== issueDate), issue].sort((a, b) => a.date.localeCompare(b.date));
await fs.writeFile(dataPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");

const uniqueSources = new Set(topics.flatMap((item) => item.sources.map((source) => source.url))).size;
console.log(`Created ${issueDate}: ${topics.length} topics, ${uniqueSources} unique sources, ${Object.keys(visuals).length} visuals.`);
