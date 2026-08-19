import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((entry) => entry.date === "2026-08-18");
if (!previous) throw new Error("Missing 2026-08-18 source issue");

const date = "2026-08-19";
const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "AI Daily 2026-08-19：让观察链路在移动中保持可见";
issue.enTitle = "AI Daily 2026-08-19: Keep the observation loop visible while it moves";
issue.zhSummary = "GO Ultra 把 Gemini 语音、翻译与视觉问答放进一枚可移动相机；今天的跨源扫描继续追踪眼镜、耳戴设备、空间计算与端侧感知的边界。正式产品仍在证明视点、网络、权限和恢复，摄像头 AirPods 只停留在 weak/unverified scan，不升级为 Apple 产品事实。";
issue.enSummary = "GO Ultra puts Gemini voice, translation, and visual questions into a movable camera. Today’s cross-lane scan follows the boundary between glasses, camera earbuds, spatial computing, and edge perception. Shipped products still have to prove viewpoint, network, permissions, and recovery; camera-equipped AirPods remain a weak/unverified scan, not an Apple product fact.";
issue.zhPath = `/ai-daily/${date}/zh/`;
issue.enPath = `/ai-daily/${date}/en/`;
issue.sourcesPath = `/ai-daily/${date}/sources.md`;
issue.sourceTypes = [...new Set([...(issue.sourceTypes ?? []), "weak/unverified"])]

for (const topic of issue.topics) {
  topic.sourceDate = `${topic.sourceDate} · 2026-08-19 current source sweep`;
}

const community = issue.topics.find((topic) => topic.id === "community-ai-glasses-2026-07-20-scan");
if (!community) throw new Error("Missing community scan topic");
const airpodsUrl = "https://www.techradar.com/audio/these-things-arent-meant-to-take-pictures-as-a-fresh-clip-of-camera-equipped-airpods-leaks-people-appear-to-have-already-made-their-minds-up-whatever-the-experts-say";
community.sourceDate = "2026-08-18 leak report · 2026-08-19 weak-signal scan";
community.evidenceLabel = "weak/unverified";
community.evidenceStrength = "weak/unverified · reported leak · no official product page";
if (!community.sources.some((source) => source.url === airpodsUrl)) {
  community.sources.push({
    label: "TechRadar camera-equipped AirPods leak report",
    url: airpodsUrl,
    type: "weak/unverified"
  });
}
community.zhHeadline = "弱信号扫描：摄像头 AirPods 泄漏把隐私摩擦提前带到耳边";
community.enHeadline = "Weak-signal scan: camera-equipped AirPods bring privacy friction to the ear before launch";
community.zhFact = `${community.zhFact} 8 月 18 日 TechRadar 报道一段被称为摄像头 AirPods 的视频，并指出公众对耳戴摄像头的隐私接受度已经成为产品风险；报道没有 Apple 官方产品页、型号、规格、价格、发布日期或可购买证据。`;
community.enFact = `${community.enFact} On August 18, TechRadar reported a video described as camera-equipped AirPods and framed public privacy acceptance as a product risk. The report provides no Apple product page, model, specification, price, release date, or purchase evidence.`;
community.zhValue = "它是 source-lane scan：把“耳朵附近的摄像头是否比眼镜更容易被接受”列为待验证问题，而不是宣布 Apple 已经发布新硬件。下一步要看官方公告、开发者 API、录制指示和用户可见的权限/删除路径。";
community.enValue = "This is a source-lane scan: it turns the question of whether a camera near the ear is more socially acceptable than camera glasses into a validation task, not an Apple launch claim. The next evidence is an official announcement, developer surface, recording indicator, and visible permission and deletion path.";
community.zhHciLens = ["泄漏边界", "隐私提示", "等待官方证据"];
community.enHciLens = ["leak boundary", "privacy cues", "wait for official evidence"];
community.zhImplication = "当设备形态从眼镜移动到耳机，旁观者仍需要理解摄像头何时工作；报道只证明风险被讨论，不能证明消费者接受度或产品可用性。";
community.enImplication = "When the sensor moves from glasses to earbuds, bystanders still need to understand when a camera is active; the report proves discussion of risk, not consumer acceptance or product availability.";
community.visual.captionZh = "社区摩擦视觉：继承的 Reddit 眼镜 agent 截图用于说明旁观者提示与权限问题；摄像头 AirPods 仅作为文字 weak/unverified scan，没有可复现产品图。";
community.visual.captionEn = "Community-friction visual: an inherited Reddit glasses-agent screenshot illustrates bystander cues and permissions; camera-equipped AirPods remain a text-only weak/unverified scan with no reproducible product visual.";
community.dossier.zh.productName = "摄像头 AirPods 传闻扫描";
community.dossier.en.productName = "Camera-equipped AirPods rumor scan";
community.dossier.zh.productType = "weak/unverified 的媒体与泄漏扫描，不是已确认产品。";
community.dossier.en.productType = "A weak/unverified media and leak scan, not a confirmed product.";
community.dossier.zh.interactionFlow = "TechRadar 描述一段被称为摄像头 AirPods 的视频；公开材料没有展示稳定的用户流程、录制状态、权限请求、相片查看或删除路径。可验证的交互流程 source not stated。";
community.dossier.en.interactionFlow = "TechRadar describes a video presented as camera-equipped AirPods; the public material does not show a stable user flow, recording state, permission request, photo review, or deletion path. A verifiable interaction flow is source not stated.";
community.dossier.zh.specsOrStack = "没有 Apple 官方型号、相机位置、传感器、芯片、OS/API、连接方式、端云分工或模型信息；所有未披露参数均为 source not stated。";
community.dossier.en.specsOrStack = "There is no Apple-confirmed model, camera location, sensor, chip, OS/API, connectivity path, edge-cloud split, or model information; undisclosed parameters are source not stated.";
community.dossier.zh.useCases = "当前只能把免手拍摄、视觉理解和环境记录列为被报道的潜在 use cases，不能把它们写成已验证能力；下一步应要求官方 demo 与开发者文档。";
community.dossier.en.useCases = "Hands-free capture, visual understanding, and ambient recording can only be listed as reported potential use cases, not verified capabilities; the next step is an official demo and developer documentation.";
community.dossier.zh.painPointsSolved = "报道把手机掏出和眼镜佩戴的替代想象写出来，但没有证明耳戴摄像头解决了任何真实用户痛点；隐私与误拍可能新增成本。";
community.dossier.en.painPointsSolved = "The report imagines an alternative to pulling out a phone or wearing camera glasses, but it does not prove that camera earbuds solve a real user pain; privacy and accidental capture may add cost.";
community.dossier.zh.newTech = "没有足够证据确认新技术；保留 weak/unverified 标签。";
community.dossier.en.newTech = "No new technology is confirmed; retain the weak/unverified label.";
community.dossier.zh.availability = "没有 Apple 官方发布、预购、售价、地区或出货证据；source not stated。";
community.dossier.en.availability = "There is no Apple announcement, preorder, price, region, or shipping evidence; source not stated.";
community.dossier.zh.limitsOrUnknowns = "视频来源、原始硬件、录制灯、旁观者提示、权限、数据保留、误触和法规都未得到独立验证；该项只能作为 watch item。";
community.dossier.en.limitsOrUnknowns = "The video provenance, original hardware, recording light, bystander cue, permissions, retention, accidental activation, and regulatory posture are not independently verified; keep it as a watch item.";
community.dossier.zh.productVerdict = "降级为 weak/unverified source-lane scan。它提醒产品团队先解决社会可见性与删除路径，再讨论耳戴摄像头是否值得成为新形态。";
community.dossier.en.productVerdict = "Downgrade it to a weak/unverified source-lane scan. It reminds product teams to solve social visibility and deletion before treating camera earbuds as a new form factor.";
community.dossier.zh.userVoice = "TechRadar 报道的公众反应与评论只代表媒体叙述和当下讨论，不能当作用户研究、销量或市场接受度。";
community.dossier.en.userVoice = "The public reaction described by TechRadar and its comments represent media framing and current discussion, not user research, sales, or market acceptance.";

const cover = issue.topics.find((topic) => topic.id === "insta360-go-ultra-ai-voice-assistant");
issue.coverStory = {
  topicId: cover.id,
  zhTitle: "GO Ultra：移动的相机，正在承担一部分眼镜 agent 工作",
  enTitle: "GO Ultra: a movable camera takes on part of the glasses agent job",
  zhSummary: [
    "AI Voice Assistant 通过 Gemini、实时翻译和 Ask with Photo，把相机从拍摄工具推向可询问的空间节点。",
    "它保留了相机可摘下、可转交与可回看的属性，减少必须把摄像头固定在脸上的压力。",
    "今天的验收点是 rollout 覆盖、端云边界、设备朝向、隐私提示与网络失败后的恢复。"
  ],
  enSummary: [
    "AI Voice Assistant connects Gemini, real-time translation, and Ask with Photo to move a camera from capture tool toward an addressable spatial node.",
    "The camera can be clipped, removed, handed to someone else, and reviewed later, reducing the need to keep a sensor fixed to the face.",
    "Today’s acceptance test is rollout coverage, edge-cloud boundaries, camera orientation, privacy cues, and recovery after network failure."
  ],
  imagePath: cover.visual.path,
  imageWidth: cover.visual.width,
  imageHeight: cover.visual.height,
  imageSourceUrl: cover.visual.sourceUrl,
  primarySourceUrl: cover.visual.sourceUrl,
  evidenceStrength: "confirmed product update · official support + review report",
  whyCover: "It is a concrete product update: software gives a movable camera an assistant surface while the weak AirPods leak keeps the privacy boundary explicit."
};

issue.watchlistZh = [
  "GO Ultra：AI Voice Assistant 的地区/语言 rollout、端云选择和真实响应延迟。",
  "摄像头 AirPods 弱信号：是否出现 Apple 官方公告、录制指示、权限与删除路径。",
  "SLT 2026 SmartGlasses Challenge：多说话人基准是否进入真实眼镜 SDK 与产品测试。",
  ...issue.watchlistZh.filter((item) => !item.includes("GO Ultra") && !item.includes("SLT 2026"))
];
issue.watchlistEn = [
  "GO Ultra: region/language rollout, edge-cloud choice, and real response latency for AI Voice Assistant.",
  "Camera-equipped AirPods weak signal: whether Apple publishes an official announcement, recording cue, permissions, and deletion path.",
  "SLT 2026 SmartGlasses Challenge: whether multi-speaker benchmarks enter real glasses SDKs and product tests.",
  ...issue.watchlistEn.filter((item) => !item.includes("GO Ultra") && !item.includes("SLT 2026"))
];

const nextIssues = [issue, ...issues.filter((entry) => entry.date !== date)];
await fs.writeFile(dataPath, `${JSON.stringify(nextIssues, null, 2)}\n`);
console.log(`Prepared ${date}: ${issue.topics.length} topics, ${new Set(issue.topics.flatMap((topic) => topic.sources.map((source) => source.url))).size} unique topic sources, ${new Set([issue.coverStory.imagePath, ...issue.topics.map((topic) => topic.visual.path)]).size} visuals.`);
