import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-21";
const previousDate = "2026-09-18";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const previousDeck = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`);
const source = (label, url, type) => ({ label, url, type });
const visual = (file, kind, altZh, altEn, captionZh, captionEn, sourceUrl, width = 1600, height = 900) => ({
  path: `assets/${file}`, width, height, kind, altZh, altEn, captionZh, captionEn, sourceUrl
});
const product = (input) => ({ dossierKind: "product", ...input });
const scan = (input) => ({ dossierKind: "scan", ...input });

const horizonUrl = "https://www.qualcomm.com/news/releases/2026/08/qualcomm-and-humain-unveil-horizon-ultra-ai-pc-at-leap-2026--bri";
const x2Url = "https://www.qualcomm.com/news/releases/2025/09/new-snapdragon-x2-elite-extreme-and-snapdragon-x2-elite-are-the-";
const zenithUrl = "https://blogs.windows.com/windowsdeveloper/2026/09/04/announcing-project-zenith-the-ready-to-code-windows-experience/";
const tripNewsUrl = "https://sg.trip.com/newsroom/";
const tripProductUrl = "https://jp.trip.biz/platform-ai-agent/en-US";
const tripReleaseUrl = "https://en.prnasia.com/releases/apac/trip-biz-launches-agent-one-an-ai-suite-transforming-business-travel-cutting-booking-time-by-90-for-travellers-and-simplifying-oversight-for-travel-managers-548414.shtml";
const rokidUrl = "https://finance.sina.com.cn/tech/digi/2026-09-21/doc-inispymz0815037.shtml";
const rokidOfficialUrl = "https://www.rokid.com/";
const glassesResearchUrl = "https://arxiv.org/abs/2609.19793";
const glassesRelatedUrl = "https://arxiv.org/abs/2608.24877";

const horizonVisual = visual(
  "horizon-ultra-official-2026-09-21.png",
  "source-backed official page screenshot",
  "Qualcomm Horizon Ultra 官方公告截图",
  "Qualcomm Horizon Ultra official announcement screenshot",
  "官方视觉：Qualcomm 对 Horizon Ultra 的 Windows、Snapdragon X2 Elite 与端侧 AI 产品边界说明。",
  "Official visual: Qualcomm's description of Horizon Ultra's Windows, Snapdragon X2 Elite, and on-device AI boundary.",
  horizonUrl
);
const tripVisual = visual(
  "tripbiz-agent-one-official-2026-09-21.png",
  "source-backed official product page screenshot",
  "Trip.Biz Agent ONE 官方产品页截图",
  "Trip.Biz Agent ONE official product page screenshot",
  "官方产品页视觉：Agent ONE 将 Planning、Insight、Booking、Approval 四个 agent 放进一条企业差旅流程。",
  "Official product-page visual: Agent ONE places planning, insight, booking, and approval agents in one business-travel flow.",
  tripProductUrl
);
const rokidVisual = visual(
  "rokid-ai-glasses-press-2026-09-21.png",
  "source-backed China press screenshot",
  "Rokid 新一代 AI 眼镜预发布报道截图",
  "Rokid next-generation AI glasses pre-launch report screenshot",
  "中国来源视觉：9 月 21 日报道确认 Rokid 将于 9 月 24 日在数贸会发布新一代 AI 眼镜；具体规格仍未公开。",
  "China-source visual: a September 21 report confirms Rokid will unveil next-generation AI glasses on September 24; detailed specifications remain undisclosed.",
  rokidUrl
);
const researchVisual = visual(
  "ai-smart-glasses-research-2026-09-21.png",
  "source-backed research page screenshot",
  "AI Smart Glasses 研究论文 arXiv 页面截图",
  "AI Smart Glasses arXiv research page screenshot",
  "研究视觉：论文把智能眼镜拆成感知、资源受限计算、推理、多模态交互与现实应用约束。",
  "Research visual: the paper frames smart glasses through sensing, resource-aware computing, reasoning, multimodal interaction, and real-world constraints.",
  glassesResearchUrl
);

const freshTopics = [
  product({
    id: "qualcomm-humain-horizon-ultra-ai-pc",
    section: "global",
    evidenceLabel: "confirmed product",
    sourceDate: "2026-09-20",
    evidenceStrength: "Qualcomm official announcement; enterprise purchase date and platform stack are explicitly stated",
    zhHeadline: "Horizon Ultra：把端侧 agent 作为企业 PC 的默认计算层",
    enHeadline: "Horizon Ultra makes on-device agents an enterprise PC layer",
    zhFact: "Qualcomm 与 HUMAIN 宣布 Horizon Ultra 自 9 月 20 日起面向企业采购，首发运行 Windows，核心是 Snapdragon X2 Elite、18 核 Qualcomm Oryon CPU、Adreno GPU 与 Hexagon NPU。",
    enFact: "Qualcomm and HUMAIN announced Horizon Ultra for enterprise purchase from September 20, with Windows as the first operating environment and Snapdragon X2 Elite, an 18-core Qualcomm Oryon CPU, Adreno GPU, and Hexagon NPU at its core.",
    zhValue: "这不是在电脑上再装一个聊天 app，而是把模型执行位置、数据主权与云端扩展写进设备架构。企业可以把需要响应速度、隐私或离线能力的 workload 留在端侧，再把超出本机能力的任务延伸到云端。",
    enValue: "This is not another chat app on a PC. It makes execution location, data sovereignty, and cloud extension part of the device architecture. Enterprises can keep latency-sensitive or sensitive workloads on the endpoint and extend tasks to the cloud when local capacity is insufficient.",
    zhHciLens: ["进入：Windows 企业 PC", "上下文：本地文件与企业工作流", "过程：CPU/GPU/NPU 分工执行", "边界：本机与云端的任务迁移"],
    enHciLens: ["Entry: Windows enterprise PC", "Context: local files and enterprise workflows", "Process: CPU/GPU/NPU workload distribution", "Boundary: task migration between device and cloud"],
    zhImplication: "端侧 agent 的关键界面不是一个更大的 Copilot 按钮，而是任务执行前后的地点、数据、模型和权限状态。用户需要知道哪些内容没有离开电脑、何时切到云端、谁可以改变这个策略，以及设备睡眠或网络中断后任务如何恢复。",
    enImplication: "The key interface for an on-device agent is not a larger Copilot button. It is the location, data, model, and permission state before and after execution. Users need to know what stayed on the machine, when work moved to the cloud, who can change that policy, and how a task recovers after sleep or disconnection.",
    visual: horizonVisual,
    sources: [source("Qualcomm and HUMAIN Horizon Ultra announcement", horizonUrl, "official"), source("Snapdragon X2 Elite official release", x2Url, "official"), source("Microsoft Project Zenith developer-PC surface", zenithUrl, "global")],
    dossier: {
      zh: {
        productName: "HUMAIN Horizon Ultra / Snapdragon X2 Elite AI PC",
        productType: "Horizon Ultra 是 HUMAIN 与 Qualcomm 联合推出的企业 AI PC 产品线，首发不是一台脱离操作系统的专用 agent 终端，而是运行 Windows 的个人计算设备。Qualcomm 把它定位为把 AI 直接带到设备的下一代 Horizon 旗舰，后续路线还包括 2027 年的 HUMAIN OS。当前已确认的是企业端产品、Windows 首发与本地 AI 架构，不应把 HUMAIN OS 的未来计划写成今天已经可用的系统。",
        interactionFlow: "用户在熟悉的 Windows 企业环境中打开工作应用或 agent，任务先在本地 PC 上处理；涉及更大模型、更高吞吐或云端服务时，再由系统把任务延伸到云端。官方说明重点是 CPU、GPU、NPU 协同和本地到云端的弹性，但没有公开一套面向终端用户的策略面板、跨端迁移提示、审批流程或失败恢复 UI。真正可用的路径应让员工在提交任务前看到本地/云端边界，在任务过程中看到数据是否外发，完成后保留可追溯的执行记录。",
        specsOrStack: "官方披露 Snapdragon X2 Elite 平台、18 核 Qualcomm Oryon CPU、Qualcomm Adreno GPU 与 Hexagon NPU；首发 Windows，架构允许工作负载在专用计算单元间分配，并在本地能力不足时连接云端。Qualcomm 还把本地 AI、企业生产力、内容创作、多模态 AI 与 intelligent agents 列为场景。具体机身尺寸、内存、存储、显示、续航、NPU TOPS、模型清单、操作系统版本、企业管理策略、网络要求和云端路由规则 source not stated。",
        useCases: "官方给出的方向包括企业生产力、内容创作、多模态处理和 intelligent agents。可落地的产品用例是：在企业端侧对敏感文档做摘要或分类；在会议、设计和内容工作中减少网络往返；在连接稳定性不确定的场所维持更及时的本地响应；当一次任务需要更大的模型或云端数据时继续执行，而不必把整个工作流重启。上述是官方所述能力对应的使用路径，不代表已经披露了具体软件、客户部署或成功率。",
        painPointsSolved: "Horizon Ultra 针对的是集中式云 AI 的延迟、数据主权、断网可用性和企业端点不具备专用 AI 计算的问题。把 CPU、GPU、NPU 放在同一台 PC 上，理论上能减少部分推理往返，让敏感数据留在设备，并把同一端点接入企业云。但它没有消除本地模型质量、设备采购、IT 管理、热和功耗、权限误配与云端升级带来的复杂性；如果用户看不到任务何时跨边界，隐私收益就无法转化为可理解的体验。",
        userVoice: "本日没有足够的独立长时评测或企业员工访谈可用于判断速度、续航、噪声、稳定性或 agent 任务完成率。Qualcomm 的企业定位和功能描述是官方产品证据，不是第三方使用结果。",
        newTech: "产品创新在于把端侧 AI 从一个软件特性推进到 PC 的硬件—系统协同层：CPU 处理通用工作，GPU 承担并行计算，NPU 负责专门 AI 工作负载，再以云端作为弹性扩展。与单纯宣传本地模型不同，这条路线把数据主权、低延迟和 agent 工作流放进同一台设备的架构叙事；但模型路由、状态同步、缓存与任务恢复仍未公开。",
        availability: "Qualcomm 官方称 Horizon Ultra 运行 Windows，并自 2026 年 9 月 20 日起面向企业采购；AlFalak 将负责销售与交付。官方没有公开零售价、首发国家、配置 SKU、预装 agent、企业管理控制台、保修、续约或 HUMAIN OS 的当前可用性，因此本期将它标为已确认企业产品，而不是面向普通消费者的现货推荐。",
        limitsOrUnknowns: "需要继续核验本地/云端切换是否可由员工理解和控制、哪些数据会被复制到云端、断网与睡眠后的任务恢复、企业管理员能否强制策略、模型更新如何影响结果、端侧计算的功耗和散热，以及 2027 HUMAIN OS 是否会改变 Windows 版的应用与权限模型。官方没有给出具体 benchmark、客户部署案例、价格和硬件重量，不能补写。",
        productVerdict: "这是一个已确认、面向企业采购的端侧 AI PC 产品。它的产品价值在于把执行位置和数据边界推到员工端点；真正的验收点不是 NPU 名称，而是员工能否在任务前后理解本机与云端的分工，并在断网、错误或权限变化时继续掌握任务。"
      },
      en: {
        productName: "HUMAIN Horizon Ultra / Snapdragon X2 Elite AI PC",
        productType: "Horizon Ultra is an enterprise AI PC line from HUMAIN and Qualcomm. The first release is not a standalone agent appliance detached from an operating system; it is a Windows personal computer designed around on-device AI. Qualcomm describes it as the flagship of the Horizon line and says a HUMAIN OS iteration is planned for 2027. Confirmed facts today are the enterprise product, the Windows launch, and the local-AI architecture. The future HUMAIN OS should not be written as an available system.",
        interactionFlow: "A user works in a familiar Windows enterprise environment. A task can begin on the local PC, then extend to the cloud when it needs a larger model, more throughput, or a cloud service. Qualcomm describes CPU, GPU, and NPU cooperation plus elastic local-to-cloud execution, but it does not publish a user-facing policy panel, migration prompt, approval flow, or failure-recovery UI. A usable product would show the local/cloud boundary before submission, disclose whether data leaves during execution, and preserve a traceable execution record afterward.",
        specsOrStack: "The published stack includes Snapdragon X2 Elite, an 18-core Qualcomm Oryon CPU, a Qualcomm Adreno GPU, and a Qualcomm Hexagon NPU. The first release runs Windows, with workloads distributed across specialised compute engines and cloud extension when local capacity is not enough. Qualcomm names enterprise productivity, content creation, multimodal AI, and intelligent agents as target areas. Chassis dimensions, memory, storage, display, battery, NPU TOPS, model list, Windows version, management controls, network requirements, and cloud-routing rules are source not stated.",
        useCases: "The announced directions are enterprise productivity, content creation, multimodal processing, and intelligent agents. Concrete product paths include summarising or classifying sensitive documents on the endpoint, reducing network round trips during meetings or creative work, preserving responsive behaviour when connectivity is unreliable, and continuing a task by extending only the part that needs a larger model or cloud data. These are use cases implied by the official description, not published customer deployments or success rates.",
        painPointsSolved: "Horizon Ultra targets latency, data sovereignty, offline resilience, and the lack of dedicated AI compute at the enterprise endpoint. Putting CPU, GPU, and NPU in one PC may reduce some inference round trips, keep sensitive data local, and connect the same endpoint to enterprise cloud systems. It does not remove local-model quality gaps, hardware procurement, IT management, heat, power, permission mistakes, or the complexity introduced by cloud escalation. If users cannot see when a task crosses the boundary, the privacy benefit will not become an understandable experience.",
        userVoice: "There is not enough independent long-run testing or employee research in today's sweep to judge speed, battery life, noise, stability, or agent task completion. Qualcomm's enterprise positioning and feature description are official product evidence, not third-party usage results.",
        newTech: "The product move is to make on-device AI a hardware-and-system layer of the PC. The CPU handles general work, the GPU handles parallel compute, the NPU handles specialised AI workloads, and the cloud becomes an elastic extension. Compared with simply marketing a local model, this joins data sovereignty, low latency, and agent workflows in one endpoint architecture. Model routing, state synchronisation, caching, and task recovery remain undisclosed.",
        availability: "Qualcomm says Horizon Ultra runs Windows and becomes available for enterprise purchase beginning September 20, 2026. AlFalak is the sales and delivery partner. Qualcomm does not publish consumer pricing, launch countries, SKU configurations, preinstalled agents, enterprise management console, warranty, renewal terms, or current HUMAIN OS availability. This issue therefore treats Horizon Ultra as a confirmed enterprise product, not a general consumer recommendation.",
        limitsOrUnknowns: "The next checks are whether employees can understand and control local-to-cloud escalation, which data is copied to the cloud, how tasks recover after sleep or disconnection, whether administrators can enforce policies, how model updates change results, and what power and thermal costs appear at the endpoint. Qualcomm gives no concrete benchmark, customer deployment, price, or hardware weight in the cited release. Those details remain source not stated.",
        productVerdict: "This is a confirmed enterprise-facing on-device AI PC. Its product value is moving execution location and data boundaries to the employee endpoint. The acceptance test is not the NPU label; it is whether employees can understand local-versus-cloud responsibility and retain control after disconnection, error, or permission changes."
      }
    }
  }),
  product({
    id: "tripbiz-agent-one-business-travel",
    section: "china",
    evidenceLabel: "confirmed product",
    sourceDate: "2026-09-18",
    evidenceStrength: "Trip.com newsroom, Trip.Biz product page, and launch release; product positioning is confirmed, performance claims remain company-reported",
    zhHeadline: "Trip.Biz Agent ONE：把企业差旅拆成规划、预订、审批与洞察四个 agent",
    enHeadline: "Trip.Biz Agent ONE splits corporate travel into planning, booking, approval, and insight agents",
    zhFact: "Trip.Biz 于 9 月 18 日发布 Agent ONE，把企业差旅流程组织成 Planning、Booking、Approval 与 Insight 四个互联的专门 agent，主张在一段对话内完成规划、符合政策的比较、预订、审批与支出洞察。",
    enFact: "Trip.Biz launched Agent ONE on September 18 as four connected specialised agents for planning, booking, approval, and insight. The product promises a conversational path from itinerary planning and policy-aware comparison to booking, approval, and spending analysis.",
    zhValue: "它不是把一个通用聊天框贴到差旅网站上，而是把不同角色的约束放进同一条企业流程：员工关心路线与偏好，经理关心政策与审批，财务关心开支与节省。Agent ONE 的产品价值在于把这些状态接起来，同时保留企业控制。",
    enValue: "This is not a generic chat box placed on a travel site. It puts different role constraints into one workflow: travellers care about routes and preferences, managers care about policy and approval, and finance cares about spend and savings. Its value is joining those states while retaining corporate control.",
    zhHciLens: ["进入：一句话描述差旅目标", "规划：比较成本、价值、路线与政策", "执行：Booking agent 生成并确认预订", "控制：Approval agent 让企业保留审批权"],
    enHciLens: ["Entry: describe a trip in one conversation", "Plan: compare cost, value, route, and policy", "Execute: Booking agent prepares and confirms the trip", "Control: Approval agent keeps corporate approval in the loop"],
    zhImplication: "企业 agent 的可信度来自角色边界，而不是对话自然度。员工必须知道谁在推荐，审批人必须看到规则与例外，财务必须追溯为什么生成某个节省洞察；一次对话不能把三种责任压成一个模糊的‘AI 已处理’。",
    enImplication: "Enterprise-agent trust comes from role boundaries, not conversational smoothness. A traveller needs to know who recommended an option, an approver needs to see policy and exceptions, and finance needs to trace why a savings insight was produced. One conversation cannot collapse three forms of responsibility into ‘AI handled it.’",
    visual: tripVisual,
    sources: [source("Trip.com newsroom Agent ONE launch", tripNewsUrl, "china"), source("Trip.Biz Agent ONE product page", tripProductUrl, "official"), source("Trip.Biz Agent ONE launch release", tripReleaseUrl, "global")],
    dossier: {
      zh: {
        productName: "Trip.Biz Agent ONE",
        productType: "Agent ONE 是 Trip.com Group 商旅品牌 Trip.Biz 的企业差旅 AI 套件。官方产品页把它呈现为由 Planning Agent、Booking Agent、Approval Agent 与 Insight Agent 组成的互联流程，面向差旅员工、旅行管理者和财务角色。它是企业软件与服务系统，不是独立硬件；9 月 18 日发布的产品定位已确认，但具体客户部署范围和实际节省结果仍以公司披露为准。",
        interactionFlow: "员工用一句话描述目的地、日期、偏好和业务约束，系统给出默认符合企业政策的行程选项，并比较成本、价值和路线。用户选择方案后，Booking agent 推进到预订；需要授权的步骤进入 Approval agent，由相应管理者审核；行程完成后，Insight agent 生成支出、节省和优化洞察。产品页强调从搜索到确认预订可在两分钟内完成，但没有公开复杂改签、多人协作、跨境支付、拒批后重规划或异常中断的完整流程。",
        specsOrStack: "已披露的产品面包括 Agent ONE、四个专门 agent、Trip.Biz 的差旅内容资源、企业差旅政策、对话式规划、政策内推荐、横向比较、AI 驱动审批和开支分析。发布材料称四个 agent 互联，产品页称用户可在一次对话中规划并预订整段行程。模型版本、检索架构、供应商覆盖、支付与票务 API、政策 schema、企业 SSO、审计日志、数据驻留、审批 webhook、离线能力和第三方连接器 source not stated。",
        useCases: "员工可以描述一次商务出差，获得符合政策的航班、酒店或行程组合，并在同一流程里完成预订；经理可以看到待审批请求和政策例外；财务可以查看支出可视化、节省识别和项目级报告；旅行管理者可以通过统一入口提高线上预订工具采用率。Trip.Biz 的页面还把偏好理解、路线比较、审批和持续优化作为角色化场景，但没有给出特定航空公司、酒店、国家或客户的逐项支持表。",
        painPointsSolved: "它针对企业差旅中员工在多个平台搜索、政策检查与预订之间反复切换，审批等待，以及财务只能在事后看报表的摩擦。把规划、执行、审批和洞察连起来，可以减少重复填表和跨系统搬运，并让政策约束更早进入选择。它没有证明能解决价格波动、库存过期、复杂改签、政策冲突、供应商佣金偏差、员工隐私、支付失败或国际合规；这些仍需要真实事务测试。",
        userVoice: "本日没有独立用户评测可支持‘90% booking time reduction’或‘two minutes’作为普遍结果。发布会与产品页中的企业数量、速度和 adoption 叙述属于 Trip.Biz 的公司材料；它们说明产品目标，不等同于跨地区、跨供应商的实测。",
        newTech: "技术上的新意不是四个聊天机器人并排出现，而是把企业差旅的角色、政策和事务状态拆成专门 agent，再用同一产品流程连接。Planning 负责候选生成，Booking 负责交易推进，Approval 负责责任转交，Insight 负责事后分析；这种分工为权限和审计提供了更清晰的对象。官方没有公开 agent 间共享上下文、冲突解决、回滚和付款前确认的实现。",
        availability: "Trip.Biz 已在其差旅产品页展示 Agent ONE，并于 2026 年 9 月 18 日在 Transform 2026 发布。页面提供 Request demo / 预约演示入口；是否对所有 Trip.Biz 市场、客户等级、行业和供应商开放，订阅价格、实施周期、API 或管理控制台均 source not stated。产品因此可标记为已确认的企业产品，而不是普通消费者即时可用服务。",
        limitsOrUnknowns: "需要继续核验实时库存、改签和退票、审批拒绝后的自动重规划、跨国税费与支付、员工偏好与企业政策冲突、供应商排序、人工客服接管、审计日志、错误预订撤销以及四个 agent 之间的责任归属。公司宣称的 booking time 和 adoption 改善需要第三方或客户数据验证；不能把宣传数字写成普遍性能。",
        productVerdict: "这是一个把企业差旅从单一搜索框推进到角色化 agent 流程的已确认产品。它的价值在于把员工、审批、财务和政策放在同一事务链里；产品判断：真正的门槛是付款前的责任清晰、异常时的人工接管和拒批/改签后的可恢复性。"
      },
      en: {
        productName: "Trip.Biz Agent ONE",
        productType: "Agent ONE is the enterprise travel AI suite from Trip.com Group's corporate-travel brand, Trip.Biz. The product page presents a connected flow made of Planning Agent, Booking Agent, Approval Agent, and Insight Agent for travellers, travel managers, and finance roles. It is an enterprise software-and-service system, not dedicated hardware. The September 18 launch and product positioning are confirmed; customer coverage and realised savings remain company-reported.",
        interactionFlow: "A traveller describes a destination, dates, preferences, and business constraints in one conversation. The system proposes options that are intended to be in policy by default and compares cost, value, and route. After selection, the Booking agent moves toward confirmation; approval-required steps go to the relevant manager; after the trip, the Insight agent produces spend, savings, and optimisation views. The page says search-to-confirmation can take two minutes, but it does not publish the full flow for complex changes, group travel, cross-border payment, rejected approval, or interrupted work.",
        specsOrStack: "The disclosed surface includes Agent ONE, four specialised agents, Trip.Biz travel content, company policy, conversational planning, policy-aware recommendations, side-by-side comparison, AI-led approvals, and spend analysis. Launch material says the four agents are connected, while the product page says a full trip can be planned and booked in one conversation. Model version, retrieval architecture, supplier coverage, payment and ticketing APIs, policy schema, enterprise SSO, audit log, data residency, approval webhooks, offline behaviour, and third-party connectors are source not stated.",
        useCases: "A traveller can describe a business trip, receive a policy-aware flight, hotel, or itinerary combination, and continue to booking in the same flow. A manager can review pending requests and policy exceptions. Finance can inspect spend visualisation, savings identification, and programme reports. A travel manager can use a single entry point to improve online-booking-tool adoption. Trip.Biz also describes preference understanding, route comparison, approval, and continuous optimisation, but it does not publish a country-by-country, airline-by-airline, or hotel-by-hotel support matrix.",
        painPointsSolved: "The product targets repeated switching between search, policy checking, and booking, approval delays, and finance teams that only see a report after the fact. Connecting planning, execution, approval, and insight can reduce repeated form filling and move policy constraints earlier in the decision. It does not prove that it solves price volatility, stale inventory, complex changes, policy conflicts, supplier-bias incentives, employee privacy, payment failure, or international compliance. Those require transaction-level testing.",
        userVoice: "There is no independent user review in today's sweep that supports the company's ‘90% booking time reduction’ or ‘two minutes’ as a universal result. Enterprise counts, speed claims, and adoption language on the launch and product pages are Trip.Biz materials. They show the intended product outcome, not cross-market, cross-supplier measurement.",
        newTech: "The technical move is not putting four chatbots side by side. It is splitting the roles, policies, and transaction states of corporate travel into specialised agents and connecting them through one product flow. Planning generates candidates, Booking advances a transaction, Approval transfers responsibility, and Insight analyses the result. That separation creates clearer objects for permissions and audit. Trip.Biz does not publish how agents share context, resolve conflicts, roll back, or confirm payment.",
        availability: "Trip.Biz presents Agent ONE on its travel product pages and launched it at Transform 2026 on September 18, 2026. The page exposes a request-demo path. Availability across Trip.Biz markets, customer tiers, industries, and suppliers, as well as subscription price, implementation time, APIs, and an admin console, are source not stated. It is therefore a confirmed enterprise product, not a generally available consumer service.",
        limitsOrUnknowns: "The next checks are live inventory, changes and refunds, replanning after rejected approval, cross-border taxes and payment, conflicts between employee preference and company policy, supplier ranking, human support takeover, audit records, cancellation of wrong bookings, and responsibility across the four agents. The company's booking-time and adoption claims need customer or third-party verification; they should not be presented as general performance.",
        productVerdict: "This is a confirmed product that moves corporate travel from one search box into a role-based agent workflow. Its value is putting traveller, approval, finance, and policy state into one transaction chain. The acceptance gate is clear responsibility before payment, human takeover during exceptions, and recoverability after rejection or change."
      }
    }
  }),
  scan({
    id: "rokid-next-generation-ai-glasses-china-preview",
    section: "china",
    evidenceLabel: "weak/unverified",
    sourceDate: "2026-09-21",
    evidenceStrength: "China pre-launch report; September 24 event is reported, product specifications and availability are not yet published",
    zhHeadline: "Rokid 新一代 AI 眼镜：9 月 24 日发布前，先记录入口不补写规格",
    enHeadline: "Rokid's next AI glasses: record the September 24 entry point, not missing specifications",
    zhFact: "9 月 21 日中国媒体报道，Rokid 将于 9 月 24 日在杭州数贸会发布新一代 AI 眼镜，口号为‘Less tool. More human’。截至本期截稿，型号、显示、相机、重量、价格、发货与 SDK 均未由可核验产品页公开。",
    enFact: "A September 21 China report says Rokid will unveil next-generation AI glasses at the Hangzhou Digital Trade Expo on September 24 under the slogan ‘Less tool. More human.’ At issue close, a verifiable product page has not disclosed model, display, camera, weight, price, shipping, or SDK details.",
    zhHciLens: ["当前入口：发布会预告", "待验证：语音、视觉、显示与代理动作", "证据边界：预发布 scan", "下一步：发布会与正式产品页"],
    enHciLens: ["Current entry: launch announcement", "To verify: voice, vision, display, and agent actions", "Evidence boundary: pre-launch scan", "Next: launch event and product page"],
    zhImplication: "中国 AI 眼镜市场的产品差异会越来越依赖入口和执行边界；在规格未公开前，不能把 slogan 写成能力。需要观察用户如何触发、结果落在哪里、相机与录制如何提示，以及能否从工具调用退回可理解的人工控制。",
    enImplication: "As China's AI-glasses market becomes denser, differentiation will depend on entry points and execution boundaries. Before specifications are published, a slogan is not a capability. Watch how users trigger the system, where results land, how camera and recording state are signalled, and whether tool calls return to understandable human control.",
    visual: rokidVisual,
    sources: [source("Sina / IT之家 pre-launch report", rokidUrl, "china"), source("Rokid official site", rokidOfficialUrl, "official")],
    dossier: {
      zh: {
        productName: "Rokid 新一代 AI 眼镜（预发布 scan）",
        productType: "这是对 Rokid 9 月 24 日发布预告的 source-lane scan，不是已确认上市产品 dossier。中国媒体称新品将在杭州第五届全球数字贸易博览会发布，并引用‘Less tool. More human’口号；截至 9 月 21 日，媒体报道与 Rokid 官网都没有提供可供逐项核验的完整规格和购买入口。",
        interactionFlow: "目前可确认的流程只有‘等待 9 月 24 日发布会’。报道没有说明用户通过语音、触控、相机、显示、手机伴侣还是其他入口触发，也没有展示 agent 是否能执行跨应用动作、结果如何回到视野或手机、怎样暂停录制、怎样拒绝主动提示。以上缺口是本次扫描的重点，不应从口号推导具体交互。",
        specsOrStack: "型号、芯片、显示类型、相机数量、扬声器、麦克风、重量、续航、网络、操作系统、模型、SDK、价格、地区和发货时间均 source not stated。现有报道只确认发布日期和主题口号，没有确认产品是否带显示、是否独立运行、是否需要手机或是否支持开发者接入。",
        useCases: "发布会可能涉及 AI 眼镜常见的问答、翻译、识物、记录、导航或提醒，但本期没有把这些可能性写成事实。当前可报告的具体观看任务是：在 9 月 24 日核对真实入口、显示/音频反馈、相机隐私提示、网络依赖、主动信息和跨设备接管。",
        painPointsSolved: "预告所指向的痛点可能是用户不想操作复杂工具，但没有证据证明新品解决了哪一个具体问题。当前扫描只确认市场正在用‘更像人、少工具’描述交互方向；产品是否减少掏手机、降低学习成本或改善可穿戴接受度，需发布会演示、正式规格和独立评测共同验证。",
        userVoice: "本日没有可靠的上市用户评测。媒体报道是预发布信息，不能替代购买者对佩戴、延迟、隐私和误触的反馈；社区尚未提供足够可核验的实机证据。",
        newTech: "目前没有可确认的新技术披露。若发布会展示显示、端侧推理、空间音频、主动智能或多模态 agent，它们需要分别回到官方页面和实机评测核验；在此之前统一写成 source not stated。",
        availability: "Rokid 报道称新品将在 2026 年 9 月 24 日于杭州数贸会发布。是否当天开放预订、首发地区、价格、发货时间、开发者计划和旧款用户升级路径 source not stated。",
        limitsOrUnknowns: "这是弱确认预发布信号。缺失项包括硬件规格、输入输出、模型与 API、数据处理、录制提示、续航、价格、地区和售后；媒体标题与品牌 slogan 不能支持产品性能判断。",
        productVerdict: "本期只把 Rokid 记为中国 lane 的预发布 scan。值得关注的是它如何把‘少工具’转化为可操作的入口和可退出的 agent 行为；在 9 月 24 日发布会和独立评测前，不给出上市或能力结论。"
      },
      en: {
        productName: "Rokid next-generation AI glasses (pre-launch scan)",
        productType: "This is a source-lane scan of Rokid's September 24 launch notice, not a confirmed shipping-product dossier. A China report says the new glasses will be unveiled at the Hangzhou Digital Trade Expo under the slogan ‘Less tool. More human.’ As of September 21, the report and Rokid's public site do not provide a complete specification sheet or a purchase surface that can be checked item by item.",
        interactionFlow: "The only confirmed flow is waiting for the September 24 launch. The report does not say whether users trigger the product by voice, touch, camera, display, a phone companion, or another entry point. It does not show whether an agent can perform cross-app actions, where results return, how recording is paused, or how proactive prompts are dismissed. Those absences are the scan's subject; the slogan cannot be converted into an interaction claim.",
        specsOrStack: "Model name, chipset, display type, camera count, speakers, microphones, weight, battery, connectivity, operating system, model, SDK, price, territory, and shipping date are source not stated. The available report confirms the event and its theme, not whether the glasses have a display, operate independently, require a phone, or expose developer access.",
        useCases: "The event may cover familiar AI-glasses scenarios such as questions, translation, visual recognition, capture, navigation, or reminders, but this issue does not present those possibilities as facts. The concrete watch task is to check the real entry point, display or audio feedback, camera privacy cue, network dependency, proactive behaviour, and cross-device takeover on September 24.",
        painPointsSolved: "The notice may be addressing the friction of operating too many tools, but it gives no evidence that the new product solves a specific user problem. The scan can confirm only that the market is using ‘more human, fewer tools’ to describe an interaction direction. Whether the glasses reduce phone reach, learning cost, or social friction requires the launch demonstration, an official product page, and independent testing.",
        userVoice: "There is no reliable owner review in today's sweep. A pre-launch report is not a buyer's account of wearability, latency, privacy, or accidental activation, and the community has not supplied enough verifiable hardware evidence.",
        newTech: "No new technology is confirmed yet. If the launch demonstrates a display, on-device inference, spatial audio, proactive intelligence, or a multimodal agent, each claim must be checked against the official page and hands-on testing. Until then, the appropriate value is source not stated.",
        availability: "The report says Rokid will unveil the glasses at the Hangzhou Digital Trade Expo on September 24, 2026. Whether pre-orders open that day, the launch territory, price, shipping, developer programme, and upgrade path for existing users are source not stated.",
        limitsOrUnknowns: "This is a weakly confirmed pre-launch signal. Hardware, input and output, model and API, data handling, recording indicator, battery, price, territory, and support are all missing. A media headline and brand slogan cannot support a product-performance verdict.",
        productVerdict: "This issue records Rokid only as a China-lane pre-launch scan. The important check is how ‘fewer tools’ becomes a controllable entry point and an agent action that can be exited. Until the September 24 event and independent reviews, no shipping or capability conclusion is justified."
      }
    }
  }),
  scan({
    id: "ai-smart-glasses-wearable-intelligence-research-2026-09-17",
    section: "research",
    evidenceLabel: "research signal",
    sourceDate: "2026-09-17",
    evidenceStrength: "arXiv survey signal; research framework, not a product specification or consumer performance claim",
    zhHeadline: "研究 scan：AI 眼镜从相机/显示配件转向第一视角智能平台",
    enHeadline: "Research scan: AI glasses are framed as first-person intelligence platforms",
    zhFact: "9 月 17 日提交的 arXiv 综述把 AI 眼镜组织为第一视角感知、资源受限计算、智能推理、多模态交互与现实应用约束的系统。它是研究框架，不是某个品牌的产品事实。",
    enFact: "An arXiv survey submitted on September 17 frames AI glasses as a system joining egocentric sensing, resource-aware computing, intelligent reasoning, multimodal interaction, and real-world constraints. It is a research framework, not a product fact for any brand.",
    zhHciLens: ["观察：第一视角连续感知", "系统：资源受限推理", "交互：请求、接收、纠正、调节", "证据：研究 signal"],
    enHciLens: ["Observe: continuous egocentric sensing", "System: resource-constrained reasoning", "Interact: request, receive, correct, regulate", "Evidence: research signal"],
    zhImplication: "研究真正提供的是评估框架：眼镜产品不能只展示一次问答，还要说明持续感知、资源分配、纠错和用户调节如何共同工作。",
    enImplication: "The research contribution is an evaluation frame: a glasses product should not be judged by one answer demo, but by how continuous sensing, resource allocation, correction, and user regulation work together.",
    visual: researchVisual,
    sources: [source("arXiv AI Smart Glasses survey", glassesResearchUrl, "research"), source("arXiv first-person intelligence platforms", glassesRelatedUrl, "research")],
    dossier: {
      zh: {
        productName: "AI Smart Glasses for Wearable Intelligence（研究 scan）",
        productType: "这是研究论文 scan，不是可购买产品。论文把智能眼镜从单纯的拍摄或显示设备，重新描述为连接第一视角感知、资源受限计算、推理、多模态交互与现实应用约束的 wearable-intelligence system。",
        interactionFlow: "论文讨论用户如何请求、接收、纠正和调节辅助，但没有给出某个商品的界面、按键、模型或可用性数据。它提供的是评价问题：眼镜在持续活动中如何把感知转成上下文，再把建议送回用户并允许修正。",
        specsOrStack: "论文概念上覆盖 egocentric sensing、resource-aware computing、intelligent reasoning、multimodal interaction 和真实应用约束；具体硬件、模型、芯片、API、延迟、续航与用户规模 source not stated。",
        useCases: "论文讨论医疗、无障碍、情境学习、日常辅助、文化旅游和工业支持等应用方向。它们是研究场景，不是任何品牌已经交付的功能清单。",
        painPointsSolved: "研究试图解决把眼镜研究拆成孤立模块的问题：只测识别、只测显示或只测语音，无法说明持续使用中的系统负担。它没有证明任何产品已经解决隐私、能耗、误识别和社会接受度。",
        userVoice: "没有消费产品用户原声；这是文献框架，不是用户研究结果。",
        newTech: "研究信号是把 sensing、compute、reasoning、interaction 和 application constraints 放进同一系统模型，并把 lifelong memory、proactive intelligence 与 embodied foundation models 列为后续挑战。",
        availability: "论文发表于 arXiv，可公开阅读；没有产品购买、SDK 或商业可用性。",
        limitsOrUnknowns: "论文不是经过产品验证的性能承诺，尚未回答不同眼镜形态的功耗、数据保留、录制提示、失败恢复和社会场景评估。",
        productVerdict: "这是研究 signal，适合作为产品评测框架，不适合作为产品规格或市场预测。"
      },
      en: {
        productName: "AI Smart Glasses for Wearable Intelligence (research scan)",
        productType: "This is a research scan, not a purchasable product. The survey reframes smart glasses from capture or display accessories into a wearable-intelligence system connecting egocentric sensing, resource-aware computing, reasoning, multimodal interaction, and real-world constraints.",
        interactionFlow: "The paper discusses how users request, receive, correct, and regulate assistance, but it gives no product interface, button map, model, or usability result for a commercial device. Its contribution is an evaluation question: during ongoing activity, how does the system turn sensing into context, return assistance, and allow correction?",
        specsOrStack: "The framework covers egocentric sensing, resource-aware computing, intelligent reasoning, multimodal interaction, and real-world application constraints. Hardware, model, chip, API, latency, battery, and user scale are source not stated.",
        useCases: "The survey discusses healthcare, accessibility, situated learning, daily assistance, cultural tourism, and industrial support. These are research application areas, not a feature list already delivered by a brand.",
        painPointsSolved: "The research addresses the problem of evaluating glasses as isolated modules. Measuring recognition, display, or speech separately cannot explain the burden of continuous use. It does not prove that any product has solved privacy, energy, recognition error, or social acceptance.",
        userVoice: "There is no consumer-product user voice here; this is a literature framework rather than a user study result.",
        newTech: "The research signal is a system model that places sensing, compute, reasoning, interaction, and application constraints together, while naming lifelong memory, proactive intelligence, and embodied foundation models as open challenges.",
        availability: "The paper is publicly readable on arXiv. It has no product purchase path, SDK, or commercial availability.",
        limitsOrUnknowns: "A survey is not a product-validated performance promise. It does not answer power draw, data retention, recording cues, failure recovery, or social-situation evaluation across different glasses form factors.",
        productVerdict: "This is a research signal that is useful as a product-evaluation frame, not as a product specification or market forecast."
      }
    }
  })
];

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`missing previous issue ${previousDate}`);
const issue = JSON.parse(JSON.stringify(previous));
issue.date = date;
issue.zhTitle = "AI Daily 2026-09-21：端侧 PC、企业 agent 与 AI 眼镜发布前夜";
issue.enTitle = "AI Daily 2026-09-21: on-device PCs, enterprise agents, and the next glasses launch";
issue.zhSummary = "Horizon Ultra 把端侧 AI 写进企业 PC 的 CPU/GPU/NPU 架构；Trip.Biz Agent ONE 把差旅规划、预订、审批与洞察拆成可追责的 agent 链；Rokid 新眼镜与 AI glasses 研究则把中国预发布和第一视角智能的下一站留在观察区。历史 issue 继续保留完整产品、社区、研究、专利与全球 source lanes。";
issue.enSummary = "Horizon Ultra makes on-device AI part of an enterprise PC's CPU/GPU/NPU architecture. Trip.Biz Agent ONE splits planning, booking, approval, and insight into a more accountable agent chain. Rokid's pre-launch notice and a new AI-glasses survey keep China's next wearable release and first-person intelligence in the watch zone, while the archive retains full product, community, research, patent, and global lanes.";
issue.tags = Array.from(new Set(["Horizon Ultra", "Snapdragon X2 Elite", "on-device AI", "enterprise PC", "Trip.Biz Agent ONE", "business travel", "Rokid", "AI glasses", "first-person intelligence", ...issue.tags])).slice(0, 42);
issue.sourceTypes = Array.from(new Set(["confirmed product", "weak/unverified", "research signal", "official", "china", "global", "enterprise AI", "on-device AI", ...issue.sourceTypes]));
const freshIds = new Set(freshTopics.map((item) => item.id));
issue.topics = [...freshTopics, ...issue.topics.filter((item) => !freshIds.has(item.id))];
issue.coverStory = {
  topicId: freshTopics[0].id,
  zhTitle: "当 agent 住进设备与事务流程，边界必须变成产品",
  enTitle: "When agents move into devices and transactions, the boundary becomes the product",
  zhSummary: ["Horizon Ultra 把本机与云端的执行位置写进企业 PC。", "Trip.Biz Agent ONE 把员工、审批与财务放进同一条差旅事务链。", "Rokid 与研究 scan 提醒我们：眼镜的下一步仍要靠入口、反馈和可退出性验证。"],
  enSummary: ["Horizon Ultra puts local-versus-cloud execution into the enterprise PC.", "Trip.Biz Agent ONE joins traveller, approval, and finance state in one travel transaction.", "Rokid and the research scan remind us that glasses still need validation through entry, feedback, and exit."],
  imagePath: horizonVisual.path,
  imageWidth: horizonVisual.width,
  imageHeight: horizonVisual.height,
  imageSourceUrl: horizonVisual.sourceUrl,
  primarySourceUrl: horizonUrl,
  evidenceStrength: "confirmed product · Qualcomm official / 2026-09-20 purchase window; paired with China pre-launch and research scans",
  whyCover: "The product boundary now appears where local compute, enterprise responsibility, and wearable perception meet."
};
issue.designDesk = {
  zhTitle: "Design Desk：把执行位置与责任链画出来",
  enTitle: "Design Desk: draw the execution location and responsibility chain",
  zhIntro: "今天的新增产品把端侧计算、企业事务和可穿戴入口放到同一张图上。用户需要看到任务在哪里执行、谁批准下一步、结果如何回到工作流，以及设备或 agent 失败后怎样接管。",
  enIntro: "Today's additions put endpoint compute, enterprise transactions, and wearable entry points on one map. Users need to see where a task runs, who approves the next step, how the result returns to the workflow, and how to take over after device or agent failure.",
  zhItems: [
    { label: "执行地点可见", body: "本机、云端、企业连接器与物理设备要在任务状态中分开显示。" },
    { label: "责任角色分开", body: "员工、审批人、财务和 agent 不能共享一个无主的完成状态。" },
    { label: "策略先于动作", body: "端侧/云端路由、差旅政策、相机录制与主动提示都应在动作前可解释。" },
    { label: "结果回到原任务", body: "摘要、预订、导出与眼镜提示不能漂浮在另一个聊天窗口。" },
    { label: "错误可以接管", body: "拒批、断网、错误识别、库存变化和模型失败都要保留人工入口。" },
    { label: "证据等级分层", body: "正式产品、开发者面、评测摩擦、预发布和研究 signal 不共用一个徽章。" }
  ],
  enItems: [
    { label: "Show execution location", body: "Local, cloud, enterprise connectors, and physical devices need distinct task states." },
    { label: "Separate responsibility", body: "Traveller, approver, finance, and agent cannot share one ownerless completion state." },
    { label: "Explain policy before action", body: "Local/cloud routing, travel policy, camera capture, and proactive prompts should be legible before execution." },
    { label: "Return results to the task", body: "Summaries, bookings, exports, and glasses prompts cannot float in a second invisible chat." },
    { label: "Keep human takeover", body: "Rejection, disconnection, recognition error, inventory change, and model failure need a human entry point." },
    { label: "Layer evidence", body: "Shipping products, developer surfaces, review friction, pre-launch signals, and research should not share one badge." }
  ]
};
issue.watchlistZh = Array.from(new Set([
  "Horizon Ultra：企业采购后的真实 SKU、价格、端云路由、功耗、Windows 管理策略与 HUMAIN OS 迁移。",
  "Trip.Biz Agent ONE：四个 agent 的权限、供应商排序、付款前确认、拒批/改签恢复和客户实测。",
  "Rokid 新一代 AI 眼镜：9 月 24 日发布会的显示、相机、重量、价格、SDK、隐私提示与发货。",
  "AI glasses research：第一视角连续感知、lifelong memory、主动智能、能耗和社会场景评估。",
  ...issue.watchlistZh
])).slice(0, 20);
issue.watchlistEn = Array.from(new Set([
  "Horizon Ultra: post-purchase SKUs, price, local/cloud routing, power, Windows management, and HUMAIN OS migration.",
  "Trip.Biz Agent ONE: permissions across four agents, supplier ranking, payment confirmation, rejected-approval and change recovery, and customer measurement.",
  "Rokid next AI glasses: September 24 display, cameras, weight, price, SDK, privacy cues, and shipping.",
  "AI-glasses research: continuous egocentric sensing, lifelong memory, proactive intelligence, energy, and social-situation evaluation.",
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

await fs.rm(deckDir, { recursive: true, force: true });
await fs.cp(previousDeck, deckDir, { recursive: true, filter: (sourcePath) => !sourcePath.includes(`${path.sep}dist${path.sep}`) && !sourcePath.endsWith(`${path.sep}dist`) });
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });
const labels = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "用户原声", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "User voice", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const dossierText = (locale, item) => fields.map((field, i) => `**${labels[locale][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="./public/${horizonVisual.path}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(freshTopics[0])}`,
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
