import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-22";
const previousDate = "2026-09-21";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const previousDeck = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`);

const source = (label, url, type) => ({ label, url, type });
const visual = (file, kind, altZh, altEn, captionZh, captionEn, sourceUrl) => ({
  path: `assets/${file}`, width: 1600, height: 900, kind, altZh, altEn, captionZh, captionEn, sourceUrl
});
const product = (input) => ({ dossierKind: "product", ...input });
const scan = (input) => ({ dossierKind: "scan", ...input });

const qwenUrl = "https://www.ithome.com/1/005/647.htm";
const qwenOfficialUrl = "https://ali-home.alibaba.com/about-alibaba-businesses-1951035128754995200";
const yunqiUrl = "https://yunqi.aliyun.com/2026/exhibition";
const googlebookUrl = "https://blog.google/products-and-platforms/devices/googlebook/first-look-googlebook/";
const googlebookProductUrl = "https://googlebook.google/";
const googlebookReviewUrl = "https://www.tomsguide.com/computing/laptops/googlebook-pre-orders-go-live-with-5-new-laptops-from-usd899-to-usd1-299-heres-what-theyre-like-to-use";
const googlebookCommunityUrl = "https://www.reddit.com/r/Android/comments/1wmc8lk/googlebook_combines_chromeos_and_android/";
const snapUrl = "https://www.qualcomm.com/company/events/snapdragon-summit";
const metaUrl = "https://www.meta.com/emerging-tech/";
const metaDevUrl = "https://developers.meta.com/wearables/";
const metaReviewUrl = "https://www.techradar.com/computing/virtual-reality-augmented-reality/7-things-to-expect-at-meta-connect-2026-from-camera-less-smart-glasses-to-meta-ray-ban-glasses-updates";
const metaMediaUrl = "https://techcrunch.com/2026/09/16/after-accusations-of-selling-perv-glasses-meta-prepares-to-sell-a-pair-without-a-camera/";

const qwenVisual = visual(
  "qwen-n1-ithome-2026-09-22.png",
  "source-backed China press screenshot",
  "IT之家关于千问 AI 眼镜 N1 系列的现场报道截图",
  "ITHome field report on the Qwen AI Glasses N1 series",
  "中国媒体现场视觉：N1/N1 Pro 的 5000 万像素、第一视角、眼动追踪与虹膜支付信息，以及 10 月 13 日发售时间。",
  "China-media field visual: the 50MP sensor, first-person capture, eye tracking, iris payment, and October 13 sales date reported for N1/N1 Pro.",
  qwenUrl
);
const googlebookVisual = visual(
  "googlebook-official-2026-09-22.png",
  "source-backed official page screenshot",
  "Google 官方 Googlebook 产品公告截图",
  "Google official Googlebook product announcement screenshot",
  "官方视觉：Googlebook 的五款首发机型、45+ TOPS NPU、Android/ChromeOS 融合与 Gemini Intelligence 入口。",
  "Official visual: five launch models, 45+ TOPS NPU, Android/ChromeOS foundations, and Gemini Intelligence entry points.",
  googlebookUrl
);
const snapVisual = visual(
  "snapdragon-summit-2026-09-22.png",
  "source-backed official event page screenshot",
  "Qualcomm Snapdragon Summit 2026 官方议程截图",
  "Qualcomm Snapdragon Summit 2026 official agenda screenshot",
  "官方事件视觉：9 月 22–24 日 Snapdragon Summit 的 Personal AI、统一 AI 计算层与 Agentic PC 议程；会议当日尚不等于新产品规格已发布。",
  "Official event visual: Personal AI, unified AI compute, and Agentic PC sessions at Snapdragon Summit on September 22–24; an event agenda is not a released product specification.",
  snapUrl
);
const metaVisual = visual(
  "meta-connect-glasses-scan-2026-09-22.png",
  "source-backed media scan screenshot",
  "TechRadar 对 Meta Connect 2026 与无相机眼镜猜测的报道截图",
  "TechRadar scan of Meta Connect 2026 and camera-free glasses speculation",
  "评测/媒体 scan：Meta Connect 将于 9 月 23–24 日举行，媒体把无相机眼镜与隐私摩擦列为观察点；具体产品尚未发布。",
  "Review/media scan: Meta Connect is scheduled for September 23–24, while media lists camera-free glasses and privacy friction as watch points; no such product is confirmed here.",
  metaReviewUrl
);

const freshTopics = [
  product({
    id: "qwen-ai-glasses-n1-series-yunqi-2026-09-22",
    section: "china",
    evidenceLabel: "confirmed product",
    sourceDate: "2026-09-22",
    evidenceStrength: "IT之家现场报道与阿里官方产品描述；N1/N1 Pro 细节仍有未公开项",
    zhHeadline: "千问 N1：眼动把“我在看什么”送进个人 Agent",
    enHeadline: "Qwen N1 turns gaze into a personal-agent input",
    zhFact: "阿里在 2026 云栖大会展示千问 AI 眼镜 N1、N1 Pro 与耳夹式耳机。IT之家报道 N1 系列搭载 5000 万像素传感器并支持第一视角拍摄，N1 Pro 进一步加入眼动追踪和虹膜支付，三款新品已预约，10 月 13 日现货发售。",
    enFact: "At Alibaba's 2026 Yunqi Conference, Qwen showed the N1 and N1 Pro AI glasses plus an ear-clip headset. ITHome reports a 50-megapixel sensor and first-person capture for the N1 family; N1 Pro adds eye tracking and iris payment. The three products are open for reservation and are reported to go on sale October 13.",
    zhValue: "这里的变化不只是一副更高像素的相机眼镜，而是把“用户看向哪里”变成 agent 判断指向的输入。看展品再提问时，系统可以用视线缩小候选对象；支付则把生物特征、佩戴状态、交易确认和服务生态连接起来。产品真正要解决的是手持手机取景、反复描述目标、在第一视角内容与现实动作之间来回切换的摩擦，但它也把误识别、误付费和旁观者知情推到了同一条交互链上。",
    enValue: "The change is not simply a higher-resolution camera in a frame. It makes gaze a first-class input for deciding what an agent should attend to. When a wearer looks at an exhibit and asks a question, gaze can narrow the candidate object before visual reasoning begins. Payment connects a biometric cue, a worn state, transaction confirmation, and Alibaba's service ecosystem in one path. The product targets the friction of taking out a phone, repeatedly describing a target, and switching between first-person capture and real-world action. It also places misidentification, unintended payment, and bystander awareness on the same interaction chain.",
    zhHciLens: ["入口：第一视角相机与语音", "上下文：视线所指对象", "动作：问答、翻译、支付与办事", "边界：授权、误识别、交易确认"],
    enHciLens: ["Entry: first-person camera and voice", "Context: object under the user's gaze", "Action: questions, translation, payment, and tasks", "Boundary: consent, misrecognition, transaction confirmation"],
    zhImplication: "眼动不是装饰参数。它改变了 agent 的任务解析方式：系统不再只解析一句话，还要解释“看哪里”“为什么认定是这个物体”“何时允许从理解进入交易”。设计上要把视线捕获、候选对象、回答、支付确认和取消做成可见状态，而不是把所有状态藏在耳边的语音回复里。",
    enImplication: "Eye tracking is not a decorative specification. It changes task parsing: the agent must interpret not only what was said but also where the wearer looked, why that object was selected, and when understanding may become a transaction. The interface should expose gaze capture, candidate object, answer, payment confirmation, and cancellation as distinct states instead of hiding the whole chain in an audio reply.",
    visual: qwenVisual,
    sources: [source("IT之家：千问 AI 眼镜 N1 系列", qwenUrl, "china"), source("Alibaba Qwen product description", qwenOfficialUrl, "official"), source("2026 云栖大会展览", yunqiUrl, "official")],
    dossier: {
      zh: {
        productName: "千问 AI 眼镜 N1 / N1 Pro",
        productType: "千问 N1 系列是阿里围绕千问模型与个人 Agent 打造的新一代智能眼镜产品。它不是单纯的相机或音频眼镜：N1/N1 Pro 组合了第一视角拍摄、语音交互、视觉理解，以及 N1 Pro 的眼动追踪和虹膜支付。IT之家在 9 月 22 日云栖大会现场报道了 N1、N1 Pro 与千问 AI 耳夹式耳机；阿里已有产品描述则把千问眼镜放在主动服务、POV 拍摄、空间 3D 显示、同声传译和生活服务的全栈产品方向中。对于本期能确认的边界，N1 系列已公开展示并开放预约，具体 SKU 差异、价格与完整系统栈仍需等正式商品页。",
        interactionFlow: "一个典型流程是：用户戴上眼镜，在现实场景中看向一个展品或物体，用语音提问；设备用第一视角相机捕捉环境，再结合视线信息缩小被询问对象，返回语音或其他眼镜反馈。N1 Pro 的眼动追踪让“我说的是哪个东西”不必完全依赖语言描述；虹膜支付则可能把识别后的意图推进到交易，但支付前必须有清晰的金额、商户、账号和确认状态。耳夹式耳机则对应面对面翻译、AI 听记和语音办事。官方公开内容没有给出完整的取消、回滚、人工接管、离线失败和误识别恢复界面，因此这些步骤不能写成已确认能力。",
        specsOrStack: "IT之家报道 N1 系列搭载 5000 万像素传感器并支持第一视角拍摄，N1 Pro 支持眼动追踪与虹膜支付。阿里官方业务页把千问 AI 眼镜描述为软硬一体、全栈自研的智能穿戴，能力方向包括主动服务、POV 拍摄、空间 3D 显示、AI 音色克隆与同声传译；云栖大会官方展览页确认千问模型与智能体服务在现场展示。芯片、操作系统版本、摄像头是否始终工作、显示方案、重量、续航、网络制式、存储、API/SDK、支付风控策略和数据留存规则 source not stated，不能从宣传语补推。",
        useCases: "可验证的场景包括看向展品提问、第一视角拍摄、面对面翻译、AI 听记、语音办事和支付。对旅行者，它可能把翻译、导航式问答、拍摄和生活服务压缩到视线与语音中；对会议和访谈，耳夹式设备的听记路径可能减少拿手机记录的动作；对购物与本地生活，语音调用阿里生态服务可能把搜索、下单与支付连接起来。上述是公开报道与官方产品描述对应的使用路径，不等于已经有完整的城市、语言、支付商户、售后与企业部署覆盖。",
        painPointsSolved: "它针对三类摩擦：第一，用户需要从现实对象切换到手机屏幕才能理解或记录；第二，用户必须反复描述“我指的是哪一个”；第三，翻译、听记、支付和生活服务分散在多个应用里。眼动和第一视角感知有机会减少指向成本，语音和可穿戴形态有机会减少掏手机频率，千问生态则试图把理解后的动作继续执行。它没有自动解决错误指向、连续录制的社会接受度、支付误触、网络依赖、账号权限和数据删除；这些反而是上线后决定信任的关键。",
        userVoice: "本日可用证据主要是 IT之家现场报道和阿里公开产品描述，没有足够的独立长时评测、用户访谈或可复现支付测试。媒体页面显示的是产品与发布信息，不是续航、识别准确率、误付费率或真实佩戴舒适度的测量。",
        newTech: "新技术信号是把视线作为个人 Agent 的上下文输入，并将第一视角感知、主动服务和支付动作放在同一产品路线中。与只做“看图回答”的眼镜相比，N1 Pro 的公开定位更接近“看向对象—理解—执行”的连续链；但真正的创新是否成立，取决于 gaze-to-object 的稳定性、支付前的二次确认、主动提示的节制，以及在不适合拍摄或用户改变意图时能否立即退出。",
        availability: "IT之家报道 N1、N1 Pro 与千问 AI 耳夹式耳机已开启线上预约，预计 2026 年 10 月 13 日现货发售。当前报道没有给出 N1/N1 Pro 的价格、首发渠道、销售地区、配镜方案、保修、发货批次、开发者开放时间或耳夹式耳机的具体 SKU 参数。阿里官方产品描述支持千问 AI 眼镜已经作为其智能穿戴方向存在，但不能替代 10 月商品页对可购买配置的确认。",
        limitsOrUnknowns: "未知项包括眼动追踪的校准和误差、虹膜支付的授权与撤销、是否必须连接手机、端侧与云端模型边界、录像指示灯与旁观者提示、未成年人和他人眼睛/面部数据处理、网络中断时的降级、中文方言与翻译表现、设备温度、续航、重量、镜片适配、API/SDK 和企业管理。报道中的“支持”是功能公布，不代表每种场景都能稳定完成。",
        productVerdict: "千问 N1/N1 Pro 是今天最明确的中国 AI 穿戴产品信号：产品、交互方向和发售日期已有公开证据，眼动与虹膜支付让它超出普通相机眼镜的交互叙事。产品判断暂定为 confirmed product，但购买前必须等待正式规格、价格、隐私控制和真实支付/误识别测试；最值得观察的不是功能数量，而是用户能否看懂并随时取消从“看见”到“付钱”的每一步。"
      },
      en: {
        productName: "Qwen AI Glasses N1 / N1 Pro",
        productType: "Qwen N1 is Alibaba's next smart-glasses line built around Qwen and a personal-agent direction. It is not presented as only a camera or audio frame: the N1 family combines first-person capture, voice interaction, visual understanding, and, on N1 Pro, eye tracking and iris payment. ITHome reported the N1, N1 Pro, and a Qwen AI ear-clip headset from Alibaba's Yunqi Conference on September 22. Alibaba's existing product description places Qwen glasses in a full-stack wearable direction that includes proactive service, point-of-view capture, spatial 3D display, voice cloning, simultaneous interpretation, and everyday services. The confirmed boundary for this issue is a publicly demonstrated and reservable product family; SKU differences, pricing, and the complete system stack still require the formal store pages.",
        interactionFlow: "A representative flow starts with the wearer looking at an object in the real world and asking a voice question. The glasses capture a first-person view, combine it with gaze information to narrow the target, and return an audio or glasses-level response. Eye tracking on N1 Pro means that “which object do I mean?” need not be solved entirely through language. Iris payment could move a recognised intention into a transaction, but a safe flow must show merchant, amount, account, and confirmation state before money moves. The ear-clip headset covers a related path for face-to-face translation, AI notes, and voice tasks. Public material does not document the full cancellation, rollback, human-takeover, offline-failure, or misrecognition-recovery interface, so those steps are not treated as confirmed capabilities.",
        specsOrStack: "ITHome reports a 50-megapixel sensor and first-person capture for the N1 family, with eye tracking and iris payment on N1 Pro. Alibaba's product description calls Qwen glasses a self-developed, full-stack wearable and names proactive service, point-of-view capture, spatial 3D display, AI voice cloning, and simultaneous interpretation. The Yunqi exhibition page confirms that Qwen models and agent services are being demonstrated at the event. Chip, operating-system version, always-on camera behaviour, display implementation, weight, battery, network radio, storage, API/SDK, payment-risk controls, and data-retention rules are source not stated. Marketing language cannot fill those gaps.",
        useCases: "The public use cases include asking about an object under the user's gaze, first-person recording, face-to-face translation, AI note-taking, voice-operated services, and payment. For travel, translation, visual questions, capture, and local services could sit behind the same gaze-and-voice entry point. For meetings and interviews, the ear-clip path may reduce the need to reach for a phone while taking notes. For commerce and local life, Qwen's ecosystem can in principle connect recognition to search, ordering, and payment. These are paths supported by the reported product description, not proof of complete city coverage, language coverage, merchant support, after-sales service, or enterprise deployment.",
        painPointsSolved: "The product targets three kinds of friction. First, a user normally has to move from the physical object to a phone screen to understand or record it. Second, the user must repeatedly describe which object is meant. Third, translation, notes, payment, and everyday services are fragmented across apps. Gaze plus first-person perception could reduce pointing cost; voice plus a wearable frame could reduce phone-reaching; Qwen's service ecosystem could continue from understanding into action. None of this automatically solves wrong-target selection, social acceptance of continuous capture, accidental payment, network dependence, account permissions, or deletion. Those are the trust gates that will determine whether the product is useful outside a demo.",
        userVoice: "Today's available evidence is an ITHome field report and Alibaba's public product description. There is not enough independent long-duration review, user interview, or reproducible payment testing to claim battery life, accuracy, comfort, or accidental-payment rate. The report is launch evidence, not a measured reliability study.",
        newTech: "The new technology signal is the use of gaze as personal-agent context, joined with first-person sensing, proactive assistance, and payment in one product direction. Compared with glasses that only answer questions about an image, N1 Pro is framed closer to a continuous “look at object, understand, act” chain. Whether that is a real interaction advance depends on gaze-to-object stability, a clear second confirmation before payment, restrained proactive prompts, and an immediate exit when the wearer changes intent or enters a no-camera situation.",
        availability: "ITHome reports that N1, N1 Pro, and the Qwen AI ear-clip headset are open for online reservation and are expected to be available for spot sale on October 13, 2026. The report does not disclose price, launch channels, sales regions, prescription-lens options, warranty, shipment batches, developer access, or detailed ear-clip SKUs. Alibaba's product description supports the existence of Qwen glasses as a wearable direction, but it cannot replace the October store listing for purchase configuration.",
        limitsOrUnknowns: "Open questions include eye-tracking calibration and error, iris-payment enrolment and revocation, phone dependence, local-versus-cloud model routing, recording indicators and bystander cues, handling of faces and eye data, offline degradation, Mandarin dialects and translation, temperature, battery, weight, lens fitting, APIs/SDKs, and enterprise administration. “Supports” in a launch report means a capability was announced; it does not establish reliable completion across all environments.",
        productVerdict: "Qwen N1/N1 Pro is today's clearest China AI-wearable product signal: the product family, interaction direction, and sale date have public evidence, while eye tracking and iris payment move the proposition beyond a standard camera frame. The provisional verdict is confirmed product. A buying decision should wait for formal specifications, price, privacy controls, and real payment and misrecognition tests. The decisive question is not how many features exist, but whether the wearer can understand and cancel every step from seeing to paying."
      }
    }
  }),
  product({
    id: "googlebook-gemini-intelligence-laptop-2026-09-22",
    section: "global",
    evidenceLabel: "confirmed product",
    sourceDate: "2026-09-22",
    evidenceStrength: "Google official announcement plus hands-on and community signals",
    zhHeadline: "Googlebook：把 Gemini 做成 Android 用户的桌面入口",
    enHeadline: "Googlebook makes Gemini an Android user's desktop layer",
    zhFact: "Googlebook 已开放预订，首发来自 Acer、Asus、Dell、HP、Lenovo 的五款设备，起价 899 美元；Google 公布 45+ TOPS NPU、16GB 起始内存、最高 14 小时视频/16 小时网页续航，以及 Magic Pointer、Create My Widget、Cast My Apps、Quick Access 等入口。",
    enFact: "Googlebook is open for preorder through five launch partners—Acer, Asus, Dell, HP, and Lenovo—from $899. Google lists 45+ TOPS NPUs, 16GB baseline memory, up to 14 hours of video playback and 16 hours of web browsing, plus Magic Pointer, Create My Widget, Cast My Apps, and Quick Access.",
    zhValue: "它把 AI 电脑的竞争点从“有没有一个 Copilot 键”转成跨设备上下文是否连续：手机应用能否继续、手机文件能否直接访问、指针是否成为调用 Gemini 的位置锚点、用户是否能在当前窗口生成一个可复用的小工具。产品也把订阅、网络、Android 手机依赖和价格纳入了基本使用门槛。",
    enValue: "Googlebook moves the AI-laptop question beyond whether a machine has a Copilot key. Its proposition is continuity of context across devices: whether phone apps can continue on the laptop, phone files can be reached without manual transfer, the pointer can anchor Gemini to the current object, and a user can create a reusable widget in place. It also makes subscriptions, internet access, Android-phone dependence, and premium pricing part of the basic product boundary.",
    zhHciLens: ["入口：指针、键盘与 Gemini", "上下文：窗口、手机与文件", "动作：生成 widget、投射 app、后台任务", "边界：网络、订阅、Android 17"],
    enHciLens: ["Entry: pointer, keyboard, and Gemini", "Context: window, phone, and files", "Action: widgets, app casting, background tasks", "Boundary: internet, subscription, Android 17"],
    zhImplication: "Magic Pointer 的关键不是“更聪明的鼠标”，而是把当前对象、意图和后续动作绑定起来。若用户无法区分本地处理、云端 Gemini、手机投射与后台 Spark 任务，跨设备便利会变成不可追踪的自动化。产品应显示任务来源、数据去向、运行状态和停止入口，并让“生成的 widget”保留来源与可编辑性。",
    enImplication: "The important part of Magic Pointer is not a smarter mouse; it is binding the current object, intent, and next action. If users cannot distinguish local processing, cloud Gemini, phone casting, and background Spark work, cross-device convenience becomes untraceable automation. The product should show task origin, data destination, run state, and stop controls, while keeping generated widgets editable and linked to their source.",
    visual: googlebookVisual,
    sources: [source("Google: Googlebook first look", googlebookUrl, "official"), source("Googlebook product site", googlebookProductUrl, "official"), source("Tom's Guide hands-on/preorder", googlebookReviewUrl, "reviews"), source("Reddit Android discussion", googlebookCommunityUrl, "community")],
    dossier: {
      zh: {
        productName: "Googlebook laptops / Googlebook OS",
        productType: "Googlebook 是 Google 与 Acer、Asus、Dell、HP、Lenovo 等厂商推出的新一类高端笔记本产品，软件基础把 Android 与 ChromeOS 的桌面体验组合起来，并把 Gemini Intelligence 放进窗口、指针和跨设备工作流。它不是一个单独安装的聊天应用，也不只是把 Chromebook 改名；Google 的产品页强调 Android 手机连接、手机 app 投射、手机文件访问、Magic Pointer 和 Create My Widget。首发设备已进入预订阶段，产品价值依赖硬件、操作系统、Gemini、Google AI Pro 订阅和 Android 手机的组合。",
        interactionFlow: "用户在笔记本上工作时，可用鼠标指针晃动或快捷方式唤出 Magic Pointer，让 Gemini 以当前文本、图像或窗口为上下文执行解释、比较或创作；也可以用自然语言创建一个小工具，例如旅行追踪器。Cast My Apps 把手机 app 流到笔记本，Quick Access 让手机文件出现在桌面文件流中。Google 还宣传 Gemini Spark 可在后台继续处理复杂请求，甚至在合上电脑后完成任务。真正可用的流程需要在“当前窗口被读取”“手机内容被调用”“后台任务继续”“结果生成并写回”之间给出可理解的状态和撤销入口；官方页面没有完整展示这些状态的错误恢复与权限细节。",
        specsOrStack: "Google 官方披露五款首发机型，起价 899 美元；全系至少 16GB 内存，部分机型最高 32GB；可选 Intel Core Ultra Series 3 或 Snapdragon X Elite，NPU 端侧 AI 能力超过 45 TOPS；视频播放最长 14 小时，网页浏览最长 16 小时；Googlebook OS 提供最长 10 年的功能更新与支持承诺。Google 的产品站要求 Android 17 或以上手机才能使用手机协同功能，并说明部分结果需要联网。具体每个 SKU 的 CPU、屏幕、重量、存储、摄像头、端侧模型清单、区域价格和 Gemini Spark 的运行限制必须以对应厂商页面为准。",
        useCases: "它覆盖 Android 手机用户的跨屏工作、文档和网页处理、创作者的图片/视频与 widget 生成、旅行计划、手机 app 继续使用、手机文件快速取用，以及让 Gemini 在后台处理较长任务。对学生或个人创作者，Magic Pointer 可能减少复制文本到聊天窗口的动作；对移动办公用户，Cast My Apps 和 Quick Access 试图缩短手机与电脑之间的切换。Tom's Guide 的上手报道确认了五家厂商与 899–1299 美元的产品范围，但可用性判断仍需要分别测试网络中断、Android 手机不在身边、订阅到期和后台任务失败。",
        painPointsSolved: "Googlebook 针对的是 Android 手机与桌面电脑之间的断裂：用户过去需要在手机和电脑间重新登录、传文件、寻找同一 app 的桌面版，或把当前内容复制到另一个 AI 窗口。把手机文件、移动 app、Gemini 和当前指针位置接到同一系统，可以减少上下文重建。它没有消除生态锁定、云端依赖、账号权限、订阅费用和 Android 17 门槛；对 iPhone 用户，它的核心协同价值也不成立。社区讨论已经出现对 899 美元起价、地区价格差和“集成 AI 是否值得换机”的怀疑，这应作为购买摩擦而不是普遍结论。",
        userVoice: "Tom's Guide 提供了发布前后的上手与采访信号；Reddit 讨论则出现对地区价格、是否需要 Android 手机、集成 AI 的实际收益和硬件性价比的质疑。社区帖不是全体用户调查，且尚无长期稳定性、续航与 Gemini 任务完成率的独立统计。",
        newTech: "新技术信号是把 AI 调用位置从固定聊天框移到指针、窗口和系统级跨设备上下文：Magic Pointer 负责把选择位置变成 agent 入口，Create My Widget 把自然语言产物变成桌面工具，Cast My Apps 与 Quick Access 把 Android 手机变成延伸设备。它更像一套系统级交互层，而不是单个模型功能。真正的技术难点在于权限、来源、数据同步、后台任务与用户可控性，而不是仅仅提高模型回答质量。",
        availability: "Google 官方称预订已开放，价格从 899 美元起；美国预计 10 月 4 日上市，加拿大、英国、爱尔兰、法国、德国和澳大利亚预计 10 月 5 日上市。每台 Googlebook 包含 12 个月 Google AI Pro、5TB 云存储和 Gemini Advanced 工具，以及其他软件订阅权益。五款设备由合作厂商销售，实际价格、配置、库存、当地税费和退换政策以当地商店为准。",
        limitsOrUnknowns: "需要核验的限制包括 Gemini Spark 是否需要联网和订阅、合盖后台任务如何提醒与恢复、Magic Pointer 对第三方 app 的支持范围、手机离线和未配对时的降级、手机文件权限、跨设备复制是否留下审计记录、10 年更新承诺涵盖哪些版本、NPU 的真实端侧模型清单，以及不同厂商机型的热量、噪声和续航。社区反馈目前只能作为购买摩擦信号。",
        productVerdict: "Googlebook 是已确认、已经进入预订的系统级 AI 笔记本产品。它的核心不是一台更快的 Chromebook，而是把 Gemini 绑定到指针、窗口、Android 手机和后台任务。对重度 Android 用户，跨设备连续性可能是购买理由；对不在 Google 生态内的用户，899 美元起价加订阅与手机依赖可能使价值迅速下降。验收重点应放在任务状态、权限边界和失败后的恢复，而非宣传中的 AI 功能数量。"
      },
      en: {
        productName: "Googlebook laptops / Googlebook OS",
        productType: "Googlebook is a new premium-laptop category from Google and partners including Acer, Asus, Dell, HP, and Lenovo. Its software foundation combines Android and a desktop ChromeOS lineage while placing Gemini Intelligence in the window, pointer, and cross-device workflow. It is not merely a separately installed chatbot and not just a renamed Chromebook. Google's product pages emphasise Android-phone connectivity, phone-app casting, phone-file access, Magic Pointer, and Create My Widget. The first devices are entering preorder, and their value depends on the combination of hardware, operating system, Gemini, a Google AI Pro subscription, and an Android phone.",
        interactionFlow: "A user working on the laptop can wiggle the pointer or use a shortcut to invoke Magic Pointer, letting Gemini use the current text, image, or window as context for explaining, comparing, or creating. The user can also ask for a small tool, such as a trip tracker, in natural language. Cast My Apps streams a phone app onto the laptop, while Quick Access brings phone files into a desktop file flow. Google also promotes Gemini Spark continuing complex requests in the background, even after the laptop is closed. A usable system must make the transitions legible: current-window reading, phone access, background execution, result creation, and write-back. The public announcement does not fully document error recovery or permission states for those transitions.",
        specsOrStack: "Google publishes five launch models starting at $899. The portfolio has at least 16GB of memory, with some models reaching 32GB; processor options include Intel Core Ultra Series 3 and Snapdragon X Elite; the NPU provides more than 45 TOPS of on-device AI power; video playback is listed up to 14 hours and web browsing up to 16 hours. Googlebook OS is promised feature drops and updates for up to 10 years. The Googlebook product site says phone collaboration requires Android 17 or later and notes that some results require an internet connection. Exact CPU, display, weight, storage, camera, local-model list, regional price, and Gemini Spark limits vary by partner model and remain source not stated unless the partner page provides them.",
        useCases: "The category targets cross-screen Android work, document and web handling, image and video creation, widget generation, trip planning, phone-app continuation, fast phone-file access, and longer tasks that Gemini can process in the background. For students and creators, Magic Pointer may reduce the act of copying context into another chat window. For mobile workers, Cast My Apps and Quick Access aim to shorten the phone-to-laptop transition. Tom's Guide's hands-on coverage confirms five partners and a $899–$1,299 range, but real utility still needs testing with a missing phone, weak connectivity, an expired subscription, and a failed background task.",
        painPointsSolved: "Googlebook targets the break between an Android phone and a desktop computer. Before this, a user might have to sign in again, transfer a file, find a desktop version of an app, or copy current context into a separate AI window. Connecting phone files, mobile apps, Gemini, and the current pointer position can reduce that reconstruction work. It does not remove ecosystem lock-in, cloud dependence, account permissions, subscription cost, or the Android 17 requirement. Its core continuity value also does not apply to an iPhone user. Community discussions already question the $899 entry price, regional price differences, and whether integrated AI justifies a new machine; these are purchase-friction signals, not a population-level conclusion.",
        userVoice: "Tom's Guide provides hands-on and interview signals around the preorder launch. Reddit discussions raise questions about regional pricing, Android-phone dependence, the practical gain from integrated AI, and hardware value. Community posts are not a representative survey, and there is not yet independent long-term data for stability, battery, or Gemini task-completion rate.",
        newTech: "The technology signal is moving AI invocation from a fixed chat box into the pointer, window, and system-level cross-device context. Magic Pointer makes the selection location an agent entry point; Create My Widget turns a natural-language request into a reusable desktop tool; Cast My Apps and Quick Access make the Android phone an extension of the laptop. This is a system interaction layer rather than one isolated model feature. The hard problems are permissions, provenance, synchronisation, background execution, and user control—not only answer quality.",
        availability: "Google says preorders are open from $899. The announced shelf dates are October 4 in the United States and October 5 in Canada, the United Kingdom, Ireland, France, Germany, and Australia. Each Googlebook includes 12 months of Google AI Pro, 5TB of cloud storage, Gemini Advanced tools, and other software subscriptions. The five devices are sold by partner manufacturers; local price, configuration, inventory, tax, and returns depend on the local store.",
        limitsOrUnknowns: "Open questions include whether Gemini Spark requires an internet connection or an active subscription, how a closed-lid task is surfaced and recovered, which third-party apps Magic Pointer can address, what happens without the paired Android phone, how phone-file permissions are recorded, whether cross-device copies leave an audit trail, what the ten-year update promise covers, which models actually run on-device, and how heat, noise, and battery vary across partners. Community feedback remains a friction signal rather than a reliability measurement.",
        productVerdict: "Googlebook is a confirmed system-level AI laptop that has entered preorder. Its core proposition is not a faster Chromebook; it is binding Gemini to the pointer, window, Android phone, and background task. For a heavy Android user, continuity may justify the purchase. For users outside Google's ecosystem, the $899 entry price, subscription, and phone dependency can quickly erase the value. Acceptance should focus on task state, permission boundaries, and recovery after failure rather than the count of advertised AI features."
      }
    }
  }),
  scan({
    id: "snapdragon-summit-agentic-pc-watch-2026-09-22",
    section: "official",
    evidenceLabel: "developer surface",
    sourceDate: "2026-09-22",
    evidenceStrength: "official event agenda; specs not yet published",
    zhHeadline: "Snapdragon Summit：Agentic PC 还在议程里，产品边界尚未落地",
    enHeadline: "Snapdragon Summit puts the Agentic PC on the agenda, not yet in a product",
    zhFact: "Qualcomm Snapdragon Summit 于 9 月 22–24 日举行，官方议程列出 Personal AI、统一 AI 计算层和“Agentic PC is Here”主题。今天扫描到的是平台方向与开发者入口，不把议程标题写成新电脑、芯片或 SDK 的确认发布。",
    enFact: "Qualcomm's Snapdragon Summit runs September 22–24, with official sessions on Personal AI, a unified AI compute layer, and “The Agentic PC is Here.” Today's scan finds a platform direction and developer-facing event surface, not a confirmed new computer, chip specification, or SDK release.",
    zhHciLens: ["扫描对象：官方议程", "信号：Personal AI / Agentic PC", "缺失：SKU、API、性能", "后续：主题演讲与开发者文档"],
    enHciLens: ["Scanned: official agenda", "Signal: Personal AI / Agentic PC", "Missing: SKU, API, performance", "Watch: keynote and developer docs"],
    visual: snapVisual,
    sources: [source("Qualcomm Snapdragon Summit 2026", snapUrl, "official")],
    dossier: {
      zh: {
        productName: "Snapdragon Summit 2026 Agentic PC scan",
        productType: "这是 official source-lane scan，不是新产品 dossier。扫描对象是 Qualcomm 9 月 22–24 日 Snapdragon Summit 的公开议程：Personal AI、Sound、统一 AI 计算层和 Agentic PC。今天能确认的是厂商把 agent、个人 AI 与端侧计算放进同一场开发者/平台事件；不能据此确认某一台电脑、处理器 SKU、操作系统版本或已经开放的 API。",
        interactionFlow: "当前可观察的流程是：开发者或产品团队进入官方直播与议程，先看到个人 AI、统一计算层和 Agentic PC 的主题，再等待主题演讲、产品发布、SDK 或样例代码把方向变成可操作入口。官方议程没有给出用户如何在电脑上调用 agent、如何显示端云边界、如何批准系统动作或如何在断网后恢复。扫描的下一步是核对现场发布、开发者文档和可下载工具，而不是根据标题补写交互流程。",
        specsOrStack: "官方页面明确了地点、日期和议程主题，但没有在本次扫描中给出新的 CPU/GPU/NPU 型号、TOPS、内存、功耗、操作系统、模型清单、API 版本、设备价格或上市时间。平台 stack、合作 OEM、开发者工具和模型运行位置都 source not stated。",
        useCases: "可能涉及个人 AI、声音、移动平台、统一 AI 计算和 PC agent，但目前只有主题范围，不足以写成某个已交付用例。需要观察是否出现本地文件 agent、跨设备个人上下文、后台任务、会议/创作工作流或 OEM 级权限控制的具体演示。",
        painPointsSolved: "议程所指向的痛点是把 AI 从应用层推到设备与平台层，降低延迟、减少云端往返并让多个计算单元协同。但官方尚未提供可复现的产品路径，因此不能声称已解决端云切换、数据主权、续航、热量或 agent 失败恢复。",
        userVoice: "本日没有独立评测或社区实测可用于判断 Summit 相关产品的真实体验；只有官方事件页面和议程。",
        newTech: "新技术信号是“统一 AI 计算层”和“Agentic PC”被作为平台叙事公开展示。它可能影响后续 PC 的本地模型、传感器、系统 API 与开发者工具，但截至扫描时没有足够证据将其升级为已确认产品能力。",
        availability: "Snapdragon Summit 官方活动在 9 月 22–24 日进行，直播与议程面向公开观看。具体发布内容、开发者下载、样机、区域、价格与上市时间 source not stated。",
        limitsOrUnknowns: "关键缺口包括芯片型号、OEM 产品、操作系统/API、模型部署方式、端云路由、权限提示、后台任务、功耗、开发者资格和真实 demo。议程标题不能替代规格表或发布说明。",
        productVerdict: "结论：developer surface scan。它值得作为今天的官方平台雷达项，但还没有足够证据成为产品 dossier；后续只在出现可下载 SDK、明确硬件或可复现用户流程时升格。"
      },
      en: {
        productName: "Snapdragon Summit 2026 Agentic PC scan",
        productType: "This is an official source-lane scan, not a new-product dossier. The scan covers Qualcomm's September 22–24 Snapdragon Summit agenda, including Personal AI, Sound, a unified AI compute layer, and The Agentic PC is Here. The confirmed signal is that Qualcomm is placing agents, personal AI, and endpoint compute in one platform event. The agenda does not confirm a particular computer, processor SKU, operating-system version, or released API.",
        interactionFlow: "The observable flow today is a developer or product team entering the official broadcast and agenda, seeing Personal AI, unified compute, and Agentic PC themes, then waiting for a keynote, product announcement, SDK, or sample code to turn the direction into an operable entry point. The agenda does not show how a user invokes an agent on a PC, sees local/cloud boundaries, approves system actions, or recovers after a disconnection. The next step is to verify the live announcements, developer documents, and downloadable tools rather than infer a workflow from a title.",
        specsOrStack: "The official page states the event dates, location, and session themes. This scan does not find a new CPU/GPU/NPU model, TOPS figure, memory, power, operating system, model list, API version, device price, or ship date. Platform stack, OEM partners, developer tools, and model location are source not stated.",
        useCases: "The themes may cover personal AI, audio, mobile platforms, unified compute, and PC agents, but a theme list is not a delivered use case. Watch for concrete demonstrations of local-file agents, cross-device personal context, background tasks, meeting or creative workflows, and OEM-level permission controls.",
        painPointsSolved: "The agenda points toward moving AI from the application layer into the device and platform layer, potentially reducing latency, cloud round trips, and fragmented compute. Qualcomm has not yet supplied a reproducible product path in this scan, so it cannot be credited with solving local/cloud routing, data sovereignty, battery, heat, or agent failure recovery.",
        userVoice: "There is no independent hands-on review or community measurement for a Summit product in today's evidence; the available evidence is the official event page and agenda.",
        newTech: "The technology signal is that a unified AI compute layer and an Agentic PC are being presented as platform concepts. This could shape local models, sensors, system APIs, and developer tools in later PCs, but the evidence is not sufficient to upgrade it into a confirmed product capability today.",
        availability: "The official event runs September 22–24 and provides a public broadcast and agenda. Exact announcements, developer downloads, hardware, regions, price, and ship dates are source not stated.",
        limitsOrUnknowns: "The missing evidence includes processor model, OEM product, operating system/API, model deployment, local/cloud routing, permission prompts, background tasks, power, developer access, and a reproducible demo. An agenda headline cannot replace a specification sheet or release note.",
        productVerdict: "Verdict: developer-surface scan. It belongs on today's official radar, but it is not yet a product dossier. Upgrade it only after a downloadable SDK, named hardware, or reproducible user flow appears."
      }
    }
  }),
  scan({
    id: "meta-connect-camera-free-glasses-watch-2026-09-22",
    section: "reviews",
    evidenceLabel: "weak/unverified",
    sourceDate: "2026-09-22",
    evidenceStrength: "official event page plus media preview; product unconfirmed",
    zhHeadline: "Meta Connect 前夜：无相机眼镜是隐私回应，还是媒体猜测？",
    enHeadline: "Before Meta Connect, camera-free glasses remain a privacy hypothesis",
    zhFact: "Meta 官方确认 Meta Connect 将于 9 月 23–24 日举行，并把 AI glasses、VR 与开发者生态列为主题。TechRadar 与 TechCrunch 报道媒体正在猜测无相机眼镜和代号 Luna，但今天没有官方产品页、规格、价格或上市确认。",
    enFact: "Meta confirms Meta Connect for September 23–24, with AI glasses, VR, and the developer ecosystem in scope. TechRadar and TechCrunch report speculation about camera-free glasses and a codename Luna, but today's evidence has no official product page, specifications, price, or availability confirmation.",
    zhHciLens: ["扫描对象：发布会与媒体预告", "信号：相机引发隐私摩擦", "缺失：产品与规格", "后续：发布会、SDK、隐私提示"],
    enHciLens: ["Scanned: event and media previews", "Signal: camera privacy friction", "Missing: product and specs", "Watch: launch, SDK, privacy cues"],
    visual: metaVisual,
    sources: [source("Meta Emerging Tech / Connect 2026", metaUrl, "official"), source("Meta Wearables developer surface", metaDevUrl, "developer surface"), source("TechRadar pre-event scan", metaReviewUrl, "reviews"), source("TechCrunch camera-free glasses report", metaMediaUrl, "reviews")],
    dossier: {
      zh: {
        productName: "Meta Connect 2026 AI glasses / camera-free glasses scan",
        productType: "这是 reviews source-lane scan，扫描 Meta Connect 2026 的公开预告与媒体对无相机 AI 眼镜的猜测。Meta 官方只确认 9 月 23–24 日的活动范围包括 AI glasses、VR 和开发者内容；媒体把无相机眼镜与 Luna 作为可能方向，但本条不把代号或猜测升级为已发布产品。",
        interactionFlow: "已确认的开发者入口是 Meta Wearables Device Access Toolkit，可访问 AI 眼镜的相机、音频和显示能力，或构建免手体验。媒体猜测的无相机产品如果存在，交互可能更偏语音、音频和手机/云端连接，但官方没有公布完整流程。今天的扫描对象是：发布会是否给出新硬件、如何替代相机感知、如何提示周围人、是否有开发者 API，以及用户如何在需要视觉理解时切换到手机或其他设备。",
        specsOrStack: "Meta 官方页面明确活动日期，并在开发者页列出 Wearables Device Access Toolkit 与 Web Apps Starter Kit 的方向；没有公布本扫描对象的型号、传感器、重量、电池、芯片、OS/API 版本、价格或发售地区。媒体关于无相机与 Luna 的信息是预发布报道，不是产品规格。",
        useCases: "已公开的开发者方向是通过 AI 眼镜的音频、相机和显示能力做免手体验；如果相机被移除，潜在场景可能转向语音问答、提醒、通话、播报和与手机协同，但这些只是待验证的交互假设。扫描重点是是否会出现真实 demo，而不是替媒体补写功能。",
        painPointsSolved: "媒体报道所指向的痛点是相机眼镜带来的隐私与社会接受度压力。无相机设计可能降低“被拍摄”的担忧，却也可能削弱视觉理解、记录和物体识别。它不能自动解决麦克风监听、主动提示、数据留存、旁观者同意或用户无法判断 AI 当前状态的问题。",
        userVoice: "TechRadar 和 TechCrunch 提供的是发布前媒体信号，并非佩戴者长期评测。当前没有足够社区证据证明用户普遍要求无相机版本，也没有官方验证其存在。",
        newTech: "今天没有确认的新技术；可观察的产品信号是 Meta 将可穿戴设备访问工具、免手体验和隐私争议放在同一个发布会前夜。若无相机眼镜出现，真正的技术挑战会变成如何在缺少视觉传感器时维持有用的 Agent 反馈，以及怎样让用户与旁人理解设备正在听什么。",
        availability: "Meta Connect 官方活动安排在 9 月 23–24 日，开发者可注册观看。无相机眼镜的价格、规格、预约、上市地区和 SDK 可用性 source not stated。",
        limitsOrUnknowns: "缺口包括产品是否存在、摄像头是否完全移除、音频/麦克风能力、手机依赖、AI 模型、隐私指示、录音状态、数据删除、开发者权限、价格、重量、续航和发布后服务。媒体预告不能替代发布会与官方支持文档。",
        productVerdict: "结论：weak/unverified review scan。它是一个值得在发布会后复核的隐私与形态信号，不是今天可以推荐或对比购买的产品。升级条件是官方硬件页、真实演示、支持文档和可复现的隐私控制。"
      },
      en: {
        productName: "Meta Connect 2026 AI-glasses / camera-free glasses scan",
        productType: "This is a reviews source-lane scan of Meta Connect 2026 previews and media speculation about camera-free AI glasses. Meta officially confirms that the September 23–24 event covers AI glasses, VR, and developer content. Media reports mention camera-free glasses and a possible codename Luna, but this item does not upgrade a codename or rumour into a shipped product.",
        interactionFlow: "The confirmed developer entry point is Meta's Wearables Device Access Toolkit, which exposes camera, audio, and display capabilities for hands-free experiences or standalone web experiences. If a camera-free product exists, its interaction may rely more heavily on voice, audio, and a phone or cloud connection, but no complete flow is published. Today's scan asks whether the event will reveal hardware, how visual understanding is replaced, how bystanders are informed, whether a developer API exists, and how a user hands off to a phone or another device when visual context is needed.",
        specsOrStack: "Meta's official pages publish the event dates and a developer direction around the Wearables Device Access Toolkit and Web Apps Starter Kit. They do not publish a model, sensors, weight, battery, chip, operating-system/API version, price, or region for the scanned rumour. Media reporting about camera-free glasses and Luna is pre-launch evidence, not a specification sheet.",
        useCases: "The public developer direction is hands-free experiences using AI-glasses audio, camera, and display. If the camera is removed, possible use cases could shift toward voice questions, reminders, calls, readouts, and phone cooperation, but those are hypotheses to test. The scan is watching for a real demo rather than filling in missing features on the media's behalf.",
        painPointsSolved: "The media signal points to privacy and social-acceptance pressure around camera glasses. Removing the camera could reduce the fear of being photographed, while also weakening visual understanding, capture, and object recognition. It would not automatically solve microphone listening, proactive prompts, retention, bystander consent, or the user's inability to know what the AI is currently hearing.",
        userVoice: "TechRadar and TechCrunch provide pre-event media signals, not longitudinal wearer reviews. There is not enough community evidence to claim that users broadly demand a camera-free model, and Meta has not confirmed that it exists.",
        newTech: "There is no confirmed new technology in today's scan. The product signal is that Meta's wearable-access tools, hands-free interaction, and privacy controversy meet on the eve of the same event. If a camera-free frame appears, the hard design question will be how an agent remains useful without visual sensing and how both wearer and bystanders understand what the device is hearing.",
        availability: "Meta Connect is scheduled for September 23–24, with a public developer livestream registration. Price, specifications, preorder, sales regions, and SDK availability for a camera-free frame are source not stated.",
        limitsOrUnknowns: "Missing evidence includes whether the product exists, whether the camera is fully removed, audio and microphone capability, phone dependence, model, privacy indicator, recording state, deletion controls, developer permissions, price, weight, battery, and post-launch support. A media preview cannot replace a launch page and support documentation.",
        productVerdict: "Verdict: weak/unverified review scan. It is a useful privacy-and-form-factor signal to revisit after the event, not a product that can be recommended or compared for purchase today. Upgrade conditions are an official hardware page, a real demo, support documentation, and reproducible privacy controls."
      }
    }
  })
];

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`missing previous issue ${previousDate}`);
const issue = JSON.parse(JSON.stringify(previous));
issue.date = date;
issue.zhTitle = "AI Daily 2026-09-22：从视线到桌面，Agent 正在争夺入口";
issue.enTitle = "AI Daily 2026-09-22: agents compete for the gaze and the desktop";
issue.zhSummary = "千问 N1/N1 Pro 把视线与虹膜支付写进个人 Agent；Googlebook 把 Gemini 放进 Android 用户的桌面与跨设备上下文；Snapdragon Summit 与 Meta Connect 前夜则把 Agentic PC 和无相机眼镜留在需要发布会核验的观察区。";
issue.enSummary = "Qwen N1/N1 Pro turns gaze and iris payment into personal-agent inputs. Googlebook places Gemini in an Android user's desktop and cross-device context. On the eve of Snapdragon Summit and Meta Connect, Agentic PC and camera-free glasses remain signals that need launch-day verification.";
issue.tags = Array.from(new Set(["Qwen N1", "Qwen N1 Pro", "eye tracking", "iris payment", "Googlebook", "Gemini Intelligence", "Magic Pointer", "Android 17", "Snapdragon Summit", "Agentic PC", "Meta Connect", "camera-free glasses", "privacy", ...issue.tags])).slice(0, 48);
issue.sourceTypes = Array.from(new Set(["confirmed product", "developer surface", "weak/unverified", "china", "global", "official", "reviews", "community", ...issue.sourceTypes]));
const freshIds = new Set(freshTopics.map((item) => item.id));
issue.topics = [...freshTopics, ...issue.topics.filter((item) => !freshIds.has(item.id))];
issue.coverStory = {
  topicId: freshTopics[0].id,
  zhTitle: "当 Agent 看向你的视线，也接管你的桌面",
  enTitle: "When an agent follows your gaze, it can also claim your desktop",
  zhSummary: ["千问 N1/N1 Pro 把视线从注视变成任务解析输入。", "Googlebook 把指针、窗口、手机和 Gemini 组合为桌面入口。", "两场发布会前夜提醒我们：新入口必须同时公开权限、证据和退出路径。"],
  enSummary: ["Qwen N1/N1 Pro turns gaze from attention into task-parsing input.", "Googlebook combines pointer, window, phone, and Gemini into a desktop entry.", "The two event eves make the same demand: new entries must expose permissions, evidence, and exit paths."],
  imagePath: qwenVisual.path,
  imageWidth: qwenVisual.width,
  imageHeight: qwenVisual.height,
  imageSourceUrl: qwenVisual.sourceUrl,
  primarySourceUrl: qwenUrl,
  evidenceStrength: "confirmed product · China field report / 2026-09-22; paired with official Googlebook and downgraded event scans",
  whyCover: "The current product boundary is the input that lets an agent decide what the user means—and the control that lets the user stop it."
};
issue.designDesk = {
  zhTitle: "Design Desk：入口越自然，证据越要可见",
  enTitle: "Design Desk: the more natural the entry, the more visible the evidence",
  zhIntro: "今天的新增产品把视线、指针、手机、云端和交易连接起来。设计验收不应只问 agent 能不能完成任务，还要问用户能否看到它理解了什么、调用了什么、何时转成动作，以及如何取消。",
  enIntro: "Today's additions connect gaze, pointer, phone, cloud, and transaction. Design acceptance should ask not only whether an agent completes a task, but whether the user can see what it understood, what it accessed, when it became an action, and how to cancel.",
  zhItems: [
    { label: "指向要可见", body: "视线、指针或当前窗口被当作上下文时，系统要显示被选中的对象。" },
    { label: "动作前先确认", body: "支付、发送、预订和后台执行不能把理解状态直接变成不可逆动作。" },
    { label: "来源不漂浮", body: "手机文件、云端模型、端侧 NPU 和第三方服务要进入任务记录。" },
    { label: "设备要能交接", body: "眼镜失去视野、电脑合盖或手机离线时，任务要有可见的接管入口。" },
    { label: "隐私既管自己也管旁人", body: "相机、麦克风、虹膜和持续记忆都需要佩戴者与旁观者能理解的提示。" },
    { label: "未发布就是 scan", body: "事件议程、媒体猜测、论文与专利不能共用 confirmed product 标签。" }
  ],
  enItems: [
    { label: "Make targeting visible", body: "When gaze, pointer, or the current window becomes context, show the selected object." },
    { label: "Confirm before action", body: "Payment, sending, booking, and background execution cannot jump from understanding to an irreversible act." },
    { label: "Keep provenance attached", body: "Phone files, cloud models, endpoint NPUs, and third-party services belong in the task record." },
    { label: "Let devices hand off", body: "When glasses lose view, a laptop closes, or a phone goes offline, keep a visible takeover path." },
    { label: "Design privacy for bystanders too", body: "Camera, microphone, iris, and persistent memory need cues understandable to wearers and nearby people." },
    { label: "Unreleased means scan", body: "Event agendas, media speculation, papers, and patents cannot share a confirmed-product badge." }
  ]
};
issue.watchlistZh = Array.from(new Set([
  "千问 N1/N1 Pro：正式价格、重量、续航、眼动校准、虹膜支付授权、隐私提示、SDK 与 10 月 13 日真实发货。",
  "Googlebook：Magic Pointer 对第三方 app 的边界、Gemini Spark 合盖任务、Android 17 协同、地区价格与独立续航测试。",
  "Snapdragon Summit：Agentic PC 的硬件 SKU、统一计算层 SDK、端云路由、开发者下载与可复现 demo。",
  "Meta Connect：是否发布无相机眼镜、语音/音频替代路径、隐私指示、Wearables API 与真实佩戴证据。",
  ...issue.watchlistZh
])).slice(0, 20);
issue.watchlistEn = Array.from(new Set([
  "Qwen N1/N1 Pro: formal price, weight, battery, eye-tracking calibration, iris-payment controls, privacy cues, SDK, and October 13 shipping.",
  "Googlebook: Magic Pointer's third-party-app boundary, Gemini Spark closed-lid tasks, Android 17 pairing, regional price, and independent battery tests.",
  "Snapdragon Summit: Agentic PC hardware SKUs, unified-compute SDK, local/cloud routing, developer downloads, and a reproducible demo.",
  "Meta Connect: whether camera-free glasses launch, voice/audio fallback, privacy cues, Wearables API, and real-wear evidence.",
  ...issue.watchlistEn
])).slice(0, 20);
issue.sourcesPath = `./${date}/sources.md`;
issue.zhPath = `./${date}/zh/`;
issue.enPath = `./${date}/en/`;
const index = issues.findIndex((item) => item.date === date);
if (index >= 0) issues[index] = issue; else issues.unshift(issue);
issues.sort((a, b) => b.date.localeCompare(a.date));
await fs.writeFile(dataPath, `${JSON.stringify(issues, null, 2)}\n`);

await fs.mkdir(path.join(issueDir, "assets"), { recursive: true });
await fs.cp(path.join(root, previousDate, "assets"), path.join(issueDir, "assets"), { recursive: true, force: true });
for (const assetName of ["qwen-n1-ithome-2026-09-22.png", "googlebook-official-2026-09-22.png", "snapdragon-summit-2026-09-22.png", "meta-connect-glasses-scan-2026-09-22.png"]) {
  await fs.copyFile(path.join(root, date, "assets", assetName), path.join(issueDir, "assets", assetName));
}
await fs.rm(deckDir, { recursive: true, force: true });
await fs.cp(previousDeck, deckDir, { recursive: true, filter: (sourcePath) => !sourcePath.includes(`${path.sep}dist${path.sep}`) && !sourcePath.endsWith(`${path.sep}dist`) });
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });

const labels = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "用户原声", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "User voice", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const dossierText = (locale, item) => fields.map((field, i) => `**${labels[locale][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="./public/${qwenVisual.path}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(freshTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${freshTopics.map((item) => item.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\n**Design Desk** — ${issue.designDesk.zhTitle}。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue with source/date/evidence labels and PDF downloads.`,
  ...freshTopics.flatMap((item) => [`# ${item.zhHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("zh", item)}\n\n**Sources** — ${links(item)}`, `# ${item.enHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("en", item)}\n\n**Sources** — ${links(item)}`]),
  `# Design Desk / 设计洞察\n\n${issue.designDesk.zhItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}\n\n${issue.designDesk.enItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}`,
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n${issue.watchlistEn.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url)))).slice(0, 140).map((url, i) => `${i + 1}. ${url}`).join("\n")}\n\nVisual evidence uses local source-traceable images with contain positioning, white backgrounds, and no page-internal scrolling.`
];
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const laneRows = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"].map((lane) => `| ${lane} | ${issue.topics.some((item) => item.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((item) => `| ${item.id} | \`${item.visual.path}\` | ${item.visual.sourceUrl} | ${item.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, pre-launch, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, fresh: freshTopics.length, sources: new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url))).size, visuals: new Set(issue.topics.map((item) => item.visual.path)).size, deckDir }));
