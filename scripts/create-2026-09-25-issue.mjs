import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-25";
const previousDate = "2026-09-24";
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
  museCharm: "https://about.fb.com/de/news/2026/09/meta-connect-2026/",
  museCharmReview: "https://techcrunch.com/2026/09/23/meta-made-a-tamagotchi-like-wearable-for-its-muse-ai-agent/",
  metaDat: "https://developers.meta.com/blog/meta-connect-recap-ai-glasses/",
  metaDatDocs: "https://developers.meta.com/wearables/",
  awear: "https://www.prnewswire.com/news-releases/emerging-from-stealth-awear-introduces-a-new-platform-for-personal-ai-302888183.html",
  awearSite: "https://awear.ai/",
  qualcommCommerce: "https://www.qualcomm.com/news/onq/2026/09/agentic-commerce-ai-agents-mastercard",
  qualcommAgentic: "https://www.qualcomm.com/news/onq/2026/09/snapdragon-summit-agentic-ai-pcs-linux"
};

const visuals = {
  museCharm: visual(
    "meta-muse-charm-official-2026-09-25.png", "source-backed official page screenshot",
    "Meta Connect 2026 官方页面中的 Muse Charm 口袋设备说明", "Meta Connect 2026 official page describing Muse Charm",
    "官方视觉：Muse Charm 被描述为可放进口袋、用于与 Muse 对话和互动的设备；更多信息预计在 2026 年晚些时候公布。",
    "Official visual: Muse Charm is described as a pocketable device for talking to and interacting with Muse; more details are expected later in 2026.", urls.museCharm
  ),
  metaDat: visual(
    "meta-dat-1-0-official-2026-09-25.png", "source-backed official developer screenshot",
    "Meta 开发者博客关于 Wearables Device Access Toolkit 1.0 的截图", "Meta developer blog announcing Wearables Device Access Toolkit 1.0",
    "开发者视觉：Toolkit 1.0、AI 眼镜作为移动应用免手前端，以及 9 月 30 日起的更新。",
    "Developer visual: Toolkit 1.0, AI glasses as a hands-free front end for mobile apps, and updates rolling out from September 30.", urls.metaDat
  ),
  awear: visual(
    "awear-personal-ai-prnews-2026-09-25.png", "source-backed startup press screenshot",
    "Awear 在 Snapdragon Summit 发布跨设备个人 AI 平台的截图", "Awear press release announcing a cross-device personal-AI platform",
    "创业公司发布视觉：Awear 从智能眼镜切入，让 Agent 跨设备、跨品牌移动，并以 Snapdragon AR1+ 为基础。",
    "Startup signal visual: Awear starts with smart glasses, moves an agent across devices and brands, and is built on Snapdragon AR1+.", urls.awear
  ),
  commerce: visual(
    "qualcomm-agentic-commerce-2026-09-25.png", "source-backed official page screenshot",
    "Qualcomm 与 Mastercard 的 agentic commerce 演示页面截图", "Qualcomm and Mastercard agentic-commerce demonstration page",
    "官方演示视觉：Agent 从理解与推荐走向发现、决策和商业执行；设备入口可以是手机、眼镜、PC 或汽车。",
    "Official demo visual: agents move from understanding and recommendation toward discovery, decision, and commerce execution across phones, glasses, PCs, or cars.", urls.qualcommCommerce
  )
};

const freshTopics = [
  product({
    id: "meta-muse-charm-pocket-agent-device-2026-09-25",
    section: "official",
    evidenceLabel: "confirmed product",
    sourceDate: "2026-09-24",
    evidenceStrength: "Meta Connect official recap plus TechCrunch product report; hardware is announced, not yet shipping",
    zhHeadline: "Muse Charm：个人 Agent 开始寻找一个口袋里的身体",
    enHeadline: "Muse Charm gives a personal agent a pocket-sized body",
    zhFact: "Meta Connect 官方 recap 把 Muse Charm 描述为用于与 Muse 对话和互动的小型设备，把 Muse 能力与实时语音模型放进可放入口袋的形态；Meta 仅表示将在 2026 年晚些时候提供更多信息。TechCrunch 报道它尚未出货，目标是 12 月假期前准备好，形态接近可放进口袋或挂在钥匙链上的小型装置。",
    enFact: "Meta's Connect recap describes Muse Charm as a small device for talking to and interacting with Muse, combining Muse capabilities with a state-of-the-art real-time voice model in a pocketable form. Meta says more information will follow later in 2026. TechCrunch reports that the device is not shipping yet, is targeted for the December holiday season, and resembles a small totem that can sit in a pocket or attach to a keychain.",
    zhValue: "Muse Charm 的产品意义不在于又增加一个聊天硬件，而在于 Meta 正在把个人 Agent 从手机、眼镜和网页中抽离，寻找一个无需屏幕、无需先打开 App、可以随身携带的语音入口。它解决的是用户不想戴眼镜、又不想掏出手机时的低摩擦对话与提醒问题；同时也把“它是否一直在听”“什么时候回应”“用户如何知道 Agent 在做什么”变成硬件层信任问题。",
    enValue: "The product signal is not simply another chat accessory. Meta is trying to detach a personal agent from the phone, glasses, and browser and give it a screen-light, always-carried voice entry point. That targets the moment when people want a low-friction conversation or reminder but do not want to wear glasses or pull out a phone. It also moves the trust problem into hardware: is the device listening, when does it respond, and how does a person know what the agent is doing when there is little or no display?",
    zhHciLens: ["入口：实时语音与随身设备", "上下文：Muse 个人记忆与任务", "反馈：语音、实体状态与手机联动", "边界：监听、唤醒、主动建议、退出"],
    enHciLens: ["Entry: real-time voice and a carried device", "Context: Muse memory and tasks", "Feedback: voice, physical state, and phone handoff", "Boundary: listening, wake state, proactive suggestions, exit"],
    zhImplication: "没有显示器的 Agent 设备必须把系统状态外化到声音、灯光、触感、手机同步和实体操作。产品团队要在“唤醒—理解—执行—等待批准—完成—忘记”之间给出可辨认的状态，而不能让用户用猜测来判断设备是否在记录或代办。Muse Charm 还会测试用户是否接受一个没有键盘、屏幕和明确 app 边界的长期个人入口。",
    enImplication: "A display-light agent device has to externalise state through sound, light, haptics, phone synchronisation, and physical controls. The product must make wake, understanding, execution, waiting for approval, completion, and forgetting distinguishable instead of asking the user to guess whether it is recording or acting. Muse Charm will test whether people accept a long-lived personal entry point without a keyboard, screen, or obvious app boundary.",
    visual: visuals.museCharm,
    sources: [source("Meta Connect 2026 official recap", urls.museCharm, "official"), source("TechCrunch: Muse Charm", urls.museCharmReview, "reviews"), source("Meta: Introducing Muse", "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/", "official")],
    dossier: {
      zh: {
        productName: "Meta Muse Charm",
        productType: "Muse Charm 是 Meta 在 Connect 2026 展示的一款面向 Muse 个人 Agent 的小型随身设备。官方 recap 将它描述为可以与 Muse 对话和互动、把 Muse 能力与实时语音模型结合、并能放进口袋的产品；它不是已经公开完整规格的手机，也不是当前 Ray-Ban Meta 眼镜的一个软件按钮。TechCrunch 将其描述为可放进口袋或挂在钥匙链上的小型装置，说明 Meta 正在尝试给个人 Agent 一个独立于屏幕和眼镜的身体入口。当前证据确认了产品方向与名称，但尚未确认最终外观、输入方式和销售配置。",
        interactionFlow: "官方公开的核心流程是用户携带 Muse Charm，以语音和它互动，再由 Muse 个人 Agent 处理问题、记忆上下文或继续任务。由于 Muse 本身支持在 App、WhatsApp、网页和桌面入口中执行长期任务，Charm 很可能承担更短、更即时的语音入口，再把复杂结果交回手机或其他设备；但这条跨设备流程没有被官方完整展示，不能写成已确认的交互。未公开的关键状态包括唤醒词或实体按键、录音指示、免打扰、连续对话、主动建议、需要用户批准时的通知方式、离线状态、取消、删除记忆和设备丢失后的远程停用。",
        specsOrStack: "官方只确认 Muse 能力与实时语音模型被组合在可放入口袋的设备中。既有 Muse 架构包括 Muse app、WhatsApp、muse.ai、Muse Spark、Muse Secure VM、Sentinel、服务连接和审计轨迹。Muse Charm 的芯片、麦克风数量、扬声器、摄像头是否存在、屏幕/灯光/触感、重量、尺寸、续航、连接协议、是否依赖手机、是否具备端侧模型、数据传输方式、IP 防护、价格和 API/SDK 均为 source not stated；不能从“实时语音”推断端侧推理或全天候监听。",
        useCases: "可确认的产品路径是随身携带并与 Muse 语音互动。结合 Muse 已公布的任务能力，它可能适合在走路、做家务、通勤、购物或需要双手空闲时快速询问、添加提醒、继续长期目标、等待任务状态或在手机上接手复杂网页操作。这里的“可能”来自产品形态与 Muse 的现有能力，不能当作 Charm 已支持的具体功能。Meta 尚未公布 Charm 是否能独立发消息、播放音频、识别环境、执行支付、接入眼镜或在没有手机网络时工作。",
        painPointsSolved: "它针对的是手机取出成本、眼镜佩戴门槛和语音助手缺少持续个人上下文的问题。用户不必先找到屏幕或戴上带相机的眼镜，就能进入个人 Agent；一个独立入口也可能让 Muse 在不同终端之间保持同一段任务上下文。它同时制造新痛点：口袋设备更容易被误触或遗失，纯音频更难显示复杂计划和权限，长期监听会影响旁人接受度，且没有视觉界面时取消与纠错更难。",
        userVoice: "TechCrunch 的报道确认设备尚未出货，并将其放在 AI amulet、Tamagotchi-like wearable 的产品语境中；这说明媒体对其形式与长期陪伴感有兴趣，但不是对续航、舒适度、识别准确率或任务成功率的测试。当前没有独立用户评测、售价、量产样机或可复现隐私审计，因此用户接受度仍是 unknown。",
        newTech: "新技术信号是把个人 Agent 的实时语音模型从软件入口映射到一个低屏幕、低摩擦的随身终端。它可能让 Agent 在不同硬件之间保持身份与记忆，形成“同一个 Agent、多种身体”的架构；但真正的新意取决于 Meta 是否公开可撤销权限、可迁移记忆、跨设备 handoff 和不打扰策略。单独的口袋外形不等于技术创新，关键要看它如何把语音、云端 Secure VM、手机和未来眼镜接成一条可控链。",
        availability: "Meta Connect 2026 官方 recap 表示更多信息将在 2026 年晚些时候公布；TechCrunch 报道目标是 12 月假期前准备出货。当前没有公开预订页、价格、上市地区、开发者入口、售后、订阅要求或实际发货时间，因此它是 announced product，不是今天可购买的 confirmed retail product。",
        limitsOrUnknowns: "重点未知包括是否有相机、麦克风和录音灯如何工作、唤醒与误触发、手机依赖、网络中断时的降级、私人记忆是否默认同步、用户如何看到审计轨迹、如何让设备忘记一段对话、丢失后的账号解绑、旁人知情、未成年人使用、持续语音的电池成本以及 Muse Charm 与 Ray-Ban Meta、Meta AI app、WhatsApp 的权限边界。没有这些信息，不能把它描述为安全的全天候 Agent。",
        productVerdict: "Muse Charm 是一个清晰但仍未完成的个人 Agent 形态信号：Meta 试图用口袋设备降低与 Muse 互动的入口成本，并把 Agent 从单一 App 变成跨终端人格。判断暂定为 confirmed product / pre-shipping；价值取决于语音状态可见性、审批与取消、个人记忆控制和真实续航，而不是“放进口袋”本身。"
      },
      en: {
        productName: "Meta Muse Charm",
        productType: "Muse Charm is a small companion device that Meta introduced at Connect 2026 for its Muse personal agent. Meta's recap describes it as a pocketable product for talking to and interacting with Muse, combining Muse's capabilities with a state-of-the-art real-time voice model. It is not a fully specified phone and it is not merely a software toggle inside today's Ray-Ban Meta glasses. TechCrunch describes a small totem that can live in a pocket or attach to a keychain, which makes the product direction clear: Meta is searching for a body for a personal agent that is independent of a screen and, at least in some situations, independent of glasses. The product direction and name are confirmed; the final hardware and retail configuration are not.",
        interactionFlow: "The public core flow is that a person carries Muse Charm, speaks to it, and lets the Muse personal agent answer, remember context, or continue work. Muse already has app, WhatsApp, web, and desktop entry points for longer tasks, so Charm may provide a shorter and more immediate voice route while returning complex results to the phone or another device. That handoff is not fully shown by Meta and is not treated as a confirmed interaction. Important undisclosed states include the wake word or physical button, recording indicator, quiet mode, continuous conversation, proactive suggestions, approval notification, offline behaviour, cancellation, memory deletion, and remote disable after loss. Without these states, a tiny voice device is difficult to trust.",
        specsOrStack: "Meta confirms only that Muse capabilities and a real-time voice model are combined in a pocketable device. The existing Muse architecture includes the Muse app, WhatsApp, muse.ai, Muse Spark, Muse Secure VM, Sentinel, connected services, and an audit trail. Charm's chip, microphone count, speaker, presence of a camera, display, light, haptics, weight, dimensions, battery, radio, phone dependency, on-device model, data path, water resistance, price, and API or SDK are source not stated. Real-time voice does not prove on-device inference or an always-listening microphone.",
        useCases: "The confirmed product path is carrying the device and speaking with Muse. Combined with Muse's already announced agent capabilities, the form could be useful while walking, cooking, commuting, shopping, or keeping both hands free for a quick question, reminder, long-running goal, task status, or handoff to a more complex browser workflow. That is a product implication, not proof that Charm already supports each use case. Meta has not stated whether Charm can independently send messages, play audio, understand the environment, execute payment, connect to glasses, or operate without a phone and network.",
        painPointsSolved: "Charm targets the cost of pulling out a phone, the barrier of wearing glasses, and the lack of persistent personal context in conventional voice assistants. A dedicated entry point could let people reach the same personal agent without finding a screen or putting on camera-equipped eyewear, while keeping task context across different bodies. It also introduces new pain: a pocket device is easier to mis-trigger or lose, audio cannot expose a complex plan or permission boundary as clearly as a screen, ambient listening affects bystanders, and cancellation and correction are harder without a visual interface.",
        userVoice: "TechCrunch confirms that the device had not shipped and places it in the cultural category of an AI amulet or Tamagotchi-like wearable. That is a signal about how media interpret its companionship and form, not a test of battery, comfort, recognition accuracy, or task success. There is no independent long-term review, price, mass-market unit, or reproducible privacy audit yet, so user acceptance remains unknown.",
        newTech: "The new technology signal is mapping a personal agent's real-time voice model into a low-screen, low-friction carried terminal. It could support an architecture of one agent with multiple bodies, keeping identity and memory across hardware. The novelty will depend on whether Meta exposes revocable permissions, portable memory, cross-device handoff, and a non-interruptive policy. A pocket shape is not itself an innovation; the meaningful question is how voice, Muse Secure VM, phone, and future glasses become one controllable chain.",
        availability: "Meta's official Connect recap says more information will arrive later in 2026. TechCrunch reports a goal of being ready to ship before the December holiday season. There is no public pre-order page, price, market list, developer entry, support policy, subscription requirement, or committed shipping date. It is therefore an announced, pre-shipping product rather than a retail product available today.",
        limitsOrUnknowns: "Open questions include whether it has a camera, how microphones and recording lights work, wake and false-trigger behaviour, phone dependency, offline fallback, default memory synchronisation, audit visibility, conversational forgetting, account unlinking after loss, bystander awareness, minors, the battery cost of continuous voice, and the permission boundary between Charm, Ray-Ban Meta, the Meta AI app, and WhatsApp. Without these details it cannot be described as a safe always-on agent.",
        productVerdict: "Muse Charm is a clear but incomplete personal-agent form-factor signal. Meta is trying to lower the entry cost to Muse with a pocket device and turn the agent from a single app into a cross-terminal identity. Verdict: confirmed announced product, pre-shipping; its value depends on legible voice state, approval and cancellation, memory control, and real battery life rather than on pocketability alone."
      }
    }
  }),
  product({
    id: "meta-wearables-device-access-toolkit-1-0-2026-09-25",
    section: "official",
    evidenceLabel: "developer surface",
    sourceDate: "2026-09-24",
    evidenceStrength: "Meta developer blog; Toolkit 1.0 rollout and hardware gating are explicitly stated",
    zhHeadline: "Meta Wearables DAT 1.0：把 AI 眼镜从硬件卖点变成移动 App 前端",
    enHeadline: "Meta Wearables DAT 1.0 turns AI glasses into a mobile-app front end",
    zhFact: "Meta 开发者博客宣布 Wearables Device Access Toolkit 经过一年 developer preview 后进入 1.0，移动 App 可以保留既有逻辑和后端，让 Meta AI 眼镜成为免手前端；更新从 9 月 30 日开始推出。工具链还把 Web Apps Starter Kit、API 连接和新的发现入口放进 AI 眼镜开发路径。",
    enFact: "Meta's developer blog says the Wearables Device Access Toolkit reaches 1.0 after a year in developer preview. A mobile app can keep its existing logic and backend while AI glasses become its hands-free front end; the updates begin rolling out on September 30. The path also includes a Web Apps Starter Kit, API connections, and new discovery surfaces.",
    zhValue: "这是一条比“给眼镜做一个新 App”更现实的开发路径：开发者把眼镜视为现有移动服务的相机、音频、显示和语音前端。它减少重建后端和账户体系的成本，也让 AI 眼镜更像一个平台入口，而不是封闭硬件。代价是开发者必须重新处理权限、隐私提示、低带宽、无屏状态、跨设备身份和用户如何从眼镜回到手机。",
    enValue: "This is a more practical developer path than asking every team to build a new glasses app from scratch. A developer keeps the mobile service's logic and backend, then treats glasses as a camera, audio, display, and voice front end. That reduces the cost of rebuilding accounts and cloud infrastructure and makes AI glasses more like a platform entry point than a closed accessory. The trade is a new responsibility for permission, privacy cues, low-bandwidth behaviour, displayless state, cross-device identity, and the return path from glasses to phone.",
    zhHciLens: ["入口：既有移动 App + 眼镜前端", "上下文：相机、音频、显示、账户", "动作：免手任务与服务调用", "边界：硬件资格、权限、发现与退出"],
    enHciLens: ["Entry: existing mobile app plus glasses front end", "Context: camera, audio, display, and account", "Action: hands-free tasks and service calls", "Boundary: hardware access, permission, discovery, exit"],
    zhImplication: "平台开放不等于体验自动统一。开发者需要为同一个任务设计眼镜态、手机态和 Web 态的状态迁移，明确哪些数据被相机/麦克风读到、哪些动作需要手机批准，以及用户如何在没有屏幕的环境中发现功能。Toolkit 1.0 的真正验收指标应是跨设备恢复和权限可读性，而不是 API 数量。",
    enImplication: "Platform access does not produce a coherent experience automatically. Teams need a state transition across glasses, phone, and web for the same task, with clear disclosure of what the camera or microphone reads, which actions need phone approval, and how a user discovers a capability without a full screen. The meaningful acceptance criteria for Toolkit 1.0 are cross-device recovery and permission legibility, not API count.",
    visual: visuals.metaDat,
    sources: [source("Meta developer blog: Connect recap", urls.metaDat, "official"), source("Meta Wearables developer center", urls.metaDatDocs, "developer surface"), source("Meta Wearables Device Access Toolkit repository", "https://github.com/facebook/meta-wearables-dat-ios", "developer surface")],
    dossier: {
      zh: {
        productName: "Meta Wearables Device Access Toolkit 1.0",
        productType: "Wearables Device Access Toolkit（DAT）是 Meta 给移动开发者的 AI 眼镜连接工具链。Meta 开发者博客称它在经历一年 developer preview 后进入 1.0，目标是让开发者保留移动 App 的逻辑与后端，把 AI 眼镜作为免手前端。它不是一个独立消费者硬件，而是连接手机 App、Meta AI 眼镜、相机、音频、显示和服务 API 的 developer surface。Web Apps Starter Kit、API 接入和新的发现入口一起构成了 Meta 试图扩张眼镜软件生态的路径。",
        interactionFlow: "开发者先拥有一个移动 App 或 Web 服务，再按 Toolkit 的能力接入眼镜。当用户戴上兼容眼镜，移动 App 通过设备访问层获得相机、音频或显示能力，用户在现实环境中用语音、拍摄或眼镜反馈完成原本需要手机的步骤；复杂设置、登录、授权和结果编辑仍可以回到手机。官方博客没有给出所有权限弹窗、录音指示、离线模式、断开恢复、后台运行、多个 App 抢占设备和用户如何停止一个持续任务的完整流程，因此这些不能视为 1.0 的统一 UX 保证。",
        specsOrStack: "官方披露的 stack 包括 Wearables Device Access Toolkit 1.0、移动 App 逻辑与后端、Meta AI 眼镜硬件、设备相机/音频/显示能力、Web Apps Starter Kit、API 连接和开发者发现面。公开仓库显示 iOS 方向的 CameraAccess sample 与相关开发资产。Meta 表示更新从 2026 年 9 月 30 日开始推出，但没有在博客中统一列出 Android/iOS 版本、兼容硬件 SKU、权限粒度、数据格式、调用频率、开发者审核、商业分成、SDK 下载包、地区和完整 API 列表；缺失项为 source not stated。",
        useCases: "具体开发路径包括把移动 App 的相机或音频能力延伸到眼镜，用免手方式捕捉、翻译、导航、记录、查看提示或触发一个服务；Web App 和 API 连接则允许网站或已有服务被眼镜发现和调用。Meta 还强调新的 discovery surfaces，让用户可以探索和开始使用开发者构建的体验。每个场景都要求开发者把眼镜适合的短反馈与手机适合的长编辑分开，不能把手机页面原样缩进眼镜。",
        painPointsSolved: "DAT 解决的是开发者重复建设账户、后端和业务逻辑，以及用户必须掏手机才能调用服务的摩擦。平台把眼镜作为前端，降低硬件接入门槛，并让既有服务获得新的免手入口。它没有解决设备数量、地区、权限和隐私政策碎片化，也没有保证眼镜上的任务比手机更快或更少打扰。开发者还要承担旁观者录制、误识别、后台音频和跨设备状态丢失的风险。",
        userVoice: "今天可用的证据是 Meta 官方开发者博客、开发者中心和公开代码仓库，不是第三方实机评测。公开资料确认 1.0 与 rollout 计划，但没有足够的独立开发者反馈来判断编译稳定性、API 变更成本、审核时长、真机延迟或用户发现率。",
        newTech: "新技术信号不是某个单一传感器，而是把 AI 眼镜定义为移动应用的 hands-free front end，并通过 Toolkit、Web starter kit、API 和发现层把服务生态拉到设备上。它把“眼镜 App”转化为跨设备前端架构：业务状态仍在既有服务，身体感知与低摩擦反馈在眼镜。这个架构能否成立，取决于设备访问权限、系统级身份、后台连接和错误恢复是否足够稳定。",
        availability: "Meta 开发者博客称 Toolkit 1.0 已正式发布，相关更新从 2026 年 9 月 30 日开始推出；设备资格、可用地区、具体 SDK 版本、开发者账户要求和可发布范围仍需按开发者文档与审核流程确认。它对开发者开放的程度已被官方确认，但不等于所有消费者今天都能使用所有新体验。",
        limitsOrUnknowns: "未知项包括兼容眼镜 SKU、iOS/Android parity、应用在后台的生命周期、相机/音频/显示权限是否按任务细分、录制状态如何被旁人看见、Web App 的安全边界、API 调用成本、发现排序、数据留存、跨设备登录、弱网降级、眼镜丢失后的撤销和第三方服务如何处理敏感内容。Toolkit 1.0 仍需通过真实任务与真机测试验证。",
        productVerdict: "DAT 1.0 是当前 Meta 生态里最重要的 developer surface 之一：它让 AI 眼镜从一组硬件能力转成移动服务的前端入口。结论：developer surface，平台方向已确认，具体体验质量取决于权限、发现、跨设备恢复和审核/兼容性边界，不能仅凭 1.0 标签判断成熟度。"
      },
      en: {
        productName: "Meta Wearables Device Access Toolkit 1.0",
        productType: "The Wearables Device Access Toolkit, or DAT, is Meta's integration surface for mobile developers who want to use AI glasses. Meta's developer blog says it reaches version 1.0 after a year in developer preview. The intended model is that a team keeps the logic and backend of its mobile app while AI glasses become a hands-free front end. DAT is not a consumer device; it is a bridge between mobile applications, Meta AI glasses, camera, audio, display, and service APIs. A Web Apps Starter Kit, API connections, and new discovery surfaces are part of the broader route by which Meta is trying to grow software around the glasses.",
        interactionFlow: "A developer starts with an existing mobile app or web service and connects the relevant device capabilities through the toolkit. When a user wears compatible glasses, the mobile app can access camera, audio, or display capability through the device layer; the user then completes a task with voice, capture, or glanceable feedback that would otherwise require the phone. Complex setup, login, approval, and editing can remain on the phone. The official blog does not document every permission prompt, recording indicator, offline mode, disconnect recovery, background lifecycle, multi-app contention, or stop path for an ongoing task. These are therefore not treated as a universal 1.0 UX guarantee.",
        specsOrStack: "The disclosed stack includes Wearables Device Access Toolkit 1.0, existing mobile-app logic and backend, Meta AI glasses, device camera, audio and display capabilities, the Web Apps Starter Kit, API connections, and developer discovery surfaces. The public repository includes an iOS direction and a CameraAccess sample. Meta says the updates begin rolling out on September 30, 2026, but the blog does not provide one complete list of iOS and Android versions, compatible hardware SKUs, permission granularity, data formats, call limits, developer review, commercial terms, SDK packages, regions, or the complete API surface; those details are source not stated.",
        useCases: "Concrete paths include extending a mobile app's camera or audio workflow to glasses for hands-free capture, translation, navigation, note-taking, glanceable prompts, or a service action. Web apps and API connections let sites and existing services become discoverable and callable from glasses. Meta also describes new discovery surfaces where people can explore and start using what developers build. Each scenario requires a split between short, glanceable or audible feedback on glasses and long editing or account management on the phone; a phone layout cannot simply be shrunk into eyewear.",
        painPointsSolved: "DAT targets the developer cost of rebuilding accounts, backend logic, and service state for a new hardware category, as well as the user friction of reaching for a phone before a service can be used. By treating glasses as a front end, the platform lowers integration cost and gives existing services a hands-free entry point. It does not solve fragmented hardware availability, regional support, permission policy, or privacy behaviour, and it does not guarantee that a glasses path will be faster or less interruptive than a phone. Developers still own bystander recording, misrecognition, background audio, and cross-device state-loss risks.",
        userVoice: "The available evidence is Meta's developer blog, developer centre, and public code repository rather than independent hands-on testing. The material confirms the 1.0 and rollout plan but does not provide enough developer feedback to judge compile stability, migration cost, review duration, real-device latency, or user discovery. Those remain unverified.",
        newTech: "The technology signal is architectural: AI glasses become a hands-free front end for mobile applications, supported by a toolkit, web starter kit, APIs, and discovery. That turns a glasses app into a cross-device front-end pattern. Business state remains in the existing service, while bodily sensing and low-friction feedback happen on glasses. The architecture will succeed only if device permission, system identity, background connectivity, and recovery are stable enough for real tasks.",
        availability: "Meta's developer blog says DAT 1.0 is officially here and that related updates begin rolling out on September 30, 2026. Device eligibility, regions, exact SDK versions, developer-account requirements, and publishable capabilities still need to be checked in the docs and review flow. The developer surface is confirmed; that does not mean every consumer can use every new experience today.",
        limitsOrUnknowns: "Open questions include compatible glasses SKUs, iOS and Android parity, app background lifecycle, task-level camera and audio permission, bystander-visible recording state, web-app security boundaries, API cost, discovery ranking, retention, cross-device login, weak-network fallback, revocation after a lost pair of glasses, and sensitive-data handling by third-party services. Toolkit 1.0 still requires real-task and real-hardware validation.",
        productVerdict: "DAT 1.0 is one of Meta's most important current developer surfaces because it turns AI glasses from a set of hardware capabilities into a front end for existing mobile services. Verdict: confirmed developer surface; the direction is real, while quality depends on permission, discovery, cross-device recovery, review, and compatibility boundaries rather than the 1.0 label alone."
      }
    }
  }),
  product({
    id: "awear-cross-device-personal-ai-platform-2026-09-25",
    section: "wild",
    evidenceLabel: "startup signal",
    sourceDate: "2026-09-23",
    evidenceStrength: "Awear company-provided PR Newswire launch; partners, hardware, pricing, and shipping remain undisclosed",
    zhHeadline: "Awear：让个人 Agent 跨品牌迁移，而不是被设备锁定",
    enHeadline: "Awear wants a personal agent to move across eyewear brands",
    zhFact: "Awear 在 Snapdragon Summit 从隐身状态出现，发布跨设备、上下文感知、多模态的个人 AI 平台，从智能眼镜切入，声称让用户创建和塑造自己的私人 Agent，并让它跨设备、跨品牌移动；平台基于 Snapdragon AR1+，已与第一批设备和眼镜合作方工作，但合作方、产品、价格与上市时间未公开。",
    enFact: "Awear emerged from stealth at Snapdragon Summit with a cross-device, context-aware, multimodal personal-AI platform. Starting with smart glasses, it says people can create and shape a private agent that moves across devices and brands. The platform is built on Snapdragon AR1+ and is already working with an initial group of device and eyewear partners, but the partners, product names, price, and shipping plan are not disclosed.",
    zhValue: "Awear 试图解决智能眼镜市场的结构性问题：用户买到的是某个品牌的相机、模型和云服务，个人上下文却被锁在设备里。它把 Agent 身份与眼镜外形分开，让品牌保留设计和服务关系，同时让用户带着 Agent 换设备。这个方向对长期记忆和跨设备 handoff 有吸引力，但目前是公司发布的创业信号，不是已验证的可购买产品。",
    enValue: "Awear is addressing a structural problem in smart glasses: a buyer receives one brand's camera, model, and cloud account while personal context remains trapped in that device. The company separates agent identity from the frame, allowing a brand to keep its design and service relationship while the person carries an agent across devices. That is attractive for long-term memory and handoff, but today's evidence is a company launch signal, not a validated retail product.",
    zhHciLens: ["入口：智能眼镜与跨设备 Agent", "上下文：个人记忆、环境和多模态输入", "动作：跨品牌连续任务", "边界：身份迁移、数据归属、合作方"],
    enHciLens: ["Entry: smart glasses and a cross-device agent", "Context: personal memory, environment, multimodal input", "Action: continuous tasks across brands", "Boundary: identity portability, data ownership, partners"],
    zhImplication: "如果 Agent 真能跨品牌迁移，用户界面必须让人看见“我带走的是什么”：记忆、权限、联系人、模型偏好、付款方式，还是只是一组会话摘要。品牌也会面临双重边界：既要给 Agent 足够上下文，又要防止平台拿走用户关系。跨设备连续性不能只靠登录，需要可导出、可撤销、可分层的记忆与权限模型。",
    enImplication: "If an agent really moves across brands, the interface must show what is being carried: memories, permissions, contacts, model preferences, payment methods, or only a conversation summary. Brands face a double boundary: they need to give the agent enough context while preventing the platform from owning the customer relationship. Continuity cannot be reduced to login; it needs exportable, revocable, layered memory and permission models.",
    visual: visuals.awear,
    sources: [source("Awear launch release", urls.awear, "wild"), source("Awear official site", urls.awearSite, "startup signal"), source("Qualcomm Snapdragon Summit context", "https://www.qualcomm.com/company/events/snapdragon-summit", "official")],
    dossier: {
      zh: {
        productName: "Awear personal AI platform",
        productType: "Awear 是一家在 Snapdragon Summit 2026 公开出现的创业公司，发布了一个跨设备、上下文感知、多模态的个人 AI 平台。公司从智能眼镜切入，主张用户可以创建和塑造属于自己的私人 Agent，再让它跨不同设备和品牌移动。对设备厂商而言，Awear 允许品牌围绕用户的 Agent 构建差异化体验，而不是把客户关系完全交给一个通用第三方助手。当前没有公开的终端产品名、消费者应用或可购买硬件，因此它应被视为 startup signal。",
        interactionFlow: "公司公开的方向是用户先拥有一个个人 Agent，再通过不同品牌的智能眼镜接触它。眼镜提供环境感知、语音或其他多模态输入，Agent 读取个人上下文并在当前设备上返回反馈；当用户换到另一副兼容眼镜时，Agent 的身份和部分上下文可以继续存在。Awear 没有展示完整的注册、记忆导入、设备配对、权限批准、跨品牌 handoff、离线工作、任务中断或删除流程，因此不能把“跨设备”写成已实现的完整体验。",
        specsOrStack: "Awear 新闻稿披露平台基于 Snapdragon AR1+，具备 cross-device、context-aware、multimodal intelligence layer 的定位，并已与第一批设备和眼镜合作方合作。公司没有披露模型名称、端侧/云端边界、运行时、内存格式、身份协议、加密、数据存储地区、眼镜传感器、手机依赖、SDK、API、价格、订阅、兼容设备清单或性能数据；这些全部是 source not stated。Snapdragon AR1+ 是平台基础，不等于 Awear 已公开某一完整硬件 SKU。",
        useCases: "公开材料支持的场景是把同一个个人 Agent 带到不同智能眼镜上，并由品牌在各自产品中提供自己的体验。具体可以想象为用户在通勤、旅行、购物或工作时跨设备保持个人偏好、语音入口和连续任务，但新闻稿没有给出可复现的导航、翻译、购物、会议或健康流程。对硬件品牌，价值在于不必把所有 AI 体验外包给系统级大模型厂商；对用户，价值取决于换设备时记忆和权限是否真的可控。",
        painPointsSolved: "Awear 试图解决设备锁定、品牌之间上下文断裂、每副眼镜重新训练助手、以及品牌无法保留独特服务关系的问题。它把 Agent 看作跨设备的个人层，把眼镜看作不同的身体和服务入口。它没有解决模型质量、隐私激励冲突、记忆错误、跨品牌权限、合作方退出、账号迁移和数据删除；如果用户无法导出或撤销 Agent，跨设备可能只是把锁定从硬件迁移到另一层平台。",
        userVoice: "目前没有独立实机评测、消费者反馈或合作伙伴的可验证产品页面。PR Newswire 是公司提供的发布材料，能证明 Awear 在 9 月 23 日公开其平台叙事，却不能证明合作设备已经发货、跨品牌 handoff 可用或隐私承诺已通过外部审计。",
        newTech: "新技术信号是把 personal agent identity 从设备品牌中抽象出来，再用上下文感知和多模态输入让它在不同眼镜之间移动。这个方向把智能眼镜的竞争从“谁的框架装了哪个模型”转成“谁能让用户拥有一个可迁移的 Agent”。技术成败不在概念，而在记忆表示、权限继承、设备证明、低延迟 handoff、离线降级和品牌之间的责任分配。",
        availability: "Awear 已在 2026 年 9 月 23 日通过公司新闻稿公开平台，并称正在与第一批设备和眼镜合作方合作。没有公开消费硬件、价格、预订、开发者下载、合作方名单、上市地区、发货时间或正式 API，因此当前不可购买，也不能当成量产产品。",
        limitsOrUnknowns: "关键未知包括 Agent 是否由用户持有、记忆能否导出、合作品牌能看到多少上下文、权限是否随设备继承、不同品牌如何处理录音和视觉数据、模型由谁托管、断网时是否可用、用户如何迁移支付与联系人、合作方退出后的数据处理、未成年人保护、订阅归属、模型更新与故障责任。startup signal 标签必须保留。",
        productVerdict: "Awear 是一个值得跟踪的个人 Agent 基础设施信号：它把 Agent 作为跨品牌的可迁移身份，把智能眼镜定位为不同的身体入口。结论：startup signal，战略方向清晰，产品、合作方、SDK 与真实跨设备流程未验证；下一步应看它是否发布可用硬件或开发者文档，而不是继续从新闻稿推断成熟度。"
      },
      en: {
        productName: "Awear personal AI platform",
        productType: "Awear emerged publicly at Snapdragon Summit 2026 with a cross-device, context-aware, multimodal personal-AI platform. Starting with smart glasses, the company says people can create and shape a private agent and carry it across devices and brands. For device makers, Awear offers a way to build a differentiated experience around a customer's agent instead of handing the entire relationship to a general-purpose assistant. There is no public consumer product name, retail application, or purchasable hardware yet, so this remains a startup signal.",
        interactionFlow: "The public direction is that a person owns or shapes a personal agent and reaches it through smart glasses from different brands. The glasses provide environmental sensing, voice, or other multimodal input; the agent uses personal context and returns feedback through the current device. When the person changes to another compatible frame, the identity and some context are intended to continue. Awear has not shown a complete registration, memory import, pairing, permission approval, cross-brand handoff, offline, interruption, or deletion flow. “Cross-device” is therefore not treated as a delivered end-to-end experience.",
        specsOrStack: "The release discloses a platform based on Snapdragon AR1+ and describes a cross-device, context-aware, multimodal intelligence layer already being explored with an initial group of device and eyewear partners. It does not state model names, edge/cloud boundary, runtime, memory format, identity protocol, encryption, data regions, glasses sensors, phone dependency, SDK, API, price, subscription, compatible-device list, or performance data. Snapdragon AR1+ is the silicon foundation, not proof of a complete Awear hardware SKU.",
        useCases: "The release supports the use case of carrying the same personal agent across different smart-glasses products while each brand creates its own experience. One can imagine continuity for preferences, voice entry, and tasks during commuting, travel, shopping, or work, but the announcement does not provide a reproducible navigation, translation, shopping, meeting, or health flow. For hardware brands, the value is retaining a distinctive relationship instead of outsourcing every AI surface to a platform model. For users, the value depends on whether memory and permission really remain under their control when they change devices.",
        painPointsSolved: "Awear targets device lock-in, broken context between brands, retraining an assistant for each pair of glasses, and the loss of brand differentiation when a general assistant owns the interaction. It treats the agent as a personal layer and glasses as different bodies and service entry points. It does not solve model quality, privacy incentives, memory error, cross-brand permission, partner exit, account migration, or deletion. If a user cannot export or revoke the agent, the platform may simply move lock-in from hardware to another layer.",
        userVoice: "There is no independent hands-on review, consumer feedback, or partner product page that verifies the announced system. The PR Newswire release is company-provided material and can establish that Awear publicly introduced its platform narrative on September 23; it cannot establish that partner devices have shipped, cross-brand handoff works, or privacy claims have passed external audit.",
        newTech: "The technology signal is an abstraction of personal-agent identity away from a device brand, joined with context-aware and multimodal input so the agent can move between frames. That shifts the category question from which brand puts which model in the glasses to whether a person can own a portable agent. The hard work is memory representation, permission inheritance, device attestation, low-latency handoff, offline fallback, and responsibility across brands.",
        availability: "Awear publicly announced the platform through a company release on September 23, 2026 and says it is working with an initial group of device and eyewear partners. There is no public consumer hardware, price, pre-order, developer download, partner list, market, shipping date, or formal API. It is not purchasable and should not be treated as a production product.",
        limitsOrUnknowns: "Open questions include who owns the agent, whether memory can be exported, how much context partner brands can see, whether permission follows the agent, how brands handle audio and visual data, who hosts the model, offline behaviour, migration of payment and contacts, data handling after a partner leaves, minors, subscription ownership, model updates, and failure responsibility. The startup-signal downgrade must remain explicit.",
        productVerdict: "Awear is a useful personal-agent infrastructure signal because it treats the agent as a portable identity and smart glasses as interchangeable bodies. Verdict: startup signal; the strategic direction is clear, while product, partners, SDK, and real cross-device flow remain unverified. The next evidence should be shippable hardware or developer documentation, not more inference from the release copy."
      }
    }
  }),
  product({
    id: "qualcomm-mastercard-agentic-commerce-demo-2026-09-25",
    section: "global",
    evidenceLabel: "developer surface",
    sourceDate: "2026-09-24",
    evidenceStrength: "Qualcomm official demonstration with Mastercard; demo is not a general commerce rollout",
    zhHeadline: "Qualcomm × Mastercard：Agent 从推荐走到商业执行",
    enHeadline: "Qualcomm and Mastercard push agents from recommendation toward checkout",
    zhFact: "Qualcomm 以 Mastercard 为合作方演示 agentic commerce：Agent 不只理解需求和推荐，还能支持发现与商业体验；入口可以是手机、眼镜、PC、汽车等设备。官方把挑战描述为理解用户意图、判断是否值得打扰，并安全执行后续工作；这是一场演示，不是已开放的消费支付产品。",
    enFact: "Qualcomm's Mastercard demonstration frames agentic commerce as a path from understanding and recommendation to discovery and commerce execution. The interface may be a phone, glasses, PC, vehicle, or another connected device. Qualcomm describes the hard problem as understanding intent, deciding whether attention is warranted, and safely performing the work that follows. This is a demonstration, not a generally available consumer payment product.",
    zhValue: "它把个人 Agent 的执行边界推到支付和商业决策：用户可以从“我想完成什么”开始，而不是在多个商店、筛选器和结账页之间手动搬运。产品价值在于减少搜索、比较、填表和支付的碎片动作；产品风险也更具体，一次错误的偏好推断可能变成购买、扣款或不可逆的服务承诺。支付确认、商户透明和可撤销性必须成为主界面。",
    enValue: "The demonstration moves a personal agent's execution boundary into payment and commercial decisions. A user can start from an outcome instead of manually carrying intent through shops, filters, forms, and checkout screens. The value is fewer fragmented search, comparison, form-filling, and payment actions. The risk is also concrete: one wrong preference inference can become a purchase, charge, or irreversible service commitment. Confirmation, merchant clarity, and reversibility have to be part of the primary interface.",
    zhHciLens: ["入口：手机、眼镜、PC、汽车", "上下文：意图、偏好、商户与支付状态", "动作：发现、比较、购买", "边界：批准、欺诈、商户、撤销"],
    enHciLens: ["Entry: phone, glasses, PC, vehicle", "Context: intent, preferences, merchant, payment state", "Action: discovery, comparison, purchase", "Boundary: approval, fraud, merchant, reversal"],
    zhImplication: "Agentic commerce 的关键不是把结账按钮藏起来，而是把 Agent 的决策链拆给用户看：它理解了什么、排除了什么、为什么选这个商户、用了哪种付款方式、哪些条件还没确认。跨设备入口越多，越需要一个与设备无关的订单状态、授权记录和撤销入口。",
    enImplication: "Agentic commerce should not hide checkout behind a clever assistant. The decision chain needs to be exposed: what the agent understood, what it excluded, why it selected a merchant, which payment method it used, and which conditions remain unconfirmed. The more entry points span phones, glasses, PCs, and cars, the more important a device-independent order state, authorisation record, and reversal path become.",
    visual: visuals.commerce,
    sources: [source("Qualcomm: Agentic commerce with Mastercard", urls.qualcommCommerce, "official"), source("Qualcomm: Snapdragon Summit agentic PCs", urls.qualcommAgentic, "official"), source("Mastercard Agent Pay", "https://www.mastercard.com/news/press/2025/april/mastercard-agent-pay/", "developer surface")],
    dossier: {
      zh: {
        productName: "Qualcomm × Mastercard agentic commerce demonstration",
        productType: "这是 Qualcomm 在 Snapdragon Summit 2026 展示的 Agent 商业执行路径，不是消费者今天可以下载的独立支付 App。官方文章把它放在 agentic commerce 语境中，由 Agent 协助理解需求、发现商品或服务、支持决策并完成后续商业体验，Mastercard 是演示合作方。入口可以是手机、智能眼镜、PC、汽车或其他连接设备；真正的产品形态仍取决于银行、商户、钱包、操作系统和设备厂商的组合。",
        interactionFlow: "官方描述的流程从用户目标开始：Agent 先理解用户想完成什么，再判断是否需要打断用户、进行发现与比较，并在满足条件后安全地执行商业工作。用户可能在手机或眼镜上开始，Agent 把意图带到商品/服务发现、商户选择和支付环节；但官方没有公开完整 demo 的每一步确认、订单编辑、价格变化、退款、拒付、商户登录、支付凭证和人工接管界面。不能把“agentic commerce”写成已经普遍自动付款。",
        specsOrStack: "公开 stack 包括 Qualcomm 的个人 AI/agentic device 叙事、可承载 Agent 的手机/眼镜/PC/汽车入口、Mastercard 商业支付网络，以及商户和银行的服务连接。官方没有披露具体终端、操作系统、模型、支付令牌、身份验证、设备证明、商户 API、退款协议、欺诈检测、地区、币种、监管合规、SDK 或正式产品名；这些为 source not stated。Mastercard 合作可以证明支付网络参与演示，不能证明所有商户已接入。",
        useCases: "可确认的方向是 Agent 帮助用户从意图进入商品或服务发现，再推进商业动作。可能的任务包括比较商品、寻找符合条件的服务、按偏好筛选、在用户批准后完成购买或预约；但 Qualcomm 的文章没有给出可复现的具体商品、价格、账号或地区流程。跨设备特性意味着同一意图可能在眼镜发现、手机确认、PC 编辑或汽车场景中继续，但 handoff 细节仍是未知。",
        painPointsSolved: "它针对的是商业任务被搜索、筛选、比较、表单、登录和支付页面切碎的问题，也针对用户需要在不同设备上反复输入同一偏好的问题。Agent 可以承担中间步骤，让人只在重要决策点介入。它无法自动解决商户数据不完整、价格实时变化、偏好误读、欺诈、退货、订阅陷阱、家庭共享和支付责任；这些问题必须进入产品状态和服务协议，而不是留在模型提示中。",
        userVoice: "本期没有独立消费者实测或真实订单证据。Qualcomm 的文章是官方 demonstration signal，Mastercard 的 Agent Pay 材料是支付网络的 developer/industry surface。它们可以说明行业正在定义 agent 参与支付的接口，却不能证明成功率、消费者信任、争议处理或商户覆盖。",
        newTech: "技术信号是把 agent 从推荐层推进到商业执行层，并把设备形态从手机扩展到眼镜、PC 和汽车。真正的系统创新在于意图、授权、商户服务、支付令牌、身份和结果反馈必须跨设备保持一致。若没有可验证的授权和订单状态，所谓 agentic commerce 只是把购物搜索换成聊天；若这些边界成立，它会成为个人 Agent 最早接触真实金钱的场景之一。",
        availability: "Qualcomm 已在 2026 年 9 月 24 日公布与 Mastercard 的演示文章，但没有发布面向消费者的产品、下载链接、开放 API、地区、上线日期、支持商户或价格。它是 developer/industry demonstration，不是已普及的支付功能。",
        limitsOrUnknowns: "关键未知包括谁是最终付款人、Agent 是否能直接持有或调用令牌、何时必须二次确认、商户如何展示、退款/拒付由谁负责、价格变化如何触发重新批准、未成年人和共享设备怎么处理、跨设备如何防止会话劫持、模型偏好如何审计、汽车/眼镜中如何减少分心，以及 Mastercard/银行/商户的接入范围。",
        productVerdict: "Qualcomm × Mastercard 的意义在于把 Agent 的 HCI 边界推进到真实商业动作，但当前证据只支持“行业演示与 developer surface”。结论：方向值得关注，不能当作已上线支付产品；下一步应验证订单状态、用户批准、退款/争议、商户透明和跨设备接管，而不是只看“能不能自动买”。"
      },
      en: {
        productName: "Qualcomm and Mastercard agentic-commerce demonstration",
        productType: "This is Qualcomm's agentic-commerce path demonstrated at Snapdragon Summit 2026, not a standalone payment app that consumers can download today. Qualcomm frames the demonstration as an agent helping understand a need, discover products or services, support a decision, and perform the commercial work that follows, with Mastercard as the demonstration partner. The entry point could be a phone, smart glasses, PC, vehicle, or another connected device. The final product would depend on banks, merchants, wallets, operating systems, and device makers working together.",
        interactionFlow: "The public flow starts from an outcome. The agent interprets what the user wants, decides whether attention is warranted, helps with discovery and comparison, and performs commercial work when the conditions are satisfied. A user might begin on a phone or glasses while the agent carries intent into merchant selection and payment. Qualcomm has not published every confirmation, order-edit, price-change, refund, chargeback, merchant-login, payment-receipt, or human-takeover state in the demonstration. “Agentic commerce” must not be read as universal automatic payment.",
        specsOrStack: "The disclosed stack includes Qualcomm's personal-AI and agentic-device platform story, phone, glasses, PC, and vehicle entry points, Mastercard's payment network, and connected merchant and banking services. The announcement does not state a specific terminal, operating system, model, payment token, authentication method, device attestation, merchant API, refund protocol, fraud-control system, region, currency, regulatory package, SDK, or formal product name; these remain source not stated. Mastercard participation establishes a network partner in the demonstration, not universal merchant support.",
        useCases: "The confirmed direction is an agent that moves from a user's intention into product or service discovery and then into a commercial action. Possible tasks include comparing offers, finding a service that meets constraints, filtering by preferences, and completing a purchase or booking after approval. Qualcomm does not give a reproducible item, price, account, or region flow. The cross-device framing suggests that discovery could begin on glasses, confirmation happen on a phone, editing continue on a PC, or a task be resumed in a vehicle, but handoff detail is unknown.",
        painPointsSolved: "The system targets commerce fragmented across search, filters, comparison, forms, login, and checkout, as well as the need to re-enter preferences on every device. An agent could own the middle steps while a person intervenes at meaningful decisions. It does not automatically solve incomplete merchant data, live price changes, misunderstood preferences, fraud, returns, subscription traps, family sharing, or payment liability. Those issues must appear in product state and service agreements rather than remain hidden in a prompt.",
        userVoice: "There is no independent consumer order test or real purchase evidence in today's sources. Qualcomm's article is an official demonstration signal; Mastercard's Agent Pay material is a payment-network developer and industry surface. Together they show that the industry is defining an interface for agents in commerce, not that success rate, consumer trust, dispute handling, or merchant coverage has been proven.",
        newTech: "The technology signal is a move from recommendation into commercial execution and an expansion of the device surface from phones to glasses, PCs, and vehicles. The systems challenge is consistency across intent, authorisation, merchant service, payment token, identity, and result feedback. Without verifiable permission and order state, agentic commerce is only shopping search in a chat. With those boundaries, it becomes one of the first places a personal agent touches real money.",
        availability: "Qualcomm published the Mastercard demonstration article on September 24, 2026. There is no consumer product, download, open API, region, launch date, supported-merchant list, or price. This is a developer and industry demonstration, not a generally available payment capability.",
        limitsOrUnknowns: "Open questions include who is the final payer, whether an agent can hold or call a token, when a second confirmation is required, how the merchant is displayed, who owns refunds and chargebacks, how price changes trigger renewed approval, minors and shared devices, cross-device session hijacking, preference audit, distraction in cars and glasses, and Mastercard, bank, and merchant coverage.",
        productVerdict: "The Qualcomm-Mastercard signal pushes an agent's HCI boundary into real commercial action, but today's evidence supports only an industry demonstration and developer surface. Verdict: worth watching, not a launched payment product. The next proof should be order state, approval, refund and dispute handling, merchant transparency, and cross-device takeover—not merely whether the agent can buy something."
      }
    }
  })
];

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`Missing previous issue ${previousDate}`);
const issue = JSON.parse(JSON.stringify(previous));
issue.date = date;
issue.zhTitle = "个人 Agent 开始寻找自己的身体：口袋、眼镜与支付链";
issue.enTitle = "Personal agents are looking for bodies: pockets, glasses, and payment rails";
issue.zhSummary = "Meta 把 Muse 延伸到口袋设备与 AI 眼镜，Meta DAT 1.0 把眼镜变成移动 App 前端，Awear 试图让 Agent 跨品牌迁移，Qualcomm 与 Mastercard 则把 Agent 推到商业执行。今天的产品问题集中在状态可见、权限可撤销、记忆可迁移和付款可恢复。";
issue.enSummary = "Meta is extending Muse into a pocket device and AI glasses, Meta DAT 1.0 turns glasses into a mobile-app front end, Awear proposes cross-brand agent portability, and Qualcomm with Mastercard moves agents toward commerce execution. Today's product test is state visibility, revocable permission, portable memory, and recoverable payment.";
issue.tags = [...new Set(["HCI", "personal AI agents", "AI hardware", "smart glasses", "agentic commerce", "developer surface", ...(issue.tags || [])])];
issue.sourceTypes = ["official", "developer docs", "reviews", "community", "wild", "research", "patent", "china", "global"];
issue.topics = [...freshTopics, ...issue.topics];
issue.coverStory = {
  topicId: freshTopics[0].id,
  zhTitle: "个人 Agent 需要一个身体，但身体也带来新的信任成本",
  enTitle: "A personal agent needs a body—and the body adds new trust costs",
  zhSummary: ["Muse Charm 把 Agent 放进口袋，Meta DAT 1.0 把眼镜变成服务前端，Awear 试图让 Agent 跨品牌移动。", "产品竞争正在从模型回答转向入口、记忆、权限、支付和跨设备 handoff。", "今天最需要验证的不是 Agent 会不会说话，而是用户能否看见它在听什么、记住什么、准备做什么，并在出错后接管。"],
  enSummary: ["Muse Charm puts an agent in a pocket, Meta DAT 1.0 makes glasses a service front end, and Awear proposes moving the agent across brands.", "The product battle is shifting from model answers toward entry points, memory, permission, payment, and cross-device handoff.", "The urgent test is not whether an agent can speak, but whether people can see what it hears, remembers, and plans—and take over after failure."],
  imagePath: visuals.museCharm.path,
  imageWidth: visuals.museCharm.width,
  imageHeight: visuals.museCharm.height,
  imageSourceUrl: visuals.museCharm.sourceUrl,
  primarySourceUrl: visuals.museCharm.sourceUrl,
  evidenceStrength: "Meta official Connect recap · product preview",
  whyCover: "The strongest new product signal changes the physical entry point of a personal agent while exposing the trust cost of screen-light, always-carried interaction."
};
issue.watchlistZh = Array.from(new Set([
  "Muse Charm：最终形态、价格、麦克风/录音灯、手机依赖、续航、12 月发货与无屏 Agent 的取消/忘记路径。",
  "Meta Wearables DAT 1.0：9 月 30 日 rollout、兼容眼镜、iOS/Android parity、权限粒度、发现入口与真实开发者迁移成本。",
  "Awear：合作设备、可迁移记忆、Agent 身份归属、SDK/API、跨品牌 handoff 与首个可购买硬件。",
  "Qualcomm × Mastercard：订单状态、付款确认、退款/拒付、商户透明、跨设备接管和真实支付可用性。",
  ...issue.watchlistZh
])).slice(0, 20);
issue.watchlistEn = Array.from(new Set([
  "Muse Charm: final form, price, microphones and recording light, phone dependency, battery, December shipping, and screen-light cancel/forget flows.",
  "Meta Wearables DAT 1.0: September 30 rollout, compatible glasses, iOS/Android parity, permission granularity, discovery, and real migration cost.",
  "Awear: partner devices, portable memory, agent ownership, SDK/API, cross-brand handoff, and the first shippable hardware.",
  "Qualcomm and Mastercard: order state, payment approval, refunds and chargebacks, merchant transparency, cross-device takeover, and real availability.",
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
await fs.rm(deckDir, { recursive: true, force: true });
await fs.cp(previousDeck, deckDir, { recursive: true, filter: (sourcePath) => !sourcePath.includes(`${path.sep}dist${path.sep}`) && !sourcePath.endsWith(`${path.sep}dist`) });
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });

const labels = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "用户原声", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "User voice", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const dossierText = (locale, item) => fields.map((field, i) => `**${labels[locale][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="./public/${visuals.museCharm.path}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(freshTopics[0])}`,
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
