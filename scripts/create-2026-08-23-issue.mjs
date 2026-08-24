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
issue.zhTitle = "AI Daily 2026-08-23：眼前的 HUD 开始替用户整理一天，物理 AI 进入数据基础设施";
issue.enTitle = "AI Daily 2026-08-23: HUDs organize the day while physical AI builds its data layer";
issue.zhSummary = "RayNeo iO 把 33g 无扬声器 HUD、四麦克风、旋钮与头部手势组合成一个面向日常信息的可穿戴入口；官方仍标记 coming soon，9 月 4 日发售与价格来自媒体和 beta 信号，不能写成已交付。另一端，Orbbec 在 WRC 2026 展示 Robot-Free Data Collection Platform 与 Physis 机器人视觉相机，把第一视角、手部、腕部和中心连接拆成可校准的数据采集矩阵；Google Developer Device Platform 则把真实 Android 设备、模拟器、Device Streaming API 与 agent skill 变成开发者产品。今天的主线是：AI 入口越靠近身体与真实设备，用户控制、隐私可见性、同步质量和验证闭环越需要成为产品表面。";
issue.enSummary = "RayNeo iO combines a 33g speakerless HUD, four microphones, a crown dial, and head gestures into a daily information surface; the official page still says coming soon, so September 4 availability and pricing remain bounded by media and beta signals rather than delivered-product proof. At the other end, Orbbec’s WRC 2026 launch shows a Robot-Free Data Collection Platform and Physis robotics cameras that split first-person, hand, wrist, and hub viewpoints into a calibrated data matrix. Google’s Developer Device Platform turns real Android devices, emulators, Device Streaming API, and an agent skill into a developer product. Today’s test is how control, privacy visibility, synchronization, and verification become product surfaces as AI moves closer to bodies and real hardware.";
issue.zhPath = `/ai-daily/${date}/zh/`;
issue.enPath = `/ai-daily/${date}/en/`;
issue.sourcesPath = `/ai-daily/${date}/sources.md`;
issue.sourceTypes = [...new Set([...(issue.sourceTypes ?? []), "confirmed product", "developer surface", "review/community friction", "china", "global"])] ;
for (const topic of issue.topics) topic.sourceDate = `${topic.sourceDate} · 2026-08-23 current source sweep`;

const rayneoIo = {
  id: "rayneo-io-speakerless-hud",
  section: "global",
  zhHeadline: "RayNeo iO：把手机提醒搬到视线里，但把声音也拿掉",
  enHeadline: "RayNeo iO moves phone prompts into view and removes the speaker",
  zhFact: "RayNeo 官方产品页把 iO 标为 coming soon；Android Authority 与 Android Central 在 8 月 21 日披露 33g、透明 HUD、四麦克风、Smart Crown、头部手势、无扬声器、录制/转写状态灯和 Android/iOS 兼容。媒体给出 9 月 4 日上市、US$479 起或 US$529 含充电盒等信息，beta 社区同时确认佩戴舒适度与功能取舍。价格、地区和最终软件能力仍按来源分开记录。",
  enFact: "RayNeo’s official product page still labels iO as coming soon. Android Authority and Android Central reported on August 21 that the glasses weigh 33g and combine a transparent HUD, four microphones, a Smart Crown, head gestures, no speakers, a hardwired capture/transcription light, and Android/iOS compatibility. Media reports place launch on September 4 at $479 or a $529 charging-case bundle, while beta-community posts add comfort and feature-tradeoff signals. Price, region, and final software behavior remain source-bounded.",
  zhValue: "iO 不是把完整手机搬到脸上，而是把日程、提醒、天气、翻译、语音笔记、提词器和会议行动项压缩成可抬眼确认的短决策层。它选择无扬声器，让结果主要进入 HUD，减少公共空间的外放干扰，也让用户必须在视觉反馈、头部点头、旋钮和手机之间建立新的确认习惯。产品价值集中在减少掏手机次数，而不在替代手机或耳机。",
  enValue: "iO does not put the whole phone on the face. It compresses schedules, notifications, weather, translation, voice notes, teleprompting, and meeting action items into a glance-and-confirm layer. The deliberate speakerless design keeps responses in the HUD and avoids open-air sound, but it also forces a new confirmation habit across visual feedback, nods, the crown, and the companion phone. The defensible value is fewer phone reaches, not phone or earbud replacement.",
  zhHciLens: ["抬眼确认", "无声反馈", "录制可见"],
  enHciLens: ["glance confirmation", "silent feedback", "visible capture"],
  zhImplication: "HUD 的低摩擦入口必须有同样清楚的状态反馈。用户要知道屏幕显示的是即时通知、语音转写、长期记忆还是模型建议；点头是在确认保存、继续滚动还是选择某个行动；录制灯要让佩戴者与旁观者都能理解。没有扬声器以后，系统不能把视觉当作装饰，而要把它当作主反馈通道。",
  enImplication: "A low-friction HUD needs equally clear state feedback. Users must know whether they are seeing a live notification, transcription, long-term memory, or model suggestion. A nod must mean save, continue, or select—not an ambiguous gesture. The capture light has to be legible to both wearer and bystander. Once the speaker is removed, the visual channel is not decoration; it becomes the primary feedback surface.",
  sourceDate: "2026-08-21 official page and media · 2026-08-22 beta/community signal · 2026-08-23 current source sweep",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official product page · independent product coverage · beta signal",
  visual: {
    path: "assets/rayneo-io-official-2026-08.png",
    width: 1600,
    height: 5398,
    kind: "source-backed page screenshot",
    altZh: "RayNeo iO 官方产品页截图",
    altEn: "RayNeo iO official product page",
    captionZh: "来源追踪视觉：RayNeo iO 官方产品页；可见产品形态、HUD 视觉示例与 coming soon 状态。完整参数与上市条件继续按官方、媒体和社区来源拆分。",
    captionEn: "Source-traceable visual: RayNeo iO official product page showing the product form, HUD example, and coming-soon status. Final specifications and availability remain separated by official, media, and community evidence.",
    sourceUrl: "https://www.rayneo.com/pages/rayneo-io-ai-glasses"
  },
  sources: [
    { label: "RayNeo iO official product page", url: "https://www.rayneo.com/pages/rayneo-io-ai-glasses" },
    { label: "Android Authority product report", url: "https://www.androidauthority.com/rayneo-glasses-reduce-smartphone-use-3700718/" },
    { label: "Android Central launch coverage", url: "https://www.androidcentral.com/gaming/virtual-reality/rayneo-holds-nothing-back-with-io-smart-glasses-hud-and-the-pure-cinema-gt-max" },
    { label: "RayNeo beta tester review", url: "https://www.reddit.com/r/RayNeo/comments/1vut8cp/io_smart_glass_review_from_a_beta_tester/" },
    { label: "RayNeo product manager AMA and community specs", url: "https://www.reddit.com/r/augmentedreality/comments/1vudxhh/rayneo-33g-display-smart-glasses-ama-with-product/" }
  ],
  dossierKind: "product",
  dossier: {
    zh: {
      productName: "RayNeo iO 是一副面向日常信息处理的显示型 AI 智能眼镜。它以普通眼镜般的外观、透明 HUD 和低摩擦抬眼动作承载提醒、转写、翻译与 AI 助手，官方页还提供邮件订阅入口而非已完成的公开购买流程。它把 AI 入口放在视线内，同时把摄像头缺席、扬声器缺席和录制状态灯变成产品边界。",
      productType: "产品类型是 HUD 显示眼镜、四麦克风语音输入设备、手机配套应用和云端/模型服务的组合。它不是视频 AR 眼镜，也不是带摄像头的第一视角记录器；Android Central 明确描述其无扬声器、以 HUD 为主，Android Authority 列出透明 MicroLED、Smart Crown、加速度计与陀螺仪。最终光学引擎、视场、存储、手机依赖与订阅策略以官方最终资料为准。",
      interactionFlow: "用户佩戴眼镜后抬眼查看个人 dashboard，使用 Smart Crown 浏览菜单，用头部手势确认或选择，向四麦克风阵列说话以进行转写、翻译、语音笔记或调用 AI。会议上下文可以被整理为行动项，用户再用点头确认是否保存到日程；提词器沿着 HUD 滚动，翻译文字直接出现在视线中。录制和转写由硬连线状态灯提示。公开资料没有完整展示通知优先级、误触回退、失焦时的静默策略、手机断连后的降级路径或所有确认手势。",
      specsOrStack: "Android Authority 报道 33g、0.1cc 级绿色单色 MicroLED、0.6mm 光学结构、最高 1,300 nits、240mAh 电池、四麦克风、骨传导传感器、加速度计和陀螺仪；Android Central 补充 97% optical transparency、Smart Crown、Android/iOS 兼容和录制/转写状态灯。Android Authority 还写到 IP54、典型使用最长 48 小时、待机最长 96 小时。没有公开的芯片、RAM、模型版本、端云路由、隐私保留时长、SDK、完整视场或订阅条款均为 source not stated。",
      useCases: "具体场景包括快速看日程和天气、会议转写与行动项确认、40 种语言的文字翻译、演讲提词、语音笔记和少量环境信息查询。对需要频繁从电脑/手机抬头回到现实的人，HUD 可以把短消息放在视线中；对不希望脸上有摄像头的人，无摄像头路线降低了旁观者对持续拍摄的担忧。室外强光、长时间阅读、处方镜片、独立使用和音频需求需要分别验证。",
      painPointsSolved: "iO 试图解决用户为了看一条提醒、翻译一行文字或确认一个会议事项而反复掏手机的问题，也解决部分佩戴式设备把声音直接播给周围人的社交摩擦。无摄像头减少了第一视角记录的隐私争议，无扬声器减少了漏音，但转而提高了视觉疲劳、信息遮挡和手机配套依赖的风险。它压缩的是短决策，不会自动消除完整任务的输入、编辑和长内容阅读成本。",
      userVoice: "beta 用户在 Reddit 说 33g 机身平衡、鼻托和镜腿套让日常佩戴很轻，并偏好其外观与室内使用；同一讨论也承认当前功能较少，室外太阳镜能力、音频输出和 AI 订阅仍是疑问。另一个社区规格帖把无扬声器与骨传导输入的误读暴露出来，说明硬件表述需要非常明确。这些是早期 beta/社区信号，不能当作大规模满意度结论。",
      newTech: "新技术组合是超薄透明 MicroLED HUD、低功耗背景上下文记录、四麦克风转写、旋钮和头部手势，以及将确认结果写回日程或个人工作流。关键设计点是把 AI 结果从聊天答案变成视线内的短状态，再用点头、旋钮和硬连线指示灯完成确认与社会可见性。产品没有摄像头和扬声器的取舍，把隐私与反馈从后台参数变成了交互结构。",
      availability: "RayNeo 官方页在当前 source sweep 中仍写 RayNeo iO Smart Glasses are coming soon，并提供订阅更新入口。Android Central 写 9 月 4 日开始零售，Android Authority 报道 US$479 起、约 US$529 含充电盒的 bundle；beta 社区同样提到 9 月 4 日。最终销售地区、价格、库存、保修、处方镜片、应用上线状态和订阅规则不能仅凭媒体预告确认。",
      limitsOrUnknowns: "需要重点验证的未知包括真实户外可读性、持续转写的电池表现、HUD 信息密度、误触与头部手势误判、断网/断手机后的降级、长期上下文记忆是否可关闭、录制灯是否不可绕过、AI 结果是否收费，以及无扬声器用户如何处理需要听觉反馈的场景。官方产品页未披露开发者 API、完整数据删除路径和模型供应商组合；相关内容保持 source not stated。",
      productVerdict: "RayNeo iO 是本期最强的可穿戴 confirmed product，但它的价值应精确表述为“可抬眼确认的日常 HUD”，而非完整 AI 电脑。无摄像头、无扬声器、33g 和状态灯形成清晰的隐私/社交取舍，代价是视觉反馈压力和手机依赖。产品判断：9 月 4 日发布后优先测试户外可读性、转写延迟、长期记忆控制、手势确认和订阅边界，再判断它是否能减少手机使用。"
    },
    en: {
      productName: "RayNeo iO is a display-first AI smart-glasses product for everyday information handling. It uses regular-looking frames, a transparent HUD, and glance-based interaction for notifications, transcription, translation, and assistant tasks. The official page still exposes an update form rather than a completed retail purchase flow. The absence of a camera and speaker, plus a visible capture/transcription indicator, are part of the product boundary rather than incidental omissions.",
      productType: "The product combines a HUD display, four-microphone voice input, a companion phone application, and cloud/model services. It is not positioned as full video AR eyewear or a first-person recorder. Android Central describes a speakerless design centered on the HUD, while Android Authority lists a transparent MicroLED display, Smart Crown, accelerometer, and gyroscope. Final optical engine, field of view, storage, phone dependency, and subscription terms remain subject to official confirmation.",
      interactionFlow: "The wearer looks up to view a personal dashboard, turns the Smart Crown to move through menus, and uses head gestures to confirm or select. Speech is captured through the four-microphone array for transcription, translation, notes, or assistant queries. In meetings, the system can surface action items that the user confirms with a nod before saving them to a calendar; a teleprompter scrolls in the HUD. A hardwired indicator communicates recording or transcription. Public material does not fully show notification priority, false-gesture undo, focus-loss quieting, phone-disconnect fallback, or every confirmation state.",
      specsOrStack: "Android Authority reports 33g, a roughly 0.1cc monochrome green MicroLED, a 0.6mm optical structure, up to 1,300 nits, a 240mAh battery, four microphones, a bone-conduction sensor, an accelerometer, and a gyroscope. Android Central adds 97% optical transparency, the Smart Crown, Android/iOS compatibility, and a hardwired recording/transcription light. Android Authority also reports IP54, up to 48 hours of typical use, and up to 96 hours of standby. Chipset, RAM, model version, edge/cloud routing, retention, SDK, complete field of view, and subscription terms are source not stated.",
      useCases: "Concrete use cases include checking schedule and weather, confirming meeting transcription and action items, translating text in 40 languages, presenting with a teleprompter, saving voice notes, and asking short context questions. For users who move between a computer and the physical world, a glanceable line can reduce phone retrieval. For people uncomfortable with a camera on the face, the camera-less route reduces the social assumption of continuous capture. Outdoor readability, long reading sessions, prescription lenses, standalone operation, and audio needs need separate testing.",
      painPointsSolved: "iO targets the repeated-phone-retrieval problem for a notification, translated phrase, or meeting detail, and it reduces the social leakage of playing assistant responses through an open speaker. No camera lowers first-person recording anxiety; no speaker reduces sound leakage. The tradeoff is more visual fatigue, possible information obstruction, and stronger companion-phone dependence. The product compresses short decisions. It does not remove the input, editing, and long-form reading costs of a complete task.",
      userVoice: "A beta tester on Reddit says the 33g frames feel exceptionally light and balanced, with nose pads and temple sleeves helping them stay put, and prefers the appearance for indoor use. The same post acknowledges that the current feature set is light and raises outdoor-shade, audio-output, and subscription questions. A separate community specification thread shows people misreading the bone-conduction input description as audio output. These are early beta and community signals, not population-level satisfaction data.",
      newTech: "The new combination is a thin transparent MicroLED HUD, low-power background context capture, four-microphone transcription, a rotary control, head gestures, and calendar or workflow confirmation. The product turns an assistant result into a short visual state that can be acknowledged through a nod or crown, while the hardwired light makes capture socially legible. Camera and speaker removal make privacy and feedback choices part of the interaction architecture instead of hidden implementation settings.",
      availability: "The official RayNeo page still says RayNeo iO Smart Glasses are coming soon and offers an update subscription. Android Central reports retail availability beginning September 4; Android Authority reports a $479 starting price and a roughly $529 charging-case bundle, while beta-community posts also point to September 4. Final regions, pricing, inventory, warranty, prescription options, app availability, and subscription rules cannot be confirmed from the preview alone.",
      limitsOrUnknowns: "Key unknowns include real outdoor readability, battery under continuous transcription, HUD information density, false head-gesture activation, offline and phone-disconnected behavior, whether long-term context memory can be disabled, whether the recording light is bypass-resistant, AI charges, and how users receive alerts that require audio. The official page does not expose a developer API, complete deletion path, or model-provider arrangement. Those details remain source not stated.",
      productVerdict: "RayNeo iO is the issue’s strongest wearable confirmed product, but its defensible promise is a glanceable daily HUD rather than a complete AI computer. Camera removal, speaker removal, 33g weight, and a visible status light create a clear privacy and social tradeoff, at the cost of visual feedback pressure and phone dependence. Verdict: after September 4, test outdoor readability, transcription latency, memory controls, gesture confirmation, and subscription boundaries before claiming that it reduces phone use."
    }
  }
};

const orbbecPhysicalAi = {
  id: "orbbec-robot-free-data-collection-physis",
  section: "china",
  zhHeadline: "Orbbec：把具身 AI 的“看见”拆成可采集、可校准的数据层",
  enHeadline: "Orbbec turns physical AI perception into a calibrated data layer",
  zhFact: "Orbbec 在 8 月 19 日 WRC 2026 发布 Robot-Free Data Collection Hardware Platform，并正式展示 Physis 系列机器人视觉相机。官方把 EGO 第一视角、UMI 手部操作、WristCam 腕部近场和 Hub 中心连接组成采集矩阵；披露 1600×1200@30fps 连续 37 小时、RGB/IMU 零丢帧、相机同步误差低于 1ms、工厂标定误差低于 0.3 像素。WRC 持续至 8 月 23 日，产品价格与开发者 API 未公开。",
  enFact: "On August 19, Orbbec launched its Robot-Free Data Collection Hardware Platform at WRC 2026 and formally introduced the Physis robotics-vision series. The official lineup combines EGO first-person capture, UMI handheld manipulation capture, WristCam near-field wrist capture, and a central Hub. Orbbec reports more than 37 hours at 1600x1200@30fps, zero dropped RGB/IMU frames, under-1ms multi-camera synchronization error, and under-0.3-pixel factory calibration error. WRC runs through August 23; price and developer API details are not stated.",
  zhValue: "这条产品线的用户不是普通消费者，而是机器人厂商、基础模型团队、数据采集服务商和需要验证真实操作的研究/工业团队。它把“给机器人装一只更像人的眼睛”转成多视角采集与同步工程：头部看到什么、手正在操作什么、腕部接近什么、中心节点如何汇总，都能进入同一份训练或验证数据。价值不在发布一个会自主行动的机器人，而在补足从现实任务到可用训练样本之间的基础设施。",
  enValue: "The buyers are robot manufacturers, foundation-model teams, data-collection providers, and research or industrial groups that must validate real manipulation. The platform turns “give a robot more human-like eyes” into a multi-view synchronization problem: what the head sees, what the hand manipulates, what the wrist approaches, and how the hub aggregates signals can enter one training or validation record. Its value is infrastructure between real tasks and usable data, not a claim that Orbbec has launched an autonomous robot.",
  zhHciLens: ["多视角采集", "时间对齐", "部署验证"],
  enHciLens: ["multi-view capture", "temporal alignment", "deployment validation"],
  zhImplication: "具身产品的体验质量会被数据采集链路反向决定。若视觉、触觉、音频与动作时间戳不一致，模型学到的就不是用户与物体的真实关系。面向产品团队，传感器同步、标定误差、丢帧率和采集授权都应进入验收面板；“模型更聪明”不能遮住数据管道的失真。",
  enImplication: "Embodied-product quality is determined upstream by the data pipeline. If vision, touch, audio, and action timestamps drift, the model learns a false relationship between user and object. Product teams should expose synchronization, calibration error, dropped-frame rate, and capture authorization in acceptance dashboards. A smarter model cannot compensate for a distorted capture pipeline.",
  sourceDate: "2026-08-19 official WRC launch · 2026-08-23 WRC event window",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official China launch · robotics infrastructure · source-backed performance claims",
  visual: {
    path: "assets/orbbec-physis-wrc-official-2026-08.png",
    width: 1600,
    height: 10737,
    kind: "source-backed page screenshot",
    altZh: "Orbbec WRC 2026 物理 AI 数据采集与 Physis 视觉产品官方页面",
    altEn: "Orbbec official WRC 2026 physical-AI data and Physis vision page",
    captionZh: "来源追踪视觉：Orbbec WRC 2026 官方发布页；展示 Robot-Free Data Collection Platform 与 Physis 视觉产品线，并标注采集矩阵、连续采集与同步/标定指标。",
    captionEn: "Source-traceable visual: Orbbec’s official WRC 2026 launch page showing the Robot-Free Data Collection Platform, Physis vision line, capture matrix, and synchronization/calibration claims.",
    sourceUrl: "https://www.orbbec.com/news/orbbec-unveils-two-new-product-lines-at-wrc-2026-advancing-scalable-physical-ai-data-collection-and-human-like-robotics-vision/"
  },
  sources: [
    { label: "Orbbec official WRC 2026 launch", url: "https://www.orbbec.com/news/orbbec-unveils-two-new-product-lines-at-wrc-2026-advancing-scalable-physical-ai-data-collection-and-human-like-robotics-vision/" },
    { label: "Orbbec Robot-Free Data Collection platform", url: "https://www.orbbec.com/products/robot-free-data-collection/" },
    { label: "Orbbec documentation and SDK resources", url: "https://www.orbbec.com/developers/" }
  ],
  dossierKind: "product",
  dossier: {
    zh: {
      productName: "Orbbec Robot-Free Data Collection Hardware Platform 与 Physis 系列，是 Orbbec 面向物理 AI 的两组基础设施产品。前者收集真实人类操作和环境交互数据，后者为机器人提供宽视场、高质量影像和空间感知。它们在 WRC 2026 公开展示，面向模型训练、机器人验证、数据服务和部署级视觉，而非面向家庭用户的完整机器人。",
      productType: "产品类型是可穿戴/手持/腕部多视角采集设备、中心连接 Hub、机器人视觉相机、标定与同步软件以及 SDK/定制服务的软硬件系统。官方将 EGO、UMI、WristCam、Hub 组成采集矩阵，并将 Physis 作为感知侧产品线。数据采集和机器人视觉是不同组件，公开资料没有把它们描述为一个单一终端或一个可自主运行的 agent。",
      interactionFlow: "数据采集者佩戴 EGO 获取第一视角，使用 UMI 记录手部操作，WristCam 捕捉腕部近场交互，Hub 汇总多路数据；视觉、IMU、触觉、音频与视频在空间和时间上对齐后，进入模型训练或机器人验证。部署者则把 Physis 相机放到机器人系统中，利用宽视场和空间感知观察材料、遮挡、灯光与长尾动作。公开资料没有完整说明校准 UI、数据授权提示、实时监看、重采策略、SDK API 结构和采集者隐私控制。",
      specsOrStack: "Orbbec 官方披露在生产线测试中连续采集超过 37 小时，分辨率 1600×1200@30fps，使用 H.264，RGB 与 IMU 零丢帧，累计超过 1 亿帧；相机到 IMU 的帧间隔变化控制在 30 微秒内，多相机硬件同步误差低于 1ms，工厂标定误差低于 0.3 像素。官方还描述视觉、触觉、音频与视频的多传感器对齐，以及 SDK、定制、CM/JDM 服务。具体芯片、接口带宽、存储介质、价格、功耗条件和模型栈均为 source not stated。",
      useCases: "具体场景包括机器人抓取和装配的示教数据、家庭/仓储中的长尾物体操作、不同材料与光照下的感知验证、模型训练、仿真到现实的差异排查和工厂部署前的视觉测试。EGO 适合记录操作者视角，UMI 适合手部与物体关系，WristCam 适合近场动作，Hub 适合多源汇总。Physis 适合机器人端的宽视场与空间感知。它服务的是数据与验证团队，不直接替用户执行任务。",
      painPointsSolved: "传统具身 AI 数据采集往往依赖零散相机、手工同步、一次性标定和无法复用的定制脚本，导致现实材料、遮挡、光照和失败动作覆盖不足。Orbbec 试图用标准化的视角产品、时间同步、工厂标定和持续采集能力降低数据生产成本，让同一套设备能更快进入训练、回放和验证。它没有解决语义标注成本、采集者同意、数据安全、跨机器人迁移或模型泛化问题；这些仍在系统边界之外。",
      userVoice: "当前公开证据主要来自 Orbbec 官方 WRC 发布和现场展示，尚没有足够的独立长期评测或社区反馈来判断佩戴舒适度、安装难度、SDK 学习成本、数据标注效率和售后体验。官方给出的 37 小时、零丢帧、同步和标定数字是厂商测试声明，应保留测试条件并等待第三方复现。产品团队不能把发布会性能数字直接等同于跨场景可靠性。",
      newTech: "新技术重点在多视角、跨模态、微秒级对齐和部署级稳定性的联动。它把视觉采集从“拍一段视频”推进为带有姿态、IMU、触觉/音频和统一时间基准的数据产品；再通过 Physis 将宽视场、影像质量、空间感知与可靠性放到机器人相机选择中。这样的系统为 physical AI 提供了数据闭环入口，但官方没有公开具体模型、标注协议或端侧推理能力。",
      availability: "Orbbec 在中国北京 WRC 2026 于 8 月 19 日发布并展示这些产品，WRC 活动持续到 8 月 23 日，官方称平台已服务中国与国际市场的行业客户。今天可以确认公开展示、产品线与厂商披露的应用方向；价格、标准零售 SKU、全球交付、订购门槛、具体 SDK 权限和开发板方案未在发布页公开，均为 source not stated。",
      limitsOrUnknowns: "需要验证的关键问题包括多设备长期佩戴与热量、真实场景下同步漂移、遮挡与强光下的视觉质量、数据采集者的隐私提示和撤回、跨设备标定复用、SDK 是否能导出原始时间戳、数据是否带硬件序列号，以及 37 小时测试能否在不同分辨率和压缩条件下复现。官方发布页没有给出完整价格、接口、模型和安全文档。",
      productVerdict: "Orbbec 的 WRC 2026 信号是一个 confirmed product 基础设施层：它把具身 AI 从机器人本体叙事拉回真实数据、同步和标定。产品判断：对做机器人、数据服务和研究验证的团队，EGO/UMI/WristCam/Hub 加 Physis 提供了可拆分的采集入口；对普通用户没有直接可用价值。下一步应验证 SDK、原始数据访问、跨场景稳定性和采集治理，再评估是否能成为长期数据管道。"
    },
    en: {
      productName: "Orbbec’s Robot-Free Data Collection Hardware Platform and Physis series are two infrastructure product families for physical AI. The first captures real human manipulation and environmental interaction; the second supplies robotics systems with wide-field imaging, high-quality output, and spatial perception. They were shown at WRC 2026 for model training, robot validation, data services, and deployment-grade vision, not as a complete household robot.",
      productType: "The system combines wearable, handheld, and wrist-level multi-view capture devices, a central Hub, robotics cameras, calibration and synchronization software, SDK resources, and customization services. Orbbec groups EGO, UMI, WristCam, and Hub into a capture matrix, while Physis is the perception-side line. The public announcement treats data collection and robot vision as related components, not one autonomous agent endpoint.",
      interactionFlow: "A collector wears EGO for first-person vision, uses UMI to record hand manipulation, adds WristCam for near-field wrist interaction, and sends streams through the Hub. Vision, IMU, touch, audio, and video are aligned in space and time before entering training or robot validation. A deployment team places Physis cameras in a robot system to observe materials, occlusion, lighting, and long-tail actions across a workspace. Public material does not fully show calibration UI, consent prompts, live monitoring, resampling, SDK APIs, or collector privacy controls.",
      specsOrStack: "Orbbec reports more than 37 hours of continuous production-line capture at 1600x1200@30fps using H.264, zero dropped RGB/IMU frames, and more than 100 million frames. Camera-to-IMU interval variation was kept within 30 microseconds; hardware multi-camera synchronization error was below 1ms; factory calibration error was below 0.3 pixels. The company describes multi-sensor alignment and SDK, customization, CM, and JDM services. Chipset, interface bandwidth, storage, price, power conditions, and model stack are source not stated.",
      useCases: "Concrete uses include demonstration data for grasping and assembly, long-tail household or warehouse manipulation, perception validation across material and lighting changes, model training, sim-to-real diagnosis, and pre-deployment factory vision testing. EGO records the operator viewpoint, UMI focuses on hand-object relation, WristCam captures near-field action, and Hub aggregates sources. Physis targets wide-field and spatial perception on the robot side. The system serves data and validation teams; it does not directly execute a user task.",
      painPointsSolved: "Physical-AI teams often depend on scattered cameras, manual synchronization, one-off calibration, and scripts that cannot be reused, leaving real materials, occlusions, lighting, and failed actions underrepresented. Orbbec’s standardized viewpoints, timing, factory calibration, and sustained-capture claims aim to reduce data-production cost and move the same hardware more quickly into training, replay, and validation. It does not solve semantic labeling cost, consent, security, cross-robot transfer, or model generalization.",
      userVoice: "Public evidence is currently dominated by Orbbec’s official WRC announcement and live demonstration. There is not enough independent long-term testing or community feedback to judge wear comfort, installation, SDK learning cost, labeling efficiency, or support. The 37-hour, zero-drop, synchronization, and calibration figures are vendor test claims and should retain their conditions until independently reproduced. A launch number is not automatically cross-scenario reliability.",
      newTech: "The important technology is the combination of multi-view capture, cross-modal alignment, microsecond-scale timing, and deployment stability. Capture becomes more than a video file: it can carry pose, IMU, touch or audio signals, and a shared time base into a training record. Physis then connects wide-field imaging, image quality, spatial perception, and reliability to the robot camera choice. The public announcement does not disclose a specific model, annotation protocol, or edge-inference runtime.",
      availability: "Orbbec launched and demonstrated the lines in Beijing at WRC 2026 on August 19; the conference runs through August 23, and the company says the platform is already serving industrial clients in China and international markets. The confirmed surface is the public launch, product families, and stated application direction. Pricing, standard retail SKUs, global delivery, purchase thresholds, SDK permissions, and developer-board packages are source not stated.",
      limitsOrUnknowns: "Acceptance questions include long-term wear and heat, synchronization drift in real environments, vision quality under occlusion and strong light, consent and withdrawal for collectors, calibration reuse across devices, raw timestamp export, hardware identifiers in data, and whether the 37-hour test reproduces at other resolutions or compression levels. The launch page does not provide full pricing, interfaces, model details, or security documentation.",
      productVerdict: "Orbbec’s WRC signal is a confirmed infrastructure product that pulls physical AI back to data, timing, and calibration. Verdict: for robotics, data-service, and validation teams, EGO/UMI/WristCam/Hub plus Physis offer separable capture and perception entry points; they have no direct consumer value. The next test is SDK access, raw-data control, cross-scenario stability, and capture governance before treating the stack as a durable data pipeline."
    }
  }
};

const googleDdp = {
  id: "google-developer-device-platform",
  section: "official",
  zhHeadline: "Google Developer Device Platform：让 agent 直接碰真实手机",
  enHeadline: "Google Developer Device Platform lets agents touch real phones",
  zhFact: "Google Cloud 在 8 月 11 日宣布 Developer Device Platform public preview，8 月 12 日开始向 Google Cloud 用户开放；release notes 列出 Device Catalog、Device Run、Find Logs、Device Streaming API 和 agent skill。它可以按需提供真实 Android 设备与高并发模拟器，让 agent 远程滚动、点击、跑测试、看日志、分析芯片性能和验证硬件特定 bug。iOS 支持仍是计划，价格按测试分钟计费。",
  enFact: "Google Cloud announced Developer Device Platform public preview on August 11 and made it available to Google Cloud users from August 12. Release notes list Device Catalog, Device Run, Find Logs, Device Streaming API, and an agent skill. The platform provides on-demand physical Android devices and high-concurrency emulators so agents can scroll, click, run tests, inspect logs, analyze chip performance, and validate hardware-specific bugs. iOS support remains planned; preview pricing is per active testing minute.",
  zhValue: "DDP 的产品变化是把“agent 写完代码后自己在设备上验证”变成一个有 API、有设备目录、有日志和有计费边界的云产品。对折叠屏、不同芯片、摄像头、传感器和端侧 AI 来说，模拟器无法覆盖真实发热、性能、权限和系统行为；DDP 让开发团队把设备差异纳入 agent 的迭代回路，减少只在个人手机上试一遍的盲区。",
  enValue: "DDP turns “let an agent verify its code on a device” into a cloud product with an inventory, APIs, logs, and billing boundaries. Foldables, different chips, cameras, sensors, and on-device AI expose heat, performance, permission, and system behavior that emulators cannot fully represent. DDP lets teams put device variance inside the agent iteration loop instead of hoping one personal phone represents the market.",
  zhHciLens: ["设备在环", "可追踪测试", "硬件差异"],
  enHciLens: ["hardware-in-the-loop", "traceable tests", "device variance"],
  zhImplication: "当 agent 直接操作真实设备，开发者体验的核心就从“生成代码”转成“证据闭环”：它连接了哪台设备、看到了什么、改了什么、为什么重试、最终是否覆盖了硬件差异。界面应把设备、权限、会话、日志和失败回放放在同一条时间线上，否则 agent 的自动化只会把不可见的不确定性放大。",
  enImplication: "When an agent operates real devices, developer experience shifts from code generation to an evidence loop: which device was reserved, what was observed, what changed, why a retry happened, and whether hardware variance was covered. The interface should keep device, permission, session, logs, and failure replay on one timeline. Otherwise automation only amplifies invisible uncertainty.",
  sourceDate: "2026-08-11 official preview · 2026-08-17 release notes update · 2026-08-23 current source sweep",
  evidenceLabel: "developer surface",
  evidenceStrength: "developer surface · official Google Cloud preview · API/release-note evidence",
  visual: {
    path: "assets/google-ddp-official-2026-08.png",
    width: 1600,
    height: 4204,
    kind: "source-backed page screenshot",
    altZh: "Google Cloud Developer Device Platform 官方公告页面",
    altEn: "Google Cloud Developer Device Platform official announcement",
    captionZh: "来源追踪视觉：Google Cloud DDP 官方公告；可见 Device Streaming、Device Run、agent skill 与 public preview 的产品边界。",
    captionEn: "Source-traceable visual: Google Cloud’s DDP announcement showing Device Streaming, Device Run, the agent skill, and the public-preview boundary.",
    sourceUrl: "https://cloud.google.com/blog/topics/developers-practitioners/announcing-developer-device-platform-on-google-cloud"
  },
  sources: [
    { label: "Google Cloud DDP announcement", url: "https://cloud.google.com/blog/topics/developers-practitioners/announcing-developer-device-platform-on-google-cloud" },
    { label: "DDP release notes", url: "https://docs.cloud.google.com/developer-device-platform/release-notes" },
    { label: "Google Cloud Developer Device Platform documentation", url: "https://docs.cloud.google.com/developer-device-platform/" }
  ],
  dossierKind: "product",
  dossier: {
    zh: {
      productName: "Google Developer Device Platform 是 Google Cloud 面向 agentic mobile app development 的设备云产品。它从 Firebase Test Lab 的测试传统延伸出来，提供真实 Android 设备、高并发模拟器、设备目录、远程流式交互、并行测试、日志和 agent skill。它的用户是移动开发者、QA、企业工程团队和需要验证端侧 AI/硬件差异的 agent。",
      productType: "产品类型是云端设备农场、设备编排 API、远程交互界面、CI/CD 测试服务和 coding-agent 工具接口。Google 将 Device Catalog 用于描述设备类型，Device Streaming API 用于远程连接真实设备或模拟器，Device Run API 用于在大量设备上并行执行测试，Find Logs 用于定位结果。它属于 developer surface，不是面向终端消费者的 AI 应用。",
      interactionFlow: "开发者或 agent 先查询设备目录，选择真实 Android 设备或模拟器，预留并连接 Device Streaming，远程滚动、点击、安装或运行应用，再读取性能与日志。对于可重复的用户旅程，团队把测试接入 Device Run 和 CI/CD，在数百设备上并行执行，使用 smart sharding 与自动重试定位问题。agent skill 允许 agent 找设备、预留设备、执行多步旅程、观察视觉瑕疵、分析芯片性能并验证修复。",
      specsOrStack: "官方公告列出 Device Streaming API、Device Run API、Device Catalog、Find Logs、agent skill、真实物理设备、高并发虚拟模拟器、智能分片和自动重试。Google 还说 DDP 将与 Android Studio 和 Android CLI 集成。public preview 从 8 月 12 日向 Google Cloud 用户开放，按实际 active testing minutes 计费，物理设备与模拟器费率不同。设备型号覆盖、并发上限、网络条件、录屏保留、数据隔离、完整 API 额度和模型调用成本均为 source not stated。",
      useCases: "具体场景包括折叠屏 UI 回归、端侧 AI 推理性能、相机/传感器路径、跨芯片行为、真实权限弹窗、不同屏幕尺寸和硬件特定 bug 的验证。agent 可以在生成代码后启动应用、走完多步用户旅程、发现视觉错位、查看日志、测量芯片性能并验证修复；人类工程师则可以通过实时 Device Streaming 重现失败。它把真实设备差异放进开发循环，而非仅在发布前做一次人工验收。",
      painPointsSolved: "DDP 解决企业需要购买、维护和并行接入大量测试手机的问题，也减少只在开发者自己的手机上测试而误判兼容性的风险。远程设备、日志和 API 让失败更容易复现，智能分片和重试减少整批测试的等待时间。它没有自动保证测试覆盖、agent 判断质量或真实用户网络代表性；如果设备目录不透明、会话权限不清或日志不能回放，自动化仍会把失败变成难以审计的黑箱。",
      userVoice: "公开材料当前以 Google Cloud 官方 preview 和 release notes 为主，尚无足够独立用户评测来判断设备排队、远程延迟、录像/日志体验、计费可预测性或 agent 误操作的真实摩擦。官方 release notes 明确将其标为 Preview / Pre-GA，说明支持和稳定性可能有限。今天可以确认产品表面与 API 方向，不能把 public preview 写成成熟的全球设备覆盖。",
      newTech: "新技术在于把 coding agent 的行动能力连接到真实物理设备。过去 agent 多在模拟器或代码仓库里循环；DDP 把设备预留、实时操作、视觉检查、性能分析和日志查找组合成可调用的工具链。它也把“设备差异”变成 agent 的观察变量：芯片、折叠状态、屏幕尺寸和系统权限都能进入测试证据。Google 尚未公开 agent skill 的完整权限模型和安全隔离细节。",
      availability: "Google Cloud 官方公告称 DDP 从 2026 年 8 月 12 日开始 public preview，面向 Google Cloud 用户，按 active testing minutes 计费。release notes 说明当前 offering 以 Android command line 为主，计划加入 Google Cloud console 集成和 iOS 支持。今天可确认 public preview、Android 方向和列出的 API；具体地区、设备清单、配额、价格表、SLA、企业数据处理条款和 iOS 时间表均需以账户与官方文档为准。",
      limitsOrUnknowns: "关键未知包括真实设备库存与地域覆盖、并发和排队、交互延迟、摄像头/麦克风/定位权限、录像与日志保留、设备重置隔离、agent 是否可执行高风险操作、测试失败后的复现完整度、端侧 AI 的芯片遥测粒度以及 physical device 与 emulator 的差异说明。Preview/Pre-GA 意味着产品行为可能变化，不能把当前 API 视为稳定长期承诺。",
      productVerdict: "DDP 是本期最清晰的 developer surface：它把 agent 从“写代码”推进到“在真实设备上验证行为”，并给出设备目录、流式交互、并行测试和日志证据。产品判断：它对 AI 移动产品的价值取决于硬件覆盖、权限审计和失败回放，不取决于 agent 能否点击按钮。下一步应实测设备矩阵、延迟、计费、日志与安全边界，再决定是否把它纳入日常 CI。"
    },
    en: {
      productName: "Google Developer Device Platform is a Google Cloud device service for agentic mobile-app development. Extending the Firebase Test Lab tradition, it offers physical Android devices, high-concurrency emulators, device catalogs, remote streaming, parallel runs, logs, and an agent skill. Its users are mobile developers, QA teams, enterprise engineering groups, and agents that must validate edge-AI or hardware variance.",
      productType: "The product combines a cloud device farm, orchestration APIs, a remote interaction surface, CI/CD test services, and coding-agent tooling. Device Catalog describes device types; Device Streaming API connects to a physical device or emulator; Device Run executes tests in parallel; Find Logs supports result diagnosis. It is a developer surface, not a consumer AI application.",
      interactionFlow: "A developer or agent queries the catalog, selects a physical Android device or emulator, reserves it, connects through Device Streaming, and scrolls or clicks through the app while inspecting performance and logs. Repeatable journeys move into Device Run and CI/CD, where smart sharding and automatic retries run across hundreds of devices. The agent skill can find and reserve devices, execute multi-step journeys, spot visual artifacts, analyze on-device chip performance, and validate a hardware-specific fix.",
      specsOrStack: "Google lists Device Streaming API, Device Run API, Device Catalog, Find Logs, an agent skill, physical devices, high-concurrency virtual emulators, smart sharding, and automatic retries. The announcement also says DDP will integrate with Android Studio and Android CLI. Public preview opened to Google Cloud users on August 12 and charges by active testing minute, with different emulator and physical-device rates. Device coverage, concurrency limits, network conditions, recording retention, isolation, quotas, and model-call costs are source not stated.",
      useCases: "Concrete uses include foldable UI regression, on-device AI performance, camera and sensor paths, cross-chip behavior, real permission prompts, screen-size differences, and hardware-specific bug validation. After generating code, an agent can launch the app, complete a multi-step journey, detect visual artifacts, inspect logs, measure chip performance, and validate a fix; an engineer can reproduce a failure through live streaming. Hardware variance becomes part of the development loop instead of a final manual check.",
      painPointsSolved: "DDP addresses the cost of purchasing, maintaining, and parallelizing large fleets of test phones, and it reduces the risk of treating one developer’s handset as the market. Remote devices, logs, and APIs make failures more reproducible; sharding and retries reduce batch wait time. It does not guarantee test coverage, agent judgment, or representative real-world networks. Opaque inventory, unclear session permission, or non-replayable logs would still make the automation difficult to audit.",
      userVoice: "Public evidence is currently Google’s preview announcement and release notes, with insufficient independent user reporting to judge queueing, remote latency, recording and log ergonomics, billing predictability, or agent misoperation. The release notes explicitly label the service Preview / Pre-GA, which implies limited support and possible behavior change. The confirmed surface is the product and API direction, not mature global device coverage.",
      newTech: "The new capability is connecting a coding agent to physical devices as an observable action loop. Instead of cycling only through a simulator or repository, the agent can reserve hardware, interact in real time, check visuals, analyze performance, and find logs. Device variance becomes an observation variable: chip, fold state, screen size, and system permissions can enter the evidence. Google has not published the complete permission and isolation model for the agent skill.",
      availability: "Google says DDP entered public preview for Google Cloud users on August 12, 2026, with billing based on active testing minutes. Release notes describe the current offering as Android command-line oriented and say console integration and iOS support are planned. The confirmed availability is public preview and its Android API direction; regions, device inventory, quotas, price tables, SLA, enterprise data terms, and iOS timing require account-level or official-document verification.",
      limitsOrUnknowns: "Key unknowns include regional inventory, concurrency and queueing, interaction latency, camera/microphone/location permissions, recording and log retention, device-reset isolation, whether an agent can perform risky operations, failure-replay completeness, edge-AI telemetry granularity, and emulator-versus-physical differences. Preview/Pre-GA means behavior may change; the current API should not be treated as a durable long-term contract.",
      productVerdict: "DDP is the issue’s clearest developer surface because it moves an agent from writing code to validating behavior on real devices, with a catalog, streaming interaction, parallel runs, and logs. Verdict: its value for AI mobile products depends on hardware coverage, permission audit, and failure replay—not on whether an agent can click a button. Test the device matrix, latency, billing, logs, and security boundary before putting it into daily CI."
    }
  }
};

const robotPhone = {
  id: "honor-robot-phone-4dof-gimbal",
  section: "china",
  zhHeadline: "HONOR Robot Phone：让手机的相机真的开始移动",
  enHeadline: "HONOR Robot Phone makes the phone camera physically move",
  zhFact: "HONOR 官方宣布 Robot Phone 在中国上市，提供 12GB+512GB 与 16GB+1TB 两种配置，定价分别为 RMB 9,999 与 RMB 12,999；官方页披露 Titanium Agile Gimbal、YOYO Robot Mode 和 ARRI Image Science。T3、PetaPixel、Tom’s Guide、WIRED 与 Android Authority 的上手报道均把 4-DoF/机械云台作为核心体验。美国可得性、Google 服务、长期耐久与第三方应用控制接口仍需区分已知与未知。",
  enFact: "HONOR announced that the Robot Phone entered sales in China in two configurations: 12GB+512GB at RMB 9,999 and 16GB+1TB at RMB 12,999. The official product page names the Titanium Agile Gimbal, YOYO Robot Mode, and ARRI Image Science. Hands-on reports from T3, PetaPixel, Tom’s Guide, WIRED, and Android Authority treat the 4-DoF mechanical gimbal as the central experience. Availability outside China, Google services, long-term durability, and third-party camera control remain separate questions.",
  zhValue: "它不是把一个 AI 聊天入口塞进手机，而是把相机从固定模块变成可以转动、抬头、跟踪和改变取景的物理执行器。创作者可以把手机放在桌面上，让云台跟随人物；旅行者可以用手机完成比普通手机更稳定的移动拍摄；YOYO Robot Mode 则让机械结构用点头、转向或舞动表达状态。这个形态把计算摄影、机械控制、被摄主体识别与声音方向重新放进同一个产品回路，也让耐久、夹伤、遮挡、误跟踪和电量成为可见成本。",
  enValue: "This is not only a chat entry point placed inside a phone. It turns the camera from a fixed module into a physical actuator that can rotate, tilt, track, and change framing. A creator can place the phone on a table and let the gimbal follow a person; a traveler can get more stable moving footage without carrying a separate pocket gimbal; YOYO Robot Mode uses nods, turns, and motion as a playful state expression. The form reconnects computational photography, mechanical control, subject recognition, and audio direction in one product loop, while making durability, obstruction, mis-tracking, pinch risk, and battery cost visible.",
  zhHciLens: ["物理意图", "动作可见性", "单人拍摄"],
  enHciLens: ["physical intent", "motion legibility", "solo capture"],
  zhImplication: "具身 AI 的关键反馈不只在屏幕上。云台开始移动前，用户需要知道它将跟踪谁、转向哪里、是否会越过安全边界；移动中要看到目标锁定、人工接管和停止入口；失败时要回到固定镜头或手动取景。Robot Phone 把“动作”变成了系统输出，产品必须像展示按钮状态一样展示运动意图。",
  enImplication: "Embodied AI needs feedback beyond the screen. Before the gimbal moves, the user needs to know whom it will track, where it will turn, and whether it may cross a safety boundary. During motion, the target lock, manual takeover, and stop control need to remain legible. When tracking fails, the system should return to a fixed camera or manual framing. Robot Phone makes motion a system output, so the product must expose physical intent as clearly as it exposes a button state.",
  sourceDate: "2026-08-12 official launch · 2026-08-17 PetaPixel hands-on · 2026-08-19 T3 hands-on · 2026-08-21 current source sweep",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official launch · independent hands-on · China availability",
  visual: {
    path: "assets/honor-robot-phone-official-2026-08.png",
    width: 1600,
    height: 1000,
    kind: "source-backed page screenshot",
    altZh: "HONOR Robot Phone 官方产品页截图",
    altEn: "HONOR Robot Phone official product page",
    captionZh: "来源追踪视觉：HONOR Robot Phone 官方产品页；页面展示 Titanium Agile Gimbal、YOYO Robot Mode、ARRI Image Science 与 Buy 入口。中国销售和海外可得性需分开记录。",
    captionEn: "Source-traceable visual: HONOR Robot Phone official product page. The page shows the Titanium Agile Gimbal, YOYO Robot Mode, ARRI Image Science, and a Buy entry; China sales and overseas availability are tracked separately.",
    sourceUrl: "https://www.honor.com/global/phones/honor-robot-phone/"
  },
  sources: [
    { label: "HONOR official launch announcement", url: "https://www.honor.com/global/news/honor-robot-phone-launch/" },
    { label: "HONOR Robot Phone official product page", url: "https://www.honor.com/global/phones/honor-robot-phone/" },
    { label: "HONOR China launch announcement", url: "https://www.honor.com/cn/news/honor-robot-phone-launch/" },
    { label: "PetaPixel hands-on review", url: "https://petapixel.com/2026/08/17/honor-robot-phone-hands-on-this-isnt-a-gimmick/" },
    { label: "T3 hands-on review", url: "https://www.t3.com/tech/android-phones/after-using-the-honor-robot-phones-basically-peerless-gimbal-camera-i-cant-work-out-if-its-the-future-or-not" },
    { label: "Tom's Guide hands-on", url: "https://www.tomsguide.com/phones/i-tried-the-honor-robot-phone-and-its-the-coolest-phone-in-years-thats-not-coming-to-the-us" },
    { label: "WIRED product report", url: "https://www.wired.com/story/honor-robot-phone/" },
    { label: "Android Authority hands-on", url: "https://www.androidauthority.com/honor-robot-phone-hands-on-3697387/" },
    { label: "HONOR Robot Phone community discussion", url: "https://www.reddit.com/r/Honor/comments/1vn7kot/honors_new_flagship_takes_smartphone_photography/" }
  ],
  dossierKind: "product",
  dossier: {
    zh: {
      productName: "HONOR Robot Phone 是荣耀面向中国市场推出的具身摄影型智能手机。它用可伸缩、可转动的 Titanium Agile Gimbal 取代固定主摄模块，把手机从被动记录工具变成能够改变镜头方向、跟踪主体和表达状态的物理系统。官方在 2026 年 8 月 12 日发布，官方销售从 8 月 18 日开始；媒体在中国进行了现场上手。",
      productType: "产品类型是 Android 智能手机、机械云台相机和 AI 拍摄系统的组合。手机主体仍然承担通讯、计算和显示，顶部的主摄则拥有独立的机械运动。官方称它采用 4-DoF mechanical gimbal，并把 ARRI Image Science、YOYO Robot Mode 和 AI-powered motion control 作为产品卖点。它的竞争边界同时触及传统旗舰手机、DJI Osmo Pocket 一类的口袋云台相机，以及需要自己架设三脚架或请人跟拍的内容创作工具。",
      interactionFlow: "用户可以像使用普通手机一样打开相机，也可以让机械云台弹出并通过屏幕方向控制、语音或 AI subject tracking 改变镜头姿态。拍摄者把手机放在桌面、支架或手中，选择人物、宠物或运动对象，系统再让相机持续跟随或保持构图。媒体上手还描述了云台的转动、滚转、追踪和 YOYO Robot Mode 的动作表达。公开证据没有完整展示第三方应用如何调用云台、动作开始前的确认、目标误锁时的接管、物理停止键、夹伤保护或断电收回流程；这些都属于使用前必须验证的控制面。",
      specsOrStack: "HONOR 官方发布信息列出 12GB+512GB 和 16GB+1TB 两个配置，价格为 RMB 9,999 与 RMB 12,999；官方称其拥有完全集成的 4-DoF mechanical gimbal、HONOR Titanium Agile Gimbal、AI-powered motion control 和 ARRI Image Science。PetaPixel、T3、Tom’s Guide 和 HardwareZone 的报道补充了 200MP、f/1.6 主摄与 Snapdragon 8 Elite Gen 5 等信息，但不同媒体对传感器尺寸、DoF 表述和完整相机组合的写法不完全一致，因此规格需按各自来源保留。官方与评测没有完整公开云台电机型号、运动范围、关节寿命、RAM 之外的存储策略、Camera2/CameraX API、第三方 app 支持、端云模型路由、续航与维修成本；未声明部分均为 source not stated。",
      useCases: "具体场景包括单人 vlog、桌面直播、旅行记录、家庭活动、宠物跟拍、运动拍摄、动态合影和需要稳定移动镜头的短视频生产。创作者可以把手机放在远处，让相机追踪自己，减少一只手拿手机或另带 pocket gimbal 的负担；旅行者可以在同一台设备上完成拍摄、剪辑、通讯和发布；普通用户可以把机械动作作为拍照反馈或陪伴式表情。手机形态还保留了传统手持拍摄路径，用户可以关闭跟踪并手动构图。中国限定、系统服务差异和大型机身的口袋携带成本，会直接影响这些场景是否成立。",
      painPointsSolved: "Robot Phone 试图解决单人拍摄需要额外三脚架、云台或第二个人操作的问题，也试图把稳定、跟踪和主体构图从拍摄者的手部操作中释放出来。机械云台让相机可以主动保持人物在画面里，减少走动时的抖动和反复回看；手机与云台合体则减少一个设备、一个电池和一次文件转移。它没有消除手机拍摄的光线、收音、取景和社交摩擦。T3 的上手判断对画面稳定和移动跟踪较积极，但 Tom’s Guide 指出低光表现和真正竖屏录制存在问题；WIRED 认为 YOYO 与机械动作的 AI 结合更像 gimmick。痛点解决程度因此集中在镜头控制，而非泛化的 AI 助手能力。",
      userVoice: "PetaPixel 认为这是一款已经完成、并且机械云台确实工作的产品，但也指出体验是在发布会和共享设备条件下完成，长期耐久仍待验证。Tom’s Guide 的早期判断肯定顺滑、无抖动的视频和 AI 主体跟踪，同时列出低光与竖拍局限。T3 的上手文章认为云台相机很有说服力，却对它是否代表未来保持犹豫。WIRED 对 YOYO Robot Mode 的评价更保守。Reddit 讨论则集中在中国限定、是否支持 Google 服务、价格与第三方相机 API；这些是社区摩擦信号，不能替代官方规格。",
      newTech: "新技术是把机械运动直接纳入手机相机的默认交互。4-DoF 云台让镜头可以做超出传统 OIS 的姿态变化，AI subject tracking 负责把运动目标转成控制命令，ARRI Image Science 负责向专业影像工作流靠拢，YOYO Robot Mode 则把机械动作变成可理解的角色反馈。真正的产品难点在控制闭环：视觉模型要识别目标，规划器要决定跟随速度和角度，电机要在热量与电量限制内执行，系统还要在遮挡、丢失、用户触碰和旁观者环境变化时及时停止。官方没有公开模型、控制频率或安全阈值。",
      availability: "HONOR 官方称中国预订从 2026 年 8 月 12 日开始，正式销售从 8 月 18 日开始；官方给出的配置和价格是 RMB 9,999 与 RMB 12,999。官方全球产品页存在 Buy 入口，但公开材料没有确认中国以外的正式销售地区、库存、发货、保修和 Google 移动服务。WIRED 报道它目前为 China-exclusive，并指出 HONOR 在美国没有销售存在。今天可以确认中国市场产品与独立上手，不应把全球可买或开发者 API 写成已确认事实。",
      limitsOrUnknowns: "长期使用的核心未知是云台机构的跌落、灰尘、进液、口袋挤压和反复伸缩寿命；单人拍摄的关键未知是误跟踪、遮挡、多人场景目标切换、低光和竖屏构图；系统层的关键未知是第三方相机 app 是否能调用云台、YOYO 是否依赖网络、Google 服务是否存在、数据是否上传以及用户能否导出或删除训练相关记录。大体积、价格、机械噪声、发热和电池消耗也可能抵消少带一个设备的收益。所有未被官方或独立评测明确说明的数字、地区、接口和寿命，均应保持 source not stated。",
      productVerdict: "HONOR Robot Phone 是本期最强的 confirmed product：它把具身 AI 的承诺落到可见的机械动作，并且已经有中国销售、官方规格与多家独立上手。它的真实价值集中在单人拍摄和移动构图，YOYO 的人格化动作目前更像加分项，不能替代稳定的控制、停止和恢复。产品判断：机械云台与拍摄链路值得关注，AI 助手叙事需要降权；下一步优先验证第三方应用接入、长周期耐久、低光/竖屏、误跟踪恢复与全球服务边界。"
    },
    en: {
      productName: "HONOR Robot Phone is a China-launched smartphone built around embodied photography. Its retractable, movable Titanium Agile Gimbal replaces the idea of a fixed main-camera module with a physical system that can change lens direction, track a subject, and express state through motion. HONOR announced it on August 12, 2026, and official sales began on August 18; independent outlets have handled the device in China.",
      productType: "The product combines an Android smartphone, a mechanical gimbal camera, and an AI-assisted capture system. The handset still provides communication, computation, and display, while the top-mounted main camera has its own mechanical movement. HONOR describes a fully integrated 4-DoF mechanical gimbal and positions ARRI Image Science, YOYO Robot Mode, and AI-powered motion control as product pillars. Its competitive boundary touches flagship phones, pocket gimbals such as DJI Osmo Pocket, and the tripod-or-second-person workflow used by solo creators.",
      interactionFlow: "A user can open the camera like a normal phone, then let the mechanical gimbal extend and change its pose through on-screen directional control, voice, or AI subject tracking. The creator places the phone on a table, stand, or in a hand, selects a person, pet, or moving object, and lets the camera maintain a target or composition. Hands-on reports describe the gimbal rolling, turning, tracking, and using YOYO Robot Mode for expressive movement. Public evidence does not expose the complete third-party app path, pre-motion confirmation, takeover after a wrong lock, physical stop control, pinch protection, or power-loss retraction. Those control surfaces need acceptance testing before the motion is treated as trustworthy.",
      specsOrStack: "HONOR’s launch information lists 12GB+512GB and 16GB+1TB configurations priced at RMB 9,999 and RMB 12,999, and names a fully integrated 4-DoF mechanical gimbal, HONOR Titanium Agile Gimbal, AI-powered motion control, and ARRI Image Science. PetaPixel, T3, Tom’s Guide, and HardwareZone add details including a 200MP f/1.6 main camera and Snapdragon 8 Elite Gen 5, but outlets do not describe every sensor size, DoF definition, or camera combination identically, so each specification stays tied to its source. HONOR and reviewers have not fully disclosed motor model, motion range, joint life, Camera2/CameraX access, third-party application support, edge-cloud model routing, runtime, or repair cost. Unstated details remain source not stated.",
      useCases: "Concrete use cases include solo vlogging, desk livestreams, travel capture, family activities, pet tracking, sports footage, dynamic group photos, and short-form video that needs a stable moving viewpoint. A creator can place the phone at a distance and let the camera follow, reducing the need to hold a phone or carry a second pocket gimbal. A traveler can capture, edit, communicate, and publish from the same device. A casual user can treat mechanical movement as a photo cue or companion-like expression. The conventional handheld path remains available when tracking is disabled. China-only availability, service differences, and pocket bulk directly affect whether these scenarios persist beyond a demo.",
      painPointsSolved: "Robot Phone targets the solo-creation problem of needing a tripod, gimbal, or second operator for stable tracking and framing. The mechanical head can keep a person in shot and reduce shake or repeated reframing; integrating phone and gimbal also removes one device, one battery, and one file-transfer step. It does not remove lighting, audio, framing, or social friction from mobile capture. T3 is positive about stability and subject tracking while remaining uncertain about the category’s future. Tom’s Guide highlights smooth video and tracking but lists weak low-light performance and the lack of true vertical video. WIRED treats the YOYO-plus-motion layer as more gimmicky. The strongest value is camera control, not a general-purpose AI assistant.",
      userVoice: "PetaPixel calls the product finished and says the mechanical gimbal genuinely works, while noting that the experience was a launch event with shared devices rather than long-term ownership. Tom’s Guide’s early verdict praises smooth, shake-free video and AI subject tracking, while listing low-light and vertical-video limits. T3 describes a compelling gimbal camera but remains unsure whether it represents the future. WIRED is more skeptical of YOYO’s robotic-AI presentation. Reddit discussions focus on China-only availability, Google-service questions, price, and third-party camera APIs. Those are community-friction signals and do not replace official specifications.",
      newTech: "The new technology is the inclusion of mechanical motion inside the default phone-camera interaction. A 4-DoF gimbal can change pose beyond traditional optical stabilization; AI subject tracking converts a visual target into control commands; ARRI Image Science connects the device to a professional-imaging narrative; and YOYO Robot Mode turns movement into legible character feedback. The real product challenge is the control loop: vision must identify the target, a planner must choose speed and angle, motors must execute within heat and power limits, and the system must stop when occlusion, loss, touch, or bystander conditions change. HONOR has not published the model, control frequency, or safety thresholds.",
      availability: "HONOR says China pre-orders began on August 12, 2026, with official sales beginning on August 18; the company lists 12GB+512GB at RMB 9,999 and 16GB+1TB at RMB 12,999. A global product page contains a Buy entry, but public material does not confirm formal sales regions outside China, inventory, shipping, warranty, or Google Mobile Services. WIRED describes the phone as China-exclusive and notes that HONOR has no US presence. The confirmed surface today is a China-market product with independent hands-on evidence, not global availability or a public developer API.",
      limitsOrUnknowns: "The main long-term unknown is the gimbal mechanism’s resistance to drops, dust, liquid, pocket pressure, and repeated extension. Solo-capture questions include wrong tracking, occlusion, multi-person target switching, low light, and vertical framing. System questions include third-party camera access, YOYO’s network dependency, Google services, upload behavior, and export or deletion of training-related records. Bulk, price, mechanical noise, heat, and battery drain can also erase the benefit of carrying one fewer device. Any number, region, interface, or lifetime not explicitly stated by the official or independent sources remains source not stated.",
      productVerdict: "HONOR Robot Phone is the issue’s strongest confirmed product because it puts embodied-AI claims into visible mechanical action, with China sales, official product facts, and multiple independent hands-on reports. Its defensible value is solo capture and moving composition; YOYO’s personality layer is an accessory to reliable control, stop, and recovery rather than a substitute for them. Verdict: the gimbal and capture loop deserve serious attention, while the AI-assistant story should be discounted until third-party access, long-cycle durability, low-light and vertical capture, wrong-target recovery, and global service boundaries are verified."
    }
  }
};

issue.topics.unshift(rayneoIo, orbbecPhysicalAi, googleDdp, robotPhone);
issue.coverStory = {
  topicId: rayneoIo.id,
  zhTitle: "RayNeo iO：当 AI 把一天压缩成抬眼可见的状态，眼镜还是眼镜吗？",
  enTitle: "RayNeo iO: when AI compresses the day into a glance, is it still eyewear?",
  zhSummary: [
    "RayNeo iO 把 33g 透明 HUD、四麦克风、Smart Crown、头部手势和硬连线状态灯组合成日常信息入口，官方仍标记 coming soon。",
    "媒体与 beta 社区把它读作无摄像头、无扬声器的视觉优先产品：减少手机掏取与外放干扰，同时增加视觉疲劳、手机依赖和订阅边界。",
    "今天的验收点是通知/转写/记忆的状态区分、点头确认、录制可见性和断连回退，而不是 HUD 看起来有多像未来。"
  ],
  enSummary: [
    "RayNeo iO combines a 33g transparent HUD, four microphones, a Smart Crown, head gestures, and a hardwired status light for daily information; the official page still says coming soon.",
    "Media and beta-community signals describe a camera-less, speakerless, visual-first product that reduces phone reaches and sound leakage while adding visual fatigue, phone dependence, and subscription questions.",
    "The acceptance test is state separation, nod confirmation, capture visibility, and disconnect recovery—not how futuristic the HUD looks."
  ],
  imagePath: rayneoIo.visual.path,
  imageWidth: rayneoIo.visual.width,
  imageHeight: rayneoIo.visual.height,
  imageSourceUrl: rayneoIo.visual.sourceUrl,
  primarySourceUrl: rayneoIo.visual.sourceUrl,
  evidenceStrength: rayneoIo.evidenceStrength,
  whyCover: "It is a concrete near-term product that makes the HUD, the microphone, the confirmation gesture, and the capture light part of one daily control surface, while its coming-soon status keeps the evidence boundary visible."
};
issue.watchlistZh = [
  "RayNeo iO：9 月 4 日最终价格与地区、户外可读性、转写延迟、无扬声器反馈、长期记忆与订阅边界。",
  "Orbbec physical AI：EGO/UMI/WristCam/Hub 的 SDK、原始时间戳、跨场景同步、隐私授权和客户交付。",
  "Google Developer Device Platform：真实设备清单、并发/排队、计费、agent 权限、日志保留与 iOS 路线。",
  "HONOR Robot Phone：第三方 Camera2/CameraX 接入、海外服务、云台耐久、误跟踪回退与真实续航。",
  "Razer Project Motoko：Q2 developer kit 的开放范围、录制提示、模型路由、价格与量产时间。",
  "摄像头 AirPods 弱信号：是否出现 Apple 官方公告、录制指示、权限与删除路径。",
  ...issue.watchlistZh.filter((item) => !item.includes("HONOR") && !item.includes("Razer Project Motoko") && !item.includes("AirPods") && !item.includes("RayNeo") && !item.includes("Orbbec") && !item.includes("Google Developer Device Platform"))
];
issue.watchlistEn = [
  "RayNeo iO: final September 4 price and regions, outdoor readability, transcription latency, speakerless feedback, long-term memory, and subscription boundaries.",
  "Orbbec physical AI: EGO/UMI/WristCam/Hub SDK access, raw timestamps, cross-scene synchronization, privacy consent, and customer delivery.",
  "Google Developer Device Platform: physical-device inventory, concurrency/queueing, billing, agent permissions, log retention, and the iOS path.",
  "HONOR Robot Phone: third-party Camera2/CameraX access, overseas services, gimbal durability, wrong-target recovery, and real runtime.",
  "Razer Project Motoko: real Q2 developer-kit access, capture indicators, model routing, pricing, and production timing.",
  "Camera-equipped AirPods weak signal: whether Apple publishes an official announcement, recording cue, permissions, and deletion path.",
  ...issue.watchlistEn.filter((item) => !item.includes("HONOR") && !item.includes("Razer Project Motoko") && !item.includes("AirPods") && !item.includes("RayNeo") && !item.includes("Orbbec") && !item.includes("Google Developer Device Platform"))
];
issue.designDesk = {
  ...issue.designDesk,
  zhTitle: "设计台：让状态、数据和设备接管都能被审计",
  enTitle: "Design Desk: make state, data, and hardware takeover auditable",
  zhIntro: "当 AI 进入 HUD、真实设备和物理数据管道时，把状态、权限、时间戳、回放和回退放进可见的交互链路。",
  enIntro: "When AI enters HUDs, real devices, and physical-data pipelines, keep state, permission, timestamps, replay, and recovery visible in the interaction loop."
};

const nextIssues = [issue, ...issues.filter((entry) => entry.date !== date)];
await fs.writeFile(dataPath, `${JSON.stringify(nextIssues, null, 2)}\n`);
console.log(`Prepared ${date}: ${issue.topics.length} topics, ${new Set(issue.topics.flatMap((topic) => topic.sources.map((source) => source.url))).size} unique topic sources, ${new Set([issue.coverStory.imagePath, ...issue.topics.map((topic) => topic.visual.path)]).size} visuals.`);
