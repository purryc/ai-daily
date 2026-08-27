import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const date = "2026-08-27";
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((entry) => entry.date === "2026-08-26");
if (!previous) throw new Error("Missing 2026-08-26 source issue");

const ddp = {
  id: "google-developer-device-platform-agentic-testing",
  section: "official",
  dossierKind: "product",
  evidenceLabel: "developer surface",
  evidenceStrength: "official public preview; developer APIs and agent skill disclosed; device coverage and production terms remain limited",
  zhHeadline: "Google DDP：让 agent 在真实手机上跑完它写的应用",
  enHeadline: "Google DDP lets agents run the apps they write on real phones",
  zhFact: "Google Cloud 于 2026 年 8 月 10 日宣布 Developer Device Platform，8 月 12 日进入 public preview。它提供 Device Catalog、Device Run、Find Logs 与 Device Streaming API，让开发者在云端预约实体 Android 设备或高并发模拟器；官方还公开了面向 coding agent 的 agent skill，可执行多步用户旅程、发现视觉瑕疵、分析芯片性能并验证硬件特定 bug。",
  enFact: "Google Cloud announced Developer Device Platform on August 10, 2026, and made it available in public preview on August 12. It provides Device Catalog, Device Run, Find Logs, and the Device Streaming API, allowing developers to reserve physical Android devices or high-concurrency emulators in the cloud. Google also describes an agent skill for coding agents that can execute multi-step user journeys, spot visual artifacts, analyze on-device chip performance, and validate hardware-specific bugs.",
  zhValue: "DDP 把移动开发里经常被省略的一步变成了产品表面：应用在模拟器里看起来能跑，不等于用户手里的折叠屏、不同 GPU 或特定系统版本也能跑。开发者可以让 agent 连接一台真实设备，滚动、点击、检查性能，再把测试并行扩展到大量设备。对产品团队而言，价值在于把“这个界面在真实硬件上会不会坏”变成有日志、可重放、可回归的任务；对终端用户而言，好的结果是少遇到折叠屏断版、GPU 特定崩溃、键盘/权限弹窗不适配与只在真机出现的视觉缺陷。",
  enValue: "DDP turns an often-skipped step in mobile development into a visible product surface: an app that looks correct in an emulator is not necessarily correct on a foldable phone, a device with a different GPU, or a particular system image. A developer can ask an agent to connect to a real device, scroll and click through the app, inspect performance, and scale the same checks across many devices. For product teams, the value is making “will this interface fail on real hardware?” into a logged, replayable, regression-friendly task. For end users, the hoped-for outcome is fewer foldable-layout breaks, GPU-specific crashes, incompatible keyboard or permission prompts, and visual defects that appear only on physical hardware.",
  zhHciLens: ["输入：APK、测试资产、设备画像与用户旅程", "计算：实体设备、模拟器、Device Run 与 agent skill", "反馈：日志、视觉瑕疵、性能和重试必须可追溯"],
  enHciLens: ["Input: APKs, test artifacts, device profiles, and user journeys", "Compute: physical devices, emulators, Device Run, and an agent skill", "Feedback: logs, visual defects, performance, and retries must be traceable"],
  zhImplication: "如果 agent 能代替开发者操作真机，开发工具就需要把设备预约、当前设备状态、测试步骤、截图证据、失败原因、自动重试和人工接管做成一个连续界面。用户不应只看到“测试通过”；他需要知道通过的是哪台设备、哪一版系统、哪些步骤，以及 agent 是否真的执行了关键动作。",
  enImplication: "If an agent can operate a physical phone on a developer’s behalf, the tool must expose reservation, device state, test steps, screenshot evidence, failure causes, auto-retries, and human takeover as one continuous surface. A user should not see only “test passed”; they need to know which device and system image passed, which steps ran, and whether the agent actually completed the critical action.",
  sourceDate: "2026-08-10 official announcement; 2026-08-12 preview release; 2026-08-26 documentation update; 2026-08-27 current source sweep",
  visual: {
    path: "assets/google-ddp-official-2026-08.png",
    width: 1600,
    height: 900,
    kind: "source-backed official page screenshot",
    altZh: "Google Cloud Developer Device Platform 官方博客页面截图",
    altEn: "Google Cloud Developer Device Platform official blog page",
    captionZh: "来源追踪视觉：Google Cloud 官方博客展示 DDP 的 agentic mobile app development 定位；截图是来源页面，不代表所有设备型号已开放。",
    captionEn: "Source-traceable visual: Google Cloud’s official blog positions DDP for agentic mobile app development; the screenshot is source evidence and does not prove that every device profile is available.",
    sourceUrl: "https://cloud.google.com/blog/topics/developers-practitioners/announcing-developer-device-platform-on-google-cloud"
  },
  sources: [
    { label: "Google Cloud · Developer Device Platform announcement", url: "https://cloud.google.com/blog/topics/developers-practitioners/announcing-developer-device-platform-on-google-cloud", type: "official" },
    { label: "Google Cloud · DDP release notes", url: "https://docs.cloud.google.com/developer-device-platform/release-notes?authuser=1", type: "developer surface" },
    { label: "Google Developer forums · DDP topics", url: "https://discuss.google.dev/c/google-cloud/developer-device-platform/248", type: "community" }
  ],
  dossier: {
    zh: {
      productName: "Google Cloud Developer Device Platform（DDP）",
      productType: "DDP 是面向移动应用开发与 agentic testing 的云端设备平台，不是终端用户安装的 AI 应用。它把实体 Android 设备、高并发模拟器、设备目录、测试编排、日志和 agent skill 组合成一个开发者工作台，服务需要覆盖多种屏幕、系统、芯片与本地 AI 能力的团队。",
      interactionFlow: "开发者从 Device Catalog 选择设备类型，再通过 Device Streaming API 预约并连接实体手机或模拟器，让 agent 或人像操作本地设备一样滚动、点击、输入和观察屏幕。完成交互调试后，团队用 Device Run 把 APK、测试脚本和测试资产提交到多台设备并行运行；Find Logs 回传结果，失败测试可按 shard 重试。官方描述的 agent skill 还可独立执行多步 user journey、识别视觉瑕疵、分析设备芯片性能和验证硬件特定问题。审批、录屏保留、敏感数据清理与人工接管的完整 UI 为 source not stated。",
      specsOrStack: "公开栈包括 Google Cloud public preview、实体 Android 设备、并发模拟器、Device Catalog、Device Streaming API、Device Run、Find Logs、命令行与 Google Cloud console。官方说明 DDP 将逐步集成 Android Studio 与 Android CLI，并计划支持 iOS，但当前 release notes 仍把 iOS写作后续方向。预览期按使用分钟计费，模拟器与实体设备费率不同；具体价格、设备 SKU、地区、并发上限、API quota、SDK 版本、数据驻留和账号角色均为 source not stated。",
      useCases: "具体场景包括让 agent 在折叠屏真机上完成登录、搜索、支付前确认等多步旅程；在不同 GPU/CPU 设备上找出渲染错位和性能回退；在 CI/CD 中把测试分发到大量设备并行运行；针对本地 AI、摄像头、传感器或系统权限功能做硬件特定验证；以及开发者远程接管设备重现用户报告。它尤其适合“模拟器通过、真机失败”的问题。",
      painPointsSolved: "DDP 解决设备采购、机房维护、手工测试和难以重现的真机问题。传统团队常在少数手机上测试，再猜测其他设备会怎样；实体设备云化后，测试对象可以按画像选取，测试可以并行，日志可回溯。它可能减少折叠屏断版、系统弹窗遮挡、摄像头权限错位、GPU 特定崩溃和端侧 AI 在某些芯片上失速，但没有解决 agent 是否理解任务、测试数据是否安全、设备排队、云端延迟和真实网络覆盖。",
      userVoice: "Google 官方论坛的 DDP 主题页把 Device Streaming API 与 Device Run API 分开解释，但当前没有足够独立用户讨论来证明普遍稳定性，因此用户原声与大规模成本体验为 source not stated。值得跟踪的摩擦是实体设备排队、长时间串流成本、敏感账号如何清理、agent 失败后谁接管，以及截图差异是否能区分产品 bug 与云端渲染差异。",
      newTech: "新技术组合是把 agent 的操作能力接到真实硬件，而不只接浏览器 DOM 或模拟器。Device Streaming API 让 agent 直接触碰远程实体设备，Device Run 让测试在多种硬件上并行，agent skill 把预约设备、执行旅程、视觉检查、芯片性能分析和验证修复连成一条链。它把移动 QA 从“人手动点一遍”推进到“agent 运行、设备给证据、开发者复核”。",
      availability: "Google Cloud 官方宣布 DDP 于 2026 年 8 月 12 日面向所有 Google Cloud 用户进入 public preview，预览期按分钟计费。release notes 标注其为 Preview/Pre-GA，支持 Device Catalog、Device Run、Find Logs、Device Streaming API 与 agent skill。Android Studio、Android CLI 的更深集成及 iOS 支持仍是后续方向；地区、设备库存、价格、配额、企业合同、数据驻留与正式 SLA 均为 source not stated。",
      limitsOrUnknowns: "最大未知是设备池真实覆盖和 agent 可靠性：官方没有公开完整 SKU 清单、设备排队时间、不同网络下的串流延迟、自动重试是否会掩盖确定性 bug、视觉差异阈值、设备数据清除证明或跨组织隔离细节。远程真机不能代替真实用户网络、蓝牙配件、摄像头光线、通知打断和支付环境。权限、秘密、账号状态和 destructive action 的人工确认应成为默认设计。",
      productVerdict: "DDP 是今天最强的 developer surface：它把 agentic mobile development 从代码生成推进到真实设备上的观察、操作和验证。产品判断：对移动团队、AI 应用和硬件特定体验很有价值，尤其适合覆盖折叠屏、端侧 AI 与多芯片差异；但它仍是 public preview，不能写成稳定替代 QA 的自动驾驶。下一步看真实设备目录、成本与排队、可审计截图/日志、敏感数据清理和 iOS/Android Studio 集成。"
    },
    en: {
      productName: "Google Cloud Developer Device Platform (DDP)",
      productType: "DDP is a cloud device platform for mobile development and agentic testing, not an AI application installed by end users. It combines physical Android devices, high-concurrency emulators, a device catalog, test orchestration, logs, and an agent skill in one workbench. It targets teams covering different screens, system images, chips, and on-device AI capabilities.",
      interactionFlow: "A developer starts in Device Catalog, selects a device profile, and uses Device Streaming API to reserve and connect to a physical phone or emulator. An agent or human can scroll, click, type, and observe the screen as if the device were local. The team then submits an APK, test scripts, and artifacts to Device Run for parallel execution; Find Logs returns results, and failed tests can be retried by shard. Google says the agent skill can execute multi-step journeys, identify visual artifacts, analyze on-device chip performance, and validate hardware-specific bugs. The complete UI for approvals, recording retention, sensitive-data cleanup, and human takeover is source not stated.",
      specsOrStack: "The disclosed stack includes Google Cloud public preview, physical Android devices, concurrent emulators, Device Catalog, Device Streaming API, Device Run, Find Logs, command-line access, and the Google Cloud console. Google says DDP will integrate with Android Studio and Android CLI and plans to support iOS, while the current release notes describe iOS as a future direction. Preview billing is per active minute, with different rates for emulators and physical devices. Exact prices, device SKUs, regions, concurrency limits, API quotas, SDK versions, data residency, and account roles are source not stated.",
      useCases: "Concrete uses include asking an agent to complete login, search, or pre-payment journeys on a foldable phone; finding rendering and performance regressions across CPU/GPU profiles; distributing CI/CD tests across many devices; validating camera, sensor, permission, or on-device AI behavior that differs by hardware; and taking over a remote device to reproduce a user report. DDP is most useful for the “passes in the emulator, fails on a real phone” class of problem.",
      painPointsSolved: "DDP targets device procurement, lab maintenance, manual regression work, and hard-to-reproduce physical-device failures. A conventional team tests on a handful of phones and guesses what other devices will do; a cloud device layer lets the team select by profile, run in parallel, and inspect logs. It could reduce foldable layout breaks, system prompts covering the interface, camera-permission mismatches, GPU-specific crashes, and edge-AI slowdowns. It does not solve whether the agent understood the task, whether test data is safe, queues, cloud latency, or real-world network coverage.",
      userVoice: "Google’s developer forum separates the Device Streaming API and Device Run API in its topic descriptions, but the current public discussion is not large enough to establish broad stability. User voice and large-scale cost experience are therefore source not stated. The friction worth watching is physical-device queueing, long streaming sessions, sensitive-account cleanup, who takes over after an agent failure, and whether screenshot differences distinguish a product bug from cloud-rendering variance.",
      newTech: "The new combination connects agent operation to real hardware rather than only to browser DOMs or emulators. Device Streaming API lets an agent touch a remote physical device; Device Run executes tests across hardware in parallel; the agent skill connects device reservation, journey execution, visual inspection, chip-performance analysis, and fix validation. It moves mobile QA from “a person taps through once” toward “an agent runs, the device supplies evidence, and a developer reviews,” while the product still depends on observable steps and clear human-confirmation boundaries.",
      availability: "Google Cloud announced DDP as a public preview available to all Google Cloud users from August 12, 2026, with per-minute preview billing. The release notes label it Preview/Pre-GA and list Device Catalog, Device Run, Find Logs, Device Streaming API, and agentic development with Device Streaming. Deeper Android Studio and Android CLI integration and iOS support are future directions. Exact countries, device inventory, pricing, quotas, enterprise contracts, data residency, and a formal SLA remain source not stated.",
      limitsOrUnknowns: "The largest unknowns are real device-pool coverage and agent reliability. Google does not publish a complete SKU list, queue times, streaming latency across networks, whether automatic retries can hide deterministic bugs, visual-difference thresholds, proof of device-data deletion, or cross-organization isolation details. Remote physical devices cannot substitute for a user’s network, Bluetooth accessories, camera lighting, notification interruptions, or payment environment. Permissions, secrets, account state, and destructive actions need human confirmation by default.",
      productVerdict: "DDP is the day’s strongest developer surface. It moves agentic mobile development from code generation to observation, operation, and verification on real devices. Verdict: it is valuable for mobile teams, AI applications, and hardware-specific experiences, especially foldables, on-device AI, and multi-chip coverage; it remains a public preview and should not be treated as a stable replacement for QA. Watch the real device catalog, cost and queues, auditable screenshots and logs, sensitive-data cleanup, and Android Studio/iOS integration."
    }
  }
};

const latitude = structuredClone(previous.topics.find((topic) => topic.id === "gobirding-vision-master-smart-spotting-scope"));
latitude.id = "latitude-52n-smart-glasses-real-wear-review";
latitude.section = "reviews";
latitude.evidenceLabel = "review/community friction";
latitude.evidenceStrength = "month-scale hands-on review; official product surface; subscription and regional limits remain undisclosed";
latitude.zhHeadline = "L’Atitude 52°N：AI 眼镜先要经得住一周旅行";
latitude.enHeadline = "L’Atitude 52°N has to survive a week of travel before it becomes an assistant";
latitude.zhFact = "TechRadar 于 2026 年 8 月 22 日发布 L’Atitude 52°N 的一周旅行实测：镜架约 50–51g，使用 Bestechnic BES2800 6nm 芯片、200mAh 电池、12MP Sony 相机与 Goya AI（基于 Google Gemini），支持 1080p/30fps 视频、五麦克风阵列和 IP65。评测认为相机与音频表现可用，但镜架对评测者偏松，AI 价值与订阅价格仍未完全清楚。";
latitude.enFact = "TechRadar published a week-long travel test of the L’Atitude 52°N on August 22, 2026. The frames weigh about 50–51g and use a Bestechnic BES2800 6nm chipset, a 200mAh battery, a 12MP Sony camera, and Goya AI powered by Google Gemini. The review reports 1080p/30fps video, a five-microphone array, and IP65 protection. It found the camera and audio broadly usable, while the frames were loose for the reviewer and the value of the AI features and subscription pricing remained unclear.";
latitude.zhValue = "这不是一张规格表能解决的产品：旅行时用户需要抬头看路、自然拍照、问地标、听翻译和继续走，而不是停下来维护设备。TechRadar 的实测把这条链路完整暴露出来：12MP 相机能拍出可用的横竖照片，1080p 视频有稳定性，但松动镜架会让低头看路时需要扶住眼镜；Goya 的导游入口把 AI 放在旅行场景前面，然而功能是否足够每天使用，还取决于网络、应用回传和未来订阅。";
latitude.enValue = "This is not a product that can be judged from a specification table. A traveler wants to keep looking at the street, capture naturally, ask about a landmark, hear translation, and keep moving rather than stop to maintain a device. TechRadar’s hands-on test exposes the whole loop: the 12MP camera produces usable horizontal and vertical images, and 1080p video is stabilized, but a loose fit made the reviewer hold the glasses while looking down at uneven steps. Goya puts a tour-guide entry point at the front of the app, yet daily value still depends on connectivity, app transfer, and the future cost of AI features.";
latitude.zhHciLens = ["输入：第一视角图像、语音、五麦克风与手机连接", "计算：BES2800 端侧图像处理、App 与 Gemini 服务", "反馈：拍摄声、App 回传、AI 结果与网络失败必须一致"];
latitude.enHciLens = ["Input: first-person images, voice, five microphones, and phone connection", "Compute: BES2800 on-device imaging, the companion app, and Gemini services", "Feedback: shutter cues, app transfer, AI results, and network failure must agree"];
latitude.zhImplication = "AI 眼镜的核心 QA 不应只测模型回答，也要测抬手、转头、低头、继续走的自然动作是否会破坏取景、佩戴和反馈。产品必须让用户知道拍摄是否完成、照片是否已经传回手机、AI 是否在等待网络、哪些能力需要订阅，以及镜架不稳时是否会导致误拍或误解。";
latitude.enImplication = "AI-glasses QA should not test only model answers. It must test whether natural actions—turning, looking down, walking, and continuing a conversation—break framing, fit, or feedback. The product needs to show whether capture completed, whether a photo reached the phone, whether AI is waiting on the network, which features require a subscription, and whether an unstable fit can create accidental capture or misinterpretation.";
latitude.sourceDate = "2026-08-22 TechRadar hands-on; 2026-08-26/27 official product-page check; 2026-08-27 current source sweep";
latitude.visual = {
  path: "assets/latitude-52n-techradar-review-2026-08.png",
  width: 1600,
  height: 900,
  kind: "source-backed review page screenshot",
  altZh: "TechRadar 对 L’Atitude 52°N 一周旅行实测的评测页面截图",
  altEn: "TechRadar review page for the L’Atitude 52°N week-long travel test",
  captionZh: "来源追踪视觉：TechRadar 2026-08-22 评测页，证据用于佩戴、旅行和 AI 功能摩擦；规格仍按评测与官方产品页分开核对。",
  captionEn: "Source-traceable visual: TechRadar’s August 22, 2026 review page, used for wear, travel, and AI-feature friction; specifications are cross-checked separately against the review and official product pages.",
  sourceUrl: "https://www.techradar.com/computing/virtual-reality-augmented-reality/i-wore-these-obnoxious-travel-focused-smart-glasses-for-a-week-on-vacation-and-learned-more-than-id-bargained-for-about-the-stony-steps-of-santorini"
};
latitude.sources = [
  { label: "TechRadar · L’Atitude 52°N week-long review", url: latitude.visual.sourceUrl, type: "reviews" },
  { label: "L’Atitude 52°N official product site", url: "https://www.latitude52n.com/", type: "official" },
  { label: "L’Atitude Milan official product page", url: "https://eu.latitude52n.com/fr-fr/products/milan-smart-glasses", type: "official" },
  { label: "Tom’s Guide · L’Atitude 52°N review", url: "https://www.tomsguide.com/computing/smart-glasses/latitude-52n-review", type: "reviews" }
];
latitude.dossier = {
  zh: {
    productName: "L’Atitude 52°N Smart Glasses（Berlin / Milan）",
    productType: "这是带摄像头、开放式音频、麦克风、蓝牙/Wi‑Fi 和语音 AI 的生活方式眼镜，核心软件入口是 Goya AI，TechRadar 说明其由 Google Gemini 驱动。它服务旅行者、内容创作者和希望免手拍摄/问答的人；它不是显示型 AR 眼镜，镜片内 HUD 为 source not stated。",
    interactionFlow: "用户打开眼镜和配套 App，在旅行中用相机按钮或语音触发拍照/录像，照片与视频再同步到手机图库；也可通过 Hey Goya 询问眼前场景、请求旅行导览、听音乐、接打电话或进行 AI 对话。相机支持横竖构图，视频片段可在 30 秒到 3 分钟之间调整。TechRadar 评测称五麦克风能较清晰地收音，镜架取景大体自然，但低头走石阶时需要扶住眼镜。完整权限、删除、端侧/云端分工、订阅提示和无网回退 UI 为 source not stated。",
    specsOrStack: "TechRadar 列出约 50–51g、Bestechnic BES2800 6nm 芯片、200mAh 电池、32GB 存储、12MP Sony 传感器、1080p/30fps 视频、五麦克风阵列、扬声器和 IP65；官方产品页面另列 Wi‑Fi 6、Bluetooth 5.4 Low Energy。评测称充电盒约可提供 8–10 次完整充电，较早评测给出不同次数，不能混写成统一续航承诺。具体传感器型号、连续录像时间、充电时间、模型版本、App API、地区网络要求与订阅价格若未说明，均为 source not stated。",
    useCases: "具体场景是旅行中询问地标和环境、拍摄不想掏手机的瞬间、听导航或音乐、接电话、向 Goya 请求旅行建议、在街头记录短片，以及需要保持双手自由的步行/观光。相机与音频覆盖“看见—询问—记录—继续移动”的短循环；它不适合需要显示叠加、复杂文本输入、严肃摄影控制或不允许摄像头的场所。",
    painPointsSolved: "它针对旅行中不断掏手机、错过即时画面、无法同时看路和操作相机、以及想快速问环境问题的摩擦。相机按钮与语音入口缩短捕捉路径，开放式扬声器让用户保持环境感知，Goya 把 AI 入口放进旅行任务。评测也显示它没有解决佩戴稳定、网络依赖、媒体回传和订阅成本：当镜架松动时，用户会在走路与扶眼镜之间做选择；当照片同步延迟时，声音反馈不能代表文件已经安全到达手机。",
    userVoice: "TechRadar 的评测者在一周旅行中记录了镜架对自己偏松，低头走路时需要扶住眼镜，并给设计 4/5、AI 3.5/5、价值 2.5/5。文章认为相机、音频和夜景表现总体可用，但指出 AI 订阅成本尚不清楚。这是单一媒体评测，不是统计意义上的用户共识；它提供真实佩戴和旅行摩擦证据，不能替代长期多用户测试。",
    newTech: "产品新意在于把可移动相机、BES2800 端侧图像处理、五麦克风阵列、开放式音频和 Gemini 驱动的旅行 AI 放进生活方式镜架。它没有靠 HUD 增加信息密度，而是靠语音、第一视角相机和 App 回传形成边走边问的链路。技术门槛是图像传输、端云分工、拍摄状态一致性、噪声抑制、AI 订阅与隐私控制能否在自然动作中保持可预期。",
    availability: "TechRadar 评测的是较成熟的生产版本，官方站点提供 Berlin/Milan 产品入口；官方页面和评测没有给出完整全球库存、地区售价、订阅方案、保修范围和所有镜片选项。评测列出的 200mAh、50–51g、IP65 和 12MP 是来源可追踪规格，但不能推导每个型号的续航与体验。当前证据支持已有产品与实测，不支持所有地区均可立即购买且 AI 服务一致。",
    limitsOrUnknowns: "未知包括 Goya 的具体模型与区域语言、网络中断时哪些问答可用、图片何时从眼镜同步到手机、订阅功能价格和到期降级、录制指示的旁观者可见性、长时间佩戴疲劳、镜架松动对取景的影响、IP65 的具体测试边界，以及 200mAh 在连续拍摄/通话/AI 对话下的真实时长。评测不能证明夜间、拥挤环境、多人对话和长途旅行中的可靠性。",
    productVerdict: "L’Atitude 52°N 是进入实测阶段的 camera-first AI glasses 产品线，价值来自继续移动时仍能拍、听、问。优势是生活方式姿态、相机与音频的完整组合；风险是接近 50g 的重量、镜架稳定性、网络回传与订阅边界会直接决定每天是否愿意戴。产品判断：值得作为旅行型 AI 眼镜观察样本，不应仅凭功能清单推荐购买；下一步看长期佩戴、同步成功率、订阅价格、隐私反馈和地区交付。"
  },
  en: {
    productName: "L’Atitude 52°N Smart Glasses (Berlin / Milan)",
    productType: "These are lifestyle glasses with a camera, open-ear audio, microphones, Bluetooth/Wi-Fi, and a voice assistant. TechRadar describes Goya AI as powered by Google Gemini. The product targets travelers, creators, and people who want hands-free capture and questions. It is not presented as display AR glasses; an in-lens HUD is source not stated.",
    interactionFlow: "The user opens the glasses and companion app, then uses a camera button or voice to take photos and video while traveling; captures sync to the phone gallery. The wearer can say Hey Goya to ask about a scene, request travel guidance, listen to music, take calls, or chat with the AI. The camera supports horizontal and vertical framing, and clips can be adjusted from 30 seconds to three minutes. TechRadar found the five-microphone array clear and framing broadly natural, but the reviewer had to hold the glasses while looking down on uneven steps. Full permission, deletion, edge-versus-cloud, subscription, and offline-fallback UI remains source not stated.",
    specsOrStack: "TechRadar lists roughly 50–51 grams, a Bestechnic BES2800 6nm chipset, a 200mAh battery, 32GB storage, a 12MP Sony sensor, 1080p/30fps video, a five-microphone array, speakers, and IP65 protection. The official product surface also lists Wi-Fi 6 and Bluetooth 5.4 Low Energy. TechRadar says the case can provide roughly 8–10 full recharges, while an earlier review reports a different count; these should not be merged into one runtime claim. Exact sensor model, continuous recording duration, charging time, model version, app API, regional network requirements, and subscription pricing are source not stated.",
    useCases: "Concrete uses include asking about a landmark or environment while traveling, capturing a moment without taking out a phone, listening to navigation or music, taking calls, asking Goya for a travel suggestion, recording short clips, and keeping both hands free while walking. The camera and audio create a short see, ask, capture, keep moving loop. It is less suited to display overlays, complex text entry, serious camera control, or places where cameras are not allowed.",
    painPointsSolved: "The product targets repeated phone retrieval, missed moments, the conflict between looking at the road and operating a camera, and the need to ask a quick question about the environment. A camera button and voice entry shorten capture; open-ear speakers preserve environmental awareness; Goya puts an AI entry point inside a travel task. The review also shows what it does not solve: fit stability, network dependence, media transfer, and subscription cost. When the frame is loose, the wearer chooses between walking and holding the glasses. When a photo transfer is delayed, an audio cue cannot mean that the file is already safely on the phone.",
    userVoice: "The TechRadar reviewer recorded that the frame was too loose for them and had to be held while looking down during a week of travel. The review scores design 4/5, AI 3.5/5, and value 2.5/5. It considers the camera, audio, and low-light performance broadly usable but says the AI subscription cost is not yet clear. This is one media review, not statistical user consensus. It is useful evidence of real wear and travel friction, not a substitute for longitudinal multi-user testing.",
    newTech: "The product combination puts a movable camera, BES2800 on-device imaging, a five-microphone array, open-ear audio, and Gemini-powered travel AI into a lifestyle frame. Instead of adding a HUD and increasing visual density, it uses voice, first-person capture, and app transfer to make a walk-and-ask loop. The hard technical questions are image transfer, edge-cloud boundaries, consistent capture state, noise suppression, subscription behavior, and privacy controls that remain predictable during natural movement.",
    availability: "TechRadar tested a more production-ready version, and the official site exposes Berlin and Milan product routes. The official pages and review did not provide a complete global inventory, regional price map, subscription plan, warranty scope, and full lens-option list during this check. The review-backed 200mAh, 50–51g, IP65, and 12MP figures are traceable specifications, but they do not predict every model’s runtime or experience. The evidence supports an existing product with hands-on testing, not uniform immediate availability or identical AI service in every region.",
    limitsOrUnknowns: "Unknowns include Goya’s exact model and language coverage, which questions work offline, when an image reaches the phone, subscription price and downgrade behavior, how visible the recording cue is to bystanders, long-wear fatigue, how fit affects framing, the exact IP65 test boundary, and real 200mAh runtime under continuous capture, calls, and AI conversation. A single review cannot establish reliability at night, in crowds, in multi-speaker conversations, or across a long trip.",
    productVerdict: "L’Atitude 52°N is a camera-first AI-glasses line that has reached hands-on testing, with value in capturing, listening, and asking while the wearer keeps moving. Its strengths are lifestyle positioning and a complete camera-plus-audio loop; its risks are the nearly 50-gram frame, fit stability, network transfer, and subscription boundaries that decide whether people wear it every day. Verdict: it is a useful travel-AI observation sample, not a purchase recommendation based on a feature list. Watch long-wear comfort, transfer success, subscription pricing, privacy feedback, and actual regional delivery."
  }
};

const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "AI Daily 2026-08-27：Agent 开始测试真实设备，也开始适应真实佩戴";
issue.enTitle = "AI Daily 2026-08-27: Agents meet real devices and real-world wear";
issue.zhSummary = "今天最清晰的产品变化有两条：Google Developer Device Platform 把远程真机、并行测试和 agent skill 放进同一套开发者表面；L’Atitude 52°N 的周期实测则把 AI 眼镜带回佩戴、拍摄、网络与订阅的现实摩擦。前者让 agent 能否操作设备变成可重复测试的问题，后者提醒我们，产品能否被每天戴着使用，仍取决于重量、镜架稳定性、相机回传和成本边界。其余版面继续追踪推理芯片、显示型眼镜、具身采集、端侧计算、社区摩擦与研究/专利降级信号。";
issue.enSummary = "Today’s clearest product shift has two sides. Google’s Developer Device Platform puts remote physical devices, parallel testing, and an agent skill on one developer surface. A month-scale review of the L’Atitude 52°N smart glasses brings AI eyewear back to fit, capture, connectivity, and subscription friction. The first makes whether an agent can operate a device a repeatable testing question; the second shows that daily wear still depends on weight, frame stability, camera transfer, and cost boundaries. The rest of the issue follows inference chips, display glasses, embodied capture, edge compute, community friction, and explicitly downgraded research and patent signals.";
issue.zhPath = "./" + date + "/zh/";
issue.enPath = "./" + date + "/en/";
issue.sourcesPath = "./" + date + "/sources.md";
issue.sourceTypes = [...new Set([...(issue.sourceTypes || []), "confirmed product", "developer surface", "review/community friction", "research signal", "patent signal", "china", "global"])];
for (const topic of issue.topics) topic.sourceDate = topic.sourceDate + " · 2026-08-27 current source sweep";
issue.topics = [ddp, latitude, ...issue.topics.filter((topic) => ![ddp.id, latitude.id].includes(topic.id))];
issue.coverStory = {
  topicId: ddp.id,
  zhTitle: ddp.zhHeadline,
  enTitle: ddp.enHeadline,
  zhSummary: ["Google DDP 把实体 Android 设备、模拟器、Device Streaming API、Device Run 和 agent skill 放进一个 public preview。", "开发者可以让 agent 在真实手机上执行多步旅程、检查视觉瑕疵、分析芯片性能，再把测试扩展到不同设备。", "设备目录、排队、成本、日志审计、敏感数据清理和人工接管仍需后续证据。"],
  enSummary: ["Google DDP puts physical Android devices, emulators, Device Streaming API, Device Run, and an agent skill into one public preview.", "An agent can execute multi-step journeys on a real phone, inspect visual artifacts, analyze chip performance, and scale tests across device profiles.", "Device coverage, queues, cost, auditable logs, sensitive-data cleanup, and human takeover still need evidence."],
  imagePath: ddp.visual.path,
  imageWidth: ddp.visual.width,
  imageHeight: ddp.visual.height,
  imageSourceUrl: ddp.visual.sourceUrl,
  primarySourceUrl: "https://cloud.google.com/blog/topics/developers-practitioners/announcing-developer-device-platform-on-google-cloud",
  evidenceStrength: ddp.evidenceStrength,
  whyCover: "DDP is the clearest current signal that agentic software is moving from generating code to operating and verifying real hardware; the user-facing value still depends on evidence, permissions, and recovery."
};
issue.designDesk.zhTitle = "设计台：把真实设备的状态交给 agent，也交给人";
issue.designDesk.enTitle = "Design Desk: give real-device state to the agent and the human";
issue.designDesk.zhIntro = "今天的增量把观察链路推向两个现场：agent 在真实手机上测试，佩戴者在真实旅途中使用眼镜。";
issue.designDesk.enIntro = "Today’s additions move the observation loop into two real settings: an agent testing physical phones and a wearer using glasses on an actual trip.";
issue.designDesk.zhItems.unshift({ label: "真机验证", body: "每次 agent 操作都留下设备、步骤、截图、性能和失败回退证据。" });
issue.designDesk.enItems.unshift({ label: "Physical validation", body: "Every agent action should leave device, step, screenshot, performance, and recovery evidence." });
issue.watchlistZh = ["Google DDP：真实设备目录、排队、按分钟成本、截图审计、数据清理与人工接管。", "L’Atitude 52°N：Goya 订阅价格、同步成功率、长期佩戴与地区交付。", ...issue.watchlistZh];
issue.watchlistEn = ["Google DDP: real device coverage, queues, per-minute cost, screenshot audit, data cleanup, and human takeover.", "L’Atitude 52°N: Goya subscription pricing, transfer success, long-wear comfort, and regional delivery.", ...issue.watchlistEn];

await fs.writeFile(dataPath, JSON.stringify([issue, ...issues.filter((entry) => entry.date !== date)], null, 2) + "\n");
await fs.cp(path.join(root, "2026-08-26", "assets"), path.join(root, date, "assets"), { recursive: true, force: true });

const deck = path.join("/Users/hmi/Documents/Survey/output/slidev", "ai-product-morning-brief-" + date);
await fs.rm(deck, { recursive: true, force: true });
await fs.mkdir(path.join(deck, "public", "assets"), { recursive: true });
await fs.cp(path.join(root, date, "assets"), path.join(deck, "public", "assets"), { recursive: true, force: true });
await fs.writeFile(path.join(deck, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deck, "slides.md"), [
  "---", "theme: default", "title: AI Daily " + date, "layout: cover", "---", "",
  "# AI Daily " + date, "",
  "Agent 开始测试真实设备，也开始适应真实佩戴 / Agents meet real devices and real-world wear", "",
  "<img src=\"./public/assets/google-ddp-official-2026-08.png\" style=\"width:42%;height:56%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px\" />", "",
  "**Cover evidence · Google Cloud official public preview · developer surface · 2026-08-12 / 2026-08-27 sweep**", "",
  "---", "", "# Issue map", "",
  "- Cover story: Google DDP moves agentic development onto physical Android devices.",
  "- Field review: L’Atitude 52°N tests whether camera-first AI glasses survive a real trip.",
  "- System layer: Jalapeño, Intel architectures, embodied capture, Android XR, and edge inference.",
  "- Trust lanes: review/community friction, China/global product routes, research, patent, and weak signals.", "",
  "The publisher version contains the full bilingual dossiers, all required source lanes, image ledger, watchlist, source index, and paged 16:9 controls.", "",
  "---", "", "# Google DDP", "",
  "<img src=\"./public/assets/google-ddp-official-2026-08.png\" style=\"width:42%;height:56%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px\" />", "",
  "**developer surface · official public preview · August 2026**", "",
  "Google Cloud Developer Device Platform combines Device Catalog, Device Streaming API, Device Run, Find Logs, physical Android devices, high-concurrency emulators, and an agent skill. A coding agent can execute multi-step journeys, spot visual artifacts, analyze on-device chip performance, and validate hardware-specific bugs.", "",
  "**Product read** — “Agent wrote the app” is followed by “agent operated it on the hardware users actually own.” Device SKU coverage, queues, pricing, data cleanup, iOS support, screenshot audit, and human takeover remain partly undisclosed.", "",
  "---", "", "# L’Atitude 52°N", "",
  "<img src=\"./public/assets/latitude-52n-techradar-review-2026-08.png\" style=\"width:42%;height:56%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px\" />", "",
  "**review/community friction · hands-on evidence · 2026-08-22**", "",
  "TechRadar’s week-long travel review lists roughly 50–51g, a 12MP Sony camera, 1080p/30fps video, a five-microphone array, 200mAh battery, IP65 protection, and Goya AI powered by Google Gemini. The product supports camera capture, audio, calls, and voice questions while the wearer keeps moving.", "",
  "The friction is in the movement: the reviewer found the frame loose enough to hold while looking down at uneven steps. The camera and audio were broadly usable, while AI value and subscription pricing remained unclear. Camera-first AI glasses earn daily wear through stable fit and predictable feedback, not through a long feature list.", "",
  "---", "", "# Source lanes and watchlist", "",
  "official · reviews · community · wild · research · patent · china · global · watchlist", "",
  "The public publisher surface includes all source-lane scans, concrete dossiers, bilingual density, source/date/evidence labels, full evidence visuals, and 16:9 page controls.", ""
].join("\n"));
await fs.writeFile(path.join(deck, "sources.md"), [
  "# AI Daily " + date + " source ledger", "",
  "## New focus sources", "",
  "- Google Cloud DDP announcement: https://cloud.google.com/blog/topics/developers-practitioners/announcing-developer-device-platform-on-google-cloud",
  "- Google Cloud DDP release notes: https://docs.cloud.google.com/developer-device-platform/release-notes?authuser=1",
  "- TechRadar L’Atitude 52°N review: " + latitude.visual.sourceUrl,
  "- L’Atitude 52°N official site: https://www.latitude52n.com/", "",
  "## Required lanes", "", "official · reviews · community · wild · research · patent · china · global · watchlist", "",
  "## Visual asset index", "", "- public/assets/google-ddp-official-2026-08.png — official Google Cloud page screenshot, 1600×900", "- public/assets/latitude-52n-techradar-review-2026-08.png — TechRadar review page screenshot, 1600×900", "", "Evidence screenshots use local paths, white backgrounds, and contain-fit rendering. Unknown facts remain source not stated.", ""
].join("\n"));
console.log("Created " + date + ": " + issue.topics.length + " topics, " + issue.watchlistZh.length + " watchlist entries");
