import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const surveyRoot = "/Users/hmi/Documents/Survey";
const date = "2026-09-18";
const previousDate = "2026-09-17";
const dataPath = path.join(root, "data", "issues.json");
const issueDir = path.join(root, date);
const deckDir = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${date}`);
const previousDeck = path.join(surveyRoot, "output", "slidev", `ai-product-morning-brief-${previousDate}`);
const source = (label, url, type) => ({ label, url, type });
const visual = (file, kind, altZh, altEn, captionZh, captionEn, sourceUrl, width = 1600, height = 900) => ({ path: `assets/${file}`, width, height, kind, altZh, altEn, captionZh, captionEn, sourceUrl });
const product = (input) => ({ dossierKind: "product", ...input });

const openaiUrl = "https://openai.com/index/reimagining-advertising-with-ai/";
const openaiResearchUrl = "https://arxiv.org/abs/2608.05008";
const snapUrl = "https://investor.snap.com/news/news-details/2026/SPECS-Make-Computing-More-Human-with-New-Experiences-Partnerships-and-SPECS-Intelligence/default.aspx";
const snapReviewUrl = "https://www.tomsguide.com/computing/smart-glasses/snap-specs-hands-on-review";
const snapWiredUrl = "https://www.wired.com/story/what-snap-expensive-specs-can-actually-do/";
const huaweiUrl = "https://www.huawei.com/en/news/2026/9/hc-wang-keynote";
const peeriumUrl = "https://www.huawei.com/en/news/2026/9/new-computing-architecture-peerium";
const huaweiApUrl = "https://apnews.com/article/26ab418df1339c518483918218ff57e";

const openaiVisual = visual("openai-sponsored-agents-research-2026-09.png", "source-backed research page screenshot", "ChatGPT Ads 研究论文页面截图", "ChatGPT Ads research paper page screenshot", "研究视觉：论文记录早期 ChatGPT 广告如何与模型回答分离；Sponsored Agents 的产品测试仍以 OpenAI 官方说明为准。", "Research visual: the paper records how early ChatGPT ads were separated from model answers; Sponsored Agents remain grounded in OpenAI's official test description.", openaiResearchUrl);
const snapVisual = visual("snap-specs-review-2026-09.png", "source-backed review screenshot", "Snap SPECS 独立上手评测截图", "Independent hands-on review of Snap SPECS", "评测视觉：Tom's Guide 上手页记录 SPECS 的独立 AR 形态、自然交互与外观争议。", "Review visual: Tom's Guide records SPECS's standalone AR form, natural interaction, and polarising design.", snapReviewUrl);
const atlasVisual = visual("huawei-atlas-960e-2026-09.png", "source-backed page screenshot", "华为 Atlas 960E SuperPoD 官方公告截图", "Huawei Atlas 960E SuperPoD official announcement screenshot", "华为官方公告：Atlas 960E SuperPoD、NPO、UnifiedBus 与端侧 AI 计算路线。", "Huawei official announcement: Atlas 960E SuperPoD, NPO, UnifiedBus, and the on-device AI compute roadmap.", huaweiUrl);
const peeriumVisual = visual("huawei-peerium-2026-09.png", "source-backed page screenshot", "华为 Peerium Computing Architecture 官方公告截图", "Huawei Peerium Computing Architecture official announcement screenshot", "华为官方公告：Peerium 用 Nested BSP、统一内存寻址与 peer interconnect 把百万处理器组织为一台计算机。", "Huawei official announcement: Peerium uses Nested BSP, unified memory addressing, and peer interconnect to organise a million processors as one computer.", peeriumUrl);

const freshTopics = [];
/* Fresh topics are assembled after loading the previous issue so today's
   replacements can keep product dossiers complete without duplicating IDs. */
/*
  product({
    id: "openai-sponsored-agents-chatgpt-ads", section: "official", evidenceLabel: "confirmed product", sourceDate: "2026-09-16",
    evidenceStrength: "OpenAI official product announcement; Sponsored Agents are explicitly a test with select U.S. advertisers",
    zhHeadline: "OpenAI Sponsored Agents：广告点击后，用户进入一条被标记的商家 agent 对话",
    enHeadline: "OpenAI Sponsored Agents turn an ad click into a labelled business-agent conversation",
    zhFact: "OpenAI 9 月 16 日宣布在美国与部分广告主测试 Sponsored Agents：用户看到相关广告后，可选择进入清晰标记的商家 agent 对话，追问产品是否合适，再跳转到商家网站。该对话与 ChatGPT 的独立回答以及用户原始对话分开。与此同时，广告主可以在 ChatGPT Work 里用自然语言创建、更新、分析广告，并接入 HubSpot 与 Shopify。",
    enFact: "On September 16, OpenAI announced a U.S. test of Sponsored Agents with select advertisers. After seeing a relevant ad, a user can choose a clearly labelled conversation with a business-sponsored agent, ask follow-up questions about fit, and follow a link to the business site. The conversation is separate from ChatGPT's independent answers and from the user's original conversation. Advertisers can also create, update, and analyse campaigns in ChatGPT Work and connect ChatGPT Ads to HubSpot and Shopify.",
    zhValue: "它改变的是广告后的下一步：广告不再只负责把人送到落地页，而是把‘我想知道它适不适合我’变成一条可继续追问的 agent 流程。产品的信任边界也因此前置到入口文案、标签、上下文隔离和跳转前的商家身份。",
    enValue: "The change is in what happens after an ad. The ad no longer only sends a person to a landing page; it can turn ‘is this right for me?’ into a follow-up agent flow. That moves the trust boundary into the entry copy, label, context separation, and business identity before the click out.",
    zhHciLens: ["进入：相关广告 → 选择开始 Sponsored Agent", "委托：解释产品适配度、回答追问", "过程：独立商家上下文与原 ChatGPT 对话分开", "退出：跳转商家网站或结束对话"],
    enHciLens: ["Entry: relevant ad → choose Sponsored Agent", "Delegation: explain product fit and answer follow-up questions", "Process: separate business context from the original ChatGPT thread", "Exit: visit the business site or end the conversation"],
    zhImplication: "AI 广告的核心交互不再只是推荐排序，而是把商业意图嵌入对话。必须让用户一眼看出 agent 代表谁、使用哪一份上下文、回答是否是独立的 ChatGPT 判断，并提供离开和不继续的低成本路径。",
    enImplication: "The core interaction of AI advertising is no longer only ranking. Commercial intent enters the conversation itself. The UI must make it obvious who the agent represents, which context it uses, whether an answer is ChatGPT's independent judgement, and how to leave without friction.",
    visual: openaiVisual,
    sources: [source("OpenAI Sponsored Agents announcement", openaiUrl, "official"), source("The Beginning of ChatGPT Ads", openaiResearchUrl, "research"), source("Reddit discussion of Sponsored Agents", "https://www.reddit.com/r/ChatGPT/comments/1wit0ex/chatgpt_is_testing_sponsored_agents_that_let_you/", "community")],
    dossier: { zh: {
      productName: "OpenAI Sponsored Agents / ChatGPT Ads",
      productType: "这是 ChatGPT Ads 的新交互层，不是一个独立消费者 app。OpenAI 在美国选择部分广告主测试 Sponsored Agents：用户从一个明确标记的相关广告进入商家 agent，对产品或服务继续提问，然后在准备好时访问商家网站。对企业侧，它还把广告创建、更新、分析和 AI 文案/图片建议放进 ChatGPT Work 的 Ads Manager，并先接入 HubSpot、Shopify。当前证据是官方产品公告和测试状态，不能写成全面开放的广告能力。",
      interactionFlow: "用户先在 ChatGPT 中看到一个相关广告；如果愿意深入，可以选择开启一个清晰标记的 Sponsored Agent。用户描述自己的需求、预算、空间、人数或其他适配条件，商家 agent 在自己的上下文中回答追问。对话与 ChatGPT 的独立答案以及用户原始对话分开，之后用户可点击商家网站继续。广告主则可以用自然语言从网站或 brief 创建 campaign，查看效果并获得下一步建议，再在加入 campaign 前审核和编辑生成的文案与图片。官方没有公开用户如何比较多个 Sponsored Agent、如何举报误导、如何查看商家使用的数据字段，或如何撤回已分享的信息。",
      specsOrStack: "已披露的产品面包括 ChatGPT Ads、Sponsored Agents、ChatGPT Work、Ads Manager、HubSpot 集成、Shopify App 与 Shopify Catalog。OpenAI 还披露 AI 可根据 landing page 和 campaign objective 建议文案和图片，并可选开启 text customization 来适配对话上下文、翻译广告文案。具体模型版本、agent API、商家知识库同步、检索范围、排序机制、计费、转化归因、数据留存、广告审核接口、地域合规和第三方 CRM 权限 schema source not stated。",
      useCases: "消费者可以在看到餐桌、课程、软件或其他商品广告后，直接问尺寸是否适合、能坐几个人、如何维护、是否符合自己的条件，再决定是否去官网。商家可以把网站和 brief 转成 campaign，用自然语言修改投放，并在 HubSpot 里连接 CRM 上下文、在 Shopify 里从商品目录管理广告。官方描述了产品探索与 campaign management，但没有给出真实转化率、客服替代率、错误回答率或复杂售后流程。",
      painPointsSolved: "它针对两个具体摩擦：用户从广告落地页来回查找产品信息，和广告主在多个工具之间写 brief、建 campaign、看数据、跟进 lead。Sponsored Agent 用连续追问减少重复搜索；Ads Manager、HubSpot、Shopify 则减少手工复制和上下文切换。它没有证明能解决商业利益冲突、商家知识过期、推荐偏置、虚假承诺、退款售后、个人数据授权或用户把广告 agent 误认成 ChatGPT 独立建议的问题。",
      userVoice: "本日没有足够的真实用户长时使用样本。Reddit 讨论主要复述官方‘清晰标记、与独立回答分开’的设计，不能证明用户是否理解隔离、是否信任商家 agent，也不能证明广告对话的购买价值。",
      newTech: "新技术点不是一个新模型，而是把商业赞助身份、对话式导购、原 ChatGPT 上下文隔离和广告管理工具组合成一个 AI-native advertising surface。研究论文对早期 ChatGPT Ads 的观察显示，广告曾与模型回答清晰分隔；Sponsored Agents 把用户从广告带入另一条可行动的对话，因此标签、权限和上下文边界变成产品机制，而不是页脚免责声明。",
      availability: "Sponsored Agents 目前由 OpenAI 与美国部分广告主测试。ChatGPT Ads 在 HubSpot 的连接从公告当天开始，Shopify 美国商家可在 Shopify App Store 使用 ChatGPT Ads app，国际市场计划从 9 月 23 日起在 ChatGPT Ads 可用地区开放。普通用户是否能遇到测试广告、商家 agent 的准入标准、价格、地区、行业限制和完整管理 API source not stated。",
      limitsOrUnknowns: "需要继续核验：广告标签在不同屏幕尺寸上的可见性、商家 agent 与 ChatGPT 记忆/历史的隔离、用户输入是否会回传给商家、代理回答的证据与责任、商家能否诱导用户透露敏感信息、跳转前是否存在购买或授权确认、错误推荐的申诉和撤销、广告排序是否影响独立回答。研究样本与社区讨论都不能代替正式安全、隐私和转化评估。",
      productVerdict: "这是一个已确认但仍在小范围测试的产品交互。它最重要的变化是把商业关系直接放进对话流，最关键的验收点则是标签和上下文隔离是否真的被用户理解。若隔离只存在于产品说明而不出现在即时界面里，Sponsored Agent 会把广告信任问题从落地页搬到聊天框。"
    }, en: {
      productName: "OpenAI Sponsored Agents / ChatGPT Ads",
      productType: "This is a new interaction layer for ChatGPT Ads, not a separate consumer app. OpenAI is testing Sponsored Agents with selected advertisers in the United States. After seeing a relevant ad, a user can enter a clearly labelled business-agent conversation, ask about a product or service, and visit the advertiser's site when ready. On the business side, ChatGPT Work's Ads Manager adds natural-language campaign creation, updates, analysis, and AI copy or image suggestions, with HubSpot and Shopify as initial integrations. The evidence is an official announcement and an explicit test state; it is not a broadly available advertising capability.",
      interactionFlow: "A user first sees a relevant ad in ChatGPT. If they want to go deeper, they choose to start a clearly labelled Sponsored Agent. They can describe needs, budget, space, party size, or other fit criteria, and the business agent answers in its own context. OpenAI says the conversation is separate from ChatGPT's independent answers and from the original conversation. The user can then click to the business website. An advertiser can also turn a website or brief into a campaign with natural-language prompts, inspect performance, receive next-step recommendations, and review or edit generated copy and imagery before adding them to a campaign. OpenAI does not publish how users compare multiple Sponsored Agents, report misleading answers, inspect the data fields a business can use, or revoke information already shared.",
      specsOrStack: "The disclosed surface includes ChatGPT Ads, Sponsored Agents, ChatGPT Work, Ads Manager, a HubSpot integration, the Shopify app, and Shopify Catalog. OpenAI says AI can suggest copy and imagery from a landing page and campaign objective, and an optional text-customisation feature can adapt copy to conversation context and translate it into a user's preferred language. Model version, agent API, advertiser knowledge sync, retrieval scope, ranking, billing, conversion attribution, retention, ad-review interface, geography controls, and third-party CRM permission schema are source not stated.",
      useCases: "A consumer can see an ad for a table, course, software product, or another service and ask whether its dimensions fit, how many people it seats, how to maintain it, or whether it meets a personal requirement before visiting the site. A business can turn a site or brief into a campaign, edit it conversationally, connect CRM context through HubSpot, or manage products from Shopify Catalog. OpenAI describes product exploration and campaign management, but gives no conversion rate, support-deflection rate, answer-error rate, or complex-after-sales evidence.",
      painPointsSolved: "The concrete friction is duplicated searching after an ad and the manual movement between brief, campaign builder, analytics, and lead follow-up. A Sponsored Agent can reduce repeated product lookup through follow-up questions; Ads Manager, HubSpot, and Shopify reduce copying between tools. Nothing here proves that the product solves conflicts of interest, stale merchant knowledge, recommendation bias, false promises, refunds, personal-data consent, or the risk that a user mistakes a commercial answer for ChatGPT's independent judgement.",
      userVoice: "There is not yet enough real-world, long-run user evidence. The Reddit discussion mostly repeats OpenAI's claims that the agent is clearly labelled and separate from independent answers. It cannot establish whether people understand the separation, trust the business agent, or gain meaningful shopping value from the flow.",
      newTech: "The novelty is not a new model. It is the combination of sponsorship identity, conversational shopping, context separation from the original ChatGPT thread, and campaign-management tools in an AI-native advertising surface. Research on early ChatGPT Ads observed a clear separation between ads and model answers. Sponsored Agents move the user from an ad into a more actionable conversation, so labels, permissions, and context boundaries become product mechanics rather than a footer disclaimer.",
      availability: "Sponsored Agents are being tested with selected U.S. advertisers. The HubSpot connection begins with the announcement, while U.S.-based Shopify merchants can use the ChatGPT Ads app in the Shopify App Store; OpenAI says international availability is planned from September 23 in markets where ChatGPT Ads are available. Whether ordinary users will see the test, advertiser admission rules, price, geography, industry restrictions, and a complete management API are source not stated.",
      limitsOrUnknowns: "The next checks are label visibility at different viewport sizes, separation between business context and ChatGPT memory or history, whether user input is sent back to the advertiser, evidence and liability for answers, protection against eliciting sensitive information, confirmation before a commercial handoff, appeal and undo for wrong recommendations, and whether ad ranking can influence independent answers. Research samples and community discussion cannot replace formal safety, privacy, and conversion evaluation.",
      productVerdict: "This is a confirmed interaction that remains in limited testing. Its main change is putting a commercial relationship directly inside the conversation. Its acceptance test is whether users actually understand the label and context separation. If the boundary exists only in product copy and not in the moment of interaction, Sponsored Agents move the ad-trust problem from a landing page into the chat box."
    }}
  }),
  product({
    id: "snap-specs-standalone-ar-2026-09-17", section: "global", evidenceLabel: "confirmed product", sourceDate: "2026-09-17",
    evidenceStrength: "Snap product announcement plus independent hands-on reviews; early access and in-person trials are regionally bounded",
    zhHeadline: "Snap SPECS：把 AI、显示、手势和蜂窝连接装进一副独立 AR 眼镜",
    enHeadline: "Snap SPECS puts AI, display, hand tracking, and cellular connectivity into standalone AR glasses",
    zhFact: "Snap 9 月 16 日公布 SPECS 的新体验与 SPECS Intelligence：眼镜无需 puck 或 tether，计算硬件直接集成在镜架内，支持手势和语音自然交互、把信息放到视野中，并提供浏览器、翻译、导航、运动训练、共享体验等方向。美国 18 岁以上用户可从 iOS 预览 SPECS Intelligence，10 月 1 日起可在洛杉矶 Westfield Century City 线下体验；独立评测指出外形有争议，但 AR 交互和显示能力已可上手。",
    enFact: "On September 16, Snap described new SPECS experiences and SPECS Intelligence. The glasses have no puck or tether, with computing hardware integrated into the frame. They use hand and voice interaction, put information into the field of view, and support a browser, translation, navigation, sports training, and shared experiences. In the U.S., people aged 18 and over can try the SPECS Intelligence preview on iOS; in-person trials begin October 1 at Westfield Century City in Los Angeles. Independent hands-on reviews report a polarising form factor but a convincing AR interaction model.",
    zhValue: "SPECS 的产品边界比手机伴侣眼镜更激进：它把处理、通信、扬声器、显示和交互都放到镜架，用户不必先掏手机或挂一个 puck。价值不在‘随时聊天’，而在翻译、导航、视频、运动提示和共享空间这些需要抬头、双手被占用的短任务。",
    enValue: "SPECS pushes beyond phone-companion glasses: processing, communications, speakers, display, and interaction live in the frame, so the user does not first reach for a phone or carry a puck. The value is not constant chat; it is short tasks such as translation, navigation, video, sports cues, and shared spatial experiences when eyes-up and hands-free interaction matters.",
    zhHciLens: ["进入：戴上眼镜，语音或手势唤起信息", "委托：询问、翻译、导航或打开空间 Lens", "过程：显示、扬声器与手势反馈同步", "接管：用户用手势/语音退出、切换或停止"],
    enHciLens: ["Entry: put on the glasses and invoke with voice or hand input", "Delegation: ask, translate, navigate, or open a spatial Lens", "Process: display, speakers, and hand feedback work together", "Takeover: exit, switch, or stop with voice or gesture"],
    zhImplication: "显示眼镜的核心问题是把‘看到了什么、AI 正在做什么、摄像头/连接是否在工作’变成周围人和佩戴者都能理解的状态。自然交互降低了进入成本，也提高了误触、社会接受和电池耗尽时的失败成本。",
    enImplication: "The core problem for display glasses is making ‘what is visible, what the AI is doing, and whether cameras or connectivity are active’ legible to both wearer and bystanders. Natural interaction lowers entry cost while increasing the cost of false activation, social discomfort, and battery failure.",
    visual: snapVisual,
    sources: [source("Snap SPECS product announcement", snapUrl, "official"), source("Tom's Guide SPECS hands-on review", snapReviewUrl, "reviews"), source("WIRED SPECS hands-on report", snapWiredUrl, "reviews"), source("Community discussion of SPECS launch", "https://www.reddit.com/r/augmentedreality/comments/1wdv1en/with_specs_launch_next_week_how_will_spatial_content_actually_work_across_all_these_glassesdevices/", "community")],
    dossier: { zh: {
      productName: "Snap SPECS / SPECS Intelligence",
      productType: "这是 Snap 的独立 AR 眼镜产品与跨设备 AI 服务组合。SPECS 把计算硬件直接放进镜架，不需要 puck 或有线 tether；SPECS Intelligence 则面向 iPhone、Mac 和 SPECS，试图理解用户的目标、优先级、关系与日常，并在合适时机主动浮出信息和动作。它与只做音频问答的相机眼镜不同，产品重心是显示、空间 Lens、手势和眼睛抬起状态下的短任务。",
      interactionFlow: "用户戴上眼镜，在现实环境中用语音或手势调用功能。系统可以把 AI 帮助、网页、视频、翻译文字、导航信息、运动提示或共享 Lens 放进视野；SPECS 浏览器可以把内容呈现为远处约 115 英寸的虚拟屏幕，官方还列出 Spotify、NBA/WNBA 训练体验和多人共享体验。SPECS Intelligence 先以美国 iOS 预览开放，Mac 的完整体验通过 waitlist 邀请，眼镜的现场体验从 10 月 1 日在洛杉矶指定地点开始。官方没有公开完整的唤醒词、手势冲突、通知优先级、录制提示、多人共享授权、失败回退或退出确认流程。",
      specsOrStack: "官方确认的系统栈包括独立 AR 眼镜镜架、内置计算硬件、显示、扬声器、手势与语音交互、AI-native OS、SPECS Intelligence、SPECS app、iPhone/Mac 连接、浏览器、Lens 生态与 SPECS Charging Case with Cellular。官方材料和早期评测讨论了 115 英寸虚拟屏幕、约 51 度视场角、16M 色彩、约 4 小时混合使用等信息，但本 issue 对未在当前官方页面完整展开的参数保持谨慎；SoC、RAM、存储、摄像头数量、精确分辨率、重量、IP 等级、SDK、API、价格与完整电池规格 source not stated。",
      useCases: "可复现的产品方向包括在眼前浏览视频、听 Spotify、把对话翻译成扬声器和显示文字、导航、在 NBA/WNBA 场景中获得训练提示、做足球或高尔夫训练，以及与另一位 SPECS 用户共享空间体验。它还面向工作、购物、学习、沟通和健身。评测中的短时上手显示自然交互和 AR 叠加是亮点；长时间佩戴、复杂环境手势、公开场合的社交使用和连续任务稳定性仍未充分验证。",
      painPointsSolved: "SPECS 试图减少掏手机、切换屏幕、在运动或行走时停下查看信息，以及在多人场景里共享同一视觉内容的成本。独立处理和蜂窝充电盒也试图降低对手机和固定 Wi-Fi 的依赖。它没有自动解决镜架体积、热量、续航、眩光、处方适配、显示隐私、旁观者理解、手势误识别、蜂窝成本和用户是否愿意在公共空间长期佩戴的问题。",
      userVoice: "Tom's Guide 认为外形非常两极化，但自然计算体验有突破感；WIRED 的上手报道强调翻译文字和音频在现实对话中的可用性，同时将其与相机眼镜的隐私争议区分开。Reddit 讨论仍集中在价格、显示参数、电池和摄像头能否关闭，且样本偏向早期用户，不能代表大众接受度。",
      newTech: "新技术组合在于把完整 AR 显示、独立计算、手势追踪、语音、蜂窝连接和 anticipatory AI 放到眼镜形态，而不是把眼镜当作手机的被动显示器。SPECS Intelligence 试图从连接的 app 和工具理解长期目标，再把相关信息提前放到物理世界。它的突破是把‘主动浮现’与空间显示结合，风险则是用户更难预测下一条信息何时出现、来自哪个应用、是否影响注意力。",
      availability: "美国 18 岁以上用户可在 9 月 16 日起通过 SPECS iOS app 体验 SPECS Intelligence preview，Mac 完整体验开放邀请制 waitlist；官方宣布 10 月 1 日起洛杉矶 Westfield Century City 可线下试戴。正式消费者购买、首发地区、价格、发货、开发者资格和售后支持在本次官方公告中没有完整展开，不能把线下试戴写成已全球上市。",
      limitsOrUnknowns: "需要独立验证：连续使用电池、显示亮度与遮挡、佩戴重量与热量、手势在复杂背景中的识别、语音在街道噪声中的表现、相机和录制状态灯、旁观者提示、眼前内容的隐私、蜂窝充电盒成本、数据是否端侧处理、SPECS Intelligence 是否主动打扰、异常时如何回到手机，以及 Lens Store/SDK 的审核和权限模型。",
      productVerdict: "SPECS 已从发布日概念进入可上手的 confirmed product，最强证据是独立 AR 形态和自然交互已经被记者体验。它的下一关不是再堆功能，而是证明显示、手势、隐私和续航能否在公共空间形成可接受的日常闭环。"
    }, en: {
      productName: "Snap SPECS / SPECS Intelligence",
      productType: "This is a standalone AR-glasses product paired with a cross-device AI service. SPECS puts computing hardware directly in the frame, without a puck or wired tether. SPECS Intelligence works across iPhone, Mac, and SPECS and is designed to understand goals, priorities, relationships, and routines, then surface useful information or actions at the right moment. Unlike audio-first camera glasses, the product is centred on display, spatial Lenses, hand interaction, and short tasks while the wearer keeps their head up.",
      interactionFlow: "The wearer puts on the glasses and invokes features with voice or hand input in the physical environment. AI assistance, web content, video, translated text, navigation, sports cues, or shared Lenses can appear in view. The SPECS browser can present content as a virtual screen described as roughly a 115-inch cinema screen at a distance, while Snap also lists Spotify, NBA/WNBA training, and shared experiences. SPECS Intelligence begins as an iOS preview in the U.S.; the fuller Mac experience uses an invitation waitlist, and in-person glasses trials begin October 1 at a Los Angeles location. Snap does not publish a complete wake-word flow, gesture-conflict model, notification priority, recording cue, shared-session consent, failure recovery, or exit confirmation.",
      specsOrStack: "The disclosed stack includes standalone AR-glasses hardware, integrated computing, a display, speakers, hand and voice interaction, an AI-native operating system, SPECS Intelligence, the SPECS app, iPhone and Mac connectivity, a browser, the Lens ecosystem, and a cellular SPECS Charging Case. Official material and early reviews discuss a 115-inch virtual display, an approximately 51-degree field of view, 16 million colours, and about four hours of mixed use, but this issue keeps caution around figures not fully expanded in the current official page. SoC, RAM, storage, camera count, exact resolution, weight, ingress rating, SDK, API, price, and complete battery specification are source not stated.",
      useCases: "Concrete product directions include watching video in view, listening through Spotify, translating a conversation through speakers and on-display text, navigating, receiving NBA/WNBA training cues, practising football or golf, and sharing a spatial experience with another SPECS user. Snap also positions the device for work, shopping, learning, communication, and fitness. Short hands-on sessions identify natural interaction and AR overlays as strengths; long-duration wear, gesture performance in complex environments, public social use, and continuous-task stability remain unverified.",
      painPointsSolved: "SPECS targets the cost of reaching for a phone, switching screens, stopping during movement to inspect information, and sharing a visual experience with another person. Standalone compute and a cellular charging case also reduce dependence on a phone and fixed Wi-Fi. They do not automatically solve frame bulk, heat, battery, glare, prescription fit, display privacy, bystander understanding, gesture false positives, cellular cost, or whether people want to wear the device in public for long periods.",
      userVoice: "Tom's Guide calls the form factor highly polarising but describes the natural-computing experience as a genuine breakthrough. WIRED highlights translated text and audio in a real conversation while distinguishing the product from the privacy controversy around camera glasses. Reddit discussion remains focused on price, display figures, battery, and whether cameras can be disabled. These samples skew early-adopter and do not represent mass acceptance.",
      newTech: "The technical combination is full AR display, standalone compute, hand tracking, voice, cellular connectivity, and anticipatory AI in a glasses form rather than glasses as a passive phone display. SPECS Intelligence tries to infer longer-term goals from connected apps and tools and bring relevant information into the physical world ahead of an explicit prompt. The novelty is pairing proactive surfacing with spatial display; the risk is that users cannot predict when an item will appear, which app supplied it, or how much attention it will claim.",
      availability: "In the U.S., people aged 18 and over can try the SPECS Intelligence iOS preview from September 16. The full Mac experience has an invitation-only waitlist, and Snap says in-person trials begin October 1 at Westfield Century City in Los Angeles. The official announcement does not fully establish consumer purchase, launch territories, price, shipping, developer eligibility, or support terms; an in-person trial is not global availability.",
      limitsOrUnknowns: "Independent checks still need to cover continuous battery life, display brightness and occlusion, weight and heat, gesture recognition in clutter, voice performance in street noise, camera and recording indicators, bystander notice, privacy of content in view, cellular-case cost, edge processing, proactive interruption, handoff back to the phone, and Lens Store or SDK review and permission models.",
      productVerdict: "SPECS has moved from a launch-day concept to a confirmed product with hands-on evidence for standalone AR form and natural interaction. Its next gate is not more features; it is proving that display, gesture, privacy, and battery form an acceptable everyday loop in public spaces."
    }}
  }),
  product({
    id: "huawei-atlas-960e-peerium-superpod-2026-09-17", section: "china", evidenceLabel: "confirmed product", sourceDate: "2026-09-17",
    evidenceStrength: "Huawei official HUAWEI CONNECT 2026 announcements with AP coverage; infrastructure product, not a consumer device",
    zhHeadline: "华为 Atlas 960E / Peerium：把 agent 时代的算力底座做成一台可扩展的系统",
    enHeadline: "Huawei Atlas 960E and Peerium turn agentic-scale compute into a system product",
    zhFact: "华为在 9 月 17 日 HUAWEI CONNECT 2026 公布 Atlas 960E SuperPoD、Peerium Computing Architecture、UnifiedBus、OceanStor M900 与 Hi-ONE。官方称 Atlas 960E 采用 NPO，可扩展至 4,096 个 NPU、8 EFLOPS FP8、最高 1PB HBM；Peerium 以 Nested BSP、统一内存寻址和 peer interconnect 支持百万处理器级扩展。",
    enFact: "At HUAWEI CONNECT 2026 on September 17, Huawei announced the Atlas 960E SuperPoD, Peerium Computing Architecture, UnifiedBus, OceanStor M900, and Hi-ONE. Huawei says the Atlas 960E uses near-packaged optics and scales to 4,096 NPUs, 8 EFLOPS of FP8 compute, and up to 1 PB of HBM. Peerium uses Nested BSP, unified memory addressing, and peer interconnect to scale toward a million processors.",
    zhValue: "它不是终端产品，但会直接改变 agent 产品能否稳定运行的上限：长任务、推理吞吐、统一内存和故障恢复不再只由模型决定，而由计算、互联、存储和管理是否被当成一个系统决定。",
    enValue: "This is not an end-user device, but it changes the ceiling for agent products: long tasks, inference throughput, unified memory, and fault recovery depend not only on the model but on whether compute, interconnect, storage, and management are designed as one system.",
    zhHciLens: ["进入：企业/云平台提交训练或推理任务", "委托：调度模型、数据、存储和 NPU 资源", "过程：SuperPoD 统一内存与互联承担长任务", "接管：运维观察、限流、迁移或暂停"],
    enHciLens: ["Entry: an enterprise or cloud submits a training or inference job", "Delegation: schedule models, data, storage, and NPU resources", "Process: SuperPoD unified memory and interconnect carry long tasks", "Takeover: operators observe, throttle, migrate, or pause"],
    zhImplication: "基础设施公告也应被当作产品界面问题来读：如果 agent 要连续工作数小时，用户需要看到任务进度、资源边界、故障域、重试语义和成本，而不是只看到模型回答。",
    enImplication: "Infrastructure announcements are also product-interface evidence: if an agent runs for hours, users need task progress, resource boundaries, failure domains, retry semantics, and cost visibility rather than only a model answer.",
    visual: atlasVisual,
    sources: [source("Huawei HUAWEI CONNECT keynote", huaweiUrl, "official"), source("Huawei Peerium Computing Architecture", peeriumUrl, "official"), source("AP Huawei chip and Atlas 960 report", huaweiApUrl, "global")],
    dossier: { zh: {
      productName: "Huawei Atlas 960E SuperPoD + Peerium Computing Architecture",
      productType: "这是面向训练和推理基础设施的系统级产品组合，不是单一芯片或消费设备。Atlas 960E SuperPoD 通过 NPO、Hi-ONE、UnifiedBus 和 Ascend 处理器，把大量 NPU、内存、存储、网络与管理组织成一个高密度计算系统；Peerium 是 Huawei 同日公布的计算架构，用 Nested BSP、统一内存寻址和 peer interconnect 让百万级处理器更像一台计算机。",
      interactionFlow: "企业或云平台先提交训练、推理或 agent 长任务，调度层再把模型、数据、内存、存储和 NPU 资源放到 SuperPoD/SuperCluster。Peerium 的统一内存和 peer interconnect 目标是减少传统 master-slave 架构下的通信边界，让一个任务跨更多处理器运行。对用户而言，真正的流程会出现在云控制台：提交任务、查看状态、处理失败、迁移或暂停。官方公告没有给出最终租户 UI、任务队列、权限审批、跨集群迁移、回滚、成本计量或 agent 级可观察性设计。",
      specsOrStack: "华为官方披露 Atlas 960E SuperPoD 为行业首个采用 NPO 的 SuperPoD，单个系统可扩展到 4,096 个 NPU、8 EFLOPS FP8 和最高 1PB HBM；通过 5,500 个 Hi-ONE 单元，官方称可以减少传统连接方案所需的 48,000 个 800G 光模块，并降低超过 550kW 功耗。系统还涉及 Ascend 960、UnifiedBus、OceanStor M900、CANN、PyTorch accelerator backend 与超过 90 个开源项目。实际芯片配置、持续吞吐、模型支持、租户隔离、SLA、价格、交付地区和独立 benchmark source not stated。",
      useCases: "公开用例是大型模型训练、推理和能够连续运行数小时的 agent 任务。华为把 Atlas 950/960 SuperPoD、SuperCluster 与 on-device AI、AI phone、AI PC、车辆和家庭平台放进同一个基础设施叙事，表明上层产品可以通过 device-cloud synergy 使用不同算力形态。AP 报道也把 Atlas 960 描述为中国 AI 计算基础设施竞争的一部分。当前没有独立客户部署数据、真实 token throughput 或具体 agent workflow 可复现。",
      painPointsSolved: "产品瞄准的是大模型和长任务扩展时的通信开销、内存不统一、光互联功耗、故障域和系统管理复杂度。把 CPU、NPU、HBM、SSD、NIC、switch 和管理通过统一总线组织，有望减少开发者为不同节点重新切分数据和调度逻辑的工作。它没有证明解决模型质量、数据血缘、推理成本透明度、跨组织权限、应用级重试、错误结果审计或供应链限制，这些仍在基础设施之外。",
      userVoice: "本日没有终端用户评测；AP 提供独立新闻报道，但不是 Atlas 960E 的性能测评。客户数量、真实上线时长、运维摩擦、开发者迁移成本和不同模型上的稳定性均 source not stated。",
      newTech: "技术新意在于把近封装光学、统一总线、统一内存寻址、Nested BSP 和 peer interconnect 放在同一个系统叙事中。Peerium 试图跨越传统 master-slave 模型，让处理器、存储和网络形成 peer 关系；Atlas 960E 则把这种架构落到 SuperPoD 产品。对 agent 产品而言，这种系统级协同可以支持更长的上下文和持续运行，但它也把故障恢复、资源抢占和观测责任推向平台层。",
      availability: "华为在 HUAWEI CONNECT 2026 官方宣布并展示这些系统，Atlas 960 系统部分能力仍处于测试/路线阶段；Ascend 960DT 计划 2027 年第一季度可用，Ascend 960PR 计划 2027 年第三季度可用。Atlas 960E 的具体购买方式、客户交付、地区、配置价格、维护合同、开发者申请和云服务入口 source not stated。",
      limitsOrUnknowns: "需要核验：NPO 在真实负载下的可靠性、热设计、故障隔离、统一内存的编程模型、PyTorch/CANN 迁移成本、模型并行效率、租户安全、网络分区、任务恢复、成本/能耗计量、供应链与出口限制。官方给出的 EFLOPS、HBM、光模块和可用性数字是厂商声明，不能替代独立 benchmark 或客户部署证据。",
      productVerdict: "这是一个证据明确的基础设施产品信号，价值在于把 agent 时代的‘长时间持续执行’变成计算系统的目标。它对 HCI 的直接影响不是新按钮，而是运维与应用界面必须暴露进度、资源、失败和成本；否则再大的 SuperPoD 也只会把不可见的等待和错误扩大。"
    }, en: {
      productName: "Huawei Atlas 960E SuperPoD + Peerium Computing Architecture",
      productType: "This is a system-level infrastructure product family for training and inference, not a single chip or consumer device. The Atlas 960E SuperPoD combines NPO, Hi-ONE, UnifiedBus, and Ascend processors to organise NPUs, memory, storage, networking, and management into a dense computing system. Peerium, announced by Huawei on the same day, uses Nested BSP, unified memory addressing, and peer interconnect to make million-scale processors behave more like one computer.",
      interactionFlow: "An enterprise or cloud platform submits a training, inference, or long-running agent job. A scheduler places the model, data, memory, storage, and NPU resources across a SuperPoD or SuperCluster. Peerium's unified memory and peer interconnect aim to reduce the communication boundaries created by a traditional master-slave architecture, allowing one job to span more processors. For a user, the visible workflow will live in a cloud console: submit, inspect state, handle failure, migrate, or pause. Huawei does not publish the final tenant UI, queue model, permission approval, cross-cluster migration, rollback, cost metering, or agent-level observability design.",
      specsOrStack: "Huawei says the Atlas 960E is the industry's first NPO-based SuperPoD. One system can scale to 4,096 NPUs, 8 EFLOPS of FP8 compute, and up to 1 PB of HBM. With 5,500 Hi-ONE units, Huawei says it can avoid the 48,000 800G optical modules traditionally needed to connect the NPUs and cut power consumption by more than 550 kW. The wider stack includes Ascend 960, UnifiedBus, OceanStor M900, CANN, an official PyTorch accelerator backend, and more than 90 open-source projects. Exact chip configuration, sustained throughput, model matrix, tenant isolation, SLA, pricing, delivery territory, and independent benchmarks are source not stated.",
      useCases: "The public use cases are large-model training, inference, and agents that can run continuously for hours. Huawei places Atlas 950/960 SuperPoDs and SuperClusters alongside on-device AI platforms for phones, PCs, vehicles, and homes, implying a device-cloud synergy across different compute forms. AP frames Atlas 960 as part of China's infrastructure competition in AI compute. There is no independent customer deployment data, reproducible token throughput, or concrete agent workflow in today's evidence.",
      painPointsSolved: "The product targets communication overhead, non-unified memory, optical-interconnect power, failure domains, and system-management complexity when models and long tasks scale. Connecting CPUs, NPUs, HBM, SSDs, NICs, switches, and management through a unified bus could reduce the amount of per-node data partitioning and scheduling logic developers must rebuild. It does not prove a solution to model quality, data lineage, transparent inference cost, cross-organisation permission, application-level retry, wrong-result audit, or supply-chain constraints.",
      userVoice: "There is no end-user review today. AP provides independent reporting but not a performance test of Atlas 960E. Customer count, live duration, operational friction, developer migration cost, and stability across model families are source not stated.",
      newTech: "The technical move is to put near-packaged optics, unified bus, unified memory addressing, Nested BSP, and peer interconnect into one system story. Peerium attempts to move beyond a master-slave model so compute, storage, and networking become peers; Atlas 960E turns that direction into a SuperPoD product. For agent products, the co-design could support longer contexts and continuous execution, but it also pushes recovery, resource preemption, and observability into the platform layer.",
      availability: "Huawei announced and demonstrated the systems at HUAWEI CONNECT 2026. Parts of the Atlas 960 roadmap remain in testing or are future products; Ascend 960DT is planned for Q1 2027 and Ascend 960PR for Q3 2027. How to purchase Atlas 960E, customer delivery, regions, configuration pricing, service contracts, developer access, and cloud entry are source not stated.",
      limitsOrUnknowns: "The next checks are NPO reliability under real load, thermal design, fault isolation, the programming model for unified memory, PyTorch/CANN migration cost, model-parallel efficiency, tenant security, network partitioning, job recovery, cost and energy accounting, supply chain, and export restrictions. EFLOPS, HBM, optical-module, and availability figures remain vendor claims until independent benchmarks or customer deployments appear.",
      productVerdict: "This is a clearly evidenced infrastructure product signal. Its value is making continuous, long-running agent execution a target for the compute system itself. The direct HCI consequence is not a new button; operations and application surfaces must expose progress, resources, failure, and cost. Otherwise a larger SuperPoD only scales invisible waiting and invisible errors."
    }}
  }),
  product({
    id: "huawei-peerium-unifiedbus-agent-os-foundation", section: "official", evidenceLabel: "developer surface", sourceDate: "2026-09-17",
    evidenceStrength: "Huawei official architecture and ecosystem announcement; developer and OS implications remain roadmap-level",
    zhHeadline: "从 UnifiedBus 到 HarmonyOS Agent OS：华为把系统 agent 的边界推向设备群",
    enHeadline: "From UnifiedBus to HarmonyOS Agent OS, Huawei pushes system agents across device clusters",
    zhFact: "同一场 HUAWEI CONNECT 主题演讲中，华为将 Ascend、Pangu、HarmonyOS 和 Celia 放进端云协同路线：未来的 Agent OS 要从系统架构、运行方式和交互逻辑重做，覆盖 AI 手机、AI PC、车辆与家庭，并通过跨设备和 device-cloud compute synergy 提供连续服务。",
    enFact: "In the same HUAWEI CONNECT keynote, Huawei placed Ascend, Pangu, HarmonyOS, and Celia inside a device-cloud roadmap. It says Agent OS will be redefined across system architecture, operation, and interaction logic for AI phones, PCs, vehicles, and homes, with cross-device and device-cloud compute synergy providing continuous services.",
    zhValue: "这是一条 developer surface 和 OS 路线，而非已经完成的消费功能。它把 agent 的上下文、执行位置和状态从单设备扩展到设备群，意味着用户未来交接的不是文件，而是一个跨手机、电脑、车和家持续存在的任务。",
    enValue: "This is a developer surface and OS direction, not a finished consumer feature. It expands agent context, execution location, and state from one device to a device cluster, implying that users may hand off a persistent task across phone, PC, car, and home rather than move files manually.",
    zhHciLens: ["进入：任一 HarmonyOS 设备上的目标输入", "委托：Agent OS 分配上下文和执行设备", "过程：状态在设备群与云之间流动", "接管：用户查看、暂停或改写下一步"],
    enHciLens: ["Entry: a goal entered on any HarmonyOS device", "Delegation: Agent OS assigns context and execution device", "Process: state moves across devices and cloud", "Takeover: the user inspects, pauses, or rewrites the next step"],
    zhImplication: "跨设备 agent 的难点是连续状态的可见性：用户要知道任务现在在哪台设备运行、用了哪些权限、下一步会改变什么，以及断网或换设备后怎样恢复。",
    enImplication: "The hard part of a cross-device agent is state legibility: users need to know where a task is running, which permissions it used, what it will change next, and how it recovers after disconnection or handoff.",
    visual: peeriumVisual,
    sources: [source("Huawei HUAWEI CONNECT keynote", huaweiUrl, "official"), source("Huawei Peerium architecture announcement", peeriumUrl, "official"), source("Huawei HUAWEI CONNECT China event page", "https://www.huawei.com/cn/events/huaweiconnect/", "china")],
    dossier: { zh: {
      productName: "Huawei Agent OS / cross-device intelligence roadmap",
      productType: "这是华为在 HUAWEI CONNECT 2026 公布的系统 agent 与设备群路线，当前应标记为 developer surface，而不是已完成的消费产品。官方把 HarmonyOS 描述为面向 ubiquitous intelligence 的 Agent OS，并将 Kirin、Ascend、Pangu、第三方模型、Celia 以及 AI 手机、AI PC、车辆和家庭平台连接起来。",
      interactionFlow: "路线图设想用户在手机、电脑、车或家中的任一设备提出目标，Agent OS 读取授权的个人上下文，再决定在哪个设备或云端执行。任务可能从手机开始，在 PC 上处理文件，在车内继续提供服务，最后回到家庭设备或手机。用户应该能看到当前任务身份、执行设备、权限、模型来源和待审动作，但华为的公开材料没有给出具体 consumer UI、跨设备迁移手势、暂停/回滚、断网恢复、通知优先级或多用户隔离流程。",
      specsOrStack: "已披露的相关堆栈包括 HarmonyOS、Kirin 与 Ascend 芯片、Pangu 模型、第三方模型、Celia 系统 agent、UnifiedBus、device-cloud compute synergy，以及面向 AI phone、AI PC、vehicles、homes 的四类端侧计算平台。开发者如何注册 capability、调用跨端 API、处理身份与权限、获取设备状态、选择模型或执行离线 fallback source not stated。",
      useCases: "官方场景是让同一智能服务跨个人移动、办公、车辆与家庭空间连续工作。潜在工作流包括在手机上提出目标、在 PC 上生成或修改文件、在车内继续获取导航和提醒、回家后让设备完成后续控制；这些是平台方向，不是今天可复现的完整产品流程。",
      painPointsSolved: "它瞄准跨设备复制上下文、重复登录、在不同 app 重新解释目标，以及设备能力割裂的问题。设备群可以让 agent 把计算放到更合适的终端，端云协同也可能降低单设备热量和延迟压力。它尚未解决多设备同时响应、状态冲突、权限继承、家庭成员边界、跨域数据留存、错误操作回滚和用户如何关闭系统 agent。",
      userVoice: "没有找到针对这条 Agent OS 路线的独立用户评测。公开材料是厂商 keynote 与活动页，能证明路线和 developer surface 被宣布，不能证明普通用户已经获得统一跨设备体验。",
      newTech: "技术新意是把 OS 重新定义为人和 agent 的协作层，让模型、芯片、设备、云和交互逻辑共同承担连续服务。与单个 app 内的 agent 相比，系统 agent 需要持有更高权限，并在设备间转移任务；因此身份、授权、状态同步和撤销应被视为核心系统 API，而不是后来补的设置项。",
      availability: "华为在 2026 年 9 月 17 日主题演讲中宣布这条方向，并将 HUAWEI CONNECT 2026 定位为产品、行业方案和开发者工具发布场。完整 Agent OS 版本、SDK、设备覆盖、开放地区、开发者准入、发布时间和商业模式 source not stated。",
      limitsOrUnknowns: "需要继续观察：任务是否有唯一 ID、跨端状态是否可读、权限是否继承或重新确认、模型输出是否能解释、离线模式如何降级、设备断电如何恢复、车与家的高风险动作如何确认、家庭多用户如何隔离、第三方模型如何接入，以及用户是否可以一键暂停所有 agent。",
      productVerdict: "这是有官方出处的 developer surface 和系统路线，价值在于把跨设备 agent 的问题提前暴露出来。当前不能把它当作已交付功能；对设计团队最有用的产物是先定义任务身份、权限、执行设备和接管语义，再等待具体 SDK 和产品落地。"
    }, en: {
      productName: "Huawei Agent OS / cross-device intelligence roadmap",
      productType: "This is a system-agent and device-cluster roadmap announced at HUAWEI CONNECT 2026. It should currently be labelled a developer surface rather than a finished consumer product. Huawei describes HarmonyOS as an Agent OS for ubiquitous intelligence and connects Kirin, Ascend, Pangu, third-party models, Celia, AI phones, AI PCs, vehicles, and homes.",
      interactionFlow: "The roadmap imagines a user entering a goal on any phone, PC, car, or home device. Agent OS reads authorised personal context and decides where to execute, locally or in the cloud. A task might start on the phone, process files on the PC, continue with service in the car, and return to the home or phone. A usable system would expose task identity, execution device, permissions, model source, and pending actions. Huawei's public material does not show a consumer UI, cross-device handoff gesture, pause or rollback semantics, offline recovery, notification priority, or multi-user isolation flow.",
      specsOrStack: "The disclosed stack includes HarmonyOS, Kirin and Ascend chips, Pangu and third-party models, the Celia system agent, UnifiedBus, device-cloud compute synergy, and four on-device compute platforms for AI phones, PCs, vehicles, and homes. How developers register capabilities, call cross-device APIs, handle identity and permission, read device state, select models, or provide offline fallback is source not stated.",
      useCases: "Huawei's public scenario is one intelligent service continuing across personal mobility, office, vehicle, and home. A potential workflow would start with a goal on the phone, create or edit a file on the PC, continue with navigation or reminders in the car, and complete a home action later. These are platform directions, not a complete reproducible product flow available today.",
      painPointsSolved: "The direction targets copying context between devices, repeated sign-in, re-explaining a goal in different apps, and fragmented device capabilities. A device cluster could place work on a more suitable endpoint, while device-cloud synergy could reduce heat and latency pressure on one device. It does not yet solve simultaneous-device responses, state conflicts, permission inheritance, family boundaries, cross-domain retention, rollback, or how a user disables the system agent.",
      userVoice: "No independent user review was found for this Agent OS direction. The evidence is a vendor keynote and event page. It establishes an announced roadmap and developer surface, not a unified cross-device experience in ordinary users' hands.",
      newTech: "The technical move is to redefine the OS as a collaboration layer between people and agents, with models, chips, devices, cloud, and interaction logic jointly providing continuity. Compared with an agent inside one app, a system agent holds greater permission and moves tasks across devices. Identity, authorisation, state synchronisation, and revocation therefore need to be first-class system APIs rather than settings added later.",
      availability: "Huawei announced the direction in its September 17 keynote and positioned HUAWEI CONNECT 2026 as a venue for products, industry solutions, and developer tools. The full Agent OS version, SDK, device coverage, territories, developer access, timing, and commercial model are source not stated.",
      limitsOrUnknowns: "Watch for a stable task ID, readable cross-device state, permission inheritance or reconfirmation, explainable model output, offline degradation, recovery after power loss, confirmation for high-risk vehicle and home actions, multi-user isolation, third-party model onboarding, and a one-step pause for all agents.",
      productVerdict: "This is an officially sourced developer surface and system direction. Its value is exposing cross-device agent problems early. It should not be presented as shipped functionality; the useful design work now is defining task identity, permissions, execution device, and takeover semantics before a concrete SDK arrives."
    }}
  })
];
*/

const issues = JSON.parse(await fs.readFile(dataPath, "utf8"));
const previous = issues.find((item) => item.date === previousDate);
if (!previous) throw new Error(`Missing previous issue ${previousDate}`);
const issue = structuredClone(previous);
const previousTopic = (id) => {
  const found = previous.topics.find((item) => item.id === id);
  if (!found) throw new Error(`Missing previous topic ${id}`);
  return structuredClone(found);
};
const huaweiCloud = previousTopic("huawei-peerium-unifiedbus-agent-os-foundation");
huaweiCloud.id = "huawei-cloud-agentic-infra-hardware-zone-2026-09-18";
huaweiCloud.section = "china";
huaweiCloud.evidenceLabel = "confirmed product";
huaweiCloud.sourceDate = "2026-09-18";
huaweiCloud.evidenceStrength = "Huawei Cloud official announcement at HUAWEI CONNECT 2026; company-stated deployment and performance figures remain company claims";
huaweiCloud.zhHeadline = "华为云 Agentic Cloud：把长任务记忆、模型调用和 AI 硬件生态接成企业产品链";
huaweiCloud.enHeadline = "Huawei Cloud Agentic Cloud links long-horizon memory, model access, and an AI-hardware ecosystem";
huaweiCloud.zhFact = "华为云 9 月 18 日宣布最新 AI Cluster Service 全球发布，并把 Agentic Infra、Context Memory Storage、Agentic MaaS、AgentArts、openJiuwen 与 Industry AI Foundry 组织成一条企业 agent 产品链。官方新设 AI Hardware Zone，已接入 15 个核心伙伴，覆盖 20 多种设备类型、10 多个场景模板和 110 多项场景技能。";
huaweiCloud.enFact = "On September 18, Huawei Cloud announced the global launch of its latest AI Cluster Service and presented Agentic Infra, Context Memory Storage, Agentic MaaS, AgentArts, openJiuwen, and the Industry AI Foundry as one enterprise-agent product chain. It also launched an AI Hardware Zone with 15 core partners, more than 20 device types, over 10 scenario templates, and more than 110 scenario skills.";
huaweiCloud.zhValue = "这条产品线把企业 agent 从‘调用模型’推进到可恢复的计算服务、长期记忆、MCP 工具、行业知识和设备执行。对终端用户，任务可能从云端模型进入 WPS、AI 眼镜或录音卡；因此真正的新界面是任务身份、数据来源、执行设备和失败恢复点。";
huaweiCloud.enValue = "The product line moves enterprise agents beyond calling a model into a recoverable service with long-term memory, MCP tools, industry knowledge, and device execution. A task may move from a cloud model into WPS, AI glasses, or a recording card, so the real new interface is task identity, data provenance, execution device, and the recovery point after failure.";
huaweiCloud.zhHciLens = ["进入：业务问题、行业模板或设备场景", "委托：选择模型、工具、记忆和执行设备", "过程：MCP / 行业资产 / 云端计算协同并可恢复", "退出：交付结果、回写业务系统或转交人工"];
huaweiCloud.enHciLens = ["Entry: business question, industry template, or device scenario", "Delegation: choose models, tools, memory, and execution device", "Process: MCP, industry assets, and cloud compute cooperate with recovery", "Exit: deliver a result, write back to a business system, or hand off to a human"];
huaweiCloud.zhImplication = "企业 agent 的体验验收要让用户看到：使用了什么模型和记忆、数据来自哪里、动作在哪台设备执行、失败后从哪一步恢复。AI Hardware Zone 降低设备接入成本，也放大了端云权限、隐私和动作确认问题。";
huaweiCloud.enImplication = "Enterprise-agent acceptance tests should expose which model and memory were used, where data came from, which device executed an action, and where recovery resumes. The AI Hardware Zone may lower integration cost, but it also magnifies cloud-device permission, privacy, and action-confirmation problems.";
huaweiCloud.visual = {
  path: "assets/huawei-cloud-agentic-infra-2026-09.png",
  width: 1600,
  height: 1000,
  kind: "source-backed official page screenshot",
  altZh: "华为云 Agentic Cloud 官方公告截图",
  altEn: "Huawei Cloud Agentic Cloud official announcement screenshot",
  captionZh: "官方视觉：AICS、Agentic MaaS、AgentArts 与 AI Hardware Zone 的产品链。",
  captionEn: "Official visual: the product chain spanning AICS, Agentic MaaS, AgentArts, and the AI Hardware Zone.",
  sourceUrl: "https://www.huawei.com/en/news/2026/9/hc-agentic-infra-industry-ai"
};
huaweiCloud.sources = [
  source("Huawei Cloud Agentic Cloud announcement", "https://www.huawei.com/en/news/2026/9/hc-agentic-infra-industry-ai", "official"),
  source("Huawei Cloud HUAWEI CONNECT 2026", "https://www.huawei.com/en/events/huaweiconnect", "official"),
  source("TechCrunch on Huawei's AI chip roadmap", "https://techcrunch.com/2026/09/17/huawei-plans-q1-2027-launch-of-new-ai-chip-as-it-takes-on-nvidia/", "reviews")
];
huaweiCloud.dossier = { zh: {
  productName: "Huawei Cloud Agentic Cloud / Agentic Infra / AI Hardware Zone",
  productType: "这是企业级云基础设施、agent 平台与行业生态的组合，不是单一消费者 app。官方把 AI Cluster Service（AICS）、Context Memory Storage（CMS）、Agentic Model as a Service（MaaS）、AgentArts 商业平台、openJiuwen 开源版和 Industry AI Foundry 放在同一条 Agentic Cloud 产品链里；AI Hardware Zone 则把 AI 眼镜、AI 玩具、AI 录音卡等设备类型连接到场景技能。官方称 AgentArts 已服务 100 多家企业、Agentic Infra 已服务 3,500 多家客户，这些数字仍是公司披露。",
  interactionFlow: "企业团队从业务问题、行业模板或设备场景开始，选择模型和工具，通过 Agentic MaaS 一键调用不同供应商模型，再用 AgentArts 或 openJiuwen 组织 agent、MCP 资产、企业知识和业务系统。长任务可用 CMS 保存上下文，AICS 提供训练与推理基础设施，Industry AI Foundry 把场景、模型、数据、知识和 agent 组合成可复用资产；若触及 AI Hardware Zone，结果还可能进入眼镜、玩具或录音卡。统一的跨设备任务页面、设备接管和权限重确认流程 source not stated。",
  specsOrStack: "官方披露 AICS 采用五级快速恢复和全链路可观测性，支持超过 40 天稳定训练，并宣称可在 10 分钟内恢复故障；相较上一代 token throughput 提升 20%。CMS 提供 petabyte-scale memory space 与 terabyte-scale 高速读取，官方称性能比行业同类高 50%。MaaS 支持一键调用多家领先模型且无需部署；AgentArts / openJiuwen 暴露超过 5,000 个通用 MCP 资产和超过 1,000 个行业 MCP 资产。GPU / NPU 型号、SLA、计费、数据驻留、CMS API、权限 schema、设备 SDK 和端云分工 source not stated。",
  useCases: "它覆盖政府办公、公共服务、城市治理、制造、金融、医疗、科学和具身智能等行业。华为称金山办公把 AgentArts 与 WPS 365 Document Center、WPS Comate 深度集成，构建面向金融和政府的办公 agent；AI Hardware Zone 覆盖 20 多种设备类型。终端用户的理想流程是提出问题、看到有来源的回答，再让 agent 在获批的系统或设备上执行。真实用户完成时长、错误率、设备延迟和跨端连续任务样本 source not stated。",
  painPointsSolved: "它针对长任务上下文丢失、模型与算力供应商切换成本高、行业知识与 MCP 工具难复用、设备接入停留在演示四个痛点。CMS、AICS 和 MaaS 分别处理记忆、稳定计算和模型接入；AgentArts、openJiuwen 与 Industry AI Foundry 试图把行业资产变成可管理的复用单元。它没有证明能解决错误授权、工具副作用、租户隔离、供应商锁定、端侧隐私和人工接管。",
  userVoice: "本日没有足够的独立终端用户长期使用样本。客户案例和发布会演示能证明方向与合作关系，不能证明不同业务都获得相同效果。TechCrunch 提供了华为 AI 芯片路线的外部行业背景，但没有替代 AICS、CMS 或 AgentArts 的独立性能评测。",
  newTech: "新技术组合集中在 agent 基础设施的可恢复性和可复用性：CMS 处理长时上下文，统一调度和缓存提高 token 效率，五级恢复与可观测性让服务可以运维，MaaS、MCP 资产和 Industry Foundry 则把模型接到业务与设备。AI Hardware Zone 的关键是把设备类型、场景模板和技能当成可编排资源，而不是只展示更多硬件。",
  availability: "AICS 已宣布全球发布，商业时间为中国市场 9 月 30 日、海外市场 11 月 30 日；AgentArts 在中国以外市场的商业可用时间为 12 月 30 日。openJiuwen 社区、行业伙伴和设备伙伴已被列出，但注册、价格、模型、地区限制、个人开发者资格与 AI Hardware Zone 的 SDK / 采购路径 source not stated。",
  limitsOrUnknowns: "需要核验 AICS 的硬件型号、P99 延迟、真实恢复日志、CMS 读写与删除 API、MaaS 输出一致性、MCP 权限审计、AgentArts 租户隔离，以及设备如何显示录音、视觉输入和动作确认。公司自报客户数和性能提升不能等同于用户价值；当 agent 从云端进入眼镜或录音卡时，谁拥有上下文、谁承担错误动作责任、用户能否一键暂停，都仍未知。",
  productVerdict: "这是已确认的企业产品与生态发布，价值在于把 agent 记忆、算力、模型、工具和设备连接成可部署系统。关键验收点不是设备数量，而是每个跨端任务能否拥有稳定的身份、权限和恢复点。若这些状态只存在后台，Agentic Cloud 会扩大系统复杂度，却不会自动带来更可信的用户体验。"
}, en: {
  productName: "Huawei Cloud Agentic Cloud / Agentic Infra / AI Hardware Zone",
  productType: "This is a combination of enterprise cloud infrastructure, agent platforms, and an industry ecosystem rather than one consumer app. Huawei presents AI Cluster Service, Context Memory Storage, Agentic Model as a Service, AgentArts, openJiuwen, and the Industry AI Foundry as one Agentic Cloud chain. The AI Hardware Zone connects device types such as AI glasses, AI toys, and AI recording cards to scenario skills. Huawei says AgentArts serves more than 100 enterprises and Agentic Infra more than 3,500 customers; those remain company-reported figures.",
  interactionFlow: "An enterprise team starts from a business question, an industry template, or a device scenario. It chooses models and tools, invokes providers through Agentic MaaS, and uses AgentArts or openJiuwen to organise agents, MCP assets, enterprise knowledge, and business systems. CMS stores long-task context; AICS supplies training and inference infrastructure; the Industry AI Foundry combines scenarios, models, data, knowledge, and agents into reusable assets. If the work touches the AI Hardware Zone, a result may enter glasses, toys, or a recording card. A unified cross-device task page, device takeover, and permission reconfirmation flow are source not stated.",
  specsOrStack: "Huawei discloses a five-level recovery mechanism and full-chain observability for AICS, more than 40 days of stable training, a recovery target within 10 minutes, and a claimed 20% token-throughput improvement over the previous generation. CMS provides petabyte-scale memory and terabyte-scale high-speed reads claimed to be 50% faster than peers. MaaS invokes leading models with one click and no deployment. AgentArts and openJiuwen expose more than 5,000 general MCP assets and more than 1,000 industry assets. GPU or NPU models, SLA, billing, data residency, CMS APIs, permission schema, device SDKs, and the cloud-device split are source not stated.",
  useCases: "The platform targets government office work, public services, city governance, manufacturing, finance, healthcare, science, and embodied AI. Huawei says Kingsoft Office integrated AgentArts with WPS 365 Document Center and WPS Comate to build office agents for finance and government. The AI Hardware Zone covers more than 20 device types. The intended user flow is a sourced answer followed by an approved action in a system or device. Real completion time, error rate, device latency, and continuous cross-device task evidence are source not stated.",
  painPointsSolved: "It targets lost long-horizon context, expensive switching between model and compute providers, poor reuse of industry knowledge and MCP tools, and device integrations that remain demos. CMS, AICS, and MaaS address memory, reliable compute, and model access. AgentArts, openJiuwen, and the Industry Foundry try to make industry assets reusable and manageable. There is no evidence yet that the stack solves bad authorisation, tool side effects, tenant isolation, vendor lock-in, device privacy, or human takeover.",
  userVoice: "There is not enough independent long-run end-user evidence today. Customer cases and keynote demos establish direction and partnerships, not equal outcomes across different businesses. TechCrunch adds external context on Huawei's AI-chip roadmap, but it is not an independent evaluation of AICS, CMS, or AgentArts.",
  newTech: "The novelty is a package for recoverability and reuse in agent infrastructure: CMS for long-lived context, scheduling and cache optimisation for token efficiency, recovery and observability for service operations, and MaaS, MCP assets, and the Industry Foundry for connecting models to business and devices. The AI Hardware Zone treats device types, scenario templates, and skills as orchestratable resources rather than merely listing more hardware.",
  availability: "AICS is announced as globally launched, with commercial availability stated for China on September 30 and markets outside China on November 30. AgentArts is scheduled outside China for December 30. Huawei has named openJiuwen, industry partners, and device partners, but registration, price, model catalogue, geography, individual-developer eligibility, and the AI Hardware Zone SDK or procurement path are source not stated.",
  limitsOrUnknowns: "The next checks are AICS hardware, P99 latency, real recovery logs, CMS read/write and deletion APIs, MaaS output consistency, MCP permission audits, AgentArts tenant isolation, and how devices show recording, visual input, and action confirmation. Company customer counts and performance claims are not user value. When an agent moves from cloud into glasses or a recording card, ownership of context, liability for wrong actions, and one-step pause remain unknown.",
  productVerdict: "This is a confirmed enterprise product and ecosystem announcement. Its value is connecting agent memory, compute, models, tools, and devices into a deployable system. The acceptance test is not the number of device types; it is whether every cross-device task has a stable identity, permission state, and recovery point. If those states remain backstage, Agentic Cloud expands system complexity without automatically producing a more trustworthy experience."
}};
huaweiCloud.visual.kind = "source-backed official page screenshot";
const snapFollowup = previousTopic("snap-specs-standalone-ar-2026-09-17");
snapFollowup.id = "snap-specs-standalone-ar-2026-09-17";
snapFollowup.evidenceLabel = "review/community friction";
snapFollowup.sourceDate = "2026-09-17";
snapFollowup.evidenceStrength = "independent hands-on review plus Snap official launch page; review observations remain review/community friction";
snapFollowup.zhHeadline = "Snap SPECS 上手复核：手掌 UI 真的可用，但主动智能仍待长时验证";
snapFollowup.enHeadline = "Snap SPECS follow-up: the palm UI works, but anticipatory intelligence still needs time";
snapFollowup.zhFact = "9 月 17 日 Tom's Guide 上手评测记录了 SPECS 的手掌快速设置、无 puck 独立运行、约 4 小时主动 AR、约 2,195 美元起价、明显的波导色差和公开佩戴时的外形争议；评测还认为物体追踪和 Specs Intelligence 响应已经可用。Snap 官方补充说明 SPECS Intelligence 会跨 iPhone、Mac 和眼镜运行，从用户连接的 app 与工具理解目标、关系和日常。";
snapFollowup.enFact = "A September 17 Tom's Guide hands-on records SPECS's palm quick settings, standalone operation without a puck, roughly four hours of active AR, a starting price around $2,195, visible waveguide colour fringing, and public discomfort with the bold form. The reviewer also finds object tracking and Specs Intelligence responsive enough to use. Snap says SPECS Intelligence works across iPhone, Mac, and the glasses, learning goals, relationships, and routines from connected apps and tools.";
snapFollowup.zhValue = "新证据把 SPECS 从发布日说明推进到可体验的交互系统：手掌成为控制面，眼镜自己承担计算、显示、传感和散热，主动智能试图把个人上下文带到现实环境。产品风险也因此更具体：波导对现实视野的影响、价格与重量、公共空间接受度，以及用户是否知道为什么某条信息此刻出现。";
snapFollowup.enValue = "The evidence moves SPECS from a launch description to an interaction system that can be experienced. The palm becomes a control surface; the glasses carry compute, display, sensing, and thermal management; and anticipatory intelligence tries to bring personal context into the physical world. The risks become concrete: waveguide effects on real vision, price and weight, public acceptance, and whether users understand why information appears now.";
snapFollowup.sources = [source("Tom's Guide SPECS hands-on", "https://www.tomsguide.com/computing/smart-glasses/snap-specs-hands-on-review", "reviews"), source("Tom's Guide SPECS design interview", "https://www.tomsguide.com/computing/smart-glasses/exclusive-snap-ceo-evan-spiegel-says-specs-look-bold-on-purpose", "reviews"), source("Snap SPECS official launch", "https://newsroom.snap.com/making-computing-more-human-with-specs", "official")];
const agentsApi = previousTopic("openai-agents-api-codex-harness");
agentsApi.id = "openai-agents-api-codex-harness";
agentsApi.sourceDate = "2026-09-10";
agentsApi.evidenceStrength = "OpenAI official developer announcement; public beta availability is explicitly stated";
agentsApi.zhHeadline = "OpenAI Agents API：把 Codex 的沙箱、上下文压缩和长任务 harness 变成开发者入口";
agentsApi.enHeadline = "OpenAI Agents API turns Codex sandboxes, context compaction, and long-task harnesses into a developer surface";
agentsApi.zhFact = "OpenAI 9 月 10 日宣布 Agents API public beta，向开发者提供由 OpenAI 管理的 sandbox、文件和 secret storage、可配置 CPU/GPU/内存、skills 与 plugins、自动上下文压缩、并行 subagents 和长会话运行能力。它的核心不是再提供一个模型 endpoint，而是把 agent 的执行环境、状态管理和工具编排一起暴露出来。";
agentsApi.enFact = "On September 10, OpenAI announced the Agents API in public beta. It gives developers an OpenAI-managed sandbox, file and secret storage, configurable CPU, GPU, and memory profiles, skills and plugins, automatic context compaction, parallel subagents, and long-session execution. The main product is not another model endpoint; it exposes the execution environment, state management, and tool orchestration around an agent together.";
agentsApi.zhValue = "对产品团队而言，Agents API 把‘要不要做 agent’变成运行时选择：开发者可以把目标交给具备文件、代码、工具和子 agent 的环境，再保存中间产物。它减少重复搭建 harness 的成本，也把资源限制、沙箱边界、权限、终止条件、长任务反馈和人工接管责任推到产品设计面。";
agentsApi.enValue = "For product teams, Agents API turns ‘should we build an agent?’ into a runtime choice. A developer can give a goal to an environment with files, code, tools, and subagents, then persist intermediate artefacts. It may reduce the cost of rebuilding a harness, but it also pushes resource limits, sandbox boundaries, permissions, stop conditions, long-task feedback, and human takeover into product design.";
agentsApi.sources = [source("OpenAI Agents API announcement", "https://openai.com/index/introducing-the-agents-api/", "official"), source("OpenAI hosted sandbox developer docs", "https://developers.openai.com/codex/cloud/", "developer docs")];
freshTopics.push(huaweiCloud, snapFollowup, agentsApi);
issue.date = date;
issue.zhTitle = "AI Daily 2026-09-18：Agentic Cloud、眼镜与长任务";
issue.enTitle = "AI Daily 2026-09-18: Agentic Cloud, perceptual glasses, and long-task runtimes join one product chain";
issue.zhSummary = "华为云把 AICS、长时记忆、MaaS、MCP 资产和 AI Hardware Zone 组织成企业 agent 基础设施；Snap SPECS 的独立评测把手掌 UI、波导限制和主动智能带入可体验的产品证据；OpenAI Agents API 则把 Codex 的沙箱与长任务 harness 变成开发者入口。前两日的广告 agent、跨设备 agent 与 physical AI 继续保留，八条 source lane 仍完整。";
issue.enSummary = "Huawei Cloud connects AICS, long-horizon memory, MaaS, MCP assets, and an AI Hardware Zone into enterprise agent infrastructure. A hands-on review makes Snap SPECS's palm UI, waveguide limits, and anticipatory intelligence tangible. OpenAI's Agents API turns Codex sandboxes and long-task harnesses into a developer surface. The previous issues' sponsored agents, cross-device work, and physical-AI items remain, with all eight source lanes preserved.";
issue.tags = Array.from(new Set(["Agentic Cloud", "Huawei Cloud", "AI Hardware Zone", "Snap SPECS", "Agents API", "long-task runtime", "MCP", "wearable AI", "HCI", "recoverability", ...issue.tags])).slice(0, 36);
issue.sourceTypes = Array.from(new Set(["confirmed product", "developer surface", "official", "reviews", "community", "research", "China", "global", "AR glasses", "AI infrastructure", ...issue.sourceTypes]));
const freshIds = new Set(freshTopics.map((item) => item.id));
issue.topics = [...freshTopics, ...issue.topics.filter((item) => !item.id.startsWith("snap-specs") && !freshIds.has(item.id))];
issue.coverStory = {
  topicId: freshTopics[0].id,
  zhTitle: "Agent 产品正在把边界写进界面",
  enTitle: "From cloud memory to action in view: agent products are making boundaries visible",
  zhSummary: ["华为云把记忆、模型、MCP 和设备伙伴组织成企业 agent 基础设施。", "Snap SPECS 让手掌 UI、波导限制和主动智能进入真实上手证据。", "OpenAI Agents API 把沙箱、上下文压缩和长任务反馈变成开发者必须面对的运行时。"],
  enSummary: ["Huawei Cloud connects memory, models, MCP, and device partners into enterprise agent infrastructure.", "Snap SPECS makes palm UI, waveguide limits, and anticipatory intelligence tangible in hands-on evidence.", "OpenAI Agents API turns sandboxing, context compaction, and long-task feedback into developer-facing runtime choices."],
  imagePath: huaweiCloud.visual.path, imageWidth: huaweiCloud.visual.width, imageHeight: huaweiCloud.visual.height, imageSourceUrl: huaweiCloud.visual.sourceUrl, primarySourceUrl: huaweiCloud.sources[0].url,
  evidenceStrength: "confirmed product · Huawei Cloud official / 2026-09-18; paired with review and developer evidence",
  whyCover: "The product boundary now includes memory, device, identity, recovery, and the moment a user takes control."
};
issue.designDesk = {
  zhTitle: "Design Desk：把 agent 的运行时状态画出来",
  enTitle: "Design Desk: make the agent runtime visible",
  zhIntro: "今天的新增产品把记忆、模型、设备和主动信息接到同一条链。设计团队需要把边界变成一等界面：谁在说话、用了什么上下文、在哪台设备执行、会消耗什么资源，以及用户怎样接管。",
  enIntro: "Today's additions connect memory, models, devices, and proactive information. Product teams need to make boundaries first-class UI: who is speaking, which context was used, where execution happens, what resources are consumed, and how the user takes over.",
  zhItems: [
    { label: "身份要可见", body: "广告 agent、系统 agent、独立回答和第三方服务不能共享一个模糊头像。" },
    { label: "上下文要分层", body: "原始对话、商家知识、个人记忆、跨设备状态和企业数据要能分别查看。" },
    { label: "执行位置要明确", body: "本机、云端、另一台设备、MCP 或物理执行都要在状态里说清楚。" },
    { label: "主动浮现要可控", body: "眼镜和系统 agent 需要显示为什么现在出现、如何暂时安静、如何永久关闭。" },
    { label: "长任务要可恢复", body: "资源不足、断网、设备切换和模型错误都要回到可理解的步骤。" },
    { label: "商业目标要可退出", body: "用户可以离开 Sponsored Agent、回到独立回答、清除共享上下文。" },
    { label: "运行时要可见", body: "模型、沙箱、记忆、MCP、设备和恢复点不能只藏在日志里。" }
  ],
  enItems: [
    { label: "Make identity visible", body: "A sponsored agent, system agent, independent answer, and third-party service cannot share one vague avatar." },
    { label: "Layer context", body: "Original chat, merchant knowledge, personal memory, cross-device state, and enterprise data need separate views." },
    { label: "Name execution", body: "Local, cloud, another device, MCP, and physical execution must be explicit in status." },
    { label: "Control proactive surfacing", body: "Glasses and system agents should explain why something appeared and how to mute or disable it." },
    { label: "Recover long tasks", body: "Resource shortage, disconnect, handoff, and model error need an understandable return point." },
    { label: "Make commerce escapable", body: "Users should leave a Sponsored Agent, return to independent answers, and clear shared context." },
    { label: "Expose the runtime", body: "Model, sandbox, memory, MCP, device, and recovery point cannot live only in logs." }
  ]
};
issue.watchlistZh = [
  "Huawei Cloud Agentic Cloud：AICS 的真实恢复日志、CMS API、AgentArts 商业化和 AI Hardware Zone 的设备权限边界。",
  "Snap SPECS：主动智能的长时准确性、波导色差、价格/重量、公共空间接受度和 Lens SDK。",
  "OpenAI Agents API：sandbox 权限、成本配置、长任务终止、subagent 责任与人工接管接口。",
  "OpenAI Sponsored Agents：标签、商家上下文与 ChatGPT 独立回答的隔离，用户数据回传、举报、排序和广告计费。",
  ...issue.watchlistZh.slice(0, 14)
];
issue.watchlistEn = [
  "Huawei Cloud Agentic Cloud: real AICS recovery logs, CMS APIs, AgentArts commercialisation, and device-permission boundaries in the AI Hardware Zone.",
  "Snap SPECS: long-run accuracy of anticipatory intelligence, waveguide colour fringing, price and weight, public acceptance, and Lens SDK.",
  "OpenAI Agents API: sandbox permissions, cost profiles, long-task termination, subagent responsibility, and human takeover APIs.",
  "OpenAI Sponsored Agents: label visibility, merchant-context separation from independent answers, user-data return, reporting, ranking, and billing.",
  ...issue.watchlistEn.slice(0, 14)
];
issue.sourcesPath = `./${date}/sources.md`;
issue.zhPath = `./${date}/zh/`;
issue.enPath = `./${date}/en/`;
const index = issues.findIndex((item) => item.date === date);
if (index >= 0) issues[index] = issue; else issues.unshift(issue);
issues.sort((a, b) => b.date.localeCompare(a.date));
await fs.writeFile(dataPath, `${JSON.stringify(issues, null, 2)}\n`);

await fs.mkdir(path.join(issueDir, "assets"), { recursive: true });
await fs.cp(path.join(root, previousDate, "assets"), path.join(issueDir, "assets"), { recursive: true });
for (const file of ["openai-sponsored-agents-research-2026-09.png", "snap-specs-review-2026-09.png", "huawei-atlas-960e-2026-09.png", "huawei-peerium-2026-09.png", "huawei-cloud-agentic-infra-2026-09.png", "openai-agents-api-official-2026-09.png"]) {
  await fs.copyFile(path.join(root, date, "assets", file), path.join(issueDir, "assets", file));
}

await fs.rm(deckDir, { recursive: true, force: true });
await fs.cp(previousDeck, deckDir, { recursive: true, filter: (sourcePath) => !sourcePath.includes(`${path.sep}dist${path.sep}`) && !sourcePath.endsWith(`${path.sep}dist`) });
await fs.cp(path.join(issueDir, "assets"), path.join(deckDir, "public", "assets"), { recursive: true, force: true });
const labels = { zh: ["产品", "产品是什么", "怎么用", "规格 / 系统栈", "使用场景", "解决痛点", "用户原声", "新技术", "可用性", "限制 / 未知", "产品判断"], en: ["Product", "What it is", "How it works", "Specs / stack", "Use cases", "Pain points", "User voice", "New tech", "Availability", "Limits / unknowns", "Product read"] };
const fields = ["productName", "productType", "interactionFlow", "specsOrStack", "useCases", "painPointsSolved", "userVoice", "newTech", "availability", "limitsOrUnknowns", "productVerdict"];
const dossierText = (locale, item) => fields.map((field, i) => `**${labels[locale][i]}** — ${item.dossier[locale][field]}`).join("\n\n");
const links = (item) => item.sources.map((s) => `[${s.label}](${s.url})`).join(" · ");
const slides = [
  `---\ntheme: default\ntitle: AI Daily ${date}\nlayout: cover\n---\n\n# AI Daily ${date}\n\n${issue.coverStory.zhTitle} / ${issue.coverStory.enTitle}\n\n<img src="./public/${openaiVisual.path}" style="width:42%;height:54%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${issue.coverStory.evidenceStrength}**\n\n${issue.coverStory.zhSummary.join(" ")}\n\n${links(freshTopics[0])}`,
  `# Issue map\n\n**Cover** — ${issue.coverStory.zhTitle}\n\n**Today’s additions** — ${freshTopics.map((item) => item.zhHeadline).join("；")}。\n\n**Eight source lanes** — official · reviews · community · wild · research · patent · china · global。\n\n**Design Desk** — ${issue.designDesk.zhTitle}。\n\nThe public publisher carries the complete bilingual, paged 16:9 issue with source/date/evidence labels and PDF downloads.`,
  ...freshTopics.flatMap((item) => [`# ${item.zhHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("zh", item)}\n\n**Sources** — ${links(item)}`, `# ${item.enHeadline}\n\n<img src="./public/${item.visual.path}" style="width:35%;height:42%;object-fit:contain;object-position:center;background:white;float:right;margin-left:18px" />\n\n**${item.evidenceLabel} · ${item.evidenceStrength} · ${item.sourceDate}**\n\n${dossierText("en", item)}\n\n**Sources** — ${links(item)}`]),
  `# Design Desk / 设计洞察\n\n${issue.designDesk.zhItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}\n\n${issue.designDesk.enItems.map((x, i) => `${i + 1}. **${x.label}** — ${x.body}`).join("\n\n")}`,
  `# Watchlist / 继续观察\n\n${issue.watchlistZh.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n${issue.watchlistEn.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
  `# Source ledger\n\nEight lanes: official · reviews · community · wild · research · patent · china · global.\n\n${Array.from(new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url)))).slice(0, 120).map((url, i) => `${i + 1}. ${url}`).join("\n")}\n\nVisual evidence uses local source-traceable images with contain positioning, white backgrounds, and no page-internal scrolling.`
];
await fs.writeFile(path.join(deckDir, "package.json"), JSON.stringify({ scripts: { build: "slidev build --base ./ --out dist" }, dependencies: { "@slidev/cli": "^0.50.0", "@slidev/theme-default": "^0.25.0", vue: "^3.4.0" } }, null, 2) + "\n");
await fs.writeFile(path.join(deckDir, "slides.md"), slides.join("\n\n---\n\n") + "\n");
const allSources = Array.from(new Map(issue.topics.flatMap((item) => item.sources).map((s) => [s.url, s])).values());
const laneRows = ["official", "reviews", "community", "wild", "research", "patent", "china", "global"].map((lane) => `| ${lane} | ${issue.topics.some((item) => item.section === lane) ? "covered" : "scan required"} | ${issue.topics.filter((item) => item.section === lane).map((item) => item.id).join(", ") || "source-lane scan"} |`).join("\n");
const visualRows = issue.topics.map((item) => `| ${item.id} | \`${item.visual.path}\` | ${item.visual.sourceUrl} | ${item.evidenceLabel} |`).join("\n");
await fs.writeFile(path.join(deckDir, "sources.md"), `# AI Daily ${date} source ledger\n\n## Source index\n\n${allSources.map((s, i) => `${i + 1}. ${s.label} — ${s.url} — ${s.type || "source not stated"}`).join("\n")}\n\n## Source-lane coverage\n\n| lane | status | topics |\n| --- | --- | --- |\n${laneRows}\n\n## Visual asset index\n\n| topic | asset | source | evidence |\n| --- | --- | --- | --- |\n${visualRows}\n\n## Evidence rules\n\n- Official pages support confirmed product or developer-surface claims only where stated.\n- Reviews and community pages provide friction signals, not universal behaviour.\n- Startup, research, patent, pre-launch, and weak material remains explicitly downgraded.\n- Missing specs, prices, dates, availability, quotes, and APIs are written as source not stated.\n- Visuals use object-fit: contain, object-position: center, white backgrounds, and no page-internal scrolling.\n- Chinese and English dossier fields carry the same information units; English is not a compressed summary.\n`);
console.log(JSON.stringify({ date, topics: issue.topics.length, fresh: freshTopics.length, sources: new Set(issue.topics.flatMap((item) => item.sources.map((s) => s.url))).size, visuals: new Set(issue.topics.map((item) => item.visual.path)).size, deckDir }));
