import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-14";
const previousDate = "2026-09-12";
const dataPath = path.join(root, "data", "issues.json");
const previousDeck = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);

const source = (label, url, type) => ({ label, url, type });
const visual = (file, kind, altZh, altEn, captionZh, captionEn, sourceUrl, width = 1600, height = 900) => ({
  path: `assets/${file}`, width, height, kind, altZh, altEn, captionZh, captionEn, sourceUrl
});
const topic = (input) => ({ ...input, dossierKind: input.dossierKind ?? "product" });
const block = (zh, en) => ({ zh, en });

const xpengUrl = "https://www.xpeng.com/news/01a080371029a057bc8e8a02a2c6012b";
const skildUrl = "https://blogs.nvidia.com/blog/skild-ai-s1-physical-ai/";
const skildProductUrl = "https://www.skild.ai/";
const somaUrl = "https://somarobotics.ai/";
const armUrl = "https://newsroom.arm.com/news/arm-total-design-and-robotics-capability-framework-for-physical-ai";
const armFrameworkUrl = "https://www.arm.com/company/news/2026/09/arm-total-design-for-physical-ai";
const ikairosUrl = "https://www.prnewswire.com/news-releases/lingverse-debuts-ensouled-ai-operating-system-lifeos-in-first-public-look-at-modular-ai-wearable-ikairos-302865514.html";
const ikairosProductUrl = "https://www.ikairos.world/";
const ultraUrl = "https://techcrunch.com/2026/09/03/qualcomm-backs-ultrahuman-in-70m-round-on-bet-to-turn-smart-rings-into-computers/";
const ultraProductUrl = "https://www.ultrahuman.com/ring/";

const xpengVisual = visual(
  "xpeng-iron-production-line-2026-09.png", "source-backed-product-image",
  "XPENG IRON 人形机器人生产线官方视觉", "XPENG IRON humanoid robot production-line visual",
  "XPENG 官方图：IRON 从人形机器人生产线走下产线；生产线与交付计划仍按官方声明标注。",
  "XPENG official visual: IRON walks off a humanoid-robot production line; production and delivery claims follow the company statement.", xpengUrl, 1600, 900
);
const skildVisual = visual(
  "skild-ai-s1-physical-ai-2026-09.jpg", "source-backed-product-image",
  "Skild S1 机器人基础模型官方/媒体视觉", "Skild S1 robotic foundation model source visual",
  "NVIDIA 官方报道视觉：S1 用一段视频示范理解长时任务；成功率和训练样本等数字保持来源边界。",
  "NVIDIA source visual: S1 uses a video demonstration to understand long-horizon tasks; success and training-example figures remain source-bounded.", skildUrl, 1600, 900
);
const somaVisual = visual(
  "soma-one-early-access-2026-09.jpg", "source-backed-product-image",
  "SOMA Robotics soma one 官方渲染图", "SOMA Robotics soma one official rendering",
  "SOMA 官方早期访问页面：双臂、升降柱、移动底盘与 soda OS 组成研究平台；价格待 9 月 22 日公布。",
  "SOMA early-access page: dual arms, lift column, mobile base, and soda OS form a research platform; pricing is due September 22.", somaUrl, 1600, 900
);
const armVisual = visual(
  "arm-robotics-capability-framework-2026-09.jpg", "source-backed-product-image",
  "Arm Robotics Capability Framework 官方信息图", "Arm Robotics Capability Framework official infographic",
  "Arm 官方信息图：把机器人能力从反应式推到自我改进级别；这是行业框架，不是机器人 SKU。",
  "Arm official infographic: a capability vocabulary from reactive to self-improving systems; this is an industry framework, not a robot SKU.", armUrl, 1600, 900
);
const ikairosVisual = visual(
  "ikairos-lifeos-2026-09.jpg", "source-backed-product-image",
  "iKairos LifeOS 模块化 AI 可穿戴来源图", "iKairos LifeOS modular AI wearable source image",
  "PR Newswire 来源图：iKairos 以 Neural Core 进入桌面机器人或项链形态；多视角记忆能力仍属于厂商描述。",
  "PR Newswire source image: iKairos uses a Neural Core in a desktop-robot or necklace body; multi-perspective memory remains a company claim.", ikairosUrl, 1600, 900
);
const ultraVisual = visual(
  "ultrahuman-ring-air-2026-09.png", "source-backed-product-image",
  "Ultrahuman Ring Air 官方产品视觉", "Ultrahuman Ring Air official product visual",
  "Ultrahuman 官方产品视觉；AI、游戏控制器和第三方开发能力来自 TechCrunch 对创始人的报道，软件更新尚待验证。",
  "Ultrahuman official product visual; AI, game-controller, and third-party development claims come from TechCrunch reporting and await software verification.", ultraProductUrl, 1600, 900
);

const newTopics = [
  topic({
    id: "xpeng-iron-production-line-physical-ai", section: "china", evidenceLabel: "confirmed product", sourceDate: "2026-09-08",
    evidenceStrength: "XPENG official production-line announcement with product specifications and 2027 delivery boundary",
    zhHeadline: "XPENG IRON 走下生产线：Physical AI 开始接受制造业的验收",
    enHeadline: "XPENG IRON walks off the line as Physical AI meets a manufacturing acceptance test",
    zhFact: "XPENG 官方宣布 IRON 人形机器人生产线投入运行，核心工艺自动化超过 80%，IRON 具备 76 个全身自由度、每只手 21 个自由度，并由 3 颗 Turing AI 芯片提供最高 2,250 TOPS 有效算力。量产计划和商业场景从自有门店、园区开始，官方市场上市与交付计划为 2027 年。",
    enFact: "XPENG says its IRON humanoid-robot production line is operating, with more than 80% automation in core processes. The company lists 76 degrees of freedom across the body, 21 in each hand, and three Turing AI chips delivering up to 2,250 TOPS of effective compute. Initial commercial scenarios are planned for XPENG stores and campuses, with official market launch and delivery planned for 2027.",
    zhValue: "这条消息把机器人产品的验收对象从‘能不能走’改成了‘能不能稳定制造、维护和复制’。人形外观、灵活手部和端侧 Physical AI 仍然重要，但没有生产线、质量系统和可交付节奏，demo 很难进入真实工作。IRON 现在提供的是从自研芯片、基础模型到产线的纵向闭环，用户可见的价值仍需在门店、园区和复杂任务中观察。",
    enValue: "The acceptance target shifts from whether a robot can walk to whether it can be manufactured, serviced, and replicated consistently. Human-like form, dexterous hands, and on-robot Physical AI still matter, but a demo rarely enters real work without a quality system and a repeatable delivery cadence. IRON now presents a vertical loop from chips and a physical-world model to a production line; user value still needs to be observed in stores, campuses, and complex tasks.",
    zhHciLens: ["入口：门店 / 园区任务", "执行：端侧 Physical AI", "制造：>80% 核心工艺自动化", "接管：交付与安全仍待验证"],
    enHciLens: ["Entry: store / campus tasks", "Execution: on-robot Physical AI", "Manufacturing: >80% core-process automation", "Takeover: delivery and safety unverified"],
    zhImplication: "机器人 UX 需要把模型泛化、动作失败、人工接管、维护状态和责任边界连成一条可追踪记录；产线自动化百分比不能替代现场成功率。",
    enImplication: "Robot UX must connect generalisation, action failure, human takeover, maintenance state, and responsibility into one traceable record; a production-line automation percentage cannot substitute for field success.",
    visual: xpengVisual,
    sources: [source("XPENG IRON official announcement", xpengUrl, "official"), source("XPENG official website", "https://www.xpeng.com/", "official"), source("XPENG investor relations", "https://ir.xiaopeng.com/", "global")],
    dossier: { zh: {
      productName: "XPENG IRON Advanced General-Purpose Humanoid Robot",
      productType: "IRON 是 XPENG 正在推进的通用人形机器人平台，官方 2026 年 9 月声明同时披露了生产线、机器人形态、端侧算力和商业化边界。它不是已经面向普通消费者交付的家用机器人，而是从研发原型走向产线制造、再进入自有门店和园区试点的 Physical AI 产品。官方把它放进汽车、机器人和全球化三条增长曲线，但真实客户、合同价格、服务模式与部署数量 source not stated。",
      interactionFlow: "官方描述的可用流程是：机器人完成产线制造后进入 XPENG 自有门店或园区的商业场景，依靠机身上的 Physical AI foundation model 执行任务，并在真实环境中持续改进。用户侧还没有公开的任务编排界面、语音入口、远程接管面板、权限确认、异常提示或维修流程。产品验收至少要经过任务下发、环境感知、动作执行、失败恢复、人工接管、结果确认和日志留存；这些步骤不能由‘自主走下产线’一项证据替代。",
      specsOrStack: "XPENG 官方公开 76 个全身自由度、每只手 21 个自由度、3 颗 Turing AI chips、最高 2,250 TOPS effective computing power、fully enclosed flexible lattice structure，以及直接部署在机器人上的 Physical AI foundation model。生产线核心工艺自动化超过 80%，并采用汽车级质量系统。具体芯片型号、内存、传感器、网络、OS/API、续航、噪声、负载、IP 等级、维修周期和端云分工 source not stated。",
      useCases: "已披露的首批商业化方向是 XPENG 自有门店和园区，官方没有给出具体岗位、任务清单或客户验收数据。基于通用平台定位，可观察的任务类型包括接待、搬运、巡检、物料处理和环境中的多步骤操作，但这些不能写成已交付能力。生产线本身也是一个可验证场景：它证明企业在尝试把汽车级制造方法迁移到人形机器人，而不是证明 IRON 已能稳定替代工作人员。",
      painPointsSolved: "纵向整合芯片、物理世界模型、机器人结构和制造线，试图降低机器人从实验室原型到可复制产品之间的断裂。76 自由度和 21 自由度手部对应更细的操作空间，端侧推理有机会减少网络往返并提高数据留存控制。它仍没有解决复杂场景的长尾失败、人员安全、任务责任、维护成本、数据回传同意、部署后的模型漂移和用户是否愿意接受人形机器人的问题。",
      newTech: "产品化创新不只在 Turing AI 芯片的算力数字，而在把 Physical AI foundation model 直接放进机器人，并用汽车级质量系统、自动化产线和统一技术基础连接研发与制造。官方还把 self-reinforcement in the real world 作为持续改进方向，但没有公开训练闭环、数据标注、回滚机制或独立评测。这里的技术进展是从 demo 走向制造系统的尝试，不等于已完成规模化部署。",
      availability: "生产线已经由 XPENG 宣布启用，初始商业场景计划落在 XPENG 自有门店与园区，官方市场上市和中国及海外交付计划为 2027 年。普通用户购买入口、价格、地区、具体 SKU、首批数量、售后服务、开发者 API 和合作伙伴接入方式 source not stated。当前最准确的状态是 confirmed product with future delivery boundary。",
      limitsOrUnknowns: "仍需验证的关键事实包括：产线自动化比例如何计算、每台机器人出厂一致性、实际任务成功率、碰撞与急停、手部负载、室内外导航、远程接管延迟、模型更新和回滚、门店/园区员工培训、故障维修、旁观者隐私，以及 2027 年交付是否按计划进行。官方融资和估值信息不能替代机器人产品的实测证据。",
      productVerdict: "IRON 的新意在于把人形机器人当作制造业产品来验收，而不是只当作会走路的展示品。产品判断：生产系统和规格披露已成立，真实工作流和交付可靠性仍未成立；下一关应是公开任务级成功率、接管机制和维护成本。"
    }, en: {
      productName: "XPENG IRON, an advanced general-purpose humanoid robot",
      productType: "IRON is XPENG's general-purpose humanoid-robot platform, and the September 2026 statement discloses its production line, form factor, on-robot compute, and commercial boundary. It is not a consumer home robot already delivered at scale. It is a Physical AI product moving from R&D prototype to line manufacturing and then to pilots in XPENG stores and campuses. XPENG places it inside automotive, robotics, and globalisation growth curves, but customer names, contract prices, service model, and deployed-unit count are source not stated.",
      interactionFlow: "The disclosed flow is that a robot leaves the production line, enters a commercial setting such as an XPENG store or campus, runs tasks with a Physical AI foundation model on the robot, and improves through real-world operation. There is no public task-authoring UI, voice entry, remote-takeover console, permission confirmation, exception language, or maintenance workflow. A credible acceptance path would include task assignment, scene perception, action execution, failure recovery, human takeover, result confirmation, and logs. None of those steps can be inferred from a robot autonomously walking off a line.",
      specsOrStack: "XPENG discloses 76 degrees of freedom across the body, 21 in each hand, three Turing AI chips, up to 2,250 TOPS of effective computing power, a fully enclosed flexible lattice structure, and a Physical AI foundation model deployed directly on the robot. The production line automates more than 80% of core processes and uses automotive-grade quality systems. Exact chip models, memory, sensors, network, OS/API, battery, noise, payload, ingress rating, service interval, and edge-cloud split are source not stated.",
      useCases: "The first disclosed commercial settings are XPENG stores and campuses; the company does not provide a task list, job description, or customer acceptance data. A general-purpose platform could be evaluated for reception, material handling, inspection, transport, and multi-step manipulation, but these are evaluation directions rather than shipped capabilities. The production line itself is also a product signal: XPENG is trying to transfer automotive manufacturing discipline to humanoid robots. It does not prove that IRON can replace workers reliably.",
      painPointsSolved: "Vertical integration of chips, a physical-world model, robot structure, and manufacturing attempts to close the gap between a laboratory prototype and a repeatable product. Seventy-six body degrees of freedom and 21 per hand expand the action space, while on-robot inference could reduce network round trips and improve data-control options. The system does not yet solve long-tail scene failures, worker safety, task liability, maintenance cost, consent for data return, model drift after deployment, or whether people accept a humanoid coworker.",
      newTech: "The product advance is not only the Turing AI compute figure. It is the attempt to put a Physical AI foundation model on the robot and connect it to automotive-grade quality systems, an automated line, and one technical foundation from R&D through manufacturing. XPENG also describes self-reinforcement in the real world, but gives no training loop, data-labelling method, rollback process, or independent evaluation. The technology signal is a manufacturing-system transition, not proof of scaled deployment.",
      availability: "XPENG says the production line is commissioned, initial commercial scenarios will begin in its stores and campuses, and official market launch and delivery in China and overseas markets are planned for 2027. Consumer purchase, price, territory, exact SKU, first-batch volume, service, developer APIs, and partner access are source not stated. The accurate status is a confirmed product with a future-delivery boundary.",
      limitsOrUnknowns: "Material unknowns include how the automation percentage is calculated, unit-to-unit consistency, task-level success, collision and emergency-stop behaviour, hand payload, indoor/outdoor navigation, remote-takeover latency, model update and rollback, worker training, repair, bystander privacy, and whether 2027 delivery stays on schedule. Financing and valuation do not substitute for task-level product evidence.",
      productVerdict: "IRON matters because it treats a humanoid robot as a manufacturing product to be accepted, not merely as a walking demonstration. Verdict: the production system and published specifications are real; dependable work and delivery are not yet proven. The next gate is public task-level success, takeover design, and maintenance cost."
    }}
  }),
  topic({
    id: "skild-s1-video-to-robot-task", section: "global", evidenceLabel: "confirmed product", sourceDate: "2026-09-10",
    evidenceStrength: "NVIDIA official product report plus Skild product link; company-reported performance is not an independent benchmark",
    zhHeadline: "Skild S1：一段视频示范，开始替代一次任务重训",
    enHeadline: "Skild S1 turns one video demonstration into a new robot task",
    zhFact: "NVIDIA 报道 Skild S1 机器人基础模型可以把一段任务视频作为 prompt，理解物体、意图和动作顺序，并在不更新权重、不做任务专用后训练的情况下执行陌生长时任务。官方举例包括最长 10 分钟的花盆、煎饼、手冲咖啡和套件装配，某次花盆测试从录示范到硬件执行约 11 分钟。",
    enFact: "NVIDIA reports that Skild's S1 robotic foundation model can take a task video as a prompt, interpret objects, intent, and sequence, and execute unfamiliar long-horizon tasks without updating weights or running task-specific post-training. Examples include plant potting, pancake making, pour-over coffee, and kit assembly for tasks lasting up to 10 minutes; one plant-potting test moved from recording to hardware execution in about 11 minutes.",
    zhValue: "S1 把机器人训练入口从工程师写程序或收集大量示范，推向操作员直接展示目标。这样做的价值在于换产线、换物体、换布局时可以快速重写任务，但‘单段视频’仍然要经过安全约束、动作验证和失败接管。S1 的产品意义是把示范变成可执行上下文，而不是让视频自动等于可靠动作。",
    enValue: "S1 moves the robot-teaching entry point from engineers writing routines or collecting a large demonstration set toward an operator showing the desired task. That could make it faster to adapt when a line, object, or layout changes, but a single video still needs safety constraints, action validation, and recovery. The product meaning is turning a demonstration into executable context; a video is not automatically a reliable action policy.",
    zhHciLens: ["输入：一段任务视频", "理解：物体 + 意图 + 顺序", "输出：长时动作组合", "接管：错误恢复仍需现场验证"],
    enHciLens: ["Input: one task video", "Interpretation: objects + intent + sequence", "Output: long-horizon action composition", "Takeover: recovery needs field validation"],
    zhImplication: "示范式机器人必须让操作者看见模型提取了什么、准备执行什么、在哪一步不确定，并允许在动作前修改与在动作中暂停。",
    enImplication: "A demonstration-based robot must show what the model extracted, what it is about to do, and where it is uncertain, with editing before motion and pause during motion.",
    visual: skildVisual,
    sources: [source("NVIDIA report on Skild S1", skildUrl, "official"), source("Skild AI", skildProductUrl, "official"), source("NVIDIA Isaac Lab", "https://developer.nvidia.com/isaac/lab", "developer surface")],
    dossier: { zh: {
      productName: "Skild AI S1 robotic foundation model",
      productType: "S1 是 Skild AI 面向机器人任务泛化的基础模型，NVIDIA 将它描述为使用视频作为 prompt 的 robotic foundation model。它面向制造、物流、检查、安防、食品准备等动态环境，并与 NVIDIA 的 Isaac Lab、Cosmos、合成数据、仿真、训练基础设施和真实部署协作。它不是用户可以买回家的机器人型号，硬件 embodiment、软件授权和部署合同均 source not stated。",
      interactionFlow: "操作员先录制一段期望任务的视频，把它交给 S1；模型解析示范里的物体、意图与步骤，把这些信息映射到当前机器人前方的动作序列，然后在环境变化或出现错误时尝试调整与恢复。NVIDIA 报道最长约 10 分钟的多步骤任务，并给出从录制到上机执行约 11 分钟的花盆测试。真实生产 UX 仍需要示范预览、危险动作标记、仿真验证、低速试运行、暂停/接管和事后回放，这些控制界面没有完整公开。",
      specsOrStack: "公开栈包括 S1 robotic foundation model、视频输入、in-context learning、不更新权重的任务适配、NVIDIA AI infrastructure、Isaac Lab 仿真、Cosmos world models 与 Cosmos Curator 数据处理，以及在真实机器人部署上的合作。报道还提到示范可以相当于约 380 个 hands-on training examples，测试中每一步约 66% 成功率对比 9% 的类似系统；这些是公司/媒体转述的测试数字，不是统一独立基准。",
      useCases: "已披露示例有 plant potting、pancake making、pour-over coffee brewing、kit assembly，以及 Foxconn 双臂机械臂进行 busbar、limit block 和 16 颗螺丝装配。它的核心用户是需要频繁换产品、工位或布局的工厂和实验室。任务能否迁移到不同夹具、相机、机械臂、速度、材料和安全标准，需要按 embodiment 逐项验证；公开材料没有给出通用兼容清单。",
      painPointsSolved: "S1 针对传统工业机器人每换一个产品或流程就要重新编程、收集数据、训练和验证的成本。视频示范提供更直接的任务输入，in-context learning 让新任务可以在不重新更新权重的情况下尝试，适合长时且步骤多的工作。它没有消除示范质量、视角差异、接触力、遮挡、异常物体、失败代价、工厂网络、权限和人机安全问题；快速适配不等于安全投产。",
      newTech: "真正的新技术是把视频示范作为临时任务上下文，让一个共享的 robot brain 在不同任务和 embodiment 间组合技能，而不是为每个 SKU 单独训练。NVIDIA 还把合成数据、仿真、视频描述、遥操作和真实部署数据接到一条开发链上。公开材料没有提供模型参数、延迟、控制频率、传感器要求、失败分布、数据留存或客户独立复现，因此应把它看成产品化基础模型信号。",
      availability: "NVIDIA 已公开产品报道和 Skild 产品入口，Skild 也被描述为已有商业部署伙伴；但 S1 的购买方式、API、支持机器人、价格、地区、部署周期、云端依赖和安全认证 source not stated。它更像面向企业和机器人合作伙伴的部署能力，不是普通开发者可直接下载的通用消费软件。",
      limitsOrUnknowns: "需要补证的视频包括不同视角示范、错误恢复、连续运行、动作前审批、双臂协调、接触力控制和紧急停止。还需知道 66% 成功率的分母、任务拆分方式、测试硬件、置信度定义和失败是否由人工修正。对于生产用户，最关键的未知是一次演示能否跨班次、跨设备和跨工位复用，以及发生损坏时责任如何划分。",
      productVerdict: "S1 让机器人学习入口更像‘现场示范’而不是‘工程师重训’，这是有产品价值的开发者/运营者体验。产品判断：适配速度的方向已被具体案例支撑，可靠性、可审计性和跨硬件泛化仍待独立验证；下一关是让人看得懂模型从视频到动作的中间状态。"
    }, en: {
      productName: "Skild AI S1 robotic foundation model",
      productType: "S1 is Skild AI's foundation model for robot-task generalisation. NVIDIA describes it as a robotic foundation model that uses video as a prompt. It targets dynamic environments such as manufacturing, logistics, inspection, security, and food preparation, with NVIDIA Isaac Lab, Cosmos, synthetic data, simulation, training infrastructure, and real deployments around it. It is not a robot model that a household user can buy; hardware embodiments, software licensing, and deployment contracts are source not stated.",
      interactionFlow: "An operator records a video of the desired task and supplies it to S1. The model interprets the demonstrated objects, intent, and sequence, maps them to an action sequence for the robot in front of it, and attempts to adapt or recover when the scene changes or an error appears. NVIDIA reports multi-step tasks lasting up to about 10 minutes and a plant-potting test that moved from recording to hardware execution in about 11 minutes. A production UX still needs demonstration preview, dangerous-action marking, simulation, low-speed trial, pause/takeover, and replay; those controls are not fully public.",
      specsOrStack: "The public stack includes the S1 robotic foundation model, video input, in-context learning, task adaptation without updating weights, NVIDIA AI infrastructure, Isaac Lab simulation, Cosmos world models, Cosmos Curator data processing, and deployment on real robots. The report also says one demonstration can be comparable to roughly 380 hands-on training examples and that tests achieved about 66% per-step success versus 9% for a similar system. These figures are company or media-reported test results, not a common independent benchmark.",
      useCases: "Disclosed examples include plant potting, pancake making, pour-over coffee brewing, kit assembly, and a Foxconn dual-arm workflow installing a busbar and limit block and fastening 16 screws. The target user is a factory or lab that changes products, stations, or layouts often. Transfer across grippers, cameras, arms, speeds, materials, and safety standards must be validated for each embodiment; the public material does not provide a universal compatibility list.",
      painPointsSolved: "S1 targets the cost of reprogramming, collecting data, training, and validating every time an industrial product or process changes. A video demonstration is a more direct task input, and in-context learning lets the system attempt a new task without a task-specific weight update. That suits long, multi-step work, but it does not remove demonstration quality, viewpoint mismatch, contact force, occlusion, unexpected objects, failure cost, factory networking, permissions, or worker-safety problems. Fast adaptation is not the same as safe production.",
      newTech: "The productised technology is treating a video demonstration as temporary task context, allowing a shared robot brain to compose skills across tasks and embodiments instead of training every SKU separately. NVIDIA also connects synthetic data, simulation, video description, teleoperation, and permitted deployment data into one development chain. The material does not disclose model size, latency, control rate, sensor requirements, failure distribution, retention, or customer reproduction, so this remains a concrete foundation-model product signal.",
      availability: "NVIDIA has published a product report and a link to Skild, and the companies describe commercial deployment partnerships. S1 purchase, API, supported robots, price, territory, deployment time, cloud dependence, and safety certification are source not stated. It is better read as an enterprise and robotics-partner capability than as general software a consumer developer can download.",
      limitsOrUnknowns: "Follow-up evidence should show different demonstration viewpoints, error recovery, continuous operation, pre-action approval, bimanual coordination, contact control, and emergency stop. The 66% number needs its denominator, task decomposition, test hardware, confidence definition, and treatment of human correction. For a production customer, the central unknown is whether one demonstration transfers across shifts, devices, and stations, and who owns liability when an action damages a part.",
      productVerdict: "S1 makes the robot-teaching entry point look more like an operator demonstration than an engineer's retraining job. Verdict: the faster-adaptation direction has concrete examples; reliability, auditability, and cross-hardware generalisation need independent validation. The next gate is making the path from video to action legible to the human operator."
    }}
  }),
  topic({
    id: "soma-robotics-soda-os-research-platform", section: "wild", evidenceLabel: "startup signal", sourceDate: "2026-09-14",
    evidenceStrength: "SOMA official early-access page; launch, price, and full specifications are future-dated",
    zhHeadline: "SOMA Robotics 把‘采集→训练→部署’做成一台研究机器人",
    enHeadline: "SOMA Robotics packages collect, train, and deploy into one research robot",
    zhFact: "SOMA 早期访问页面提供 soma one 移动双臂机器人与 soma desktop 桌面版本，均含双六轴机械臂、夹爪和深度相机，运行 soda OS；VR 遥操作可录制 HDF5 轨迹和 MP4 相机视频，API 支持关节位置、阻抗与力矩控制，双臂控制与状态流为 500 Hz。",
    enFact: "SOMA's early-access page presents soma one, a mobile dual-arm robot, and soma desktop, a tabletop version. Both include two six-axis arms, grippers, and depth cameras, and run soda OS. VR teleoperation records HDF5 trajectories and MP4 camera video; the API supports joint position, joint impedance, and torque control, with 500 Hz control and state streaming on both arms.",
    zhValue: "它把研究机器人的核心摩擦从‘买到一套硬件’转成‘当天获得可复现实验基线’：unbox、teleop、collect、train、deploy 在同一个产品叙事里。对于 HCI 和具身 AI 团队，这比只卖一个机械臂更接近完整工具链；但云端部署、DAgger 微调、硬件供货和实验可重复性仍要以真实设备验证。",
    enValue: "It reframes the research-robot friction from buying hardware to reaching a reproducible experimental baseline in one day. Unbox, teleop, collect, train, and deploy are presented as one product story. For embodied-AI and HCI teams, that is closer to a complete toolchain than a bare arm; cloud deployment, DAgger fine-tuning, supply, and reproducibility still require hardware validation.",
    zhHciLens: ["入口：VR 遥操作", "数据：HDF5 + MP4", "训练：cloud / DAgger", "部署：soda OS + 500 Hz"],
    enHciLens: ["Entry: VR teleoperation", "Data: HDF5 + MP4", "Training: cloud / DAgger", "Deployment: soda OS + 500 Hz"],
    zhImplication: "研究硬件的关键体验是从第一次上电到可复现实验的时间；系统应把轨迹、相机、模型版本、控制频率和失败记录自动绑定。",
    enImplication: "The key research-hardware experience is time from power-on to a reproducible experiment; trajectories, camera data, model version, control rate, and failures should bind automatically.",
    visual: somaVisual,
    sources: [source("SOMA Robotics early access", somaUrl, "official"), source("SOMA Robotics demos", "https://somarobotics.ai/#demos", "official"), source("Penn GRASP", "https://www.grasp.upenn.edu/", "research")],
    dossier: { zh: {
      productName: "SOMA Robotics soma one / soma desktop + soda OS",
      productType: "SOMA 是面向具身 AI 研究的双臂机器人平台，提供移动版 soma one 和桌面版 soma desktop，并把自己实验室使用的 teleoperation、数据记录和部署软件打包为 soda OS。它的目标用户是研究实验室、机器人团队和需要快速采集示范数据的开发者，不是普通家庭产品。官方页面明确写作 early access，定价和完整规格计划在 2026 年 9 月 22 日发布。",
      interactionFlow: "页面把流程写成 unbox、teleop、collect、train、deploy：研究者先在 VR 中遥操作双臂完成任务，再把轨迹记录为 HDF5、把相机记录为 MP4，随后通过 soda OS API 或云服务训练/微调策略，最后在同一平台上部署并重复任务。它还把 DAgger 列为微调方法。公开页面没有展示用户如何标注失败、回退模型、分配权限、切换仿真与真实硬件、校准深度相机或在危险动作前暂停，因此完整实验闭环仍需要现场确认。",
      specsOrStack: "官方公开双六轴机械臂、夹爪、深度相机；soma one 另有全向移动底盘和升降柱，机械臂组件可以拆下做桌面实验。soda OS 支持 VR teleoperation、HDF5 trajectories、MP4 camera video、joint position、joint impedance、torque control、500 Hz control and state streaming。云端计算服务、DAgger 训练支持和 ±0.1 mm rated repeatability 在官方页面出现；价格、负载、工作空间、网络、OS 版本、API 文档、相机型号和安全认证 source not stated。",
      useCases: "适合双臂操作示范、插接、搬运、桌面装配、策略数据采集、跨实验复现和从 teleop 到 policy rollout 的教学。soma desktop 面向实验台，soma one 面向需要移动和升降的场景；官方演示用 VR 遥操作一只手固定电源排插、另一只手插入插头。页面没有声称这些任务可直接泛化到任意物体，也没有给出跨实验室的公开成功率。",
      painPointsSolved: "它减少研究者把机械臂、VR 控制器、相机、轨迹格式、录制工具和模型部署脚本拼接起来的工作，让硬件与数据格式在同一产品内形成连续链路。500 Hz 状态流有助于控制和诊断，HDF5/MP4 让轨迹与视觉证据可以一起保存。它没有消除硬件校准、夹爪更换、云端依赖、数据清洗、失败标注、多人权限、设备供货和实验结果不可重复的问题。",
      newTech: "SOMA 的技术新意偏向系统集成：同一套 soda OS 同时服务移动双臂和桌面双臂，允许遥操作、示范采集、训练和部署在一条体验链上。可拆卸机械臂让研究者在移动平台和桌面平台间切换，API 也把位置、阻抗和力矩控制放在相同抽象下。它不是一个已被独立验证的通用 robot brain；模型能力、云端接口和跨硬件迁移仍 source not stated。",
      availability: "官方页面开放免费、无约束的 early-access list，soma desktop 计划在 9 月 22 日 launch 时销售，soma one 首批计划在秋季、发布数周后发货；价格和完整规格同样计划在 9 月 22 日公布。销售地区、库存、交付量、质保、开发者账号、云服务价格和实际订购流程 source not stated。",
      limitsOrUnknowns: "需要观察真实开箱时间、VR 遥操作延迟、轨迹同步、相机时间戳、500 Hz 在长时间运行时的稳定性、急停、碰撞保护、策略部署是否必须联网、模型错误如何回滚，以及一套实验是否能在两台机器人上复现。±0.1 mm 是额定重复精度，不能直接推导任务精度或安全表现。",
      productVerdict: "SOMA 把机器人研究最常见的五段链路变成一个可理解的产品入口，这是 startup signal 中较具体的一类。产品判断：工具链叙事和接口边界已公开，价格、供货、现场稳定性与跨实验复现尚待 9 月 22 日和真机验证。"
    }, en: {
      productName: "SOMA Robotics soma one / soma desktop with soda OS",
      productType: "SOMA is a dual-arm robot platform for embodied-AI research, offering the mobile soma one and tabletop soma desktop while packaging teleoperation, data recording, and deployment software from its own lab as soda OS. Its users are research labs, robotics teams, and developers who need to collect demonstrations quickly, not household consumers. The official page explicitly calls the programme early access; pricing and full specifications are scheduled for September 22, 2026.",
      interactionFlow: "The page presents the flow as unbox, teleop, collect, train, and deploy. A researcher teleoperates both arms in VR, records trajectories as HDF5 and camera video as MP4, trains or fine-tunes policies through soda OS APIs or cloud services, and deploys them on the same platform for repeated trials. DAgger is listed as a fine-tuning method. The public page does not show failure labelling, model rollback, permission assignment, simulation-to-real switching, depth-camera calibration, or a pause before dangerous motion, so the complete experiment loop still needs hands-on confirmation.",
      specsOrStack: "The company discloses two six-axis arms, grippers, and depth cameras; soma one adds an omnidirectional mobile base and lift column, and its arm assembly detaches for bench experiments. soda OS supports VR teleoperation, HDF5 trajectories, MP4 camera video, joint-position, joint-impedance, and torque control, plus 500 Hz control and state streaming. Cloud computing services, DAgger support, and ±0.1 mm rated repeatability appear on the official page. Price, payload, workspace, network, OS version, API documentation, camera model, and safety certification are source not stated.",
      useCases: "The platform is suited to bimanual demonstrations, insertion, transport, tabletop assembly, policy-data collection, reproducible experiments, and teaching the path from teleoperation to policy rollout. soma desktop is for a bench, while soma one adds mobility and a lift. The demo uses VR teleoperation to hold a power strip with one hand while inserting a plug with the other. The page does not claim generalisation to arbitrary objects and gives no public cross-lab success rate.",
      painPointsSolved: "SOMA reduces the work of stitching together arms, VR controllers, cameras, trajectory formats, recording tools, and model-deployment scripts. Hardware and data format become one continuous product path; 500 Hz state streaming helps control and diagnosis, and HDF5/MP4 preserve trajectory and visual evidence together. It does not remove calibration, gripper changes, cloud dependence, data cleaning, failure labelling, multi-user permissions, supply constraints, or irreproducible experiments.",
      newTech: "The technical novelty is systems integration. One soda OS serves mobile and tabletop dual-arm configurations and links teleoperation, demonstration collection, training, and deployment. A detachable arm lets a team move between a mobile platform and a bench, while the API exposes position, impedance, and torque control under one abstraction. This is not independent evidence of a general robot brain; model capability, cloud interfaces, and cross-hardware transfer are source not stated.",
      availability: "The official page offers a free, non-binding early-access list. soma desktop is planned to go on sale at the September 22 launch, while the first soma one batch is planned to ship in the fall, weeks after launch. Territory, inventory, quantity, warranty, developer accounts, cloud pricing, and actual ordering flow are source not stated.",
      limitsOrUnknowns: "Follow-up should observe unboxing time, VR teleoperation latency, trajectory synchronisation, camera timestamps, long-run stability at 500 Hz, emergency stop, collision protection, whether deployment requires the cloud, policy rollback, and whether an experiment reproduces across two robots. ±0.1 mm is rated repeatability and cannot be converted into task accuracy or safety performance.",
      productVerdict: "SOMA turns the five-part robot-research chain into a legible product entry point, which is unusually concrete for an early startup signal. Verdict: the toolchain and interface boundaries are public; price, supply, field stability, and cross-lab reproducibility await the September 22 reveal and hardware testing."
    }}
  }),
  topic({
    id: "arm-robotics-capability-framework", section: "official", evidenceLabel: "developer surface", sourceDate: "2026-09-08",
    evidenceStrength: "Arm official announcement and framework visual; an industry vocabulary is not a compliance certification",
    zhHeadline: "Arm 把机器人能力写成共同语言：从反应式到自我改进",
    enHeadline: "Arm gives robotics a shared capability language, from reactive to self-improving",
    zhFact: "Arm 宣布 Arm Total Design for Physical AI，聚合 80 多家生态公司，并推出 Robotics Capability Framework。框架从 RL0 反应式系统走向 RL5 自我改进系统，把真实用例、行为、输出、延迟、算力位置、内存、电源约束、确定性和安全放进同一描述语言。",
    enFact: "Arm announced Arm Total Design for Physical AI with more than 80 ecosystem companies and introduced a Robotics Capability Framework. The framework ranges from RL0 reactive systems to RL5 self-improving systems, linking real-world use cases, behaviour, outputs, latency, compute placement, memory and power constraints, determinism, and safety in one vocabulary.",
    zhValue: "机器人产品经常把模型能力、硬件规格和现场任务混成一句‘更智能’，导致采购、开发与 HCI 验收无法对齐。Arm 的框架把能力等级和系统约束放到一张表里，价值在于让团队开始描述‘在哪个场景、以什么延迟、在什么算力位置、是否确定、如何安全’。它是开发者与行业协作面，不是某一台机器人已经达到 RL5 的证明。",
    enValue: "Robotics products often compress model capability, hardware specifications, and field tasks into a single claim that a system is smarter, making procurement, engineering, and HCI acceptance diverge. Arm's framework puts capability levels and system constraints into one table. Its value is giving teams a way to state the scenario, latency, compute location, determinism, and safety conditions. It is a developer and industry surface, not proof that one robot has reached RL5.",
    zhHciLens: ["入口：能力等级 / 真实用例", "约束：延迟 / 内存 / 电源", "行为：确定性 / 安全", "结果：可比较而非只看跑分"],
    enHciLens: ["Entry: capability level / real use case", "Constraints: latency / memory / power", "Behaviour: determinism / safety", "Outcome: comparability beyond benchmarks"],
    zhImplication: "机器人体验评估应把用户任务和系统级能力一一对应，避免用单一模型分数替代延迟、失败后果和可接管性。",
    enImplication: "Robot-experience evaluation should map user tasks to system capabilities instead of substituting a single model score for latency, failure consequence, and takeover.",
    visual: armVisual,
    sources: [source("Arm Physical AI announcement", armUrl, "official"), source("Arm Total Design for Physical AI", armFrameworkUrl, "developer surface"), source("Arm Robotics Capability Framework", "https://www.arm.com/company/news/2026/09/arm-total-design-for-physical-ai", "official")],
    dossier: { zh: {
      productName: "Arm Total Design for Physical AI + Robotics Capability Framework",
      productType: "这是 Arm 面向 Physical AI 生态的开发者与产业协作面：Total Design 把软件栈、AI 模型、传感器、计算硬件、虚拟平台和数字孪生放进同一个合作框架；Robotics Capability Framework 则提供描述机器人能力的共同语言。它不是机器人硬件产品，不提供一套可直接安装的 agent OS，也不是安全认证标准。",
      interactionFlow: "参与者可以先用真实用例描述机器人要完成的工作，再用框架表达行为、输出、延迟、算力位置、内存与电源约束、确定性和安全要求，随后与生态伙伴共同选择模型、芯片、传感器、软件栈、虚拟平台或数字孪生进行开发和验证。Arm 邀请行业贡献经验，说明框架仍在形成。公开页面没有给出完整注册流程、机器可读 schema、评分工具、认证流程或项目交付模板。",
      specsOrStack: "公开的系统栈包括 Arm Total Design for Physical AI、超过 80 家生态伙伴、AI models、software stacks、sensors、compute hardware、virtual platforms、digital twins、Arm Zena CSS 参考方案，以及从 RL0 reactive 到 RL5 self-improving 的能力分级。框架关注 latency、compute placement、memory、power、determinism、safety。版本号、API、工具下载、测量方法、强制性、合规地位和具体硬件 SKU source not stated。",
      useCases: "它适合机器人 OEM、芯片与传感器供应商、软件团队和系统集成商在原型前做能力对齐，也适合用数字孪生更早测试复杂汽车软件和自主系统。真实用例可能包含仓储、制造、自动驾驶、协作机器人和助理设备，但框架页面没有为某个终端产品提供验收结果。HCI 团队可以把 RL 等级作为讨论入口，却不能把它当作用户感知质量的替代指标。",
      painPointsSolved: "它试图解决 Physical AI 栈碎片化：模型团队、传感器团队、芯片团队和部署方对同一个机器人能力的描述不同，导致集成风险、重复验证和从概念到部署的时间变长。统一词汇有助于把系统约束提前暴露，也让供应商更清楚自己要满足的场景。它没有自动解决数据质量、责任分配、现场安全、模型漂移、跨供应商接口兼容或采购方如何审计声明。",
      newTech: "创新点是将‘能力等级’与‘系统资源和安全条件’同时写进 Physical AI 的协作语言，并把开发、仿真和部署视为一条链。Arm 把它类比为自动驾驶的 SAE Levels，但机器人框架的实际定义、治理和采用方式仍在演进。它是一层可比较性基础设施，不能把框架级别直接转成机器人的真实智能或可靠性。",
      availability: "Arm 官方页面已公开 Total Design 计划、框架说明、生态伙伴和贡献入口；页面邀请更广泛的 robotics ecosystem 参与。公开资料没有给出加入门槛、工具授权、商业价格、认证时间表、地区限制或某个开发者今天即可下载的 SDK。当前状态是 developer surface / industry framework。",
      limitsOrUnknowns: "关键未知包括 RL0–RL5 的可重复测量方法、是否有独立认证、不同厂商如何提交证据、失败和安全是否可量化、框架更新如何兼容旧项目、算力位置如何影响交互延迟，以及采购方如何防止营销把等级变成新跑分。没有这些治理细节，框架只能改善沟通，不能替代产品验收。",
      productVerdict: "Arm 这条线的价值不是又一个机器人 demo，而是试图给 Physical AI 建一套共同的验收词汇。产品判断：开发者/行业 surface 已公开，标准成熟度与实际采用未证实；下一步要看机器可读 schema、测量工具和真实项目引用。"
    }, en: {
      productName: "Arm Total Design for Physical AI and the Robotics Capability Framework",
      productType: "This is Arm's developer and industry collaboration surface for Physical AI. Total Design brings software stacks, AI models, sensors, compute hardware, virtual platforms, and digital twins into one ecosystem effort; the Robotics Capability Framework provides a shared vocabulary for describing robot capability. It is not a robot hardware product, an installable agent OS, or a safety certification standard.",
      interactionFlow: "Participants can describe the real-world work a robot must perform, express behaviour, outputs, latency, compute placement, memory and power constraints, determinism, and safety through the framework, then choose models, chips, sensors, software stacks, virtual platforms, or digital twins with ecosystem partners for development and validation. Arm invites industry contributions, so the framework is still forming. The public page does not provide a complete registration flow, machine-readable schema, scoring tool, certification path, or project-delivery template.",
      specsOrStack: "The disclosed stack includes Arm Total Design for Physical AI, more than 80 ecosystem partners, AI models, software stacks, sensors, compute hardware, virtual platforms, digital twins, the Arm Zena CSS reference solution, and capability levels from RL0 reactive to RL5 self-improving systems. The framework calls out latency, compute placement, memory, power, determinism, and safety. Version, API, tool download, measurement method, mandatory status, compliance position, and hardware SKUs are source not stated.",
      useCases: "It is useful for robot OEMs, chip and sensor suppliers, software teams, and integrators aligning capability before a prototype, and for earlier validation of complex automotive and autonomous-system software through digital twins. Potential use cases include warehousing, manufacturing, autonomous vehicles, collaborative robots, and assistive devices, but the framework page gives no acceptance result for a shipped product. HCI teams can use RL levels as a conversation starter, not as a substitute for perceived quality.",
      painPointsSolved: "The programme targets fragmentation across the Physical AI stack. Model, sensor, chip, and deployment teams often describe the same robot differently, increasing integration risk, repeated validation, and the time from concept to deployment. A shared vocabulary can surface system constraints earlier and clarify what a supplier must satisfy in a scenario. It does not automatically solve data quality, liability, field safety, model drift, cross-vendor interface compatibility, or buyer auditability.",
      newTech: "The innovation is putting capability levels and system resource and safety conditions into the same collaboration language, treating development, simulation, and deployment as one chain. Arm compares the effort with SAE Levels for driving automation, but robotics definitions, governance, and adoption are still evolving. This is comparability infrastructure; a framework level cannot be converted directly into real intelligence or reliability.",
      availability: "Arm has published the Total Design programme, framework explanation, ecosystem partners, and contribution entry point. The public material does not state participation requirements, tool licensing, commercial price, certification schedule, regional limits, or an SDK that a developer can download today. The current status is developer surface and industry framework.",
      limitsOrUnknowns: "Key unknowns include repeatable measurement for RL0 through RL5, independent certification, evidence submission, quantitative treatment of failure and safety, backward compatibility, how compute placement affects interaction latency, and how buyers prevent levels from becoming another marketing benchmark. Without governance details, the framework improves communication but cannot replace product acceptance.",
      productVerdict: "Arm's signal is not another robot demo; it is an attempt to give Physical AI a shared acceptance vocabulary. Verdict: the developer and industry surface is public, while maturity and adoption are unproven. The next evidence is a machine-readable schema, measurement tooling, and citation in real projects."
    }}
  }),
  topic({
    id: "ikairos-lifeos-modular-wearable", section: "global", evidenceLabel: "startup signal", sourceDate: "2026-09-03",
    evidenceStrength: "company-provided PR Newswire launch material; product and LifeOS claims are not independently hands-on verified",
    zhHeadline: "iKairos 把 AI 的‘身体’做成可拆模块：桌面机器人与项链共用 Neural Core",
    enHeadline: "iKairos makes the AI body modular: one Neural Core for a robot and a necklace",
    zhFact: "Lingverse 在 IFA 2026 公开 iKairos 与 LifeOS：一个圆形 Neural Core 可以放入小型桌面机器人，也可以拆出成为项链形态。厂商称 LifeOS 会从日常习惯、关系和环境观察中形成上下文，并通过周期快照与跨时刻关联给出建议。",
    enFact: "At IFA 2026, Lingverse introduced iKairos and LifeOS: a circular Neural Core can sit inside a small desktop robot or be removed into a necklace form. The company says LifeOS builds context from routines, relationships, and surroundings, using periodic snapshots and cross-moment connections to surface suggestions.",
    zhValue: "模块化的重点不是换外壳，而是把‘AI 记忆’从单一佩戴位置中解耦：桌面机器人观察家庭或工作环境，项链获得第一视角，核心与 LifeOS 继续积累同一套上下文。这样可以覆盖更多场景，也把旁观者、连续观察、关系推断和删除权限的风险放大。",
    enValue: "The point of modularity is not changing a shell; it is decoupling AI memory from one wearing position. A desktop robot observes a home or work setting, the necklace supplies a first-person perspective, and the core continues one context model through LifeOS. That widens coverage while multiplying bystander, continuous-observation, relationship-inference, and deletion risks.",
    zhHciLens: ["形态：桌面机器人 / 项链", "输入：周期快照 + 环境观察", "理解：习惯 / 关系 / 上下文", "反馈：建议与记忆关联"],
    enHciLens: ["Form: desktop robot / necklace", "Input: periodic snapshots + environment", "Understanding: routines / relationships / context", "Feedback: suggestions and memory links"],
    zhImplication: "多视角记忆设备必须让用户知道哪个身体在观察、观察频率是多少、哪些人被卷入、如何撤回单条关联，并把‘建议’和‘事实记录’分开。",
    enImplication: "A multi-perspective memory device must show which body is observing, how often, who is included, how to revoke one link, and how suggestions differ from factual records.",
    visual: ikairosVisual,
    sources: [source("iKairos / Lingverse PR Newswire release", ikairosUrl, "wild"), source("iKairos official site", ikairosProductUrl, "official"), source("IFA Next 2026", "https://www.ifa-berlin.com/press-releases/ifa-next-2026", "global")],
    dossier: { zh: {
      productName: "Lingverse iKairos + LifeOS modular AI wearable",
      productType: "iKairos 是 Lingverse 在 IFA 2026 展示的模块化个人 AI 可穿戴，核心是一个可插入不同硬件身体的圆形 Neural Core；首次公开的身体包括可观察和互动的桌面机器人，以及可佩戴的项链。LifeOS 被描述为面向物理世界的人机交互操作系统，试图把日常习惯、环境、偏好和关系组织成长期上下文。它是 startup signal，当前不能写成已验证的通用记忆产品。",
      interactionFlow: "厂商设想用户让 Neural Core 在桌面机器人或项链身体中观察日常，LifeOS 通过周期快照、当下关注点和跨时刻关联识别习惯变化，再在适当时机给出建议或连接记忆。例如公告举例，系统可能把反复出现却一直推迟的帆船兴趣，与肩痛等已有上下文联系起来并建议周末课程。公开材料没有说明用户如何开始/停止观察、如何预览快照、如何确认关系推断、如何删除单条事件、如何关闭建议或如何让被观察者退出。",
      specsOrStack: "公开名称包括 Neural Core、LifeOS、desktop robot、wearable necklace、periodic snapshots、context-aware AI 和对 routines/personality/relationships 的分析。没有公开芯片、相机、麦克风、存储、连接方式、端侧/云端模型、快照间隔、数据格式、API、权限、加密、保留、售价、重量、续航和具体上市时间。‘dual-perspective’ 是厂商定位，不是经过独立测量的感知覆盖指标。",
      useCases: "潜在场景覆盖桌面陪伴、工作与生活节奏提醒、长期记忆检索、关系和兴趣回顾、项链式随身记录，以及让同一个 AI 核心跨身体继续理解用户。对于家庭、办公室或照护环境，这种设计也会遇到多人、访客、儿童、敏感地点和不应记录的对话。公告没有给出量产用户、可购买价格、第三方应用或真实建议准确率。",
      painPointsSolved: "模块化身体尝试解决单一设备无法同时覆盖桌面、移动和第一视角的问题，也减少用户在更换形态时重新建立记忆上下文的成本。LifeOS 试图把零散记录变成跨时刻的模式和建议，处理‘用户忘记自己一直在做什么’的痛点。它同时可能制造新的痛点：观察过度、错误关系推断、建议打扰、旁观者不知情、跨身体权限继承和用户无法找到原始记录。",
      newTech: "技术方向是把计算/记忆核心与硬件身体拆分，并用 LifeOS 作为跨形态的上下文层。这比把 AI 固定在一个耳机或项链里更像平台化尝试，但平台价值取决于事件 schema、身份绑定、权限继承、同步一致性和删除可追溯性。当前公开材料没有给出这些底层机制，也没有独立证据证明系统能从快照可靠推断人格、关系或长期偏好。",
      availability: "iKairos 和 LifeOS 已在 PR Newswire 的 IFA 2026 材料中公开展示，官方网站可访问。购买入口、价格、出货日期、地区、试用资格、SDK、数据中心、订阅和量产硬件覆盖 source not stated。当前应标注为 startup signal / staged reveal，不能升级为 confirmed product availability。",
      limitsOrUnknowns: "下一步要看真实硬件能否在桌面机器人和项链之间安全切换、同一记忆如何同步、观察指示如何被旁观者理解、周期快照是否可配置、敏感事件如何本地处理、用户是否能逐项删除、错误推断如何纠正、关系分析是否默认开启，以及 LifeOS 是否提供导出和跨设备注销。厂商叙事中的建议例子不等于实测效果。",
      productVerdict: "iKairos 提供了一个具体的物理 AI 形态实验：同一核心在桌面和身上移动。产品判断：模块化路线和 LifeOS 叙事已公开，但记忆边界、隐私控制、真实硬件和商业可用性均未证实；下一关是把观察状态与删除权做成产品第一屏。"
    }, en: {
      productName: "Lingverse iKairos and LifeOS modular AI wearable",
      productType: "iKairos is Lingverse's modular personal AI wearable shown at IFA 2026. Its core is a circular Neural Core that can be inserted into different hardware bodies, initially a small observing desktop robot and a wearable necklace. LifeOS is described as a human-machine interaction operating system for the physical world, organising routines, surroundings, preferences, and relationships into longer-term context. This is a startup signal, not independently verified general-purpose memory hardware.",
      interactionFlow: "The company imagines a Neural Core observing daily life in a desktop-robot or necklace body. LifeOS uses periodic snapshots, current focus, and cross-moment links to detect routine changes and surface a suggestion or memory connection. The announcement gives an example in which recurring but postponed interest in sailing is connected to existing context such as shoulder pain and turned into a weekend lesson suggestion. It does not explain start/stop observation, snapshot preview, confirmation of relationship inference, item deletion, suggestion controls, or how a bystander opts out.",
      specsOrStack: "Public terms include Neural Core, LifeOS, desktop robot, wearable necklace, periodic snapshots, context-aware AI, and analysis of routines, personality, and relationships. Chip, camera, microphone, storage, connectivity, edge/cloud model, snapshot interval, data format, API, permission, encryption, retention, price, weight, battery, and exact launch date are source not stated. Dual-perspective is a company positioning phrase, not an independently measured perception-coverage metric.",
      useCases: "Potential settings include desktop companionship, work and life reminders, long-term memory retrieval, reflection on relationships and interests, necklace-style capture, and carrying one AI context across bodies. In a home, office, or care setting, the design also encounters multiple people, visitors, children, sensitive places, and conversations that should not be recorded. The release gives no production-user count, purchase price, third-party application, or measured suggestion accuracy.",
      painPointsSolved: "Modular bodies try to solve the inability of one device to cover desk, mobile, and first-person contexts, while reducing the cost of rebuilding memory when the user changes form factor. LifeOS tries to turn scattered observations into cross-moment patterns and suggestions, addressing the problem of forgetting what one keeps postponing. It may create new problems: over-observation, incorrect relationship inference, interruptions, unaware bystanders, inherited permissions across bodies, and difficulty finding the original record.",
      newTech: "The direction is separating a compute and memory core from hardware bodies and using LifeOS as a cross-form context layer. That is more platform-like than fixing an assistant inside one necklace or earbud, but platform value depends on event schema, identity binding, permission inheritance, sync consistency, and traceable deletion. None of those mechanisms is public, and there is no independent evidence that snapshots can reliably infer personality, relationships, or long-term preference.",
      availability: "iKairos and LifeOS are publicly presented in the PR Newswire IFA 2026 material, and an official site is accessible. Purchase, price, shipping date, territory, trial eligibility, SDK, data centre, subscription, and production hardware coverage are source not stated. The correct label is startup signal and staged reveal, not confirmed product availability.",
      limitsOrUnknowns: "The next evidence should show safe switching between desktop and necklace bodies, memory synchronisation, bystander-facing indicators, configurable snapshot frequency, local handling of sensitive events, item-level deletion, correction of wrong inferences, default status of relationship analysis, export, and cross-device sign-out. A suggestion example in company material is not a measured result.",
      productVerdict: "iKairos is a concrete physical-AI form-factor experiment: one core moves between a desk and the body. Verdict: the modular route and LifeOS narrative are public, while memory boundaries, privacy controls, real hardware, and commercial availability are unproven. The next gate is making observation state and deletion rights first-screen product controls."
    }}
  }),
  topic({
    id: "ultrahuman-ring-ai-controller-roadmap", section: "reviews", evidenceLabel: "review/community friction", sourceDate: "2026-09-03",
    evidenceStrength: "TechCrunch founder interview plus official Ring Air product page; roadmap features are not yet verified on hardware",
    zhHeadline: "Ultrahuman 想让戒指变成电脑：健康传感器开始进入 AI 控制层",
    enHeadline: "Ultrahuman wants the ring to become a computer, not just a tracker",
    zhFact: "TechCrunch 报道 Ultrahuman 正与 Qualcomm 研发新一代戒指，现有 Ring Air 与 Ring Pro 计划在 9 月底通过软件更新加入游戏控制器、AI 应用交互和第三方开发能力的试探。创始人还把戒指定义为结合心率、体温、运动等生理上下文的指针/输入设备；这些更新仍待实机确认。",
    enFact: "TechCrunch reports that Ultrahuman is working with Qualcomm on a future ring and plans to test game-controller, AI-application, and third-party-development capabilities on existing Ring Air and Ring Pro through a software update by the end of September. The founder also describes the ring as a pointer or input device carrying heart-rate, temperature, and movement context; the update remains to be verified on hardware.",
    zhValue: "戒指的交互价值在于它一直戴在手指上，可以用很小的指向、点击或手势给 AI 提供输入，同时携带身体状态。它可能绕开手机屏幕，但也失去手表和耳机的即时反馈，用户很难知道动作是否被识别、AI 是否开始工作或是否写入了数据。健康、游戏和 AI 三种用途叠加后，权限和反馈会比‘加一个手势’更难设计。",
    enValue: "The ring's interaction value comes from staying on the finger: a small point, tap, or gesture can become AI input while the device carries body context. That may bypass a phone screen but sacrifices the immediate feedback of a watch or earbuds. Users may not know whether a gesture was recognised, an AI task started, or data was written. Combining health, gaming, and AI makes permissions and feedback harder than simply adding a gesture.",
    zhHciLens: ["输入：手指指向 / 控制", "上下文：心率 / 体温 / 运动", "输出：AI app / 游戏", "摩擦：反馈与误触待验证"],
    enHciLens: ["Input: pointing / control", "Context: heart rate / temperature / movement", "Output: AI apps / games", "Friction: feedback and false activation unverified"],
    zhImplication: "无屏输入必须补偿确认、撤销和状态反馈；生理数据也不应默默成为每个 AI app 的默认上下文。",
    enImplication: "Screenless input needs confirmation, undo, and state feedback; physiological data should not silently become the default context for every AI app.",
    visual: ultraVisual,
    sources: [source("TechCrunch Ultrahuman roadmap report", ultraUrl, "reviews"), source("Ultrahuman Ring Air official page", ultraProductUrl, "official"), source("Qualcomm", "https://www.qualcomm.com/", "official")],
    dossier: { zh: {
      productName: "Ultrahuman Ring Air / Ring Pro AI-controller roadmap",
      productType: "这是 Ultrahuman 现有智能戒指向可编程输入设备扩展的路线图信号。TechCrunch 采访创始人称，公司希望让戒指从睡眠和健康 tracker 变成能在设备上运行软件、连接 AI 应用、做游戏控制器或指针的 personal computer；Ring Air 与 Ring Pro 计划先通过软件更新试探一部分能力。它不是已经发布的完整开发平台，未来 Qualcomm 芯片戒指也不等同于现有型号升级。",
      interactionFlow: "预期流程是用户佩戴 Ring Air 或 Ring Pro，用手指位置、指向或动作控制游戏、AI 应用或其他设备，同时戒指继续采集心率、体温、运动等生理信号。手机或云端可能参与，但公开报道没有给出完整设备发现、配对、权限、动作映射、状态确认、错误纠正和数据撤销流程。对无屏设备而言，用户至少需要触觉、手机提示或声音确认来知道输入是否被接收；这些反馈形式和延迟 source not stated。",
      specsOrStack: "现有戒指据 TechCrunch 报道使用 Nordic Semiconductor 芯片，未来产品将与 Qualcomm silicon 合作；公司计划在现有设备上先推软件能力，并开放第三方开发方向。公开报道列出 heart rate、temperature、movement 等生理上下文，官方 Ring Air 页面提供产品定位，但没有公开 AI SDK、传感器采样率、存储、连接协议、动作识别模型、续航、系统版本、开发者审核或数据访问范围。",
      useCases: "具体方向包括把戒指当作游戏控制器、精确指针、车钥匙和 AI 交互设备，也可以让游戏结合玩家心率和体温改变反馈。健康 tracking 仍是现有产品基础，AI 场景则要处理手机、云和第三方应用的边界。公开资料没有交付某个游戏、AI app 或车钥匙体验，也没有证明生理信号能稳定参与实时控制。",
      painPointsSolved: "戒指可以绕开从口袋掏手机、点亮屏幕和抬腕看表的摩擦，并把‘手指在场’与身体上下文带进更轻的交互。它可能让微小动作成为低打扰控制，但不会自动解决用户看不到状态、误触、左右手差异、尺寸适配、动作疲劳、隐私授权、应用误读生理数据和手机依赖。无屏入口越隐形，反馈越需要明确。",
      newTech: "产品方向是把健康传感器、指向输入和第三方软件运行放在同一个可穿戴节点上，再用 Qualcomm silicon 为后续本地计算留下空间。这个组合改变了戒指的角色：从被动测量器变成 context-rich controller。当前仍没有公开可复现的 SDK、端侧算法、控制延迟或独立评测，因此不应把融资、芯片合作和路线图写成已完成的产品能力。",
      availability: "Ring Air 和 Ring Pro 是现有产品，TechCrunch 报道计划在 2026 年 9 月底通过软件更新测试部分 AI、游戏控制器和第三方开发能力；Qualcomm-powered ring 计划更晚。更新是否按期、覆盖哪些地区/型号、是否需要订阅、开发者如何申请、价格和 API 限制 source not stated。当前证据是 review/community friction 加官方产品页，路线图未实测。",
      limitsOrUnknowns: "需要验证动作识别准确率、输入反馈、误触率、左右手和不同尺寸、手机断连、低电量、睡眠佩戴、心率等数据是否可被第三方读取、用户是否能逐 app 授权、原始数据如何删除，以及 AI app 是否能在戒指本地运行。未来芯片产品的能力不能回填到现有 Ring Air/Ring Pro。",
      productVerdict: "Ultrahuman 把戒指从‘身体数据记录器’推向‘身体上下文控制器’，方向具体且由产品路线图支撑。产品判断：现有硬件能力真实、AI/游戏/第三方软件仍是待验证 roadmap；下一关是无屏状态反馈和逐应用生理数据权限。"
    }, en: {
      productName: "Ultrahuman Ring Air and Ring Pro AI-controller roadmap",
      productType: "This is a roadmap signal for extending Ultrahuman's existing smart rings into programmable input devices. TechCrunch quotes the founder describing a move from sleep and health tracking toward a ring that can run software, interact with AI applications, act as a game controller, or work as a pointer. Ring Air and Ring Pro are expected to test some capabilities through software; a future Qualcomm-powered ring is not the same as an upgrade already shipped to current models.",
      interactionFlow: "The intended flow is that a wearer uses finger position, pointing, or gestures to control a game, AI application, or another device while the ring continues sensing heart rate, temperature, and movement. A phone or cloud may participate, but the report gives no complete discovery, pairing, permission, gesture mapping, state confirmation, correction, or revocation flow. A screenless device needs haptic, phone, or audio confirmation so users know whether an input was received; feedback form and latency are source not stated.",
      specsOrStack: "TechCrunch reports that current rings use Nordic Semiconductor chips and that a future product will work with Qualcomm silicon; software capabilities are planned for existing devices first. The report names heart-rate, temperature, and movement context, while the official Ring Air page provides product positioning. AI SDK, sensor sampling, storage, connection protocol, gesture model, battery, OS version, developer review, and data-access scope are not public.",
      useCases: "Concrete directions include using the ring as a game controller, precise pointer, car key, or AI interaction device, with games potentially responding to heart rate and body temperature. Health tracking remains the current foundation, while AI scenarios must define the phone, cloud, and third-party-app boundary. The public evidence does not identify a delivered game, AI app, or car-key experience, nor prove that physiological signals can reliably control a real-time interaction.",
      painPointsSolved: "A ring can bypass taking out a phone, waking a screen, or lifting a wrist to check a watch, while adding finger presence and body context to a low-friction interaction. It may make tiny gestures useful, but it does not solve invisible state, false activation, hand differences, sizing, fatigue, privacy consent, application misuse of physiological data, or phone dependence. The more invisible the input, the more explicit the feedback must be.",
      newTech: "The product direction combines health sensors, pointing input, and third-party software potential on one wearable node, with Qualcomm silicon leaving room for later local compute. That changes the ring from a passive measurement device into a context-rich controller. There is no public reproducible SDK, edge algorithm, control latency, or independent evaluation yet, so financing, chip collaboration, and roadmap should not be promoted to shipped capability.",
      availability: "Ring Air and Ring Pro are existing products. TechCrunch reports plans to test some AI, game-controller, and third-party-development capabilities through a software update by the end of September 2026; a Qualcomm-powered ring is planned later. Whether the update arrives on time, which models and territories are covered, whether a subscription is required, how developers apply, price, and API limits are source not stated. The evidence is a review/community roadmap plus official product page, not a hands-on verification.",
      limitsOrUnknowns: "Validation should measure gesture accuracy, feedback, false activation, hand and size variation, phone disconnect, low battery, sleep wear, third-party access to heart-rate data, per-app consent, raw-data deletion, and whether AI apps actually run on the ring. Future chip-product claims cannot be backfilled into current Ring Air or Ring Pro.",
      productVerdict: "Ultrahuman is moving the ring from a body-data recorder toward a body-context controller, with a concrete product roadmap behind it. Verdict: current hardware is real, while AI, gaming, and third-party software remain unverified; the next gate is screenless state feedback and per-app permission for physiological context."
    }}
  })
];

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`Missing previous issue ${previousDate}`);
const issue = structuredClone(previous);
issue.date = date;
issue.zhTitle = "AI Daily 2026-09-14：Physical AI 开始进入制造、训练与验收系统";
issue.enTitle = "AI Daily 2026-09-14: Physical AI enters manufacturing, training, and acceptance systems";
issue.zhSummary = "XPENG IRON 把人形机器人从研发原型推向产线与 2027 交付边界；Skild S1 用一段视频示范适配陌生长时任务；SOMA 把遥操作、数据采集、训练和部署打成研究平台；Arm 试图给机器人建立 RL0–RL5 的共同语言。iKairos 的多形态记忆核心与 Ultrahuman 的 AI 戒指路线图继续按 startup/review 信号处理，真实硬件、权限与持续运行仍待验证。";
issue.enSummary = "XPENG IRON moves a humanoid robot from prototype toward a production line and a 2027 delivery boundary; Skild S1 adapts unfamiliar long-horizon tasks from one video demonstration; SOMA packages teleoperation, data collection, training, and deployment as a research platform; Arm proposes a shared RL0–RL5 vocabulary for robotics. iKairos's multi-form memory core and Ultrahuman's AI-ring roadmap remain startup and review signals pending real hardware, permissions, and continuous operation.";
issue.tags = Array.from(new Set(["Physical AI", "humanoid robots", "robot foundation models", "robotics research", "AI wearables", "on-device AI", "HCI", "manufacturing", ...issue.tags])).slice(0, 24);
issue.sourceTypes = Array.from(new Set(["confirmed product", "developer surface", "review/community friction", "startup signal", "research", "patent signal", "china", "global", "official", "community", "wild", ...issue.sourceTypes]));
issue.topics = [...newTopics, ...issue.topics.filter((item) => !newTopics.some((fresh) => fresh.id === item.id))];
issue.coverStory = {
  topicId: newTopics[0].id,
  zhTitle: "Physical AI 的下一关：从会动的 demo 到可制造、可训练、可验收的系统",
  enTitle: "The next Physical AI test: move from moving demos to manufacturable, trainable, acceptable systems",
  zhSummary: ["XPENG IRON 把自由度、端侧算力和汽车级产线放进同一个产品叙事。", "Skild、SOMA 与 Arm 分别重写训练入口、研究工具链和能力描述语言。", "真正的产品指标将是任务成功、失败接管、数据权限、维护成本和可重复交付。"],
  enSummary: ["XPENG IRON puts degrees of freedom, on-robot compute, and automotive-grade production into one product story.", "Skild, SOMA, and Arm respectively reshape the teaching loop, research toolchain, and capability vocabulary.", "The real product metrics will be task success, takeover, data permission, maintenance cost, and repeatable delivery."],
  imagePath: xpengVisual.path, imageWidth: xpengVisual.width, imageHeight: xpengVisual.height, imageSourceUrl: xpengVisual.sourceUrl, primarySourceUrl: xpengUrl,
  evidenceStrength: "confirmed product · XPENG official · 2026-09-08",
  whyCover: "Physical AI becomes a product category only when its body, training loop, software stack, and delivery system can be accepted together."
};
issue.designDesk = {
  zhTitle: "Design Desk：把机器人从‘能力叙事’拆成可接管的任务链",
  enTitle: "Design Desk: turn robot capability stories into takeover-ready task chains",
  zhIntro: "今天的产品证据集中在 Physical AI 的四个缺口：制造复制、示范训练、能力比较和长期记忆。共同的 UX 任务是让系统知道自己在做什么、凭什么这样做、何时需要人接管，以及失败后数据如何回到下一次训练。",
  enIntro: "Today's product evidence clusters around four Physical AI gaps: repeatable manufacturing, demonstration-based training, capability comparison, and long-term memory. The shared UX task is making it clear what the system is doing, why, when a human must take over, and how failure data returns to the next training cycle.",
  zhItems: [
    { label: "Manufacture", body: "把出厂一致性、维护、急停和交付节奏当作用户体验的一部分。" },
    { label: "Demonstrate", body: "示范后展示模型提取的对象、步骤、不确定性和危险动作。" },
    { label: "Compare", body: "用场景、延迟、算力、电源、确定性和安全描述能力，不只看跑分。" },
    { label: "Recover", body: "失败、暂停、接管、回滚和重新训练要共享同一条记录。" },
    { label: "Permission", body: "记忆、心率、环境观察与第三方 AI app 必须逐项授权和删除。" },
    { label: "Deliver", body: "把 prototype、early access、roadmap 和 confirmed product 分开发布。" }
  ],
  enItems: [
    { label: "Manufacture", body: "Treat unit consistency, service, emergency stop, and delivery cadence as UX." },
    { label: "Demonstrate", body: "After a demo, show extracted objects, steps, uncertainty, and dangerous actions." },
    { label: "Compare", body: "Describe capability with scenario, latency, compute, power, determinism, and safety." },
    { label: "Recover", body: "Failure, pause, takeover, rollback, and retraining should share one record." },
    { label: "Permission", body: "Memory, heart rate, environmental observation, and AI apps need item-level consent." },
    { label: "Deliver", body: "Keep prototype, early access, roadmap, and confirmed product states separate." }
  ]
};
issue.watchlistZh = [
  "XPENG IRON：首批门店/园区任务、任务成功率、急停与远程接管、产线一致性、2027 交付与售后。",
  "Skild S1：66% 测试口径、不同 embodiment、视频到动作的中间状态、错误恢复、工厂安全与 API。",
  "SOMA Robotics：9 月 22 日价格/规格、soda OS SDK、云端依赖、500 Hz 长时稳定性与首批发货。",
  "Arm Robotics Capability Framework：RL0–RL5 测量方法、机器可读 schema、认证与真实项目采用。",
  "iKairos LifeOS：观察状态、快照频率、旁观者提示、事件删除、跨身体同步和量产入口。",
  "Ultrahuman Ring：现有 Ring Air/Pro 更新是否上线、无屏反馈、AI app 权限和生理数据访问。",
  ...issue.watchlistZh.slice(0, 14)
];
issue.watchlistEn = [
  "XPENG IRON: first store/campus tasks, task success, emergency stop and remote takeover, unit consistency, 2027 delivery, and service.",
  "Skild S1: definition of the 66% test, different embodiments, video-to-action state, recovery, factory safety, and API.",
  "SOMA Robotics: September 22 price/specification reveal, soda OS SDK, cloud dependence, long-run 500 Hz stability, and first shipments.",
  "Arm Robotics Capability Framework: RL0–RL5 measurement, machine-readable schema, certification, and real-project adoption.",
  "iKairos LifeOS: observation state, snapshot frequency, bystander cues, event deletion, cross-body sync, and production access.",
  "Ultrahuman Ring: whether the Ring Air/Pro update ships, screenless feedback, AI-app permissions, and physiological-data access.",
  ...issue.watchlistEn.slice(0, 14)
];
issue.sourcesPath = `./${date}/sources.md`;
issue.zhPath = `./${date}/zh/`;
issue.enPath = `./${date}/en/`;
const index = issues.findIndex((item) => item.date === date);
if (index >= 0) issues[index] = issue; else issues.unshift(issue);
issues.sort((a, b) => b.date.localeCompare(a.date));
await fs.writeFile(dataPath, `${JSON.stringify(issues, null, 2)}\n`);

await fs.rm(deckDir, { recursive: true, force: true });
await fs.mkdir(path.join(deckDir, "public", "assets"), { recursive: true });
await fs.cp(path.join(previousDeck, "public", "assets"), path.join(deckDir, "public", "assets"), { recursive: true });

const labels = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const dossierText = (locale, item) => fields.map((field, i) => `**${labels[locale][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="./public/${xpengVisual.path}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(newTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${newTopics.map((item) => item.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\n**Design Desk** — ${issue.designDesk.zhTitle}。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue with source/date/evidence labels and PDF downloads.`,
  ...newTopics.flatMap((item) => [`# ${item.zhHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("zh", item)}\n\n**Sources** — ${links(item)}`, `# ${item.enHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("en", item)}\n\n**Sources** — ${links(item)}`]),
  `# Design Desk / 设计洞察\n\n${issue.designDesk.zhItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}\n\n${issue.designDesk.enItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}`,
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n${issue.watchlistEn.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url)))).slice(0, 100).map((url, i) => `${i + 1}. ${url}`).join("\n")}\n\nVisual evidence uses local source-traceable images with contain positioning, white backgrounds, and no page-internal scrolling.`
];
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const laneRows = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"].map((lane) => `| ${lane} | ${issue.topics.some((item) => item.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((item) => `| ${item.id} | \`${item.visual.path}\` | ${item.visual.sourceUrl} | ${item.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, added: newTopics.length, sources: new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url))).size, visuals: new Set(issue.topics.map((item) => item.visual.path)).size, deckDir }));
