import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((entry) => entry.date === "2026-08-21");
if (!previous) throw new Error("Missing 2026-08-21 source issue");

const date = "2026-08-23";
const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "AI Daily 2026-08-23：眼镜、耳罩与机器人开始共享一条观察链路";
issue.enTitle = "AI Daily 2026-08-23: glasses, headsets, and robots share one observation loop";
issue.zhSummary = "本周最实在的产品变化发生在观察链路：雷鸟 iO 用无摄像头双目显示和记忆把 AI 眼镜推向日常佩戴；Razer Motoko 让耳罩承担双目视觉与 developer kit 入口；Orbbec、51WORLD 则把第一视角采集、同步、质检与训练数据做成具身基础设施。AI 产品的竞争点正在从“模型能回答什么”移动到“设备看见什么、用户能否知道它正在看、数据如何进入下一步动作”。";
issue.enSummary = "The most concrete product movement this week is in the observation loop. RayNeo iO uses camera-free binocular display and memory to make AI eyewear more daily-wearable; Razer Motoko turns an earcup headset into a dual-camera developer surface; Orbbec and 51WORLD package first-person capture, synchronization, quality control, and training data as embodied-AI infrastructure. The product contest is moving from what a model can answer to what a device can see, whether people can tell it is seeing, and how evidence becomes the next action.";
issue.zhPath = `/ai-daily/${date}/zh/`;
issue.enPath = `/ai-daily/${date}/en/`;
issue.sourcesPath = `/ai-daily/${date}/sources.md`;
issue.sourceTypes = [...new Set([...(issue.sourceTypes ?? []), "confirmed product", "developer surface", "review/community friction", "research signal", "patent signal", "china", "global"])] ;
for (const topic of issue.topics) topic.sourceDate = `${topic.sourceDate} · 2026-08-23 current source sweep`;

const rayneo = {
  id: "rayneo-io-camera-free-ai-glasses",
  section: "china",
  zhHeadline: "雷鸟 iO：先把 AI 眼镜做成愿意一直戴的眼镜",
  enHeadline: "RayNeo iO makes camera-free display glasses the daily-wear bet",
  zhFact: "雷鸟在 2026 年 8 月 21 日发布 iO AI 眼镜。新华网报道其整机 34g、双目显示、蓝湖光波导、0–1000 度配镜、55 种语言与 109 种口音翻译、会议记录、实时提词和全天智记；官方售价 RMB 2,499，首发到手价 RMB 1,996 起，已在中国线上和线下渠道开售。雷鸟支持页说明配套 App 需要 Android 11.0 或 iOS 15.0 以上。",
  enFact: "RayNeo introduced the iO AI Glasses on August 21, 2026. Xinhua reports a 34-gram frame, binocular display, Lanhu waveguide optics, prescription support from 0 to 1,000 degrees, translation across 55 languages and 109 accents, meeting notes, live prompting, and all-day memory. The listed price is RMB 2,499, with launch pricing from RMB 1,996, and the product is on sale through Chinese online and optical channels. RayNeo support says the companion app requires Android 11.0 or iOS 15.0 or later.",
  zhValue: "iO 的产品选择很明确：它去掉摄像头，把重量、社交阻力和持续记录风险让位给双目显示、骨传导/麦克风输入、智能旋钮与头部姿态操作。用户可以在镜片里看日程、待办和消息，开启实时翻译或提词，在会议中记录并回看摘要，再通过记忆引擎检索当天信息。无摄像头意味着它无法像相机眼镜那样直接理解眼前物体，用户仍要依赖语音、手机或显示内容来提供上下文；这让“主动式 AI”更像一个持续监听与显示的个人界面，而不是视觉助手。",
  enValue: "The product choice is explicit: iO removes the camera and spends the saved weight, social friction, and continuous-capture risk on binocular display, bone-conduction interaction, microphones, a smart crown, and head-gesture control. Users can see schedules, tasks, and notifications in the lens, turn on live translation or prompting, record meetings, review summaries, and retrieve the day through a memory engine. Without a camera, iO cannot directly understand objects in front of the wearer; context still comes from speech, the phone, or displayed information. Its “active AI” is therefore a persistent personal interface, not a visual assistant.",
  zhHciLens: ["输入：旋钮、头势、语音", "输出：镜片文字与低打扰音频", "边界：无摄像头、记忆可删除"],
  enHciLens: ["Input: crown, head gesture, voice", "Output: lens text and low-disruption audio", "Boundary: camera-free, deletable memory"],
  zhImplication: "雷鸟 iO 把“隐私可见性”提前到硬件选择：没有摄像头降低了旁观者对拍摄的担心，但也把主动理解能力限制在语音、显示与手机上下文。产品设计需要把录音指示灯、记忆开始/暂停、原始对话脱敏、本地记录删除、翻译延迟和多人大声对话分离做成用户看得懂的状态，而不能只写全天候 AI。",
  enImplication: "RayNeo moves privacy legibility into the hardware decision. Removing the camera lowers bystander anxiety, but it also constrains proactive understanding to speech, display, and phone context. The product therefore needs visible recording cues, memory start and pause, raw-dialogue redaction, local deletion, translation-latency feedback, and multi-speaker separation. “All-day AI” is not a sufficient state model.",
  sourceDate: "2026-08-21 official launch and China availability · 2026-08-22 Xinhua/IT之家 · 2026-08-22 community discussion · 2026-08-23 current source sweep",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · China availability · official support surface · community friction",
  visual: { path: "assets/rayneo-io-official-2026-08.png", width: 1600, height: 900, kind: "source-backed page screenshot", altZh: "雷鸟 iO 官方产品与支持入口截图", altEn: "RayNeo iO official product and support surface", captionZh: "来源追踪视觉：雷鸟官方站点展示 iO 产品线与支持入口；具体价格、规格和 AI 能力按新华社、IT之家与官方支持页分开核对。", captionEn: "Source-traceable visual: RayNeo's official site shows the iO product line and support surface; price, specifications, and AI capabilities are cross-checked separately against Xinhua, IT Home, and official support pages.", sourceUrl: "https://rayneo.cn/" },
  sources: [
    { label: "RayNeo official site", url: "https://rayneo.cn/", type: "official" },
    { label: "RayNeo support and app compatibility", url: "https://rayneo.cn/support.html", type: "official" },
    { label: "Xinhua iO launch report", url: "https://www3.xinhuanet.com/tech/20260821/1329d3f89e064ea1a60ee2a9c0aed9c3/c.html", type: "china" },
    { label: "IT之家 iO product report", url: "https://m.ithome.com/html/992653.htm", type: "reviews" },
    { label: "r/SmartGlasses iO discussion", url: "https://www.reddit.com/r/SmartGlasses/comments/1vuf3no/rayneo_io_announced_33g_display_smart_glasses/", type: "community" }
  ],
  dossierKind: "product",
  dossier: { zh: {
    productName: "雷鸟 iO AI 眼镜是雷鸟创新在中国发布的显示型、无摄像头 AI 眼镜。它把双目近眼显示、主动式 AI、全天智记、实时翻译、提词和通知放进接近日常眼镜的镜框，产品核心是“持续佩戴的输入输出界面”，而非第一视角相机。",
    productType: "产品类型是消费级显示眼镜、语音/头势输入设备与个人记忆助手的组合。镜片负责显示内容，麦克风和骨传导/相关传感器负责语音交互，右侧智能旋钮提供精确控制，手机 App 负责配对、账户、固件与部分服务。它与无显示 AI 相机眼镜、带摄像头的 AR 眼镜和手机提词 App 形成直接竞争。",
    interactionFlow: "用户佩戴并通过 Android 11 或 iOS 15 以上手机完成配对，旋转智能旋钮、说出问题或使用头部姿态触发功能；系统可以在镜片显示日程、待办、通知、实时翻译和提词，也可以进入会议记录与全天智记。需要特别验证的是录音指示灯何时亮起、记忆何时开始、实时提示是否会抢占视线、多人对话如何选择发言人，以及用户如何在眼镜上暂停、删除或导出记录。官方公开了能力方向，没有公开完整的交互状态图、离线策略和第三方 API。",
    specsOrStack: "新华社披露整机 34g、镁铝合金前框与钛合金镜腿、蓝湖光波导、双目显示、0–1000 度配镜、55 种语言和 109 种口音翻译；IT之家补充 0.085cc 光机、约 1800 尼特入眼亮度、240mAh 电池与两天常规续航等发布会信息。官方支持页确认配套 App 的 Android 11.0/iOS 15.0 门槛。不同报道对重量、亮度、续航和音频结构的表述存在差异，型号、SoC、RAM、端云路由、订阅、API、数据中心区域与精确延迟若未由官方明确说明，均记为 source not stated。",
    useCases: "具体场景包括会议实时提词、跨语言对话、日程与待办提醒、通勤时查看消息、演讲时跟随稿件、需要双手工作的任务提示，以及通过全天智记回顾当天谈话和事项。无摄像头设计适合办公室、校园、公共交通和对录制敏感的社交场景；双目显示则给文字信息提供比手机更低摩擦的输出。对于需要识别商品、路标、维修对象或环境障碍的用户，iO 的视觉能力会受到硬件选择限制，仍需手机或另一台相机设备。",
    painPointsSolved: "它试图解决手机频繁掏出、会议提词设备笨重、翻译时需要盯着屏幕、通知与日程被桌面 App 打断，以及相机眼镜在公共场景中造成的社会不适。34g 与近视适配降低了全天佩戴成本，显示把短文本放进视野，智能旋钮为语音之外提供确定性。它没有解决全天记录的认知负担、翻译错误、镜片可读性、户外强光、视线干扰、隐私权限与云端依赖。社区还在询问定价、订阅、音频结构、开发者开放程度和全球发货，这些都不能用发布会宣传替代。",
    newTech: "新技术组合包括蓝湖光波导、0.085cc 光机、双目 HUD、骨传导相关交互、头部姿态操作、主动式 AI 与记忆引擎。真正的产品创新不在单个模型，而在把输入、显示和记忆串成一个低打扰回路：眼镜需要判断何时主动提示、把答案放在视野哪里、如何在对话中不打断用户，以及如何让记录从“默认存在”变成用户可见、可暂停、可删除的状态。无摄像头也形成一种硬件级隐私边界，但牺牲了视觉问答与环境识别。",
    availability: "新华网报道雷鸟 iO 官方售价 RMB 2,499，首发到手价 RMB 1,996 起，已在中国线上平台和线下眼镜渠道开售；IT之家报道的优惠口径包含国补价格，具体活动可能随渠道变化。官方支持页说明配套 App 支持 Android 11.0 和 iOS 15.0 以上。海外正式销售、全球发货、保修、订阅、完整语言可用性与开发者 SDK 未在本次公开材料中完整说明，均为 source not stated。",
    limitsOrUnknowns: "核心未知包括两天续航的实际负载、18 小时连续记录和 6.2 小时连续翻译是否来自同一测试条件、显示在户外和近视镜片上的可读性、骨传导漏音、多人大声对话分离、翻译延迟、模型联网、记忆原始数据保存位置、账户删除后的清理范围、第三方 App 与 API、以及无摄像头对环境理解的上限。社区 beta 讨论提供体验和疑问，不能代替正式评测；任何未声明的型号、芯片、准确率、服务地区和价格活动都保持 source not stated。",
    productVerdict: "雷鸟 iO 是本期中国 lane 的 confirmed product：它用轻量化、显示与无摄像头策略，明确回答“如何让用户愿意一直戴”。它的价值集中在会议、提词、翻译、通知和记忆，不应被写成能看懂世界的视觉助手。产品判断：硬件边界与隐私状态设计值得关注；下一步应验证真实续航、记忆删除、翻译延迟、多说话人、户外显示、订阅和开发者开放程度。"
  }, en: {
    productName: "RayNeo iO AI Glasses are China-launched display glasses without a camera. They combine binocular near-eye display, proactive AI, all-day memory, live translation, prompting, and notifications in a frame designed to look and feel like daily eyewear. The core proposition is a persistent input-output interface, not a first-person camera.",
    productType: "The product combines consumer display glasses, voice and head-gesture input, and a personal memory assistant. The lens presents information; microphones and bone-conduction-related sensing handle speech interaction; a smart crown adds precise control; and a phone companion handles pairing, accounts, firmware, and some services. It competes with displayless camera glasses, camera-equipped AR glasses, and phone-based prompting apps.",
    interactionFlow: "The wearer pairs the glasses through an Android 11 or iOS 15-and-later phone, turns the smart crown, speaks a request, or uses head posture to trigger a function. The lens can show schedules, tasks, notifications, live translation, and prompts, while meeting recording and all-day memory create a review path. Acceptance testing still needs to establish when the recording indicator turns on, when memory starts, whether live prompts steal attention, how a multi-person conversation is separated, and how the wearer pauses, deletes, or exports records from the glasses. Public material states capabilities but does not expose a complete state diagram, offline strategy, or third-party API.",
    specsOrStack: "Xinhua reports a 34-gram frame, magnesium-aluminum front, titanium temples, Lanhu waveguide optics, binocular display, 0-to-1,000-degree prescription support, and translation across 55 languages and 109 accents. IT Home adds launch-event details including a 0.085cc optical engine, about 1,800 nits in-eye brightness, a 240mAh battery, and two days of typical use. RayNeo support confirms an Android 11.0/iOS 15.0 companion-app threshold. Outlets use different wording for weight, brightness, runtime, and audio structure. Model, SoC, RAM, edge-cloud routing, subscription, API, data-center region, and exact latency remain source not stated unless the official material says otherwise.",
    useCases: "Concrete use cases include live meeting prompts, cross-language conversations, schedule and task reminders, commuter notifications, speech practice, hands-busy task guidance, and reviewing the day through all-day memory. The camera-free design fits offices, schools, transit, and social settings where recording creates discomfort; the binocular display puts short text closer to the current task than a phone. Users who need object, sign, repair-part, or obstacle recognition will meet a hard limit because iO has no camera and must rely on a phone or another sensor device.",
    painPointsSolved: "iO targets repeated phone retrieval, bulky teleprompter setups, screen fixation during translation, desktop notification interruption, and the social unease created by camera glasses in public. A 34-gram frame and prescription support lower the cost of wearing it all day, while the display and crown give voice interaction a visible and deterministic path. It does not solve the cognitive burden of all-day capture, translation mistakes, optical readability, outdoor brightness, gaze interruption, privacy permissions, or cloud dependency. Community discussion is already asking about price, subscription, audio, developer access, and global shipping; those questions cannot be answered by launch marketing.",
    newTech: "The new combination is Lanhu waveguide optics, a 0.085cc optical engine, binocular HUD, bone-conduction-related interaction, head gestures, proactive AI, and a memory engine. The product innovation is the low-disruption loop between input, display, and recall: the glasses must decide when to proactively prompt, where to place an answer, how not to interrupt a conversation, and how to turn a recording from an invisible default into a visible, pausable, deletable state. The camera-free choice is a hardware privacy boundary, but it also removes visual question answering and environmental perception.",
    availability: "Xinhua reports an official price of RMB 2,499 and launch pricing from RMB 1,996, with sales through Chinese online platforms and optical channels. IT Home describes additional subsidy and channel pricing that may change by promotion. RayNeo support says the companion app supports Android 11.0 and iOS 15.0 or later. Formal overseas sales, global shipping, warranty, subscription, complete language coverage, and an SDK are not fully established by the public material reviewed today and remain source not stated.",
    limitsOrUnknowns: "Key unknowns include real runtime under mixed use, whether 18 hours of continuous recording and 6.2 hours of continuous translation share the same test conditions, outdoor and prescription-lens readability, bone-conduction leakage, multi-speaker separation, translation latency, network routing, raw-memory storage, deletion scope after account removal, third-party apps and APIs, and the ceiling created by having no camera. Community beta posts provide experience and questions, not formal review evidence. Any unstated model, chip, accuracy, region, or promotional price remains source not stated.",
    productVerdict: "RayNeo iO is this issue’s clearest China-lane confirmed product. It uses light weight, display, and a camera-free boundary to answer how a user might be willing to wear AI eyewear every day. Its defensible value is meetings, prompting, translation, notifications, and memory; it should not be described as a visual assistant that understands the world. Verdict: the hardware boundary and privacy-state design deserve attention; next, verify runtime, memory deletion, translation delay, speaker separation, outdoor display, subscription, and developer openness."
  } }
};

const orbbec = {
  id: "orbbec-physical-ai-data-physis-vision",
  section: "official",
  zhHeadline: "Orbbec：把具身 AI 的“看见”拆成采集平台与机器人视觉相机",
  enHeadline: "Orbbec splits physical-AI seeing into data capture and robot vision",
  zhFact: "Orbbec 在 8 月 19 日 WRC 2026 发布无本体数据采集硬件平台与 Physis 机器人视觉相机系列。官方称平台覆盖 EGO 第一视角、UMI 手持、WristCam 腕部近场和 Hub 同步中枢；多相机硬件同步误差低于 1ms、出厂标定误差低于 0.3 像素。具体 SKU 价格、交付、SDK 与完整数据格式尚未在该发布页公开。",
  enFact: "At WRC 2026 on August 19, Orbbec announced a Robot-Free Data Collection Hardware Platform and the Physis robotics-vision camera series. The official release describes EGO first-person, UMI handheld, WristCam near-field, and Hub synchronization forms; it claims hardware multi-camera synchronization error below 1 ms and factory-calibration error below 0.3 pixels. The release does not provide SKU pricing, delivery, SDK details, or a complete data schema.",
  zhValue: "Orbbec 处理的是机器人训练和验证中最容易被忽略的采集层：人如何戴着设备完成真实操作，多个相机、IMU 和动作轨迹如何同步，数据如何在进入模型前被检查。它把具身数据从一次性演示素材变成可重复的硬件矩阵，也让机器人视觉相机从单个传感器升格为可部署的空间感知组件。对产品团队来说，价值在于减少“模型失败但不知道是数据、同步还是视觉”的黑箱。",
  enValue: "Orbbec is addressing the often invisible capture layer of robot training and validation: how a person performs a real task while wearing equipment, how cameras, IMUs, and action trajectories stay synchronized, and how data is checked before it reaches a model. The company is turning embodied data from one-off demo footage into a repeatable hardware matrix, while positioning Physis cameras as deployable spatial-perception components. The product value is less a new end-user interface than a way to reduce the black box where a robot failure could come from data, synchronization, or vision.",
  zhHciLens: ["采集：第一视角、手部、腕部", "反馈：同步/标定/质量状态", "系统：训练数据生产线"],
  enHciLens: ["Capture: first-person, hand, wrist", "Feedback: sync, calibration, quality state", "System: training-data production line"],
  zhImplication: "具身产品的交互设计不只发生在机器人执行时，也发生在数据采集者按下记录键、重做失败动作、查看同步状态的时刻。采集设备必须把丢帧、曝光、标定、动作完整性和传感器时钟变成现场可读反馈，否则训练团队会把“坏数据”误当成“坏模型”。",
  enImplication: "Embodied-product interaction design also happens when a data operator starts a capture, repeats a failed action, or checks synchronization. Capture hardware needs legible feedback for dropped frames, exposure, calibration, action completeness, and sensor clocks; otherwise a training team will treat bad data as a bad model.",
  sourceDate: "2026-08-19 official WRC release · 2026-08-19 China official release · 2026-08-23 current source sweep",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official robotics infrastructure launch",
  visual: { path: "assets/orbbec-wrc-physical-ai-official-2026-08.png", width: 1600, height: 900, kind: "source-backed page screenshot", altZh: "Orbbec WRC 2026 具身视觉发布页截图", altEn: "Orbbec WRC 2026 embodied-vision launch page", captionZh: "来源追踪视觉：Orbbec 官方 WRC 2026 发布页，覆盖 Robot-Free Data Collection Hardware Platform 与 Physis 机器人视觉相机。", captionEn: "Source-traceable visual: Orbbec's official WRC 2026 release covering the Robot-Free Data Collection Hardware Platform and Physis robotics cameras.", sourceUrl: "https://www.orbbec.com/news/orbbec-unveils-two-new-product-lines-at-wrc-2026-advancing-scalable-physical-ai-data-collection-and-human-like-robotics-vision/" },
  sources: [
    { label: "Orbbec official WRC release", url: "https://www.orbbec.com/news/orbbec-unveils-two-new-product-lines-at-wrc-2026-advancing-scalable-physical-ai-data-collection-and-human-like-robotics-vision/", type: "official" },
    { label: "Orbbec China release", url: "https://orbbec.com.cn/index.php/index/News/info.html?cate=31&id=380", type: "china" },
    { label: "Reuters WRC robotics report", url: "https://ca.investing.com/news/stock-market-news/china-robot-makers-seek-to-turn-humanoid-hype-into-useful-work-4808527", type: "global" }
  ],
  dossierKind: "product",
  dossier: { zh: {
    productName: "Orbbec 在 WRC 2026 发布的两条产品线，分别是无本体具身数据采集硬件平台与 Physis 机器人视觉相机系列。它面向机器人公司、具身模型团队、数据采集团队和工业部署方，提供从第一视角/手部数据到空间视觉传感的基础模块。",
    productType: "产品类型是 B2B 具身数据采集系统与机器人视觉硬件，不是面向普通消费者的机器人。采集平台由 EGO、UMI、WristCam 和 Hub 组成矩阵，Physis 则承担宽视野成像、空间感知和部署可靠性。公开资料没有把具体相机型号、配套软件版本和商业交付 SKU 完整列出。",
    interactionFlow: "采集者穿戴或手持设备执行真实任务，系统同时记录第一视角、手部/腕部近场、运动与其他模态数据，再由同步中枢组织成可用于训练与验证的记录。机器人部署方使用 Physis 获取环境和空间信息。当前公开页面说明了形态和同步目标，但没有展示完整的录制、重采、质检、暂停、数据删除、权限和 SDK 调用流程；这些是落地采购前的验收项。",
    specsOrStack: "Orbbec 官方称硬件级多相机同步误差低于 1ms，出厂标定误差低于 0.3 像素；中国官方发布还明确 EGO 第一视角、UMI 手持操作、WristCam 腕部近场与 Hub 同步中枢四类形态。官方发布没有说明每个 SKU 的分辨率、帧率、IMU 型号、接口、传输协议、存储、SDK 版本、价格和交付周期，均为 source not stated。",
    useCases: "具体场景包括采集人类操作示范、训练人形机器人和灵巧手、验证 VLA/世界模型、重建工厂或仓储空间、采集腕部近场装配动作，以及为机器人视觉部署提供宽视野与空间深度。对于需要大规模复现同一任务的团队，硬件矩阵可减少临时拼装相机和后期对时。对于普通用户，公开材料没有消费级购买路径或直接使用场景。",
    painPointsSolved: "它试图解决具身 AI 数据稀缺、第一视角与手部视角缺失、跨传感器不同步、标定误差难以追踪、现场录制质量不稳定的问题。把采集设备拆成可组合矩阵，有助于把“数据从哪里来”变成产品化流程。它没有自动保证动作语义正确、隐私合规、训练标签质量或机器人迁移成功；同步指标也不能单独证明最终模型更强。",
    newTech: "新技术重点是无本体数据采集与面向人类视觉的 Physis 感知组合。其产品化难点不在单个相机，而在硬件时钟、空间标定、第一视角和手部近场的统一坐标、现场质量反馈、数据封装与下游训练接口。如果采集者看不见丢帧或标定状态，系统再高精度也会变成不可解释的数据管道。",
    availability: "Orbbec 官方确认新品在 WRC 2026 发布并展示；公开材料确认产品线与平台形态，没有确认所有 SKU 的量产库存、价格、交付、地区销售、SDK 开放程度或采购门槛。Reuters 报道 WRC 正从演示转向工业场景，但行业展会展示不等于每一款硬件已可购买。",
    limitsOrUnknowns: "未知包括具体型号和量产计划、端侧/云端处理、数据格式、隐私与脱敏、标定维护、户外和复杂光照、相机遮挡、动作重做、长期佩戴、SDK/ROS/Isaac 集成以及最终训练收益。官方同步与标定数字属于来源声明，不应外推为所有部署场景的实际效果。",
    productVerdict: "Orbbec 的新产品线是 confirmed product，重要性在于它把具身 AI 的观察链路做成可交付基础设施。判断：值得跟踪其 EGO/UMI/WristCam/Hub 的 SKU、数据 schema、现场质检和开发者接口；在这些信息公开前，应把它当作已发布的基础设施方向，而不是已验证的全栈训练结果。"
  }, en: {
    productName: "Orbbec’s two WRC 2026 product lines are a robot-free embodied-data collection hardware platform and the Physis family of robotics-vision cameras. They target robot builders, embodied-model teams, data-collection operators, and industrial integrators with modules for first-person and hand data as well as spatial perception.",
    productType: "This is B2B embodied-data and robotics-vision infrastructure, not a consumer robot. The collection platform is described as an EGO, UMI, WristCam, and Hub matrix; Physis provides wide-field imaging, spatial perception, and deployment-oriented reliability. The public release does not enumerate every camera SKU, software version, or commercial delivery package.",
    interactionFlow: "An operator wears or holds the collection hardware while performing a real task. The system records first-person, hand or wrist close-up, motion, and other modalities, then uses a synchronization hub to organize a training and validation record. A robot integrator uses Physis to perceive an environment and spatial structure. Public material describes forms and synchronization goals but does not show the complete start, re-capture, quality-control, pause, deletion, permission, or SDK flow; those are procurement acceptance items.",
    specsOrStack: "Orbbec says hardware-level multi-camera synchronization error is below 1 ms and factory-calibration error below 0.3 pixels. The China release names four forms: EGO first-person, UMI handheld operation, WristCam near-field wrist, and Hub synchronization. The release does not specify resolution, frame rate, IMU model, connectors, transport protocol, storage, SDK version, price, or delivery schedule for each SKU. Those details remain source not stated.",
    useCases: "Concrete use cases include collecting human demonstrations, training humanoids and dexterous hands, validating VLA and world models, reconstructing factory or warehouse space, recording wrist-level assembly actions, and supplying wide-field and depth perception for deployed robots. For teams repeating a task at scale, a hardware matrix can reduce ad hoc camera assembly and post-hoc time alignment. The public evidence gives no consumer purchase route or direct everyday-user scenario.",
    painPointsSolved: "The products target embodied-AI data scarcity, missing first-person and hand views, cross-sensor timing drift, hard-to-trace calibration error, and inconsistent field recording quality. A composable collection matrix can turn where data comes from into a productized workflow. It does not guarantee correct action semantics, privacy compliance, label quality, or successful robot transfer; synchronization metrics alone do not prove a better final model.",
    newTech: "The new technology is the combination of robot-free data collection and a Physis perception family tuned toward human-like spatial sensing. The product challenge is not one camera; it is a common clock, spatial calibration, first-person and hand coordinate alignment, field quality feedback, data packaging, and downstream training interfaces. If the operator cannot see dropped frames or calibration state, a high-precision sensor becomes an opaque data pipeline.",
    availability: "Orbbec has confirmed the product lines and public demonstration at WRC 2026. The reviewed material does not confirm mass inventory, price, delivery, regional sales, SDK access, or purchasing requirements for every SKU. Reuters describes WRC as a move from demos toward industrial use, but an exhibition presence is not proof that every shown hardware item is orderable.",
    limitsOrUnknowns: "Unknowns include final SKUs and production plans, edge-versus-cloud processing, data schema, privacy and redaction, calibration maintenance, outdoor and difficult-light behavior, occlusion, action re-capture, long-term wear, SDK/ROS/Isaac integration, and measurable training benefit. The synchronization and calibration numbers are source-stated claims; they should not be generalized to every deployment condition.",
    productVerdict: "Orbbec’s new lines are a confirmed product direction whose importance is making the embodied-AI observation loop deliverable infrastructure. Verdict: track the EGO/UMI/WristCam/Hub SKUs, data schema, field QA, and developer interfaces. Until those are public, treat it as a released infrastructure product family, not a verified full-stack training result."
  } }
};

const aperdata = {
  id: "51world-aperdata-aper-ego-aperos",
  section: "china",
  zhHeadline: "51WORLD AperData：把“人怎么做”变成可训练的机器人数据资产",
  enHeadline: "51WORLD AperData turns human action into a trainable robot-data asset",
  zhFact: "51WORLD 在 8 月 18 日发布 AperData 与 AperOne；AperData 首发产品为 AperEgo 头戴采集设备与 AperOS 软件平台，官方页面显示首发价 RMB 5,100/套，支持四路 RGB、两路 IR 与 IMU 的统一接入、现场清晰度/曝光/丢帧/同步质检，并提供云端或私有化部署。",
  enFact: "On August 18, 51WORLD introduced AperData and AperOne. The first AperData package combines the AperEgo head-mounted collector with AperOS software; the official page lists an introductory price of RMB 5,100 per set, unified access for four RGB streams, two IR streams, and IMU, plus on-site checks for clarity, exposure, dropped frames, and synchronization. It supports cloud or private deployment.",
  zhValue: "AperData 把具身 AI 的瓶颈从“机器人不够聪明”转成“训练数据不够标准化”。采集者戴着 AperEgo 做任务，AperOS 负责任务分配、上传、预处理、对时、质检、标注、解算和数据集导出；现场直接给 PASS/WARN/FAIL，减少坏数据进入训练。它把一个本来由数据工人、脚本和工程师拼出来的链路包装为基础设施产品，也把操作者的每个动作变成可追溯的数据生产事件。",
  enValue: "AperData reframes the embodied-AI bottleneck from robots being insufficiently intelligent to training data being insufficiently standardized. An operator wears AperEgo to perform a task; AperOS handles assignment, upload, preprocessing, time alignment, quality control, annotation, solving, and dataset export, with PASS/WARN/FAIL feedback at the site so bad captures can be repeated. It packages a workflow usually assembled from data workers, scripts, and engineers as infrastructure, and makes each operator action a traceable data-production event.",
  zhHciLens: ["现场：任务驱动采集", "反馈：PASS/WARN/FAIL", "后端：数据治理与训练闭环"],
  enHciLens: ["Field: task-driven capture", "Feedback: PASS/WARN/FAIL", "Backend: data governance and training loop"],
  zhImplication: "具身系统的“可用性”要延伸到数据工人的现场：系统应让采集者知道任务、目标姿态、是否入镜、是否丢帧、是否需要重做，而不是把所有质量判断留给训练工程师。AperOS 的价值在于把这些状态前移，但公开材料仍需验证误报率、重采成本和不同本体之间的迁移。",
  enImplication: "Embodied-system usability extends to the data operator in the field. The system should expose the task, target pose, whether the body is in frame, whether frames were dropped, and whether a re-take is needed instead of leaving every judgment to training engineers. AperOS moves these states forward; false-positive rates, re-capture cost, and transfer across embodiments still need verification.",
  sourceDate: "2026-08-18 official product launch · 2026-08-19 official AperData page · 2026-08-19 SCMP · 2026-08-23 current source sweep",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official availability and price · enterprise infrastructure",
  visual: { path: "assets/aperdata-official-2026-08.png", width: 1600, height: 900, kind: "source-backed page screenshot", altZh: "51WORLD AperData 官方产品页截图", altEn: "51WORLD AperData official product page", captionZh: "来源追踪视觉：51WORLD 官方 AperData 页面展示 AperEgo、AperOS、5100 元首发价与 L1–L6 数据生产线。", captionEn: "Source-traceable visual: 51WORLD's official AperData page shows AperEgo, AperOS, the RMB 5,100 introductory price, and the L1–L6 data-production line.", sourceUrl: "https://www.51world.com.cn/aperdata" },
  sources: [
    { label: "51WORLD AperData official page", url: "https://www.51world.com.cn/aperdata", type: "official" },
    { label: "51WORLD launch release", url: "https://www.prnewswire.com/news-releases/51world-unveils-two-embodied-ai-products-and-reveals-aerospace-strategy-from-low-altitude-to-deep-space-302855142.html", type: "official" },
    { label: "SCMP data-capture report", url: "https://www-scmp-com.libproxy1.nus.edu.sg/tech/article/3364587/making-better-robots-depends-on-better-data-capture-chinese-firm-51world-says?module=top_story&pgtype=section", type: "reviews" },
    { label: "51WORLD AperOne product page", url: "https://www.51aes.com/products/aperone?lang=en", type: "developer docs" }
  ],
  dossierKind: "product",
  dossier: { zh: {
    productName: "51WORLD AperData 是面向具身 AI 的软硬件一体数据底座，首发组合为 AperEgo 头戴采集设备与 AperOS 软件平台，另有 AperWristCAM 腕部相机和 AperFinger 夹爪采集手柄。它服务数采公司、本体机器人公司、VLA/世界模型团队和灵巧手研发团队。",
    productType: "产品类型是企业级具身数据生产线，覆盖 L1–L6 的采集接入、数据治理、增广合成、标准数据集导出、训练评测闭环与私有化部署。AperEgo 负责现场多模态捕捉，AperOS 负责项目、任务、上传、预处理、质检、标注、解算和评测。AperOne 是相邻的数字孪生/部署平台，不应与 AperData 的采集硬件混写。",
    interactionFlow: "团队创建项目和任务，服务器给采集端分配指定工作，采集者佩戴 AperEgo 执行动作；本地实时检查清晰度、曝光、丢帧率和多通道同步，并显示人体/手部姿态骨骼，给出 PASS/WARN/FAIL，必要时现场重录。数据上传后，AperOS 自动解包、时间对齐、标准化和高精度解算，再由专业人员进行质检、标注和评测，最后导出训练数据集。权限、原始数据删除、离线采集、人员隐私和跨组织数据隔离还需要采购验证。",
    specsOrStack: "官方页面显示首发价 RMB 5,100/套，AperOS 支持四路 RGB、两路 IR 和 IMU 等多路传感器统一连接，通过统一会话时钟同步；AperEgo、AperWristCAM、AperFinger 覆盖头戴、腕部和夹爪采集。官方称相较传统真机遥操作成本效率可提升超过 10 倍，但明确这是内部测试预估，量产实测为准。镜头分辨率、帧率、IMU 规格、通信、存储、操作系统、SDK、原始数据格式与售后服务若未公开，均为 source not stated。",
    useCases: "具体场景包括采集人类操作用于人形机器人训练、灵巧手抓取/旋拧/装配、工业产线 SOP 数字化、世界模型和 VLA 数据集生产、机器人任务验收，以及把现场动作转换为可复用训练资产。AperOne 还覆盖数字孪生重建、模拟训练、机器人选型与运营管理。对于企业，价值在于从一次演示转成可批量重复的任务数据；对于普通用户，没有直接消费级使用路径。",
    painPointsSolved: "它解决的痛点是遥操作昂贵、采集设备碎片化、数据缺少质量门槛、坏数据上传后才发现、时间轴对不齐、标注和解算链路断裂。现场 PASS/WARN/FAIL 和姿态预览把质量判断前移，任务分发减少采集者误操作，私有化部署适配企业数据边界。它没有证明 10 倍效率在所有任务成立，也没有自动解决数据偏差、操作者疲劳、动作语义、跨本体迁移与隐私合规。",
    newTech: "新技术是把头戴第一视角、腕部/夹爪近场、RGB/IR/IMU 同步、现场质量控制和数据治理平台组合为一条可交付流水线。对 HCI 的关键是“采集反馈”本身：采集者不应只按开始/停止，而应理解任务目标、动作是否完整、传感器是否正常、数据是否可用。AperOS 把模型训练前的不可见工程工作变成可见状态，也使“数据生产”成为产品界面。",
    availability: "51WORLD 官方 AperData 页面显示首发价 RMB 5,100/套并提供立即预定/Book a Demo 路径；官方新闻稿称第一代产品立即可用。这里的立即可用是企业采购/预约口径，不等于普通零售库存；全球销售、交付周期、安装服务、SDK 许可和硬件保修未完整公开。",
    limitsOrUnknowns: "未知包括量产交付规模、长时间佩戴、摄像头与 IMU 实际精度、网络断开、离线缓存、失败重采代价、PASS/WARN/FAIL 的判定准确性、原始数据保存和删除、私有化部署成本、SDK/ROS/Isaac 接入、不同机器人本体的轨迹映射以及 10 倍效率的可复现性。官方页面还把 99% 物理一致性与效率数字限定为内部测试/预估，不应写成独立验证结果。",
    productVerdict: "AperData 是本期具身基础设施中最具体的 confirmed product：有官方产品页、价格、硬件组合、现场质检与数据闭环。判断：它比“机器人更聪明”的叙事更接近可采购的生产工具；下一步优先验证交付、真实采集质量、隐私/删除、开发者接口和跨本体迁移。"
  }, en: {
    productName: "51WORLD AperData is a software-and-hardware embodied-AI data foundation. Its first package combines the AperEgo head-mounted collector with AperOS, with AperWristCAM and AperFinger extending capture to the wrist and gripper. It targets data factories, robot builders, VLA/world-model teams, and dexterous-hand developers.",
    productType: "The product is an enterprise data-production line spanning L1-L6: capture access, data governance, augmentation, standardized dataset export, training and evaluation, and private deployment. AperEgo captures multimodal field data; AperOS handles projects, tasks, upload, preprocessing, QA, annotation, solving, and evaluation. AperOne is a related digital-twin and deployment platform and should not be conflated with AperData’s capture hardware.",
    interactionFlow: "A team creates a project and task, the server assigns work to a capture terminal, and an operator wears AperEgo while performing the action. Local checks inspect clarity, exposure, dropped-frame rate, and multichannel synchronization, while body and hand skeletons show whether the action is in frame; PASS, WARN, or FAIL determines whether a re-take is needed. After upload, AperOS unpacks, aligns time, standardizes, and solves the data before specialists handle QA, annotation, and evaluation, then export a training set. Permissions, raw-data deletion, offline capture, worker privacy, and cross-organization isolation still need procurement verification.",
    specsOrStack: "The official page lists an introductory price of RMB 5,100 per set. AperOS supports unified connection for four RGB streams, two IR streams, and IMU through a common session clock; AperEgo, AperWristCAM, and AperFinger cover head, wrist, and gripper capture. 51WORLD says cost efficiency can improve by more than 10x versus traditional real-robot teleoperation, but qualifies that as an internal estimate subject to mass-production measurement. Resolution, frame rate, IMU details, transport, storage, operating system, SDK, raw-data format, and service terms remain source not stated unless separately published.",
    useCases: "Concrete use cases include human-action capture for humanoid training, dexterous grasping, twisting and assembly, industrial SOP digitization, world-model and VLA dataset production, robot-task acceptance, and conversion of field actions into reusable training assets. AperOne adds digital-twin reconstruction, simulation training, robot selection, and operations management. For an enterprise, the value is turning a demo into a repeatable task-data pipeline; there is no direct consumer path in the reviewed evidence.",
    painPointsSolved: "AperData targets expensive teleoperation, fragmented capture equipment, missing data-quality gates, late discovery of bad recordings, unsynchronized timelines, and broken annotation or solving workflows. Field PASS/WARN/FAIL and posture previews move quality decisions forward; task dispatch reduces operator error; private deployment supports enterprise data boundaries. It does not prove a 10x gain across every task and does not automatically solve bias, operator fatigue, action semantics, embodiment transfer, or privacy compliance.",
    newTech: "The new combination is head-mounted first-person capture, wrist and gripper near-field views, RGB/IR/IMU synchronization, field quality control, and a governed data platform in one deliverable line. The HCI point is that capture feedback becomes a product surface: an operator should understand the task target, action completeness, sensor health, and data usability rather than only press start and stop. AperOS makes invisible pre-training engineering visible and turns data production into an interface.",
    availability: "The official AperData page lists RMB 5,100 per set and an immediate reservation or demo path; the launch release says the first-generation product is available immediately. “Available” here is an enterprise procurement and reservation claim, not proof of ordinary retail inventory. Global sales, delivery schedule, installation, SDK licensing, and warranty are not fully disclosed.",
    limitsOrUnknowns: "Unknowns include production scale, long-duration wear, real camera and IMU accuracy, network loss, offline buffering, re-capture cost, PASS/WARN/FAIL accuracy, raw-data retention and deletion, private-deployment cost, SDK/ROS/Isaac integration, trajectory mapping across robot bodies, and reproducibility of the 10x efficiency claim. The official page qualifies its 99% physical-consistency and efficiency figures as internal tests or estimates; they are not independent validation.",
    productVerdict: "AperData is this issue’s most concrete embodied-infrastructure confirmed product, with an official page, price, hardware matrix, field QA, and a data loop. Verdict: it is closer to a purchasable production tool than the claim that robots are simply becoming smarter. Next, verify delivery, real capture quality, privacy and deletion, developer interfaces, and transfer across embodiments."
  } }
};

const motoko = {
  id: "razer-motoko-developer-surface",
  section: "global",
  zhHeadline: "Razer Motoko：耳罩把双目视觉带到眼睛高度，但仍是 developer surface",
  enHeadline: "Razer Motoko brings eye-level stereo vision to an earcup, still as a developer surface",
  zhFact: "Razer 的官方产品页写明 Motoko 采用 Snapdragon、双眼高度 FPV 摄像头、立体视觉、远近场麦克风，并支持 Grok、OpenAI、Gemini 等 AI 平台；页面继续招募 Q2 2026 Developer Kit。8 月 19 日 CEO 公开称产品 coming soon，8 月 22 日媒体据此报道它从 CES 概念走向真实产品，但价格、续航、上市日与隐私控制仍未公开。",
  enFact: "Razer’s official page describes Motoko as a Snapdragon-powered headset with dual eye-line FPV cameras, stereoscopic vision, far- and near-field microphones, and compatibility with Grok, OpenAI, Gemini, and other AI platforms. The page still solicits the Q2 2026 Developer Kit. On August 19 the CEO said the product was coming soon; August 22 coverage treated that as movement beyond a CES concept, while price, runtime, launch date, and privacy controls remain undisclosed.",
  zhValue: "Motoko 的形态把相机放进耳罩而不是镜框：用户仍能保留耳机的音频、麦克风和游戏入口，却通过眼睛高度的双摄像头获得第一视角视觉。对游戏、健身、维修、翻译和文档理解来说，耳罩可能比眼镜更容易被现有用户接受；但相机离开眼睛本体后，头部方向、视线和摄像机视野是否一致，需要新的提示和校准。它同时把“为用户服务的视觉数据”与“为机器人训练采集 POV 数据”放在同一个产品叙事里，隐私边界更不能含糊。",
  enValue: "Motoko puts the cameras in the earcups rather than the frame. The wearer keeps the audio, microphone, and gaming entry point of a headset while gaining eye-level first-person vision. Gaming, exercise, repair, translation, and document understanding could feel more acceptable in an existing headset category than in camera glasses. But once cameras are detached from the eyes, head direction, gaze, and camera field of view need new cues and calibration. Razer also places user assistance and human-POV data for robot training in the same story, making the privacy boundary impossible to leave vague.",
  zhHciLens: ["输入：双目 FPV + 远近场麦克风", "输出：实时音频反馈", "状态：developer kit / coming soon"],
  enHciLens: ["Input: stereo FPV plus far/near mics", "Output: real-time audio", "State: developer kit / coming soon"],
  zhImplication: "耳戴摄像头的关键不是“能看见”，而是用户和旁观者能否知道摄像头何时看、录制、上传或用于训练。Motoko 需要物理遮挡/指示、当前模型与数据路径提示、用户可停止的快捷入口，以及从日常助手切换到开发者采集模式时的明确边界。",
  enImplication: "The challenge for camera-equipped headsets is not merely seeing; it is whether the wearer and bystanders can tell when the cameras see, record, upload, or contribute to training. Motoko needs a physical block or indicator, model and data-path visibility, a stop shortcut, and a clear boundary when switching from daily assistance to developer capture mode.",
  sourceDate: "2026-01-06 official concept · 2026-08-19 CEO update · 2026-08-22 media follow-up · 2026-08-23 current source sweep",
  evidenceLabel: "developer surface",
  evidenceStrength: "developer surface · startup signal · not retail-confirmed",
  visual: { path: "assets/razer-motoko-official-2026-08.png", width: 1600, height: 900, kind: "source-backed page screenshot", altZh: "Razer Project Motoko 官方产品页截图", altEn: "Razer Project Motoko official product page", captionZh: "来源追踪视觉：Razer 官方页展示双 FPV 摄像头、立体视觉、远近场麦克风与 Q2 2026 Developer Kit 招募；仍按 developer surface 记录。", captionEn: "Source-traceable visual: Razer's official page shows dual FPV cameras, stereo vision, far/near microphones, and the Q2 2026 Developer Kit signup; it remains a developer surface.", sourceUrl: "https://www.razer.com/concepts/project-motoko" },
  sources: [
    { label: "Razer Motoko official product page", url: "https://www.razer.com/concepts/project-motoko", type: "official" },
    { label: "Razer CES concept release", url: "https://www.razer.com/newsroom/product-news/project-motoko", type: "official" },
    { label: "Windows Central coming-soon report", url: "https://www.windowscentral.com/hardware/razer/razer-motoko-airpods-ultra-leak-concept", type: "reviews" },
    { label: "Digital Citizen August 22 follow-up", url: "https://www.digitalcitizen.life/razer-project-motoko-is-becoming-a-real-ai-headset-with-dual-cameras-and-snapdragon-hardware/", type: "global" },
    { label: "Razer community discussion", url: "https://www.reddit.com/r/tech_news_and_gadgets/comments/1u8j6wo/this_ai_headset_sees_the_world_with_you/", type: "community" }
  ],
  dossierKind: "product",
  dossier: { zh: {
    productName: "Razer Project Motoko 是一款仍处于开发者/概念到产品过渡期的无线 AI 头戴设备。它把双摄像头放在耳罩、接近眼睛高度，以耳机音频、麦克风与 Snapdragon 计算为基础，尝试成为游戏、日常任务和机器人训练数据的视觉入口。",
    productType: "产品类型是带视觉传感的无线游戏耳机、可穿戴 AI developer surface 和第一视角数据采集设备。它与相机眼镜的区别在于摄像头不在镜框上，音频输出和既有游戏设备形态更成熟；与普通耳机的差异是它能够理解文字、物体、环境音和视野。当前应按 developer surface 与 startup signal 记录，不能写成已量产零售产品。",
    interactionFlow: "用户戴上耳机，通过语音和环境声与 AI 交互，双 FPV 摄像头捕获眼睛高度附近的视野，系统再用实时音频反馈回答问题或执行任务。官方举例包括翻译街牌、计数健身动作、总结文档、游戏和生产力。开发者可能通过 Developer Kit 研究视觉数据与机器人训练，但公开页没有给出 SDK、权限、录制提示、摄像头遮挡、停止入口、校准或切换模型流程。",
    specsOrStack: "Razer 官方披露 Snapdragon 平台、双 eye-line FPV 摄像头、立体视觉、宽视野关注、远场/近场麦克风、实时音频反馈，并称可连接 Grok、OpenAI、Gemini 等平台；官方页还说摄像头可捕获深度、焦点和注意模式，用于机器人训练数据。未公开摄像头分辨率、帧率、SoC 型号、RAM、存储、无线标准、续航、重量、IP 等级、模型路由、端云分工和 SDK 细节，均为 source not stated。",
    useCases: "具体场景包括游戏中的视觉辅助、健身动作计数、街牌翻译、文档摘要、旅行中的免手操作、家庭维修和机器人团队的人类 POV 数据采集。耳罩形态可能让用户在需要音频沉浸的场景接受双摄像头；开发者可研究深度、注意模式与多模态 agent。但如果用户只是需要语音助手，摄像头会增加隐私、重量、热量、电量和社交解释成本。",
    painPointsSolved: "Motoko 试图解决眼镜形态过于显眼、音频设备没有视觉上下文、用户在游戏/维修/运动中无法拿手机取景，以及机器人训练缺少自然第一视角数据的问题。双摄像头和立体视觉让 AI 可以从耳机位置理解环境，远近场麦克风提高语音与环境声的分离机会。它尚未解决镜头方向与用户视线不一致、旁观者不知情、云端处理、误识别、续航和开发者权限。",
    newTech: "新技术组合是 eye-level stereo FPV、双距离麦克风、可切换模型平台与人类 POV 训练数据。产品难点是把相机视野与用户注意力对齐：耳罩可以知道头朝哪，却不一定知道用户看哪；系统需要在音频反馈前解释它引用了哪一帧、是否上传了环境、哪个模型在处理，以及如何让用户立刻暂停。这个状态链路比“支持多个模型”更决定产品是否可信。",
    availability: "Razer 官方页继续提供 Q2 2026 Developer Kit 的登记入口；Razer CEO 在 8 月 19 日称产品 coming soon，媒体在 8 月 22 日据此判断它正从 CES 概念走向真实产品。价格、正式上市日期、开发者 kit 交付、地区、续航和消费者购买入口尚未被官方完整确认。",
    limitsOrUnknowns: "核心未知包括相机硬件、镜头遮挡和隐私灯、录制与上传状态、模型与数据控制、开发者 SDK、耳罩重量与长时间佩戴、游戏系统兼容、噪声环境识别、音频延迟、网络依赖和电池寿命。Razer 的“sub-millimeter accuracy”“wide field of attention”一类叙述应保留为官方产品描述，不应当作独立测量。",
    productVerdict: "Motoko 是本期最值得跟踪的 global developer surface：它把 AI 视觉从眼镜转到耳罩，形态有差异化，也把用户助手和机器人数据采集放进同一条链路。判断：可作为开发者/交互原型观察项；在价格、SDK、隐私控制、续航和实物交付确认前，不升级为 confirmed retail product。"
  }, en: {
    productName: "Razer Project Motoko is a wireless AI headset moving from concept toward a developer and product surface. Its dual cameras sit in the earcups near eye level, using headset audio, microphones, and Snapdragon compute as a visual entry point for games, daily tasks, and robotics data.",
    productType: "It is a wireless gaming headset with visual sensing, a wearable-AI developer surface, and a first-person data-capture device. Unlike camera glasses, its cameras are in the earcups and its audio output builds on a familiar gaming category; unlike ordinary headphones, it can interpret text, objects, environmental sound, and a camera view. Today it should be labeled a developer surface and startup signal, not a mass-market retail product.",
    interactionFlow: "The wearer speaks to the AI while the dual FPV cameras capture an eye-level view and the headset returns real-time audio. Razer lists street-sign translation, gym-rep tracking, document summarization, gaming, and productivity as examples. A developer may use the kit to study visual data and robot training, but the public page does not define SDK calls, permissions, capture indicators, camera blocking, stop controls, calibration, or model-switching states.",
    specsOrStack: "Razer discloses a Snapdragon platform, dual eye-line FPV cameras, stereoscopic vision, a wide attention field, far- and near-field microphones, real-time audio feedback, and connections to platforms including Grok, OpenAI, and Gemini. It also says the cameras can capture depth, focus, and attention patterns for robotics training. Resolution, frame rate, SoC model, RAM, storage, wireless standards, runtime, weight, IP rating, model routing, edge-cloud split, and SDK details remain source not stated.",
    useCases: "Concrete use cases include game assistance, exercise-rep counting, street-sign translation, document summaries, hands-free travel, home repair, and human-POV collection for robotics teams. An earcup form may be more acceptable where users already want immersive audio; developers can study depth, attention patterns, and multimodal agents. For someone who only wants a voice assistant, the cameras add privacy, weight, heat, battery, and social-explanation costs.",
    painPointsSolved: "Motoko targets the social visibility of glasses, the lack of visual context in ordinary audio devices, phone retrieval during games, repair, and exercise, and the scarcity of natural human-POV training data. Stereo cameras and far/near microphones could let an AI use environmental vision and sound from the headset position. It does not yet solve camera-to-gaze mismatch, bystander awareness, cloud processing, wrong recognition, runtime, or developer permissions.",
    newTech: "The new combination is eye-level stereo FPV, dual-distance microphones, multi-model platform compatibility, and human-POV training data. The design problem is aligning the camera view with user attention: an earcup can know where the head points without knowing what the wearer is looking at. Before an audio response, the system should show which frame it used, whether the environment was uploaded, which model processed it, and how to stop immediately. This state chain matters more than multi-model branding.",
    availability: "Razer’s official page still offers a Q2 2026 Developer Kit signup. The CEO said the product was coming soon on August 19, and August 22 coverage interpreted that as movement beyond the CES concept. Price, formal launch date, kit delivery, region, runtime, and a consumer purchase path are not fully confirmed by Razer.",
    limitsOrUnknowns: "Open questions include camera hardware, physical blocking and privacy lights, recording and upload state, model and data control, SDK, headset weight and comfort, gaming compatibility, noisy-environment recognition, audio latency, network dependency, and battery life. Phrases such as sub-millimeter accuracy and a wide field of attention remain official product descriptions, not independent measurements.",
    productVerdict: "Motoko is the issue’s most interesting global developer surface. It moves AI vision from glasses to an earcup, offers a distinct form factor, and combines personal assistance with robotics data capture. Verdict: track it as a developer and interaction prototype; do not promote it to a confirmed retail product until price, SDK, privacy controls, runtime, and physical delivery are verified."
  } }
};

const patent = {
  id: "meta-smart-camera-highlight-patent-watch",
  section: "patent",
  zhHeadline: "专利观察：Meta 把“值得记录的瞬间”交给眼镜判断",
  enHeadline: "Patent watch: Meta lets glasses decide which moments are worth keeping",
  zhFact: "8 月公开的 Meta 专利申请描述摄像头眼镜结合人脸识别、表情分析、关系信息与感兴趣点，自动判断人物和事件并生成片段或 highlights。媒体指出它可能把“用户按下记录”推进到“系统主动选择记录”；这只是 patent signal，不能当作已发布功能、已确认产品策略或可用 API。",
  enFact: "A Meta patent application published in August describes camera glasses combining facial recognition, expression analysis, relationship information, and points of interest to decide which people and events to capture into clips or highlights. Coverage frames this as a move from user-triggered recording toward system-selected memories. It is a patent signal, not a released feature, confirmed product strategy, or usable API.",
  zhValue: "这个信号具体指向记忆产品的控制权：相机眼镜不再只等待口令，而可能主动把人、动作和关系组织成回顾素材。它也把隐私风险从“我有没有按下录制”推到“系统如何判断谁值得被记录”。产品团队需要把专利里的自动选择当作未来风险测试，而不是当作 Meta 当前产品能力。",
  enValue: "The signal is about control in memory products. Camera glasses would no longer only wait for a command; they could organize people, actions, and relationships into retrospective media. The privacy risk moves from whether the user pressed record to how the system decides who is worth recording. Product teams should treat the filing as a future-risk test, not as current Meta capability.",
  zhHciLens: ["信号：自动选取 highlights", "风险：旁观者与生物识别", "证据：专利申请，非产品"],
  enHciLens: ["Signal: automatic highlight selection", "Risk: bystanders and biometrics", "Evidence: patent application, not product"],
  zhImplication: "任何“主动记忆”都需要可见的录制状态、目标/人脸处理解释、旁观者边界、撤销与删除路径，以及从未发布功能到真实产品的证据门槛。",
  enImplication: "Any proactive memory system needs visible recording state, explanations for person and face processing, bystander boundaries, undo and deletion, and a strict evidence gate between a filing and a real product.",
  sourceDate: "2026-08-13 patent publication · 2026-08-17/21 media coverage · 2026-08-23 patent watch",
  evidenceLabel: "patent signal",
  evidenceStrength: "patent signal · speculative · not a product fact",
  visual: { path: "assets/meta-patent-watch-2026-08.png", width: 1600, height: 900, kind: "source-backed page screenshot", altZh: "Meta 智能眼镜专利媒体报道截图", altEn: "Media report on Meta smart-glasses patent", captionZh: "专利信号视觉：媒体报道 Meta 的自动 highlights/人脸识别专利申请；此图不证明功能已发布。", captionEn: "Patent-signal visual: media coverage of Meta's automatic-highlights and face-analysis filing; the image does not prove a released feature.", sourceUrl: "https://www.tomsguide.com/ai/meta-files-patent-for-ai-camera-glasses-that-use-facial-recognition-expression-analysis-and-information-about-your-relationships-to-identify-people-around-you-and-create-highlights" },
  sources: [
    { label: "Tom's Guide patent report", url: "https://www.tomsguide.com/ai/meta-files-patent-for-ai-camera-glasses-that-use-facial-recognition-expression-analysis-and-information-about-your-relationships-to-identify-people-around-you-and-create-highlights", type: "reviews" },
    { label: "Biometric Update patent analysis", url: "https://www.biometricupdate.com/202608/meta-smart-glasses-patent-reignites-facial-recognition-debate", type: "patent" },
    { label: "Google Patents privacy-preserving wearable reference", url: "https://patents.google.com/patent/US10523639B2/en", type: "patent" }
  ],
  dossierKind: "scan",
  dossier: { zh: {
    productName: "Meta smart-camera highlight patent watch 是专利信号扫描，不是已发布产品。关注点是摄像头眼镜可能自动识别人、表情、关系和事件，并选择值得保存的片段。",
    productType: "这是 patent lane 的 source-lane scan，证据等级为 patent signal。专利申请描述的是一种可能的系统设计，不等于 Meta 已经在销售的眼镜、已经上线的 Meta AI 功能或开发者可调用的接口。",
    interactionFlow: "申请设想系统从摄像头和传感器获得场景，识别人和兴趣点，结合用户关系或事件判断生成片段/回顾。公开报道没有提供可操作产品、权限页、录制灯行为、删除流程、误识别回退或实际用户测试，因此只能把它转化为设计审计问题。",
    specsOrStack: "公开资料涉及摄像头、面部/表情分析、关系信息、事件判断和 highlights 生成，但没有确认硬件型号、模型、端云架构、识别准确率、保存时长、API、地区或上市时间，均为 source not stated。",
    useCases: "潜在 use case 是自动生成聚会、家庭、运动或社交事件的回顾片段；当前没有证据证明这些场景已经被产品实现、用户启用或可被第三方开发者接入。",
    painPointsSolved: "它试图减少用户持续按录制键、整理长视频和手动找回忆片段的负担，但把选择权交给系统会增加旁观者同意、误识别人脸、关系推断、生物识别和自动上传的风险。",
    newTech: "信号指向“主动记忆”与摄像头/关系图谱结合的系统设计。技术上值得观察兴趣点检测、事件切片、身份/关系推断和可解释的保存决策；这些都只是专利描述，不能当作已完成技术。",
    availability: "专利申请已公开，申请公开不代表产品可购买、功能已上线、地区已开放或 API 已提供。Meta 当前产品的真实录制、存储和隐私行为需要另找官方文档与独立验证。",
    limitsOrUnknowns: "最大未知是系统是否会真的上线，以及用户和旁观者是否能看到/阻止它的判断。识别准确率、数据保留、删除范围、关系图谱来源、误识别恢复、法规边界和硬件指示均未确认。",
    productVerdict: "降级为 patent signal。它适合放入 watchlist 和隐私验收清单，不适合写成 Meta 已发布的人脸识别或自动记录功能。下一步只等待官方产品页、实际测试、权限/删除路径和监管文件。"
  }, en: {
    productName: "The Meta smart-camera highlight patent watch is a patent signal, not a released product. It concerns a possible camera-glasses system that identifies people, expressions, relationships, and events, then selects moments worth preserving.",
    productType: "This is a patent-lane source scan labeled patent signal. A patent application describes a possible system design; it does not establish a glasses product for sale, a live Meta AI capability, or a developer-callable API.",
    interactionFlow: "The filing imagines cameras and sensors providing a scene, the system identifying people and points of interest, and relationship or event context guiding clip or highlight selection. Public coverage gives no operable product, permission page, recording-light behavior, deletion flow, wrong-identification recovery, or user study, so the responsible output is a design-audit question.",
    specsOrStack: "The public material mentions cameras, facial and expression analysis, relationship information, event judgment, and highlight generation. It does not confirm hardware, model, edge-cloud architecture, recognition accuracy, retention period, API, region, or launch date; those details remain source not stated.",
    useCases: "A potential use case is automatically producing retrospective clips from parties, family events, sports, or social moments. There is no evidence that these scenarios are implemented in a shipping product, enabled for users, or available to third-party developers.",
    painPointsSolved: "The idea could reduce the burden of pressing record, sorting long videos, and finding memorable moments. It also shifts selection power to the system, increasing risks around bystander consent, wrong face identification, relationship inference, biometrics, and automatic upload.",
    newTech: "The signal points toward proactive memory connected to camera perception and a relationship graph. Interesting technical questions include point-of-interest detection, event segmentation, identity and relationship inference, and explainable save decisions. They remain patent descriptions, not completed technology.",
    availability: "The patent application is public. Publication does not mean a product is purchasable, a feature is live, a region is enabled, or an API exists. Meta’s actual recording, storage, and privacy behavior needs separate official documentation and independent verification.",
    limitsOrUnknowns: "The main unknown is whether the system will ship and whether wearers and bystanders can see or block its decisions. Accuracy, retention, deletion scope, relationship-graph provenance, wrong-identification recovery, regulatory boundaries, and hardware indicators are unconfirmed.",
    productVerdict: "Downgrade this to a patent signal. It belongs in a watchlist and privacy-acceptance checklist, not as a claim that Meta has released face recognition or automatic recording. The next evidence must be an official product surface, real testing, permission and deletion paths, or regulatory documentation."
  } }
};

issue.topics.unshift(patent, motoko, aperdata, orbbec, rayneo);
issue.coverStory = {
  topicId: rayneo.id,
  zhTitle: "雷鸟 iO：AI 眼镜的下一步，可能先是去掉摄像头",
  enTitle: "RayNeo iO: the next AI-glasses move may be removing the camera",
  zhSummary: [
    "雷鸟 iO 以 34g、双目显示、全天智记、实时翻译和无摄像头边界进入中国销售。",
    "同一周，Razer 把双摄像头放进耳罩，Orbbec 与 51WORLD 则把第一视角采集、同步和数据质检做成具身基础设施。",
    "产品差异越来越取决于观察链路是否可见：谁在看、何时录、数据去哪、用户能否停下。"
  ],
  enSummary: [
    "RayNeo iO enters China sales with a 34-gram frame, binocular display, all-day memory, live translation, and a camera-free boundary.",
    "In the same week, Razer puts stereo cameras in an earcup while Orbbec and 51WORLD package first-person capture, synchronization, and data QA for embodied systems.",
    "The product difference is increasingly whether the observation loop is legible: who is seeing, when it records, where data goes, and how the user stops it."
  ],
  imagePath: rayneo.visual.path,
  imageWidth: rayneo.visual.width,
  imageHeight: rayneo.visual.height,
  imageSourceUrl: rayneo.visual.sourceUrl,
  primarySourceUrl: rayneo.visual.sourceUrl,
  evidenceStrength: rayneo.evidenceStrength,
  whyCover: "It is an on-sale China product that makes a deliberate camera-free tradeoff while the surrounding ecosystem moves toward more sensors and more autonomous memory."
};
issue.watchlistZh = [
  "雷鸟 iO：全球发货、真实续航、记忆删除、翻译延迟、订阅与第三方开发者开放程度。",
  "Razer Project Motoko：Developer Kit 交付、价格、相机隐私灯、模型/数据路径和耳罩长时佩戴。",
  "Orbbec 与 51WORLD：具体 SKU、数据 schema、ROS/Isaac/SDK、现场质检准确性和跨本体迁移。",
  "Meta 主动记忆专利：只等待官方产品页、权限/删除路径和实际测试，不把 patent signal 当功能。",
  ...issue.watchlistZh.filter((item) => !item.includes("雷鸟 iO") && !item.includes("Razer Project Motoko") && !item.includes("Orbbec") && !item.includes("51WORLD") && !item.includes("Meta 主动记忆"))
];
issue.watchlistEn = [
  "RayNeo iO: global shipping, real runtime, memory deletion, translation latency, subscription, and developer openness.",
  "Razer Project Motoko: Developer Kit delivery, price, camera privacy cues, model/data path, and long-wear comfort.",
  "Orbbec and 51WORLD: final SKUs, data schema, ROS/Isaac/SDK access, field-QA accuracy, and embodiment transfer.",
  "Meta proactive-memory patent: wait for an official product surface, permission/deletion path, and real testing; do not treat patent signal as a feature.",
  ...issue.watchlistEn.filter((item) => !item.includes("RayNeo iO") && !item.includes("Razer Project Motoko") && !item.includes("Orbbec") && !item.includes("51WORLD") && !item.includes("Meta proactive-memory"))
];
issue.designDesk = {
  ...issue.designDesk,
  zhTitle: "设计台：先让观察链路可见，再让 AI 主动行动",
  enTitle: "Design Desk: make the observation loop legible before making AI proactive",
  zhIntro: "从无摄像头显示眼镜到双目耳罩和具身采集平台，今天的产品都在重新定义“设备看见什么”。",
  enIntro: "From camera-free display glasses to stereo headsets and embodied capture platforms, today’s products redefine what a device is allowed to see.",
  zhItems: [
    "输入层：区分用户主动提问、设备主动提示、传感器持续监听和开发者采集模式。",
    "观察层：把当前摄像头/麦克风/IMU 是否工作、是否上传、由哪个模型处理做成可见状态。",
    "动作层：所有物理或数据动作都提供开始前意图、进行中反馈、停止入口和失败回退。",
    "记忆层：记录、摘要、关系推断与 highlight 保存必须可查看、暂停、导出、删除。",
    "现场层：具身采集设备把丢帧、标定、曝光、姿态完整性前移到采集者能理解的 PASS/WARN/FAIL。",
    "证据层：把 confirmed product、developer surface、review/community friction、research/patent signal 分开展示。"
  ],
  enItems: [
    "Input layer: distinguish a user question, proactive prompting, continuous sensing, and developer-capture mode.",
    "Observation layer: expose whether camera, microphone, or IMU is active, whether data leaves the device, and which model processes it.",
    "Action layer: every physical or data action needs pre-action intent, in-action feedback, a stop path, and failure recovery.",
    "Memory layer: recordings, summaries, relationship inferences, and highlights need inspect, pause, export, and delete controls.",
    "Field layer: embodied capture systems should move dropped frames, calibration, exposure, and action completeness into operator-readable PASS/WARN/FAIL.",
    "Evidence layer: keep confirmed product, developer surface, review/community friction, and research/patent signal visibly separate."
  ]
};

const nextIssues = [issue, ...issues.filter((entry) => entry.date !== date)];
await fs.writeFile(dataPath, `${JSON.stringify(nextIssues, null, 2)}\n`);
console.log(`Prepared ${date}: ${issue.topics.length} topics, ${new Set(issue.topics.flatMap((topic) => topic.sources.map((source) => source.url))).size} unique topic sources, ${new Set([issue.coverStory.imagePath, ...issue.topics.map((topic) => topic.visual.path)]).size} visuals.`);
