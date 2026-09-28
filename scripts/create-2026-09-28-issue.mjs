import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-28";
const previousDate = "2026-09-25";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const previousDeck = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`);

const source = (label, url, type) => ({ label, url, type });
const visual = (file, kind, altZh, altEn, captionZh, captionEn, sourceUrl) => ({
  path: `assets/${file}`, width: 1600, height: 900, kind, altZh, altEn, captionZh, captionEn, sourceUrl
});
const product = (input) => ({ dossierKind: "product", ...input });

const urls = {
  qwenHardware: "https://www.alibabacloud.com/blog/alibaba-unveils-agentic-computer-ai-wearables-and-more-at-2026-apsara-conference_603599",
  qwenIntelligence: "https://www.alibabacloud.com/blog/alibaba-launches-qwen-intelligence-to-power-next-generation-agentic-smartphones_603597",
  honorMagic9: "https://www.honor.com/cn/activity/honor-magic9-series-launch/",
  honorNotice: "https://www.honor.com/cn/m/notice-18131",
  prism: "https://techcrunch.com/2026/09/24/prismml-brings-its-tiny-llms-to-qualcomm-powered-smart-glasses/",
  prismSite: "https://www.prismlabs.ai/",
  research: "https://arxiv.org/abs/2609.19793"
};

const visuals = {
  qwenHardware: visual(
    "alibaba-qwen-book-wearables-a2-official-2026-09-28.png", "source-backed official page screenshot",
    "Alibaba Cloud Community 对 Qwen Book、Qwen 眼镜与 QwenNote A2 的官方产品说明截图", "Alibaba Cloud Community official product page for Qwen Book, Qwen glasses, and QwenNote A2",
    "官方视觉：Alibaba 将 Qwen Book、Qwen 眼镜、Qwen Clip 与 QwenNote A2 放进同一套 Agent 终端组合；具体硬件以各产品页为准。",
    "Official visual: Alibaba presents Qwen Book, Qwen glasses, Qwen Clip, and QwenNote A2 as one agent-terminal lineup; each product still needs its own hardware evidence.", urls.qwenHardware
  ),
  qwenIntelligence: visual(
    "alibaba-qwen-intelligence-honor-official-2026-09-28.png", "source-backed official developer screenshot",
    "Alibaba Qwen Intelligence 面向 agentic smartphone 的官方说明截图", "Alibaba's official Qwen Intelligence page for agentic smartphones",
    "开发者视觉：Qwen Intelligence 被描述为覆盖模型、harness、Agent 与手机系统协作的全栈方案，HONOR 是首个合作方。",
    "Developer visual: Qwen Intelligence is described as a full-stack solution spanning models, harness, agents, and phone-system cooperation; HONOR is the first partner.", urls.qwenIntelligence
  ),
  honor: visual(
    "honor-magic9-official-launch-2026-09-28.png", "source-backed official product page screenshot",
    "荣耀 Magic9 系列官方发布页截图", "HONOR Magic9 Series official launch page",
    "官方视觉：荣耀 Magic9 发布页展示第三代自研射频增强芯片 C3 与七芯射频 AI 调度架构；AI Agent 能力仍需以发布会与实机为准。",
    "Official visual: HONOR's Magic9 launch page highlights the third-generation C3 RF enhancement chip and seven-core RF AI scheduling; agent behaviour still needs launch and hands-on evidence.", urls.honorMagic9
  ),
  prism: visual(
    "prismml-bonsai-smart-glasses-techcrunch-2026-09-28.png", "source-backed review/tech media screenshot",
    "TechCrunch 对 PrismML Bonsai 在 Snapdragon AR1 智能眼镜上运行的报道截图", "TechCrunch report on PrismML Bonsai running on Snapdragon AR1 smart glasses",
    "媒体视觉：TechCrunch 报道 PrismML 在 Snapdragon AR1 Gen 1 平台上演示 1-bit Bonsai 视觉语言模型；报道同时说明尚未宣布可购买的眼镜。",
    "Media visual: TechCrunch reports a 1-bit Bonsai vision-language model demo on Snapdragon AR1 Gen 1; the report also says no shippable glasses have been announced.", urls.prism
  )
};

const freshTopics = [
  product({
    id: "alibaba-qwen-book-agentic-computer-2026-09-28",
    section: "china",
    evidenceLabel: "confirmed product",
    sourceDate: "2026-09-25",
    evidenceStrength: "Alibaba Cloud Community product announcement; preorder and sale dates are company-reported",
    zhHeadline: "Qwen Book：把 Agent 写进电脑的系统栈",
    enHeadline: "Qwen Book treats the operating system as an agent harness",
    zhFact: "Alibaba 在 2026 Apsara Conference 发布 Qwen Book，把 Qwen 模型、Qwen Desktop OS、应用和云服务组合成 agentic computer。官方示例是用户通过兼作麦克风的手写笔发出编辑演示文稿的语音指令，系统从云端找到文件和具体页面，调用工具完成修改，用户再在手机上检查和批准。Qwen Book 的具体零售价、芯片、屏幕、重量、续航和上市地区没有在该页面完整公开。",
    enFact: "At the 2026 Apsara Conference, Alibaba introduced Qwen Book as an agentic computer that combines Qwen models, Qwen Desktop OS, applications, and cloud services. The official example has a user speak through a stylus that also acts as a microphone; Qwen Book retrieves a deck from the cloud, finds the exact slide, invokes the relevant editing tools, and lets the user review and approve the changes on a phone. The page does not provide a complete retail specification, price, chipset, display, weight, battery, or regional availability.",
    zhValue: "Qwen Book 的核心变化是把 Agent 从一个桌面应用提升到“系统作为执行外壳”：文件定位、上下文、工具调用和权限不再由用户手动拼接。它针对的是办公任务里反复切换文件、应用和云端的摩擦，尤其是需要找到正确对象再执行多步编辑的工作。风险是系统级 Agent 一旦拿到文件和工具权限，用户必须理解它读了哪些上下文、改了什么、何时已经执行，以及手机批准是否真的能阻止后台动作。",
    enValue: "Qwen Book's central move is to elevate the agent from a desktop application to an operating-system execution shell. File retrieval, context, tool invocation, and approval are no longer assembled manually by the user. That targets the repeated switching involved in office work, especially tasks that require finding the right object before making a multi-step edit. The risk is equally system-level: once an agent can read files and call tools, people need to understand what context it used, what changed, when an action already happened, and whether phone approval truly blocks background execution.",
    zhHciLens: ["入口：手写笔语音与桌面 OS", "上下文：云端文件、当前页面、应用状态", "动作：定位、编辑、跨设备批准", "边界：权限、撤销、后台执行"],
    enHciLens: ["Entry: stylus voice and desktop OS", "Context: cloud files, current slide, app state", "Action: locate, edit, approve across devices", "Boundary: permission, undo, background execution"],
    zhImplication: "Qwen Book 把桌面 Agent 的验收从“回答是否正确”改成“它是否拿到了正确对象并留下可审计的修改轨迹”。设计上需要对象级预览、动作计划、差异对比、手机批准和一键撤销，而不是只给一个完成提示。若 Agent 能跨应用执行，系统还要明确哪些动作是模拟点击、哪些是原生 API、哪些会把数据发送到云端。",
    enImplication: "Qwen Book changes the acceptance test for a desktop agent from whether an answer sounds right to whether it selected the right object and left an auditable change trail. The interface needs object-level previews, an action plan, diffs, phone approval, and one-step undo rather than a generic completion toast. If the agent acts across applications, the system must also distinguish simulated clicks, native APIs, and actions that send data to the cloud.",
    visual: visuals.qwenHardware,
    sources: [source("Alibaba Cloud Community: Qwen Book and AI wearables", urls.qwenHardware, "china"), source("Alibaba Cloud Apsara Conference exhibition", "https://www.alibabacloud.com/en/apsara-conference/2026-exhibition?_p_lc=1", "official"), source("Alibaba full-stack AI roadmap", "https://www.alibabacloud.com/en/press-room/alibaba-unveils-roadmap-on-full-stack-ai-strategy", "official")],
    dossier: {
      zh: {
        productName: "Qwen Book",
        productType: "Qwen Book 是 Alibaba 在 2026 Apsara Conference 展示的 AI-native agentic computer。官方将它描述为由 Qwen 模型、Qwen Desktop OS、原生应用和云服务组成的一体化系统，并用“OS as Harness”解释其定位：接口、上下文、运行时以及对软件和硬件的控制都为 Agent 执行任务准备。它是具体产品发布，不等于已公开完整零售规格。",
        interactionFlow: "官方示例是用户在编辑演示文稿时，通过兼作麦克风的手写笔发出语音要求；Qwen Book 自动从云端检索文件，找到准确页面，调用适当工具修改内容，随后用户可以在手机上查看并批准。这个流程把“找文件—找页面—执行—移动端复核”串成一个跨设备任务。公开页面没有完整展示唤醒、权限提示、动作计划、撤销、离线、失败恢复、多人协作和手机批准是否阻断后台执行，因此这些部分保持未知。",
        specsOrStack: "已披露的系统栈包括 Qwen 模型、Qwen Desktop OS、应用、云服务、手写笔麦克风、桌面工具调用和手机批准入口。官方没有在该产品说明中给出芯片、内存、存储、屏幕尺寸、分辨率、重量、续航、网络制式、端侧模型、价格、地区、开放 API 或 SDK；这些细节写作 source not stated。Qwen Book 的“OS as Harness”是架构表述，不应被推断为所有推理都在本地完成。",
        useCases: "明确示例是从云端找到演示文稿并编辑准确页面。按照这一产品路径，办公用户还可能用它定位表格、调用应用工具、整理云端资料、生成文档草稿，再从手机批准高风险变化；但这些扩展不是该页面逐一确认的功能。对用户最有价值的不是聊天，而是让 Agent 认识文件、应用和当前工作状态，减少跨窗口寻找对象的时间。",
        painPointsSolved: "Qwen Book 针对桌面工作的对象定位和跨应用切换摩擦：用户不必先打开云盘、搜索文件、翻到页面、启动编辑工具，再手工传递上下文。它也把移动端批准拉进桌面执行链，试图让用户在离开电脑后继续监管任务。代价是系统权限更大、错误对象的破坏性更高，且没有视觉差异时用户可能只凭一句完成提示接受了错误修改。",
        userVoice: "当前证据来自 Alibaba 官方产品发布与会议材料，包含一个产品演示路径，但没有独立评测、量产机体验、开发者迁移报告或真实任务成功率。不能把发布会演示当成长期桌面可用性证明，也不能从“agentic computer”判断所有应用都已接入。",
        newTech: "新技术信号在系统整合：模型、桌面 OS、应用运行时、云文件和跨设备批准被设计成一个 Agent harness。它把上下文检索和工具执行放到操作系统层，潜在地比单一聊天窗口更适合长任务；真正难点是权限的可见性、应用沙箱、差异审计和失败后的恢复，而不是把模型名称写入系统设置。",
        availability: "Alibaba 在 9 月 25 日的官方页面宣布 Qwen Book，但页面没有给出公开购买链接、最终售价、正式发货日期或支持地区。Qwen Book 因而是 confirmed product / announced product，而不是已经验证可购买、可下载或可供第三方开发的成熟平台。",
        limitsOrUnknowns: "未知包括具体硬件配置、桌面 OS 版本、兼容应用、模型是否本地运行、云端数据保留、账号与企业权限、手机批准的安全语义、撤销窗口、编辑差异、弱网降级、离线能力、第三方 API、价格和上市区域。没有这些边界，不能把它描述成“全自动办公电脑”。",
        productVerdict: "Qwen Book 是一条清晰的 agentic computer 产品路径：用 OS 统一上下文、工具和控制，把 Agent 从窗口内助手推向系统执行层。判断为 confirmed product / pre-retail；价值取决于对象级审计、权限和撤销是否真实可用，而不是演示能否完成一次幻灯片编辑。"
      },
      en: {
        productName: "Qwen Book",
        productType: "Qwen Book is an AI-native agentic computer introduced by Alibaba at the 2026 Apsara Conference. The company describes a unified stack of Qwen models, Qwen Desktop OS, native applications, and cloud services, using the phrase “OS as Harness” to describe a system in which interface, context, runtime, and control over software and hardware are prepared for agent execution. It is a concrete product announcement, not a complete retail specification.",
        interactionFlow: "Alibaba's public example has a person editing a presentation and speaking through a stylus that also serves as a microphone. Qwen Book retrieves the file from the cloud, finds the exact slide, invokes the appropriate editing tools, and lets the person inspect and approve the change on a phone. The flow connects file search, object selection, execution, and off-computer review. The page does not fully show wake behaviour, permission prompts, action plans, undo, offline operation, failure recovery, collaboration, or whether phone approval blocks background work; those remain unknown.",
        specsOrStack: "The disclosed stack includes Qwen models, Qwen Desktop OS, applications, cloud services, a microphone-enabled stylus, desktop tool invocation, and phone approval. The product description does not state the chipset, memory, storage, display size or resolution, weight, battery, radio, on-device model, price, regions, public API, or SDK. Those details are source not stated. “OS as Harness” is an architectural description and does not prove that inference runs locally.",
        useCases: "The confirmed example is retrieving a presentation from the cloud and editing the correct slide. In the same product direction, office users might locate spreadsheets, call application tools, organise cloud material, draft documents, and approve higher-risk changes from a phone; the page does not confirm each extension. The useful unit is not chat. It is an agent that understands files, applications, and work state well enough to remove the repeated search and context-transfer steps between windows.",
        painPointsSolved: "Qwen Book targets object-selection and application-switching friction in desktop work. A user should not have to open a drive, search for a file, navigate to a slide, launch an editor, and manually carry the context into another assistant. Phone approval also brings remote supervision into the desktop execution loop. The trade is larger system authority: a wrong object can be changed at higher speed, and without a visible diff a person may accept a wrong edit because the interface only says that the task is complete.",
        userVoice: "The evidence is an Alibaba product announcement and conference scenario, not an independent hands-on review, developer migration report, or measured real-task success rate. A keynote flow is not proof of daily desktop usability, and the term agentic computer does not mean that every application is already integrated.",
        newTech: "The technology signal is system integration. Model, desktop OS, application runtime, cloud files, and cross-device approval are designed as one agent harness. That moves context retrieval and tool execution toward the operating-system layer and could make long tasks more coherent than a single chat window. The hard engineering and HCI work is permission legibility, application sandboxing, change audit, and recovery after failure, not simply placing a model name in system settings.",
        availability: "Alibaba announced Qwen Book on September 25, but the product page does not provide a public purchase link, final price, committed shipping date, or supported regions. Qwen Book is therefore a confirmed announced product rather than a verified, generally purchasable computer or an open developer platform.",
        limitsOrUnknowns: "Open questions include hardware configuration, desktop OS version, compatible applications, local versus cloud inference, cloud retention, account and enterprise permissions, the security meaning of phone approval, the undo window, edit diffs, weak-network fallback, offline operation, third-party APIs, price, and launch regions. Without these boundaries it should not be described as a fully autonomous office computer.",
        productVerdict: "Qwen Book is a clear agentic-computer path: the operating system becomes the place where context, tools, and control are unified. Verdict: confirmed product, pre-retail; its value depends on object-level audit, permission, and undo being real user controls rather than a successful presentation demo."
      }
    }
  }),
  product({
    id: "alibaba-qwennote-a2-agentic-note-device-2026-09-28",
    section: "china",
    evidenceLabel: "confirmed product",
    sourceDate: "2026-09-25",
    evidenceStrength: "Alibaba Cloud Community product announcement with price, weight, microphone, network, and battery claims",
    zhHeadline: "QwenNote A2：把会议录音直接变成 Agent 的工作上下文",
    enHeadline: "QwenNote A2 turns captured conversation into agent context",
    zhFact: "Alibaba 将 QwenNote A2 定位为 DingTalk A1 的升级便携记录设备：它可在离线对话中录音，把内容交给 QwenWork 处理，再通过 DingTalk 发消息、约后续会议、建待办或生成表格。官方说明给出 67 克、六麦克风、最远 8 米拾音、内置 4G、最长 40 小时连续转写、18 天待机和 1,199 元售价，并称传输加密、转写后删除音频，仅保留文字与摘要。",
    enFact: "Alibaba positions QwenNote A2 as an upgrade to the DingTalk A1: a portable recorder that captures offline conversation, turns it into context for QwenWork, and then uses DingTalk to send messages, schedule follow-up meetings, create to-dos, or generate AI spreadsheets. The official page states 67 grams, six microphones, pickup up to eight metres, built-in 4G, up to 40 hours of continuous transcription, 18 days of standby, and a RMB 1,199 price. It says audio is encrypted in transit and deleted after transcription, with text and summaries retained.",
    zhValue: "QwenNote A2 的产品闭环比“AI 录音笔”更完整：捕捉不是终点，摘要会继续进入企业 Agent 和协作系统。它解决的是会议后把录音重新听一遍、手工提取行动项、再复制到日历和聊天工具的重复劳动。新的风险也被放大：一旦音频变成任务和消息，错误转写可能变成错误承诺，用户需要知道哪些内容被保留、哪些动作已自动发出，以及旁人是否同意被记录。",
    enValue: "QwenNote A2 presents a more complete loop than an AI recorder: capture is not the endpoint, because the summary becomes input to an enterprise agent and collaboration system. It targets the repeated work of replaying a meeting, extracting action items, and copying them into calendars and chat tools. The risk grows with the loop. A transcription error can become a wrong promise or scheduled task, so people need to know what was retained, which actions were sent automatically, and whether people in the room consented to recording.",
    zhHciLens: ["入口：设备录音与实时问答", "上下文：会议音频、文字、摘要", "动作：QwenWork × DingTalk 任务执行", "边界：同意、删除、自动发送"],
    enHciLens: ["Entry: device recording and real-time follow-up", "Context: meeting audio, text, summary", "Action: QwenWork plus DingTalk execution", "Boundary: consent, deletion, automatic sending"],
    zhImplication: "记录设备一旦接入 Agent，界面不能只显示“正在录音”。它还应让用户逐条检查人名、时间、责任人和发送对象，区分建议、草稿与已执行动作，并在音频删除后说明文字与摘要仍保存在哪里。企业版产品还需要对旁人、会议主持人和跨组织参与者提供可读的状态。",
    enImplication: "Once a recorder connects to an agent, the interface cannot stop at “recording.” It needs item-level review for names, dates, owners, and recipients, a visible distinction between suggestion, draft, and executed action, and a clear explanation of where text and summaries remain after audio deletion. An enterprise product also needs legible state for bystanders, meeting hosts, and participants from other organisations.",
    visual: visuals.qwenHardware,
    sources: [source("Alibaba Cloud Community: QwenNote A2", urls.qwenHardware, "china"), source("Alibaba QwenWork platform", "https://www.alibabacloud.com/en/product/qwenwork", "official"), source("DingTalk official site", "https://www.dingtalk.com/", "official")],
    dossier: {
      zh: {
        productName: "QwenNote A2",
        productType: "QwenNote A2 是 Alibaba 发布的便携 AI 记录设备，定位为 DingTalk A1 的升级版本。它把线下对话转成文字与摘要，再把上下文交给 QwenWork 和 DingTalk，让记录继续变成消息、后续会议、待办或 AI 表格。与只提供录音回放的设备相比，它把“捕捉—理解—执行”放在一个工作流里；但它仍是企业场景产品，不能默认适合所有私人或公共对话。",
        interactionFlow: "用户携带设备，在会议或现场对话中开始录音；设备可以进行实时对话，用户打断、追问或调整指令；录音被转写后交给 QwenWork 理解，用户再让 DingTalk 发消息、安排后续会议、创建待办或生成表格。官方还称传输加密、音频在转写后删除、文字和摘要保留。页面没有完整说明开始/停止、旁人提示、逐句纠错、自动发送前批准、多人说话人识别和删除摘要的细节，这些流程仍需实机验证。",
        specsOrStack: "官方披露 67 克、六个麦克风、最远 8 米拾音、内置 4G、最长 40 小时连续转写、18 天待机和 1,199 元售价；设备使用 Qwen-Audio，并与 QwenWork、DingTalk 协同。页面没有说明芯片、存储、屏幕、扬声器、充电接口、地区、订阅、准确率、实际网络成本或完整 API。加密传输和转写后删除是公司描述，不能等同于完整隐私审计。",
        useCases: "确定的用途包括会议录音、实时追问、转写、从内容生成行动项、发送工作消息、安排后续会议、创建待办和生成 AI 表格。它适合需要移动记录、双手空闲或不想反复回放长音频的办公流程。若参与者来自不同组织，录音同意、数据归属、企业保留政策和跨境传输会成为使用前置条件；这些不是设备规格能自动解决的问题。",
        painPointsSolved: "QwenNote A2 解决会议后整理的重复劳动：用户不必从音频中手工找出谁做什么、什么时候完成，再复制到协作工具。把录音与 QwenWork/DingTalk 串起来，也让记录进入原本的工作系统。它新增的痛点是错误转写会扩散为错误消息、错误日程和错误责任分配；音频虽被删除，文字和摘要仍可能包含敏感信息。",
        userVoice: "当前可核查证据主要是 Alibaba 官方产品说明，不是长时间第三方评测。页面给出重量、麦克风、拾音、续航和价格等公司披露，但没有独立验证拾音距离、中文多人会议准确率、4G 覆盖、真实续航或误触发频率。",
        newTech: "新技术不只是录音，而是把 Qwen-Audio 的语音输入连接到企业 Agent 和协作系统，使摘要成为可执行上下文。产品还公开了实时可打断、追问和调整指令的交互方向，以及设备级 4G 连接。真正的技术挑战在于把声学不确定性传递到任务执行层，并在每个自动动作前后保留人的审阅与撤销权。",
        availability: "Alibaba 页面称 QwenNote A2 已于 9 月 22 日在 QwenWork 天猫旗舰店开售，售价为人民币 1,199 元。销售渠道、地区和企业服务条件以官方实际页面为准；公开材料没有给出完整国际版、API 或开发者计划。",
        limitsOrUnknowns: "重点未知包括录音提示与旁人同意、会议中的说话人分离、方言和噪声准确率、音频删除后的缓存、文字与摘要保存期限、企业管理员权限、自动发消息的批准、4G 套餐、离线降级、跨境数据和退款/售后。不能把“音频删除”简化成数据完全消失。",
        productVerdict: "QwenNote A2 是一个已公开价格和规格的 confirmed product：它把记录设备推进到“让 Agent 继续执行”的层级。判断为中国企业工作流中的具体产品，价值取决于动作前审阅、同意机制和可撤销性；录音转任务的自动化越强，越需要逐项责任边界。"
      },
      en: {
        productName: "QwenNote A2",
        productType: "QwenNote A2 is Alibaba's portable AI note-taking device and an upgrade to the DingTalk A1. It turns offline conversation into text and summaries, then gives that context to QwenWork and DingTalk so it can become messages, follow-up meetings, to-dos, or AI spreadsheets. Compared with a recorder that only offers playback, it connects capture, understanding, and execution in one workflow. It is still an enterprise-oriented product and should not be assumed appropriate for every private or public conversation.",
        interactionFlow: "A person carries the device and starts recording in a meeting or conversation. The device supports real-time interaction in which the user can interrupt, ask a follow-up question, or adjust an instruction. After transcription, QwenWork interprets the material and the user can ask DingTalk to send a message, schedule a follow-up, create a to-do, or generate a spreadsheet. Alibaba also says transmission is encrypted, audio is deleted after transcription, and text and summaries remain. The page does not fully document start and stop state, bystander notice, sentence-level correction, approval before sending, speaker separation, or deletion of summaries; those require hands-on validation.",
        specsOrStack: "Alibaba states 67 grams, six microphones, pickup up to eight metres, built-in 4G, up to 40 hours of continuous transcription, 18 days of standby, and a RMB 1,199 price. The stack includes Qwen-Audio, QwenWork, and DingTalk. The page does not state the chipset, storage, display, speaker, charging interface, regions, subscription, accuracy, network cost, or complete API. Encrypted transmission and deletion after transcription are company statements, not a complete privacy audit.",
        useCases: "Confirmed uses include meeting capture, real-time follow-up, transcription, extracting action items, sending work messages, scheduling follow-up meetings, creating to-dos, and generating AI spreadsheets. It is aimed at mobile note-taking, hands-free capture, and workflows where replaying a long recording is costly. When participants come from different organisations, consent, data ownership, retention policy, and cross-border transfer become preconditions; a hardware specification cannot solve them automatically.",
        painPointsSolved: "QwenNote A2 targets the repetitive work after a meeting: manually finding who owns what and by when, then copying those items into collaboration tools. Connecting the recorder to QwenWork and DingTalk puts the result inside the existing work system. The new risk is propagation: a transcription error can become a wrong message, calendar event, or assignment. Even if audio is deleted, text and summaries may still contain sensitive material.",
        userVoice: "The verifiable evidence is primarily Alibaba's product announcement rather than a long-term independent review. The page provides company-stated weight, microphones, pickup, endurance, and price, but there is no independent test of distance, Chinese multi-speaker accuracy, 4G coverage, real battery life, or false triggers.",
        newTech: "The technology is not recording alone. It connects Qwen-Audio input to an enterprise agent and collaboration system so that a summary becomes executable context. Alibaba also describes interruptible, follow-up conversation and adjustable instructions, along with device-level 4G. The difficult product problem is passing acoustic uncertainty into task execution while preserving human review and undo around every automated action.",
        availability: "Alibaba says QwenNote A2 went on sale on September 22 through the QwenWork flagship store on Tmall at RMB 1,199. Channel, region, and enterprise-service conditions should be checked against the live listing; the public material does not provide a complete international version, API, or developer plan.",
        limitsOrUnknowns: "Open questions include recording indicators and bystander consent, speaker separation, dialect and noise accuracy, cached audio after deletion, text and summary retention, administrator access, approval before automatic messages, 4G plans, offline fallback, cross-border data, and support or refunds. “Audio is deleted” should not be simplified into “all data disappears.”",
        productVerdict: "QwenNote A2 is a confirmed product with a public price and disclosed headline specifications. Verdict: a concrete Chinese enterprise workflow product that moves a recorder into agent execution; its value depends on pre-action review, consent, and reversibility, because the stronger the capture-to-task automation, the more explicit the responsibility boundary must be."
      }
    }
  }),
  product({
    id: "qwen-intelligence-honor-magic9-agentic-phone-2026-09-28",
    section: "china",
    evidenceLabel: "developer surface",
    sourceDate: "2026-09-25",
    evidenceStrength: "Alibaba Qwen Intelligence announcement plus HONOR launch-day surface; company benchmark claims remain unverified",
    zhHeadline: "Qwen Intelligence × HONOR Magic9：手机开始承担跨 App 执行",
    enHeadline: "Qwen Intelligence makes the phone an agentic execution surface",
    zhFact: "Alibaba 发布 Qwen Intelligence，面向手机厂商提供从移动端优化模型、harness 到可用 Agent 的全栈方案，HONOR 是首个合作方；官方称 Magic9 系列与 Robot Phone 将成为首批搭载设备，并声称 HONOR AI 手机任务准确率最高 91.8%、可编排超过 100 步。9 月 28 日是 Magic9 正式发布日；这些准确率与任务长度属于公司披露，不是独立复测。",
    enFact: "Alibaba introduced Qwen Intelligence as a full-stack solution for phone makers, covering mobile-optimised models, a custom harness, and ready-to-use agents. HONOR is the first partner; Alibaba says the Magic9 series and Robot Phone are among the first devices to incorporate it, with company-reported task accuracy up to 91.8% and flows exceeding 100 steps. September 28 is the Magic9 launch date. The accuracy and task-length figures are company claims, not independent replication.",
    zhValue: "这条产品线把手机从“回答问题的 App 容器”推向系统级执行代理：Agent 需要理解用户意图，跨多个手机工具完成任务，并与 MagicOS 的系统能力协作。它解决的是移动端跨 App 操作成本，例如搜索、填写、预约和整理信息时不想逐个打开应用的摩擦。真正的体验门槛在于用户能否看到每一步、知道哪些数据被读取、在关键动作前接管，以及失败后是否可以恢复，而不是一次 benchmark 数字。",
    enValue: "This line moves the phone from a container for answer apps toward a system-level execution agent. The agent is expected to understand intent, work across mobile tools, and cooperate with MagicOS capabilities. That targets the friction of opening multiple apps for search, form filling, booking, and information organisation. The real UX threshold is whether people can see the steps, understand what data was read, take over before consequential actions, and recover after failure, not whether one benchmark number looks high.",
    zhHciLens: ["入口：系统级 YOYO/Qwen Agent", "上下文：手机工具、账户、屏幕状态", "动作：跨 App、多步、端云协同", "边界：批准、支付、恢复、数据读取"],
    enHciLens: ["Entry: system-level YOYO/Qwen agent", "Context: mobile tools, accounts, screen state", "Action: cross-app, multi-step, cloud-device", "Boundary: approval, payment, recovery, data access"],
    zhImplication: "手机 Agent 的交互单位不是一句指令，而是一条可暂停的执行链。MagicOS 需要给出任务计划、当前 App、即将提交的字段、敏感权限和回滚点，并把“建议”“草稿”“已发送”“已付款”分开。跨 App 代理还要处理系统弹窗、登录态、验证码、支付和第三方服务拒绝，不能用一个成功/失败 toast 覆盖全过程。",
    enImplication: "The interaction unit for a phone agent is not a sentence but a pausable execution chain. MagicOS needs to expose the plan, current app, fields about to be submitted, sensitive permissions, and rollback points, while separating suggestion, draft, sent, and paid states. A cross-app agent also has to handle system prompts, login state, verification, payment, and third-party refusal; one success or failure toast cannot represent the whole process.",
    visual: visuals.qwenIntelligence,
    sources: [source("Alibaba Qwen Intelligence announcement", urls.qwenIntelligence, "china"), source("HONOR Magic9 official launch", urls.honorMagic9, "official"), source("HONOR Magic9 launch notice", urls.honorNotice, "china"), source("Xinhua: Qwen Intelligence and HONOR", "https://www.xinhuanet.com/tech/20260923/67b397da73824713a2ad6ded76769ec1/c.html", "china")],
    dossier: {
      zh: {
        productName: "Qwen Intelligence × HONOR Magic9",
        productType: "Qwen Intelligence 是 Alibaba 面向手机厂商的全栈 agentic smartphone 方案，覆盖移动端优化 Qwen 模型、定制 harness、可直接使用的 Agent 和评测路径；HONOR 是首个合作方。Magic9 系列与 HONOR Robot Phone 被官方列为首批采用设备。它更像一个系统/开发者 surface，而不是一个单独下载的聊天应用；消费者实际能用到的能力取决于 MagicOS、机型、地区和服务接入。",
        interactionFlow: "公开描述是用户提出复杂任务，Agent 在手机工具之间规划并执行，理解屏幕和应用状态，再返回结果或请求批准。Alibaba 称 HONOR AI 手机可编排超过 100 步，但没有展示每类任务的完整状态。真实流程需要处理登录、系统弹窗、验证码、支付、隐私权限、第三方拒绝、网络中断和用户接管；在这些环节，手机应能暂停、回看、批准、取消和恢复，而不是把整个流程压成一次语音问答。",
        specsOrStack: "官方披露 stack 包括移动端优化 Qwen 模型、定制 harness、三类 ready-to-use agents、MobilePA-Bench 与真实设备任务评测、HONOR MagicOS 以及端云协同。Alibaba 声称任务准确率最高 91.8%、流程超过 100 步，但测试条件、样本、失败定义和独立复现均未公开。Magic9 页面另有 C3 射频增强芯片与七芯射频 AI 调度架构说明；Agent 的芯片、端侧/云端分工、内存、权限 API、价格和地区不能从 Qwen 页面推断。",
        useCases: "产品方向覆盖跨 App 搜索、整理、填写、预约和连续任务执行，目标是让手机代替用户完成一串工具操作。官方还把 Magic9 与 Robot Phone 放进同一 agentic device 路线。未公开的具体应用清单、支付支持、离线能力、第三方适配和用户可配置范围保持 source not stated；公司 benchmark 不能替代真实消费者流程。",
        painPointsSolved: "它针对手机上的上下文切换和重复点击：用户说出目标后，Agent 理论上可以找到应用、填入信息、调用工具并继续下一步。对行动不便、手上忙或需要处理长流程的人，这可能减少手工操作。新痛点是系统代理获得了比普通 App 更大的权限，错误动作可能提交订单、发送消息或修改数据，用户还可能不知道 Agent 使用了哪个账户和哪段屏幕内容。",
        userVoice: "目前证据来自 Alibaba、HONOR 和新华社等发布/报道，Magic9 在 9 月 28 日正式发布；没有足够的独立长流程评测来验证 91.8% 准确率、100 步稳定性、耗电、延迟或失败恢复。社区传播的数字和传言不作为已确认规格。",
        newTech: "新技术信号是把移动端 Agent 做成手机厂商可集成的 full-stack surface，而不是只提供云端 API。模型、harness、系统工具和手机厂商的 MagicOS 共同承担执行；这为端云协同和系统级动作打开入口，也把权限、审计、回滚和跨 App 兼容性变成 OS 级设计问题。",
        availability: "Qwen Intelligence 已由 Alibaba 宣布，并称可通过官网与 Alibaba Cloud 服务获得；HONOR 是首个合作方，Magic9 系列在 9 月 28 日发布。实际功能、地区、系统版本、账号资格和可用 Agent 需要以 HONOR/MagicOS 的交付页面为准。",
        limitsOrUnknowns: "未知包括 MagicOS 版本、具体 Magic9 SKU、模型是否端侧运行、系统权限粒度、跨 App 兼容、支付与验证码、敏感信息遮蔽、任务暂停和回滚、耗电、网络依赖、第三方服务拒绝、数据保存、训练用途以及 91.8% 的测试条件。Robot Phone 的 Agent 行为也不能从概念发布直接推断。",
        productVerdict: "Qwen Intelligence × HONOR Magic9 是中国手机系统 Agent 化的具体落地入口，判断为 developer surface / launch-day product integration。方向已确认，成熟度未被独立验证；真正的产品分水岭是每一步能否被用户看懂、批准、撤回和恢复。"
      },
      en: {
        productName: "Qwen Intelligence × HONOR Magic9",
        productType: "Qwen Intelligence is Alibaba's full-stack agentic-smartphone solution for handset makers. It covers mobile-optimised Qwen models, a custom harness, ready-to-use agents, and evaluation paths; HONOR is the first partner. Alibaba names the Magic9 series and HONOR Robot Phone among the first devices to incorporate it. This is better understood as a system and developer surface than as a standalone chat app: consumer capability will depend on MagicOS, model, region, and service integration.",
        interactionFlow: "The public description has a user state a complex goal while the agent plans and executes across phone tools, reads screen and application state, and returns a result or asks for approval. Alibaba says HONOR AI phones can orchestrate flows exceeding 100 steps, but it does not show a complete state machine for each task. A real flow must handle login, system prompts, verification, payment, privacy permission, third-party refusal, network interruption, and takeover. The phone therefore needs pause, review, approval, cancel, and recovery rather than collapsing the chain into one voice answer.",
        specsOrStack: "The disclosed stack includes mobile-optimised Qwen models, a custom harness, three ready-to-use agents, MobilePA-Bench and real-device task evaluation, HONOR MagicOS, and cloud-device cooperation. Alibaba reports up to 91.8% task accuracy and flows longer than 100 steps, but test conditions, sample, failure definition, and independent replication are not public. The Magic9 launch page separately describes a C3 RF enhancement chip and seven-core RF AI scheduling; the agent's chip, local-versus-cloud split, memory, permission APIs, price, and regions cannot be inferred from the Qwen announcement.",
        useCases: "The product direction covers cross-app search, organisation, form filling, booking, and continuous mobile tasks. The goal is for the phone to perform a sequence of tool actions after the user states an outcome. Alibaba also puts Magic9 and Robot Phone in the same agentic-device route. A detailed app list, payment support, offline operation, third-party coverage, and user-configurable scope are source not stated; a company benchmark is not a consumer workflow test.",
        painPointsSolved: "The system targets context switching and repetitive taps on a phone. In theory, a person states the goal and the agent finds the application, fills information, invokes tools, and continues. That could reduce manual work for people whose hands are occupied or who need to complete long routines. The new pain is authority: a system agent can submit an order, send a message, or change data, while the user may not know which account and which screen content it used.",
        userVoice: "The evidence is Alibaba, HONOR, and Xinhua launch material, with Magic9 formally launching on September 28. There is not yet enough independent long-horizon testing to validate 91.8% accuracy, 100-step stability, battery cost, latency, or recovery after failure. Community numbers and rumours are not treated as confirmed specifications.",
        newTech: "The technology signal is a mobile agent packaged as a handset-maker integration surface rather than only a cloud API. Model, harness, system tools, and MagicOS jointly carry execution. That opens a path to device-cloud cooperation and system actions, while making permission, audit, rollback, and cross-app compatibility operating-system design problems.",
        availability: "Alibaba has announced Qwen Intelligence and says it is available through its website and Alibaba Cloud services. HONOR is the first partner and the Magic9 series launches on September 28. Actual features, regions, system versions, account eligibility, and available agents must be checked against HONOR and MagicOS delivery pages.",
        limitsOrUnknowns: "Open questions include the MagicOS version, exact Magic9 SKUs, local inference, system permission granularity, cross-app coverage, payment and verification handling, sensitive-data masking, pause and rollback, battery, network dependency, third-party refusal, retention, training use, and the conditions behind 91.8%. Robot Phone behaviour cannot be inferred from a concept announcement.",
        productVerdict: "Qwen Intelligence × HONOR Magic9 is a concrete entry point for agentic phone systems in China. Verdict: developer surface with launch-day product integration; the direction is confirmed, maturity is not independently validated, and the decisive product test is whether every step can be understood, approved, undone, and recovered by the user."
      }
    }
  }),
  product({
    id: "honor-magic9-qwen-agent-phone-2026-09-28",
    section: "china",
    evidenceLabel: "confirmed product",
    sourceDate: "2026-09-28",
    evidenceStrength: "HONOR official launch page and sale notice; AI workflow details remain partly undisclosed",
    zhHeadline: "荣耀 Magic9：把系统级 Agent 作为手机首发能力",
    enHeadline: "HONOR Magic9 makes system-level AI part of the phone launch",
    zhFact: "荣耀 Magic9 系列在 9 月 28 日正式发布。荣耀官方页确认第三代自研射频增强芯片 C3、七芯射频 AI 调度架构和 356 个频段组合智能切换；Alibaba 的 Qwen Intelligence 公告把 Magic9 列为首批 agentic smartphone。Magic9 的完整 AI Agent 权限、应用范围、芯片/模型分工和跨 App 操作细节，需要以发布会、系统版本和实机更新为准。",
    enFact: "HONOR launched the Magic9 series on September 28. HONOR's official page confirms a third-generation C3 RF enhancement chip, a seven-core RF AI scheduling architecture, and intelligent switching across 356 band combinations. Alibaba's Qwen Intelligence announcement lists Magic9 among the first agentic smartphones. The complete AI-agent permission model, app coverage, chip/model split, and cross-app behaviour still need to be checked against the launch, software version, and hands-on device.",
    zhValue: "Magic9 的产品信号不只是一台新手机，而是把系统级 Agent 作为发布时的默认卖点：硬件、MagicOS、网络调度和 Qwen Intelligence 被一起叙述。它解决的是用户在手机上执行长任务时需要不断切换应用的成本，也把 AI 从单独的入口变成系统能力。用户影响取决于代理是否有清晰的状态和批准机制；如果只是把复杂权限隐藏在 YOYO 或助手名下，便利会转化为不可见风险。",
    enValue: "Magic9's product signal is not only a new handset; it makes a system-level agent part of the launch story, with hardware, MagicOS, network scheduling, and Qwen Intelligence described together. That targets the cost of switching between apps during long mobile tasks and turns AI from a separate destination into a system capability. The user impact depends on legible state and approval. If complex authority is hidden behind an assistant name, convenience becomes invisible risk.",
    zhHciLens: ["入口：MagicOS / YOYO 系统助手", "上下文：手机屏幕、账户与网络状态", "动作：跨 App 执行与端云协同", "边界：默认权限、网络、用户接管"],
    enHciLens: ["Entry: MagicOS / YOYO system assistant", "Context: screen, accounts, network state", "Action: cross-app execution and cloud-device", "Boundary: default authority, network, takeover"],
    zhImplication: "Magic9 的验收不应只看发布会上能否调用 Agent，而应看新用户是否知道它什么时候被唤醒、正在读取什么、即将提交什么，以及如何在购买、发送、删除等不可逆动作前接管。系统级 Agent 还应对网络切换、权限拒绝和服务不可用给出可操作的下一步，而不是静默失败。",
    enImplication: "Magic9 should not be accepted merely because an agent can be invoked on stage. The test is whether a new owner knows when it is awake, what it is reading, what it is about to submit, and how to take over before an irreversible purchase, send, or deletion. A system agent must also turn network changes, denied permissions, and unavailable services into actionable next steps rather than silent failure.",
    visual: visuals.honor,
    sources: [source("HONOR Magic9 official launch", urls.honorMagic9, "official"), source("HONOR Magic9 sale notice", urls.honorNotice, "official"), source("Alibaba Qwen Intelligence announcement", urls.qwenIntelligence, "china"), source("Xinhua: Qwen Intelligence and HONOR", "https://www.xinhuanet.com/tech/20260923/67b397da73824713a2ad6ded76769ec1/c.html", "china")],
    dossier: {
      zh: {
        productName: "HONOR Magic9 series",
        productType: "HONOR Magic9 是 2026 年 9 月 28 日发布的手机系列，也是 Alibaba Qwen Intelligence 公告中的首批 agentic smartphone。荣耀官方页强调第三代自研射频增强芯片 C3、七芯射频 AI 调度架构和 356 个频段组合智能切换；Alibaba 则把 Magic9 放进 MagicOS 与 Qwen Agent 协作的系统路线。它是具体上市硬件，但完整 AI Agent 功能不能只由发布页推断。",
        interactionFlow: "可确认的入口是 MagicOS/YOYO 与 Qwen Intelligence 的系统协作：用户提出目标，Agent 在手机工具和服务之间规划任务并返回结果或请求批准。Alibaba 公开了跨 App、长流程和超过 100 步的公司描述，但没有在 HONOR 页面完整展示从唤醒、读取屏幕、登录、提交、支付到撤销的逐步交互。实机需要验证用户如何查看计划、暂停、纠正、切换账户和恢复失败任务。",
        specsOrStack: "荣耀官方披露 C3 射频增强芯片、七芯射频 AI 调度架构以及 356 个频段组合智能切换；Alibaba 披露 Qwen Intelligence、移动端优化模型、定制 harness 和 ready-to-use agents。Magic9 的具体 SoC、内存、屏幕、续航、价格、地区、MagicOS 版本和 Agent 权限范围不在当前页面完整列出；这些项目写作 source not stated，不能用传闻补齐。",
        useCases: "产品方向是跨 App 搜索、内容整理、信息填写、预约与多步执行，也可能把手机作为现实世界与 Agent 之间的入口。Magic9 还需要处理网络切换和移动账户状态，因此在旅行、办公和通信任务中存在明确价值。具体支持哪些第三方应用、是否能完成支付、哪些动作必须回到用户确认，仍需以系统实际能力为准。",
        painPointsSolved: "它针对手机上频繁跳转、重复填写和长任务中断的成本，把一部分操作从手动点击转成目标驱动执行。C3 与射频调度则从连接层支撑持续可用的手机入口。新的风险是系统代理权限集中后，错误识别或错误账户可能造成不可逆操作；如果用户看不到 Agent 的数据来源和下一步，产品会把复杂性隐藏而不是解决。",
        userVoice: "目前有官方发布页和销售公告，也有 Alibaba 的合作方说明；没有足够第三方实机测试来证明 Agent 的延迟、耗电、稳定性、长流程成功率或权限可理解性。9 月 28 日的发布与开售是已确认时间，用户体验仍是待测。",
        newTech: "新技术信号来自硬件、网络调度、MagicOS 和 Qwen Intelligence 的组合：手机不再只是运行 App 的容器，而试图成为可规划、调用、执行和交接任务的系统表面。对 HCI 来说，关键不是模型多大，而是系统能否把长流程拆成用户可监督的状态。",
        availability: "HONOR 官方页面将发布日定为 2026 年 9 月 28 日，官方商城公告说明发布会后销售安排和 YOYO AI VIP 体验权益。不同 SKU、地区、系统版本和 Agent 能力仍以实际销售与更新页面为准。",
        limitsOrUnknowns: "未知包括准确 SKU 与价格、MagicOS 版本、Qwen Agent 的端云分工、默认权限、跨 App 列表、第三方拒绝处理、支付/验证码、网络断开、后台耗电、数据保留、用户关闭路径和 Magic9 与 Robot Phone 的功能差异。公司宣传数字不等于独立性能基准。",
        productVerdict: "Magic9 是一款将系统级 Agent 写进首发叙事的 confirmed product。判断：硬件和发布时间已确认，AI 执行体验仍需实机验证；产品成败在于是否让用户保留监督与接管权，而非只把 Agent 放在系统首页。"
      },
      en: {
        productName: "HONOR Magic9 series",
        productType: "HONOR Magic9 is a phone series launched on September 28, 2026, and one of the first agentic smartphones named in Alibaba's Qwen Intelligence announcement. HONOR's official page highlights a third-generation C3 RF enhancement chip, a seven-core RF AI scheduling architecture, and intelligent switching across 356 band combinations. Alibaba places Magic9 in a MagicOS and Qwen agent route. It is a concrete shipping hardware launch, but the full agent capability cannot be inferred from the launch page alone.",
        interactionFlow: "The confirmed entry is system cooperation between MagicOS/YOYO and Qwen Intelligence: the user states an outcome, the agent plans across phone tools and services, and returns a result or requests approval. Alibaba describes cross-app and long-horizon flows exceeding 100 steps, but HONOR's page does not show the complete sequence from wake, screen reading, login, submission, payment, and undo. Hands-on testing is needed to verify plan visibility, pause, correction, account switching, and recovery after failure.",
        specsOrStack: "HONOR discloses the C3 RF enhancement chip, seven-core RF AI scheduling, and intelligent switching across 356 band combinations. Alibaba discloses Qwen Intelligence, mobile-optimised models, a custom harness, and ready-to-use agents. The current pages do not provide one complete list of Magic9 SoC, memory, display, battery, price, regions, MagicOS version, or agent permissions. Those items are source not stated and should not be filled with rumours.",
        useCases: "The product direction covers cross-app search, organisation, form filling, booking, and multi-step execution, with the phone acting as the bridge between the physical world and an agent. Magic9 also has to keep network and account state usable, which gives the route a clear value in travel, office, and communication tasks. The supported third-party app list, payment capability, and actions that require confirmation remain to be checked against the delivered system.",
        painPointsSolved: "Magic9 targets repeated switching, repetitive entry, and interruption in long phone tasks by converting part of the interaction from manual taps to goal-directed execution. C3 and RF scheduling support the reliability of the phone as a persistent entry point. The new risk is concentrated authority: an incorrect interpretation or wrong account can create an irreversible action, while hidden data sources and next steps merely hide complexity instead of solving it.",
        userVoice: "There is an official launch page, a sale notice, and Alibaba partner material, but not enough independent hands-on testing to establish agent latency, battery cost, stability, long-task success, or permission legibility. The September 28 launch and sale timing are confirmed; user experience is still a test question.",
        newTech: "The technology signal is the combination of hardware, network scheduling, MagicOS, and Qwen Intelligence. The phone is no longer framed only as a container for apps; it is intended to become a surface that plans, invokes, executes, and hands off tasks. For HCI the important question is not model size but whether long tasks are decomposed into states the user can supervise.",
        availability: "HONOR's official page sets the launch date to September 28, 2026, while the official store notice describes post-event sales and YOYO AI VIP access. SKU, region, software version, and agent capability vary by actual sales and update pages.",
        limitsOrUnknowns: "Open questions include exact SKU and price, MagicOS version, local-versus-cloud Qwen execution, default authority, cross-app coverage, third-party refusal, payment and verification, network loss, background battery, retention, shutdown, and the difference between Magic9 and Robot Phone. Company marketing numbers are not independent performance benchmarks.",
        productVerdict: "Magic9 is a confirmed product that makes a system-level agent part of the launch narrative. Verdict: hardware and launch timing are confirmed, while agent execution remains to be validated on-device; success depends on preserving user supervision and takeover rather than simply placing an agent on the home screen."
      }
    }
  }),
  product({
    id: "prismml-bonsai-qualcomm-smart-glasses-local-model-2026-09-28",
    section: "global",
    evidenceLabel: "startup signal",
    sourceDate: "2026-09-24",
    evidenceStrength: "TechCrunch report on a Snapdragon Summit demo; no shippable PrismML glasses announced",
    zhHeadline: "PrismML Bonsai：把 1-bit 小模型塞进眼镜的开发者信号",
    enHeadline: "PrismML Bonsai is a local-model signal for smart-glasses builders",
    zhFact: "TechCrunch 报道 PrismML 在 Qualcomm Snapdragon Summit 演示 1-bit Bonsai LLM，可在搭载 Snapdragon AR1 Gen 1 的 AI 眼镜上本地运行；报道将其描述为约 20 亿参数、针对视觉与语言任务调优的版本，并称模型目标是缩小模型同时保留大部分基准性能。但报道明确说 PrismML 尚未宣布一副可购买的眼镜，因此它是 startup signal，不是消费产品。",
    enFact: "TechCrunch reports that PrismML demonstrated a 1-bit Bonsai LLM at Qualcomm's Snapdragon Summit on AI glasses powered by the Snapdragon AR1 Gen 1 platform. The report describes a roughly two-billion-parameter version tuned for vision and language and a broader goal of shrinking models while retaining most benchmark performance. It also explicitly says that PrismML has not announced shippable glasses, so this is a startup signal rather than a consumer product.",
    zhValue: "Bonsai 的产品价值在于把端侧模型从芯片厂商的宣传变成开发者可讨论的运行时选择：眼镜可以先在本地回答“我看到了什么”，再把更重的任务交给云端。它针对的是延迟、隐私、连接和云成本痛点，也承认了穿戴设备受限于算力、内存和热量。没有成品硬件、功耗、延迟、准确率与真实环境测试时，模型压缩仍只是能力信号。",
    enValue: "Bonsai matters as a runtime choice that turns on-device models from a chipmaker talking point into a concrete option for wearable developers. Glasses could answer a first visual question locally and send heavier work to the cloud. That targets latency, privacy, connectivity, and cloud-cost friction while acknowledging the compute, memory, and thermal limits of eyewear. Without a finished device, power, latency, accuracy, and real-world tests, model compression remains a capability signal rather than a product guarantee.",
    zhHciLens: ["入口：眼镜视角与语音提问", "上下文：本地视觉语言模型", "动作：端侧回答，必要时上云", "边界：功耗、误识别、数据外发"],
    enHciLens: ["Entry: glasses viewpoint and voice query", "Context: local vision-language model", "Action: answer locally, escalate to cloud", "Boundary: power, misrecognition, data egress"],
    zhImplication: "端侧小模型不是“更私密”四个字就结束了。产品必须告诉用户哪些问题在眼镜内完成、哪些会上传，如何在模型不确定时请求云端或让用户确认，并用可感知的反馈控制连续视觉推理。对开发者来说，真正的 SDK 价值是模型路由、置信度、缓存和降级策略，而不是单一 benchmark。",
    enImplication: "A small on-device model cannot be described as “more private” and left there. The product must tell people which questions stay on the glasses, which leave the device, how uncertainty triggers cloud escalation or user confirmation, and how continuous vision is regulated through perceptible feedback. For developers, the useful SDK surface is routing, confidence, caching, and fallback policy rather than one benchmark score.",
    visual: visuals.prism,
    sources: [source("TechCrunch: PrismML Bonsai on smart glasses", urls.prism, "reviews"), source("PrismML official site", urls.prismSite, "wild"), source("Qualcomm Snapdragon AR1 platform", "https://www.qualcomm.com/products/mobile/snapdragon/wearable-platforms/snapdragon-ar1-gen-1-platform", "official")],
    dossier: {
      zh: {
        productName: "PrismML Bonsai LLM on Snapdragon smart glasses",
        productType: "PrismML 是一家专注小型模型的 AI startup。TechCrunch 报道它在 Snapdragon Summit 演示 1-bit Bonsai LLM，可在 Snapdragon AR1 Gen 1 平台的 AI 眼镜上本地运行；眼镜产品本身并非 PrismML 已宣布的消费硬件。Bonsai 因而是面向设备开发者的模型/运行时信号，核心问题是如何在穿戴终端的算力、内存和热限制下提供视觉语言能力。",
        interactionFlow: "报道所支持的流程是佩戴者通过眼镜看到场景并用语音提问，端侧视觉语言模型尝试实时回答“我在看什么”；更重或未被本地模型覆盖的任务可能需要服务端。这个端云分流是产品推论，TechCrunch 没有给出完整 SDK 或用户状态图。唤醒、相机指示、置信度、云端升级、离线降级、连续视觉是否默认开启和用户如何停止都未公开。",
        specsOrStack: "已报道的 stack 包括 1-bit Bonsai LLM、约 20 亿参数的视觉语言版本、Snapdragon AR1 Gen 1 smart-glasses platform，以及本地运行方向。TechCrunch 提到模型较大模型缩小约四倍并保留大部分标准基准表现，但具体 benchmark、内存占用、功耗、延迟、量化误差、模型许可、SDK、支持的眼镜 SKU 和云端服务没有完整披露；这些均为 source not stated。",
        useCases: "可支持的产品方向包括眼前物体问答、短文本理解、环境提示和无网或弱网时的基础视觉辅助。对眼镜开发者，本地模型还能用于唤醒、筛选和低延迟反馈，再把复杂推理交给云端。由于没有成品设备和公开任务列表，不能把它写成已经支持翻译、导航、识人或全天候环境理解的消费产品。",
        painPointsSolved: "Bonsai 针对云端往返延迟、网络依赖、隐私外发和推理成本，也回应了眼镜无法承受大型模型功耗、热量与存储的问题。代价是小模型更容易在长尾视觉、遮挡、噪声和多语言环境中出错；如果系统没有明确告诉用户模型在哪里运行，所谓隐私优势会变成不可见的路由决策。",
        userVoice: "TechCrunch 是独立媒体报道，但其材料仍来自活动演示，不是可购买眼镜的长期评测。没有社区实机反馈、可复现功耗、端到端延迟、误识别率或开发者集成报告，因此当前应保持 startup signal，不应升级为 confirmed product。",
        newTech: "关键技术是 1-bit 量化与小型视觉语言模型在 AR1 穿戴平台上的端侧运行方向。它把模型压缩、芯片 NPU、内存预算、摄像头和语音交互放在同一个系统问题里。真正有价值的下一步是让开发者控制模型路由、置信度和云端升级，而不是只展示一次现场问答。",
        availability: "TechCrunch 报道 PrismML 展示了模型，但明确表示尚未宣布可购买的 PrismML 智能眼镜。模型可用范围、SDK、合作硬件、下载方式、价格和上市日期均未确认。",
        limitsOrUnknowns: "未知包括实际模型大小、内存、功耗、热管理、延迟、视觉准确率、数据是否离开眼镜、云端依赖、相机录制提示、失败恢复、许可、地区、开发者工具和最终硬件。不能从“本地运行”推断全天候可用或默认不上传数据。",
        productVerdict: "Bonsai 是值得跟踪的 startup signal：它让端侧视觉语言模型成为眼镜平台的具体选项，但仍停留在演示和模型能力层。判断为 developer-facing research/product signal；下一关是公开 SDK、真实硬件、功耗/延迟数据和可解释的本地—云端路由。"
      },
      en: {
        productName: "PrismML Bonsai LLM on Snapdragon smart glasses",
        productType: "PrismML is an AI startup focused on small models. TechCrunch reports that it demonstrated a 1-bit Bonsai LLM on AI glasses powered by the Snapdragon AR1 Gen 1 platform. The glasses are not a consumer product announced by PrismML. Bonsai is therefore a model and runtime signal for device builders, centred on delivering vision-language capability within the compute, memory, and thermal limits of eyewear.",
        interactionFlow: "The supported flow is that a wearer looks through glasses and asks a voice question while an on-device vision-language model tries to answer what is in view. Heavier or unsupported work may need a server. That device-cloud split is a product implication; TechCrunch does not provide a full SDK or state machine. Wake behaviour, camera indicator, confidence, cloud escalation, offline fallback, default continuous vision, and the user's stop path are not disclosed.",
        specsOrStack: "The reported stack includes a 1-bit Bonsai LLM, a roughly two-billion-parameter vision-language version, the Snapdragon AR1 Gen 1 smart-glasses platform, and a local-inference direction. TechCrunch says the model shrinks larger models by roughly four times while retaining most standard benchmark performance, but exact benchmarks, memory, power, latency, quantisation error, licence, SDK, compatible glasses SKUs, and cloud service are not fully disclosed; those details are source not stated.",
        useCases: "The product direction could support visual questions about nearby objects, short text understanding, environmental prompts, and basic assistance when connectivity is weak. For glasses developers, a local model could handle wake, filtering, and low-latency feedback before escalating complex reasoning to the cloud. Because there is no finished device or public task list, it should not be described as a consumer product that already supports translation, navigation, identification, or all-day scene understanding.",
        painPointsSolved: "Bonsai targets cloud round-trip latency, network dependency, data egress, and inference cost while addressing the power, heat, and storage limits of glasses. The trade is a higher chance of failure on long-tail visuals, occlusion, noise, and multilingual scenes. If the system does not show where inference happens, its privacy advantage becomes an invisible routing decision.",
        userVoice: "TechCrunch provides independent media coverage, but the material comes from a summit demonstration rather than a long-term review of purchasable glasses. There is no community hands-on evidence, reproducible power, end-to-end latency, error rate, or developer integration report. It remains a startup signal and should not be upgraded to a confirmed product.",
        newTech: "The technology signal is 1-bit quantisation and a compact vision-language model running in the direction of the AR1 wearable platform. It connects model compression, an NPU, memory budget, camera, and voice interaction into one systems problem. The next meaningful step is developer control over routing, confidence, and cloud escalation rather than another isolated demo question.",
        availability: "TechCrunch reports the model demonstration but explicitly says that PrismML has not announced shippable PrismML smart glasses. Model access, SDK, hardware partners, download, price, and launch date are unconfirmed.",
        limitsOrUnknowns: "Open questions include real model size, memory, power, thermal management, latency, visual accuracy, whether data leaves the glasses, cloud dependency, recording indicator, failure recovery, licence, regions, developer tools, and final hardware. Local inference does not prove all-day operation or that data is never uploaded.",
        productVerdict: "Bonsai is a useful startup signal because it makes an on-device vision-language model a concrete option for glasses platforms, but it remains at the demo and model-capability stage. Verdict: developer-facing product and research signal; the next gate is a public SDK, real hardware, power and latency data, and an understandable local-to-cloud routing policy."
      }
    }
  })
];

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`missing previous issue ${previousDate}`);
const freshIds = new Set(freshTopics.map((topic) => topic.id));
const issue = structuredClone(previous);
issue.date = date;
issue.timezone = "America/Toronto";
issue.zhTitle = "AI Daily · Agent 进入系统层";
issue.enTitle = "AI Daily · Agents move into the system layer";
issue.tags = ["AI hardware", "agentic computer", "AI phone", "wearable intelligence", "on-device AI", "HCI"];
issue.sourceTypes = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"];
issue.topics = [...freshTopics, ...issue.topics.filter((topic) => !freshIds.has(topic.id))];
issue.zhSummary = "本期的新主线从云栖大会延伸到手机和桌面：Qwen Book 把 Agent 写进 OS harness，QwenNote A2 把会议录音变成可执行上下文，Qwen Intelligence 与 HONOR Magic9 把跨 App 执行推向系统入口，PrismML 则把端侧小模型放回眼镜的功耗与隐私约束里。所有新增产品都保留发布、合作、实测和未知之间的边界。";
issue.enSummary = "This issue follows the Apsara Conference signal into the desktop and phone: Qwen Book makes the operating system an agent harness, QwenNote A2 turns meeting capture into executable context, Qwen Intelligence and HONOR Magic9 push cross-app execution toward the system entry point, and PrismML brings compact local models back to the power and privacy limits of glasses. The new dossiers keep announcements, partnerships, demos, and unknowns separate.";
issue.coverStory = {
  zhTitle: "Agent 不再只是 App：它开始占据系统、手机与随身设备的执行层",
  enTitle: "The agent is no longer just an app—it is taking the execution layer",
  zhSummary: ["Qwen Book 把 OS 当作 Agent harness，QwenNote A2 把声音变成工作流，Magic9 把跨 App 任务放进手机系统。", "产品竞争点转向对象定位、权限、批准、撤销和端云路由。", "今天真正要验证的是用户能否看见 Agent 的每一步，并在不可逆动作前接管。"],
  enSummary: ["Qwen Book treats the OS as an agent harness, QwenNote A2 turns sound into workflow, and Magic9 puts cross-app tasks inside the phone system.", "The competitive surface is shifting toward object selection, permission, approval, undo, and device-cloud routing.", "The critical test is whether users can see every step and take over before an irreversible action."],
  imagePath: visuals.qwenHardware.path,
  imageWidth: visuals.qwenHardware.width,
  imageHeight: visuals.qwenHardware.height,
  imageSourceUrl: visuals.qwenHardware.sourceUrl,
  primarySourceUrl: visuals.qwenHardware.sourceUrl,
  evidenceStrength: "Alibaba official product announcement · launch-day HONOR surface · developer and review signals",
  whyCover: "The strongest current product movement is not another assistant window; it is the attempt to make an agent the operating layer between intention and action."
};
issue.designDesk = {
  zhTitle: "设计洞察：把 Agent 变成可监督的执行链",
  enTitle: "Design Desk: make the agent an inspectable execution chain",
  zhItems: [
    { label: "对象先于动作", body: "Qwen Book 与手机 Agent 都先要找对文件、页面、账户和应用；产品应在执行前显示对象证据，而不是只显示自然语言计划。" },
    { label: "建议、草稿、已执行", body: "QwenNote A2 说明录音摘要很容易直接变成消息、日程和待办；每个动作必须有明确状态，发送前要能逐项批准。" },
    { label: "本地与云端要可见", body: "PrismML 的端侧模型把路由问题推到界面：用户要知道哪些内容留在设备、哪些内容离开设备，以及模型不确定时发生什么。" },
    { label: "撤销不是设置页功能", body: "系统级 Agent 需要在任务链中给出暂停、回退和恢复，而不是完成后让用户去设置里寻找权限。" },
    { label: "网络是交互状态", body: "Magic9/Qwen Intelligence 的长流程如果遇到弱网、登录态或第三方拒绝，界面要把下一步变成可操作选择。" }
  ],
  enItems: [
    { label: "Object before action", body: "Qwen Book and phone agents must select the right file, slide, account, and app; show object evidence before execution instead of only a natural-language plan." },
    { label: "Suggested, drafted, executed", body: "QwenNote A2 shows how a summary can become a message, calendar event, or to-do; every action needs a visible state and item-level approval before sending." },
    { label: "Expose local versus cloud", body: "PrismML turns routing into an interface problem: people need to know what stays on the device, what leaves it, and what happens when the local model is uncertain." },
    { label: "Undo belongs in the task", body: "A system agent needs pause, rollback, and recovery inside the task chain rather than hiding control in a settings page after completion." },
    { label: "Network is an interaction state", body: "When a long Magic9/Qwen flow meets weak connectivity, login state, or third-party refusal, the interface must turn the failure into an actionable choice." }
  ]
};
issue.watchlistZh = Array.from(new Set([
  "Qwen Book：零售价、硬件规格、兼容应用、OS harness 权限、对象级 diff、手机批准是否阻断后台执行。",
  "QwenNote A2：多人会议准确率、旁人同意、音频删除后的文字/摘要保留、4G 套餐、自动发送前审阅。",
  "Qwen Intelligence × Magic9：MagicOS 版本、实际 Agent 列表、91.8% 准确率条件、支付/验证码、暂停与回滚。",
  "PrismML Bonsai：公开 SDK、真实 AR1 设备、端侧功耗/延迟、模型路由、云端升级和隐私提示。",
  ...issue.watchlistZh
])).slice(0, 20);
issue.watchlistEn = Array.from(new Set([
  "Qwen Book: retail price, hardware, compatible apps, OS-harness authority, object-level diffs, and whether phone approval blocks background work.",
  "QwenNote A2: multi-speaker accuracy, bystander consent, text/summary retention after audio deletion, 4G plans, and review before automatic sending.",
  "Qwen Intelligence and Magic9: MagicOS version, actual agent list, conditions behind 91.8%, payment and verification, pause, and rollback.",
  "PrismML Bonsai: public SDK, real AR1 hardware, local power/latency, routing, cloud escalation, and privacy cues.",
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
await fs.cp(path.join(root, previousDate, "assets"), path.join(issueDir, "assets"), { recursive: true, force: false, errorOnExist: false });
for (const item of Object.values(visuals)) {
  await fs.access(path.join(issueDir, item.path));
}
await fs.rm(deckDir, { recursive: true, force: true });
await fs.cp(previousDeck, deckDir, { recursive: true, filter: (sourcePath) => !sourcePath.includes(`${path.sep}dist${path.sep}`) && !sourcePath.endsWith(`${path.sep}dist`) });
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });

const labels = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "用户原声", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "User voice", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const dossierText = (locale, item) => fields.map((field, i) => `**${labels[locale][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="./public/${visuals.qwenHardware.path}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(freshTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${freshTopics.map((item) => item.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\n**Design Desk** — ${issue.designDesk.zhTitle}。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue with source/date/evidence labels and PDF downloads.`,
  ...freshTopics.flatMap((item) => [`# ${item.zhHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("zh", item)}\n\n**Sources** — ${links(item)}`, `# ${item.enHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("en", item)}\n\n**Sources** — ${links(item)}`]),
  `# Design Desk / 设计洞察\n\n${issue.designDesk.zhItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}\n\n${issue.designDesk.enItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}`,
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n${issue.watchlistEn.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url)))).slice(0, 180).map((url, i) => `${i + 1}. ${url}`).join("\n")}\n\nVisual evidence uses local source-traceable images with contain positioning, white backgrounds, and no page-internal scrolling.`
];
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const laneRows = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"].map((lane) => `| ${lane} | ${issue.topics.some((item) => item.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((item) => `| ${item.id} | \`${item.visual.path}\` | ${item.visual.sourceUrl} | ${item.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | ---\n${visualRows}\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, pre-launch, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, fresh: freshTopics.length, sources: new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url))).size, visuals: new Set([issue.coverStory.imagePath, ...issue.topics.map((item) => item.visual.path)]).size, deckDir }));
