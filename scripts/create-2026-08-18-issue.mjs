import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((issue) => issue.date === "2026-08-13");
if (!previous) throw new Error("Missing 2026-08-13 source issue");

const issue = structuredClone(previous);
const date = "2026-08-18";
issue.date = date;
issue.zhTitle = "AI Daily 2026-08-18：相机开始接管眼镜的一部分工作";
issue.enTitle = "AI Daily 2026-08-18: The camera starts taking on part of the glasses job";
issue.zhSummary = "Insta360 GO Ultra 通过 Gemini 语音助手、实时翻译与视觉问答，把一枚可移动相机推向随身 agent；与此同时，眼镜 checkout demo 暴露了端侧与云端、条码稳定性和自然动作之间的真实摩擦。今天的 issue 继续追踪 Android XR、AI 眼镜、腕上反馈、物品定位和研究基准如何拼成一条可恢复的观察链路。";
issue.enSummary = "Insta360’s GO Ultra uses a Gemini voice assistant, real-time translation, and visual questions to push a movable camera toward a wearable agent. At the same time, a glasses checkout demo exposes the real friction between edge and cloud inference, barcode stability, and natural motion. Today’s issue follows how Android XR, AI glasses, wrist feedback, object finding, and new benchmarks fit into a recoverable observation loop.";
issue.zhPath = `/ai-daily/${date}/zh/`;
issue.enPath = `/ai-daily/${date}/en/`;
issue.sourcesPath = `/ai-daily/${date}/sources.md`;
issue.sourceTypes = ["official", "Google Store", "hands-on review", "community", "wild", "research", "patent watch", "China", "global"];

for (const topic of issue.topics) {
  topic.sourceDate = `${topic.sourceDate} · 2026-08-18 current source sweep`;
}

const go = issue.topics.find((topic) => topic.id === "insta360-go-ultra-ai-voice-assistant");
if (!go) throw new Error("Missing GO Ultra topic");
go.sourceDate = "2026-08-07 rollout · 2026-08-10 official support check · 2026-08-18 T3 and community sweep";
go.evidenceStrength = "official store/support + review report + community friction";
go.sources.push({
  label: "r/SmartGlasses checkout vision demo",
  url: "https://www.reddit.com/r/SmartGlasses/comments/1vqu1he/pov_thirdperson_view_of_my_ai_glasses_checkout/",
  type: "community friction"
});
go.dossier.zh.userVoice = `${go.dossier.zh.userVoice ?? "用户原声：source not stated。"} 8 月 18 日扫描到的 r/SmartGlasses checkout demo 又把摩擦具体化：作者说明云端版本整体更好但有网络延迟，条码需要更稳定的视野，而自然视觉识别更接近用户拿起商品就继续走的动作。评论还追问端侧处理、云端无状态帧传输和隐私，这些是社区开发者的实现说明与讨论，不是通用产品性能结论。`;
go.dossier.en.userVoice = `${go.dossier.en.userVoice ?? "User voice is source not stated. "}An August 18 r/SmartGlasses checkout demo makes the friction concrete: the cloud version performs better but adds network latency, while barcode scanning needs a steadier view than natural motion. Comments ask about on-device processing, stateless cloud frames, and privacy. This is a developer-community signal, not a general product-performance result.`;
go.dossier.zh.newTech += " 本次更新把可移动视点与语音、视觉、翻译接到同一条相机路径；设备朝向、网络延迟和交接状态因此成为界面状态。";
go.dossier.en.newTech += " The update connects a movable viewpoint to voice, vision, and translation; orientation, network delay, and handoff become interface state.";
go.dossier.zh.limitsOrUnknowns += " T3 称 rollout 可能因地区和语言变化；新语音助手的离线能力与模型路由 source not stated。";
go.dossier.en.limitsOrUnknowns += " T3 says rollout varies by region and language; offline behavior and model routing remain source not stated.";

const community = issue.topics.find((topic) => topic.id === "community-ai-glasses-2026-07-20-scan");
if (community) {
  community.sourceDate = "2026-08-18 community sweep";
  community.sources.push({
    label: "r/SmartGlasses checkout app discussion",
    url: "https://www.reddit.com/r/SmartGlasses/comments/1vqu1he/pov_thirdperson_view_of_my_ai_glasses_checkout/",
    type: "community friction"
  });
  community.dossier.zh.userVoice = `${community.dossier.zh.userVoice ?? "source not stated。"} 今日新增的 checkout 讨论显示，用户期待的是拿起商品、自然看一眼、得到价格或支付下一步，而不是为了条码把物品对准镜头；开发者同时说明云端版更强但有延迟，端侧版更私密但受模型与硬件限制。这组讨论是社区 friction signal，不能替代正式可用性研究。`;
  community.dossier.en.userVoice = `${community.dossier.en.userVoice ?? "User voice is source not stated. "}Today’s checkout discussion shows that users want to pick up an item, glance at it naturally, and receive a price or payment next step rather than orienting a barcode precisely toward the camera. The developer also says the cloud version is stronger but slower, while on-device processing is more private but bounded by model and hardware limits. This is a community-friction signal, not a formal usability study.`;
}

const research = issue.topics.find((topic) => topic.id === "openglass-on-device-event-vision-research");
if (research) {
  research.sourceDate = "2026-08-12 arXiv submission · 2026-08-18 research sweep";
  research.sources.push({
    label: "SLT 2026 SmartGlasses Challenge",
    url: "https://arxiv.org/abs/2608.12034",
    type: "research"
  });
  research.dossier.zh.userVoice = `${research.dossier.zh.userVoice ?? "用户原声：source not stated。"} 8 月 12 日提交的 SLT 2026 SmartGlasses Challenge 把研究重点从单人看见什么推进到第一视角多说话人理解：论文使用 106 小时、714 场 session 的四通道第一视角语音数据，评估带时间戳的说话人归属 ASR 与 spoken-language understanding，并指出说话人重叠和复杂声学环境仍是主要难点。它是研究基准，不是消费产品性能承诺。`;
  research.dossier.en.userVoice = `${research.dossier.en.userVoice ?? "User voice is source not stated. "}The SLT 2026 SmartGlasses Challenge submitted on August 12 moves the research target from what a single wearer can see to egocentric multi-speaker understanding. The paper uses a 106-hour, 714-session, four-channel egocentric speech dataset and evaluates time-stamped speaker-attributed ASR and spoken-language understanding; speaker overlap and complex acoustics remain major difficulties. It is a research benchmark, not a consumer-product performance promise.`;
}

const cover = issue.topics.find((topic) => topic.id === "insta360-go-ultra-ai-voice-assistant");
issue.coverStory = {
  topicId: cover.id,
  zhTitle: "GO Ultra：一枚可移动相机，开始承担眼镜的 agent 工作",
  enTitle: "GO Ultra: a movable camera starts doing part of the glasses agent job",
  zhSummary: [
    "AI Voice Assistant 通过 Gemini、实时翻译和 Ask with Photo，把相机从拍摄工具推向可询问的空间节点。",
    "它保留了相机的可摘下、可转交与可回看属性，减少必须把摄像头固定在脸上的压力。",
    "真正的验收点是 rollout 覆盖、端云边界、设备朝向、隐私提示与网络失败后的恢复。"
  ],
  enSummary: [
    "AI Voice Assistant connects Gemini, real-time translation, and Ask with Photo to move a camera from capture tool toward an addressable spatial node.",
    "The camera can be clipped, removed, handed to someone else, and reviewed later, reducing the need to keep a sensor fixed to the face.",
    "The acceptance test is rollout coverage, edge/cloud boundaries, camera orientation, privacy cues, and recovery when the network fails."
  ],
  imagePath: cover.visual.path,
  imageWidth: cover.visual.width,
  imageHeight: cover.visual.height,
  imageSourceUrl: cover.visual.sourceUrl,
  primarySourceUrl: cover.visual.sourceUrl,
  evidenceStrength: "confirmed product update · official support + review report",
  whyCover: "It shows an AI-device shift that is concrete today: software turns a small camera into a movable assistant without requiring a new glasses form factor."
};

issue.designDesk = {
  zhTitle: "设计台：让观察链路可以移动，也可以停下来",
  enTitle: "Design Desk: make the observation loop movable and stoppable",
  zhIntro: "把相机、网络、动作、反馈和恢复当成一条可观察的产品链路。",
  enIntro: "Treat camera, network, action, feedback, and recovery as one observable product loop.",
  zhItems: [
    { label: "视点", body: "相机可以夹在衣物、手持或转交，系统要显示当前谁在看、谁在说。" },
    { label: "网络", body: "端侧与云端不是后台实现差异，而是速度、隐私和能力的用户选择。" },
    { label: "动作", body: "自然拿起商品比对准条码更接近真实流程，识别必须容忍移动和遮挡。" },
    { label: "反馈", body: "翻译、视觉问答、健康趋势和近场定位要区分实时结果、长期推断与历史位置。" },
    { label: "恢复", body: "无网、错听、错认和设备交接时，用户要能回到拍摄、人工搜索或手机路径。" }
  ],
  enItems: [
    { label: "Viewpoint", body: "The camera may be clipped, handheld, or handed over; the system should show who is looking and speaking." },
    { label: "Network", body: "Edge versus cloud is a user-facing choice about speed, privacy, and capability, not just an implementation detail." },
    { label: "Action", body: "Naturally picking up an item is closer to real behavior than aiming at a barcode; recognition must tolerate motion and occlusion." },
    { label: "Feedback", body: "Translation, visual questions, health trends, and near-field finding should separate live results, longitudinal inference, and historical location." },
    { label: "Recovery", body: "When offline, misunderstood, misrecognized, or handed over, the user needs a camera, manual-search, or phone fallback." }
  ]
};
issue.watchlistZh = [
  "Insta360 GO Ultra：AI Voice Assistant 的地区/语言 rollout、端云选择和实际响应延迟。",
  "r/SmartGlasses checkout demo：自然视觉识别能否在移动、遮挡和隐私要求下稳定工作。",
  "SLT 2026 SmartGlasses Challenge：多说话人基准是否进入真实眼镜 SDK 与产品测试。",
  ...issue.watchlistZh.filter((item) => !item.startsWith("Loomos"))
];
issue.watchlistEn = [
  "Insta360 GO Ultra: region/language rollout, edge-cloud choice, and real response latency for AI Voice Assistant.",
  "r/SmartGlasses checkout demo: whether natural vision survives motion, occlusion, and privacy requirements.",
  "SLT 2026 SmartGlasses Challenge: whether multi-speaker benchmarks enter real glasses SDKs and product tests.",
  ...issue.watchlistEn.filter((item) => !item.startsWith("Loomos"))
];

const nextIssues = [issue, ...issues.filter((entry) => entry.date !== date)];
await fs.writeFile(dataPath, `${JSON.stringify(nextIssues, null, 2)}\n`);
console.log(`Prepared ${date}: ${issue.topics.length} topics, ${new Set(issue.topics.flatMap((topic) => topic.sources.map((item) => item.url))).size} unique topic sources, ${new Set([issue.coverStory.imagePath, ...issue.topics.map((topic) => topic.visual.path)]).size} visuals.`);
