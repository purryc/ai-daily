import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-10-05";
const previousDate = "2026-10-04";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const previousIssueDir = path.join(root, previousDate);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const previousDeck = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`);
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`Missing previous issue ${previousDate}`);
const base = previous.topics.find((item) => item.id === "googlebook-gemini-intelligence-laptop-2026-09-22");
if (!base) throw new Error("Missing Googlebook baseline topic");

const fresh = structuredClone(base);
fresh.id = "googlebook-launch-day-cross-device-follow-up-2026-10-05";
fresh.sourceDate = "2026-10-04 US launch / 2026-10-05 international shelf date follow-up";
fresh.evidenceStrength = "Google official launch schedule plus hands-on and community launch-day signals; availability and phone-collaboration behavior vary by market and model";
fresh.zhHeadline = "Googlebook 上架日：跨设备 AI 先撞上地区与手机协同摩擦";
fresh.enHeadline = "Googlebook launch day: cross-device AI meets regional and phone-link friction";
fresh.zhFact = "Googlebook 按官方节奏在美国 10 月 4 日上架，并于 10 月 5 日进入加拿大、英国、爱尔兰、法国、德国和澳大利亚等市场。首发仍是 Acer、Asus、Dell、HP、Lenovo 五个合作方，价格从 899 美元起；发布日社区反馈开始暴露手机协同入口、库存和具体 SKU 的实际差异。";
fresh.enFact = "Googlebook followed Google's schedule with U.S. shelf availability on October 4 and launches in Canada, the U.K., Ireland, France, Germany, and Australia on October 5. The first wave remains five partner brands—Acer, Asus, Dell, HP, and Lenovo—from $899, while launch-day community reports are beginning to expose differences in phone collaboration, inventory, and exact SKUs.";
fresh.zhValue = "上市日把 Googlebook 从一套发布会能力表变成了可以被购买、配对和退换的系统产品。真正的产品问题不再是有没有 Magic Pointer，而是用户买到哪一款、能否在自己的 Android 手机上完成连接、后台 Spark 任务是否按承诺继续，以及地区商店是否给出同样的功能。";
fresh.enValue = "Launch day turns Googlebook from a feature list into a system that can be purchased, paired, supported, and returned. The practical questions are no longer whether Magic Pointer exists, but which SKU a user receives, whether their Android phone completes the link, whether background Spark work continues as promised, and whether regional stores expose the same capability.";
fresh.zhImplication = "今天的验收应从宣传功能切到跨设备闭环：首启能否发现手机要求，连接失败是否说明原因，手机不在身边时哪些功能仍可用，后台任务在哪里查看和停止，地区/机型差异是否在购买前被明确标出。社区帖只能作为 launch-day friction signal，不能替代批量稳定性数据。";
fresh.enImplication = "Today's acceptance test should move from advertised features to the cross-device loop: whether setup explains the phone requirement, whether link failure has a cause, what works without the phone nearby, where background tasks can be inspected and stopped, and whether regional or model differences are disclosed before purchase. Community posts are launch-day friction signals, not population-level reliability data.";
fresh.visual = structuredClone(base.visual);
fresh.visual.captionZh = "Googlebook 官方视觉用于上市日 follow-up；发布日期、区域上市顺序和跨设备能力以 Google 公告为事实来源，社区截图不替代官方规格。";
fresh.visual.captionEn = "Googlebook official visual for the launch-day follow-up; Google's announcement supplies the launch schedule and cross-device facts, while community reports do not replace official specifications.";
fresh.sources = [
  { label: "Googlebook official first look and launch schedule", url: "https://blog.google/products-and-platforms/devices/googlebook/first-look-googlebook/", type: "official" },
  { label: "PCWorld launch-day hands-on", url: "https://www.pcworld.com/article/3239947/the-first-googlebooks-are-here-i-tried-all-5-from-acer-dell-hp-asus-and-lenovo.html", type: "reviews" },
  { label: "TechRadar Googlebook vs Chromebook", url: "https://www.techradar.com/computing/chromebooks/googlebook-vs-chromebook", type: "reviews" },
  { label: "Googlebook first impressions community thread", url: "https://www.reddit.com/r/Googlebook/comments/1wx0c3s/googlebook_first_impressions_megathread/", type: "community" },
  { label: "Googlebook Android-link community friction", url: "https://www.reddit.com/r/Googlebook/comments/1wxqk8m/day1_with_my_acer14/", type: "community" }
];
fresh.dossier.zh.availability = "Google 官方给出的上市节奏是美国 10 月 4 日、加拿大、英国、爱尔兰、法国、德国和澳大利亚 10 月 5 日；首发合作方为 Acer、Asus、Dell、HP、Lenovo，价格从 899 美元起。上市日社区帖子报告了库存、地区商店展示和 Android 手机协同入口的差异，但这些是个体摩擦信号。当地 SKU、库存、税费、退换政策、手机兼容矩阵和每项功能的实际开放时间仍应以当地商店和设备版本为准。";
fresh.dossier.en.availability = "Google's announced shelf schedule is October 4 in the United States and October 5 in Canada, the United Kingdom, Ireland, France, Germany, and Australia. The first wave comes from Acer, Asus, Dell, HP, and Lenovo, starting at $899. Launch-day community posts report differences in stock, regional storefront presentation, and Android-phone collaboration, but these are individual friction signals. Local SKU, inventory, tax, returns, phone-compatibility matrix, and the actual activation time for each feature still depend on the regional store and device version.";
fresh.dossier.zh.userVoice = "PCWorld 和 TechRadar 提供了五款首发机型的上手与定位判断；上市日 Reddit 帖子开始反馈部分用户尚未看到手机协同入口、不同商店库存和具体机型选择差异。它们能指出首日摩擦，却不能证明所有地区、账号或机型都出现同样问题，也不能替代长期续航和后台任务成功率测试。";
fresh.dossier.en.userVoice = "PCWorld and TechRadar provide hands-on and positioning signals across the five launch models. Launch-day Reddit posts report that some users have not yet seen phone-collaboration entry points, while inventory and model selection differ by store. These posts identify first-day friction, but do not establish that every market, account, or model behaves the same, and they do not replace long-term battery or background-task testing.";
fresh.dossier.zh.productVerdict = "Googlebook 已从预订页进入真实上市与首启阶段。产品判断：它把 Android 手机、指针、窗口和后台 Agent 绑定成一套桌面层，但上市日首先暴露的是可发现性、地区 SKU、手机配对和功能 rollout 的系统摩擦。购买前要确认机型、地区、Android 版本与手机协同状态；验收时优先测连接失败、任务可见性和撤销，而不是只数 AI 功能。";
fresh.dossier.en.productVerdict = "Googlebook has moved from preorder pages into real shelf availability and first-run setup. Verdict: it binds the Android phone, pointer, window, and background agent into a desktop layer, but launch day first exposes system friction around discoverability, regional SKUs, phone pairing, and feature rollout. Before buying, verify the model, region, Android version, and phone-collaboration state; acceptance should prioritise link failure, task visibility, and undo rather than counting AI features.";

const makeProduct = (input) => ({ dossierKind: "product", ...input });
const glasskit = makeProduct({
  id: "glasskit-open-source-smart-glasses-agent-platform-2026-10-05",
  section: "wild",
  sourceDate: "2026-10-05 current source sweep",
  evidenceLabel: "developer surface",
  evidenceStrength: "GlassKit official site and public GitHub repository; open-source toolkit is concrete, while production deployments and supported hardware remain limited",
  zhHeadline: "GlassKit：把智能眼镜工作流变成可测试的 Agent 模板",
  enHeadline: "GlassKit turns smart-glasses workflows into testable agent templates",
  zhFact: "GlassKit 是开源的智能眼镜开发平台，公开提供 agent skill、开发指南、可运行示例与 vision evals。当前示例集中在 Rokid Glasses，把摄像头、麦克风、扬声器、单色 HUD、触控板、离线语音、WebRTC、OpenAI Realtime、Overshoot 与目标检测接进工作流；官方示例包括饮品制作、寿司计时和家具组装。它是 developer surface，不是已经普遍交付的终端产品。",
  enFact: "GlassKit is an open-source developer platform for smart-glasses apps, with an agent skill, development guides, runnable examples, and vision evaluations. Its current examples focus on Rokid Glasses and connect camera, microphone, speaker, monochrome HUD, touchpad, offline voice, WebRTC, OpenAI Realtime, Overshoot, and object detection. Public demos include drink-making, sushi timing, and furniture assembly. It is a developer surface, not a broadly delivered end-user product.",
  zhValue: "GlassKit 的价值在于把眼镜 Agent 从一次性演示拆成设备端采集、媒体传输、后端状态机、模型/工具调用和佩戴者反馈几个可替换层。开发者不必从零处理 HUD 字数、语音打断、相机帧和工作流进度，产品团队也可以用 evals 重放视觉回归。它把“能不能做一个 demo”推进到“能不能稳定测试一个现场任务”。",
  enValue: "GlassKit's value is architectural: it splits a glasses agent into device capture, media transport, backend state, model and tool calls, and wearer feedback. Developers do not have to rebuild HUD constraints, voice interruption, camera frames, and workflow progress from scratch, while teams can replay vision regressions with evaluations. It moves the question from whether a demo can be made to whether a field workflow can be tested repeatedly.",
  zhHciLens: ["入口：摄像头、麦克风、触控板、离线语音", "上下文：连续第一视角画面与工作流步骤", "动作：语音提示、HUD 指引、工具调用与进度检查", "边界：设备差异、网络、API key、隐私和人工接管"],
  enHciLens: ["Input: camera, microphone, touchpad, and offline voice", "Context: live first-person video and workflow steps", "Action: spoken prompts, HUD guidance, tool calls, and progress checks", "Boundary: device variance, network, API keys, privacy, and human takeover"],
  zhImplication: "智能眼镜应用的交互质量不只由模型决定，还受画面节奏、HUD 长度、音频打断、网络抖动和任务状态影响。GlassKit 把这些变量放进模板和 evals，是很具体的产品化方向；但产品团队仍需为低置信度、断流、误纠正和旁人入镜定义停止规则，开源仓库的可运行不等于现场安全。",
  enImplication: "Smart-glasses interaction quality is shaped by frame cadence, HUD length, audio interruption, network jitter, and workflow state as much as by the model. GlassKit makes those variables more testable through templates and evals. Teams still need explicit stop rules for low confidence, stream loss, wrong corrections, and bystanders; a runnable repository is not field-safety evidence.",
  visual: { path: "assets/glasskit-opengraph.png", width: 1200, height: 630, kind: "source-backed developer-page visual", altZh: "GlassKit 开源智能眼镜开发平台页面视觉", altEn: "GlassKit open-source smart-glasses developer platform visual", captionZh: "GlassKit 官方视觉：为 Rokid Glasses 提供摄像头、音频、HUD、WebRTC、模型与工作流示例。", captionEn: "GlassKit official visual: camera, audio, HUD, WebRTC, model, and workflow examples for Rokid Glasses.", sourceUrl: "https://glasskit.ai/" },
  sources: [
    { label: "GlassKit official platform", url: "https://glasskit.ai/", type: "wild" },
    { label: "GlassKit GitHub repository and architecture", url: "https://github.com/RealComputer/GlassKit", type: "developer docs" },
    { label: "Rokid Glasses official product context", url: "https://global.rokid.com/products/rokid-glasses", type: "official" }
  ],
  dossier: {
    zh: {
      productName: "GlassKit 是面向智能眼镜应用的开源开发平台，包含 agent skill、模板、设备接入示例、工作流代码和视觉评测工具。它当前以 Rokid Glasses 为主要设备目标，把硬件输入、媒体管线、模型/工具调用和佩戴者反馈组织成可复用的项目骨架。它交付的是 developer surface 与代码资产，不是一个消费者可以直接购买的 AI 眼镜。",
      productType: "产品类型是 smart-glasses agent SDK / toolkit。公开仓库把一个典型应用拆成 Rokid Android app、WebRTC 实时媒体、后端会话与决策层、HUD 与音频反馈四部分，并提供跨平台 vision evals。它还把 OpenAI Realtime、Overshoot、object detection、touchpad 与 offline voice 作为示例能力；实际项目可以替换模型、后端和设备，但不能假设所有眼镜都有同样的摄像头、HUD、麦克风或权限。",
      interactionFlow: "佩戴者通过相机和麦克风输入现场画面与语音，用触控板或离线语音控制应用；眼镜端捕获数据并通过 WebRTC 送到后端，后端协调模型、工具与工作流状态，再把下一步说明通过扬声器或 HUD 返回。公开 demo 展示饮品制作、寿司计时和家具组装，系统可以观察进度、说出下一步并在错误时纠正。完整的低置信度确认、暂停、断流恢复和人工接管仍需开发者自己定义。",
      specsOrStack: "GitHub README 明确列出 Android/Rokid app、camera/microphone capture、WebRTC、backend、HUD、touchpad、offline voice、OpenAI Realtime、Overshoot 和 object detection 等组件。部分示例需要 Rokid Glasses 与开发线、Android Studio、uv 或 Node；某些服务需要 API keys。仓库没有给出统一的端到端延迟、功耗、模型成本、所有支持机型、数据保留周期或生产 SLA，这些均为 source not stated。",
      useCases: "具体示例包括按现场食材指导饮品制作、在寿司流程中实时计时并检查完成步骤、在家具组装中播报下一步和回答问题，以及把专家 POV 视频转成新工人可跟随的眼镜助手。GlassKit 也适合制造、现场服务和需要双手工作的培训任务。它证明了工作流模板和开发入口，不证明每个行业任务已经具备足够准确率、网络韧性或安全认证。",
      painPointsSolved: "它解决开发团队重复处理设备接入、媒体串流、HUD 文本约束、语音控制、工作流状态和视觉回归的问题。通过可运行示例，团队能更快比较 prompt、模型和应用逻辑；通过 evals，可在不重复执行整套物理任务的情况下捕捉视觉回归。它没有自动解决硬件碎片化、现场网络、API 成本、敏感画面治理、错误指导或企业身份与权限。",
      userVoice: "公开材料主要是官方 demo 与 GitHub 开发者入口，尚未找到足够独立的长期现场评测。GitHub 的公开 star、issue 和贡献状态可以说明项目可被发现与使用，但不能推出生产稳定性、任务成功率或佩戴者舒适度。应把它读作 developer surface 与 startup/open-source signal，而非成熟产品体验评价。",
      newTech: "新技术点不是一个新模型，而是把智能眼镜的实时视觉 Agent 拆成可运行的设备—媒体—后端—工具—反馈链，并将 vision evals 纳入开源工作流。它还示范了本地语音/隐私处理与云端模型协同的边界，让团队能针对不同任务选择本地或远端组件。长期价值取决于多设备抽象、断网降级和 eval 与真实现场的一致性。",
      availability: "GlassKit 官方站提供 GitHub、文档、Discord 与示例入口，仓库公开可访问，许可证标为 MIT。当前设备集成和 demo 重点是 Rokid Glasses，官方说更多眼镜平台计划支持。开发者可以阅读和运行代码，但所需硬件、API keys、模型服务、部署环境和支持范围随示例变化；公开资料没有承诺托管服务、商业支持、稳定版本或行业认证。",
      limitsOrUnknowns: "未知包括多品牌眼镜适配、Android 权限、WebRTC 在弱网下的表现、视频是否默认上传、日志与图像留存、API key 隔离、模型成本、HUD 可读性、误纠正的责任、多人场景的隐私和现场停机策略。仓库可运行不等于生产 SLA；产品团队需要把每一个模型输出都放进可暂停、可回退的任务状态机。",
      productVerdict: "GlassKit 是 developer surface，具体程度高于概念性平台页。产品判断：它把智能眼镜 Agent 的难题从‘再接一个模型’拉回到设备输入、实时媒体、工作流状态和可重复评测；对于要做现场产品的团队，最大的价值是缩短从 demo 到可测试任务的路径。下一关是跨设备适配、断网、隐私与人工接管，而不是增加更多示例。"
    },
    en: {
      productName: "GlassKit is an open-source development platform for smart-glasses applications, with an agent skill, templates, device examples, workflow code, and vision evaluations. Its current device focus is Rokid Glasses, and it organises hardware input, media transport, model and tool calls, and wearer feedback into a reusable project skeleton. It delivers a developer surface and code assets, not a consumer AI-glasses product.",
      productType: "The product is a smart-glasses agent SDK and toolkit. The public repository separates a typical app into a Rokid Android app, WebRTC live media, a backend session and decision layer, and HUD or audio feedback, while its evaluation layer helps compare vision behaviour across platforms. Examples name OpenAI Realtime, Overshoot, object detection, touchpad, and offline voice. Developers can replace models and backends, but cannot assume that every glasses platform exposes the same cameras, HUD, microphones, or permissions.",
      interactionFlow: "The wearer supplies live scene and speech through the camera and microphone, uses a touchpad or offline voice for control, and receives the next step through audio or the HUD. The glasses capture data, WebRTC carries it to the backend, and the backend coordinates model, tool, and workflow state before returning guidance. Public demos cover drink making, sushi timing, and furniture assembly: the system can watch progress, speak the next step, and correct an error. Complete low-confidence confirmation, pause, stream recovery, and human takeover remain application responsibilities.",
      specsOrStack: "The GitHub README names an Android/Rokid app, camera and microphone capture, WebRTC, a backend, HUD, touchpad, offline voice, OpenAI Realtime, Overshoot, and object detection. Some examples require Rokid Glasses and a development cable, Android Studio, uv or Node; some services require API keys. The repository does not give a unified end-to-end latency, power, model-cost, complete device matrix, retention period, or production SLA. Those details are source not stated.",
      useCases: "Concrete examples include guiding a drink-making workflow from the live ingredients, timing and checking sushi steps, speaking the next stage of furniture assembly, answering questions, and turning an expert POV recording into a glasses assistant for a new worker. GlassKit also fits manufacturing, field service, and hands-busy training. It proves a workflow and development entry point, not that every industry task has adequate accuracy, network resilience, or safety certification.",
      painPointsSolved: "The toolkit addresses repeated engineering work around device access, media streaming, small-HUD constraints, voice control, workflow state, and vision regression. Runnable examples let a team compare prompts, models, and application logic faster; evaluations can catch visual regressions without repeating the whole physical task each time. It does not automatically solve hardware fragmentation, field connectivity, API cost, sensitive-scene governance, wrong guidance, or enterprise identity and permissions.",
      userVoice: "The public evidence is mainly an official demo surface and the GitHub developer entry point; there is not enough independent long-term field testing in this sweep. Public stars, issues, and contributions show discoverability and use, not production stability, task success, or wearer comfort. The right label is developer surface and open-source or startup signal, not a mature product-experience rating.",
      newTech: "The technical move is not a new model. It is packaging a real-time smart-glasses agent as a runnable device-to-media-to-backend-to-tool-to-feedback chain, with vision evaluations included in the open-source workflow. The examples also expose a boundary between local voice or privacy processing and cloud model calls, allowing teams to choose components by task. Long-term value depends on multi-device abstraction, offline degradation, and whether evaluations match real field conditions.",
      availability: "GlassKit provides a public GitHub, documentation, Discord, and examples; the repository is accessible and identifies an MIT licence. Device integrations and demos currently focus on Rokid Glasses, while the official site says more platforms are planned. Developers can read and run the code, but hardware, API keys, model services, deployment, and support vary by example. The public sources do not promise a hosted service, commercial support, stable release, or industry certification.",
      limitsOrUnknowns: "Open questions include multi-brand glasses support, Android permissions, WebRTC behaviour on weak networks, whether video is uploaded by default, image and log retention, API-key isolation, model cost, HUD legibility, responsibility for wrong corrections, bystander privacy, and field stop policy. A runnable repository is not a production SLA; teams need every model output inside a pausable and recoverable workflow state machine.",
      productVerdict: "GlassKit is a developer surface with more concrete substance than a platform concept page. Verdict: it brings the smart-glasses agent problem back to device input, live media, workflow state, and repeatable evaluation instead of another model integration. For teams building field products, its main value is shortening the path from demo to testable task. The next gates are device abstraction, offline behaviour, privacy, and human takeover—not more demos."
    }
  }
});

const looktech = makeProduct({
  id: "looktech-ai-glasses-gpt5-memory-2026-10-05",
  section: "official",
  sourceDate: "2026-10-05 current source sweep",
  evidenceLabel: "confirmed product",
  evidenceStrength: "Looktech official product and help pages; long-term independent review and broad delivery evidence remain limited",
  zhHeadline: "Looktech AI Glasses：把 GPT-5、记忆与相机放进 34 克镜框",
  enHeadline: "Looktech AI Glasses put GPT-5, memory, and a camera in a 34-gram frame",
  zhFact: "Looktech 官方产品页把 AI Glasses 定义为带 13MP 相机、开放式音频、GPT-5 Memo、语音唤醒和记忆能力的可穿戴产品。帮助中心列出 34g 镜框、160mAh 电池、最多 14 小时、Bluetooth 5.4、Wi‑Fi 6、32GB 存储和白色隐私指示灯；官方页面仍以预订和产品规格为主，实际发货、地区和长期体验需要单独核验。",
  enFact: "Looktech's official product pages describe AI Glasses with a 13MP camera, open-ear audio, a GPT-5 Memo assistant, voice wake, and memory. Its help centre lists a 34g frame, 160mAh battery, up to 14 hours, Bluetooth 5.4, Wi-Fi 6, 32GB storage, and a white privacy indicator. The public surface is still centred on preorder and product specifications, so shipping, regional availability, and long-term use need separate verification.",
  zhValue: "Looktech 的产品组合把相机记录、语音助手和个人记忆放在普通眼镜外形中。它的独特卖点不是 HUD，而是 Memo 能追问、跨话题并连接过去对话；对用户来说，真正的使用闭环是拍摄/录音、语音提问、得到开放式音频回答、在 App 中查看和管理记忆。记忆越有用，删除、导出、语音身份和旁人知情就越必须清楚。",
  enValue: "Looktech combines capture, voice assistance, and personal memory in ordinary-looking eyewear without a display. Its proposition is not a HUD but Memo's ability to follow up, change topics, and connect past conversations. The user loop is capture or speak, ask a question, hear an open-ear response, then review and manage memory in the app. The more useful the memory becomes, the more important deletion, export, voice identity, and bystander awareness become.",
  zhHciLens: ["入口：拍摄键、AI 键、媒体旋钮与 Hey Memo", "上下文：第一视角照片/视频、对话和个人记忆", "反馈：开放式音频与 App 中的记录管理", "边界：相机指示灯、语音身份、加密、删除和联网"],
  enHciLens: ["Input: capture button, AI button, media crown, and Hey Memo", "Context: first-person photos or video, conversations, and personal memory", "Action: open-ear audio plus app-based record management", "Boundary: camera indicator, voice identity, encryption, deletion, and connectivity"],
  zhImplication: "Looktech 把隐私控制写成产品功能：白灯提示相机状态、voiceprint 用于解锁、App 允许查看/修改/删除/导出信息。验收仍需确认这些开关在录音、拍照、联网失败、多人说话和账号迁移时是否一致；官方的 TLS/AES 说明也不能替代数据留存、模型供应商和默认上传路径的完整解释。",
  enImplication: "Looktech makes privacy controls part of the product story: a white light indicates capture, voiceprint is used for access, and the app promises to view, modify, delete, or export information. Acceptance still needs to test whether those controls remain consistent during recording, weak connectivity, multi-person speech, and account migration; a TLS/AES statement does not replace a full explanation of retention, model providers, or default upload paths.",
  visual: { path: "assets/looktech-ai-glasses.png", width: 1200, height: 628, kind: "source-backed official product visual", altZh: "Looktech AI Glasses 官方产品视觉", altEn: "Looktech AI Glasses official product visual", captionZh: "Looktech 官方产品视觉：GPT-5 Memo、13MP 相机、开放式音频与 34g 镜框。", captionEn: "Looktech official product visual: GPT-5 Memo, 13MP camera, open-ear audio, and a 34g frame.", sourceUrl: "https://www.looktech.ai/pages/product" },
  sources: [
    { label: "Looktech AI Glasses product page", url: "https://www.looktech.ai/pages/product", type: "official" },
    { label: "Looktech official product specs", url: "https://help.looktech.ai/en/articles/13428098-product-specs", type: "developer docs" },
    { label: "Looktech setup guide", url: "https://help.looktech.ai/en/articles/11476917-start-your-first-journey-with-looktech", type: "official" }
  ],
  dossier: {
    zh: {
      productName: "Looktech AI Glasses 是一副无 HUD 的相机型 AI 眼镜，产品页把 GPT-5 驱动的 Memo、开放式音频、记忆、通话与媒体拍摄合在一个普通眼镜形态里。官方还提供 App，用来配对设备、管理照片/视频、查看与管理 AI 对话。它是可被购买/预订的产品路线，具体交付范围仍需按地区和页面状态核对。",
      productType: "产品类型是 camera-first personal AI glasses。镜框内含 13MP 相机、两个扬声器、两个麦克风、capture button、AI button、media crown、白色 capture indicator 和存储，信息反馈以开放式音频和手机 App 为主，不依赖镜片显示。Memo 被设计为可以连续追问、切换主题和调用过去记忆的语音助手。",
      interactionFlow: "用户安装 Looktech App、创建账号、开机并配对眼镜，再通过 Hey Memo 或 AI 键开始对话；拍摄键记录照片/视频，媒体旋钮控制播放、音量和通话。相机工作时左侧白灯持续亮起，拍照时闪烁一次；用户可以在 App 中查看照片、视频和 AI 记录，并对记忆进行管理。公开帮助页没有完整展示断网、误触、旁人拒绝、模型不确定和录音删除后的恢复流程。",
      specsOrStack: "官方规格列出 34g frame、13MP camera、照片 2560×3120、视频 2104×1560@30fps、默认 15/30/60 秒视频、160mAh rechargeable battery、最长 14 小时、Bluetooth 5.4、Wi‑Fi 6、32GB flash、2 speakers、2 mics、iOS 17+ 与 Android 10+。AI 模型标为 GPT-5。充电速度、端到端延迟、模型调用地区、存储加密细节、默认上传路径和实际续航场景仍为 source not stated。",
      useCases: "官方场景包括记录生活、用语音询问眼前物体、翻译、设置提醒、通话、听音乐、让 Memo 回忆偏好与过去对话，以及在走路或工作时保持双手可用。相机和开放式音频适合短问答和记忆捕捉，不等于持续视频分析、复杂 Agent 执行或完全离线工作已经得到证明。",
      painPointsSolved: "它试图减少掏手机、打字、戴耳机和重新解释个人背景的成本：用户可以用语音发问，用相机捕捉当下，用开放式音频保持环境感知，再在 App 中整理记忆。它同时制造了相机旁观者、持续录音、电量、错误记忆和账号迁移的新风险；普通外形解决了佩戴阻力，不自动解决社会接受度。",
      userVoice: "本次检索得到的主要是 Looktech 官方产品、规格与设置页面，尚未找到足够独立的长期评测来验证 14 小时、GPT-5 Memo 记忆质量或多人环境下的指示灯理解。官方页面说明的是产品设计目标和规格，不应写成普遍用户满意度或完整隐私审计。",
      newTech: "技术组合的重点是 voiceprint authentication、端到端加密声明、可查看/修改/删除/导出记忆的 App 管理，以及 GPT-5 Memo 的跨对话个性化。它没有 HUD，因而把结果完全放到耳边音频和手机 App；这让主动性和错误恢复必须通过声音、灯光与 App 状态共同表达。",
      availability: "Looktech 官方产品页提供购买/预订入口和不同镜片选项，帮助中心提供配对、规格与包装说明。公开资料没有在本次扫描中给出所有地区的现货、发货时间、价格矩阵、保修和处方验配流程；这些应按当前结账页和当地页面确认。产品可确认，广泛交付和长期服务质量仍未充分独立核验。",
      limitsOrUnknowns: "未知包括 GPT-5 是本地还是云端、记忆的默认留存与删除延迟、语音指纹误识率、相机与麦克风是否可分别关闭、多人对话时的灯光可见性、弱网降级、录音/视频的上传与第三方处理、真实续航、维修以及处方镜片交付。14 小时属于官方标称，不能等同于连续 AI 使用时长。",
      productVerdict: "Looktech 是 confirmed product 的 camera-first AI glasses。产品判断：它把记忆与语音放进普通眼镜，交互链条清楚，硬件规格也比概念页具体；真正的产品门槛在于相机社会提示、记忆可控性、联网边界和持续佩戴后的错误恢复。购买与评估应优先测删除/导出、弱网、旁人知情和实际 AI 使用续航。"
    },
    en: {
      productName: "Looktech AI Glasses are display-free, camera-first AI glasses that combine GPT-5-powered Memo, open-ear audio, memory, calls, and media capture in an ordinary eyewear form. The official app pairs the glasses, manages photos and videos, and exposes AI conversations and memory controls. It is a purchasable or preorder product route, while exact delivery varies by market and current page state.",
      productType: "The product is a camera-first personal-AI glasses system. The frame contains a 13MP camera, two speakers, two microphones, a capture button, AI button, media crown, white capture indicator, and storage. Feedback is primarily open-ear audio and a phone app rather than an in-lens display. Memo is designed to support follow-up questions, topic changes, and recall from prior conversations.",
      interactionFlow: "A user installs the Looktech app, creates an account, powers on and pairs the glasses, then starts a conversation with Hey Memo or the AI button. The capture button records photos or video, while the media crown controls playback, volume, and calls. The left white light stays on during video capture and flashes for a photo; the user can review media and AI records in the app and manage memory. The public help pages do not fully show offline recovery, accidental activation, bystander refusal, model uncertainty, or deletion recovery.",
      specsOrStack: "Official specifications list a 34g frame, 13MP camera, 2560x3120 photos, 2104x1560 video at 30fps, 15/30/60-second default video options, a 160mAh rechargeable battery, up to 14 hours, Bluetooth 5.4, Wi-Fi 6, 32GB flash, two speakers, two microphones, iOS 17+, and Android 10+. The AI model is named as GPT-5. Charge time, end-to-end latency, regional model routing, storage-encryption detail, default upload path, and real-world battery scenarios are source not stated.",
      useCases: "The official use cases include capturing life, asking about objects in view, translation, reminders, calls, music, and having Memo recall preferences and earlier conversations while walking or working hands-free. The camera and open-ear audio fit short questions and memory capture; they do not prove continuous video analysis, complex agent execution, or fully offline operation.",
      painPointsSolved: "The system targets pulling out a phone, typing, wearing earbuds, and restating personal context. A user can ask by voice, capture the current moment, keep environmental awareness through open-ear sound, and organise memory in the app. It also creates new risks around bystander capture, always-on audio, battery, wrong memory, and account migration. An ordinary frame reduces visible-wear friction but does not settle social acceptance.",
      userVoice: "This sweep found mainly Looktech's official product, specification, and setup pages, not enough independent long-term testing to validate the 14-hour claim, Memo memory quality, or indicator comprehension in multi-person settings. The official surface describes product intent and specifications; it should not be read as representative satisfaction or a complete privacy audit.",
      newTech: "The product combination emphasises voiceprint authentication, an end-to-end-encryption statement, app controls to view, modify, delete, or export memories, and GPT-5 Memo personalisation across conversations. With no HUD, results are delivered through ear-level audio and the phone app, so proactive behaviour and error recovery have to be expressed jointly through sound, light, and app state.",
      availability: "Looktech provides a purchase or preorder path and multiple lens options, while its help centre documents pairing, specs, and package contents. The public sources reviewed here do not provide a complete regional inventory, ship date, price matrix, warranty, or prescription-fitting workflow; those details should be confirmed on the current local checkout page. The product is confirmed, but broad delivery and long-term service quality have not been independently verified.",
      limitsOrUnknowns: "Open questions include whether GPT-5 runs locally or in the cloud, default memory retention and deletion delay, voiceprint error rates, independent camera and microphone controls, light visibility during multi-person speech, weak-network degradation, upload and third-party processing of media, real battery under active AI use, repair, and prescription delivery. 'Up to 14 hours' is a vendor claim, not continuous AI runtime.",
      productVerdict: "Looktech is a confirmed camera-first AI-glasses product. Verdict: it places memory and voice in ordinary eyewear with a clear interaction chain and concrete hardware claims. The product gate is camera social signalling, memory control, connectivity boundaries, and recovery after everyday errors. Evaluation should prioritise deletion and export, weak connectivity, bystander awareness, and battery under real AI use."
    }
  }
});

const legato = makeProduct({
  id: "legato-speechsense-bluetooth-hearing-glasses-2026-10-05",
  section: "wild",
  sourceDate: "2026-10-05 current source sweep",
  evidenceLabel: "startup signal",
  evidenceStrength: "Legato official product surface plus prior independent reporting; clinical validation, broad shipping, and fitting evidence remain incomplete",
  zhHeadline: "Legato SpeechSense：把听力辅助藏进普通眼镜的镜腿",
  enHeadline: "Legato SpeechSense puts hearing assistance inside ordinary glasses temples",
  zhFact: "Legato 官方页面把 Hearing Glasses 定义为带 Bluetooth 连接、音频串流、电话和 SpeechSense AI 的听力辅助眼镜。它针对听力设备与普通眼镜难以共存的问题，把扬声器与辅助技术放进镜腿；TechCrunch 此前报道其开放式、双扬声器路线与眼科渠道计划。当前应标为 startup signal，不能写成已经完成临床验证或广泛上市的助听器替代品。",
  enFact: "Legato's official page describes Hearing Glasses with Bluetooth connection, audio streaming, phone calls, and SpeechSense AI hearing assistance. It targets the conflict between hearing devices and ordinary eyewear by placing speakers and assistance technology in the temples. Earlier TechCrunch reporting described an open-ear, dual-speaker route and an eye-care channel plan. It remains a startup signal, not a clinically validated or broadly shipped hearing-aid replacement.",
  zhValue: "Legato 解决的核心是长期佩戴与身份感：用户不必在普通眼镜和独立助听设备之间做二选一，且可以用同一副眼镜接收环境声音、手机电话和 AI 辅助。产品真正要证明的是佩戴舒适、验配准确、风噪与啸叫可控、旁人听不到过多外泄，以及用户能理解何时系统在增强声音。",
  enValue: "Legato's central problem is long-wear identity and fit: a user should not have to choose between ordinary eyewear and a separate hearing device, and the same frame can handle environmental sound, calls, and AI assistance. It still needs to prove comfort, fitting accuracy, wind and feedback control, limited leakage, and a clear explanation of when the system is enhancing sound.",
  zhHciLens: ["入口：Bluetooth、电话、环境声音与 SpeechSense", "上下文：佩戴者的听力需求、环境噪声和通话", "反馈：定向开放式音频与语音增强", "边界：验配、医学责任、泄漏、风噪、隐私和电量"],
  enHciLens: ["Input: Bluetooth, calls, environmental sound, and SpeechSense", "Context: hearing needs, environmental noise, and calls", "Action: directed open-ear audio and speech enhancement", "Boundary: fitting, medical responsibility, leakage, wind noise, privacy, and battery"],
  zhImplication: "听力辅助眼镜必须把‘增强了什么’和‘为什么这样增强’变成可理解状态。用户需要可调的场景、暂停与紧急回退，验配也需要专业人员和长期复测。官方产品页能确认接口和产品方向，不能替代听力学研究、临床安全、不同听力损失类型的效果数据和保险/售后路径。",
  enImplication: "Hearing-assistance glasses need to make what is being enhanced and why understandable. Users need adjustable scenes, pause, and an emergency fallback, while fitting needs professional support and repeated measurement. The official page confirms an interface and product direction, not audiology research, clinical safety, performance across hearing-loss profiles, or insurance and aftercare.",
  visual: { path: "assets/legato-bluetooth.webp", width: 1258, height: 786, kind: "source-backed startup product visual", altZh: "Legato Hearing Glasses Bluetooth 与 SpeechSense AI 产品视觉", altEn: "Legato Hearing Glasses Bluetooth and SpeechSense AI product visual", captionZh: "Legato 官方产品页视觉：Bluetooth 音频、通话与 SpeechSense AI 听力辅助；产品仍处于 startup signal。", captionEn: "Legato official product visual: Bluetooth audio, calls, and SpeechSense AI hearing assistance; the product remains a startup signal.", sourceUrl: "https://www.legatohearing.com/" },
  sources: [
    { label: "Legato Hearing Glasses official page", url: "https://www.legatohearing.com/", type: "wild" },
    { label: "TechCrunch Legato Frames report", url: "https://techcrunch.com/2026/08/26/hearing-tech-startup-legato-emerges-from-stealth-with-12m-and-a-peek-at-its-ai-hearing-glasses/", type: "reviews" },
    { label: "Legato wearable-hearing patent signal", url: "https://patents.google.com/patent/US20260141724A1/en", type: "patent" }
  ],
  dossier: {
    zh: {
      productName: "Legato Hearing Glasses 是把听力辅助、Bluetooth 音频、电话和 SpeechSense AI 集成进镜腿的可穿戴产品。它希望让辅助功能隐藏在普通眼镜的长期佩戴形态中，减少单独助听设备与眼镜冲突。官方页和媒体报道能确认产品路线与原型/发布信号，不能把它写成已广泛销售、已获医疗认证的成熟助听器。",
      productType: "产品类型是 open-ear hearing-assistance glasses with connected audio。镜腿内放置扬声器和相关处理，用户可以串流音乐、接电话并获得听力辅助；SpeechSense AI 是品牌给出的语音/环境增强层名称。它不是单纯蓝牙眼镜，也不只是把耳机塞进镜框，而是把听力场景、眼镜佩戴与音频连接合并为一个产品方向。",
      interactionFlow: "用户佩戴眼镜并通过 Bluetooth 连接手机，接收环境声音、电话、音乐和 SpeechSense 处理后的增强反馈。理想流程应包括初始听力评估、场景选择、音量/增强调整、通话切换、暂停与摘下后的恢复；官方页没有公开完整的验配、低置信度、反馈啸叫、紧急回退、多人讲话与维修流程。",
      specsOrStack: "官方页确认 Bluetooth、音频串流、电话、SpeechSense AI 和镜腿扬声器/辅助技术方向；TechCrunch 报道过 open-ear 与 dual-speaker 设计。芯片、麦克风数量、频响、延迟、最大声压、续航、IP 防护、处方镜片、App/API、医疗认证和售价均为 source not stated。专利页面只能作为 patent signal，不能代替上市规格。",
      useCases: "具体场景包括在佩戴普通眼镜的同时接收语音增强、打电话、听音乐，以及在日常环境中减少对独立助听设备的依赖。产品更适合需要低打扰、长期佩戴和开放式环境感知的用户；不能据此推断它能覆盖所有听力损失、嘈杂餐厅、风噪、多人会议或临床治疗场景。",
      painPointsSolved: "它针对助听设备可见度、普通眼镜与耳后/耳内设备冲突、配件过多、佩戴 stigma 和电话/媒体无法共享同一音频系统的问题。把扬声器放进镜腿可以减少设备切换，但会引入镜腿重量、声学泄漏、风噪、反馈、镜片适配和维修的新约束。",
      userVoice: "公开证据主要来自 Legato 官方产品页与 TechCrunch 的创业公司报道；本次没有找到完成验配的独立长期佩戴或听力学临床评测。‘看起来像普通眼镜’和‘定向声音/减少泄漏’属于产品路线与供应商/媒体描述，不应替代真实听力改善、舒适度和旁人听感数据。",
      newTech: "新技术点是把听力增强、开放式定向音频、Bluetooth 通话和 SpeechSense AI 放在眼镜镜腿，并尝试用熟悉的眼镜形态承载持续辅助。专利信号显示可穿戴计算/音频路线具有延展空间，但专利不等于产品实现。真正的创新门槛是验配、反馈控制、不同环境的语音分离和用户可控的增强强度。",
      availability: "Legato 官方站展示 Hearing Glasses、Bluetooth、电话和 SpeechSense AI；TechCrunch 早期报道曾把产品放在 2026 年秋季、眼科渠道和后续发布的路线中。公开资料没有确认当前可购买地区、正式售价、发货日期、验配门店、保修或医疗认证，因此保持 startup signal 标记。",
      limitsOrUnknowns: "未知包括听力学效果、不同听力损失类型的适配、专业验配、风噪和啸叫、音频泄漏、镜腿重量、续航、处方镜片、手机兼容、语音/环境数据留存、第三方模型、保险报销和售后维修。专利图和公司宣传不能证明这些问题已解决。",
      productVerdict: "Legato 是 startup signal：产品形态和连接场景具体，但临床与交付证据还不完整。产品判断：它把听力辅助放进普通眼镜，真正值得跟踪的是长期佩戴、验配与社会隐私，而非只看镜框是否更自然。下一关是独立听力学验证、泄漏/风噪测试、清晰的停止和售后路径。"
    },
    en: {
      productName: "Legato Hearing Glasses put hearing assistance, Bluetooth audio, phone calls, and SpeechSense AI into the temples of eyewear. The company wants assistive function to live in a familiar, long-wear form and reduce conflict between glasses and a separate hearing device. Official and media sources confirm a product route and startup demonstration signal, not a broadly sold or clinically certified hearing-aid replacement.",
      productType: "The product is open-ear hearing-assistance glasses with connected audio. Speakers and related processing sit in the temples, allowing a user to stream audio, take calls, and receive hearing support. SpeechSense AI is the brand's name for its speech or environmental enhancement layer. This is not simply Bluetooth eyewear or earbuds hidden in a frame; it combines hearing use, eyewear wearability, and connected audio.",
      interactionFlow: "The wearer puts on the glasses, pairs them with a phone over Bluetooth, and receives environmental sound, calls, music, and enhanced feedback from SpeechSense. A finished product would need an initial hearing assessment, scene selection, enhancement controls, call switching, pause, and recovery after removal. The public page does not show fitting, low-confidence, feedback, emergency fallback, multi-speaker, or repair flows.",
      specsOrStack: "The official page confirms Bluetooth, audio streaming, calls, SpeechSense AI, and temple-speaker assistance; TechCrunch reported an open-ear and dual-speaker design. Chip, microphone count, frequency response, latency, maximum output, battery, IP rating, prescription lenses, app or API, medical certification, and price are source not stated. The patent page is a patent signal and cannot substitute for shipping specifications.",
      useCases: "Concrete use cases include speech enhancement while wearing ordinary glasses, phone calls, music, and reducing reliance on a separate hearing device in daily environments. The shape targets low-interruption, long-wear, open-environment use; it does not establish coverage for every hearing-loss profile, noisy restaurants, wind, multi-person meetings, or clinical treatment.",
      painPointsSolved: "Legato targets device visibility, conflict between ordinary glasses and behind- or in-ear hardware, accessory burden, stigma, and the inability to share one audio system across calls and media. Moving speakers into the temples can reduce device switching, but introduces temple weight, acoustic leakage, wind noise, feedback, lens fit, and repair constraints.",
      userVoice: "The public evidence is mainly the Legato product page and TechCrunch's startup report; this run found no independent long-term wear or audiology evaluation after fitting. 'Looks like ordinary glasses' and claims about directed sound or reduced leakage describe a product route and vendor or media description, not measured hearing benefit, comfort, or bystander experience.",
      newTech: "The technical move is placing hearing enhancement, directed open-ear audio, Bluetooth calls, and SpeechSense AI in the temples while using familiar eyewear for continuous assistance. The patent signal suggests room for wearable computing and audio implementations, but a patent is not evidence of product implementation. The real gate is fitting, feedback control, speech separation across environments, and user control over enhancement strength.",
      availability: "Legato's official site shows Hearing Glasses, Bluetooth, calls, and SpeechSense AI. Earlier TechCrunch reporting placed the product on a fall-2026, eye-care-channel path. The public materials do not confirm current purchase regions, final price, ship date, fitting locations, warranty, or medical certification, so the item remains a startup signal.",
      limitsOrUnknowns: "Open questions include audiology outcomes, fitting across hearing-loss profiles, professional support, wind and feedback, acoustic leakage, temple weight, battery, prescription lenses, phone compatibility, retention of voice and environmental data, third-party models, insurance reimbursement, and repairs. Patent drawings and company claims do not prove those problems are solved.",
      productVerdict: "Legato is a startup signal with a concrete form and connection story but incomplete clinical and delivery evidence. Verdict: it moves hearing assistance into ordinary eyewear, and the important next tests are long wear, fitting, and social privacy rather than frame naturalness alone. The next gate is independent audiology validation, leakage and wind testing, and a clear stop and aftercare path."
    }
  }
});

const freshTopics = [fresh, glasskit, looktech, legato];

const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "Googlebook 上架：系统级 AI 的第一天，先验收跨设备闭环";
issue.enTitle = "Googlebook reaches shelves: on day one, test the cross-device loop";
issue.zhSummary = "Googlebook 按区域进入正式上架，首次把 Gemini、Android 手机、指针与后台任务放进真实购买和首启流程。今天重点不再是发布会功能数量，而是地区 SKU、手机配对、后台状态和失败后的恢复。TDK、smartARM、Ixana、Vuzix 等上一期条目继续保留，组成显示、辅助、连接和任务型执行的产品背景。";
issue.enSummary = "Googlebook enters regional shelf availability, putting Gemini, Android phones, the pointer, and background tasks into a real purchase and setup flow. The acceptance test is no longer feature count but regional SKUs, phone pairing, background state, and recovery after failure. TDK, smartARM, Ixana, and Vuzix remain as the prior issue's display, assistive, interconnect, and mission-execution context.";
issue.tags = [...new Set(["Googlebook launch", "cross-device AI", "Android phone pairing", "background agents", "regional availability", ...(issue.tags || [])])];
issue.topics = [...freshTopics, ...issue.topics.filter((item) => !freshTopics.some((candidate) => candidate.id === item.id))];
issue.coverStory = {
  topicId: fresh.id,
  zhTitle: "Googlebook 上架：系统级 AI 的第一天，先验收跨设备闭环",
  enTitle: "Googlebook reaches shelves: on day one, test the cross-device loop",
  zhSummary: ["Googlebook 从预订进入真实上架，Gemini、Android 手机与桌面窗口开始承担同一条任务链。", "首日关键不是再增加一个 AI 入口，而是把地区、机型、配对、后台运行和失败恢复做成可见状态。", "社区反馈已出现手机协同未显现、库存和 SKU 差异；它们是 friction signal，不能升级为普遍结论。"],
  enSummary: ["Googlebook moves from preorder into shelf availability, joining Gemini, Android phones, and desktop windows in one task chain.", "The first-day product test is not another AI entry point but visible regional, model, pairing, background-run, and recovery states.", "Community reports already flag missing phone-collaboration entry points, inventory, and SKU differences; they are friction signals, not universal conclusions."],
  imagePath: fresh.visual.path,
  imageWidth: fresh.visual.width,
  imageHeight: fresh.visual.height,
  imageSourceUrl: fresh.visual.sourceUrl,
  primarySourceUrl: fresh.sources[0].url,
  evidenceStrength: fresh.evidenceStrength,
  whyCover: "A system-level AI product is only real when the cross-device path works for the buyer's region, model, phone, and failure state."
};
issue.watchlistZh = Array.from(new Set(["Googlebook：不同地区 SKU、Android 版本门槛、手机协同入口、Gemini Spark 后台状态、订阅到期后的降级与撤销。", ...issue.watchlistZh])).slice(0, 20);
issue.watchlistEn = Array.from(new Set(["Googlebook: regional SKUs, Android-version requirements, phone-collaboration entry points, Gemini Spark background state, and degradation or undo after subscription expiry.", ...issue.watchlistEn])).slice(0, 20);
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
await fs.mkdir(path.join(deckDir, "public", "assets"), { recursive: true });
for (const file of ["package.json", "package-lock.json"]) await fs.cp(path.join(previousDeck, file), path.join(deckDir, file));
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });
let slides = await fs.readFile(path.join(previousDeck, "slides.md"), "utf8");
slides = slides.replaceAll(previousDate, date);
slides = slides.replace("Googlebook 上架：系统级 AI 的第一天，先验收跨设备闭环 / When AI enters lenses and bodies: displays, assistance, and edge links converge", `${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}`);
slides = slides.replace("当 AI 进入镜片与身体：显示、辅助与端侧连接开始合流 / When AI enters lenses and bodies: displays, assistance, and edge links converge", `${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}`);
slides = slides.replace("./public/assets/tdk-drp-visual-carwatch-2024.jpg", `./public/${fresh.visual.path}`);
slides = slides.replace("**TDK official prototype announcement with third-party DRP visual; full-colour and consumer product surface pending**", `**${issue.coverStory.evidenceStrength}**`);
slides = slides.replace("[TDK October 2 press release](https://www.tdk.com/en/news_center/press/20261002_01.html) · [TDK meta-optic mirror feature story](https://www.tdk.com/en/featured_stories/entry_092-meta-optic-mirror.html) · [Car Watch TDK DRP coverage](https://car.watch.impress.co.jp/docs/news/1630546.html)", fresh.sources.map((s) => `[${s.label}](${s.url})`).join(" · "));
slides = slides.replace("**Cover** — 当 AI 进入镜片与身体：显示、辅助与端侧连接开始合流", `**Cover** — ${issue.coverStory.zhTitle}`);
slides = slides.replace(/\*\*Today’s additions\*\* — .*\n/, `**Today’s additions** — ${freshTopics.map((item) => item.zhHeadline).join("；")}。\n`);
slides = slides.replace("**Today’s additions** — ${fresh.zhHeadline}。", `**Today’s additions** — ${freshTopics.map((item) => item.zhHeadline).join("；")}。`);
slides = slides.replace("**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\nThe public publisher", "The public publisher");
slides = slides.replace(/TDK 把视网膜投影压进透明镜片，目标是让显示眼镜看起来更像普通眼镜。 smartARM、Ixana 与 Vuzix 分别从辅助动作、分布式算力和任务显示补齐身体端 AI 的执行链。 新产品共同把验收标准推向“谁在看、谁在算、谁能停、旁人能否看见”。/, "Googlebook 把 Gemini、Android 手机、指针与后台任务放进同一台可购买的电脑；首日验收重点是地区、配对、状态和失败恢复。 TDK、smartARM、Ixana 与 Vuzix 继续提供显示、辅助、连接和任务执行的身体端背景。",);
slides = slides.replace(/Googlebook 上架：系统级 AI 的第一天，先验收跨设备闭环\n\n\*\*Today’s additions\*\*[^\n]*/, `Googlebook 上架：系统级 AI 的第一天，先验收跨设备闭环\n\n**Today’s additions** — ${freshTopics.map((item) => item.zhHeadline).join("；")}。\n\n**Source lanes** — official · reviews · community · wild · research · patent · china · global。`);
const dossierText = (locale, item) => fields.map((field, i) => `**${["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "用户原声", "新技术", "可用性", "限制 / 未知", "产品判断"][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const enDossierText = (item) => fields.map((field, i) => `**${["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "User voice", "New tech", "Availability", "Limits / unknowns", "Product read"][i]}** — ${item.dossier.en[field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const freshSlides = freshTopics.flatMap((item) => [
  `# ${item.zhHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("zh", item)}\n\n**Sources** — ${links(item)}`,
  `# ${item.enHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${enDossierText(item)}\n\n**Sources** — ${links(item)}`
]);
const parts = slides.split("\n\n---\n\n");
parts.splice(2, 0, ...freshSlides);
await fs.writeFile(path.join(deckDir, "slides.md"), parts.join("\n\n---\n\n"));

const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const lanes = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"];
const laneRows = lanes.map((lane) => `| ${lane} | ${issue.topics.some((item) => item.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((item) => `| ${item.id} | ${item.visual.path} | ${item.visual.sourceUrl} | ${item.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, pre-launch, crowdfunding, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, fresh: freshTopics.length, sources: allSources.length, visuals: new Set(issue.topics.map((item) => item.visual.path)).size, deckDir }));
