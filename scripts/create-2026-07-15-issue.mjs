import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const issuesPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(issuesPath, "utf8"));
const previous = issues.find((issue) => issue.date === "2026-07-14");
if (!previous) throw new Error("Missing 2026-07-14 source issue");

const clone = (value) => structuredClone(value);
const source = (label, url) => ({ label, url });
const visual = (file, width, height, title, url, zh, en) => ({
  path: "assets/" + file,
  width,
  height,
  kind: "source-backed screenshot",
  altZh: "真实来源视觉：" + title,
  altEn: "Source-backed visual: " + title,
  captionZh: zh,
  captionEn: en,
  sourceUrl: url
});
const old = Object.fromEntries(previous.topics.map((topic) => [topic.id, clone(topic)]));
const carry = (id, section, visualPath) => {
  const topic = clone(old[id]);
  if (!topic) throw new Error("Missing previous topic " + id);
  if (section) topic.section = section;
  topic.sourceDate = topic.sourceDate + " · 2026-07-14 follow-up";
  if (visualPath) topic.visual.path = "assets/" + visualPath;
  return topic;
};
const makeProduct = (config) => ({
  id: config.id,
  section: config.section,
  zhHeadline: config.zhHeadline,
  enHeadline: config.enHeadline,
  zhFact: config.zh.productName + "：" + config.zh.productType + " 本条按 " + config.evidenceLabel + " 处理；未披露处写 source not stated。",
  enFact: config.en.productName + ": " + config.en.productType + " This item is handled as " + config.evidenceLabel + "; missing details remain source not stated.",
  zhValue: config.zh.productVerdict,
  enValue: config.en.productVerdict,
  zhHciLens: config.hciZh,
  enHciLens: config.hciEn,
  zhImplication: config.zh.painPointsSolved,
  enImplication: config.en.painPointsSolved,
  sourceDate: config.sourceDate,
  evidenceLabel: config.evidenceLabel,
  evidenceStrength: config.evidenceStrength,
  visual: config.visual,
  sources: config.sources,
  dossierKind: "product",
  dossier: { zh: config.zh, en: config.en }
});

const androidXrUrl = "https://blog.google/products-and-platforms/platforms/android/android-xr-io-2026/";
const androidXrDevUrl = "https://developer.android.com/blog/posts/what-s-new-in-android-xr-tooling-engine-support-and-ecosystem-updates?hl=en";
const androidXr = makeProduct({
  id: "android-xr-intelligent-eyewear-developer-surface", section: "official",
  zhHeadline: "Android XR 把眼镜从产品预告推进成可测试的开发者表面",
  enHeadline: "Android XR turns eyewear from a product preview into a testable developer surface",
  sourceDate: "2026-05-19 intelligent-eyewear preview · 2026-06-15 Developer Preview 4",
  evidenceLabel: "developer surface", evidenceStrength: "developer surface · official Android XR docs · pre-launch hardware",
  visual: visual("android-xr-developer-preview-4-source-2026-06.png", 1600, 1000, "Android XR Developer Preview 4", androidXrDevUrl, "Android Developers 的 Developer Preview 4 页面截图；Projected、Compose Glimmer、Device Availability API 与多引擎支持以官方文档为准。", "Android Developers Developer Preview 4 page; Projected, Compose Glimmer, Device Availability API, and engine support follow the official documentation."),
  hciZh: ["设备可用性状态", "透明显示层级", "跨设备恢复"], hciEn: ["device-availability state", "optical-display hierarchy", "cross-device recovery"],
  sources: [source("Google intelligent eyewear preview", androidXrUrl), source("Android XR Developer Preview 4", androidXrDevUrl), source("Android XR Gemini API guide", "https://developer.android.com/develop/xr/gemini?hl=en"), source("Android XR platform", "https://developer.android.com/xr")],
  zh: {
    productName: "Android XR intelligent-eyewear developer surface",
    productType: "Google 在 I/O 2026 把 Android XR 眼镜路线拆成 audio glasses 与 display glasses，并与 Samsung、Gentle Monster、Warby Parker 和 Qualcomm 合作展示方向。更具体的产品事实来自 Developer Preview 4：开发者可以用 Android Studio emulator、Jetpack Projected、Compose Glimmer 和 Gemini API 为眼镜扩展移动 app。硬件仍是秋季 select markets 的预告，开发者栈已经先公开。",
    interactionFlow: "用户可以用语音向 Gemini 请求导航、附近咖啡店、取餐、通知摘要、日历事件、照片和实时翻译；display glasses 还可以把菜单或路牌翻译显示在视野里，audio glasses 则以语音回传。开发者从现有 Android app 出发，用 Jetpack Projected 把手机体验投射到眼镜，用 Device Availability API 根据眼镜是否佩戴调整生命周期，再用 Compose Glimmer 处理透明显示上的文字与 touchpad 组件。Gemini Live API 与 function calling 提供实时语音和动作入口。",
    specsOrStack: "官方公开的栈包括 Android XR SDK Developer Preview 4、Android Studio emulator、Jetpack Projected、Jetpack Compose Glimmer、Device Availability API、Gemini Live API、Firebase AI Logic、Kotlin、Unity、Unreal、Godot、ARCore Geospatial API 与 OpenXR。Google 将硬件分为 headset、wired XR glasses、audio glasses 和 display glasses；Samsung/Google intelligent eyewear 预计 2026 年秋季在 select markets 发布。镜片参数、相机、处理器、重量、电池、价格、具体 Android 版本和端云模型分工均为 source not stated。",
    useCases: "官方示例覆盖边走边问路、在路线中找咖啡店并下单、读重要消息摘要、添加日历事件、实时翻译对话、翻译视线中的菜单与路牌，以及不掏手机拍照。对开发者，关键场景是把已有移动 app 变成 glanceable companion：眼镜未佩戴时回到手机，走路时把复杂操作压缩为语音、按钮组或短文本。Android Studio emulator 让团队先测试流程与状态。",
    painPointsSolved: "这套开发面处理三个早期摩擦：团队不知道从什么 API 开始、手机 app 与眼镜状态脱节、透明显示无法直接复用手机布局。Projected 把跨设备投影变成库，Device Availability API 让“眼镜是否在身上”进入生命周期，Compose Glimmer 为可读性和 touchpad 输入提供组件。对终端用户，目标是少掏手机；对开发者，目标是降低从 demo 到可维护 app 的迁移成本。",
    newTech: "新意不在 Gemini 能回答问题，而在系统把 agent、输入和设备状态交给 app。App 可以通过 Gemini Live API 与 function calling 处理实时语音，也可以用 Android Intelligence 和 AppFunctions 暴露可被 agent 发现、执行的服务、数据与动作。Projected 与 Compose Glimmer 共同定义面向视线的 UI 约束：短、可扫读、可在 touchpad 或语音下完成。Device Availability API 把 wearable context 变成开发者必须处理的状态。",
    availability: "Developer Preview 4、Android XR 文档、Gemini API 指南和 emulator 已公开；Catalyst Program 为入选开发者提供 pre-release hardware、support forums 与 launch guidance。Google/Samsung intelligent eyewear 公开为 2026 年秋季 select markets，具体产品、地区、价格、预购、处方镜片和发货日 source not stated。当前可以开发和模拟，不能写成消费者产品已经上市。",
    limitsOrUnknowns: "官方没有给出眼镜硬件统一规格、显示可读性实测、嘈杂环境语音错误率、Gemini 延迟与成本、手机断连时的降级逻辑，也没有说明 AppFunction 授权确认如何呈现。透明显示的通知密度、走路时的注意力分配、旁观者对音频与显示的理解仍需要真实硬件评测。Developer Preview 能证明 API 存在，不能证明日常佩戴体验。",
    productVerdict: "Android XR 最值得跟踪的产物不是一副尚未定价的眼镜，而是一组可让手机 app 迁移到眼前、耳边和 agent loop 的系统接口。Projected、Glimmer 和 Device Availability API 把硬件约束变成开发者契约；生态能否形成，取决于秋季硬件是否稳定、权限是否可解释，以及开发者能否把复杂 app 压成可读、可停、可恢复的微型流程。"
  },
  en: {
    productName: "Android XR intelligent-eyewear developer surface",
    productType: "At I/O 2026 Google split the Android XR eyewear route into audio glasses and display glasses and showed the direction with Samsung, Gentle Monster, Warby Parker, and Qualcomm. The concrete product evidence is Developer Preview 4: developers can use Android Studio emulator, Jetpack Projected, Compose Glimmer, and Gemini APIs to extend mobile apps to glasses. The hardware remains an autumn, select-market preview; the developer surface is public.",
    interactionFlow: "A wearer can ask Gemini for directions, a nearby coffee shop, pickup ordering, notification summaries, calendar events, photos, and live translation. Display glasses can translate menus and signs in view, while audio glasses return spoken help. A developer starts with an Android app, uses Jetpack Projected to bring a companion experience to glasses, uses Device Availability to adapt lifecycle behavior when the device is worn, and uses Compose Glimmer for text and touchpad components on optical see-through displays. Gemini Live API and function calling provide real-time voice and action entry points.",
    specsOrStack: "The public stack includes Android XR SDK Developer Preview 4, Android Studio emulator, Jetpack Projected, Jetpack Compose Glimmer, Device Availability API, Gemini Live API, Firebase AI Logic, Kotlin, Unity, Unreal, Godot, ARCore Geospatial API, and OpenXR. Google describes headsets, wired XR glasses, audio glasses, and display glasses as distinct form factors. Samsung/Google intelligent eyewear is scheduled for select markets in fall 2026. Lens parameters, cameras, processors, weight, battery, price, exact Android version, and edge/cloud model split are source not stated.",
    useCases: "Official examples include asking for walking directions, finding a coffee shop and ordering pickup on the route, receiving summarized messages, adding calendar events, translating speech, translating a menu or sign in view, and taking a photo without the phone. For developers, the job is turning a mobile app into a glanceable companion: return to the phone when glasses are unavailable and compress complex tasks into voice, short text, or touchpad controls while walking. The emulator lets teams test flows and state before hardware access.",
    painPointsSolved: "The surface targets three early glasses problems: teams do not know where to start, phone and eyewear state drift apart, and transparent displays cannot reuse phone layouts directly. Projected makes cross-device projection a library; Device Availability brings ‘is the eyewear being worn?’ into lifecycle logic; Compose Glimmer supplies readability and touchpad components. For users the goal is fewer phone pulls. For developers the goal is lowering the migration cost from demo to maintainable app.",
    newTech: "The move is not simply that Gemini can answer questions. It is that the system exposes agent, input, and device state to applications. Apps can use Gemini Live API and function calling for real-time voice, while Android Intelligence and AppFunctions let an agent discover and execute declared services, data, and actions. Projected and Glimmer define a field-of-view constraint: short, scannable, and operable by touchpad or voice. Device Availability makes wearable context an explicit state developers must handle.",
    availability: "Developer Preview 4, Android XR documentation, Gemini guidance, and the emulator are public. The Catalyst Program offers accepted developers pre-release hardware, support forums, and launch guidance. Google and Samsung describe intelligent eyewear as coming to select markets in fall 2026; model, country list, price, preorder, prescription options, and shipping date are source not stated. Development and simulation are available; consumer availability is not confirmed.",
    limitsOrUnknowns: "The sources do not state a unified glasses specification, measured optical-display legibility, voice error rates in noise, Gemini latency or cost, offline behavior after phone disconnect, or how AppFunction permissions appear on glasses. Notification density, walking attention, and bystander understanding of audio and display require hardware testing. A Developer Preview proves an API exists, not that daily wear works.",
    productVerdict: "The most important Android XR output is not an unpriced pair of glasses. It is a set of interfaces that can move a mobile app into the user’s sight, ear, and agent loop. Projected, Glimmer, and Device Availability turn hardware constraints into a developer contract. Ecosystem success depends on stable autumn hardware, explainable permissions, and developers compressing complex apps into legible, stoppable, recoverable micro-flows."
  }
});

const rokidUrl = "https://www.rokid.com/zh-CN";
const rokidJapanUrl = "https://www.moguravr.com/styly-hmd-app-service-end-en/";
const rokid = makeProduct({
  id: "rokid-smart-ai-glasses-yodaos", section: "china",
  zhHeadline: "Rokid 用 YodaOS 把 AI 眼镜从手机配件推向 AIOS 入口",
  enHeadline: "Rokid uses YodaOS to push AI glasses from phone accessory toward an AIOS entry point",
  sourceDate: "2026-06-29 YodaOS announcement · 2026-07-10 Japan general sale",
  evidenceLabel: "confirmed product", evidenceStrength: "confirmed product · China product signal · overseas retail evidence",
  visual: visual("rokid-yodaos-source-2026-07.png", 1600, 1000, "Rokid YodaOS and Smart AI Glasses", rokidUrl, "Rokid 官方页面截图，展示带显示 AI 眼镜、开发者服务与 YodaOS-Master；规格和日本上市信息以产品与评测来源为准。", "Rokid official page showing display AI glasses, developer services, and YodaOS-Master; specifications and Japan availability follow product and review sources."),
  hciZh: ["多模态意图入口", "模型可替换", "Agent store 生态"], hciEn: ["multimodal intent entry", "replaceable models", "agent-store ecosystem"],
  sources: [source("Rokid official website", rokidUrl), source("Yicai Global YodaOS report", "https://www.yicaiglobal.com/news/top-waveguide-ar-glasses-maker-rokid-launches-ai-native-operating-system"), source("Mogura VR Japan launch report", rokidJapanUrl), source("Rokid global product post", "https://global.rokid.com/en-jp/blogs/news/rokid-s-new-ai-glasses-are-a-lighter-longer-recording-answer-to-meta-ray-bans")],
  zh: {
    productName: "Rokid Smart AI Glasses + YodaOS",
    productType: "Rokid Smart AI Glasses 是带相机、麦克风、扬声器和双眼显示的 AI/AR 眼镜，YodaOS 是 Rokid 在 2026 年 6 月公开的 AI-native smart-glasses OS。中国线的产品信号已经从单副眼镜推进到 OS、模型切换、第三方服务与 agent store：Rokid 允许用户在 ChatGPT、Gemini、DeepSeek 和通义千问之间选择，试图把眼镜从手机配件变成 AI 入口。",
    interactionFlow: "用户用语音、镜腿触控、眼动或身体动作触发拍照、翻译、AR 导航、看见即问和任务处理。资料描述了相机捕捉、语音识别、模型处理、显示或音频反馈链路；YodaOS 设计目标是把多模态输入连接到 AI agent 与外部服务，例如读外语路牌时翻译、旅行时给出路线、工作时调用流程。海外 agent platform 已发布，agent store 被安排在 7 月开放，具体上线范围需继续核对。",
    specsOrStack: "Mogura VR 对日本上市 Smart AI Glasses 列出约 49g、Sony IMX681 12MP、109° 广角、F2.25、HDR、降噪与防抖、双眼 Micro LED、1500 nits、30° FOV、Snapdragon AR1 Gen 1、Wi-Fi 6、Bluetooth 5.3、2GB RAM 和 32GB ROM。系统还包含 YodaOS、手机 app、AI 服务、显示与语音输出。Rokid 官方主页列出 YodaOS-Master 与开发者服务，但没有在同一页给出所有型号价格、续航、数据保留和端云分工；缺失处写 source not stated。",
    useCases: "场景包括面对面和旅行翻译、读取路牌和菜单、AR 导航、拍照记录、免手持问答、工作流程提示，以及通过模型和服务完成付款、直播或云服务任务。日本报道将产品定位为 camera、translation、AR navigation 的 all-in-one device，2026 年 7 月 10 日在官方店、Amazon、Rakuten 与日本 75 家实体店开卖。最大差异不是有没有 AI，而是模型选择、服务接入和本地可购买性。",
    painPointsSolved: "Rokid 要解决 AI 眼镜依赖手机和单一模型的问题：用户不用先打开某个 App，可以直接用意图触发功能；合作方可以把 agent 放进平台，而不是为每个硬件重复造功能；海外用户可以按地区选择模型与渠道。多模态输入也面向走路、旅行和工作中不适合盯手机的场景。代价是更多模型、服务和权限需要统一解释，结果一致性和责任归属更难。",
    newTech: "YodaOS 的新意是把 AI-native OS 落实为意图管理和 agent 生态叙事，而不是只加 chatbot。Rokid 强调多模型切换、与 WeChat、Douyin、Alipay、JD.com、Alibaba Cloud、Google Cloud、AWS 等服务接入，以及海外 agent store。产品层把显示、相机、语音、动作和 AI 服务串成多模态入口。真正壁垒仍取决于模型路由、上下文保持、权限确认、离线降级和开发者工具是否可复现。",
    availability: "Rokid 中国官网展示带显示 AI 眼镜、开发者服务和 YodaOS-Master；日本报道确认 Smart AI Glasses 于 2026 年 7 月 10 日以 109,990 日元含税价格在官方店、Amazon、Rakuten 等渠道及 75 家线下店销售。中国各型号售价、海外 agent store 正式目录、地区模型可用性、处方镜片、交付与售后为 source not stated。众筹金额与支持者数量属于平台/公司报道，不等于长期活跃用户。",
    limitsOrUnknowns: "YodaOS 的公开叙述很强，但完整 SDK、agent 权限模型、应用审核、token 分成、网络中断策略、隐私提示和第三方服务数据路径仍未全部公开。规格来自日本媒体采访报告，不能自动外推到所有 Rokid 型号。用户留存、日常使用率、翻译准确率、显示户外可读性与续航需要独立测量。把“首款 AI-native OS”写成行业事实会越过证据边界，本文保留公司定位与媒体报道标签。",
    productVerdict: "Rokid 是今天中国/全球线最完整的 AIOS 产品信号：硬件已在日本进入一般销售，OS、模型切换与 agent store 试图把生态从设备售卖推进到服务入口。机会在开放和本地化，风险在 OS 是否真的给开发者可用的权限、调试、分发和收益机制。下一步要看 agent store 是否按期开放，以及用户能否在真实旅行、工作和噪声场景里持续完成任务。"
  },
  en: {
    productName: "Rokid Smart AI Glasses + YodaOS",
    productType: "Rokid Smart AI Glasses are AI/AR glasses with cameras, microphones, speakers, and binocular display. YodaOS is the AI-native smart-glasses operating system Rokid introduced publicly in June 2026. The China signal has moved beyond one pair of glasses toward an OS, model switching, third-party services, and an agent store: Rokid says users can choose among ChatGPT, Gemini, DeepSeek, and Alibaba’s Qwen, positioning the glasses as an AI entry point rather than a phone accessory.",
    interactionFlow: "The wearer uses voice, temple touch, gaze, or body movement to trigger photos, translation, AR navigation, visual questions, and tasks. The launch material describes a camera capture, speech recognition, model processing, display or audio feedback loop. YodaOS connects multimodal input to agents and external services: translate a foreign sign, provide a travel route, or call a work procedure. The overseas agent platform has been released and an agent store was scheduled for July; exact catalog and rollout need verification.",
    specsOrStack: "Mogura VR lists approximately 49 grams, Sony IMX681 12MP, a 109-degree wide-angle lens, F2.25, HDR, noise reduction and stabilization, binocular Micro LED displays, 1,500 nits, a 30-degree field of view, Snapdragon AR1 Gen 1, Wi-Fi 6, Bluetooth 5.3, 2GB RAM, and 32GB ROM for the Japan product. The system also includes YodaOS, a phone app, AI services, display, and audio output. Rokid’s official page shows YodaOS-Master and developer services but does not state every model’s price, battery, retention policy, or edge/cloud split; missing details remain source not stated.",
    useCases: "Reported jobs include face-to-face and travel translation, reading signs and menus, AR navigation, hands-free capture, visual questions, work prompts, and services involving payments, livestreaming, or cloud tools. The Japan product is described as an all-in-one camera, translation, and AR-navigation device and went on general sale on July 10, 2026 through Rokid’s store, Amazon, Rakuten, and 75 physical stores. The China/global distinction is which models, services, and retail path are locally available.",
    painPointsSolved: "Rokid targets dependence on a phone and a single model. A user can trigger a capability by intent rather than opening an app; partners can place an agent in a platform rather than rebuild each feature per device; overseas users can choose models and channels by region. Multimodal input targets walking, travel, and work where staring at a phone is awkward. The cost is a harder explanation problem across models, permissions, quality, and accountability.",
    newTech: "YodaOS makes an ‘AI-native OS’ an intent-management and agent-ecosystem proposition, not merely a chatbot in settings. Rokid highlights model switching, integrations with WeChat, Douyin, Alipay, JD.com, Alibaba Cloud, Google Cloud, and AWS, plus an overseas agent store. Display, camera, voice, movement, and AI services become one multimodal entry point. The technical moat depends on routing, context persistence, permission confirmation, offline fallback, and reproducible developer tools.",
    availability: "Rokid’s China site lists display AI glasses, developer services, and YodaOS-Master. The Japan report confirms general sale from July 10, 2026 at 109,990 yen including tax through the official store, Amazon, Rakuten, and 75 physical stores. China pricing by model, the final overseas agent-store catalog, regional model availability, prescription options, delivery, and support are source not stated. Crowdfunding totals are platform/company signals, not long-term active-user evidence.",
    limitsOrUnknowns: "YodaOS has a strong public narrative, but the complete SDK, agent permission model, app review, token economics, network-failure behavior, privacy indicators, and third-party data paths are not all public. The detailed specifications come from a Japan interview report and should not be generalized to every Rokid model. Retention, daily use, translation accuracy, outdoor readability, and battery need independent measurement. Calling it the industry’s first AI-native OS as a universal fact would exceed the evidence.",
    productVerdict: "Rokid is the most complete China/global AIOS signal in today’s issue: the hardware is in Japanese general sale, while the OS, model switching, and agent-store story tries to move the ecosystem from device sales to a service entry point. Its opportunity is openness and localization; its risk is whether developers receive usable permissions, debugging, distribution, and economics. The next test is whether the store opens on schedule and whether people complete tasks in real travel, work, and noisy environments."
  }
});

const metaUrl = "https://about.fb.com/news/2026/07/metas-ai-glasses-your-questions-answered/";
const meta = makeProduct({
  id: "meta-ai-glasses-capture-led-privacy-update",
  section: "official",
  zhHeadline: "Meta 把 capture LED 防篡改写成相机级硬件约束",
  enHeadline: "Meta turns capture-LED tamper detection into a camera-level hardware constraint",
  sourceDate: "2026-07-08 official FAQ · 2026-07-12 regional update",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official privacy control · review/community friction",
  visual: visual("meta-ai-glasses-privacy-source-2026-07.png", 1600, 1000, "Meta AI Glasses privacy FAQ", metaUrl, "Meta 官方 FAQ 页面截图；capture LED、相机禁用、设备端导入和旁观者隐私说明以原文为准。", "Meta official FAQ screenshot; capture LED, camera disabling, device-side import, and bystander privacy follow the source."),
  hciZh: ["可见录制状态", "防篡改恢复", "旁观者信任"],
  hciEn: ["visible capture state", "tamper recovery", "bystander trust"],
  sources: [
    source("Meta AI Glasses privacy FAQ", metaUrl),
    source("Meta glasses privacy approach", "https://www.meta.com/help/smart-glasses/articles/health-safety-and-privacy/privacy-glasses/"),
    source("Android Central hands-on", "https://www.androidcentral.com/wearables/meta-glasses-hands-on-review")
  ],
  zh: {
    productName: "Meta AI Glasses",
    productType: "Meta AI Glasses 是带摄像头、麦克风、扬声器和 Meta AI 的日常眼镜产品。今天值得记录的产品变化来自 Meta 7 月 FAQ：capture LED 变成相机工作状态的外部信号，第二代起，系统检测到 LED 被遮挡、关闭、物理改造或破坏时会禁用相机。产品焦点因此从“有没有隐私承诺”落到旁观者能看见什么、设备会允许什么。",
    interactionFlow: "用户通过语音、镜腿控制或手机 companion app 拍照、录视频、听音频、调用 Meta AI，再选择何时把内容导入手机图库。照片录制时 LED 短暂闪烁，视频录制时持续闪烁；用户佩戴者会听到快门声。Meta 说明设备上的图库内容先存于眼镜，导入手机后才进入手机图库；当 LED 被遮挡或检测到篡改，拍摄路径被系统阻断，恢复条件是 LED 未被遮挡且未处于篡改状态。",
    specsOrStack: "官方确认的栈包括 capture LED、相机、麦克风、扬声器、眼镜本地存储、手机导入、Meta AI 和 companion app。Meta 没有在这份 FAQ 中披露处理器、RAM、相机具体型号、录制码率、端云模型分工或 LED 的亮度与检测阈值，因此这些细节写 source not stated。第二代相机禁用、防篡改检测和数据导入路径是公开的行为约束，不应扩写成隐私绝对保证。",
    useCases: "已公开使用包括免手持拍照和视频、听音乐与播客、向 AI 提问、把所见场景交给 AI、再把选择的内容导入手机分享。对佩戴者，拍摄入口减少拿手机的动作；对周围人，LED 提供一个可见的录制提示。真实产品场景还包括多人聚会、公共交通、零售空间和工作现场，这些地方的可接受性取决于旁观者是否理解 LED、佩戴者是否能解释拍摄行为。",
    painPointsSolved: "系统处理两类痛点：佩戴者想要持续可用的相机/助手入口，旁观者不想面对不可见的录制。把 LED 和 camera permission 绑定，减少用户用胶带遮灯后仍能拍摄的灰色状态；设备端存储与用户主动导入减少“所有内容自动上云”的直觉风险。代价是硬件和系统需要识别篡改，用户在 LED 故障或误判时会失去相机能力。",
    newTech: "新意是把社会规范编码进硬件状态机：capture LED 不只是提示灯，也成为相机许可的一部分。Meta 还说明持续改进对物理改造的检测，并会处理售卖 LED 篡改服务的内容。产品设计上，这是一条“状态可见—能力联动—异常恢复”的链路；它把隐私从设置页移到佩戴者和旁观者共同能观察的物理反馈层。",
    availability: "Meta FAQ 已公开，相关 AI Glasses 产品持续销售；具体地区、代际和功能随产品而变。FAQ 没有给出新的统一售价、发货日、固件版本、LED 检测功能的逐型号覆盖或所有地区的开关路径，均为 source not stated。Android Central 报道早期 7 月软件更新会在检测到 LED 被篡改时禁用相机，但本文以 Meta 官方 FAQ 的行为描述为主。",
    limitsOrUnknowns: "公开资料没有说明误判率、检测延迟、LED 被自然遮挡时的恢复体验、是否存在无相机的 AI 请求路径，也没有独立测试证明旁观者确实能在日光、拥挤环境和远距离看到 LED。Meta 说相机禁用的是对录制能力的约束，不等于所有传感器、语音或云端数据处理都停止。用户仍需要理解每个功能的采集边界。",
    productVerdict: "Meta 把隐私争议转成一个可测试的产品动作：灯被遮或被破坏，相机停。它比一条隐私声明更接近真实交互，却仍需要独立评测、清晰的状态反馈和地区化规则来证明可信度。AI 眼镜接下来的竞争点，会包括能否让旁观者和佩戴者共享同一套录制状态，而非只让拥有者在 App 里看设置。"
  },
  en: {
    productName: "Meta AI Glasses",
    productType: "Meta AI Glasses are everyday glasses with cameras, microphones, speakers, and Meta AI. The product change worth recording today comes from Meta’s July FAQ: the capture LED becomes an external signal of camera activity, and from the second generation onward the camera is disabled when the system detects that the LED has been covered, disabled, physically modified, or destroyed. The product question moves from whether privacy is promised to what bystanders can see and what the device will allow.",
    interactionFlow: "The wearer uses voice, temple controls, or the companion app to take photos and video, listen to audio, ask Meta AI questions, and decide when to import captures to the phone gallery. The LED blinks briefly for a photo and continuously during video; the wearer hears a shutter sound. Meta says gallery captures are stored on the glasses until the user imports them to the phone. If the LED is blocked or tampering is detected, the capture path is blocked; recovery requires the LED to be unblocked and no longer in a tampered state.",
    specsOrStack: "The source confirms a capture LED, camera, microphones, speakers, local glasses storage, phone import, Meta AI, and a companion app. The FAQ does not state processor, RAM, camera model, recording bitrate, edge/cloud model split, or LED brightness and detection thresholds, so those details remain source not stated. Second-generation camera disabling and the tamper-detection behavior are public constraints; they should not be expanded into an absolute privacy guarantee.",
    useCases: "Documented uses include hands-free photos and video, music and podcasts, questions to the assistant, asking about a live scene, and importing selected captures for sharing. The wearer gets a lower-friction camera and assistant entry point; people nearby get a visible recording cue. Real settings include gatherings, public transit, retail, and workplaces, where acceptance depends on whether bystanders understand the LED and whether the wearer can explain the recording behavior.",
    painPointsSolved: "The system addresses two problems: the wearer wants an always-available camera and assistant, while bystanders do not want invisible recording. Binding the LED to camera permission reduces the ambiguous state in which a user covers the light yet keeps recording. Local capture storage and deliberate import reduce the intuitive risk of everything going to the cloud automatically. The cost is that hardware and software must judge tampering, and false positives can remove camera access.",
    newTech: "The product move is to encode a social norm in a hardware state machine: the capture LED is part of camera permission, not merely an indicator. Meta also says it is improving detection of physical modification and acting against services that sell LED-tampering methods. The design pattern is visible state, capability coupling, and recovery. Privacy moves out of a settings page into a physical feedback layer shared by wearer and bystanders.",
    availability: "Meta’s FAQ is public and the AI Glasses product family remains on sale, with details varying by region and generation. The FAQ does not provide a new universal price, shipping date, firmware version, model-by-model coverage, or every regional control path; those remain source not stated. Android Central reports an early-July software update that disables the camera when LED tampering is detected, while this dossier prioritizes Meta’s own behavior description.",
    limitsOrUnknowns: "The sources do not state false-positive rate, detection latency, recovery after natural obstruction, whether an AI query can run without camera access, or whether all sensors and cloud processing stop when the camera is disabled. Independent testing has not established that bystanders can see the LED in daylight, crowds, or at distance. A camera constraint is not the same thing as a complete data-processing boundary.",
    productVerdict: "Meta turns a privacy dispute into a testable product action: if the light is covered or damaged, the camera stops. That is closer to real interaction than a policy statement, while independent testing, clear status feedback, and local rules are still needed. The next contest for AI glasses includes whether wearer and bystander can share the same recording state, rather than leaving the boundary visible only inside an app."
  }
});

const htcUrl = "https://www.vive.com/us/newsroom/2025-08-14/";
const htc = makeProduct({
  id: "htc-vive-eagle-local-ai-glasses",
  section: "reviews",
  zhHeadline: "HTC VIVE Eagle 把相机、翻译和本地数据放进一副生活化眼镜",
  enHeadline: "HTC VIVE Eagle puts camera, translation, and local data into lifestyle eyewear",
  sourceDate: "2025-08-14 official launch · 2026-07-01 HardwareZone review",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official product · review/community friction",
  visual: visual("htc-vive-eagle-source-2026-07.png", 1600, 1000, "HTC VIVE Eagle", htcUrl, "HTC VIVE 官方产品页截图；12MP 相机、VIVE AI、13 语言翻译、电池与隐私说明以官方资料为准。", "HTC VIVE official product-page screenshot; 12MP camera, VIVE AI, 13-language translation, battery, and privacy follow the source."),
  hciZh: ["语音作为主入口", "本地数据边界", "翻译反馈"],
  hciEn: ["voice as primary entry", "local-data boundary", "translation feedback"],
  sources: [
    source("HTC VIVE Eagle official launch", htcUrl),
    source("HTC VIVE Eagle product page", "https://www.vive.com/us/product/vive-eagle/overview/"),
    source("HardwareZone hands-on review", "https://www.hardwarezone.com.sg/mobile/wearables/htc-vive-eagle-ai-smart-glasses-review"),
    source("HTC security and privacy whitepaper", "https://dl.htc.com/report_materials/htc_security_and_privacy_whitepaper.pdf")
  ],
  zh: {
    productName: "HTC VIVE Eagle",
    productType: "VIVE Eagle 是 HTC 的相机型 AI 眼镜系统，配套 VIVE Connect 手机应用和 VIVE AI 云服务。它把语音助手、免手拍照、音乐、提醒、笔记、餐厅推荐和拍照翻译放进日常镜框，产品形态更接近音频眼镜加视觉输入，适合旅行和快速记录。",
    interactionFlow: "用户佩戴眼镜，通过“Hey VIVE”等语音指令或快捷键拍照、录制、记提醒、做笔记、询问推荐、播放音乐和调用翻译。相机捕获的内容交给 VIVE AI，翻译结果通过开放式音频播放；用户也可以在手机应用中管理内容和设置。官方支持 OpenAI GPT 与 Google Gemini 等第三方模型，模型切换、网络可用性和结果质量成为实际流程的一部分。",
    specsOrStack: "HTC 官方列出 12MP ultra-wide camera、低于 49 g 的镜框、235mAh 电池、最高 36 小时待机、约 4.5 小时连续音乐播放、10 分钟充至约 50%、开放式音频、ZEISS sun lenses、LED 录制指示、AES-256 加密和 13 种翻译语言。系统由眼镜、VIVE Connect 和 cloud AI service platform 构成。芯片、RAM、录制分辨率、Wi-Fi/蜂窝方式与 VIVE AI 的端云分工为 source not stated。",
    useCases: "已公开场景包括旅行时拍摄街景和翻译菜单、用语音记录提醒、在路上听音乐和接听电话、寻找餐厅、给眼前内容做语音翻译，以及第一人称记录。它面向需要保留双手、保持环境感知和减少掏手机次数的人。开放式音频保留环境声，视觉捕获则让翻译和内容理解比纯音频眼镜更具体。",
    painPointsSolved: "VIVE Eagle 试图消除“看到之后还要掏手机”的动作，把相机、语音和翻译放在同一入口；本地存储和匿名化声明处理用户对照片和语音被训练的担心。评测指出，AI 眼镜仍受手机配对、应用设置、网络与回答准确度影响。产品把流程变短，却把第三方模型、云服务和数据边界带到眼镜体验里。",
    newTech: "主要组合是 12MP ultra-wide camera、开放式音频、VIVE AI 多模型接入、13 语言拍照翻译、眼镜端本地数据存储与 AES-256。HTC 还把 LED 遮挡和移除时的自动停录写入隐私设计。新技术的产品价值取决于反馈：用户必须知道照片是否拍到、翻译是否开始、结果来自哪个模型，以及网络中断后如何恢复。",
    availability: "HTC 官方宣布 VIVE Eagle 首发台湾，官方价格 NT$15,600，提供 Berry、Coffee、Grey、Black 四色；美国页面公开了产品信息，实际零售地区和交付仍需按当地页面核对。发布资料还提到两年 VIVE AI Plus，订阅覆盖和地区资格为 source not stated。2026 年 7 月的 HardwareZone 评测提供了真实使用摩擦，但不是 HTC 的规格替代品。",
    limitsOrUnknowns: "官方的“本地存储”“不用于训练”和“匿名化”仍需要技术审计与独立测试；第三方模型请求会改变数据路径。公开资料没有给出拍照上传延迟、翻译准确率、开放式音频漏音测量、连续 AI 续航、处方镜片区域或手机断连时的降级模式。评测对 AI 眼镜的准确性、连接和日常价值保持保留。",
    productVerdict: "VIVE Eagle 是一条完整可购买的相机型 AI 眼镜路线：语音负责触发，相机负责看见，开放式音频负责回传，手机和云负责补齐能力。它的优势是场景具体，风险是体验高度依赖连接、第三方模型和清晰的数据说明。对产品设计而言，最重要的交互仍是“正在拍什么、谁在处理、何时结束”。"
  },
  en: {
    productName: "HTC VIVE Eagle",
    productType: "VIVE Eagle is HTC’s camera-based AI glasses system, paired with the VIVE Connect mobile app and a VIVE AI cloud service. It puts voice assistance, hands-free photos, music, reminders, notes, restaurant recommendations, and photo translation into an everyday frame. The form factor is closer to audio glasses with visual input than to an immersive display product, aimed at travel and fast capture.",
    interactionFlow: "The wearer uses a phrase such as ‘Hey VIVE’ or a shortcut to take a photo, record, create a reminder, write a note, ask for a recommendation, play music, or translate. The camera capture is sent to VIVE AI and translation comes back through open-ear audio; the phone app manages content and settings. HTC supports third-party model platforms including OpenAI GPT and Google Gemini, so model availability, network access, and response quality are part of the real interaction flow.",
    specsOrStack: "HTC lists a 12MP ultra-wide camera, a frame under 49 grams, a 235mAh battery, up to 36 hours of standby, about 4.5 hours of continuous music playback, roughly 50% charge after ten minutes, open-ear audio, ZEISS sun lenses, a recording LED, AES-256 encryption, and translation across 13 languages. The system consists of the glasses, VIVE Connect, and a cloud AI service platform. Chip, RAM, recording resolution, connectivity method, and the edge/cloud split are source not stated.",
    useCases: "Documented jobs include photographing a street scene and translating a menu while traveling, recording reminders by voice, listening to music and taking calls outdoors, finding a restaurant, translating what the camera sees into speech, and creating first-person records. The product targets users who want free hands, environmental awareness, and fewer phone pulls. Open-ear audio preserves ambient sound while the camera makes translation and visual understanding more concrete than an audio-only device.",
    painPointsSolved: "VIVE Eagle targets the action of seeing something and then reaching for a phone by putting camera, voice, and translation behind one entry point. Local storage and anonymization claims address concern about photos and voice being used for training. The review evidence shows that pairing, app setup, network conditions, and answer quality still shape the experience. The flow is shorter, while third-party models, cloud services, and data boundaries become part of the glasses product.",
    newTech: "The combination is a 12MP ultra-wide camera, open-ear audio, multi-model VIVE AI access, 13-language photo translation, local glasses storage, and AES-256. HTC also makes recording stop when the LED is obstructed or the glasses are removed. The design value depends on feedback: users need to know whether a photo was captured, whether translation started, which model supplied the answer, and what happens after a network failure.",
    availability: "HTC announced an initial Taiwan launch at NT$15,600 in Berry, Coffee, Grey, and Black. The US product page is public, while actual retail regions and delivery should be checked locally. Launch material mentions two years of VIVE AI Plus, but subscription coverage and regional eligibility are source not stated. HardwareZone’s July 2026 review supplies hands-on friction and does not replace HTC’s specification pages.",
    limitsOrUnknowns: "Claims about local storage, no training use, and anonymization still need technical audit and independent testing; third-party model requests change the data path. Public sources do not state capture upload latency, translation accuracy, measured audio leakage, continuous AI runtime, prescription availability by region, or a phone-disconnected fallback mode. Review evidence remains cautious about accuracy, connectivity, and everyday value.",
    productVerdict: "VIVE Eagle is a complete, purchasable camera-AI glasses route: voice triggers, the camera sees, open-ear audio returns the answer, and phone plus cloud services fill the gaps. Its strength is concrete use cases; its risk is dependence on connectivity, third-party models, and clear data explanations. The key product interaction remains: what is being captured, who is processing it, and when does it stop?"
  }
});

const haloUrl = "https://brilliant.xyz/products/halo";
const halo = makeProduct({
  id: "brilliant-labs-halo-open-source-ai-glasses",
  section: "wild",
  zhHeadline: "Brilliant Labs Halo 把开源硬件、端侧 NPU 和长期记忆 agent 放在开发者入口",
  enHeadline: "Brilliant Labs Halo puts open hardware, an edge NPU, and a memory agent behind a developer entry point",
  sourceDate: "2026-03 Alif partnership · 2026-07 official product/developer pages",
  evidenceLabel: "startup signal",
  evidenceStrength: "startup signal · developer surface · source-backed product page",
  visual: visual("brilliant-labs-halo-source-2026-07.png", 1600, 1000, "Brilliant Labs Halo", haloUrl, "Brilliant Labs Halo 官方产品页截图；开源、Noa、Vibe Mode、价格和规格以官方页为准。", "Brilliant Labs Halo official product-page screenshot; open source, Noa, Vibe Mode, price, and specifications follow the source."),
  hciZh: ["开发者可改造", "记忆可控性", "端侧 AI 反馈"],
  hciEn: ["developer modification", "memory control", "edge-AI feedback"],
  sources: [
    source("Brilliant Labs Halo product page", haloUrl),
    source("Brilliant Labs developer page", "https://brilliant.xyz/pages/developers"),
    source("Halo developer documentation", "https://docs.brilliant.xyz/halo/halo/"),
    source("Brilliant Labs and Alif partnership", "https://www.businesswire.com/news/home/20260311666274/en/Brilliant-Labs-and-Alif-Semiconductor-Partner-on-Development-of-New-Technologies-for-Next-Generation-AI-Powered-Smart-Glasses"),
    source("Brilliant community shipping discussion", "https://www.reddit.com/r/SmartGlasses/comments/1spf1l6/are_brilliant_labs_halo_glasses_shipping_now/")
  ],
  zh: {
    productName: "Brilliant Labs Halo",
    productType: "Halo 是 Brilliant Labs 面向创作者和开发者的开放式 AI 眼镜。官方售价 349 美元，产品页把 Noa 私人对话 agent、长期记忆、Vibe Mode、彩色显示、开源硬件和软件放在一起。它选择“可拆解、可开发”的路径，目标是让眼镜成为可编程的 embodied interface，而不是只消费一个封闭助手。",
    interactionFlow: "用户可以通过语音或触控唤醒 Noa，围绕所见、所听和想法进行对话；Vibe Mode 允许用自然语言描述想做的体验。开发者使用 Brilliant SDK、Flutter SDK 和官方文档构建应用，硬件与软件仓库提供更深层改造入口。产品页还描述记忆增强、视觉/音频对话和翻译，具体触发手势、显示反馈、第三方 agent 权限和应用分发路径需要开发者资料继续确认。",
    specsOrStack: "官方资料列出略高于 40g、Micro Color OLED、2 个骨传导扬声器、Alif Balletto B1 低功耗 AI 处理器、Cortex-M55 CPU 与 Ethos-U55 NPU、低功耗光学传感器、双麦克风、6-axis IMU、tap detection、Bluetooth 5.3、ZephyrOS with Lua interface、跨平台移动 App、cloud-based AI agent，以及官网规格页标出的 14 小时 all-day battery。Alif 合作资料支持 B1/NPU 的端侧 AI 方向；RAM、摄像头规格、模型参数和端云切分为 source not stated。",
    useCases: "Halo 适用于把看到的物体、听到的语句和个人记忆连接起来，做翻译、免手问答、创意原型、HUD 小应用和实验性 agent。开发者可以利用光学传感器、麦克风、IMU、显示和骨传导音频创建自己的反馈回路。对用户，它把“记得我见过什么”作为持续价值；对创作者，它把硬件、SDK、Lua/Flutter 和社区项目放在同一试验场。",
    painPointsSolved: "开放平台降低了封闭眼镜无法改造、无法接入自有模型、无法研究传感器反馈的门槛；端侧 NPU 路线则试图降低持续视觉/语音任务对云端的依赖。长期记忆解决的是用户反复解释背景的痛点。代价是用户要承担隐私、模型选择、应用质量和硬件维护，记忆 agent 还会扩大“设备记住了什么”的解释与删除需求。",
    newTech: "组合亮点是 Alif B1 的 Cortex-M55 加 NPU、低功耗 optical sensor、彩色 Micro OLED、开源硬件/软件和 Noa memory agent。Vibe Mode 把自然语言变成开发入口，SDK 把眼镜从单一 App 变成可编程平台。真正的新交互问题是端侧推理完成时如何反馈、云端 agent 介入时如何提示、长期记忆写入前如何获得同意。",
    availability: "Halo 产品页公开 349 美元价格，并写明 shipping starts Q1 2026；开发者页、文档和产品页可访问，处方/太阳镜镜片通过合作伙伴提供，显示 optic 调节范围写为 +2 到 -6 diopters。当前页面没有给出所有国家的库存、交付状态、Noa+ 覆盖、完整应用商店和 SDK 开放资格；这些保持 source not stated。社区仍在讨论实际发货与等待时间，因此本条保留 startup signal。",
    limitsOrUnknowns: "官方规格与实际量产体验之间仍有证据空缺：没有独立评测证明 14 小时在显示、麦克风、记忆和云请求混合负载下成立，也没有公开的 NPU 模型、摄像头能力、误唤醒率、数据保留实测或开发者 marketplace。官方条款还说明目前没有公开 developer marketplace，社区存在等待发货的讨论。",
    productVerdict: "Halo 代表开发者优先的 AI 眼镜路线：它把能量预算、开放源码、传感器和 agent 记忆同时交给实验者。349 美元降低试错门槛，开源与端侧 NPU提高了研究价值；量产、发货、应用分发和记忆治理仍决定它是可用平台还是有吸引力的开发套件。产品判断应保持 startup signal，不提前升级为成熟消费生态。"
  },
  en: {
    productName: "Brilliant Labs Halo",
    productType: "Halo is Brilliant Labs’ open AI glasses for creators and developers. The official page lists a $349 price and combines Noa, a private conversational agent with long-term memory, Vibe Mode, a color display, open hardware, and open software. The bet is that glasses become a programmable embodied interface rather than a closed assistant that users merely consume.",
    interactionFlow: "A user can wake Noa by voice or touch and talk about what they see, hear, or imagine; Vibe Mode lets a person describe an experience in natural language. Developers use the Brilliant SDK, Flutter SDK, and documentation to build applications, while open hardware and software repositories provide deeper modification paths. The product page describes memory enhancement, visual and audio dialogue, and translation, while exact gestures, display feedback, third-party agent permissions, and distribution remain to be confirmed in developer material.",
    specsOrStack: "Brilliant lists a little over 40 grams, a Micro Color OLED, two bone-conduction speakers, an Alif Balletto B1 low-power AI processor with a Cortex-M55 CPU and Ethos-U55 NPU, a low-power optical sensor, dual microphones, a six-axis IMU, tap detection, Bluetooth 5.3, ZephyrOS with a Lua interface, a cross-platform mobile app, a cloud AI agent, and a 14-hour all-day battery claim on its specifications page. The Alif partnership supports the edge-AI direction; RAM, camera details, model parameters, and edge/cloud split are source not stated.",
    useCases: "Halo is positioned for connecting objects seen, speech heard, and personal memory, as well as translation, hands-free questions, small HUD applications, creative prototypes, and experimental agents. A developer can combine the optical sensor, microphones, IMU, display, and bone-conduction audio into a custom feedback loop. For users, the promise is remembering what they encountered; for creators, the value is a shared experimental surface for hardware, SDKs, Lua/Flutter, and community projects.",
    painPointsSolved: "An open platform lowers the barrier created by closed glasses that cannot be modified, connected to a preferred model, or used for sensor research. The edge-NPU route tries to reduce dependence on the cloud for continuous visual and audio tasks. Long-term memory reduces the need to restate context. The cost is that users take on privacy, model choice, app quality, and hardware maintenance, while memory agents create stronger requirements to explain and delete what the device remembers.",
    newTech: "The combination is an Alif B1 Cortex-M55 plus NPU, low-power optical sensing, a color Micro OLED, open hardware and software, and the Noa memory agent. Vibe Mode turns natural language into a development entry point, while the SDK turns glasses from one app into a platform. The hard interaction questions are how edge inference is signaled, how cloud-agent involvement is disclosed, and how consent is obtained before long-term memory is written.",
    availability: "Halo’s product page lists $349 and says shipping starts in Q1 2026. The developer page, documentation, and product page are public; prescription and sunglass options are offered through a partner, with the display optic listed as adjustable from +2 to -6 diopters. The current page does not state inventory and delivery for every country, Noa+ coverage, a complete app store, or general SDK eligibility. Community discussion still questions actual shipping and wait times, so this remains a startup signal.",
    limitsOrUnknowns: "There is an evidence gap between the published specification and a mass-produced experience. Independent testing has not established that 14 hours survives mixed display, microphone, memory, and cloud-request load. Public sources do not state the NPU models, camera capability, false-wake rate, measured data retention, or a developer marketplace. Brilliant’s terms say it does not currently operate a public developer marketplace, and community posts report shipping uncertainty.",
    productVerdict: "Halo represents a developer-first AI-glasses route that hands the energy budget, source access, sensors, and agent memory to experimenters. The $349 price lowers the cost of trying the form factor, while open design and an edge NPU make it valuable for research. Production, shipping, distribution, and memory governance decide whether it is a usable platform or an attractive kit. Keep the verdict at startup signal rather than mature consumer ecosystem."
  }
});

const topics = [
  androidXr,
  meta,
  rokid,
  htc,
  halo,
  carry("snap-specs-agent-first-ar-glasses", "official"),
  carry("even-g2-camera-free-productivity-glasses", "reviews"),
  carry("qualcomm-snapdragon-reality-elite-on-device-xr", "global"),
  carry("microsoft-project-solara-mdep-agent-first-devices", "official"),
  carry("community-ai-glasses-friction-scan", "community", "meta-ai-glasses-privacy-source-2026-07.png"),
  carry("openai-gpt-live-voice-interface", "official"),
  carry("acti-agentic-keyboard", "wild"),
  carry("nvidia-xr-ai-viture-helix", "global"),
  carry("zai-zcode-china-global", "china"),
  carry("china-ai-glasses-os-scan", "china"),
  carry("wearable-agent-research-patent-watch-scan", "research"),
  carry("patent-lane-glasses-ip-scan", "patent")
];

const issue = {
  date: "2026-07-15",
  timezone: "America/Toronto",
  zhTitle: "AI Daily 2026-07-15：AI 眼镜开始争夺 spatial software layer",
  enTitle: "AI Daily 2026-07-15: AI Glasses Start Fighting for the Spatial Software Layer",
  zhSummary: "Google/Samsung 把 intelligent eyewear 的音频与显示路线接到 Gemini；Android XR Developer Preview 4 给出 Projected、Compose Glimmer 和 Device Availability API；Rokid 的 YodaOS 与日本上市把中国线推进到 AIOS 和 agent store。今天的产品问题从“眼镜能做什么”推进到“谁控制眼前的界面、模型与分发”。",
  enSummary: "Google and Samsung connect audio and display intelligent eyewear to Gemini; Android XR Developer Preview 4 exposes Projected, Compose Glimmer, and Device Availability APIs; Rokid’s YodaOS and Japanese sale push the China signal toward an AIOS and agent store. The product question moves from what glasses can do to who controls the interface, models, and distribution in front of the user.",
  tags: ["AI glasses", "Android XR", "YodaOS", "spatial software", "on-device AI", "Gemini", "agent UX", "HCI"],
  sourceTypes: ["official", "reviews", "community", "wild", "research", "patent", "china", "global"],
  zhPath: "./2026-07-15/zh/",
  enPath: "./2026-07-15/en/",
  sourcesPath: "./2026-07-15/sources.md",
  coverStory: {
    topicId: "android-xr-intelligent-eyewear-developer-surface",
    zhTitle: "AI 眼镜开始争夺 spatial software layer",
    enTitle: "AI glasses start fighting for the spatial software layer",
    imagePath: "assets/android-xr-intelligent-eyewear-source-2026-05.png",
    imageWidth: 1600,
    imageHeight: 1000,
    primarySourceUrl: androidXrUrl,
    imageSourceUrl: androidXrUrl,
    evidenceStrength: "developer surface · official Android XR · pre-launch eyewear",
    whyCover: "Google/Samsung define audio and display eyewear around Gemini; Android XR gives developers Projected, Glimmer, emulator, and device-availability state; Rokid pushes a parallel AIOS and agent-store route. The contest is becoming the software layer that decides what appears, which model acts, and how the user recovers.",
    zhSummary: [
      "Google/Samsung 公开 audio glasses 与 display glasses 两条路线，Gemini 负责语音、翻译、通知和动作入口。",
      "Android XR Developer Preview 4 把 Projected、Compose Glimmer、emulator 和 Device Availability API 交给开发者。",
      "Rokid 用 YodaOS、模型切换和 agent store 把中国 AI 眼镜竞争推进到 OS、服务与分发层。"
    ],
    enSummary: [
      "Google and Samsung show audio and display eyewear with Gemini for voice, translation, notifications, and actions.",
      "Android XR Developer Preview 4 gives developers Projected, Compose Glimmer, an emulator, and device-availability state.",
      "Rokid uses YodaOS, model switching, and an agent store to move the China signal into OS, service, and distribution layers."
    ]
  },
  designDesk: {
    zhTitle: "Design Desk：把 spatial software 做成可见、可停、可恢复的界面",
    enTitle: "Design Desk: Make spatial software visible, stoppable, and recoverable",
    zhIntro: "今天的产品资料共同指向一个可执行的 HCI 要求：用户要知道眼前的信息从哪里来、哪个模型在处理、设备是否可用、动作代表谁，以及失败后如何回到手机或现实任务。",
    enIntro: "Today’s product evidence points to an actionable HCI requirement: users need to know where field-of-view information came from, which model is processing it, whether the device is available, who an action represents, and how to return to the phone or physical task after failure.",
    zhItems: [
      { label: "设备是否可用", body: "Android XR 的 Device Availability API 把佩戴状态带入 app 生命周期；未佩戴、断连和权限拒绝都应有可理解的回退。" },
      { label: "显示层级要可扫读", body: "Compose Glimmer 面向透明显示提供组件；产品不能把手机长页面原样搬到视野里。" },
      { label: "模型路由要可见", body: "Rokid 的多模型和 HTC 的第三方模型都需要告诉用户请求去了哪里、由谁处理、结果如何恢复。" },
      { label: "LED 与麦克风是社会契约", body: "Meta 把 capture LED 绑定相机许可；无相机产品也要让麦克风、连接和显示边界可见。" },
      { label: "低摩擦入口需要低成本撤销", body: "语音、镜腿触控、眼动和 agent action 越快，停止、取消、重试和回到手机就越要近。" },
      { label: "研究、专利和野生线索继续降级", body: "VisionClaw、专利、社区和 wild signals 只能生成设计假设，不能替代可购买硬件与真实用户证据。" }
    ],
    enItems: [
      { label: "Is the device available?", body: "Android XR’s Device Availability API brings worn state into app lifecycle. Unworn, disconnected, and denied states need understandable fallbacks." },
      { label: "Display hierarchy must scan", body: "Compose Glimmer targets optical displays; a phone-length page cannot be moved into the field of view unchanged." },
      { label: "Model routing needs a surface", body: "Rokid’s multi-model route and HTC’s third-party access need to show where a request went, who processed it, and how to recover." },
      { label: "LEDs and microphones are social contracts", body: "Meta couples the capture LED to camera permission. Camera-free products still need legible microphone, connection, and display boundaries." },
      { label: "Low-friction triggers need cheap reversal", body: "The faster voice, touch, gaze, and agent actions become, the closer stop, cancel, retry, and return-to-phone controls must be." },
      { label: "Research, patent, and wild signals stay downgraded", body: "VisionClaw, patents, community posts, and wild signals generate design hypotheses, not shipping hardware or user evidence." }
    ]
  },
  watchlistZh: [
    "Android XR：秋季硬件的真实型号、显示/音频差异、权限确认和 Device Availability 的断连回退。",
    "Meta AI Glasses：capture LED 防篡改更新的逐型号覆盖、误判恢复和旁观者可见性。",
    "HTC VIVE Eagle：实际地区发货、AI Plus 订阅、第三方模型数据路径和连续 AI 续航。",
    "Brilliant Labs Halo：Q1 2026 发货兑现、14 小时混合负载、B1/NPU 开发面与 Noa 记忆控制。",
    "Snap SPECS / Even G2：秋季发货、显示节奏、手机依赖、日常佩戴与隐私状态。",
    "Qualcomm、Project Solara、Android XR：合作设备、公开 API、端侧模型和企业管理面。",
    "Rokid YodaOS agent store、VisionClaw、专利：保持产品/研究/专利标签，等待可复现生态和运行证据。"
  ],
  watchlistEn: [
    "Android XR: actual autumn hardware, audio/display differences, permission confirmation, and disconnect fallback around Device Availability.",
    "Meta AI Glasses: model-by-model coverage, false-positive recovery, and bystander visibility for LED tamper updates.",
    "HTC VIVE Eagle: regional shipping, AI Plus subscription, third-party model data paths, and continuous AI runtime.",
    "Brilliant Labs Halo: Q1 2026 shipping, mixed-load battery, B1/NPU development surface, and Noa memory controls.",
    "Snap SPECS and Even G2: fall shipping, display pacing, phone dependence, daily wear, and privacy state.",
    "Qualcomm, Project Solara, and Android XR: partner hardware, public APIs, edge models, and enterprise management.",
    "Rokid’s YodaOS agent store, VisionClaw, and patents: keep product, research, and patent labels until ecosystem evidence is reproducible."
  ],
  topics
};

await fs.writeFile(issuesPath, JSON.stringify([issue, ...issues.filter((item) => item.date !== "2026-07-15")], null, 2) + "\n");
console.log(`Created 2026-07-15: ${topics.length} topics, ${new Set(topics.flatMap((topic) => topic.sources.map((item) => item.url))).size} unique sources.`);
