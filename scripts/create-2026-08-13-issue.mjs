import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((issue) => issue.date === "2026-08-12");
if (!previous) throw new Error("Missing 2026-08-12 source issue");

const issue = structuredClone(previous);
const date = "2026-08-13";
issue.date = date;
issue.zhTitle = "AI Daily 2026-08-13：从系统智能到随身线索";
issue.enTitle = "AI Daily 2026-08-13: From system intelligence to everyday clues";
issue.zhSummary = "Pixel 11 把 Gemini Intelligence、相机和系统状态推到默认入口；Pixel Watch 5 把健康趋势与生成式表盘放到腕上；Pixel Tag 则把寻找物品补进 Google 的设备图谱。今天的主线是：AI 设备开始互相接力，但每一层都需要可见的状态、边界和恢复路径。";
issue.enSummary = "Pixel 11 moves Gemini Intelligence, camera context, and system state into the default path; Pixel Watch 5 puts health trends and generative watch faces on the wrist; Pixel Tag fills a missing node in Google's device graph. Today's line is simple: AI devices are beginning to hand work to one another, and every layer needs visible state, boundaries, and recovery.";
issue.zhPath = `/ai-daily/${date}/zh/`;
issue.enPath = `/ai-daily/${date}/en/`;
issue.sourcesPath = `/ai-daily/${date}/sources.md`;
issue.sourceTypes = ["official", "Google Store", "hands-on review", "Reddit", "research", "patent watch", "China", "global"];

for (const topic of issue.topics) {
  topic.sourceDate = `${topic.sourceDate} · 2026-08-13 current source sweep`;
}

const pixelStore = "https://store.google.com/us/category/phones?hl=en-US";
const geminiStore = "https://store.google.com/magazine/gemini-ai-assistant?hl=en-US";
const pixelWatchStore = "https://store.google.com/product/pixel_watch_5?hl=en-US";
const pixelTagStore = "https://store.google.com/product/pixel_tag?hl=en-US";
const pixelReview = "https://www.techradar.com/phones/google-pixel-phones/ive-used-the-new-pixel-11-pixel-11-pro-and-pixel-11-pro-xl";
const watchReview = "https://www.androidcentral.com/wearables/google-pixel-watch-5-hands-on";
const community = "https://www.reddit.com/r/Android/comments/1vmfam6/made_by_google_26_pixel_11_series_megathread/";
const tagReview = "https://cincodias.elpais.com/smartlife/gadgets/2026-08-13/pixel-tag-oficial-caracteristicas-precio.html";

function source(label, url, type) {
  return { label, url, type };
}

function visual(pathName, captionZh, captionEn, sourceUrl) {
  return {
    path: pathName,
    width: 1600,
    height: 900,
    altZh: captionZh,
    altEn: captionEn,
    captionZh,
    captionEn,
    sourceUrl,
    kind: "source-backed official product-page screenshot"
  };
}

const pixelTopic = {
  id: "google-pixel-11-gemini-intelligence",
  section: "official",
  dossierKind: "product",
  evidenceLabel: "confirmed product",
  evidenceStrength: "official Google Store page + hands-on review + community launch thread",
  zhHeadline: "Pixel 11：Gemini Intelligence 把手机变成跨应用的默认工作台",
  enHeadline: "Pixel 11: Gemini Intelligence turns the phone into a cross-app work surface",
  zhFact: "Google Store 已列出 Pixel 11、Pixel 11 Pro、Pixel 11 Pro XL 与 Pixel 11 Pro Fold；页面把 Gemini Intelligence、相机自动整理、HiLight、Tensor G6、Titan M3 和七年更新放进同一个设备叙事。",
  enFact: "The Google Store now lists Pixel 11, Pixel 11 Pro, Pixel 11 Pro XL, and Pixel 11 Pro Fold; its device story combines Gemini Intelligence, automatic camera curation, HiLight, Tensor G6, Titan M3, and seven years of updates.",
  zhValue: "新变化在入口层：用户可以从当前屏幕、相机、邮件、地图和日历开始交给 Gemini 处理，不必先决定打开哪个 App。",
  enValue: "The change is at the entry-point layer: users can start from the current screen, camera, email, Maps, or Calendar and ask Gemini to move the task forward without first choosing an app.",
  sourceDate: "2026-08-12 official launch · 2026-08-12 hands-on · 2026-08-13 store and community sweep",
  visual: visual("assets/google-pixel-11-official-2026-08.png", "Google Store Pixel 11 产品页截图；官方视觉证据", "Google Store Pixel 11 product page; official visual evidence", pixelStore),
  sources: [
    source("Google Store Pixel 11 family", pixelStore, "official"),
    source("Google Store Gemini Intelligence", geminiStore, "official"),
    source("TechRadar Pixel 11 hands-on", pixelReview, "review"),
    source("r/Android Made by Google megathread", community, "community")
  ],
  dossier: {
    zh: {
      productName: "Google Pixel 11 系列 / Gemini Intelligence",
      productType: "这是 Google 的第 11 代 Pixel 手机系统，包含 Pixel 11、Pixel 11 Pro、Pixel 11 Pro XL 与 Pixel 11 Pro Fold，并把 Gemini Intelligence 作为系统级协作层。它仍然是手机，却把相机、邮件、地图、日历、照片、通知和个人上下文放到一个可被自然语言调用的工作面上。官方 Store 页面确认了设备家族、Tensor G6、Titan M3、HiLight、七年更新、相机自动整理和跨应用协作；TechRadar 的 8 月 12 日 hands-on 则提供了真实上手后的速度、尺寸、镜头凸起和“延续多于革命”的判断。",
      interactionFlow: "用户可以从手机当前状态开始：看到邮件和行程时，请 Gemini 从 Gmail 找到旅行信息并保存到 Google Maps，或把航班细节加入 Calendar；拍摄一段视频后，Pixel Camera 可以用一次点击同时保留照片和视频，并自动编辑、筛选出可分享的集合；Pixel 11 Pro 的 HiLight 会在重要来电需要注意时发光，让用户不必持续盯屏。用户也可以从 Gemini 入口直接描述一个任务，让系统在多个 Google App 之间整理信息、生成回复或继续创作。这个流程把“选 App—复制信息—执行—回头检查”压成“描述目标—审看结果—确认动作”，但当前公开证据没有说明每一类跨 App action 的逐步确认界面，因此高风险动作仍应要求用户复核。",
      specsOrStack: "Google Store 页面列出 Pixel 11 为 6.3 英寸 Actua 屏、12GB RAM、Tensor G6、30+ 小时电池、48MP 主摄、13MP 超广角、10.8MP 长焦、最高 30x Super Zoom、256GB/512GB 存储，前置 10.5MP 自动对焦和 4K 视频；Pro 系列最高 16GB RAM，Pro 版本最高 120x Pro Zoom，官方称 Tensor G6 比上一代最多多 50% 计算能力。系统还包括 Titan M3 安全芯片、Gemini Intelligence、Pixel Camera、Google Photos、Gmail、Maps、Calendar 与 Pixel Watch 协作。Google 页面没有说明 Tensor G6 的所有 CPU/GPU 参数、Gemini 在每项任务中的端云分工、API 名称、离线能力、模型版本、跨 App 权限粒度或所有市场的价格，因此这些部分写作 source not stated。",
      useCases: "具体工作包括：从邮件中找旅行建议并保存到 Maps；把航班信息加入 Calendar；在拍摄后自动筛选适合分享的照片和视频；在嘈杂或忙碌时通过 HiLight 只提示真正重要的来电；用 Gemini 整理多个 App 的信息；用 Pro 机型拍摄远处对象并交给相机和 AI 做后期处理。手机依旧适合需要视觉确认、长文本编辑、支付前复核和复杂权限判断的任务。对创作者，它把拍摄、选片、生成和发布连接得更紧；对普通用户，价值在于减少在 App 之间搬运信息的次数，而不是增加一个孤立聊天入口。",
      painPointsSolved: "传统手机 AI 的问题是能力分散在功能菜单里：用户必须先知道应该打开 Gmail、Maps、Calendar、Photos 还是相机，才能把问题交给系统。Pixel 11 的产品路径试图消除这层选择成本，让当前屏幕和个人上下文成为起点，并用相机、系统提示和跨 App 协作接住后续动作。它也在解决“AI 很强但我错过了提醒”的注意力问题：HiLight 用低打扰的物理视觉反馈把重要来电从连续看屏里分离出来。代价是系统需要清楚显示调用了什么个人信息、即将写入哪个 App，以及用户如何撤销已经发生的操作。",
      userVoice: "TechRadar 在正式发布当天上手 Pixel 11、11 Pro 与 11 Pro XL，认为 Tensor G6 带来的重点更像效率和神经处理器的改进，而不是外观革命；编辑称早期使用足够快，但还不愿在没有完整测试前做性能定论，并注意到标准 Pixel 11 的 6.3 英寸尺寸、40% 变薄的相机凸起和新颜色。r/Android 的发布 megathread 记录了大量 hands-on、预购链接和“硬件变化有限”的讨论，但它是社区聚合，不是代表性用户研究。Google Store 的价格、地区、运营商与功能开放仍需按具体配置和账户确认。",
      newTech: "新技术点不是单个模型，而是手机硬件、相机计算、系统提示、跨 App actions 和个人上下文被放进同一条运行时链路。Tensor G6 与 TPU 被定位为更快、更省电的 AI 基础；Gemini Intelligence 负责预测需求、组织信息和推动下一步；Pixel Camera 负责把原始素材变成可分享集合；HiLight 则把系统状态从屏幕移到机身光反馈。对产品团队，这是一种“系统代理 + 传感器 + 低打扰反馈”的组合：AI 不必每次通过聊天框出现，也可以通过相机入口、通知排序和一束光进入用户的动作节奏。",
      availability: "Google Store 已在美国页面提供 Pixel 11 家族的正式产品页和预购/购买入口，页面显示 Pixel 11、Pro、Pro XL 与 Pro Fold 为 New；Google Store 还提供 Pixel Watch 5 的捆绑优惠文案。具体价格、发货日、可购买国家、运营商计划、Gemini Intelligence 的账户条件、语言开放、某些相机和跨 App 功能的分批 rollout，必须按配置、地区和账户查看；没有被当前来源明确写出的细节均为 source not stated。",
      limitsOrUnknowns: "当前证据不能证明 Gemini 会在所有 App 中自动完成动作，也没有公开每个动作的权限提示、撤销、失败恢复和审计记录。官方“最多 50% 计算能力”不是独立性能基准；TechRadar 也明确表示尚未做完整 Tensor G6 测试。相机自动整理可能改变用户对“原片”和“精选片”的边界，HiLight 只在 Pro 机型出现。Gemini 的端云分工、个人上下文保留、离线可用性、错误率、每个国家的语言和功能差异、Pixel Tag 与 Watch 的完整协同仍需要实机验收。",
      productVerdict: "Pixel 11 是今天最强的 confirmed product：它把手机从“装有 AI 功能的硬件”推进到“能读取当前状态并协调多个表面”的系统入口。真正值得跟踪的不是 Tensor G6 的宣传数字，而是 Gemini 是否能让用户少做一次 App 选择、少搬运一次信息，并在执行前后保持可见控制。Google 的方向已经从单点问答走向系统协作；产品判断要等实际权限、回滚和跨设备接力被用户看见后才能成立。"
    },
    en: {
      productName: "Google Pixel 11 family / Gemini Intelligence",
      productType: "This is Google’s 11th-generation Pixel phone system: Pixel 11, Pixel 11 Pro, Pixel 11 Pro XL, and Pixel 11 Pro Fold, with Gemini Intelligence positioned as a system-level collaboration layer. It is still a phone, but the product surface now connects camera, email, Maps, Calendar, Photos, notifications, and personal context to a natural-language task path. The official Store page confirms the device family, Tensor G6, Titan M3, HiLight, seven years of updates, automatic camera curation, and cross-app assistance. TechRadar’s hands-on on August 12 adds practical evidence about responsiveness, size, the smaller camera bar, and a product direction that is more refinement than reinvention.",
      interactionFlow: "The user starts from the current phone state. While looking at email and travel information, they can ask Gemini to find recommendations in Gmail and save them to Google Maps, or add flight details to Calendar. After recording, Pixel Camera can capture photos and video with one tap, then automatically edit and curate a shareable collection. On Pixel 11 Pro, HiLight glows when an important call needs attention, reducing the need to keep checking the screen. The user can also describe a goal directly to Gemini and ask the system to organize information across Google apps, draft a response, or continue a creative task. The flow compresses “choose an app, copy context, act, and check back” into “describe the goal, inspect the result, and authorize the action.” The public material does not yet document the confirmation UI for every cross-app action, so high-consequence actions still need explicit user review.",
      specsOrStack: "Google’s Store page lists the Pixel 11 with a 6.3-inch Actua display, 12GB RAM, Tensor G6, 30+ hours of battery life, a 48MP main camera, 13MP ultrawide, 10.8MP telephoto, up to 30x Super Zoom, 256GB or 512GB storage, a 10.5MP autofocus front camera, and 4K video. The Pro family goes up to 16GB RAM and up to 120x Pro Zoom; Google says Tensor G6 provides up to 50% more computing power than the previous generation. The system includes Titan M3 security, Gemini Intelligence, Pixel Camera, Google Photos, Gmail, Maps, Calendar, and Pixel Watch coordination. Google does not disclose every CPU/GPU detail, Gemini’s exact edge/cloud split, API names, offline behavior, model version, cross-app permission granularity, or all market pricing, so those details remain source not stated.",
      useCases: "Concrete jobs include finding travel recommendations in email and saving them to Maps, adding flight information to Calendar, turning a burst of capture into a curated shareable set, using HiLight to surface an important call during a busy moment, organizing information across multiple apps with Gemini, and using the Pro camera system to capture distant subjects for computational editing. The phone remains the right surface for visual confirmation, long-form editing, payment review, and complex permission decisions. For creators, the value is a tighter capture-to-selection-to-publish loop. For everyday users, the promise is fewer context transfers between apps, not another isolated chat window.",
      painPointsSolved: "The old problem with phone AI is fragmentation: users must know whether the job belongs in Gmail, Maps, Calendar, Photos, the camera, or a settings menu before asking the system to help. Pixel 11 tries to remove that selection cost by making current screen state and personal context the starting point, then using camera, system cues, and cross-app coordination to carry the task forward. It also addresses the attention problem of capable AI that users still miss: HiLight uses a low-interruption physical cue to separate an important call from continuous screen checking. The tradeoff is that the system must show what personal data it used, which app will be changed, and how the user can undo the result.",
      userVoice: "On launch day, TechRadar handled the Pixel 11, 11 Pro, and 11 Pro XL and described Tensor G6’s likely impact as an efficiency and neural-processing improvement rather than a visual revolution. The reviewer found the early experience suitably quick but declined to make broad performance claims before full testing, and called out the standard Pixel 11’s comfortable 6.3-inch size, 40% slimmer camera bar, and new colors. The r/Android launch megathread collects hands-on links, preorder links, and recurring comments that the hardware change is limited; that is community aggregation, not representative user research. Google Store pricing, carrier terms, regions, and feature access still depend on configuration and account.",
      newTech: "The new technology is not one model in isolation. It is the runtime combination of phone hardware, computational photography, system cues, cross-app actions, and personal context. Tensor G6 and its TPU are positioned as a faster, more efficient AI base; Gemini Intelligence predicts needs, organizes information, and advances the next step; Pixel Camera turns raw capture into a shareable set; and HiLight moves a system state into a physical light cue. For product teams, this is a “system agent plus sensors plus low-interruption feedback” pattern. AI does not have to appear as a chat box every time; it can arrive through a camera entry point, notification prioritization, or a brief light signal inside the user’s existing rhythm.",
      availability: "Google’s US Store now exposes official Pixel 11 family product pages and preorder or purchase paths, with Pixel 11, Pro, Pro XL, and Pro Fold marked New. The Google Store also shows Pixel Watch 5 bundle language. Exact prices, shipping dates, countries, carrier plans, Gemini Intelligence account requirements, language support, and staged rollout of specific camera or cross-app features must be checked for the selected configuration and region. Any detail not explicitly stated by the current sources remains source not stated.",
      limitsOrUnknowns: "The current evidence does not prove that Gemini will complete actions in every app, and it does not document confirmation, undo, failure recovery, or audit logging for every action. Google’s “up to 50% more computing power” is a vendor claim, not an independent benchmark; TechRadar also says it has not completed full Tensor G6 testing. Automatic curation may change the boundary between an original capture and a chosen highlight, and HiLight is limited to Pro models. Gemini’s edge/cloud split, personal-context retention, offline behavior, error rates, country-level language and feature differences, and complete Pixel Tag/Watch handoff still require device acceptance.",
      productVerdict: "Pixel 11 is today’s strongest confirmed product signal because it moves the phone from hardware that contains AI features toward a system surface that can read current state and coordinate several services. The meaningful question is not the Tensor G6 marketing number. It is whether Gemini removes one app choice and one context transfer while keeping control visible before and after execution. Google has clearly moved from isolated answers toward system collaboration; the product verdict depends on users seeing the permission boundary, rollback path, and cross-device handoff in daily use."
    }
  }
};

const watchTopic = {
  id: "google-pixel-watch-5-gemini-health",
  section: "reviews",
  dossierKind: "product",
  evidenceLabel: "confirmed product",
  evidenceStrength: "official Store page + hands-on review",
  zhHeadline: "Pixel Watch 5：腕上 AI 的价值落在趋势与训练，而不是换一块表",
  enHeadline: "Pixel Watch 5: the wrist value is trends and training, not a new watch shell",
  zhFact: "Pixel Watch 5 以 Wear OS 7、Gemini、健康趋势、训练构建器和生成式表盘作为主要更新；Android Central hands-on 指出外形延续、芯片仍为 Snapdragon W5 Gen 2 Accelerated。",
  enFact: "Pixel Watch 5 centers its update on Wear OS 7, Gemini, health trends, workout building, and generative watch faces; Android Central says the shell is familiar and the chip remains Snapdragon W5 Gen 2 Accelerated.",
  zhValue: "它把 AI 从手机的长任务入口拆成腕上短反馈：看趋势、设训练、回消息和决定是否拿出手机。",
  enValue: "It breaks AI away from the phone’s long-form task surface into short wrist decisions: check trends, build a workout, reply, and decide whether the phone is needed.",
  sourceDate: "2026-08-12 launch · 2026-08-13 hands-on sweep",
  visual: visual("assets/pixel-watch-5-official-2026-08.png", "Google Store Pixel Watch 5 产品页截图", "Google Store Pixel Watch 5 product page", pixelWatchStore),
  sources: [source("Google Store Pixel Watch 5", pixelWatchStore, "official"), source("Android Central Pixel Watch 5 hands-on", watchReview, "review")],
  dossier: {
    zh: {
      productName: "Google Pixel Watch 5",
      productType: "Pixel Watch 5 是运行 Wear OS 7 的智能手表，和 Pixel 手机、Gemini、Fitbit 健康服务组成一个腕上 AI 入口。它的产品重点不在重新设计外壳，而在健康趋势、训练工作流、手表回复、Generative Watch Faces 以及不拿手机也能完成的短动作。",
      interactionFlow: "用户把手表与兼容的 Android 手机配对，在手腕上查看通知、消息和健康信息；需要回复时，可直接用 Gemini 辅助生成更准确的短回复，或通过轻点完成选择。训练时，用户可以使用 weight and rep tracking、rest timers 和 workout builder 组织一组训练；健康趋势则需要连续追踪，Android Central 引述 Google 代表称某些趋势大约需要一个月日常数据才会出现。用户还可以让 Nano Banana 生成表盘。",
      specsOrStack: "Android Central 的规格表列出 Wear OS 7、Snapdragon W5 Gen 2 Accelerated、Cortex M55 协处理器、Actua 360 AMOLED LTPO 1–60Hz/3,000 nits、64GB eMMC、指南针、气压计、SpO2、ECG 兼容电传感器、多路径光学心率、加速度计、陀螺仪、环境光、cEDA、皮温、磁力计，以及 5ATM/IP68。41mm 为 332mAh、AOD 约 30 小时，45mm 为 465mAh、AOD 约 40 小时；具体功能、地区和健康服务资格以官方账户与地区为准。",
      useCases: "手表适合在走路、训练、通勤和不方便拿手机时看短信息、回复消息、检查健康趋势、设置休息计时器和查看训练进度。生成式表盘是低风险个性化场景；训练构建器是需要逐步确认的结构化任务；健康趋势更适合作为长期自我观察，而不是一次读数的医疗判断。",
      painPointsSolved: "Pixel Watch 5 解决的是手机必须被反复掏出的摩擦：短回复、训练计时、通知筛选和趋势查看都可以在手腕上完成。它也把“健康数据很多但没有解释”推进到趋势层，让用户等待一段时间后再看变化。代价是腕上屏幕空间、输入速度和电池都有限；复杂任务仍应回到手机，健康结果也不能被表述为诊断。",
      userVoice: "Android Central 的 hands-on 认为外形和使用感与前两代很接近，批评每年更新的硬件变化不大，同时认为 Gemini、健康趋势、训练功能和生成式表盘是购买理由。评测者还指出当时无法完整体验胰岛素抵抗趋势和血压趋势，因为这些功能尚未可试。这个信号说明腕上 AI 的评价标准已经从“有没有助手”转向“长期数据何时变成可用反馈”。",
      newTech: "新技术点是把生成式表盘、健康趋势和训练动作组合成一套短反馈系统，而不是在手表上复制手机聊天。Wear OS 7 提供系统表面，传感器持续积累数据，Gemini 和健康算法负责把数据转成下一步提示；这个链路要求用户知道哪些结果来自长期趋势、哪些只是当下测量，以及何时应该停止自动化并寻求专业判断。",
      availability: "Google Store 已上线 Pixel Watch 5 产品页面并在 Pixel 11 促销中展示相关优惠；Android Central 的发布日报道了 41mm/45mm、Wi‑Fi/LTE 等配置。具体售价、发货日、健康功能地区、账户要求、手机兼容性、订阅和运营商方案需要在当地 Store 与支持页确认；当前来源没有明确的细节均为 source not stated。",
      limitsOrUnknowns: "外观变化有限，芯片不是最新 Snapdragon Wear Elite；AOD 使用会缩短电池，健康趋势需要长期佩戴，部分功能在 hands-on 时还不可用。公开来源没有给出 Gemini 在手表上的完整模型路由、离线能力、错误率、隐私保留周期和跨设备确认机制。健康趋势、血压和胰岛素抵抗相关功能不能被当作医学诊断。",
      productVerdict: "Pixel Watch 5 的价值成立条件是“手腕承担短决策，手机承担长任务”。它不是一次硬件跃迁，却把腕上反馈变得更具体：趋势、训练、回复和个性化都能在日常节奏里出现。对设计团队，最值得复用的是把长期数据转成可等待、可解释、可退出的反馈，而不是把 Gemini 缩小成一块手表聊天框。"
    },
    en: {
      productName: "Google Pixel Watch 5",
      productType: "Pixel Watch 5 is a Wear OS 7 smartwatch positioned as a wrist-level AI surface connected to Pixel phones, Gemini, and Fitbit health services. Its story is not a redesigned shell. It is health trends, workout flows, short replies, generative watch faces, and small tasks that can be completed without pulling out a phone.",
      interactionFlow: "The user pairs the watch with a compatible Android phone and checks notifications, messages, and health information on the wrist. When a reply is needed, Gemini can help form a more accurate short response, or the user can tap through a choice. During training, weight and rep tracking, rest timers, and a workout builder structure the session. Health trends depend on continued tracking; Android Central quotes a Google representative saying that some trends need roughly a month of daily data before they become visible. The user can also ask Nano Banana to generate a watch face. The pattern is short wrist decision, longer phone task only when needed.",
      specsOrStack: "Android Central’s specification table lists Wear OS 7, Snapdragon W5 Gen 2 Accelerated, a Cortex M55 coprocessor, an Actua 360 AMOLED LTPO display with 1–60Hz refresh and 3,000 nits, 64GB eMMC, compass, altimeter, SpO2 sensors, ECG-compatible electrical sensors, multipath optical heart rate, accelerometer, gyroscope, ambient light, cEDA, skin temperature, and magnetometer. The 41mm model uses a 332mAh battery for about 30 hours with AOD; the 45mm uses 465mAh for about 40 hours with AOD. Exact feature eligibility, regions, and health-service access depend on the official account and market.",
      useCases: "The watch is suited to checking short messages while walking, managing a workout when the phone stays away, reading health trends, setting rest timers, tracking sets and reps, and making a quick reply during a commute. Generative watch faces are a low-consequence personalization case. Workout building is a structured task that should remain easy to review. Health trends are better treated as long-term self-observation than as a medical conclusion from one reading.",
      painPointsSolved: "Pixel Watch 5 addresses the friction of repeatedly taking out a phone. Short replies, workout timing, notification filtering, and trend checks can happen on the wrist. It also tries to move health data from a pile of measurements toward a time-based trend that becomes useful after sustained tracking. The tradeoff is limited screen area, slow input, and battery cost; complex work still belongs on the phone, and health output must not be presented as diagnosis.",
      userVoice: "Android Central’s hands-on says the shape and feel remain close to the prior generations and criticizes the limited hardware change from one yearly release to the next, while identifying Gemini, health trends, workout features, and generative watch faces as the meaningful reasons to consider the watch. The reviewer could not fully test insulin-resistance and blood-pressure trends because they were not ready during capture. The signal is useful: wrist AI is judged less by the existence of an assistant than by when longitudinal data becomes actionable feedback.",
      newTech: "The product increment is the combination of generative watch faces, health trends, and structured workout actions into a short-feedback system, rather than shrinking phone chat onto a watch. Wear OS supplies the surface, sensors build a time series, and Gemini plus health algorithms turn information into a next step. That chain requires clear distinctions between a long-term trend, a current measurement, and a moment when automation should stop and professional judgment should take over.",
      availability: "Google Store now exposes a Pixel Watch 5 product page and shows Pixel Watch 5 bundle language alongside the Pixel 11 launch. Android Central reports 41mm and 45mm configurations with Wi-Fi and LTE options. Exact price, ship date, health-feature regions, account requirements, phone compatibility, subscriptions, and carrier plans must be checked in the local Store and support pages; any detail not explicit in the current sources remains source not stated.",
      limitsOrUnknowns: "The exterior changes little, the chip is not the newest Snapdragon Wear Elite, and AOD reduces battery life. Health trends require sustained wear, and some features were not available to test during the hands-on. Public sources do not give the complete Gemini routing, offline behavior, error rate, privacy retention, or cross-device confirmation model on the watch. Trend, blood-pressure, and insulin-resistance features must not be treated as medical diagnosis.",
      productVerdict: "Pixel Watch 5 works when the wrist handles short decisions and the phone handles long tasks. It is not a major hardware leap, but it makes wrist feedback more concrete: trends, training, replies, and personalization can appear inside the day’s rhythm. The reusable design lesson is to turn longitudinal data into feedback that is slow enough to be credible, clear enough to interpret, and easy to exit—not to compress Gemini into a tiny watch chat box."
    }
  }
};

const tagTopic = {
  id: "google-pixel-tag-device-graph",
  section: "global",
  dossierKind: "product",
  evidenceLabel: "confirmed product",
  evidenceStrength: "launch coverage + official Store product page",
  zhHeadline: "Pixel Tag：Google 终于补上可定位的物理世界节点",
  enHeadline: "Pixel Tag: Google finally adds a locatable node to its physical device graph",
  zhFact: "Pixel Tag 在 Made by Google 发布后出现在 Google Store；Cinco Días 报道其使用 UWB 与 Bluetooth Channel Sounding，目标是把物品定位纳入 Pixel 生态。",
  enFact: "Pixel Tag appeared in the Google Store after Made by Google; Cinco Días reports UWB and Bluetooth Channel Sounding, adding object location to the Pixel ecosystem.",
  zhValue: "它没有被证明是 AI 产品，却改变了跨设备的寻找流程：用户先找物，再让系统把手机、Tag 和附近空间接起来。",
  enValue: "It is not proven to be an AI product, but it changes the cross-device finding flow: locate the object first, then let the phone, tag, and nearby space work together.",
  sourceDate: "2026-08-13 launch coverage and Store sweep",
  visual: visual("assets/pixel-tag-official-2026-08.png", "Google Store Pixel Tag 产品页截图", "Google Store Pixel Tag product page", pixelTagStore),
  sources: [source("Google Store Pixel Tag", pixelTagStore, "official"), source("Cinco Días Pixel Tag report", tagReview, "global"), source("r/Android launch megathread", community, "community")],
  dossier: {
    zh: {
      productName: "Google Pixel Tag",
      productType: "Pixel Tag 是 Google 的蓝牙物品追踪器，把可定位的小型附件加入 Pixel 设备图谱。当前来源确认了产品页和发布报道，AI 模型、Gemini 调用或自动代理能力没有被官方或报道明确证实，因此本条把它作为 AI 设备系统的物理补全节点来观察，不把它写成 AI 产品本身。",
      interactionFlow: "用户把 Tag 绑定到 Google 账户和待寻找物品，在手机端查看最近位置或发起寻找；当目标靠近时，Tag 与手机之间的无线测距和声音反馈帮助缩小范围。Cinco Días 报道的 UWB 与 Bluetooth Channel Sounding 让“远端地图位置”有机会继续过渡到“附近到底在哪一侧”的近场查找。当前公开资料没有完整展示配对、共享、丢失模式、通知或家庭成员协作的每一步，因此实际流程需要以产品页面和支持文档为准。",
      specsOrStack: "Cinco Días 报道 Pixel Tag 为白色药丸形，重量略高于 14g，IP67，使用可更换 CR2032 纽扣电池，续航超过一年，并搭载加速度计；连接层包括 Bluetooth、UWB 和 Bluetooth Channel Sounding。Google Store 产品页已上线，但芯片、扬声器、无线协议版本、加密细节、寻物网络规模、兼容手机、地区和价格没有在当前可引用页面中完整列出，均按 source not stated 处理。",
      useCases: "具体场景是寻找钥匙、包、行李、相机包、宠物项圈或其他可挂载物品；用户在远处先看位置，在房间内再通过近场测距缩小方向。对 Pixel 用户，它可能把“手机、手表、耳机、眼镜、Tag”放进同一套设备发现逻辑。它也为 AI agent 留下一个明确的未来动作面：代理可以先判断用户在找什么，再把查找结果、附近空间和下一步提示组合起来；这只是产品机会，不是当前已确认的能力。",
      painPointsSolved: "传统蓝牙追踪器的痛点是远端位置和近端寻找之间断开：地图只告诉用户最后出现在哪，房间内仍要翻找。UWB 和 Bluetooth Channel Sounding 的产品意义在于把最后几米的空间关系变得更具体，减少“我明明在这里但找不到”的反复搜索。它还可能降低 Google 设备生态中附件缺失的成本，让用户不必为寻找功能跳到另一家平台。",
      userVoice: "当前可见用户声音主要来自 r/Android 的发布 megathread：社区在活动当天确认了 Pixel Tag 的预购链接，并把它与 AirTag 进行比较；讨论仍处于发布窗口，不能代表长期可靠性、网络覆盖或隐私满意度。Cinco Días 给出的是发布报道，不是长期评测。关于声音大小、室内定位误差、共享账户、误报和更换电池体验，当前来源没有足够实测，写作上保留为未知。",
      newTech: "新技术点是把 Bluetooth 的广域发现与 UWB、Bluetooth Channel Sounding 的近场测距放进同一条寻找路径。对 HCI 来说，关键不在无线协议名词，而在用户是否能理解系统正在做哪一层定位：最后已知位置、当前网络估计，还是近距离方向提示。若未来交给 agent，系统必须把“我知道什么”和“我只是估计”分开显示。",
      availability: "Pixel Tag 已在 Google Store 出现，并在发布后的媒体报道中被列为 Made by Google 的新附件。当前来源没有完整确认价格、发货国家、手机兼容、Google 账户要求、寻找网络开放范围、订阅和替换电池渠道；这些均为 source not stated。",
      limitsOrUnknowns: "Pixel Tag 当前没有被官方来源证明具备 Gemini 或其他 AI 能力，它的价值仍是定位附件。UWB 和 Bluetooth Channel Sounding 的实际精度、障碍物影响、室内表现、Android 版本要求、隐私保护、丢失模式和家庭共享都需实测。它也不能解决所有丢失场景：电池耗尽、Tag 脱离物品、网络覆盖不足或物品被移动后，系统可能只保留历史信息。",
      productVerdict: "Pixel Tag 的重要性来自系统完整度：AI 设备只有能找到彼此、理解彼此状态，才可能组成真正可协作的个人设备网络。今天它应被看作 confirmed product 和 ecosystem signal，而不是 AI 功能发布。下一步要验证的是近场反馈是否比传统蓝牙更少让用户思考，以及 Google 是否把查找、确认、共享和隐私状态做成可恢复的统一入口。"
    },
    en: {
      productName: "Google Pixel Tag",
      productType: "Pixel Tag is Google’s Bluetooth item tracker, adding a locatable accessory to the Pixel device graph. The current evidence confirms a Store product page and launch coverage, but it does not confirm a Gemini model, AI action, or autonomous agent capability. This dossier therefore treats Pixel Tag as a physical completion node for an AI-device system, not as an AI product claim.",
      interactionFlow: "The user pairs the Tag with a Google account and an item, then checks a recent location or starts a finding session from the phone. When the item is nearby, wireless ranging and sound feedback can help narrow the search. Cinco Días reports UWB and Bluetooth Channel Sounding, which could move the experience from a remote map point to a more specific answer about which side of a nearby room the object is on. The public sources do not show the complete pairing, sharing, lost-mode, notification, or household-collaboration flow, so those steps remain subject to the product page and support documentation.",
      specsOrStack: "Cinco Días reports a white pill-shaped tracker weighing a little over 14g, with IP67 protection, a replaceable CR2032 coin cell, more than a year of battery life, and an accelerometer. The connectivity layer includes Bluetooth, UWB, and Bluetooth Channel Sounding. A Google Store product page is live, but the current citable pages do not fully disclose the chipset, speaker, wireless protocol versions, encryption details, finding-network scale, phone compatibility, regions, or price. Those details remain source not stated.",
      useCases: "Concrete jobs include finding keys, a bag, luggage, a camera case, a pet collar, or another attachable object. The user can check a remote location first and then switch to near-field ranging inside a room. For Pixel owners, the Tag may place phone, watch, earbuds, glasses, and accessories inside one device-discovery logic. It also creates a clear future action surface for an agent: identify what the user is looking for, connect the location result to nearby space, and offer a next step. That is a product opportunity, not a confirmed current capability.",
      painPointsSolved: "The pain in conventional Bluetooth trackers is the gap between remote location and the final search. A map can show where the item was seen, but the user still has to search every surface in a room. UWB and Bluetooth Channel Sounding matter because they can make the final few meters more spatially specific, reducing repetitive searching. Pixel Tag may also lower the cost of a Google user needing to cross into another ecosystem for item finding.",
      userVoice: "The visible user signal is currently a launch-window r/Android megathread. The community confirmed a Pixel Tag preorder link during the event and compared it with AirTag, but this is not evidence of long-term reliability, network coverage, or privacy satisfaction. Cinco Días is launch coverage, not a long-term review. Speaker loudness, indoor error, shared-account behavior, false alerts, and battery replacement experience are not sufficiently tested in the current sources and remain unknown.",
      newTech: "The technical increment is the combination of broad Bluetooth discovery with near-field ranging through UWB and Bluetooth Channel Sounding. The HCI question is not whether users know the protocol names. It is whether the interface distinguishes the last known location, a network estimate, and a near-field directional hint. If a future agent controls the flow, it must separate what it knows from what it is merely estimating.",
      availability: "Pixel Tag is now visible in the Google Store and is listed in launch coverage as a new Made by Google accessory. The current sources do not fully confirm price, shipping countries, phone compatibility, Google Account requirements, finding-network reach, subscriptions, or battery replacement channels; those details remain source not stated.",
      limitsOrUnknowns: "No official source in the current sweep proves that Pixel Tag has Gemini or any other AI capability; its present value is accessory location. The real precision of UWB and Bluetooth Channel Sounding, obstacle behavior, indoor performance, Android version requirements, privacy controls, lost mode, and household sharing need hands-on validation. It cannot solve every loss scenario: dead battery, separation from the object, weak network coverage, or movement after the last observation can leave the system with historical information only.",
      productVerdict: "Pixel Tag matters because of system completeness. AI devices can only collaborate as a personal network if they can find one another and expose state. Today it should be read as a confirmed product and ecosystem signal, not an AI feature launch. The next test is whether near-field feedback makes users think less than conventional Bluetooth search, and whether Google turns finding, confirmation, sharing, and privacy state into one recoverable entry point."
    }
  }
};

issue.topics.unshift(pixelTopic, watchTopic, tagTopic);
issue.coverStory = {
  topicId: pixelTopic.id,
  zhTitle: "Pixel 11 把 Gemini Intelligence 推进系统默认路径",
  enTitle: "Pixel 11 pushes Gemini Intelligence into the default system path",
  zhSummary: [
    "Google 的最新手机更新把 Gemini、相机整理、跨 App actions、HiLight 和个人上下文放进同一个产品表面。",
    "Pixel Watch 5 与 Pixel Tag 继续补齐腕上反馈和物品定位，形成一张正在互相接力的设备图谱。",
    "今天要验证的关键不是“AI 有没有”，而是系统能否在每次接力前后显示状态、权限和恢复路径。"
  ],
  enSummary: [
    "Google’s new phone family puts Gemini, camera curation, cross-app actions, HiLight, and personal context into one product surface.",
    "Pixel Watch 5 and Pixel Tag extend the graph with wrist feedback and object finding, creating a device network that can hand work across surfaces.",
    "The question is not whether AI exists; it is whether the system shows state, permission, and recovery at every handoff."
  ],
  imagePath: pixelTopic.visual.path,
  imageWidth: pixelTopic.visual.width,
  imageHeight: pixelTopic.visual.height,
  imageSourceUrl: pixelStore,
  primarySourceUrl: pixelStore,
  evidenceStrength: "confirmed product · official Store + hands-on review",
  whyCover: "It changes the default entry point from an app feature to a coordinated device-and-system surface."
};
issue.designDesk = {
  zhTitle: "设计台：让设备接力保持可见",
  enTitle: "Design Desk: keep the device handoff visible",
  zhItems: [
    "入口：从当前屏幕、相机、手表或物品状态开始，而不是先找 App。",
    "接力：每次跨 App 或跨设备转交都显示目标、来源和下一步。",
    "反馈：HiLight、腕上短提示和近场测距各自承担不同注意力强度。",
    "证据：长期健康趋势、物品位置和 AI 推断要区分已知、估计与未知。",
    "恢复：高风险动作要能预览、确认、撤销，设备断线后保留传统路径。"
  ],
  enItems: [
    "Entry: start from current screen, camera, watch, or object state instead of choosing an app first.",
    "Handoff: show the source, target, and next step whenever work crosses apps or devices.",
    "Feedback: HiLight, wrist cues, and near-field ranging should carry different attention loads.",
    "Evidence: distinguish long-term health trends, object locations, AI inferences, and unknowns.",
    "Recovery: preview, confirm, undo, and preserve a conventional path when a device disconnects."
  ]
};
issue.watchlistZh = [
  "Pixel 11 Gemini Intelligence：实测跨 App action 的权限、确认、撤销和失败恢复。",
  "Pixel Watch 5：健康趋势是否需要完整 30 天数据，哪些市场可用。",
  "Pixel Tag：UWB / Bluetooth Channel Sounding 的室内精度、共享与隐私。",
  ...issue.watchlistZh
];
issue.watchlistEn = [
  "Pixel 11 Gemini Intelligence: test cross-app permission, confirmation, undo, and failure recovery.",
  "Pixel Watch 5: verify the 30-day trend requirement and market-level health access.",
  "Pixel Tag: test indoor UWB / Bluetooth Channel Sounding accuracy, sharing, and privacy.",
  ...issue.watchlistEn
];

const nextIssues = [issue, ...issues.filter((entry) => entry.date !== date)];
await fs.writeFile(dataPath, `${JSON.stringify(nextIssues, null, 2)}\n`);
console.log(`Prepared ${date}: ${issue.topics.length} topics, ${new Set(issue.topics.flatMap((topic) => topic.sources.map((item) => item.url))).size} unique topic sources, ${new Set([issue.coverStory.imagePath, ...issue.topics.map((topic) => topic.visual.path)]).size} visuals.`);
