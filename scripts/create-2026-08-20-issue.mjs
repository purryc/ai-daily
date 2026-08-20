import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((entry) => entry.date === "2026-08-19");
if (!previous) throw new Error("Missing 2026-08-19 source issue");

const date = "2026-08-20";
const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "AI Daily 2026-08-20：视点正在离开眼镜，进入可移动的耳罩与相机";
issue.enTitle = "AI Daily 2026-08-20: The point of view is leaving glasses for movable cameras and earcups";
issue.zhSummary = "Razer Project Motoko 把双第一视角相机、Snapdragon、远近场麦克风和多模型兼容放进耳罩；GO Ultra 继续证明可移动相机如何承担视觉问答。今天的核心验收是：设备换了佩戴位置，视点、录制提示、权限、模型路由和失败恢复是否仍然可见。";
issue.enSummary = "Razer Project Motoko puts dual first-person cameras, Snapdragon, far/near-field microphones, and multi-model compatibility into an over-ear headset; GO Ultra continues to show how a movable camera can carry visual questions. Today’s acceptance test is whether viewpoint, capture cues, permissions, model routing, and failure recovery remain legible when the sensor changes where it is worn.";
issue.zhPath = `/ai-daily/${date}/zh/`;
issue.enPath = `/ai-daily/${date}/en/`;
issue.sourcesPath = `/ai-daily/${date}/sources.md`;
issue.sourceTypes = [...new Set([...(issue.sourceTypes ?? []), "developer surface", "startup signal"])];

for (const topic of issue.topics) {
  topic.sourceDate = `${topic.sourceDate} · 2026-08-20 current source sweep`;
}

const motoko = {
  id: "razer-project-motoko-ai-native-headset",
  section: "wild",
  zhHeadline: "Razer Project Motoko：把第一视角相机塞进耳罩，挑战眼镜的视点优势",
  enHeadline: "Razer Project Motoko puts first-person cameras in earcups and challenges the glasses viewpoint",
  zhFact: "Razer 官方把 Project Motoko 定义为 Snapdragon 驱动的 AI-native wireless headset，并公开双第一视角相机、双远近场麦克风、实时视觉理解、音频反馈和兼容 Grok、OpenAI、Gemini 等 AI 方案。官方产品页当前提供 Q2 2026 developer kit 登记入口；8 月 19 日 Windows Central 报道 Razer CEO Min-Liang Tan 表示它 coming soon。价格、量产规格、发货日和零售渠道 source not stated。",
  enFact: "Razer’s official Project Motoko page describes a Snapdragon-powered AI-native wireless headset with dual first-person-view cameras, dual far- and near-field microphones, real-time visual awareness, audio feedback, and compatibility with AI solutions including Grok, OpenAI, and Gemini. The official page offers a Q2 2026 developer-kit signup; on August 19, Windows Central reported that Razer CEO Min-Liang Tan said it is coming soon. Price, final production specifications, ship date, and retail channels are source not stated.",
  zhValue: "Motoko 的产品信号在于把相机从镜片边缘移到耳罩，并用眼睛高度的双相机匹配用户自然视线。它可以识别物体和文字、翻译菜单、追踪运动次数、总结文档，耳机本身还能保持普通听音设备的身份。这个形态可能避开处方镜片、脸部外观和部分对话隐私问题，也可能新增耳罩遮挡、旁观者不知道相机存在、相机与耳朵距离不一致等风险。今天它更接近 developer surface 与 startup signal，而非可以直接购买的 confirmed retail product。",
  enValue: "Motoko’s product signal is the relocation of cameras from the edge of lenses into earcups, with eye-level dual cameras intended to match the wearer’s natural viewpoint. Razer describes object and text recognition, menu translation, workout-rep tracking, document summarization, and ordinary headphone use in the same form. The shape may avoid prescription-lens and face-worn styling barriers and make AI conversation more private, but it also introduces occlusion, bystander awareness, and camera-position questions. Today it is best read as a developer surface and startup signal, not a confirmed retail product that people can buy.",
  zhHciLens: ["视点对齐", "耳罩隐私", "相机可见性"],
  enHciLens: ["viewpoint alignment", "earcup privacy", "camera visibility"],
  zhImplication: "当相机不再与镜片、鼻梁和眼睛共线，产品必须解释它看到的到底是不是用户正在看的东西。耳罩更像普通音频设备，旁观者可能更难察觉相机；硬件指示、物理遮挡、拍摄状态和删除路径因此比模型名称更重要。Razer 目前没有公开完整的录制灯、权限、数据保留、开发者 API、模型切换确认或断网 fallback。",
  enImplication: "When cameras no longer sit on the lens frame, bridge, and eye line, the product must explain whether the system is actually seeing what the wearer is looking at. An earcup can look like ordinary audio hardware, making the camera harder for bystanders to notice; hardware indicators, physical blocking, capture state, and deletion paths therefore matter more than the model list. Razer has not publicly exposed a complete recording light, permission flow, retention policy, developer API, model-switch confirmation, or offline fallback.",
  sourceDate: "2026-08-19 media follow-up · 2026-08-20 current source sweep",
  evidenceLabel: "developer surface",
  evidenceStrength: "developer surface · official concept/product page · startup signal",
  visual: {
    path: "assets/razer-project-motoko-official-2026-08.png",
    width: 1600,
    height: 1000,
    kind: "source-backed page screenshot",
    altZh: "Razer Project Motoko 官方产品页截图",
    altEn: "Razer Project Motoko official product page",
    captionZh: "来源追踪视觉：Razer Project Motoko 官方产品页；双第一视角相机、Snapdragon、远近场麦克风、AI 平台兼容与 Q2 2026 developer kit 入口均按官方页标注，量产与价格仍未公布。",
    captionEn: "Source-traceable visual: Razer Project Motoko official product page. Dual first-person cameras, Snapdragon, far/near-field microphones, AI-platform compatibility, and the Q2 2026 developer-kit entry follow the official page; production and pricing remain undisclosed.",
    sourceUrl: "https://www.razer.com/concepts/project-motoko"
  },
  sources: [
    { label: "Razer Project Motoko official product page", url: "https://www.razer.com/concepts/project-motoko" },
    { label: "Razer CES 2026 official announcement", url: "https://www.razer.com/newsroom/product-news/project-motoko" },
    { label: "Windows Central coming-soon follow-up", url: "https://www.windowscentral.com/hardware/razer/razer-motoko-airpods-ultra-leak-concept" },
    { label: "AP CES 2026 hands-on report", url: "https://apnews.com/article/e3de189ee1fe6b26e6a6d2dc6960afda" }
  ],
  dossierKind: "product",
  dossier: {
    zh: {
      productName: "Razer Project Motoko 是一款面向 AI-native wearable computing 的无线耳罩式 headset。Razer 官方把它放在 gaming、lifestyle 和 productivity 的交叉位置，并通过 Q2 2026 developer kit 登记入口把它从 CES 概念推进到可供开发者关注的产品表面。8 月 19 日 Windows Central 报道 Razer CEO Min-Liang Tan 称产品 coming soon，但这仍不能证明价格、发货或大规模零售已经确定。",
      productType: "产品类型是带双相机、多麦克风和 AI 计算链路的 over-ear headset。它保持耳机的听音和语音反馈形态，把视觉输入放在耳罩、接近眼睛高度的位置；与相机眼镜相比，它不要求用户改变镜片或处方配置，也不把镜框摄像头直接放在脸前。它与普通游戏耳机的边界在于，Razer 公开描述了第一视角视觉、景深、文本识别和面向机器人训练的数据能力，因此应当按可感知的 AI 设备系统评估，而不只是按音频配件评估。",
      interactionFlow: "用户佩戴 Motoko，用普通耳机方式接收音频，再通过语音或设备入口让 AI 处理视野中的对象、文字、环境声音或对话。官方描述双第一视角相机可对齐自然视线，用户可以询问菜单、文档、物体或运动状态，AI 通过耳机返回音频反馈。公开资料还描述与 Grok、OpenAI、Gemini 等方案的兼容，但没有展示完整的模型选择、权限请求、拍摄开始/停止、录制灯、历史回看、删除、交接或断网恢复流程。实际使用前必须让用户知道相机正在看什么、哪个模型在处理、回答是否来自本地或云端。",
      specsOrStack: "Razer 官方披露 Snapdragon 平台、双 eye-level first-person-view cameras、stereoscopic precision、wide field of attention、双 far-field 与 near-field microphones、实时音频反馈，以及对 Grok、OpenAI、Gemini 等 AI solutions 的兼容。官方 CES 新闻稿还把它描述为 AI-native wireless headset concept，并提到可采集带有 depth、focus 和 attention patterns 的人类 POV 数据，供 robotics teams 训练更自然的感知、运动和决策。具体 Snapdragon 型号、相机分辨率、视场角、显示/无显示方案、RAM、存储、连接协议、端云分工、续航、重量、隐私灯、API 和模型路由规则均为 source not stated。",
      useCases: "具体 use cases 包括把餐厅菜单或路牌翻译成目标语言、识别眼前物体和文字、在健身时追踪重复次数、快速总结文档、在通勤或家中进行免手问答，以及在游戏环境中让 AI 读取视野上下文。AP 在 CES 现场报道过菜单翻译和对新闻信息提问的演示；Razer 官方还把 creative work、productivity 和 robotics data collection 列为方向。对开发者，Q2 2026 developer kit 可能提供早期试验入口；对普通用户，耳罩式形态可把视觉 AI 与已有音频习惯结合。但具体 SDK、应用安装、可用地区和商业场景仍 source not stated。",
      painPointsSolved: "Motoko 试图解决相机眼镜的处方适配、脸部外观、镜片边缘视角和 AI 对话公开化问题，同时减少用户掏手机拍照、查菜单、读文字和记录运动的步骤。双相机按眼睛高度对齐，让产品主张它看到的更接近佩戴者的自然视点；耳罩扬声器也可能让回答更不容易被周围人听见。它并没有自动解决旁观者隐私，反而把相机藏在看似普通的音频耳罩里，可能让“设备是否正在拍摄”更难判断。耳罩遮挡环境声音、头部转动与视线不一致、热量和重量、模型延迟、云端费用和错误答案仍是实际成本。",
      userVoice: "AP 的 CES 报道提供了现场菜单翻译和新闻问答演示，Windows Central 的 8 月 19 日报道则把项目从概念推进到 coming soon 的媒体信号；两者都不能替代量产硬件的长期佩戴评测。当前没有足够的独立用户数据、社区交付记录、开发者 kit 反馈、真实续航或误识别统计。用户体验、舒适度、耳罩隔音、旁观者接受度和日常购买意愿暂记 source not stated。",
      newTech: "新技术组合集中在视点和形态：把双第一视角相机与耳罩结合，通过立体视觉理解深度和注意区域，再用远近场麦克风区分用户、近处对话和环境声音。Razer 还把人类 POV 数据描述为可用于机器人训练，这让 headset 同时成为交互设备和感知数据采集节点。多模型兼容把模型供应商从设备身份中拆出来，但如果没有可见的模型选择、数据流和权限边界，开放兼容也可能增加用户判断成本。",
      availability: "官方 Project Motoko 页面当前提供 Notify Me 与 Q2 2026 developer kit 登记入口；官方 CES 页面仍把它称为 concept。Windows Central 于 2026 年 8 月 19 日报道 Razer 方面称产品 coming soon。公开来源没有确认价格、量产 SKU、最终规格、发货日期、销售地区、预购、开发者 kit 费用或企业合同，因此当前可确认的是官方产品/开发者表面与媒体跟进，不是广泛零售可得。",
      limitsOrUnknowns: "关键未知包括相机是否持续工作、旁观者能否看到有效的 capture indicator、物理遮挡是否存在、麦克风如何处理隐私、AI 是否默认把画面上传云端、模型切换是否需要确认、没有网络时能否完成基本识别、耳罩是否遮挡环境预警，以及头部朝向是否会让相机视点偏离实际注意力。Razer 未公开完整 SDK、权限 API、数据保存和删除策略，也没有量产级续航、发热、重量、误触、视场和安全认证数据。机器人数据训练方向还需要单独的同意、去标识和企业隔离说明，不能直接等同于消费用户利益。",
      productVerdict: "Motoko 是本期最有辨识度的 developer surface：它把“AI 眼镜是否必须是眼镜”改写成“第一视角相机与音频反馈能否在耳罩里成立”。双相机、Snapdragon、麦克风和多模型兼容有官方证据，Q2 developer kit 让产品路线更具体；coming soon 仍来自媒体跟进，价格与量产仍未知。产品判断是强 startup signal、可验证的官方开发者方向，暂不升级为 confirmed retail product。下一步必须优先验证录制可见性、权限、端云边界、环境声音回退和长时间佩戴，而非继续堆叠模型名单。"
    },
    en: {
      productName: "Razer Project Motoko is an over-ear headset for AI-native wearable computing. Razer places it across gaming, lifestyle, and productivity, and its Q2 2026 developer-kit signup moves the idea from a CES concept toward a developer-facing product surface. Windows Central reported on August 19 that Razer CEO Min-Liang Tan called it coming soon, but that still does not establish price, shipping, or broad retail availability.",
      productType: "The product type is an over-ear headset with dual cameras, multiple microphones, and an AI processing path. It preserves the audio and spoken-feedback form of a headset while placing visual input near eye level inside the earcups. Unlike camera glasses, it does not require a prescription-lens configuration or put a camera on the visible frame in front of the face. Its boundary with an ordinary gaming headset is the company’s claim of first-person vision, depth, text recognition, and perception data for robotics training. It should therefore be evaluated as a perceptual AI system, not only as an audio accessory.",
      interactionFlow: "The wearer puts on Motoko and receives audio in the normal way, then uses voice or a device entry point to ask an AI system to process objects, text, environmental audio, or conversations in view. Razer says the dual first-person cameras align with the wearer’s natural viewpoint; the user can ask about a menu, document, object, or workout state and receive spoken feedback. The public material also describes compatibility with Grok, OpenAI, and Gemini, but does not show a complete model-selection flow, permission request, capture start and stop, recording indicator, history review, deletion, handoff, or offline recovery flow. Before daily use, the wearer needs to know what the camera is seeing, which model is processing it, and whether the answer is generated locally or in the cloud.",
      specsOrStack: "Razer discloses a Snapdragon platform, dual eye-level first-person-view cameras, stereoscopic precision, a wide field of attention, dual far-field and near-field microphones, real-time audio feedback, and compatibility with AI solutions including Grok, OpenAI, and Gemini. The CES release also calls Motoko an AI-native wireless headset concept and says it can capture human POV data containing depth, focus, and attention patterns for robotics teams training more natural perception, movement, and decision-making. The specific Snapdragon model, camera resolution, field of view, display or no-display architecture, RAM, storage, connectivity protocols, edge-cloud split, runtime, weight, privacy indicator, API, and model-routing rules are source not stated.",
      useCases: "Concrete use cases include translating a restaurant menu or street sign, recognizing objects and text, counting workout repetitions, quickly summarizing a document, asking hands-free questions while commuting or at home, and letting an AI read visual context during games. The AP CES report describes a menu-translation demonstration and questions about news information; Razer also lists creative work, productivity, and robotics data collection. For developers, the Q2 2026 kit may become an early experimentation path. For consumers, the earcup form could combine visual AI with an existing audio habit. The SDK, application-install flow, regions, and commercial workflows remain source not stated.",
      painPointsSolved: "Motoko aims at prescription constraints, face-worn styling, lens-edge viewpoint, and the public nature of speaking to an AI through camera glasses. It could reduce phone pulls for photographing, reading, translating, and tracking exercise. Eye-level camera placement is intended to make the captured view closer to the wearer’s natural viewpoint; earcup speakers may also make replies less audible to nearby people. It does not automatically solve bystander privacy. A camera hidden in what looks like ordinary audio hardware may make capture state harder to recognize. Earcup occlusion, disagreement between head direction and attention, heat, weight, latency, cloud cost, and wrong answers remain real product costs.",
      userVoice: "The AP CES report provides an on-site menu-translation and news-question demonstration, while Windows Central’s August 19 report supplies a media signal that the project has moved from concept toward coming soon. Neither substitutes for a production-hardware, long-wear review. There is not enough independent user data, developer-kit feedback, delivery history, real runtime evidence, or misrecognition statistics. User experience, comfort, earcup isolation, bystander acceptance, and purchase intent are source not stated.",
      newTech: "The new technology is a viewpoint-and-form-factor combination: dual first-person cameras in an earcup headset, stereoscopic understanding of depth and attention, and far/near-field microphones intended to separate the wearer, nearby dialogue, and ambient sound. Razer also frames human POV data as useful for robotics training, making the headset both an interaction device and a perception-data node. Multi-model compatibility separates model vendors from device identity, but without visible model choice, data flow, and permission boundaries, compatibility can increase the user’s judgment burden instead of reducing it.",
      availability: "The official Project Motoko page currently offers Notify Me and a Q2 2026 developer-kit signup; the CES announcement still calls it a concept. Windows Central reported on August 19, 2026 that Razer described the product as coming soon. Public sources do not confirm price, final production SKU, final specifications, ship date, sales regions, preorder, developer-kit fee, or enterprise terms. What is confirmed is an official product/developer surface plus a media follow-up, not broad retail availability.",
      limitsOrUnknowns: "Open questions include whether the cameras run continuously, whether bystanders can see an effective capture indicator, whether a physical blocker exists, how microphones handle privacy, whether frames default to cloud upload, whether model switching requires confirmation, whether basic recognition works without a network, whether the earcups block safety-critical ambient sound, and whether head direction diverges from attention. Razer has not published a complete SDK, permission API, retention and deletion policy, or production-grade data on runtime, heat, weight, accidental input, field of view, and safety certification. The robotics-training direction also needs explicit consent, de-identification, and enterprise-isolation rules; it cannot be treated as an automatic consumer benefit.",
      productVerdict: "Motoko is the issue’s most distinctive developer surface because it reframes whether AI glasses must be glasses as whether first-person cameras and audio feedback can work inside a headset. Dual cameras, Snapdragon, microphones, and multi-model compatibility have official support, and the Q2 developer kit makes the route more concrete. Coming soon remains a media follow-up, while price and production remain unknown. Verdict: a strong startup signal with a verifiable official developer direction, not a confirmed retail product. The next proof should be capture visibility, permissions, edge-cloud boundaries, ambient-audio fallback, and long-wear behavior—not another list of model names."
    }
  }
};

issue.topics.unshift(motoko);
issue.coverStory = {
  topicId: motoko.id,
  zhTitle: "Motoko：当第一视角相机离开眼镜，耳罩能否成为新的 AI 入口？",
  enTitle: "Motoko: can an earcup become the next AI entry point when first-person cameras leave glasses?",
  zhSummary: [
    "Razer 把双第一视角相机、立体视觉、远近场麦克风与 Snapdragon 放进耳罩，官方产品页已开放 Q2 2026 developer kit 登记。",
    "它把眼镜的视点优势带进耳机，却让旁观者更难判断设备何时在看、录和上传。",
    "今天的验收点不是模型兼容数量，而是录制可见性、视点对齐、权限边界、环境声音与断网恢复。"
  ],
  enSummary: [
    "Razer puts dual first-person cameras, stereoscopic vision, far/near-field microphones, and Snapdragon into an earcup headset, with a Q2 2026 developer-kit signup on the official page.",
    "It imports the glasses viewpoint into headphones while making it harder for bystanders to know when the device is seeing, recording, or uploading.",
    "The acceptance test is not the model-compatibility list; it is capture visibility, viewpoint alignment, permissions, ambient sound, and offline recovery."
  ],
  imagePath: motoko.visual.path,
  imageWidth: motoko.visual.width,
  imageHeight: motoko.visual.height,
  imageSourceUrl: motoko.visual.sourceUrl,
  primarySourceUrl: motoko.visual.sourceUrl,
  evidenceStrength: motoko.evidenceStrength,
  whyCover: "It is the clearest current product signal that the wearable-AI race is moving the camera, not only the model, into a new body position."
};

issue.watchlistZh = [
  "Razer Project Motoko：Q2 developer kit 的真实开放范围、相机录制提示、模型路由、价格与量产时间。",
  "GO Ultra：AI Voice Assistant 的地区/语言 rollout、端云选择和真实响应延迟。",
  "摄像头 AirPods 弱信号：是否出现 Apple 官方公告、录制指示、权限与删除路径。",
  ...issue.watchlistZh.filter((item) => !item.includes("GO Ultra") && !item.includes("AirPods"))
];
issue.watchlistEn = [
  "Razer Project Motoko: real Q2 developer-kit access, capture indicators, model routing, pricing, and production timing.",
  "GO Ultra: region/language rollout, edge-cloud choice, and real response latency for AI Voice Assistant.",
  "Camera-equipped AirPods weak signal: whether Apple publishes an official announcement, recording cue, permissions, and deletion path.",
  ...issue.watchlistEn.filter((item) => !item.includes("GO Ultra") && !item.includes("AirPods"))
];

const nextIssues = [issue, ...issues.filter((entry) => entry.date !== date)];
await fs.writeFile(dataPath, `${JSON.stringify(nextIssues, null, 2)}\n`);
console.log(`Prepared ${date}: ${issue.topics.length} topics, ${new Set(issue.topics.flatMap((topic) => topic.sources.map((source) => source.url))).size} unique topic sources, ${new Set([issue.coverStory.imagePath, ...issue.topics.map((topic) => topic.visual.path)]).size} visuals.`);
