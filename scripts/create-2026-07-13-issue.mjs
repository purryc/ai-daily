import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const issuesPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(issuesPath, "utf8"));
const previous = issues.find((issue) => issue.date === "2026-07-12");
if (!previous) throw new Error("Missing 2026-07-12 source issue");
const clone = (value) => structuredClone(value);
const source = (label, url) => ({ label, url });
const visual = (file, width, height, title, url, zh, en) => ({
  path: "assets/" + file, width, height, kind: "source-backed screenshot",
  altZh: "真实来源视觉：" + title, altEn: "Source-backed visual: " + title,
  captionZh: zh, captionEn: en, sourceUrl: url
});
const old = Object.fromEntries(previous.topics.map((topic) => [topic.id, clone(topic)]));
const carry = (id, section) => {
  const topic = clone(old[id]);
  if (!topic) throw new Error("Missing previous topic " + id);
  if (section) topic.section = section;
  topic.sourceDate = topic.sourceDate + " · 2026-07-13 follow-up";
  return topic;
};
const makeProduct = (config) => ({
  id: config.id, section: config.section, zhHeadline: config.zhHeadline, enHeadline: config.enHeadline,
  zhFact: config.zh.productName + "：" + config.zh.productType + " 本条按 " + config.evidenceLabel + " 处理；未披露处写 source not stated。",
  enFact: config.en.productName + ": " + config.en.productType + " This item is handled as " + config.evidenceLabel + "; missing details remain source not stated.",
  zhValue: config.zh.productVerdict, enValue: config.en.productVerdict,
  zhHciLens: config.hciZh, enHciLens: config.hciEn, zhImplication: config.zh.painPointsSolved, enImplication: config.en.painPointsSolved,
  sourceDate: config.sourceDate, evidenceLabel: config.evidenceLabel, evidenceStrength: config.evidenceStrength,
  visual: config.visual, sources: config.sources, dossierKind: "product", dossier: { zh: config.zh, en: config.en }
});

const snapUrl = "https://investor.snap.com/news/news-details/2026/Snap-Inc--Debuts-SPECS-Augmented-Reality-Glasses-to-Make-Computing-More-Human/default.aspx";
const snap = makeProduct({
  id: "snap-specs-agent-first-ar-glasses", section: "official",
  zhHeadline: "Snap SPECS 把 AI、空间显示和 agent 开发一起装进独立眼镜",
  enHeadline: "Snap SPECS puts AI, spatial display, and agent development into standalone glasses",
  sourceDate: "2026-06-16 official launch · 2026-07 current pre-order watch",
  evidenceLabel: "confirmed product", evidenceStrength: "confirmed product · official launch · developer surface",
  visual: visual("snap-specs-source-2026-06.jpg", 1920, 1080, "Snap SPECS", snapUrl, "Snap 官方 SPECS 发布图；价格、重量、显示、续航和开发者 API 回到官方发布页核对。", "Snap official SPECS launch visual; price, weight, display, battery, and APIs follow the release."),
  hciZh: ["空间显示层级", "独立设备反馈", "agent 开发入口"], hciEn: ["spatial hierarchy", "standalone feedback", "agent developer entry"],
  sources: [
    source("Snap official SPECS launch", snapUrl),
    source("Snap SPECS product page", "https://www.spectacles.com/"),
    source("TechCrunch SPECS launch report", "https://techcrunch.com/2026/06/16/snap-finally-debuts-its-long-awaited-ar-glasses-specs-and-oof-they-arent-cheap/"),
    source("Snap Lens Studio developer tools", "https://developers.snap.com/lens-studio/")
  ],
  zh: {
    productName: "Snap SPECS",
    productType: "Snap SPECS 是独立运行的 see-through AR 眼镜，位于传统 AI 眼镜和封闭式头显之间。Snap 官方把它定义为把 AI assistance、工作工具、娱乐和共享体验放进现实环境的 wearable computer，不需要 puck 或 tether。预订页、规格和开发者工具确认了产品表面，生态规模与日常留存仍需观察。",
    interactionFlow: "用户佩戴 SPECS，通过视野里的空间显示、手部追踪、语音和 Snap Lenses 互动。官方场景包括方向、空间测量、上下文 AI、屏幕投射、白板和把教育内容叠加到真实物体上。开发者在 Lens Studio 中构建、调试和发布 Lenses；Migration Agent、Spatial Benchmark、Native Development Kit 和 agentic development preview 让入口从滤镜扩大到空间 agent。",
    specsOrStack: "官方列出 47 mm 版本 132 g、52 mm 版本 136 g、51° 视场角、1600 万色、双 Snapdragon 处理器、7 ms motion-to-photon latency、最高 4 小时 mixed-use battery，充电盒再提供四次充电，最多 20 小时 mixed use。系统还包括 display、waveguide、电致变色镜片、手部追踪、Snap OS、Lens Studio 和 AI assistance。处理器型号、RAM、摄像头参数、网络制式和端云分工为 source not stated。",
    useCases: "可验证场景包括现场方向和空间测量、把屏幕或白板带到工作现场、教育和创作 Lens、上下文 AI 提示以及把已有项目迁移到 SPECS。对工作者，价值是保持身体和环境连接；对创作者，价值是空间软件而非手机滤镜。设备重量、续航和开发者内容决定它能否从发布会 demo 进入日常佩戴。",
    painPointsSolved: "SPECS 试图解决手机让人低头、头显隔离环境、普通 AI 眼镜显示能力有限的冲突。更大的私密显示和独立计算减少手机或 tether 依赖；Snap OS 和工具减少硬件到应用的断层。新成本是视觉注意力竞争、手势疲劳、公共空间的采集边界，以及用户能否理解 AI 在何时看见、处理和保存信息。",
    newTech: "增量是自研光学与 waveguide、双 Snapdragon、手部追踪、Snap OS、Spatial Benchmark、Migration Agent 和 Lens Studio 的 agentic development 组合。Snap 还强调访问敏感信息前询问、录制时 LED、优先端侧处理，以及用户对存储、同步、分享和删除的控制。重点不是眼镜里加 chatbot，而是让空间软件拥有可开发、可评估的 agent 表面。",
    availability: "Snap 称 SPECS 已开启预订，价格 2,195 美元，另有 200 美元可退订金，预计 2026 年秋季在美国、英国和法国发货。开发者 preview 正向 Claude Code、Codex 和 Cursor 推出。具体消费者功能、处方镜片、地区扩展、订阅和第三方 agent 权限为 source not stated。",
    limitsOrUnknowns: "关键未知包括 4 小时 mixed-use 在真实空间 AI 负载下是否成立、132–136 g 是否适合长时间佩戴、7 ms 指标覆盖哪一段完整输入链路，以及 Lens 如何获得授权、解释数据采集并恢复错误。2,195 美元也把它放在早期采用者区间。没有长期独立评测，不能把发布会体验视为普遍可用性。",
    productVerdict: "SPECS 是目前最完整的 agent-first hardware 叙事：空间显示、独立计算和开发者工具同时进入产品前台。Snap 要证明的是用户是否愿意长期佩戴一台 2,195 美元、四小时续航的电脑，以及开发者能否做出可理解、可退出、可共享的 agent。若生态成形，AI 眼镜竞争会从“有没有相机”推进到“谁控制空间软件层”。"
  },
  en: {
    productName: "Snap SPECS",
    productType: "Snap SPECS is a standalone see-through AR glasses computer positioned between conventional AI glasses and an enclosed headset. Snap describes it as a wearable computer bringing AI assistance, work tools, entertainment, and shared experiences into the physical world without a puck or tether. The preorder announcement, specifications, and developer tools confirm the product surface; ecosystem scale and daily retention remain open.",
    interactionFlow: "A wearer uses spatial display, hand tracking, voice, and Snap Lenses. Official examples include directions, spatial measurement, contextual AI, screen casting, whiteboards, and educational overlays on real objects. Developers build, debug, and publish Lenses in Lens Studio. A Migration Agent, Spatial Benchmark, Native Development Kit, and agentic-development preview extend the entry point from filters to spatial agents.",
    specsOrStack: "Snap lists a 132-gram 47 mm model, a 136-gram 52 mm model, a 51-degree field of view, 16 million colors, two Snapdragon processors, 7 ms motion-to-photon latency, and up to four hours of mixed-use battery. The case supplies four additional charges, for up to 20 mixed-use hours. The system includes display, waveguide, electrochromic lenses, hand tracking, Snap OS, Lens Studio, and AI assistance. Processor model, RAM, camera details, networking, and edge/cloud split are source not stated.",
    useCases: "Confirmed use cases include directions and spatial measurement, bringing a screen or whiteboard into a work setting, educational and creative Lenses, contextual AI prompts, and migrating projects to SPECS. For workers, the value is keeping body and environment connected; for creators, it is spatial software rather than a phone filter. Weight, battery, and developer content will determine whether it becomes daily wear.",
    painPointsSolved: "SPECS targets the conflict between phones that make people look down, headsets that isolate them, and AI glasses with limited displays. A larger private display and standalone compute reduce phone and tether dependence; Snap OS and tooling reduce the hardware-to-app gap. New costs include visual-attention competition, gesture fatigue, public capture boundaries, and explaining when an AI system sees, processes, or stores information.",
    newTech: "The increment is a combination of optics and waveguide, dual Snapdragon processors, hand tracking, Snap OS, a Spatial Benchmark, a Migration Agent, and agentic development in Lens Studio. Snap also says the glasses ask before sensitive access, show an LED during recording, prioritize on-device processing, and give users control over storage, sync, sharing, and deletion. The shift is a buildable and evaluable spatial-agent surface, not simply a chatbot inside glasses.",
    availability: "Snap says SPECS is available for preorder at $2,195 with a refundable $200 deposit and is expected to ship in fall 2026 in the United States, United Kingdom, and France. Developer previews are rolling out in Claude Code, Codex, and Cursor. Consumer feature scope, prescription options, regional expansion, subscription, and third-party agent permissions are source not stated.",
    limitsOrUnknowns: "Open questions include whether four hours of mixed use survives real spatial-AI workloads, whether 132–136 grams is comfortable for long wear, which complete input path the 7 ms metric covers, and how Lenses obtain consent, explain data use, and recover from errors. The price places SPECS in an early-adopter bracket. A launch demo is not long-term usability evidence.",
    productVerdict: "SPECS is the clearest agent-first hardware proposition in this issue because spatial display, standalone computing, and developer tooling arrive together. Snap must prove that people will wear a $2,195, four-hour computer and that developers can build agents that are legible, stoppable, and shareable. If the ecosystem forms, AI glasses move from ‘does it have a camera?’ to ‘who controls the spatial software layer?’"
  }
});

const evenUrl = "https://techcrunch.com/2026/07/11/smart-glasses-without-a-camera-even-realities-bets-productivity-beats-recording-everyone/";
const even = makeProduct({
  id: "even-g2-camera-free-productivity-glasses", section: "reviews",
  zhHeadline: "Even G2 用无相机、无扬声器换取生产力与社交可接受性",
  enHeadline: "Even G2 trades cameras and speakers for productivity and social acceptability",
  sourceDate: "2026-07-11 review · 2026-07 official product page",
  evidenceLabel: "confirmed product", evidenceStrength: "confirmed product · review/community friction",
  visual: visual("even-g2-source-2026-07.jpg", 1600, 1600, "Even Realities G2", evenUrl, "TechCrunch 2026-07-11 hands-on；官方 G2 页面补充显示、重量、IP65、App 和 Conversate 信息。", "TechCrunch July 11 hands-on; Even's official G2 page supplies display, weight, IP65, app, and Conversate details."),
  hciZh: ["无相机社会契约", "抬头显示阅读节奏", "手机依赖与恢复"], hciEn: ["camera-free social contract", "heads-up reading rhythm", "phone recovery"],
  sources: [
    source("Even G2 official product page", "https://www.evenrealities.com/smart-glasses"),
    source("TechCrunch Even G2 hands-on", evenUrl),
    source("Even Hub developer surface", "https://hub.evenrealities.com/"),
    source("Even support surface", "https://support.evenrealities.com/")
  ],
  zh: {
    productName: "Even Realities G2",
    productType: "Even G2 是带绿色单色 HUD 的无相机智能眼镜，官方强调 camera-free、轻量和日常佩戴；TechCrunch 7 月 11 日 hands-on 指出它没有摄像头和扬声器，功能严重依赖手机连接。它是在社交可接受性、显示生产力和智能程度之间做选择，而不只是少了一个传感器。",
    interactionFlow: "用户用 Even App 配置眼镜，再通过唤醒词、镜腿触控或 Even R1 调用 Even AI、通知、日历、QuickList、导航、翻译、Teleprompt 和 Conversate。官方把 Conversate 拆成 Prep Notes、AI Cues 和 AI Summary：会前准备资料，交谈中获得简短提示，会后在 App 查看摘要。评测指出长段回答会流过视野且难以跳过，户外噪声也会导致唤醒和识别失败。",
    specsOrStack: "官方列出 36 g、magnesium/titanium、640×350、27.5° FoV、60 Hz、1,200 nits、Micro LED、四麦克风、BLE 5.4、IP65、Android/iOS App、最多两天电池和充电盒七次完整充电；还有 35 种翻译语言、98% passthrough 与 −12 到 +12 处方范围。TechCrunch 报道价格 599 美元、无摄像头和无扬声器。芯片、模型、端云边界和实际连续使用时长为 source not stated。",
    useCases: "场景包括把数字和参考资料放入会前 Prep Notes、交谈时获得名词解释、会后摘要、跨语言翻译、演讲提词、通知/日历、无手机导航和快速待办。它适合需要保持眼神接触的沟通者、演讲者、旅行者以及不希望公共拍摄的人。评测也指出，没有会议、翻译或提词需求的普通用户未必有每天佩戴的理由。",
    painPointsSolved: "G2 减少相机眼镜带来的旁观者不安，把通知、字幕和提示移到视线里，降低沟通中的低头频率。无扬声器避免开放音频泄露，却让手机、触控和显示变得更重要。显示能承载的内容越多，越需要控制长段文字、通知噪声、误唤醒和断连恢复，否则智能会变成注意力负担。",
    newTech: "增量是 camera-free wearable stack：Micro LED HUD、四麦克风、Conversate 会前资料和会后摘要、35 语言翻译、Even Hub 与可选控制环。官方把无相机、无录制和低社交摩擦作为设计原则，并说明云端存储需要明确同意。R1 把健康追踪和眼镜控制放在一起，形成跨设备输入，也增加一个硬件购买决策。",
    availability: "Even G2 官方页、支持页和 Even Hub 可访问；TechCrunch 报道 G2 售价 599 美元并已可购买，R1 另售 249 美元。处方镜片和 App 信息可查，但完整国家、交付、售后、第三方开发范围、订阅和企业支持为 source not stated。",
    limitsOrUnknowns: "评测暴露手机连接不稳定、户外噪声识别失败、回答过长无法中断、亮室需要手动调亮，以及 R1 价格和用途不总匹配。官方“两天电池”取决于显示、Conversate、导航和通知负载，测试条件未披露。第三方 App 是否能带来日常动机，也缺少独立长期证据。",
    productVerdict: "Even G2 的路线很清晰：去掉相机和扬声器，换一层更容易被社会接受的文字界面。它的硬件和隐私边界更克制，但手机连接、显示节奏和 first-party software 仍限制使用频率。它是一副有明确设计判断的生产力眼镜，暂时还不是多数人每天都会戴的 AI 入口。"
  },
  en: {
    productName: "Even Realities G2",
    productType: "Even G2 is a camera-free smart-glasses product with a green monochrome heads-up display. Even emphasizes camera-free, lightweight everyday wear; TechCrunch’s July 11 hands-on notes that it has neither cameras nor speakers and remains heavily dependent on a phone connection. It chooses a different balance among social acceptability, display productivity, and intelligence rather than simply omitting a sensor.",
    interactionFlow: "The user configures the glasses in the Even app, then invokes Even AI, notifications, calendar, QuickList, navigation, translation, Teleprompt, and Conversate through a wake word, temple controls, or Even R1. Even breaks Conversate into Prep Notes, AI Cues, and AI Summary: prepare material before a meeting, receive short context prompts during it, and review a recap afterward. The review observed that long answers stream across the display without a way to skip and that outdoor noise can cause activation and recognition failures.",
    specsOrStack: "Even lists a 36-gram magnesium-and-titanium frame, 640×350 resolution, 27.5-degree field of view, 60 Hz, 1,200 nits, Micro LED, four microphones, BLE 5.4, IP65, Android and iOS apps, up to two days of battery, and a case with seven full charges. It also lists 35-language translation, 98% passthrough, and prescription support from -12 to +12. TechCrunch reports a $599 price, no cameras, and no speakers. Chip, model, edge/cloud split, and measured continuous runtime are source not stated.",
    useCases: "Supported jobs include loading figures and references into Prep Notes, receiving a definition when a term appears, generating a post-conversation summary, translating speech, reading a teleprompter, checking notifications and calendar, navigating without a phone, and adding tasks. The product fits users who need eye contact, presenters, travelers, and people who do not want to record nearby. The review also says that without meetings, translation, or teleprompting, many users may lack a daily reason to wear it.",
    painPointsSolved: "G2 reduces bystander anxiety associated with camera glasses and moves notifications, captions, and prompts into the line of sight. No speaker avoids open-audio leakage but increases dependence on phone, touch, and display. As the display can carry more content, the product must control long text, notification noise, false activation, and recovery after disconnect; otherwise intelligence becomes an attention burden.",
    newTech: "The increment is a camera-free wearable stack: Micro LED HUD, four microphones, Conversate pre-meeting context and post-meeting summary, 35-language translation, Even Hub, and an optional ring. Even frames no camera, no recording, and lower social friction as design principles and says cloud storage requires explicit consent. R1 combines health tracking with glasses control, creating cross-device input while adding another hardware purchase decision.",
    availability: "Even’s G2 page, support surface, and Even Hub are public. TechCrunch reports a $599 price and current availability; the R1 is listed at $249 in the review. Prescription and app information is available, but complete countries, delivery, support, third-party scope, subscription, and enterprise offering are source not stated.",
    limitsOrUnknowns: "The review exposes unstable phone connectivity, recognition failures in outdoor noise, answers too long to interrupt, manual brightness adjustment in bright rooms, and an R1 price that does not always match its utility. The two-day battery claim depends on display, Conversate, navigation, and notification load; test conditions are not stated. Independent evidence that third-party apps create daily motivation is also missing.",
    productVerdict: "Even G2 makes a coherent bet: remove cameras and speakers to create a text interface that is easier to accept socially. Its hardware and privacy boundary are restrained, but phone connectivity, reading rhythm, and first-party software depth limit usage frequency. It is a thoughtful productivity-glasses product, not yet a universal AI entry point people will wear every day."
  }
});

const qualcomm = makeProduct({
  id: "qualcomm-snapdragon-reality-elite-on-device-xr", section: "global",
  zhHeadline: "Snapdragon Reality Elite 把端侧大模型能力下沉到 XR 平台",
  enHeadline: "Snapdragon Reality Elite pushes large-model capability into the XR platform",
  sourceDate: "2026-06-16 official platform release · 2026-07 developer watch",
  evidenceLabel: "developer surface", evidenceStrength: "developer surface · platform fact · partner roadmap",
  visual: visual("qualcomm-reality-elite-source-2026-06.png", 1600, 900, "Qualcomm Snapdragon Reality Elite", "https://www.qualcomm.com/xr-vr-ar/products/snapdragon-reality-elite", "Qualcomm 官方 Reality Elite 产品页截图；端侧 AI、XR 显示和能效数字以官方页为准。", "Qualcomm official Reality Elite page screenshot; edge AI, display, and efficiency figures follow the official page."),
  hciZh: ["端云职责", "佩戴舒适度", "实时空间理解"], hciEn: ["edge/cloud responsibility", "wear comfort", "real-time spatial context"],
  sources: [
    source("Qualcomm Reality Elite release", "https://www.qualcomm.com/news/releases/2026/06/qualcomm-takes-spatial-computing-into-the-ai-era-with-snapdragon"),
    source("Qualcomm Reality Elite product page", "https://www.qualcomm.com/xr-vr-ar/products/snapdragon-reality-elite"),
    source("Qualcomm product brief", "https://www.qualcomm.com/content/dam/qcomm-martech/dm-assets/documents/snapdragon-reality-elite-platform-product-brief.pdf"),
    source("XREAL Project Aura", "https://www.xreal.com/project-aura")
  ],
  zh: {
    productName: "Qualcomm Snapdragon Reality Elite",
    productType: "Reality Elite 是面向 XR OEM 和开发者的芯片平台，不是消费者单独购买的眼镜。Qualcomm 6 月 16 日发布页把它定位为支持 all-in-one VST 头显和轻量 tethered OST 眼镜的下一代平台，重点是大语言模型、大视觉模型和空间生成式 AI。它说明 agent 能否在眼镜上低延迟运行，先是底层平台的算力、图形、追踪和能耗问题。",
    interactionFlow: "平台不定义固定的终端界面，而是提供实时视觉、头手追踪、see-through 和端侧 AI。OEM 可把语音、手势、视线和环境视觉送入 LLM/LVM，再把对象识别、空间内容或 agent response 返回镜片与音频层。官方举例包括视觉模型驱动对象生成和实时空间感知；具体产品的唤醒、权限、错误和停止流程仍由 OEM 决定。",
    specsOrStack: "官方披露最高 48 TOPS AI、最高 60% GPU、30% CPU、160% NPU，支持每眼最高 4.4K、90 FPS；相同负载下电池时间最高增加 20%，负载下芯片最高低 12°C，基准为 XR2+ Gen 2。平台支持 LLM/LVM、EVA computer-vision acceleration、VST/OST，首先用于 XREAL Project Aura，后续还有 Play for Dream。芯片型号、模型大小、SDK 版本、价格和上市时间为 source not stated。",
    useCases: "平台支持视觉生成、空间测量、物体识别、头手追踪、沉浸内容和 agent guidance。潜在场景包括理解周围物体、在空间中生成内容、获取环境提示、在工业或培训中连接现场数据与数字孪生。公开来源确认平台能力和合作路线，不能证明某个消费产品已经用 48 TOPS 实现稳定全天候 agent。",
    painPointsSolved: "Reality Elite 解决 XR 的系统约束：强视觉与空间计算需要算力，眼镜又要求低延迟、低发热、低重量和更长续航。若视觉理解全部回云端，网络延迟和隐私边界会破坏交互。把 NPU、GPU、CPU、显示与追踪放在同一平台可以给 OEM 设计余量；平台数字仍需真实设备证明模型、发热和续航能否兼得。",
    newTech: "新技术是把 LLM/LVM、Gaussian Splatting、EVA 视觉加速、手部/头部追踪和 see-through pipeline 放进可扩展 XR silicon。它不等于完整 on-device agent，却让部分感知和推理留在设备端更可行。HCI 重点由此转向：哪些反馈能在交互时间内完成，哪些必须等待云端，用户能否理解两者差异。",
    availability: "Qualcomm 官方产品页与发布页已公开；官方称 Reality Elite 将首先为 XREAL Project Aura 提供基础，并支持 Play for Dream 后续设备。开发者资源、合作设备、SDK 申请、零售上市、地区和终端价格未完整披露。平台本身不能被描述为已经面向消费者可购买。",
    limitsOrUnknowns: "未知包括 48 TOPS 的持续功耗、眼镜散热、模型内存占用、离线能力、摄像头/麦克风数据边界，以及 OEM 是否把平台能力转成可解释的权限和状态。Project Aura 最终规格、价格、发布时间和消费体验仍是 roadmap/partner signal，不能由芯片发布直接推断。",
    productVerdict: "Reality Elite 是 agent-first XR 的基础设施证据，不是产品完成证据。它把“眼镜能否理解环境、及时回应、持续佩戴”拆成芯片、功耗、光学和追踪的系统问题。端侧 AI 会决定交互延迟、隐私和失败模式，最终证明必须来自合作设备，而不是单一 TOPS 数字。"
  },
  en: {
    productName: "Qualcomm Snapdragon Reality Elite",
    productType: "Reality Elite is an XR platform for OEMs and developers, not a consumer glasses product sold on its own. Qualcomm’s June 16 release positions it for all-in-one video-see-through headsets and lightweight tethered optical-see-through glasses, with language models, vision models, and spatial generative AI. It shows that low-latency agents on glasses are first a system problem of compute, graphics, tracking, and power.",
    interactionFlow: "The platform supplies real-time vision, head and hand tracking, see-through processing, and on-device AI rather than one consumer interface. OEMs can send voice, gesture, gaze, and environmental vision into LLM or LVM services and return object recognition, spatial content, or an agent response through lens and audio layers. Qualcomm cites object generation and real-time spatial awareness; wake, permission, error, and stop behavior remain OEM choices.",
    specsOrStack: "Qualcomm lists up to 48 TOPS AI, up to 60% higher GPU, 30% higher CPU, and 160% higher NPU performance, with up to 4.4K per eye at 90 FPS. It claims up to 20% longer battery life at the same workload and a chipset up to 12°C cooler under load, compared with XR2+ Gen 2. The platform supports LLM/LVM, EVA vision acceleration, VST and OST, and comes first to XREAL Project Aura with a future Play for Dream device. Chip model, model size, SDK, price, and release date are source not stated.",
    useCases: "The platform supports visual generation, spatial measurement, object recognition, tracking, immersive content, and agent guidance. Potential jobs include understanding nearby objects, generating content in space, receiving environmental cues, and connecting field data to a digital twin in industrial or training work. Public sources confirm the platform and partner roadmap; they do not prove a consumer product has delivered a stable all-day agent at 48 TOPS.",
    painPointsSolved: "Reality Elite attacks XR’s system constraint: rich vision and spatial computing need power while glasses require low latency, low heat, low weight, and longer battery. Sending all visual understanding to the cloud adds network delay and privacy cost. A common NPU, GPU, CPU, display, and tracking platform gives OEMs headroom; the platform numbers still need a real device to prove model quality, heat, and battery can coexist.",
    newTech: "The stack combines LLM and LVM support, Gaussian Splatting, EVA vision acceleration, head and hand tracking, and a see-through pipeline in scalable XR silicon. It is not a complete on-device agent, but it makes local perception and inference more practical. The HCI consequence is that teams must decide which feedback can arrive within interaction time, which waits for the cloud, and how users understand that difference.",
    availability: "Qualcomm’s official product and release pages are public. Qualcomm says Reality Elite will first underpin XREAL Project Aura and a future Play for Dream device. Developer resources, partner hardware, SDK access, retail launch, regions, and end-product price are not fully disclosed. The platform must not be described as a consumer product already available for purchase.",
    limitsOrUnknowns: "Open questions include sustained power at 48 TOPS, thermal behavior in glasses, model memory use, offline behavior, camera and microphone data boundaries, and whether OEMs turn platform capability into legible permissions and state. Project Aura’s final specifications, price, timing, and consumer experience remain roadmap or partner signals and cannot be inferred from the chip release.",
    productVerdict: "Reality Elite is infrastructure evidence for agent-first XR, not evidence that a finished product exists. It turns ‘can glasses understand, respond, and remain wearable?’ into a joint problem of silicon, power, optics, and tracking. Edge AI will determine latency, privacy, and failure modes; the proof must come from partner devices, not a TOPS number."
  }
});

const mdep = makeProduct({
  id: "microsoft-project-solara-mdep-agent-first-devices", section: "official",
  zhHeadline: "Project Solara/MDEP 把 agent-first 设备变成企业管理面的问题",
  enHeadline: "Project Solara and MDEP turn agent-first devices into an enterprise-management problem",
  sourceDate: "2026-06-02 official Microsoft Build post · 2026-07 platform watch",
  evidenceLabel: "developer surface", evidenceStrength: "developer surface · enterprise platform · not a shipped consumer device",
  visual: visual("mdep-project-solara-source-2026-06.png", 1600, 900, "Microsoft Project Solara and MDEP", "https://techcommunity.microsoft.com/blog/microsoftdeviceecosystemplatformblog/powering-new-devices-and-agent-first-experiences-with-mdep/4524525", "Microsoft MDEP 官方社区文章截图；Project Solara、Entra、Intune、Defender 和跨设备管理以原文为准。", "Microsoft MDEP post screenshot; Project Solara, Entra, Intune, Defender, and fleet management follow the post."),
  hciZh: ["企业身份继承", "设备 fleet 管理", "agent 状态与责任"], hciEn: ["enterprise identity", "fleet management", "agent accountability"],
  sources: [
    source("Microsoft MDEP: Project Solara", "https://techcommunity.microsoft.com/blog/microsoftdeviceecosystemplatformblog/powering-new-devices-and-agent-first-experiences-with-mdep/4524525"),
    source("Project Solara coverage", "https://www.tomshardware.com/tech-industry/artificial-intelligence/microsoft-unveils-project-solara-ai-a-chip-to-cloud-platform-built-to-power-a-new-generation-of-agent-first-enterprise-devices-hardware-designed-to-run-ai-agents-instead-of-traditional-apps"),
    source("Microsoft Entra", "https://www.microsoft.com/en-us/security/business/microsoft-entra"),
    source("Microsoft Intune", "https://www.microsoft.com/en-us/security/business/microsoft-intune")
  ],
  zh: {
    productName: "Microsoft Project Solara / MDEP",
    productType: "Project Solara 是 Microsoft 在 Build 2026 介绍的 chip-to-cloud platform，目标是支持 agent-first enterprise devices；MDEP 是企业设备的 OS 与管理基础。官方把它放在会议室设备、企业手机、数字标牌、工业/IoT endpoint 和 AI-enabled edge device 的共同底座上。它不是已上市终端，而是把设备如何让 agent 工作从单个 App 提升到身份、管理和安全平台。",
    interactionFlow: "终端用户在会议室、工厂、诊所或前台使用 agent 驱动的设备；agent 根据任务和环境被调度，用户看到的是工作目标、提示或设备动作，而非先打开传统 App。管理员通过 Entra 身份、Intune 管理和 Defender for Endpoint 防护设定范围、策略和生命周期。官方承诺是 agent 继承平台保证，不让每个应用重新拼装身份、设备管理和威胁防护。",
    specsOrStack: "官方确认 enterprise-grade OS、Entra identity、Intune management、Defender for Endpoint、跨设备 fleet foundation 与 Project Solara chip-to-cloud 方向。媒体报道进一步提到轻量 edge OS、Azure agent services、持久化 cloud state、agent dispatcher 和 task manager，并称基于 AOSP；这些细节需后续官方文档核对。芯片、AOSP 分支、API、SDK、设备型号、价格、发货和公开开发者资格为 source not stated。",
    useCases: "企业场景覆盖会议室系统、工业 endpoint、诊所、前台、数字标牌、企业手机和其他边缘设备。设备可以把任务交给 agent，由系统按上下文激活适合的 agent，管理员统一管理身份、策略与安全。它解决企业不想为每种新形态重新建立账户、部署、更新和审计体系的问题；真实 partner hardware 和 pilot 仍需验证体验。",
    painPointsSolved: "传统企业设备按 App 和型号分裂，agent-first 设备会让一个任务跨越终端、服务和代理。MDEP 试图把复杂性收回平台：身份、管理、威胁防护、生命周期和信任模型统一。用户收益是少登录和更清楚的边界；风险是 agent 代表组织行动时，责任、权限、日志和人工接管必须比 App 时代更细。",
    newTech: "新组合是 agent dispatcher、task manager、cloud state 与企业 OS 管理面，并让 agent-first device 继承 Entra、Intune、Defender。若 AOSP edge OS 与 Azure agent 服务路线成立，设备会成为 agent 的具身化端点，而不是运行 Office 或 Android App 的容器。最值得验证的是跨设备状态如何同步，以及管理员能否看到 agent 做了什么。",
    availability: "MDEP 官方文章发表于 2026-06-02，Project Solara 被描述为 announced platform，没有给消费者购买路径或终端发布日期。企业合作伙伴、SDK、开发者申请、Azure 服务区域、许可价格和公开试点为 source not stated。本条保持 developer surface/enterprise platform watch，不写成 confirmed shipped product。",
    limitsOrUnknowns: "未知包括 MDEP 暴露的 OS/API、Solara 哪些部分可用、task manager 是否对管理员开放、错误如何回滚、跨设备身份如何最小授权、AOSP 如何与 Windows/Android 共存。企业还需要数据驻留、审计、合规、离线和供应商退出机制，当前来源没有实证细节。",
    productVerdict: "Project Solara/MDEP 把 agent UX 的难题放回系统底座：设备是受身份、策略、生命周期和安全约束的执行节点。Microsoft 尚未交付普通用户可试用的产品，因此判断应保持克制；对企业 HCI 的信号很清楚：设计必须连接 agent 做了什么、代表谁、在哪台设备上做、谁能停止到管理平面。"
  },
  en: {
    productName: "Microsoft Project Solara / MDEP",
    productType: "Project Solara is Microsoft’s Build 2026 chip-to-cloud platform for agent-first enterprise devices; MDEP is the operating and management foundation around it. Microsoft places it across meeting-room systems, enterprise phones, digital signage, industrial and IoT endpoints, and AI-enabled edge devices. It is not a shipped terminal. It moves the question of how devices host agents from individual apps into identity, management, and security infrastructure.",
    interactionFlow: "An end user works in a meeting room, factory, clinic, or front desk through an agent-driven device. The agent is dispatched according to task and context, so the user experiences a work goal, prompt, or device action instead of launching a traditional app. Administrators define scope, policy, and lifecycle through Entra, Intune, and Defender for Endpoint. The promise is that agents inherit those guarantees rather than rebuilding identity, device management, and threat protection in every application.",
    specsOrStack: "Microsoft confirms an enterprise-grade OS, Entra identity, Intune management, Defender for Endpoint protection, a common fleet foundation, and Project Solara’s chip-to-cloud direction. Media coverage adds a lightweight edge OS, Azure agent services, persistent cloud state, an agent dispatcher, and a task manager, reportedly based on AOSP; those details need later official documentation. Chip, AOSP branch, API, SDK, device models, price, shipping, and public developer eligibility are source not stated.",
    useCases: "The enterprise scope covers meeting-room systems, industrial endpoints, clinics, front desks, digital signage, enterprise phones, and other edge devices. A task can be routed to an agent while the platform activates the appropriate agent according to context and administrators manage identity, policy, and security centrally. This addresses the need to avoid rebuilding accounts, deployment, updates, and audit controls for every new form factor; partner hardware and pilots still have to validate the experience.",
    painPointsSolved: "Traditional enterprise devices split work by app and model; agent-first devices will send tasks across terminals, services, and agents. MDEP tries to pull identity, management, threat protection, lifecycle, and trust into one platform. Users may get fewer sign-ins and clearer boundaries. The risk is that when an agent acts for an organization, responsibility, permissions, logs, and human takeover must be more explicit than in the app era.",
    newTech: "The pattern combines an agent dispatcher, task manager, cloud state, and enterprise OS controls, letting devices inherit Entra, Intune, and Defender. If the AOSP edge-OS and Azure-agent route holds, a device becomes an embodied endpoint rather than a container for Office or Android apps. The key test is cross-device state and administrator visibility: can managers see what the agent did, not merely that a device is online?",
    availability: "The MDEP post was published on June 2, 2026 and describes Project Solara as an announced platform, with no consumer purchase path or end-device release date. Enterprise partners, SDK access, developer enrollment, Azure regions, license pricing, and public pilots are source not stated. This remains a developer-surface and enterprise-platform watch, not a confirmed shipped product.",
    limitsOrUnknowns: "Open questions include what OS and API MDEP exposes, which Solara components are available, whether the task manager is visible to administrators, how errors roll back, how cross-device identity is least-privileged, and how AOSP coexists with Windows and Android. Enterprise buyers also need residency, audit, compliance, offline behavior, and an exit path; current sources provide no empirical details.",
    productVerdict: "Project Solara and MDEP place agent UX back in the system foundation. A device becomes an execution node constrained by identity, policy, lifecycle, and security. Microsoft has not delivered a normal-user product to test, so the claim should remain measured. For enterprise HCI, the signal is clear: design must connect what the agent did, for whom, on which device, and who can stop it to the management plane."
  }
});

const topics = [
  snap, even, qualcomm, mdep,
  carry("meta-ai-glasses-privacy-controls", "reviews"),
  carry("community-ai-glasses-friction-scan", "community"),
  carry("openai-gpt-live-voice-interface", "official"),
  carry("acti-agentic-keyboard", "wild"),
  carry("nvidia-xr-ai-viture-helix", "global"),
  carry("zai-zcode-china-global", "china"),
  carry("china-ai-glasses-os-scan", "china"),
  carry("wearable-agent-research-patent-watch-scan", "research"),
  carry("patent-lane-glasses-ip-scan", "patent")
];

const issue = {
  date: "2026-07-13", timezone: "America/Toronto",
  zhTitle: "AI Daily 2026-07-13：Agent-first 硬件开始争夺空间软件层",
  enTitle: "AI Daily 2026-07-13: Agent-First Hardware Starts Fighting for the Spatial Software Layer",
  zhSummary: "Snap SPECS 把独立 AR、空间显示和 agent 开发推向同一产品；Even G2 用无相机路线换取社交可接受性；Qualcomm 与 Microsoft 分别从芯片和企业底座补齐 agent-first 设备基础设施。核心问题从 AI 能不能回答转成谁控制设备、空间和执行状态。",
  enSummary: "Snap SPECS puts standalone AR, spatial display, and agent development on one product surface; Even G2 trades cameras for social acceptability; Qualcomm and Microsoft fill in the silicon and enterprise foundations. The question moves from whether AI can answer to who controls the device, the space, and the execution state.",
  tags: ["Snap SPECS", "Even G2", "spatial AI", "on-device AI", "Project Solara", "AI glasses", "agent UX", "HCI"],
  sourceTypes: ["official", "reviews", "community", "wild", "research", "patent", "china", "global"],
  zhPath: "./2026-07-13/zh/", enPath: "./2026-07-13/en/", sourcesPath: "./2026-07-13/sources.md",
  coverStory: {
    topicId: "snap-specs-agent-first-ar-glasses",
    zhTitle: "Agent-first 硬件开始争夺空间软件层",
    enTitle: "Agent-first hardware starts fighting for the spatial software layer",
    imagePath: "assets/snap-specs-source-2026-06.jpg", imageWidth: 1920, imageHeight: 1080,
    primarySourceUrl: snapUrl, imageSourceUrl: snapUrl,
    evidenceStrength: "confirmed product · Snap SPECS · standalone AR · developer surface",
    whyCover: "SPECS is the clearest current product surface where spatial display, standalone compute, AI assistance, and agentic developer tooling arrive together; Even, Qualcomm, and MDEP reveal the competing social, silicon, and enterprise constraints.",
    zhSummary: ["Snap SPECS 把 AI、空间显示、手部追踪、独立计算和 Lens 开发工具放进同一件可穿戴设备。", "Even G2 证明另一条路线：删掉相机和扬声器，换取更容易被旁观者接受的生产力 HUD。", "Qualcomm 与 Microsoft 说明，空间 agent 的竞争最终会下沉到端侧算力、设备管理和责任链。"],
    enSummary: ["Snap SPECS puts AI, spatial display, hand tracking, standalone computing, and Lens development in one wearable.", "Even G2 shows the opposite bet: remove cameras and speakers to make a productivity HUD easier for bystanders to accept.", "Qualcomm and Microsoft show that spatial-agent competition reaches silicon, device management, and accountability."]
  },
  designDesk: {
    zhTitle: "Design Desk：硬件一旦成为 agent 的身体，状态就必须可见",
    enTitle: "Design Desk: Once hardware becomes an agent’s body, state must be visible",
    zhIntro: "今天的产品事实共同指向一项界面任务：用户必须知道设备看到了什么、agent 在哪台设备上运行、哪些内容在端侧、谁能停止，以及失败后如何回到原任务。",
    enIntro: "Today’s product facts point to one interface task: users need to know what the device sees, where the agent is running, what stays on-device, who can stop it, and how to return after failure.",
    zhItems: [
      { label: "空间显示不能只追求更大", body: "SPECS 把 51° 视场和私密屏幕带到现场；真正的问题是如何在方向、工作、娱乐和 agent 提示之间管理注意力。" },
      { label: "无相机是社交设计选择", body: "Even G2 把隐私边界前置到硬件，但无相机也意味着更多手机依赖和更少环境理解。" },
      { label: "端侧与云端要被用户理解", body: "Reality Elite 的端侧能力会改变延迟和隐私，最终设备必须解释哪些操作离线完成、哪些等待云端。" },
      { label: "企业 agent 需要管理面可见性", body: "MDEP/Project Solara 把 Entra、Intune、Defender 与执行连接；管理员需要看到 agent 做了什么、代表谁、在哪台设备上做。" },
      { label: "低摩擦触发要配高质量恢复", body: "GPT-Live、Acti 和眼镜都让入口更近；越容易触发，越要给出确认、状态、停止、撤销和原始上下文恢复。" },
      { label: "研究、专利和中国 scan 继续降级", body: "VisionClaw、专利与中国 AIOS 线索可以提出设计问题，但没有运行和长期用户证据时保持降级标签。" }
    ],
    enItems: [
      { label: "A spatial display is not just a bigger screen", body: "SPECS brings a 51-degree view into the environment. The product challenge is attention allocation across directions, work, entertainment, and agent prompts." },
      { label: "Camera-free is a social design choice", body: "Even G2 makes privacy legible in hardware, but the absence of a camera also means more phone dependence and less environmental understanding." },
      { label: "Edge and cloud boundaries need explanation", body: "Reality Elite changes latency and privacy. The finished device must explain what runs offline, what waits for the cloud, and whether data leaves the glasses." },
      { label: "Enterprise agents need a management view", body: "MDEP and Project Solara connect Entra, Intune, Defender, and execution. Managers need to see what the agent did, for whom, and on which device." },
      { label: "Low-friction triggers need recovery", body: "GPT-Live, Acti, and glasses bring the entry point closer. Short confirmation, live state, stop, undo, and context recovery become more important." },
      { label: "Research, patent, and China scans stay downgraded", body: "VisionClaw, patent, and China AIOS signals frame the next question, but remain downgraded without runtime and long-term user evidence." }
    ]
  },
  watchlistZh: ["Snap SPECS：秋季发货、4 小时 mixed-use 续航、Lenses 的真实 agent 质量与隐私状态。", "Even G2：手机连接、户外识别、Conversate 节奏、第三方 App 是否带来日常频率。", "Reality Elite / XREAL Project Aura：最终重量、价格、端侧模型、散热和可购买时间。", "Project Solara/MDEP：公开 API、试点设备、dispatcher 管理面与企业审计。", "中国 AI 眼镜、VisionClaw 与专利：保持 source-lane、research、patent 降级，等待可复现证据。"],
  watchlistEn: ["Snap SPECS: fall shipping, four-hour mixed-use battery, real agent quality in Lenses, and privacy state.", "Even G2: phone connectivity, outdoor recognition, Conversate pacing, and whether third-party apps create daily use.", "Reality Elite and XREAL Project Aura: final weight, price, edge models, thermals, and purchase timing.", "Project Solara/MDEP: public APIs, pilot devices, dispatcher administration, and enterprise audit.", "China AI glasses, VisionClaw, and patents: keep downgrades until reproducible product evidence appears."],
  topics
};

await fs.writeFile(issuesPath, JSON.stringify([issue, ...issues.filter((item) => item.date !== "2026-07-13")], null, 2) + "\n");
console.log("Created 2026-07-13: " + topics.length + " topics, " + new Set(topics.flatMap((topic) => topic.sources.map((item) => item.url))).size + " unique sources.");
