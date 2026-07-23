import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const issuesPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(issuesPath, "utf8"));
const previous = issues.find((issue) => issue.date === "2026-07-21");
if (!previous) throw new Error("Missing 2026-07-21 source issue");

const clone = (value) => structuredClone(value);
const source = (label, url) => ({ label, url });

const samsungOfficial = "https://news.samsung.com/uk/samsung-brings-galaxy-ecosystem-into-everyday-eyewear";
const googleUnpacked = "https://blog.google/products-and-platforms/platforms/android/galaxy-unpacked-2026/";
const androidXr = "https://www.android.com/xr/";
const androidCentral = "https://www.androidcentral.com/wearables/samsung-google-intelligent-eyewear-galaxy-unpacked-2026-hands-on";
const techRadar = "https://www.techradar.com/ai-platforms-assistants/we-got-a-first-look-at-samsung-intelligent-eyewear-the-smart-glasses-entering-a-fraught-market-worried-about-privacy";

const samsungVisual = {
  path: "assets/samsung-intelligent-eyewear-official-2026-07.jpg",
  width: 1000,
  height: 280,
  kind: "source-backed product image",
  altZh: "Samsung 与 Google 在 Galaxy Unpacked 公开的 Intelligent Eyewear 产品图",
  altEn: "Samsung and Google Intelligent Eyewear product image from Galaxy Unpacked",
  captionZh: "来源追踪视觉：Samsung Newsroom UK，2026-07-22。图片展示 Gentle Monster 与 Warby Parker 合作路线；官方说明首批音频眼镜将在秋季推出。",
  captionEn: "Source-traceable visual: Samsung Newsroom UK, July 22, 2026. The image shows the Gentle Monster and Warby Parker collaboration; the official post says the first audio-glasses collections launch this fall.",
  sourceUrl: samsungOfficial
};

const samsung = {
  id: "samsung-google-intelligent-eyewear-unpacked-2026",
  section: "official",
  zhHeadline: "Samsung / Google Intelligent Eyewear 终于进入真机审查",
  enHeadline: "Samsung and Google Intelligent Eyewear enters the hands-on test",
  zhFact: "Samsung 与 Google 在 7 月 22 日 Galaxy Unpacked 公开了 Intelligent Eyewear 的新设计和交互方向；本条按 confirmed product 处理，但当前可用性仍是秋季发布，媒体拿到的是生产设计模型而非可实际操作的零售设备。",
  enFact: "Samsung and Google showed new Intelligent Eyewear designs and interaction direction at Galaxy Unpacked on July 22. This is treated as a confirmed product announcement, while availability remains a fall launch and the hands-on coverage used non-functioning production-design models rather than retail units.",
  zhValue: "它把 Android XR 的平台承诺压到一副更接近日常眼镜的音频型产品上：模型、手机、手表、Gemini 与隐私传感器要共同承担任务。真正的产品门槛已从“能不能做演示”转为“公众能否相信它戴在脸上”。",
  enValue: "It compresses Android XR’s platform promise into an audio-first product that looks closer to everyday eyewear. Models, phone, watch, Gemini, and privacy sensors must share the task. The product gate has moved from a demo question to whether the public trusts the device on a face.",
  zhHciLens: ["日常眼镜形态", "手机/手表协同", "相机状态可读"],
  enHciLens: ["everyday eyewear form", "phone/watch orchestration", "legible camera state"],
  zhImplication: "它解决的是“想要免手 AI、又不想佩戴一台明显的电脑”这一具体矛盾。Wear OS 手势可以把手表变成眼镜的外部输入，Gemini 负责理解所见内容，Samsung/Google 账户和手机承担重计算与数据保护。与此同时，LED、wear detection、遮挡 LED 时禁用相机等机制把公共空间的信任变成硬件流程。",
  enImplication: "The product addresses a concrete conflict: users may want hands-free AI without wearing an obviously computer-like device. Wear OS gestures can make the watch an external input surface; Gemini interprets what the wearer sees; phone, account, and cloud services supply heavier compute and data protection. At the same time, LED signalling, wear detection, and camera disablement when the LED is covered turn public trust into a hardware flow.",
  sourceDate: "2026-07-22 Samsung Galaxy Unpacked · 2026-07-22 hands-on coverage",
  evidenceLabel: "confirmed product",
  evidenceStrength: "confirmed product · official announcement · hands-on preview · privacy friction",
  visual: samsungVisual,
  sources: [
    source("Samsung Newsroom UK announcement", samsungOfficial),
    source("Google Android Galaxy Unpacked update", googleUnpacked),
    source("Android XR product surface", androidXr),
    source("Android Central hands-on", androidCentral),
    source("TechRadar first look", techRadar)
  ],
  dossierKind: "product",
  dossier: {
    zh: {
      productName: "Samsung / Google Intelligent Eyewear",
      productType: "Intelligent Eyewear 是 Samsung 与 Google 合作、由 Gentle Monster 和 Warby Parker 参与设计的 Android XR 音频型 AI 眼镜路线。7 月 22 日 Unpacked 公开了更多镜框和 Galaxy 生态协同，但没有把它描述成已经可以买到的完整零售 SKU。它更接近把 Gemini、手机、Wear OS 手表、相机和开放式音频组合成一个可穿戴入口。",
      interactionFlow: "用户戴上眼镜，通过语音让 Gemini 处理眼前所见、回答问题、调用 Maps、Interpreter、Samsung Notes 等服务；兼容 Wear OS 手表可以用手势控制眼镜，手机负责账户、数据和较重的计算。Google 还把“hands-free gesture controls”列为秋季智能眼镜体验的一部分。媒体在 Unpacked 只拿到了不能运行的生产设计模型，因此实际唤醒、确认、错误恢复、通知打断和相机快门流程尚未被独立复现。",
      specsOrStack: "官方与媒体可确认的堆栈包括 Android XR、Gemini、Samsung Galaxy 生态、Wear OS 手表控制、Maps、Interpreter、Samsung Notes、相机、开放式音频、Snapdragon AR1 Gen 1，以及 Samsung、Google、Qualcomm 共同优化电池与数据流的 Power Camp。Android Central 报道混合使用约 9 小时、充电盒可额外提供 7 次完整充电，但这属于媒体转述的估算；价格、重量、镜片、相机分辨率、麦克风数量、显示屏、IP 等级、容量、充电时间、端云分工与 API 版本均为 source not stated。",
      useCases: "具体使用场景是抬头问 Gemini 眼前的物体或环境、在行走时获得 Maps/Interpreter 的帮助、用语音记录或处理 Samsung Notes 内容，以及在不掏手机时通过手表手势触发控制。产品的目标是让用户保持视线和双手在当前活动上：购物时问商品、旅行时听翻译、通勤时接收短答案、工作时记下想法。它当前展示的是音频与手机协同价值，是否提供显示层、显示分辨率、视野叠加与空间定位，官方当前页面没有确认。",
      painPointsSolved: "它针对三个日用痛点：手机需要被拿出和解锁；耳机在长时间对话时缺乏自然的环境感知；已有 AI 眼镜常常看起来像明显的科技设备。Samsung 通过 Gentle Monster 和 Warby Parker 把镜框选择放进产品定义，Google 用 Gemini 把“所见”变成上下文，Wear OS 手势减少触摸镜腿的负担。隐私痛点则由 LED、摘下检测、覆盖 LED 时禁用相机等硬件状态处理。代价是用户需要同时信任眼镜、手机、手表、账户和云端服务。",
      newTech: "真正的新技术点是把 AI 眼镜设计成跨设备编排系统，而非孤立的语音耳机：眼镜负责感知与输出，手机提供算力与数据边界，手表提供离散手势，Gemini 提供上下文理解，Android XR 统一权限和设备形态。Power Camp 体现了三方对数据流和电池的联合优化。隐私机制也被产品化为状态机：相机正在使用时 LED 可见，用户摘下眼镜或遮挡 LED 时相机被禁用。它把“相机是否正在工作”从 App 设置提升成旁观者可观察的外部信号。",
      availability: "Samsung Newsroom 与 Google 均写明首批 Intelligent Eyewear 将在 2026 年秋季推出；Android.com 的 Android XR 页面也写明 intelligent eyewear 的首批音频眼镜将在秋季上市。当前来源没有给出价格、具体国家、零售渠道、处方镜片方案、订阅、账户要求、最低手机型号或首发软件版本。Unpacked 现场的体验模型不能证明今天可购买，也不能证明所有展示的 Gemini、手势和相机功能会同时在所有市场开放。",
      limitsOrUnknowns: "最大的未知是实际产品完成度。Android Central 明确说明手上的模型不能运行、不能佩戴；因此约 9 小时电池只是媒体引用的估算，尚未覆盖连续拍摄、多人对话、导航、翻译、噪声环境、手机断连和低电量回退。官方没有披露眼镜重量、光学件、传感器阵列、录制提示的可见距离、数据留存、第三方 API、模型选择或企业管理。相机 LED 和摘下检测的跨文化接受度也需要真实街头测试。",
      productVerdict: "Samsung / Google Intelligent Eyewear 是今天最值得追踪的 confirmed product，因为它让 Android XR 终于从开发者预告变成秋季消费产品的具体承诺；但它仍处在预发布证据层。设计方向是对的：把镜框做得像眼镜、把重计算交给手机、把输入扩展到手表、把隐私做成物理状态。购买判断必须等真实可运行设备、公开价格、配镜渠道、续航测试和公共空间误触/误录评测。"
    },
    en: {
      productName: "Samsung / Google Intelligent Eyewear",
      productType: "Intelligent Eyewear is Samsung and Google’s Android XR audio-glasses route, designed with Gentle Monster and Warby Parker. At the July 22 Unpacked event the companies showed more frames and Galaxy-ecosystem coordination, but they did not present a fully purchasable retail SKU. The product is better understood as a wearable entry point that combines Gemini, phone services, Wear OS control, camera sensing, and open-ear audio.",
      interactionFlow: "The wearer uses voice to ask Gemini about what is in view, answer questions, and reach services such as Maps, Interpreter, and Samsung Notes. A compatible Wear OS watch can control the glasses with hand gestures, while the phone supplies account state, data, and heavier computation. Google lists hands-free gesture controls as part of the fall intelligent-eyewear experience. The Unpacked hands-on coverage used non-functioning production-design models, so wake-up, confirmation, interruption, error recovery, notification priority, and camera-shutter flows have not been independently reproduced.",
      specsOrStack: "The sources support Android XR, Gemini, the Samsung Galaxy ecosystem, Wear OS watch control, Maps, Interpreter, Samsung Notes, camera, open-ear audio, Snapdragon AR1 Gen 1, and a Samsung-Google-Qualcomm Power Camp effort to optimize battery and data streaming. Android Central reports an estimated nine hours of mixed use and seven additional full charges from the case, but that is a media-reported estimate. Price, weight, lens options, camera resolution, microphone count, display, IP rating, capacity, charging time, edge/cloud split, and API versions are source not stated.",
      useCases: "Concrete jobs include asking Gemini about an object or environment while walking, receiving Maps or Interpreter help, dictating or handling Samsung Notes content, and using a watch gesture when the phone stays in a pocket. The intended posture is eyes and hands on the current activity: ask about a product while shopping, hear translation while travelling, receive a short answer during a commute, or capture a thought during work. Current evidence supports audio and phone coordination. It does not confirm a display layer, display resolution, field-of-view overlays, or spatial anchoring.",
      painPointsSolved: "The product targets three daily costs: taking out and unlocking a phone, wearing earbuds that lack natural environmental context, and using AI glasses that look unmistakably like technology. Samsung makes frame design part of the product through Gentle Monster and Warby Parker; Google turns what the wearer sees into Gemini context; Wear OS gestures reduce temple-touch dependence. Privacy is addressed through LED signalling, wear detection, and camera disablement when the LED is covered. The trade is a larger trust chain across glasses, phone, watch, account, and cloud services.",
      newTech: "The important technical move is cross-device orchestration rather than an isolated voice headset. Glasses handle sensing and output; the phone carries compute and data boundaries; the watch supplies a discrete gesture surface; Gemini supplies contextual interpretation; Android XR unifies permissions and device categories. Power Camp represents joint optimization of data streams and battery by Samsung, Google, and Qualcomm. Privacy is also productized as a state machine: the LED is visible when the camera is in use, and removing the glasses or covering the LED disables the camera. Camera status becomes an external signal that nearby people can observe, not only an app setting.",
      availability: "Samsung Newsroom and Google say the first Intelligent Eyewear collections launch in fall 2026; Android.com likewise says the first audio-glasses collections arrive this fall. The current sources do not disclose price, exact countries, retail channels, prescription-lens programs, subscriptions, account requirements, minimum phone models, or first-release software versions. An Unpacked experience model proves neither current purchase availability nor simultaneous rollout of every shown Gemini, gesture, and camera capability in every market.",
      limitsOrUnknowns: "The largest unknown is product completion. Android Central explicitly says the models could not run or be worn, so the nine-hour figure remains a media-reported estimate and has not been tested across continuous capture, multi-speaker conversation, navigation, translation, noise, phone loss, or low-battery fallback. The official material does not disclose weight, optical components, sensor array, LED visibility distance, retention policy, third-party APIs, model choice, or enterprise management. The social acceptability of camera LED and wear-detection behavior also needs real street testing across cultures.",
      productVerdict: "Samsung and Google Intelligent Eyewear is the most important confirmed product signal today because Android XR is moving from developer preview to a concrete fall consumer promise. The direction is coherent: make the frame look like eyewear, use the phone for heavy compute, use the watch for input, and make privacy a physical state. A buying verdict must wait for working retail units, public pricing, prescription channels, runtime tests, and independent testing of accidental activation and recording in public spaces."
    }
  }
};

const issue = clone(previous);
issue.date = "2026-07-23";
issue.zhTitle = "AI Daily 2026-07-23：AI 眼镜进入真机审查";
issue.enTitle = "AI Daily 2026-07-23: Intelligent Eyewear Enters the Hands-On Test";
issue.zhSummary = "Samsung / Google Intelligent Eyewear 在 Unpacked 公开新设计；Android XR、隐私硬件和多设备协同进入真实产品审查。";
issue.enSummary = "Samsung and Google show new Intelligent Eyewear designs; Android XR, hardware privacy, and multi-device orchestration enter the real product test.";
issue.tags = ["Intelligent Eyewear", "Samsung", "Google", "Android XR", "Gemini", "privacy UX", "AI glasses", "wearability"];
issue.coverStory = {
  topicId: samsung.id,
  zhTitle: "AI 眼镜进入真机审查：从平台承诺到公共空间的脸上设备",
  enTitle: "Intelligent eyewear enters the hands-on test: from platform promise to a device on the face",
  imagePath: samsungVisual.path,
  imageWidth: samsungVisual.width,
  imageHeight: samsungVisual.height,
  primarySourceUrl: samsungOfficial,
  imageSourceUrl: samsungOfficial,
  evidenceStrength: "confirmed product · official Unpacked announcement · hands-on preview · fall 2026 availability",
  whyCover: "Samsung and Google have moved Intelligent Eyewear from a Google I/O preview into a dated fall product promise. The key product question is now visible: can Android XR, Gemini, a phone, a watch, a camera LED, and a fashionable frame behave as one trustworthy daily system?",
  zhSummary: ["Samsung / Google 在 7 月 22 日公开 Gentle Monster 与 Warby Parker 设计路线，首批音频眼镜指向 2026 年秋季。", "Android Central 的现场模型不能运行；约 9 小时混合续航属于媒体估算，价格、重量、传感器和 API 仍未公开。", "相机 LED、摘下检测、遮挡 LED 时禁用相机和 Wear OS 手势，把隐私、输入与多设备协同推到产品核心。"],
  enSummary: ["Samsung and Google showed Gentle Monster and Warby Parker design routes on July 22, with first audio-glasses collections targeting fall 2026.", "Android Central handled non-functioning models; the roughly nine-hour mixed-use figure is a media estimate, while price, weight, sensors, and APIs remain undisclosed.", "Camera LED, wear detection, LED-cover disablement, and Wear OS gestures put privacy, input, and multi-device orchestration at the center of the product."]
};

issue.topics = [samsung, ...previous.topics.map((topic) => {
  const next = clone(topic);
  next.sourceDate = `${next.sourceDate} · 2026-07-23 follow-up`;
  return next;
})];
issue.designDesk = {
  zhTitle: "Design Desk：眼镜产品的下一关是跨设备状态可读性",
  enTitle: "Design Desk: The next eyewear test is legible cross-device state",
  zhIntro: "今天的设计问题集中在一条真实链路：眼镜听见什么、手机处理什么、手表触发什么、相机何时工作、Gemini 是否正在代表用户行动，都必须在任务进行中被理解。",
  enIntro: "Today’s design problem is one real chain: what the glasses heard, what the phone processed, what the watch triggered, when the camera is active, and whether Gemini is acting for the user must remain understandable during the task.",
  zhItems: [
    { label: "脸上设备需要公共可读状态", body: "Samsung 把 LED、wear detection 和遮挡 LED 时禁用相机放进产品叙事，说明隐私状态必须同时对佩戴者与旁观者可见。" },
    { label: "跨设备编排要有责任边界", body: "眼镜、手机、手表和云端协作时，用户要知道哪一层在听、哪一层在算、哪一层保存数据，以及断连后谁继续工作。" },
    { label: "低摩擦手势需要低风险回退", body: "双捏或手势启动很自然，误触后却要能快速停止、撤销、回到手机或关闭相机，确认不应被藏在第二层设置。" },
    { label: "设计合作伙伴也是产品接口", body: "Gentle Monster 与 Warby Parker 不只是外观供应商；镜框是否像日常眼镜，直接决定用户能否进入公共空间测试。" },
    { label: "预发布视觉不能冒充可用性", body: "现场外观图能证明设计方向，不能证明重量、热量、续航、相机误触、API 或公共空间接受度。" },
    { label: "模型输出要适配眼前节奏", body: "音频型眼镜的答案应短、可打断、可追问；需要长上下文时，系统应把任务转回手机或更大的屏幕。" }
  ],
  enItems: [
    { label: "A device on the face needs public state", body: "Samsung’s LED, wear detection, and LED-cover disablement show that privacy status must be legible to both wearer and bystander." },
    { label: "Cross-device orchestration needs ownership", body: "When glasses, phone, watch, and cloud cooperate, the user needs to know which layer listens, computes, stores, and continues after disconnect." },
    { label: "Low-friction gestures need low-risk fallback", body: "A double pinch or watch gesture can feel natural; after a misfire, stop, undo, return-to-phone, and camera-off must be immediate." },
    { label: "Design partners are product interfaces", body: "Gentle Monster and Warby Parker are not only style suppliers. Whether the frame looks like everyday eyewear determines whether the product can enter public testing." },
    { label: "Preview visuals cannot prove usability", body: "A launch image proves a design direction. It does not prove weight, heat, runtime, accidental capture, API access, or public acceptance." },
    { label: "Model output must fit the wearer’s rhythm", body: "Audio-glasses answers should be short, interruptible, and easy to follow up. Long context should move to the phone or a larger screen." }
  ]
};
issue.watchlistZh = [
  "Samsung Intelligent Eyewear：真实零售重量、镜片方案、价格、首发国家、9 小时续航的独立复测。",
  "Samsung / Google：相机 LED 可见距离、遮挡禁用、摘下检测、多人环境误触与数据留存。",
  "Android XR：秋季 audio glasses 与 display glasses 的 API、权限模型、断连回退和开发者工具。",
  "RayNeo、MemoMind、讯飞、Rokid：当音频、显示、相机和 AIOS 路线同时存在时，用户如何选择。",
  "社区：Meta 账户封禁、AI 质量、摄像头恐惧和购买意愿是否会影响新产品的公共接受度。"
];
issue.watchlistEn = [
  "Samsung Intelligent Eyewear: independent tests of retail weight, lens options, price, launch markets, and the nine-hour estimate.",
  "Samsung / Google: LED visibility, LED-cover disablement, wear detection, accidental activation in groups, and retention policy.",
  "Android XR: fall audio glasses and display-glasses APIs, permissions, disconnect fallback, and developer tooling.",
  "RayNeo, MemoMind, iFlytek, and Rokid: how users choose when audio, display, camera, and AIOS routes coexist.",
  "Community: whether account lockout, AI quality, camera anxiety, and purchase intent reshape public acceptance of the new products."
];

const index = issues.findIndex((item) => item.date === issue.date);
if (index >= 0) issues[index] = issue;
else issues.push(issue);
issues.sort((a, b) => b.date.localeCompare(a.date));
await fs.writeFile(issuesPath, JSON.stringify(issues, null, 2) + "\n");
console.log(`Created AI Daily ${issue.date} with ${issue.topics.length} topics.`);
