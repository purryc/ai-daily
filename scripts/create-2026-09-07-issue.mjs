import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-07";
const previousDate = "2026-09-06";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const source = (label, url, type) => ({ label, url, type });

const violoopUrl = "https://violoop.com/";
const violoopBlogUrl = "https://violoop.ai/blog/";
const violoopReviewUrl = "https://www.tomsguide.com/computing/laptops/violoop-hands-on-ifa-2026";
const minisforumUrl = "https://www.minisforum.com/blogs/news/minisforum-unveils-next-gen-edge-ai-computing-solutions-powered-by-amd-ryzen-ai-max-pro-495-at-ifa-2026";
const minisforumReviewUrl = "https://www.tomshardware.com/pc-components/nas/minisforum-launches-local-ai-solutions-at-ifa-2026-ai-agent-nas-n5-and-ai-mini-workstation-ms-s1-use-amd-ryzen-ai-max-pro-495-processors-designed-to-run-models-locally";
const minisforumAwardUrl = "https://www.techradar.com/tech/ifa-2026-best-in-show-awards-at-the-berlin-tech-expo-from-somersaulting-robots-to-modular-solar-batteries-for-renters";
const pairDocsUrl = "https://docs.nvidia.com/local-ai/nvpair/";
const pairStartUrl = "https://docs.nvidia.com/local-ai/nvpair/getting-started/";
const pairBlogUrl = "https://blogs.nvidia.com/blog/local-ai-ifa-next-gen-agents-nv-pair-rtx-spark/";
const pairGithubUrl = "https://github.com/NVIDIA/Personal-AI-Router";
const chinaScanUrl = "https://www.xinhuanet.com/20260907/fd821dcf62d549fc9486ec5e5306f43e/c.html";

const svg = (title, subtitle, blocks, accent = "#10b981") => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#f7f8f4"/><rect x="56" y="54" width="1488" height="792" rx="28" fill="#ffffff" stroke="#d9ded7" stroke-width="3"/>
  <text x="100" y="132" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#10231b">${title}</text>
  <text x="100" y="180" font-family="Arial, sans-serif" font-size="24" fill="#53645d">${subtitle}</text>
  ${blocks.map((b, i) => { const x = 100 + (i % 3) * 480; const y = 270 + Math.floor(i / 3) * 245; return `<rect x="${x}" y="${y}" width="390" height="170" rx="20" fill="#f2f6f1" stroke="${accent}" stroke-width="3"/><text x="${x + 24}" y="${y + 52}" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#10231b">${b[0]}</text><text x="${x + 24}" y="${y + 94}" font-family="Arial, sans-serif" font-size="22" fill="#53645d">${b[1]}</text><text x="${x + 24}" y="${y + 128}" font-family="Arial, sans-serif" font-size="20" fill="#53645d">${b[2]}</text>`; }).join("\n")}
  <text x="100" y="795" font-family="Arial, sans-serif" font-size="20" fill="#7d8983">SELF-DRAWN MECHANISM DIAGRAM · claims trace to cited source ledger · not a product render</text>
</svg>`;
const visual = (file, width, height, kind, altZh, altEn, captionZh, captionEn, sourceUrl) => ({ path: `assets/${file}`, width, height, kind, altZh, altEn, captionZh, captionEn, sourceUrl });
const topic = ({ id, section, dossierKind = "product", evidenceLabel, evidenceStrength, sourceDate, zhHeadline, enHeadline, zhFact, enFact, zhValue, enValue, zhHciLens, enHciLens, zhImplication, enImplication, visual: topicVisual, sources, dossier }) => ({ id, section, dossierKind, evidenceLabel, evidenceStrength, sourceDate, zhHeadline, enHeadline, zhFact, enFact, zhValue, enValue, zhHciLens, enHciLens, zhImplication, enImplication, visual: topicVisual, sources, dossier });

const violoopVisual = visual("violoop-cube-official-2026-09.webp", 1200, 1200, "source-backed-product-image", "Violoop 官方产品图：屏幕感知 AI 硬件盒", "Violoop official product image: screen-aware AI hardware box", "官方产品图：Violoop；价格与 Kickstarter 日期以官方页和 hands-on 来源为准。", "Official product image: Violoop; price and Kickstarter date follow the official page and hands-on source.", violoopUrl);
const minisforumVisual = visual("minisforum-ms-s1-n5-official-2026-09.jpg", 1200, 1200, "source-backed-product-image", "MINISFORUM MS-S1 MAX-P495 与 N5 MAX-P495 官方图", "MINISFORUM MS-S1 MAX-P495 and N5 MAX-P495 official image", "官方发布图：MS-S1 MAX-P495 与 N5 MAX-P495；发布会未给出完整零售规格。", "Official announcement image: MS-S1 MAX-P495 and N5 MAX-P495; the release does not give a complete retail specification.", minisforumUrl);
const pairVisual = visual("nvidia-pair-app-official-2026-09.jpg", 1200, 630, "source-backed-ui-screenshot", "NVIDIA PAIR 官方界面图", "NVIDIA PAIR official interface image", "官方产品页界面图：PAIR 把本地节点与推理请求放进同一控制面。", "Official product-page interface image: PAIR puts local nodes and inference requests in one control plane.", "https://www.nvidia.com/en-in/ai-on-rtx/personal-ai-router/");
const chinaVisual = visual("shenzhen-ai-terminal-scan-2026-09-07.svg", 1600, 900, "self-drawn-source-traceable-diagram", "新华网深圳 AI 终端展会扫描自绘图", "Self-drawn scan diagram based on Xinhua Shenzhen AI terminal report", "自绘扫描图：新华网报道的 AR 眼镜、空间相机、同传耳机、机器人与 AI 录音卡片；未升级为单一产品确认。", "Self-drawn scan: AR glasses, spatial cameras, translation earbuds, robots, and AI recorder cards reported by Xinhua; not upgraded to a single confirmed product.", chinaScanUrl);

const newTopics = [
  topic({
    id: "violoop-screen-aware-agent-hardware", section: "wild", evidenceLabel: "startup signal", evidenceStrength: "official product page plus Tom's Guide IFA hands-on; Kickstarter and shipping are future claims", sourceDate: "2026-09-07", visual: violoopVisual,
    zhHeadline: "Violoop 把桌面 agent 的最后一步交给一颗实体确认键", enHeadline: "Violoop puts a physical approval key at the end of the desktop-Agent loop",
    zhFact: "Violoop 是一台接入电脑 HDMI-IN 与 USB-HID 的屏幕感知 AI 硬件盒。官方公开 26 TOPS on-device AI、RK3576 八核、Windows/macOS/Linux、BYOK、无驱动与 hardware approval；Tom's Guide 在 IFA 现场补充了 8B 本地模型、STM32H563 安全处理器、独立供电、HDMI/USB-C 与 9 月 15 日 Kickstarter 计划。",
    enFact: "Violoop is a screen-aware AI hardware box that connects to a computer through HDMI-IN and USB-HID. Its official site lists 26 TOPS on-device AI, an RK3576 octa-core processor, Windows/macOS/Linux support, BYOK, no drivers, and hardware approval; Tom's Guide adds an 8B local model, an STM32H563 security processor, separate power, HDMI/USB-C, and a September 15 Kickstarter plan.",
    zhValue: "它把桌面 agent 的交互拆成三个阶段：设备读取屏幕上下文，先在本地准备下一步，再由用户按下实体键批准真正的动作。官方示例包括从 Gmail 订单抓取客户信息并起草回复、读长 PDF、跨应用填写地址；设备还显示时间和当前 agent 状态。与只在电脑里运行的自动化相比，它把视觉捕捉、动作输出和批准事件分开，试图让用户在复杂任务中保留最后控制点。",
    enValue: "Violoop splits a desktop Agent into three visible stages: the device reads screen context, prepares the next step locally, and the user presses a physical key before the action executes. Public examples include reading an order in Gmail, extracting customer details, drafting a VIP reply, summarising a long PDF, and filling an address across apps. The device also shows time and current Agent state. Compared with automation that lives entirely inside the computer, it separates visual capture, action output, and approval as distinct events so the user keeps a final control point during multi-step work.",
    zhHciLens: ["Input: HDMI 屏幕 + USB-HID", "Compute: RK3576 + 26 TOPS + local model", "Gate: STM32H563 + physical key", "Output: 跨应用动作 + 状态屏"],
    enHciLens: ["Input: HDMI screen + USB-HID", "Compute: RK3576 + 26 TOPS + local model", "Gate: STM32H563 + physical key", "Output: cross-app action + status display"],
    zhImplication: "桌面 agent 的安全感来自可感知的状态转移：看到了什么、准备了什么、哪一步等待批准、批准后发生了什么。实体键不能替代撤销、日志和敏感数据边界，但它把高风险动作从无形的 software permission 变成可审计的 physical event。",
    enImplication: "Trust in a desktop Agent depends on observable state transitions: what it saw, what it prepared, which step awaits approval, and what happened after approval. A hardware key cannot replace undo, logs, or sensitive-data boundaries, but it turns a high-risk action from an invisible software permission into an auditable physical event.",
    sources: [source("Violoop official product page", violoopUrl, "official"), source("Violoop product and field notes", violoopBlogUrl, "startup signal"), source("Tom's Guide IFA hands-on", violoopReviewUrl, "reviews")],
    dossier: { zh: {
      productName: "Violoop（屏幕感知 AI 硬件 agent，startup signal）",
      productType: "Violoop 是一台放在电脑旁的屏幕感知 AI 硬件盒，不依赖主机安装驱动，使用 HDMI-IN 读取画面、USB-HID 发送键鼠控制，并把 agent 的当前状态显示在前面的小屏幕上。官方把它定位为让 Windows、macOS、Linux 电脑进入 agent-ready 状态的 plug-in device，面向跨应用、重复性桌面工作。",
      interactionFlow: "用户把 Violoop 接到电脑与独立电源，设备读取屏幕上的上下文；本地模型先理解当前应用、准备下一步或填充跨应用动作；当任务涉及敏感或多步骤操作时，设备等待用户按下顶部 hardware approval key。批准后，USB-HID 执行动作，前屏显示当前状态。官方页面还描述 BYOK，可使用 Claude、OpenAI 或 Gemini；具体的撤销、失败回退、逐步确认与多显示器流程没有完整公开。",
      specsOrStack: "官方页公开 HDMI 2.0、4K capture、USB-HID、no drivers、26 TOPS on-device AI、RK3576 octa-core、Windows/macOS/Linux、BYOK、local-first privacy 和 physical confirmation key。Tom's Guide 报道 8B 本地模型、STM32H563 独立安全处理器、HDMI/USB-C/电源接口，并称设备需要独立供电。完整 RAM、存储、摄像/采集芯片、屏幕尺寸、功耗、网络、端云分工和 API schema source not stated。",
      useCases: "具体演示覆盖读取 Gmail 订单、提取客户信息、起草 VIP 回复、总结长 PDF、发送地址、跨应用填写表单，以及让 agent 处理重复的桌面工作。它针对的是用户已经有一台可用电脑，却不想为本地 agent 更换整台机器的场景；把视觉输入放到 HDMI，把输出放到 USB-HID，可跨应用工作。涉及付款、发送、删除、账号设置和企业资料时，用户仍需要逐步确认和日志。",
      painPointsSolved: "Violoop 解决三个桌面自动化摩擦：第一，软件 agent 直接占用宿主机 CPU/GPU 和电池；第二，浏览器 DOM 或专用 API 覆盖不了所有桌面应用；第三，用户很难知道 agent 何时已经从‘准备’进入‘执行’。独立设备把屏幕观察与宿主机资源解耦，USB-HID 让它可以操作不同应用，硬件确认键则提供一个无法由 agent 软件自己发出的批准事件。它没有解决错误识别、跨应用权限、不可逆动作和用户疲劳。",
      newTech: "最具体的新技术组合是 screen-aware inference、local-first memory graph 与 hardware-gated execution。官方称三种视觉模型在 10,000+ real software screens 上训练和测试；博客还描述 Qwen 8B Q4 在设备端运行与 STM32H563 安全芯片。产品层面的关键不在单个 TOPS 数字，而在 AI chip 负责准备、security chip 负责决定，按钮直接连接安全芯片，主机或 AI 软件不能伪造按键事件。模型选择和云调用仍可由用户通过 BYOK 控制。",
      availability: "Violoop 官方页显示产品仍在 Kickstarter 倒计时，页面写明 9 月 15 日 09:00 PDT 启动；Tom's Guide 报道 introductory price 为 USD 399、预计 10 月中旬发货，之后预期更广泛售价为 USD 799。它当前属于 startup signal，不是已经完成零售交付的确认产品；地区、税费、退款、最终硬件和软件版本 source not stated。",
      limitsOrUnknowns: "Kickstarter 是否按期上线、最终规格、真实本地模型速度、屏幕内容是否始终不出桌面、云端摘要会发送哪些 filtered text、外部 API key 的安全、多个显示器、HDCP、复制粘贴、无障碍、掉电恢复、动作撤销、长期 memory graph 删除、企业部署与实际发货均需要验证。Tom's Guide 还指出独立供电，意味着‘接上电脑即可用’并不等于零线材成本。",
      productVerdict: "Violoop 是今天最清晰的‘agent 进入桌面外设’startup signal：它把看屏幕、准备动作、物理批准、USB-HID 执行做成一条可观察链路。产品判断：交互命题成立，安全边界比纯软件 agent 更具象；成熟度仍由 Kickstarter、真实跨应用成功率、撤销能力、噪声/隐私与发货决定。"
    }, en: {
      productName: "Violoop, a screen-aware AI hardware Agent and startup signal",
      productType: "Violoop is a small screen-aware AI hardware box that sits beside a computer. It reads the display through HDMI-IN, sends keyboard and mouse control through USB-HID, and shows the current Agent state on a small front display. The official product page positions it as a plug-in device that makes Windows, macOS, and Linux computers Agent-ready without drivers, aimed at repetitive work across many applications.",
      interactionFlow: "The user connects Violoop to a computer and separate power. The device reads screen context, prepares the next step locally, and waits for the user to press a hardware approval key when the task is sensitive or multi-step. After approval, USB-HID performs the action and the front display shows status. The product page also supports BYOK for Claude, OpenAI, or Gemini. Full undo, failure recovery, step-by-step confirmation, multi-display handling, and cancellation states are not completely documented.",
      specsOrStack: "The official site lists HDMI 2.0, 4K capture, USB-HID, no drivers, a 26 TOPS on-device AI accelerator, RK3576 octa-core, Windows/macOS/Linux, BYOK, local-first privacy, and a physical confirmation key. Tom's Guide reports an 8B local model, a separate STM32H563 security processor, HDMI/USB-C/power connections, and external power. RAM, storage, capture silicon, display size, power draw, network behaviour, edge/cloud split, and API schema are source not stated.",
      useCases: "Public examples include reading a Gmail order, extracting customer details, drafting a VIP reply, summarising a long PDF, sending an address, filling forms across applications, and handling repetitive desktop work. The target user already owns a capable computer but does not want to replace it to run a local Agent. HDMI observation and USB-HID output allow work across applications. Payments, sending, deletion, account settings, and enterprise data still need deliberate confirmation and logging.",
      painPointsSolved: "Violoop targets three desktop-automation frictions. Software Agents can consume the host computer's CPU, GPU, and battery; browser DOM or specialised APIs do not cover every desktop application; and users cannot always tell when an Agent has moved from preparation to execution. A separate device decouples screen observation from host resources, USB-HID reaches different applications, and the hardware key creates an approval event that the Agent software cannot issue for itself. It does not solve recognition errors, cross-app permissions, irreversible actions, or approval fatigue.",
      newTech: "The product-level novelty is a combination of screen-aware inference, a local-first memory graph, and hardware-gated execution. Violoop says three vision models are trained and tested on more than 10,000 real software screens; its blog describes a Qwen 8B Q4 model running on-device and an STM32H563 security chip. The important design is that the AI chip prepares while the security chip decides: the button is wired to the security chip, so host software or the Agent cannot forge a press. BYOK gives the user control over model providers and cloud calls.",
      availability: "Violoop's official page shows a Kickstarter countdown for September 15 at 09:00 PDT. Tom's Guide reports an introductory price of USD 399, expected mid-October shipping, and a later expected wider price of USD 799. This remains a startup signal rather than a fully delivered retail product; region, taxes, refunds, final hardware, and software version are source not stated.",
      limitsOrUnknowns: "The campaign date, final specification, real local-model speed, whether screen data always stays on the desk, what filtered text reaches the cloud, API-key security, multiple displays, HDCP, clipboard behaviour, accessibility, power-loss recovery, action undo, memory-graph deletion, enterprise deployment, and actual shipping all need verification. Tom's Guide notes separate power, so plug-and-play does not mean zero cable cost.",
      productVerdict: "Violoop is the clearest new startup signal for an Agent entering the desktop peripheral layer. It makes screen reading, action preparation, physical approval, and USB-HID execution observable as one loop. Verdict: the interaction thesis is strong and the safety boundary is more tangible than a software-only Agent; maturity still depends on Kickstarter, cross-app success, undo, privacy, and delivery evidence."
    }}
  }),
  topic({
    id: "minisforum-local-agent-edge-stack", section: "official", evidenceLabel: "confirmed product", evidenceStrength: "MINISFORUM official IFA announcement plus specialist coverage; retail price and complete SKU availability remain unstated", sourceDate: "2026-09-04", visual: minisforumVisual,
    zhHeadline: "MINISFORUM 把 agent 的本地记忆层做成 N5，前端算力交给 MS-S1", enHeadline: "MINISFORUM splits a local Agent stack between N5 storage and MS-S1 compute",
    zhFact: "MINISFORUM 在 IFA 2026 公布 MS-S1 MAX-P495 AI Mini Workstation 与 N5 MAX-P495 AI Agent NAS：同用 AMD Ryzen AI MAX+ PRO 495，官方称最高 131 TOPS、192GB 8533 MT/s 内存、最高 160GB graphics memory；N5 最高 200TB 本地存储，MS-S1 作为算力前端。",
    enFact: "At IFA 2026, MINISFORUM unveiled the MS-S1 MAX-P495 AI Mini Workstation and N5 MAX-P495 AI Agent NAS. Both use AMD Ryzen AI MAX+ PRO 495; the company lists up to 131 TOPS, 192GB at 8533 MT/s, and up to 160GB graphics memory. N5 adds up to 200TB local storage while MS-S1 acts as the compute front end.",
    zhValue: "这不是单台‘更快的迷你 PC’叙事，而是把 agent 工作拆成前端推理与后端持久数据：MS-S1 负责实时推理、视觉、生成与开发，N5 保存模型、RAG 知识库、embeddings、数据库与长时间运行的 agent。官方明确点名 OpenClaw 与 Hermes；Tom's Hardware 进一步把它描述为在本地运行 agent 的 NAS。它瞄准的是家庭实验室、小团队和不愿把长期数据送进云端的开发者。",
    enValue: "This is not simply a faster mini PC. It splits an Agent workload into front-end inference and back-end persistent data: MS-S1 handles real-time inference, vision, generation, and development, while N5 stores models, RAG knowledge bases, embeddings, databases, and long-running Agents. MINISFORUM explicitly names OpenClaw and Hermes; Tom's Hardware frames the NAS as a place to run Agents locally. The target is a home lab, small team, or developer who does not want a long-lived knowledge layer in the cloud.",
    zhHciLens: ["Input: 本地数据 + 模型", "Compute: MS-S1 前端", "Memory: N5 最高 200TB", "Output: 私有 agent 工作负载"],
    enHciLens: ["Input: local data + models", "Compute: MS-S1 front end", "Memory: N5 up to 200TB", "Output: private Agent workloads"],
    zhImplication: "当 agent 有了长期记忆，产品边界从‘模型跑多快’转向数据放在哪里、谁能访问、如何升级、如何备份与如何停掉长任务。本地化降低云端依赖，却把风扇、功耗、网络隔离、备份和模型运维都转给用户。",
    enImplication: "Once an Agent has persistent memory, the product boundary shifts from model speed to where data lives, who can access it, how it upgrades, how it backs up, and how long-running jobs stop. Local operation reduces cloud dependence but moves thermals, power, network isolation, backup, and model operations to the user.",
    sources: [source("MINISFORUM official IFA announcement", minisforumUrl, "official"), source("Tom's Hardware IFA coverage", minisforumReviewUrl, "reviews"), source("TechRadar IFA Best in Show", minisforumAwardUrl, "reviews")],
    dossier: { zh: {
      productName: "MINISFORUM MS-S1 MAX-P495 + N5 MAX-P495（本地 agent 算力/存储系统，confirmed product）",
      productType: "这是一套由 AI Mini Workstation 与 AI Agent NAS 组成的边端系统。MS-S1 MAX-P495 是承担实时推理、AI 开发、计算机视觉和生成任务的前端；N5 MAX-P495 把本地存储、模型、RAG 知识库、embeddings、数据库与长期运行的 agent 放在后端。官方把它描述为 compute frontend + data/backend infrastructure，而不是只卖一台孤立的 mini PC。",
      interactionFlow: "用户把模型、文档、embeddings、数据库和 agent 运行时部署在本地环境，MS-S1 接收推理或视觉任务并从 N5 读取数据；N5 持续保存知识与工作状态，OpenClaw、Hermes 等 agent 可在本地运行。开发者可把 MS-S1 当低延迟计算前端，把 N5 当持久知识层；家庭或小团队则通过局域网访问自己的模型和文件。官方没有展示完整的安装向导、权限审批、迁移、删除和灾难恢复流程。",
      specsOrStack: "MINISFORUM 官方列出 AMD Ryzen AI MAX+ PRO 495、最高 131 TOPS、192GB 8533 MT/s 内存、最高 160GB graphics memory；N5 MAX-P495 最高 200TB 本地存储。发布材料点名 RAG knowledge bases、AI models、embeddings、databases、OpenClaw 与 Hermes。Tom's Hardware 提到集成 Radeon 8065S GPU；价格、实际内存 SKU、盘位组合、网络接口、噪音、功耗、系统版本、模型兼容矩阵与 API source not stated。",
      useCases: "目标场景包括私有知识库问答、长时间运行的个人 agent、边端视觉、实时推理、模型开发、家庭实验室、企业小型推理节点和需要把数据留在本地的内容工作流。N5 把大量文件与模型放在同一数据层，MS-S1 以更强的前端算力调用它们，适合数据量、模型体量或隐私要求超过普通笔记本的用户。",
      painPointsSolved: "它针对的是云端 agent 的三个实际痛点：长期上下文和文档离开本地、单张 GPU 被多个子任务争抢、以及存储与计算分散在 NAS、工作站和云服务之间。把 N5 做成 agent backend，可减少知识库同步；把 MS-S1 做成 frontend，可承接低延迟推理；统一架构也让用户更容易理解数据与算力的关系。它没有解决本地部署的成本、维护、备份、散热和权限复杂度。",
      newTech: "新技术点是把‘持久 AI’写进硬件分工：存储设备不只是放文件，而是保存模型、embedding、RAG 数据和 agent 状态；工作站也不只是跑模型，而是成为能够驱动外部设备与实时应用的 compute frontend。AMD Ryzen AI MAX+ PRO 495、统一内存、Radeon 图形与高容量本地存储组成一个面向边端 agent 的系统级组合。官方未披露 agent 调度、模型量化、容器、远程访问或数据加密实现。",
      availability: "MINISFORUM 官方于 2026 年 9 月 4 日在 IFA 公布两款产品，并给出 MS-S1 MAX-P495 的 US、EU、UK、FR store link；IFA 展会体验持续至 9 月 8 日。官方发布文没有给出完整的 MSRP、交付日或 N5 的可购买配置，因此只能确认产品发布与地区入口，不能确认每个 SKU 已经现货零售。",
      limitsOrUnknowns: "完整价格、SKU、N5 的实际盘位与存储价格、MS-S1/N5 是否必须配套、闲置功耗、噪音与热管理、Linux/Windows 支持、远程访问、账号权限、加密、备份、故障更换、模型许可、OpenClaw/Hermes 的默认安装状态与真实 token throughput 均 source not stated。大容量本地存储也带来单点故障和家庭网络暴露的风险。",
      productVerdict: "MINISFORUM 把 agent 从软件进程推进成一套可购买的边端基础设施：N5 负责记忆与数据，MS-S1 负责推理与实时前端。产品判断：confirmed product，架构叙事很具体；真正价值要等价格、噪音功耗、模型部署难度、数据恢复和长期支持被独立验证。"
    }, en: {
      productName: "MINISFORUM MS-S1 MAX-P495 plus N5 MAX-P495, a local Agent compute and storage system",
      productType: "This is an edge system made of an AI Mini Workstation and an AI Agent NAS. MS-S1 MAX-P495 is the front end for real-time inference, AI development, computer vision, and generation; N5 MAX-P495 is the back end for local storage, models, RAG knowledge bases, embeddings, databases, and long-running Agents. MINISFORUM describes a compute frontend and data/backend infrastructure rather than one isolated mini PC.",
      interactionFlow: "The user deploys models, documents, embeddings, databases, and Agent runtimes in the local environment. MS-S1 receives an inference or vision job and reads the required data from N5; N5 keeps knowledge and task state over time, while OpenClaw and Hermes can run locally. A developer can treat MS-S1 as low-latency compute and N5 as persistent memory; a home or small team can access its models and files over the local network. The official release does not show the full setup wizard, permission, migration, deletion, or disaster-recovery flow.",
      specsOrStack: "MINISFORUM lists AMD Ryzen AI MAX+ PRO 495, up to 131 TOPS, 192GB at 8533 MT/s, and up to 160GB of graphics memory; N5 MAX-P495 supports up to 200TB of local storage. The release names RAG knowledge bases, AI models, embeddings, databases, OpenClaw, and Hermes. Tom's Hardware mentions an integrated Radeon 8065S GPU. Price, actual memory SKUs, drive configurations, network interfaces, noise, power, operating system, model matrix, and API are source not stated.",
      useCases: "The intended work includes private knowledge-base questions, long-running personal Agents, edge vision, real-time inference, model development, home labs, small enterprise inference nodes, and content workflows where data should remain local. N5 holds a large document and model layer while MS-S1 supplies stronger front-end compute, aimed at users whose data volume, model size, or privacy needs exceed a regular laptop.",
      painPointsSolved: "The system targets three cloud-Agent frictions: long-lived context and documents leave the local environment, one GPU becomes a bottleneck for parallel sub-tasks, and storage and compute are split across a NAS, workstation, and cloud services. Making N5 an Agent backend reduces knowledge synchronisation; making MS-S1 a front end supplies low-latency inference; the system makes the relationship between data and compute easier to reason about. It does not remove the cost, maintenance, backup, thermals, or permission complexity of local deployment.",
      newTech: "The product novelty is writing persistent AI into the hardware split. Storage is no longer only for files; it stores models, embeddings, RAG data, and Agent state. The workstation is no longer only a model box; it becomes a compute front end for real-time applications and connected devices. Ryzen AI MAX+ PRO 495, unified memory, Radeon graphics, and high-capacity local storage form a system-level edge-Agent stack. The release does not disclose scheduling, quantisation, containers, remote access, or encryption implementation.",
      availability: "MINISFORUM announced both products at IFA on September 4, 2026 and provides US, EU, UK, and FR store links for MS-S1 MAX-P495; the public IFA experience runs through September 8. The announcement does not provide a complete MSRP, delivery date, or purchasable N5 configuration. Product announcement and regional entry points are confirmed, but every SKU should not be treated as in-stock retail.",
      limitsOrUnknowns: "Complete price, SKU, N5 drive and storage cost, whether MS-S1 and N5 must be paired, idle power, noise, thermal management, Linux/Windows support, remote access, account permissions, encryption, backup, replacement, model licensing, default OpenClaw/Hermes installation, and real token throughput are source not stated. High-capacity local storage also creates single-failure and home-network exposure risks.",
      productVerdict: "MINISFORUM moves an Agent from a software process toward purchasable edge infrastructure: N5 owns memory and data while MS-S1 owns inference and real-time front-end work. Verdict: confirmed product with a concrete architecture; its value depends on price, noise and power, deployment difficulty, data recovery, and long-term support being independently tested."
    }}
  }),
  topic({
    id: "nvidia-pair-local-inference-router", section: "global", evidenceLabel: "developer surface", evidenceStrength: "NVIDIA official docs, blog, and public GitHub repository; local-network trust and supported engine boundaries remain explicit", sourceDate: "2026-09-03", visual: pairVisual,
    zhHeadline: "NVIDIA PAIR 把家里的多台 GPU 变成 agent 的局域网推理入口", enHeadline: "NVIDIA PAIR turns idle home GPUs into a local inference entry for Agents",
    zhFact: "NVIDIA PAIR 是免费开源的 Personal AI Router：每台机器运行桌面/终端控制面与后台服务，节点互相发现并记录模型与 engine，应用只需访问工作机上的本地地址，PAIR 决定请求由哪台机器服务。官方文档同时给出节点配对、六位 PIN、Ollama/LM Studio 与 API 路由。",
    enFact: "NVIDIA PAIR is a free, open-source Personal AI Router. Each machine runs a desktop or terminal control plane plus background services; nodes discover one another, track engines and models, and route a request from a local address on the working machine to the selected node. Official docs cover pairing with a six-digit PIN, Ollama/LM Studio, and API routing.",
    zhValue: "PAIR 把‘本地 AI’的单位从一台电脑改成一个可信局域网。开发者安装并配对多台机器，应用不必知道后端在哪里；路由器按节点能力与可用性分发独立推理请求，agent 的并行子任务可以不再挤在同一张 GPU 上。它更像一层本地 control plane，而不是模型服务本身：模型、engine、网络和权限仍由用户负责。",
    enValue: "PAIR changes the unit of local AI from one computer to a trusted local network. The developer installs and pairs multiple machines; the application does not need to know which node serves the request. PAIR distributes independent inference jobs based on available engines and capacity, so parallel Agent sub-tasks do not all queue behind one GPU. It is a local control plane rather than a model service: models, engines, network, and permissions remain the user's responsibility.",
    zhHciLens: ["Input: local endpoint", "Control: 节点发现 + PIN", "Routing: engine/model/capacity", "Output: 多机推理请求"],
    enHciLens: ["Input: local endpoint", "Control: discovery + PIN", "Routing: engine/model/capacity", "Output: multi-machine inference"],
    zhImplication: "本地 agent 需要一个可理解的资源层：用户要知道哪台机器在处理、请求是否出网、节点离线时谁接管、以及一个被配对的设备如何撤销。PAIR 把算力分配做成产品界面，下一步应把信任、成本、日志和故障恢复做得同样可见。",
    enImplication: "Local Agents need an understandable resource layer: which machine is processing, whether a request leaves the network, who takes over when a node disappears, and how a paired device is revoked. PAIR makes compute distribution a product surface; trust, cost, logs, and failure recovery need the same visibility.",
    sources: [source("NVIDIA PAIR official overview", pairDocsUrl, "developer surface"), source("NVIDIA PAIR getting started", pairStartUrl, "official"), source("NVIDIA IFA 2026 blog", pairBlogUrl, "official"), source("NVIDIA Personal-AI-Router GitHub", pairGithubUrl, "developer surface")],
    dossier: { zh: {
      productName: "NVIDIA Personal AI Router（PAIR，local inference developer surface）",
      productType: "PAIR 是运行在多台本地电脑上的推理路由与控制面。每台节点有一个桌面窗口或无 GUI 的 terminal interface，以及负责发现节点、记录 engine/model、接收请求和决定路由的后台服务。应用访问当前工作机上的本地地址，看到的接口像它原本支持的 inference engine，因此可以在不重写应用的情况下调用同一局域网中的另一台 GPU 机器。",
      interactionFlow: "用户在希望贡献算力的每台机器安装 PAIR，确认设备位于同一可信局域网；在 Add node 中选择发现的机器，邀请端显示六位 PIN，被邀请端输入并接受。配对后，节点列表显示连接状态，用户再添加模型/engine，把应用指向本地地址。PAIR 发现每台机器拥有的 engine 与模型，并把请求发送到合适节点；节点加入或离开时路由可调整。官方文档提醒共享或不可信网络不要直接配对。",
      specsOrStack: "官方文档明确 PAIR 由 desktop/headless control plane、后台 local Go services、HTTP inference proxies、节点发现、engine/model registry 和 inference dispatcher 组成；官方博客称它可与 Ollama、LM Studio 配合，并把独立请求分发给有空闲能力的 RTX PC。它是免费开源工具。完整支持 GPU 列表、模型格式、调度算法、加密协议、身份生命周期、云端路径、吞吐、功耗与商业支持 source not stated。",
      useCases: "具体场景是家庭或工作室中有多台 RTX PC：一个 coding agent、Hermes 或其他本地应用把复杂任务拆成独立子任务，PAIR 将它们分发给不同节点；也可把一台机器当主要工作站，把另一台闲置电脑贡献给本地推理。它适合本地 agent 实验、批量生成、开发测试和不想把数据送云端的用户，但不等于所有任务都能并行或所有模型都可迁移。",
      painPointsSolved: "PAIR 针对的是本地推理的排队与设备闲置：多个 agent 子任务同时争用一块 GPU 会拉长等待，家庭中其他电脑的算力却可能空闲。把请求入口统一到本地地址，减少应用对具体设备的耦合；节点服务记录 engine 与 model，路由器可以选择可用机器。它没有解决网络延迟、显存不兼容、节点噪音、权限、功耗和本地数据跨设备暴露。",
      newTech: "新技术不在于再发布一个模型，而在于给家庭局域网加一层 inference control plane。PAIR 把‘谁有模型、谁有 engine、谁有空闲能力’从脚本判断变成节点状态；HTTP proxy 让上层应用保持熟悉的 inference API。六位 PIN 做 bootstrap pairing，节点加入或离开会改变可用资源池。NVIDIA 博客把这个组合连接到 Hermes、OpenClaw 等多 agent 工作流，但这仍是工具集成路径，不是所有 agent 默认支持。",
      availability: "NVIDIA 在 2026 年 9 月 3 日的 IFA 博客中公开介绍 PAIR，官方文档与 GitHub 仓库已公开，工具面向 Windows、Linux 和 macOS 页面提供下载/运行入口。PAIR 的公开可用性属于 developer surface；设备兼容、安装方式、Ollama/LM Studio 版本、地区和支持范围要按当前文档与仓库实际状态核对。",
      limitsOrUnknowns: "PAIR 是否能在真实家庭网络稳定发现节点、局域网断开时如何重试、节点被恶意加入如何撤销、PIN 是否足够、请求与模型数据是否跨节点明文、日志含哪些 prompt、不同 GPU 的模型装载与显存错误、调度是否考虑功耗和成本、是否支持多用户隔离均需验证。官方文档明确要求只在可信设备与网络中配对，不能把它当成零配置家庭服务。",
      productVerdict: "PAIR 是把本地 agent 从‘单机性能’推进到‘局域网资源编排’的 developer surface。产品判断：开源、路由入口和节点配对让概念具体，适合开发者验证多机推理；真正的用户价值取决于信任、撤销、日志、故障恢复和异构 GPU 支持，而非节点数量本身。"
    }, en: {
      productName: "NVIDIA Personal AI Router (PAIR), a local-inference developer surface",
      productType: "PAIR is an inference router and control plane that runs across multiple local computers. Each node has a desktop window or headless terminal interface plus background services that discover peers, track engines and models, receive requests, and select a route. An application points to a local address on the working computer and sees an interface that resembles the inference engine it already speaks to, so it can use another GPU on the network without being rewritten.",
      interactionFlow: "The user installs PAIR on every machine that may contribute compute and confirms that the devices are on a trusted local network. In Add node, the user selects a discovered machine; the inviting node shows a six-digit PIN and the invited node enters and accepts it. After pairing, the node list exposes connection state and the user adds models or engines before pointing an application at the local address. PAIR tracks engines and models and routes requests; the official docs warn against pairing across shared or untrusted networks.",
      specsOrStack: "The documentation describes a desktop or headless control plane, local Go services, HTTP inference proxies, node discovery, an engine/model registry, and an inference dispatcher. NVIDIA says PAIR works with Ollama and LM Studio and routes independent requests to compatible RTX PCs with capacity. It is free and open source. A complete GPU list, model formats, scheduler, encryption protocol, identity lifecycle, cloud path, throughput, power, and commercial support are source not stated.",
      useCases: "A concrete scenario is a home or studio with multiple RTX PCs. A coding Agent, Hermes, or another local application splits a complex task into independent jobs while PAIR sends them to different nodes; one machine can remain the main workstation while another idle computer contributes inference. The surface fits local-Agent experiments, batch generation, development testing, and users who do not want to send data to the cloud, but it does not mean every task parallelises or every model moves cleanly.",
      painPointsSolved: "PAIR targets local inference queues and idle devices. Several Agent sub-tasks can compete for one GPU while other computers at home do nothing. A unified local endpoint reduces application coupling to a specific machine, while node services record engines and models so the router can select an available system. It does not remove network latency, VRAM incompatibility, fan noise, permissions, power cost, or data exposure between devices.",
      newTech: "The novelty is adding an inference control plane to a trusted home network rather than launching another model. PAIR turns who has which model, engine, and available capacity from ad-hoc script logic into node state; an HTTP proxy lets applications keep a familiar inference API. A six-digit PIN bootstraps pairing, and the resource pool changes as nodes join or leave. NVIDIA connects the tool to Hermes and OpenClaw multi-Agent workflows, but this is an integration path, not proof that every Agent supports PAIR by default.",
      availability: "NVIDIA introduced PAIR in its September 3, 2026 IFA blog; official documentation and the GitHub repository are public, with pages covering Windows, Linux, and macOS entry points. Public availability is a developer surface. Device compatibility, install method, Ollama and LM Studio versions, regions, and support scope should follow the current documentation and repository rather than an assumption of universal support.",
      limitsOrUnknowns: "Whether PAIR discovers nodes reliably on a real home network, how it retries after disconnects, how a malicious node is revoked, whether a PIN is sufficient, whether prompts and model data cross nodes in clear text, what logs contain, how VRAM errors are handled, whether scheduling considers power and cost, and whether multiple users are isolated all need testing. The docs explicitly require trusted devices and networks, so this is not a zero-configuration family service.",
      productVerdict: "PAIR moves local Agents from single-machine performance toward local-network resource orchestration. Verdict: the open-source router, endpoint, and pairing flow make the idea concrete for developers; user value depends on trust, revocation, logs, recovery, and heterogeneous GPU support rather than node count alone."
    }}
  }),
  topic({
    id: "shenzhen-ai-terminal-showcase-scan", section: "china", dossierKind: "scan", evidenceLabel: "weak/unverified", evidenceStrength: "Xinhua field report; product names, specs, APIs, prices, and availability are not identified", sourceDate: "2026-09-07", visual: chinaVisual,
    zhHeadline: "新华网扫描：深圳展会把 AI 终端写成一张入口清单", enHeadline: "China scan: a Shenzhen showcase turns AI hardware into a list of entry points",
    zhFact: "新华网 9 月 7 日报道深圳亚太媒体高端论坛科技创新成果展，现场出现 AR 眼镜、空间相机、AI 同传耳机、具身物流分拣、AI 3D 打印机、桌面机器人和 AI 录音卡片等类别，并提到华强北 AI 产品销售额同比增长 55% 以上。报道没有为多数展品给出产品名、规格、价格或购买链接。",
    enFact: "On September 7, Xinhua reported from a Shenzhen technology showcase where categories included AR glasses, spatial cameras, AI translation earbuds, embodied logistics sorting, AI 3D printers, desktop robots, and AI recorder cards. It also cited more than 55% year-on-year growth in Huaqiangbei AI product sales, but did not identify most exhibits with product names, specifications, prices, or purchase links.",
    zhValue: "这是一条 source-lane scan，不升级为单一 confirmed product。可确认的产品信号是入口在变多：看见即生成、走一圈复制空间、双方各戴一只耳机完成翻译、机械臂按包裹属性连续分拣、录音卡片把声音带进日常。不可确认的是哪家公司交付了什么、模型在哪里运行、是否能离线、如何授权与售后。下一步只追踪能落到产品页、真机或开发接口的名字。",
    enValue: "This remains a source-lane scan, not a single confirmed product. The observable signal is that the entry points are multiplying: generate from the view, copy a space by walking through it, translate between two people wearing one earbud each, sort parcels with adaptive manipulation, and bring recording into a card form. What cannot be confirmed is which company delivers what, where the model runs, whether it works offline, and how permissions and service operate. The next step is to follow named products that resolve to product pages, hardware, or developer interfaces.",
    zhHciLens: ["Scanned: 展会类别", "Signal: 入口变短", "Missing: 产品身份", "Next: 真机/API/价格"],
    enHciLens: ["Scanned: show categories", "Signal: shorter entry", "Missing: product identity", "Next: hardware/API/price"],
    zhImplication: "展会报道适合做 radar，不适合直接写成产品事实；对 HCI 判断要把‘看到了演示’与‘用户可持续使用’拆开。",
    enImplication: "A show report is useful as radar, not as product fact; HCI analysis must separate seeing a demo from sustaining user value in daily use.",
    sources: [source("新华网深圳 AI 终端展会报道", chinaScanUrl, "china"), source("IFA Berlin 2026 official show context", "https://www.ifa-berlin.com/en/", "global")],
    dossier: { zh: {
      productName: "深圳 AI 终端展会扫描（source-lane scan，weak/unverified）",
      productType: "扫描对象是新华网对深圳亚太媒体高端论坛科技创新成果展与华强北 AI 产品市场的现场报道。它覆盖 AR 眼镜、空间相机、AI 同传耳机、具身物流机器人、AI 3D 打印机、桌面机器人和 AI 录音卡片等产品类别，不对应一个已经确认的品牌 SKU。",
      interactionFlow: "报道描述的交互路径包括戴上 AR 眼镜生成视野内容、手持空间相机走动以复制现场、双方各戴一只同传耳机直接对话、机械臂感知包裹并选择夹取/推动/翻转/摊平、以及通过 AI 终端进入录音与回放。由于展品身份、软件界面和 API 没有完整披露，具体按钮、权限、错误恢复和数据删除均 source not stated。",
      specsOrStack: "报道给出展会类别、139 家具身智能企业集聚的深圳产业数字和华强北 AI 产品销售额同比增长 55% 以上的市场叙述；没有给出大多数产品的芯片、传感器、麦克风、模型、OS、价格、续航、网络或 API。所有规格与单品身份均 source not stated。",
      useCases: "扫描覆盖媒体创作、三维空间记录、跨语言采访、物流分拣、教育/创业/生产级 3D 打印、家庭桌面机器人与随身录音。它说明产品入口正在从手机屏幕扩展到视野、空间、耳朵、机械臂和卡片，但无法证明这些场景已经完成零售、规模化或稳定的日常使用。",
      painPointsSolved: "报道所指向的痛点是创作与记录入口太长、跨语言沟通成本高、物流包裹差异大、3D 打印操作门槛高、以及 AI 终端离真实工作太远。扫描只能确认展示方试图用感知和边端智能缩短链路；不能确认准确率、价格、售后、离线能力或用户是否愿意长期使用。",
      newTech: "信号集中在多模态感知、空间复制、实时翻译、具身操作与端侧智能的组合。新华网还把深圳边端智能开放研究院、算力、感知大模型、核心部件和整机生态放在同一产业叙事里。它是产业/展会 signal，不应被写成某个具体模型或硬件的已交付技术。",
      availability: "来源只说明 9 月 5 日展会现场与华强北市场观察，没有给出可购买链接、价格、发货、支持地区或开发者入口。该条目保持 china source-lane scan 和 weak/unverified 标签。",
      limitsOrUnknowns: "展品名称、厂商、SKU、规格、模型、数据流、隐私、离线、价格、售后、API、真实用户测试和交付日期都未知；55% 销售额增长也无法单独证明 AI 产品质量或留存。下一步只在出现可追溯产品页、真机评测、开发文档或订单证据后升级。",
      productVerdict: "这是一个需要保留的中国 lane radar：入口类别非常具体，但产品证据不足。产品判断：weak/unverified；把它用于发现后续产品，不用于替任何未命名展品背书。"
    }, en: {
      productName: "Shenzhen AI terminal showcase scan, a weak/unverified source-lane scan",
      productType: "The scan follows Xinhua's field report from a Shenzhen technology showcase and its Huaqiangbei market observations. Categories included AR glasses, spatial cameras, AI translation earbuds, embodied logistics robots, AI 3D printers, desktop robots, and AI recorder cards. It does not identify one confirmed brand SKU.",
      interactionFlow: "The report describes wearing AR glasses to generate content from the view, walking with a spatial camera to copy a place, having two people wear translation earbuds, letting arms sense parcels and choose grasp/push/turn/flatten actions, and using an AI terminal for recording and playback. Product identity, software UI, and APIs are not fully disclosed, so buttons, permissions, recovery, and deletion are source not stated.",
      specsOrStack: "The report provides show categories, a local figure of 139 embodied-intelligence companies, and a market statement of more than 55% year-on-year growth in Huaqiangbei AI product sales. It does not provide chips, sensors, microphone count, models, operating systems, prices, battery, network, or APIs for most exhibits. All item-level specifications and identities are source not stated.",
      useCases: "The scan covers media creation, spatial capture, multilingual interviews, parcel sorting, education and production 3D printing, home desktop robots, and portable recording. It shows entry points moving beyond a phone screen toward the view, space, ear, robot arm, and card. It does not prove that these scenarios have completed retail, scaled deployment, or stable everyday use.",
      painPointsSolved: "The reported problems are long creation and recording paths, expensive cross-language communication, varied parcel handling, high 3D-printing barriers, and AI terminals that remain far from real work. The scan can confirm that exhibitors are trying to shorten those loops with sensing and edge intelligence; it cannot confirm accuracy, price, service, offline behaviour, or long-term adoption.",
      newTech: "The signal combines multimodal sensing, spatial capture, real-time translation, embodied manipulation, and edge intelligence. Xinhua also places an open edge-intelligence institute, compute, perception models, core parts, and complete machines in one industrial story. This is an industry and show signal, not a delivered specification for a named model or product.",
      availability: "The source only describes the September 5 showcase and Huaqiangbei market observation. It provides no purchase link, price, shipping, region, or developer entry. The item remains a China source-lane scan with a weak/unverified label.",
      limitsOrUnknowns: "Exhibit name, manufacturer, SKU, specifications, model, data flow, privacy, offline mode, price, service, API, user testing, and delivery date are unknown. A 55% sales-growth statement cannot by itself prove product quality or retention. The next step is to upgrade only when a traceable product page, hands-on review, developer document, or order evidence appears.",
      productVerdict: "This is a useful China-lane radar because the entry categories are concrete but the product evidence is thin. Verdict: weak/unverified; use it to discover follow-up products, not to endorse an unnamed exhibit."
    }}
  })
];

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = structuredClone(issues.find((item) => item.date === previousDate));
if (!previous) throw new Error(`Missing previous issue ${previousDate}`);
const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "AI Daily 2026-09-07：Agent 开始拥有实体批准键，本地算力组成网络";
issue.enTitle = "AI Daily 2026-09-07: Agents gain physical approval while local compute becomes a network";
issue.zhSummary = "IFA 的后半场把 agent 的边界推向三个具体入口：Violoop 用 HDMI 屏幕感知、USB-HID 和实体确认键把准备与执行分开；MINISFORUM 把 MS-S1 前端算力与 N5 本地存储组成持久 AI 基础设施；NVIDIA PAIR 则把多台家用 GPU 变成一个局域网推理入口。新华网深圳展会报道保留为 weak/unverified 的中国 lane scan。";
issue.enSummary = "IFA’s second half pushes Agents into three concrete entry points: Violoop separates preparation from execution with HDMI screen awareness, USB-HID, and a physical approval key; MINISFORUM pairs MS-S1 front-end compute with N5 local storage for persistent AI infrastructure; NVIDIA PAIR turns multiple home GPUs into one local inference entry. Xinhua’s Shenzhen showcase report stays downgraded as a weak/unverified China-lane scan.";
issue.tags = Array.from(new Set(["hardware-gated agents", "screen-aware AI", "local inference", "AI NAS", "IFA 2026", "HCI", ...issue.tags]));
issue.sourceTypes = Array.from(new Set([...issue.sourceTypes, "hardware-gated agent", "local inference", "AI NAS", "developer surface", "china scan"]));
issue.topics = [...newTopics, ...issue.topics.filter((item) => !newTopics.some((fresh) => fresh.id === item.id))];
issue.coverStory = {
  topicId: newTopics[0].id,
  zhTitle: "Violoop 把 agent 的最后一步交给一颗实体确认键",
  enTitle: "Violoop puts a physical approval key at the end of the Agent loop",
  zhSummary: ["Violoop 读取屏幕、准备跨应用动作，再等待用户按下硬件批准键。", "官方公开 local-first、26 TOPS、BYOK 与安全芯片；Tom's Guide 补充了 8B 本地模型与独立供电。", "Kickstarter、真实跨应用成功率、撤销与发货仍需验证。"],
  enSummary: ["Violoop reads the screen, prepares cross-app actions, and waits for a physical approval press.", "The official product page lists local-first, 26 TOPS, BYOK, and a security chip; Tom's Guide adds an 8B local model and separate power.", "Kickstarter, real cross-app success, undo, and shipping still need verification."],
  imagePath: violoopVisual.path, imageWidth: violoopVisual.width, imageHeight: violoopVisual.height, imageSourceUrl: violoopVisual.sourceUrl, primarySourceUrl: violoopUrl,
  evidenceStrength: "startup signal · official product page + IFA hands-on · 2026-09-07",
  whyCover: "The new interface question is no longer whether an Agent can act, but where preparation ends and a human-approved physical action begins."
};
issue.designDesk = {
  zhTitle: "Design Desk：把 agent 的执行边界做成可见状态",
  enTitle: "Design Desk: make an Agent’s execution boundary visible",
  zhIntro: "Violoop、MS-S1/N5 与 PAIR 共同把 agent 从云端聊天框推到桌面外设、家庭机柜和局域网节点；产品必须回答谁在看、谁在算、谁批准、谁能撤销。",
  enIntro: "Violoop, MS-S1/N5, and PAIR move Agents from a cloud chat box into peripherals, home racks, and local nodes; products must show who sees, who computes, who approves, and who can undo.",
  zhItems: [
    { label: "Prepare / execute", body: "把 agent 的观察、计划、等待批准、执行与结果分成可见状态；实体键要与撤销和日志同时存在。" },
    { label: "Local boundary", body: "明确屏幕、prompt、模型、embedding 与日志哪些只留在桌面，哪些会跨节点或进入云端。" },
    { label: "Node trust", body: "PAIR 式配对要有设备身份、撤销、离线、共享网络警告与多用户隔离，不只显示一个 PIN。" },
    { label: "Persistent memory", body: "N5 式本地记忆必须有备份、删除、迁移、恢复和长期任务停止路径。" },
    { label: "Approval fatigue", body: "高风险动作要求确认，低风险重复动作要能批量授权；否则物理键会变成无意义的点击。" },
    { label: "Show scan", body: "展会的 AR、空间相机、翻译耳机和机器人先作为 radar，等产品名、真机、API 与价格再升级。" }
  ],
  enItems: [
    { label: "Prepare / execute", body: "Expose observation, planning, waiting for approval, execution, and result as separate states; pair the key with undo and logs." },
    { label: "Local boundary", body: "Show which screen data, prompts, models, embeddings, and logs stay on the desk and which cross nodes or reach cloud." },
    { label: "Node trust", body: "PAIR-like pairing needs device identity, revocation, offline handling, shared-network warnings, and multi-user isolation, not only a PIN." },
    { label: "Persistent memory", body: "N5-style local memory needs backup, deletion, migration, recovery, and a stop path for long-running jobs." },
    { label: "Approval fatigue", body: "Require confirmation for high-risk actions and batch low-risk repetition, or a physical key becomes meaningless clicking." },
    { label: "Show scan", body: "Keep AR, spatial cameras, translation earbuds, and robots as radar until product names, hardware, APIs, and prices resolve." }
  ]
};
issue.watchlistZh = ["Violoop：Kickstarter 条款、独立供电、屏幕数据边界、跨应用成功率、撤销与实际发货。", "MS-S1 / N5：完整 SKU、价格、噪音功耗、模型部署、数据恢复与长期支持。", "NVIDIA PAIR：节点撤销、日志、异构 GPU、局域网断线、prompt 数据是否跨节点。", "深圳 AI 终端 scan：展品名称、真机、产品页、API、价格和实际交付。", ...issue.watchlistZh];
issue.watchlistEn = ["Violoop: Kickstarter terms, separate power, screen-data boundary, cross-app success, undo, and shipping.", "MS-S1 / N5: complete SKUs, price, noise and power, model deployment, data recovery, and long-term support.", "NVIDIA PAIR: node revocation, logs, heterogeneous GPUs, LAN disconnects, and whether prompts cross nodes.", "Shenzhen AI-terminal scan: exhibit names, hardware, product pages, APIs, prices, and actual delivery.", ...issue.watchlistEn];
issue.sourcesPath = `./${date}/sources.md`;
issue.zhPath = `./${date}/zh/`;
issue.enPath = `./${date}/en/`;
const index = issues.findIndex((item) => item.date === date);
if (index >= 0) issues[index] = issue; else issues.unshift(issue);
await fs.writeFile(dataPath, `${JSON.stringify(issues, null, 2)}\n`);

await fs.mkdir(issueDir, { recursive: true });
await fs.cp(path.join(root, previousDate, "assets"), path.join(issueDir, "assets"), { recursive: true, force: true });
await fs.mkdir(path.join(issueDir, "assets"), { recursive: true });
await fs.writeFile(path.join(issueDir, "assets", "shenzhen-ai-terminal-scan-2026-09-07.svg"), svg("Shenzhen AI terminal scan", "Xinhua field report · signal, not confirmed SKU", [["VIEW", "AR glasses", "generate from sight"], ["SPACE", "spatial camera", "copy a place"], ["VOICE", "translation earbuds", "two people"], ["BODY", "sorting robot", "parcel handling"], ["MAKE", "AI 3D printer", "consumer workflow"], ["GATE", "next evidence", "name + API + price"]], "#f59e0b"));

await fs.mkdir(deckDir, { recursive: true });
await fs.mkdir(path.join(deckDir, "public", "assets"), { recursive: true });
await fs.cp(path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`, "public", "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });
const labels = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const image = (t) => `./public/${t.visual.path}`;
const dossierText = (locale, t) => fields.map((field, i) => `**${labels[locale][i]}** — ${t.dossier[locale][field]}`).join("\n\n");
const links = (t) => t.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="${image(newTopics[0])}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(newTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${newTopics.map((t) => t.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\n**Design Desk** — ${issue.designDesk.zhTitle}。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue with source/date/evidence labels and PDF downloads.`,
  ...newTopics.flatMap((t) => [`# ${t.zhHeadline}\n\n<img src="${image(t)}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${t.evidenceLabel} · ${t.evidenceStrength} · ${t.sourceDate}**\n\n${dossierText("zh", t)}\n\n**Sources** — ${links(t)}`, `# ${t.enHeadline}\n\n<img src="${image(t)}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${t.evidenceLabel} · ${t.evidenceStrength} · ${t.sourceDate}**\n\n${dossierText("en", t)}\n\n**Sources** — ${links(t)}`]),
  `# Design Desk / 设计洞察\n\n${issue.designDesk.zhItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}\n\n${issue.designDesk.enItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}`,
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n${issue.watchlistEn.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((t) => t.sources.map((s) => s.url)))).slice(0, 44).map((url, i) => `${i + 1}. ${url}`).join("\n")}\n\nVisual evidence uses local source-traceable product images, UI screenshots, or clearly labelled self-drawn diagrams with contain positioning and white backgrounds.`
];
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((t) => t.sources).map((s) => [s.url, s])).values());
const laneRows = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"].map((lane) => `| ${lane} | ${issue.topics.some((t) => t.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((t) => t.section === lane).map((t) => t.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((t) => `| ${t.id} | \`${t.visual.path}\` | ${t.visual.sourceUrl} | ${t.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official product pages support confirmed product claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, crowdfunding, research, and patent material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, added: newTopics.length, sources: new Set(issue.topics.flatMap((t) => t.sources.map((s) => s.url))).size, visuals: new Set(issue.topics.map((t) => t.visual.path)).size, deckDir }));
