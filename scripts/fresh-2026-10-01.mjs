const source = (label, url, type) => ({ label, url, type });
const visual = (file, altZh, altEn, captionZh, captionEn, sourceUrl, kind = "source-backed official page screenshot") => ({
  path: "assets/" + file, width: 1600, height: 900, kind, altZh, altEn, captionZh, captionEn, sourceUrl
});
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const pad = (value, locale) => String(value) + (locale === "zh"
  ? " 页面未披露的价格、版本、地区、接口、续航、成功率、隐私或交付细节均保留为 source not stated，不从宣传语或外观推断。"
  : " Any price, version, region, interface, battery, success-rate, privacy, or shipping detail not disclosed on the cited page remains source not stated and is not inferred from marketing language or appearance.");
const makeDossier = (zh, en) => ({ zh: Object.fromEntries(fields.map((f) => [f, pad(zh[f], "zh")])), en: Object.fromEntries(fields.map((f) => [f, pad(en[f], "en")])) });
const product = (input) => ({ dossierKind: "product", ...input });

const urls = {
  snap: "https://investor.snap.com/news/news-details/2026/SPECS-Make-Computing-More-Human-with-New-Experiences-Partnerships-and-SPECS-Intelligence/default.aspx",
  snapReview: "https://www.tomsguide.com/computing/smart-glasses/snap-specs-hands-on-review",
  snapReddit: "https://www.reddit.com/r/augmentedreality/comments/1widulx/a_day_in_the_life_with_the_new_specs/",
  memomind: "https://en.prnasia.com/releases/global/memomind-one-rolls-out-new-features-and-prepares-for-a-new-stage-of-developer-access-550240.shtml",
  memomindReddit: "https://www.reddit.com/r/SmartGlasses/comments/1w4lkkm/ive_been_testing_the_memomind_one_smart_glasses/",
  metaDev: "https://developers.meta.com/blog/meta-connect-recap-ai-glasses/",
  metaToolkit: "https://developers.meta.com/blog/explore-whats-possible-with-wearables-device-access-toolkit/",
  hojo: "https://hojo.ai/",
  wuqi: "https://www.wuqi-micro.com/about-wuqi/news-and-events/newss/85"
};

const visuals = {
  snap: visual("snap-specs-first-look-official-2026-10-01.png", "Snap SPECS 上手评测截图", "Snap SPECS hands-on review screenshot", "评测视觉：Snap SPECS 的手势交互、独立计算和第一代视野/佩戴反馈；10 月 1 日 First Look 仍由官方公告确认。", "Review visual: Snap SPECS hand interaction, standalone compute, and first-generation field-of-view/wear feedback; the October 1 First Look remains confirmed by Snap's official announcement.", urls.snapReview, "source-backed review screenshot"),
  memomind: visual("memomind-one-developer-access-2026-10-01.png", "MemoMind One 第二阶段开发者访问发布页截图", "MemoMind One phase-two developer access screenshot", "公司发布：MemoMind One 的 53 语言双向翻译、BLE 配件连接、One Glass SDK 与 App Workspace beta。", "Company release: MemoMind One's 53-language translation, BLE accessory connection, One Glass SDK, and App Workspace beta.", urls.memomind, "source-backed company release screenshot"),
  meta: visual("meta-wearables-toolkit-rollout-2026-10-01.png", "Meta Wearables Device Access Toolkit 1.0 开发者页面截图", "Meta Wearables Device Access Toolkit 1.0 developer screenshot", "官方开发者视觉：移动应用、Web app、API/MCP connector 与 AI 眼镜入口。", "Official developer visual: mobile apps, web apps, API/MCP connectors, and the AI-glasses entry point.", urls.metaDev),
  hojo: visual("hojo-agenticos-startup-2026-10-01.png", "Hojo AgenticOS 产品页面截图", "Hojo AgenticOS product-page screenshot", "创业公司页面：AgenticOS 面向智能音频、AI 眼镜、capture device 与智能座舱；产品与 API 细节未充分公开。", "Startup page: AgenticOS targets smart audio, AI glasses, capture devices, and intelligent cockpits; product and API detail is not sufficiently public.", urls.hojo, "source-backed startup landing-page screenshot"),
  wuqi: visual("wuqi-wq7036-hawk-dolphin-2026-10-01.png", "物奇微 WQ7036 与 Hawk/Dolphin AI+XR 参考设计页面截图", "WUQI WQ7036 and Hawk/Dolphin AI+XR reference-design screenshot", "中国供应链官方视觉：WQ7036 异构端侧芯片与 Hawk 眼镜、Dolphin 算力单元参考设计。", "China supply-chain official visual: WQ7036 heterogeneous edge chip with Hawk glasses and Dolphin compute-unit reference designs.", urls.wuqi)
};

export const freshTopics = [
  product({
    id: "snap-specs-intelligence-first-look-2026-10-01", section: "official", sourceDate: "2026-10-01", evidenceLabel: "confirmed product",
    evidenceStrength: "Snap official announcement; October 1 First Look is a public hands-on event, while full retail and regional details remain incomplete",
    zhHeadline: "Snap SPECS：10 月 1 日开始把 AR 眼镜变成可体验的 Agent 入口",
    enHeadline: "Snap SPECS moves from announcement to an October 1 hands-on agent entry",
    zhFact: "Snap 的官方发布将 SPECS 定义为把计算硬件直接放进 AR 眼镜的产品，并宣布 10 月 1 日在洛杉矶 Westfield Century City 开始 First Look 线下体验。SPECS Intelligence 被描述为跨 iPhone、Mac 与 SPECS 眼镜工作的 anticipatory AI service；iOS preview 已开放，Mac 为 invitation-only waitlist。",
    enFact: "Snap's official announcement describes SPECS as AR glasses with computing hardware built directly into the frame and says an in-person First Look begins October 1 at Westfield Century City in Los Angeles. SPECS Intelligence is described as an anticipatory AI service spanning iPhone, Mac, and SPECS glasses; an iOS preview is available while Mac access is invitation-only.",
    zhValue: "这里的产品变化不是再加一个语音助手，而是把目标、关系、优先级与日常习惯变成跨设备上下文，再在眼前环境中给出行动入口。用户可以用手和声音操作，眼镜承担观察与反馈，手机和 Mac 继续承担更重的输入、管理与工作面。",
    enValue: "The product change is not another voice assistant. Snap frames goals, relationships, priorities, and routines as cross-device context, then puts an action entry into the wearer's surroundings. Hands and voice operate the glasses while the phone and Mac remain heavier input, management, and work surfaces.",
    zhHciLens: ["入口：语音、手部互动、眼前环境", "上下文：iPhone、Mac、眼镜与用户选择连接的应用", "反馈：AR 视野、声音与跨设备状态", "边界：预判是否越权、旁人可见性、停止与撤回"],
    enHciLens: ["Input: voice, hands, and the surrounding scene", "Context: iPhone, Mac, glasses, and selected connected apps", "Feedback: AR view, audio, and cross-device state", "Boundary: anticipation, bystander visibility, stop, and undo"],
    zhImplication: "SPECS 的体验验收应围绕‘它为什么现在主动出现’展开：系统要显示使用了哪些习惯、哪些连接、哪一项行动被建议，以及用户怎样关闭某类预判。线下 First Look 可以验证视野、手势和反馈节奏，却不能替代长期佩戴、隐私和后台任务验证。",
    enImplication: "SPECS should be evaluated around why the system decided to appear now: what routine, connection, or goal triggered the suggestion and how the user disables a class of anticipation. A First Look can test field of view, gestures, and feedback timing; it cannot replace long-wear, privacy, or background-task validation.",
    visual: visuals.snap,
    sources: [source("Snap official SPECS announcement", urls.snap, "official"), source("Tom's Guide SPECS hands-on review", urls.snapReview, "reviews"), source("SPECS hands-on community post", urls.snapReddit, "community")],
    dossier: makeDossier({
      productName: "Snap SPECS 与 SPECS Intelligence 是 Snap 的 AR 眼镜和跨设备 anticipatory AI service。官方把它定位为把计算硬件直接做进眼镜的 AI-native operating system 产品，而不是必须连接 puck 的显示附件。",
      productType: "产品类型是带 AR 视野、自然交互和跨设备 AI 服务的智能眼镜。SPECS 让用户通过手和声音完成沟通、工作、购物、翻译、导航、学习与健身等任务；SPECS Intelligence 负责理解 goals、priorities、relationships 和 routines，并把建议或行动放回 iPhone、Mac 与眼镜之间。",
      interactionFlow: "用户先在 iPhone 或 Mac 的 preview/waitlist 入口连接可选应用与个人目标，再通过眼镜中的手势、声音或环境上下文触发任务。官方描述的动作包括在视野中获得数字信息、保持抬头工作、沟通、购物和导航；First Look 的实机步骤、错误提示、确认层、后台通知、停止、撤销和多用户切换仍未完整公开。",
      specsOrStack: "官方明确披露 computing hardware built directly into the glasses without a puck or tether、AI-native operating system、hand and voice interaction、跨 iPhone/Mac/SPECS 的 SPECS Intelligence，以及配套 SPECS Charging Case with Cellular。AR 显示规格、芯片、摄像头、麦克风、重量、续航、连接协议、模型版本和数据保留均为 source not stated。",
      useCases: "具体场景包括在走动中接收导航、在不拿出手机时完成沟通、在购物或学习时让 AI 结合眼前环境提供信息、在工作中用眼镜获取提醒或上下文，以及把一个跨设备目标交给 anticipatory service。它适合低摩擦、短反馈、环境连续的任务，不足以证明复杂工作能在眼镜端独立闭环。",
      painPointsSolved: "它针对手机掏出、应用切换、低头看屏幕和在移动中重复解释上下文的摩擦。通过眼镜承担观察和即时反馈，手机/Mac 承担设置与较重工作，用户可以保持 heads-up。新的痛点是系统可能过度主动、旁人无法知道何时被观察、用户难以判断建议来自哪一项习惯，以及没有清晰撤销会把便利变成失控。",
      userVoice: "社区体验帖主要讨论 SPECS 的视野、算力与手势潜力，也有人指出 SoC、micro-display 与电量预算会直接约束体验；这些是 early hands-on/community signals，不是独立测评，也不是对续航、舒适度或识别成功率的确认。",
      newTech: "新技术信号是把 anticipatory intelligence 做成跨设备服务，让眼镜不只在被唤醒后回答，还能基于目标和日常关系主动提供下一步。硬件上则把计算直接放进眼镜，减少外接 puck；这会把热、续航、隐私指示与后台授权同时推到产品表面。",
      availability: "Snap 官方称 iOS preview available today，Mac 为 invitation-only waitlist；SPECS First Look 从 2026 年 10 月 1 日起在洛杉矶 Westfield Century City 提供线下体验。公开发布没有给出本次来源所需的完整零售价、正式发售日、地区名单和普通用户购买路径。",
      limitsOrUnknowns: "未知包括显示类型与视场角、相机和麦克风状态、芯片与端云分工、续航、充电盒容量、应用连接权限、模型/记忆删除、预判错误率、后台执行、旁人提示、家庭成员与企业账户隔离。First Look 证明可体验入口存在，不能证明量产交付或长期可靠性。",
      productVerdict: "SPECS 是 confirmed product，今天的关键节点是从发布叙事进入实机体验。产品判断：它把眼镜从‘手机的外围’推向跨设备 Agent 的第一视图，但真正的竞争力要由可解释的主动性、可见的摄录状态、可撤销的行动与长期佩戴稳定性决定。"
    }, {
      productName: "Snap SPECS and SPECS Intelligence are Snap's AR glasses and cross-device anticipatory AI service. Snap positions the system as an AI-native operating-system product with computing hardware inside the glasses, rather than display eyewear that depends on a tethered puck.",
      productType: "The product is smart eyewear with an AR view, natural interaction, and an AI service spanning devices. SPECS supports communication, work, shopping, translation, navigation, learning, and fitness through hands and voice; SPECS Intelligence understands goals, priorities, relationships, and routines across iPhone, Mac, and the glasses.",
      interactionFlow: "A user connects selected apps and goals through the iPhone preview or Mac waitlist, then starts a task with voice, hands, or the surrounding scene. Snap describes digital information, communication, shopping, work, and navigation in the view. First Look material does not yet fully show error states, confirmations, background notices, stop, undo, or multi-user switching.",
      specsOrStack: "Snap explicitly says the computing hardware is built directly into the glasses without a puck or tether, with an AI-native operating system, hand and voice interaction, SPECS Intelligence across iPhone/Mac/glasses, and a SPECS Charging Case with Cellular. Display technology, field of view, chips, cameras, microphones, weight, battery, protocols, model version, and retention are source not stated.",
      useCases: "Concrete uses include receiving navigation while walking, communicating without taking out a phone, asking for contextual help while shopping or learning, receiving work prompts, and delegating a cross-device goal to the anticipatory service. The shape suits low-friction, short-feedback, context-continuous tasks; it does not prove that complex work closes independently on the glasses.",
      painPointsSolved: "SPECS targets pulling out a phone, switching apps, looking down, and repeatedly restating context while moving. The glasses handle observation and immediate feedback while the phone and Mac handle setup and heavier work. New pain includes over-eager automation, bystanders not knowing when they are observed, opaque triggers, and missing undo that turns convenience into loss of control.",
      userVoice: "Community posts focus on SPECS field of view, compute, and gesture potential, while also noting that SoC, micro-display, and power budgets constrain the experience. These are early hands-on and community signals, not independent testing and not confirmation of battery, comfort, or recognition success.",
      newTech: "The new technology signal is anticipatory intelligence as a cross-device service: the glasses can surface a next step from goals and routines instead of responding only after a wake command. Putting compute into the glasses also removes the external puck, but pushes heat, battery, privacy indicators, and background authority into the visible product layer.",
      availability: "Snap says an iOS preview is available today and Mac access is an invitation-only waitlist. SPECS First Look begins October 1, 2026 at Westfield Century City in Los Angeles. The reviewed announcement does not provide a complete retail price, general launch date, full regional list, or ordinary purchase path.",
      limitsOrUnknowns: "Open questions include display and field of view, camera and microphone indicators, chip and edge/cloud split, battery, charging-case capacity, connector permissions, model and memory deletion, anticipation error rate, background execution, bystander notice, and household or enterprise isolation. First Look proves a hands-on entry, not mass delivery or long-term reliability.",
      productVerdict: "SPECS is a confirmed product whose October 1 milestone moves it from announcement narrative toward direct experience. Verdict: it makes glasses a first view for a cross-device Agent, but the real product advantage depends on explainable anticipation, visible capture state, reversible actions, and stable all-day wear rather than the existence of an AR demo."
    })
  }),
  product({
    id: "memomind-one-developer-access-2026-10-01", section: "china", sourceDate: "2026-09-30", evidenceLabel: "developer surface",
    evidenceStrength: "MemoMind/XGIMI company release carried by PR Newswire; developer access is staged and the closed beta is not general availability",
    zhHeadline: "MemoMind One：从功能更新进入第二阶段开发者访问",
    enHeadline: "MemoMind One opens a second developer-access phase around its glasses stack",
    zhFact: "MemoMind 在 9 月 30 日公布 One Glass SDK、BLE 配件连接、53 语言双向翻译和个性化信息流，并宣布 10 月 App Workspace 进入 closed beta。页面说开发者将获得真实设备测试和 seed-app 机会，但没有把 beta 描述成开放商店或稳定生产 API。",
    enFact: "On September 30, MemoMind announced a One Glass SDK, BLE accessory connections, two-way translation across 53 languages, and personalized information feeds, while saying App Workspace will enter closed beta in October. The release frames this as invited real-device testing and seed-app work, not an open store or stable production API.",
    zhValue: "它把 AI 眼镜的竞争从‘功能列表’推进到‘第三方能否在眼镜自身能力上构建’。HUD、mic、speaker、gyro 加上 BLE ring 让输入输出不再只依赖手机；但闭 beta 的存在也说明平台是否可持续、权限是否完整、应用能否被发现都还未验证。",
    enValue: "The signal moves competition from a feature list toward whether third parties can build on the glasses' own capabilities. HUD, mic, speaker, gyro, and BLE rings broaden input and output beyond the phone, while the closed beta shows that platform durability, permissions, discovery, and distribution are still unproven.",
    zhHciLens: ["入口：眼镜 HUD、声音、BLE ring、手机 app", "上下文：翻译、新闻、连接控制与个人偏好", "动作：开发者写入眼镜能力与 seed app", "边界：beta 审核、权限、设备差异与数据流"],
    enHciLens: ["Input: HUD, audio, BLE ring, and phone app", "Context: translation, news, connected controls, and preferences", "Action: developers write against glass capabilities and seed apps", "Boundary: beta review, permissions, device variance, and data flow"],
    zhImplication: "开发者入口必须同时展示设备状态、传感器权限、实时反馈、异常降级和用户撤回；如果 SDK 只暴露能力、不暴露失败与隐私状态，第三方应用会把系统复杂性转移给佩戴者。",
    enImplication: "The developer surface must expose device state, sensor permissions, feedback timing, degraded modes, and user undo. If the SDK exposes capabilities without failure and privacy state, third-party apps simply push system complexity onto the wearer.",
    visual: visuals.memomind,
    sources: [source("MemoMind One developer-access release", urls.memomind, "china"), source("MemoMind One community review", urls.memomindReddit, "community")],
    dossier: makeDossier({
      productName: "MemoMind One 是极米孵化品牌 MemoMind 的 AI 眼镜与开发者平台更新。9 月 30 日的发布重点不是新硬件，而是把 One Glass SDK、BLE 配件和 App Workspace beta 接到现有眼镜上。",
      productType: "产品类型是带 HUD、mic、speaker、gyro 的 AI 眼镜，以及围绕它建立的应用和配件开发表面。品牌同时更新双向翻译、个性化新闻、connected controls 与更多个人化能力；App Workspace 让受邀开发者做 seed app，而不是直接面向所有用户开放的应用商店。",
      interactionFlow: "用户可以通过眼镜的 HUD、扬声器和麦克风获得翻译、信息与控制反馈，并用 BLE smart ring 等配件补充输入；开发者在 One Glass SDK 上构建应用，再通过 App Workspace 进行真实设备测试。发布页没有完整说明应用安装、审核、权限提示、后台运行、冲突处理、删除数据和用户切换流程。",
      specsOrStack: "公司公开列出 One Glass SDK 可使用 HUD、mic、speaker、gyro，并支持 BLE smart rings and similar devices 直接连接 One Glass；软件更新提到 53 languages 的 two-way translation。模型、芯片、显示亮度、摄像头、传输协议、SDK 版本、权限 API、日志、功耗、价格与 SLA source not stated。",
      useCases: "具体场景包括面对面翻译、个性化新闻播报、通过配件做低打扰控制、让眼镜应用读取或输出 HUD/声音/陀螺仪状态，以及让早期开发者在真实设备上测试 seed app。对产品团队来说，价值是验证眼镜原生交互；对用户来说，应用质量和权限透明度仍取决于 beta 规则。",
      painPointsSolved: "它解决 AI 眼镜只能由厂商预装功能、开发者没有真实设备和传感器入口、用户输入必须回到手机的问题。SDK 和 BLE 配件能扩大交互面；但应用质量、设备兼容、耗电、持续监听与数据归属会成为新的风险，闭 beta 也意味着发现和安装路径还不稳定。",
      userVoice: "社区评测认为 MemoMind One 的硬件做工和 app 体验有吸引力，也有用户持续比较视觉输入、显示需求和可扩展性；这些是个体体验与社区摩擦，不足以推导普遍可用性、续航或开发者生态规模。",
      newTech: "新技术信号是把眼镜自身的 HUD、mic、speaker、gyro 作为 SDK 能力，同时让 BLE ring 成为输入扩展，并把第三方应用从概念页带到 real-device testing。真正的技术门槛不是再接一个模型，而是管理传感器权限、设备状态、低带宽反馈、断连和应用级安全。",
      availability: "公司称第二阶段 developer access 已公布，App Workspace 将在 10 月进入 closed beta，首批受邀 builders 可做真实设备测试和 seed-app development。普通开发者、公开下载、正式商店、SDK 稳定版和地区资格均未在来源中确认。",
      limitsOrUnknowns: "未知包括 SDK 文档完整度、应用审核、签名与分发、HUD/音频并发、BLE 安全、传感器采样、数据留存、断网降级、后台权限、应用卸载、用户隐私指示和设备批次差异。发布中的 53 语言能力与开发者 beta 证明方向，不证明所有语言和应用都达到同一质量。",
      productVerdict: "MemoMind One 是 developer surface，亮点是把眼镜从封闭功能集合推进为可试用的平台；产品判断：它值得观察真实设备 SDK 的权限与失败设计。若 App Workspace 只提供能力、不提供审计和撤回，生态扩张会把风险放大到佩戴者和旁人。"
    }, {
      productName: "MemoMind One is MemoMind's AI glasses plus a staged developer platform. The September 30 release focuses on connecting a One Glass SDK, BLE accessories, and an App Workspace beta to the existing glasses rather than announcing a new frame.",
      productType: "It is eyewear with a HUD, microphone, speaker, and gyroscope, surrounded by an application and accessory surface. The company also updated two-way translation, personalised news, connected controls, and personalisation. App Workspace is for invited builders and seed apps, not a fully open consumer app store.",
      interactionFlow: "A wearer receives translation, information, and control feedback through the HUD, speaker, and microphone, with a BLE smart ring or similar accessory adding another input. Developers build against the One Glass SDK and use App Workspace for real-device testing. The release does not fully document installation, review, permissions, background work, conflict handling, data deletion, or user switching.",
      specsOrStack: "MemoMind names HUD, mic, speaker, and gyro as One Glass SDK capabilities and says BLE smart rings and similar devices can connect directly to One Glass. The update also names two-way translation across 53 languages. Model, chip, display brightness, camera, transport protocol, SDK version, permission API, logs, power, price, and SLA are source not stated.",
      useCases: "Concrete uses include face-to-face translation, personalised news, low-interruption controls through an accessory, and apps that read or write HUD, audio, and motion state. Early builders can test seed apps on real hardware. The value for product teams is testing native eyewear interaction; for users, app quality and permission clarity still depend on the beta rules.",
      painPointsSolved: "The platform addresses glasses that expose only vendor-built features, developers lacking real hardware and sensor access, and input that always falls back to a phone. An SDK and BLE accessories widen the interaction surface. They also create new risks around app quality, compatibility, battery, continuous listening, and data ownership, while the closed beta leaves discovery and installation unsettled.",
      userVoice: "Community reviews describe appealing hardware build and app polish, while users continue to compare the value of visual input, display needs, and extensibility. These are individual experiences and friction signals, not proof of universal availability, battery life, or ecosystem scale.",
      newTech: "The technology signal is exposing HUD, mic, speaker, and gyro as SDK capabilities, adding BLE rings as an input extension, and moving third-party work into real-device testing. The difficult part is not adding another model; it is managing sensor permissions, device state, low-bandwidth feedback, disconnects, and app-level safety.",
      availability: "MemoMind says the second developer-access phase is announced and App Workspace will enter closed beta in October, with invited builders testing on real devices and developing seed apps. General developer access, public downloads, a formal store, a stable SDK, and regional eligibility are not confirmed by the cited release.",
      limitsOrUnknowns: "Open questions include SDK completeness, review, signing and distribution, HUD/audio concurrency, BLE security, sampling, retention, offline fallback, background permissions, uninstall, privacy indicators, and hardware-batch variance. The 53-language claim and the developer beta establish direction, not equal quality across every language or app.",
      productVerdict: "MemoMind One is a developer surface whose significance is opening a previously closed glasses feature set to real-device experimentation. Verdict: watch the SDK's permission and failure design. If App Workspace exposes capabilities without audit and undo, ecosystem growth will amplify risk for wearers and bystanders.",
    })
  }),
  product({
    id: "meta-wearables-toolkit-rollout-2026-10-01", section: "global", sourceDate: "2026-09-30", evidenceLabel: "developer surface",
    evidenceStrength: "Meta official developer recap; Toolkit 1.0 is stable after preview, with several discovery and connector surfaces still rolling out",
    zhHeadline: "Meta Wearables Toolkit 1.0：AI 眼镜开始接受 Web app 与 MCP connector",
    enHeadline: "Meta Wearables Toolkit 1.0 turns AI glasses into a web and connector surface",
    zhFact: "Meta 开发者博客称 Wearables Device Access Toolkit 1.0 在开发者预览一年后正式稳定，并从 9 月 30 日开始 rollout。开发者可以让已有移动 app 保留逻辑、让眼镜成为 hands-free front end，也可以用 Web app 或 API/MCP connector 接入 Meta AI，部分发现入口仍标为 coming soon。",
    enFact: "Meta's developer recap says Wearables Device Access Toolkit 1.0 is now stable after a year in preview, with updates beginning to roll out September 30. Existing mobile apps can keep their logic while glasses become a hands-free front end; web apps and API/MCP connectors are also paths, although discovery surfaces are still marked as coming soon.",
    zhValue: "这降低了做眼镜体验的入口门槛：团队不必先学一套完全陌生的原生框架，可以从移动端、Web 或服务 API 延伸到眼镜。真正的产品变化是把‘眼镜 app’变成多种接入层，代价是权限、设备状态和跨面审计需要统一。",
    enValue: "The surface lowers the entry cost for building glasses experiences: teams can extend a mobile app, web property, or service API rather than starting with a wholly unfamiliar native stack. The product shift is multiple entry paths into the glasses, with a corresponding need for unified permissions, device state, and cross-surface audit.",
    zhHciLens: ["入口：mobile app、Web app、API/MCP connector", "上下文：AI 眼镜设备状态与 Meta AI", "动作：服务定义 actions，Meta AI 调用", "边界：授权、发现、设备 mock、数据回传"],
    enHciLens: ["Input: mobile app, web app, API/MCP connector", "Context: device state and Meta AI", "Action: services define actions that Meta AI can call", "Boundary: authorization, discovery, mock devices, data return"],
    zhImplication: "开发者体验的核心不是‘能不能连上’，而是用户能否知道一个 connector 何时被调用、它拿到什么、动作写入哪里、怎样撤销。Mock Device Kit 对原型有帮助，但必须与真实摄像头、权限、网络和功耗差异并列显示。",
    enImplication: "The developer experience is not only whether a connector works; users need to know when it was called, what it received, what it changed, and how to undo it. Mock Device Kit helps prototyping, but its differences from real cameras, permissions, networks, and power must remain visible.",
    visual: visuals.meta,
    sources: [source("Meta developer recap", urls.metaDev, "official"), source("Wearables Toolkit preview details", urls.metaToolkit, "developer surface")],
    dossier: makeDossier({
      productName: "Meta Wearables Device Access Toolkit 1.0 是面向 AI 眼镜的稳定开发者表面。它让已有移动 app 复用逻辑，也让 Web app 与服务 API/MCP connector 成为接入 Meta AI 和眼镜的路径。",
      productType: "产品类型是设备访问 SDK、Mock Device Kit、Web app/发现入口和 API/MCP connector 组合，不是单独一款眼镜。官方博客强调移动 app 可以保留业务逻辑，眼镜作为 hands-free front end；服务则通过 API 或 MCP 定义 actions，让 Meta AI 在用户需要时调用。",
      interactionFlow: "开发者选择移动、Web 或 connector 路径，使用 Toolkit 访问设备状态、媒体流、权限和交互能力，再将服务 action 暴露给 Meta AI。用户从眼镜、Web 或移动端触发任务，Meta AI 代为调用 connector；官方没有完整展示每次调用前的用户确认、敏感参数、失败回退、操作撤销和历史审计。",
      specsOrStack: "Meta 公开提到 Toolkit 1.0、Mock Device Kit、媒体 streaming、permissions、device state changes、Web apps、API/MCP connector 与 Meta AI。博客还称 Web app 可在 Meta Ray-Ban Display glasses 上运行而不需要 native app 或 separate SDK。具体 API 版本、支持设备、数据格式、延迟、费用、区域和企业控制 source not stated。",
      useCases: "场景包括把已有 mobile app 做成免手入口、让 Web 服务在眼镜端被发现、将电商或工作服务定义成 Meta AI 可调用的 action，以及使用模拟设备在没有硬件时测试权限和状态变化。它适合把眼镜当作现有服务的 front end，不等于所有服务都适合在视野和语音中执行。",
      painPointsSolved: "它解决开发团队面对专有设备 SDK、硬件不可得、原生 app 重写和分发困难的问题。多路径接入能缩短从服务到可体验原型的时间；但也会产生 action 语义不一致、用户不清楚调用链、Web 与原生能力差异、账号和隐私边界不一致等新摩擦。",
      userVoice: "本轮没有足够的独立长测评价 Toolkit 1.0 的稳定性或真实应用成功率；官方开发者材料是主要证据。早期 Toolkit 预览资料中出现 Mock Device Kit 和 voice/Wi-Fi direct 等仍在开发中的能力，因此不能把所有预览路径都当成 1.0 已稳定交付。",
      newTech: "新技术信号是把 AI 眼镜变成 connector surface：服务方提供 action，Meta AI 负责在上下文中选择调用；同时 Web app 不必绑定独立原生 SDK。它把设备能力从‘装一个 app’转成‘让已有服务获得可调用动作’，但必须补齐权限、动作预览、撤销和审计。",
      availability: "Meta 称 Toolkit 1.0 在 2026 年 9 月 24 日开发者回顾中正式发布，相关更新从 9 月 30 日开始 rollout。API/MCP connector 可申请 early access，Web app 和新的 discovery surfaces 有 coming soon 描述；具体账户资格、设备范围和地区需按实际开发者账号核对。",
      limitsOrUnknowns: "未知包括 1.0 的完整 API、权限模型、硬件支持矩阵、Web app 的输入输出限制、connector 的敏感动作确认、日志、调用费用、离线行为、用户数据留存和企业管理员控制。Mock Device Kit 只能验证部分交互，不足以证明真实眼镜的摄像头、网络、热与续航。",
      productVerdict: "这是 developer surface，价值在于把 AI 眼镜从封闭原生生态拉向移动、Web、API 和 MCP 的组合入口。产品判断：开发门槛下降了，但责任边界更分散；Meta 若不把 action 调用、权限与撤销做成用户可见状态，connector 越多，越难解释谁在替用户做事。"
    }, {
      productName: "Meta Wearables Device Access Toolkit 1.0 is a stable developer surface for AI glasses. It lets existing mobile apps keep their logic, while web apps and API/MCP connectors become additional paths into Meta AI and eyewear.",
      productType: "It is a combination of a device-access SDK, Mock Device Kit, web and discovery surfaces, and API/MCP connectors rather than a separate glasses product. Meta says mobile apps can keep their business logic while glasses become a hands-free front end; services define actions that Meta AI can call.",
      interactionFlow: "A developer chooses mobile, web, or connector integration, uses the Toolkit for device state, media streaming, permissions, and interaction, and exposes service actions to Meta AI. A wearer starts a task from glasses, web, or mobile and Meta AI calls the connector. The blog does not fully show confirmation, sensitive parameters, failure fallback, undo, or audit history for every call.",
      specsOrStack: "Meta names Toolkit 1.0, Mock Device Kit, media streaming, permissions, device-state changes, web apps, API/MCP connectors, and Meta AI. The recap says web apps can run on Meta Ray-Ban Display glasses without a native app or separate SDK. Exact API version, supported devices, data formats, latency, cost, regions, and enterprise controls are source not stated.",
      useCases: "Concrete uses include turning a mobile app into a hands-free entry, making a web service discoverable on glasses, defining an e-commerce or work action for Meta AI, and testing permissions and state changes with a simulated device before hardware access. It suits extending existing services into eyewear; it does not mean every service is appropriate for voice and field-of-view execution.",
      painPointsSolved: "The toolkit addresses proprietary device SDKs, scarce hardware, native rewrites, and distribution friction. Multiple paths shorten the journey from service to prototype, but create new friction around action semantics, opaque call chains, web/native differences, account boundaries, and inconsistent privacy rules.",
      userVoice: "This run found no independent long-term test strong enough to establish Toolkit 1.0 stability or real-app success rates; Meta's developer material is the primary evidence. Preview material described Mock Device Kit and voice/Wi-Fi direct as still under development, so every preview path should not be treated as a stable 1.0 delivery.",
      newTech: "The technology signal is treating AI glasses as a connector surface: services provide actions and Meta AI selects calls in context, while web apps avoid a separate native SDK. That changes the unit of integration from installing an app to exposing callable actions, which requires permission, action preview, undo, and audit as platform primitives.",
      availability: "Meta announced Toolkit 1.0 in its September 24 developer recap and says related updates began rolling out September 30, 2026. API/MCP connector access is available through an early-access path, while some web and discovery surfaces are described as coming soon. Exact account eligibility, device coverage, and region should be checked in the developer account.",
      limitsOrUnknowns: "Open questions include the complete 1.0 API, permission model, hardware matrix, web input/output limits, confirmation for sensitive connector actions, logs, call costs, offline behaviour, data retention, and enterprise administration. Mock Device Kit tests only part of the interaction and cannot prove real camera, network, thermal, or battery behaviour.",
      productVerdict: "This is a developer surface whose value is pulling AI glasses toward a combination of mobile, web, API, and MCP entry points. Verdict: development gets easier while responsibility becomes more distributed. Without user-visible action calls, permission, and undo, more connectors make it harder to explain who acted for the user.",
    })
  }),
  product({
    id: "hojo-agenticos-startup-2026-10-01", section: "wild", sourceDate: "2026-10-01", evidenceLabel: "startup signal",
    evidenceStrength: "Hojo landing page only; startup/product signal with no independent review, public API documentation, or confirmed shipping surface",
    zhHeadline: "Hojo AgenticOS：把智能硬件的 Agent 能力做成品牌可嵌入的系统层",
    enHeadline: "Hojo AgenticOS pitches a brandable agent layer for intelligent hardware",
    zhFact: "Hojo 的公开页面把 AgenticOS 描述为面向 smart audio、AI glasses、capture devices 与 intelligent cockpits 的 voice、multimodal intelligence、long-term memory 和 action layer。页面强调 partner branding 与 device-specific capabilities，但没有给出可下载 SDK、公开 API、硬件名单或交付客户。",
    enFact: "Hojo's public page describes AgenticOS as a layer for smart audio, AI glasses, capture devices, and intelligent cockpits, combining voice, multimodal intelligence, long-term memory, and action. It highlights partner branding and device-specific capabilities, but does not provide a public SDK, API, hardware list, or named shipping customer.",
    zhValue: "创业信号的价值在于它把‘每个硬件都重新做一套 Agent’改写成可移植的中间层。若成立，设备品牌可以保留外观与场景，Hojo 负责记忆、调用与行为编排；风险是系统层隐藏得越深，用户越难知道数据归谁、动作由谁批准、换设备是否还能带走上下文。",
    enValue: "The startup signal reframes the problem from every hardware brand rebuilding an Agent to a portable middle layer. If real, a device maker could own the form factor and scenario while Hojo supplies memory, calls, and orchestration. The risk is that the deeper the system layer is hidden, the harder it is to know who owns data, who approves actions, and whether context travels with the user.",
    zhHciLens: ["入口：语音、多模态设备能力、品牌入口", "上下文：跨设备记忆与 device-specific capability", "动作：Agent 调用硬件与服务", "边界：供应商身份、数据迁移、权限与退出"],
    enHciLens: ["Input: voice, multimodal device capability, branded entry", "Context: cross-device memory and device-specific capability", "Action: Agent calls hardware and services", "Boundary: vendor identity, data portability, authority, exit"],
    zhImplication: "评估这类平台不能只看 demo。要追问记忆是否可导出、设备厂商能否审计、用户能否停止每类动作、模型和服务能否替换、断网时系统如何退化，以及 partner branding 是否让用户误以为 Agent 完全由硬件品牌负责。",
    enImplication: "This kind of platform must be evaluated beyond a demo. Ask whether memory is exportable, whether the device maker can audit calls, whether users can stop each action class, whether models and services can be replaced, how offline degradation works, and whether partner branding hides responsibility.",
    visual: visuals.hojo,
    sources: [source("Hojo AgenticOS landing page", urls.hojo, "wild")],
    dossier: makeDossier({
      productName: "Hojo AgenticOS 是 Hojo 页面提出的面向智能硬件的 AgenticOS / middleware 概念，覆盖 smart audio、AI glasses、capture devices 与 intelligent cockpits。当前证据来自创业公司公开页面，不能等同于已交付的消费产品。",
      productType: "产品类型是可被硬件品牌嵌入或联合品牌化的 Agent 软件层，承诺提供 voice、multimodal intelligence、long-term memory 与 action。页面写到 partner branding、product visuals 和 device-specific capabilities，但未展示具体硬件、SDK 下载、API 文档或可独立购买的终端。",
      interactionFlow: "预期流程是用户从合作品牌设备发起声音或多模态请求，Agent 结合长期记忆与设备能力规划动作，再调用硬件或外部服务完成任务。公开页面没有展示授权、记忆检索、动作预览、用户确认、失败恢复、跨设备迁移或退出 Hojo 的实际界面，因此这里只能记录为产品形态信号。",
      specsOrStack: "页面披露的栈只有 voice、multimodal intelligence、long-term memory、action、partner branding 与 device-specific capabilities。模型、端云分工、运行时、芯片、传感器、协议、存储、数据驻留、SDK/API、延迟、成本、日志和权限机制 source not stated。",
      useCases: "潜在场景包括让 AI 耳机处理语音与环境上下文、让 AI 眼镜调用摄像头和音频能力、让 capture device 做记录与回顾、让座舱 Agent 关联车内服务。由于没有公开客户、硬件或任务演示，以上是页面指向的适用范围，不是已验证的实际使用案例。",
      painPointsSolved: "它瞄准硬件品牌重复搭建语音、记忆、工具调用和跨设备上下文的成本，也试图让 Agent 随品牌与设备形态扩展。平台化可能缩短产品接入时间；同时会制造新的供应商锁定、记忆归属、品牌责任、模型替换与退出成本。",
      userVoice: "本轮没有找到独立评测、真实用户评论、公开客户案例或社区故障报告。Hojo 页面是 startup signal，不能用来证明模型质量、设备兼容、量产、隐私合规或长期记忆真的可用。",
      newTech: "新技术信号在系统抽象：把 Agent 能力从单个设备中抽离，作为可换硬件、可加品牌与可接入设备能力的中间层。真正需要验证的创新不是‘有记忆’，而是记忆、权限、动作和设备身份能否在不同硬件之间保持可理解、可审计、可撤回。",
      availability: "Hojo 页面提供品牌与产品概念入口，但没有公开价格、下载、开发者注册、硬件合作名单、发布日期或销售渠道。当前只能标为 startup signal / weak product surface，不能写成已上市 AgenticOS。",
      limitsOrUnknowns: "未知包括是否有真实部署、合作方能否看见和删除数据、记忆是否可导出、设备更换是否保留上下文、动作是否需要确认、断网如何工作、供应商是否能读取原始音视频、模型能否替换、如何计费以及如何退出。",
      productVerdict: "Hojo 是 startup signal，不是确认交付的产品。产品判断：它提出了一个值得跟踪的 middleware 方向，真正的验证门槛是公开 SDK/API、命名客户、可审计权限、可导出记忆、可撤销动作和设备实测；在这些证据出现前，不应把页面承诺写成市场事实。"
    }, {
      productName: "Hojo AgenticOS is a middleware or AgenticOS concept presented by Hojo for smart audio, AI glasses, capture devices, and intelligent cockpits. The current evidence is a startup landing page and must not be treated as a shipped consumer product.",
      productType: "It is a brandable software layer intended to provide voice, multimodal intelligence, long-term memory, and action across partner hardware. The page mentions partner branding, product visuals, and device-specific capabilities, but does not show a concrete device, downloadable SDK, public API documentation, or independently purchasable endpoint.",
      interactionFlow: "The implied flow is that a user starts a voice or multimodal request from a partner device, the Agent combines long-term memory with device capabilities, then calls hardware or an external service. The public page does not show authority, memory retrieval, action preview, confirmation, failure recovery, cross-device migration, or exit from Hojo, so this remains a product-shape signal.",
      specsOrStack: "The disclosed stack is limited to voice, multimodal intelligence, long-term memory, action, partner branding, and device-specific capabilities. Models, edge/cloud split, runtime, chips, sensors, protocols, storage, residency, SDK/API, latency, cost, logs, and permissions are source not stated.",
      useCases: "Potential scenarios include voice and scene context in AI earbuds, camera and audio actions in glasses, capture and recall in a recording device, and car-service orchestration in a cockpit. With no named customer, hardware, or task demo, these are the page's stated opportunity areas rather than verified deployments.",
      painPointsSolved: "The pitch targets hardware brands repeatedly rebuilding voice, memory, tool calls, and cross-device context, while letting an Agent travel across branded form factors. A platform could shorten integration; it also creates vendor lock-in, memory ownership, brand responsibility, model replacement, and exit costs.",
      userVoice: "This run found no independent review, user comment, named customer case, or community failure report. Hojo is a startup signal and cannot prove model quality, device compatibility, production, privacy compliance, or usable long-term memory.",
      newTech: "The technology signal is the system abstraction: Agent capability is separated from one device and offered as a layer that can add brands and device-specific skills. The real innovation to verify is not the word memory, but whether memory, authority, action, and device identity stay understandable, auditable, and reversible across hardware.",
      availability: "Hojo provides a brand and product-concept entry point, but no public price, download, developer signup, partner list, launch date, or sales channel. It must remain a startup signal and weak product surface, not an announced AgenticOS shipment.",
      limitsOrUnknowns: "Open questions include real deployments, partner access to deletion and audit, memory export, context portability when devices change, action confirmation, offline mode, raw audio and video access, model replacement, pricing, and exit. The page leaves each of these source not stated.",
      productVerdict: "Hojo is a startup signal, not a confirmed delivery. Verdict: the middleware direction is worth tracking, but the validation gate is a public SDK/API, named customers, auditable authority, exportable memory, reversible actions, and device testing. Until those appear, the landing-page promise is not market fact."
    })
  }),
  product({
    id: "wuqi-wq7036-hawk-dolphin-2026-10-01", section: "china", sourceDate: "2026-09", evidenceLabel: "confirmed product",
    evidenceStrength: "WUQI Micro official event report; reference-design and supply-chain claim, not independent proof of every downstream brand deployment",
    zhHeadline: "物奇微 WQ7036：AI 眼镜开始以芯片与算力单元组合扩展生态",
    enHeadline: "WUQI WQ7036 pairs an edge chip with Hawk glasses and Dolphin compute references",
    zhFact: "物奇微官方活动稿介绍其 WQ7036 系列与移远 Hawk AI+AR 眼镜、Dolphin 算力单元的参考设计，并给出 Snapdragon AR1 + WQ7036 与 ARS45 + WQ7036 两条光波导架构选型。官方还称 WQ7036 已应用于十多个品牌，但该数量与下游交付需继续独立核实。",
    enFact: "WUQI Micro's event report describes WQ7036 with Quectel's Hawk AI+AR glasses and Dolphin compute-unit reference designs, including Snapdragon AR1 plus WQ7036 and ARS45 plus WQ7036 waveguide options. WUQI also says the chip family is used by more than ten brands; that downstream count still needs independent verification.",
    zhValue: "这条中国供应链信号把 AI 眼镜的产品竞争拉到参考设计层：品牌可以在光学、算力、交互和场景之间选组合，而不是每家从芯片开始重做。对体验设计而言，重要的是端侧 NPU、ISP、DSP 与摄像头/麦克风反馈是否真的能形成低延迟闭环。",
    enValue: "The China supply-chain signal shifts competition toward reference-design composition: brands can choose combinations of optics, compute, interaction, and scenario rather than rebuilding from a chip. For HCI, the question is whether the edge NPU, ISP, DSP, camera, and microphone actually close a low-latency loop.",
    zhHciLens: ["入口：AI+AR 眼镜、算力单元与手机/云", "上下文：视觉、音频、运动与端侧推理", "动作：采集、识别、翻译、反馈", "边界：热、电量、隐私、品牌责任与供应商锁定"],
    enHciLens: ["Input: AI+AR glasses, compute unit, phone/cloud", "Context: vision, audio, motion, and edge inference", "Action: capture, recognition, translation, feedback", "Boundary: thermal, power, privacy, brand responsibility, lock-in"],
    zhImplication: "参考设计越成熟，用户越不应看到供应链拼装痕迹。产品需在端侧/云端切换、摄录提示、断网、热限制和第三方服务失败时给出一致反馈；芯片参数本身不能替代交互闭环。",
    enImplication: "As reference designs mature, users should not have to see the supply-chain assembly. Products need consistent feedback across edge/cloud switching, capture indicators, offline mode, thermal limits, and third-party failure; chip specifications do not replace a closed interaction loop.",
    visual: visuals.wuqi,
    sources: [source("WUQI Micro official XR ecosystem report", urls.wuqi, "china")],
    dossier: makeDossier({
      productName: "WQ7036 是物奇微面向端侧智能的异构芯片系列；Hawk AI+AR 眼镜与 Dolphin 算力单元是移远 XR 生态活动中展示的参考设计组合。它更接近供应链/平台产品，而非一款直接面向消费者的成品眼镜。",
      productType: "产品类型是 RISC-V CPU、存算一体 NPU、DSP 与 ISP 组合的端侧芯片，以及与光学眼镜和外部算力单元配套的参考设计。官方给出 Snapdragon AR1 + WQ7036、ARS45 + WQ7036 两条光波导架构选项，目标是覆盖 AI 音频、AI 拍照和 AR 眼镜等终端。",
      interactionFlow: "眼镜通过摄像头、麦克风和运动传感器采集环境与用户输入，WQ7036 在端侧完成部分多模态预处理或推理，再把结果通过音频、显示或手机/云服务反馈给用户。公开页面没有展示完整任务流程、模型、延迟、断网降级、开发者 API、功耗曲线或用户确认层，因此不能直接推导成品体验。",
      specsOrStack: "官方披露 WQ7036 集成 RISC-V CPU、存算一体 NPU、DSP 和 ISP，并列出 Snapdragon AR1 + WQ7036 与 ARS45 + WQ7036 参考组合；Hawk 为 AI+AR 眼镜，Dolphin 为配套算力单元。内存、制程、TOPS、摄像头规格、显示、重量、续航、模型、SDK、价格与量产时间 source not stated。",
      useCases: "参考设计覆盖 AI 音频眼镜、AI 拍照眼镜、带光波导显示的 AR 眼镜，以及需要外部算力单元的终端。潜在任务包括语音唤醒、拍摄、翻译、识别、导航和场景提示；这些是平台适配方向，具体品牌产品是否交付和是否达到同一体验需逐项核验。",
      painPointsSolved: "它解决眼镜厂商在端侧算力、图像处理、语音和光学组合上重复选型的问题，也让不同档位产品共享一部分硬件基础。风险是参考设计可能带来供应商锁定、不同品牌的隐私提示不一致、端云切换不可见，以及芯片升级后交互行为漂移。",
      userVoice: "本次没有找到足够的独立用户评测或下游产品长测。物奇微关于‘超过 10 个品牌’的说法属于公司披露，需要品牌名单、产品型号和真实出货证据才能升级为市场规模事实。",
      newTech: "新技术信号是异构端侧计算与光波导/算力单元组合，而不是单纯提高模型参数。NPU、DSP、ISP 分工若能在眼镜端完成更多预处理，就可能减少原始音视频上云并缩短反馈；但隐私收益只有在实际数据路径和日志可见时成立。",
      availability: "物奇微官方称 WQ7036 已应用于影目、极米、NIMO、加南科技、Looktech 等超过 10 个品牌，并在移远 XR 生态大会展示 Hawk/Dolphin 参考设计。参考设计可被供应链伙伴采用，但公开来源没有提供消费者购买链接、统一型号、地区和交付时间。",
      limitsOrUnknowns: "未知包括芯片性能与功耗、热设计、实际模型、摄像头/麦克风数据路径、是否可离线、光波导质量、算力单元是否必须携带、SDK 开放度、下游品牌差异、量产和售后。供应链官方声明不等于每个下游产品都使用同样配置。",
      productVerdict: "WQ7036/Hawk/Dolphin 是 confirmed product 的参考设计信号，价值在于把 AI 眼镜生态从单款品牌产品推进到可组合的芯片与算力底座。产品判断：设计团队应关注端侧数据路径、热与电量反馈、断网行为和供应商可替换性，而不能只看 NPU/DSP/ISP 的技术名词。"
    }, {
      productName: "WUQI Micro's WQ7036 is a heterogeneous edge-compute chip family; Hawk AI+AR glasses and Dolphin compute units were shown as reference combinations in a Quectel XR ecosystem event. This is closer to a supply-chain platform than a consumer-ready pair of glasses.",
      productType: "The product combines a RISC-V CPU, compute-in-memory NPU, DSP, and ISP with reference designs for optical glasses and an external compute unit. WUQI lists Snapdragon AR1 plus WQ7036 and ARS45 plus WQ7036 waveguide options for AI audio, AI camera, and AR-glasses categories.",
      interactionFlow: "Cameras, microphones, and motion sensors capture the scene and user input; WQ7036 performs some multimodal preprocessing or inference at the edge, then returns audio, display, phone, or cloud feedback. The public report does not show a complete task flow, model, latency, offline fallback, developer API, power curve, or confirmation layer, so it cannot directly prove a finished user experience.",
      specsOrStack: "WUQI discloses a RISC-V CPU, compute-in-memory NPU, DSP, and ISP, and names Snapdragon AR1 plus WQ7036 and ARS45 plus WQ7036 reference combinations. Hawk is an AI+AR glasses family and Dolphin is a companion compute unit. Memory, process, TOPS, cameras, display, weight, battery, models, SDK, price, and volume-production timing are source not stated.",
      useCases: "The references target AI audio glasses, AI camera glasses, waveguide AR glasses, and devices that need a companion compute unit. Potential tasks include wake, capture, translation, recognition, navigation, and contextual prompts. These are platform directions; each downstream product must be checked for actual delivery and experience quality.",
      painPointsSolved: "The platform addresses repeated selection work across edge compute, image processing, audio, and optics, letting brands share a hardware foundation across tiers. It also risks supplier lock-in, inconsistent privacy indicators, invisible edge/cloud switching, and interaction drift after chip revisions.",
      userVoice: "This run found no independent user review or long-term downstream-product test strong enough to validate the platform in use. WUQI's statement that WQ7036 is used by more than ten brands is a company disclosure; a brand list, product models, and shipment evidence are needed before treating it as a market-scale fact.",
      newTech: "The technology signal is heterogeneous edge computing paired with waveguide optics and a compute unit, rather than simply increasing model size. If the NPU, DSP, and ISP divide preprocessing on the glasses, products could reduce raw audio/video upload and shorten feedback. The privacy benefit is real only when data paths and logs are visible.",
      availability: "WUQI says WQ7036 is used by more than ten brands, naming INMO, XGIMI, NIMO, Ganaan, and Looktech, and shows Hawk/Dolphin references at the Quectel XR ecosystem event. Partners may adopt a reference design, but the public source provides no consumer purchase link, unified model, region, or delivery date.",
      limitsOrUnknowns: "Open questions include performance and power, thermal design, actual models, camera and microphone paths, offline behaviour, waveguide quality, whether the compute unit is required, SDK openness, downstream variance, production, and service. A supply-chain statement does not mean every downstream product uses the same configuration.",
      productVerdict: "WQ7036/Hawk/Dolphin is a confirmed reference-design signal. Its value is moving AI glasses from one branded product toward a composable chip and compute foundation. Verdict: designers should inspect data paths, thermal and battery feedback, offline behaviour, and supplier replaceability rather than relying on NPU, DSP, and ISP labels alone."
    })
  })
];
