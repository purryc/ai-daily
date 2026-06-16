import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const siteBase = "/ai-daily";

const issues = JSON.parse(await fs.readFile(dataPath, "utf8")).sort((a, b) => b.date.localeCompare(a.date));

const sectionLabels = {
  zh: {
    all: "All",
    official: "大厂官方",
    wild: "野生信号",
    research: "论文",
    patent: "专利",
    china: "中国",
    global: "海外",
    sources: "来源"
  },
  en: {
    all: "All",
    official: "Official",
    wild: "Wild",
    research: "Research",
    patent: "Patent",
    china: "China",
    global: "Global",
    sources: "Sources"
  }
};

const sectionNames = {
  zh: {
    official: "Official Desk / 大厂官方",
    wild: "Wild Desk / 野生信号",
    research: "Research Watch / 论文",
    patent: "Patent Watch / 专利",
    china: "China / Global Compare",
    global: "Global Signals"
  },
  en: {
    official: "Official Desk",
    wild: "Wild Desk",
    research: "Research Watch",
    patent: "Patent Watch",
    china: "China / Global Compare",
    global: "Global Signals"
  }
};

function html(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function attrs(attributes) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}="${html(value)}"`)
    .join(" ");
}

function assetUrl(issue, assetPath) {
  if (/^https?:\/\//.test(assetPath)) return assetPath;
  return `${siteBase}/${issue.date}/${assetPath}`;
}

function relAssetUrl(assetPath) {
  return `../${assetPath}`;
}

function sourceLinks(sources, locale) {
  const prefix = locale === "zh" ? "来源：" : "Sources:";
  return `<p class="source-row"><strong>${prefix}</strong> ${sources
    .map((source) => `<a href="${html(source.url)}" target="_blank" rel="noreferrer">${html(source.label)}</a>`)
    .join(" · ")}</p>`;
}

function figure(issue, visual, locale, rootRelative = true) {
  const imageUrl = rootRelative ? assetUrl(issue, visual.path) : relAssetUrl(visual.path);
  const alt = locale === "zh" ? visual.altZh : visual.altEn;
  const caption = locale === "zh" ? visual.captionZh : visual.captionEn;
  return `
    <figure class="evidence-figure">
      <a href="${html(visual.sourceUrl)}" target="_blank" rel="noreferrer" aria-label="${html(caption)}">
        <img ${attrs({ src: imageUrl, alt, width: visual.width, height: visual.height, loading: "lazy", decoding: "async" })} />
      </a>
      <figcaption>${html(caption)}</figcaption>
    </figure>`;
}

function chips(items) {
  return items.map((item) => `<span>${html(item)}</span>`).join("");
}

function topicNarrative(topic, locale) {
  const narratives = {
    "apple-os-agent": {
      zh: {
        analysis: [
          "这条消息的产品意义不是 Siri 变成一个更会聊天的助手，而是 Apple 把 AI 放回了 OS 的默认路径里。用户看到一段文字、一张图、一个日程或一封邮件时，入口不一定再是“打开某个 App”，而是直接指向当前屏幕和个人上下文。",
          "这会改变 HCI 的责任边界。过去 App 负责自己的输入、状态和反馈；现在系统级 agent 会跨 App 读取意图、调用动作、返回结果。好处是少一步跳转，风险是用户更难知道系统到底引用了哪些上下文。",
          "真正的产品竞争点会变成控制权：系统能不能在执行前解释边界，执行后给出撤销，失败时回到用户可理解的状态。对于设计团队，这比“多一个 AI 按钮”重要得多。"
        ],
        readout: ["OS 入口权重上升", "个人上下文成为核心资产", "撤销/解释会变成信任基础设施"],
        questions: ["跨 App action 的权限提示是否足够短？", "用户是否能看到 AI 使用了哪段个人上下文？", "失败时是否能恢复到明确的上一步？"]
      },
      en: {
        analysis: [
          "The product meaning is not that Siri becomes a better chatbot. Apple is moving AI back into the default OS path. When a user sees text, a photo, a calendar item, or an email, the entry point no longer has to be an app launch; it can be the current screen plus personal context.",
          "That shifts the HCI boundary. Apps used to own input, state, and feedback locally. A system agent can now read intent across apps, invoke actions, and return results. The benefit is less switching; the risk is that users lose track of what context the system used.",
          "The real product contest becomes control: explaining boundaries before action, offering undo after action, and recovering from failure in a way users understand. For product teams, that matters more than adding another AI button."
        ],
        readout: ["OS entry point becomes stronger", "Personal context becomes a core asset", "Undo and explanation become trust infrastructure"],
        questions: ["Can cross-app permissions stay short and legible?", "Can users see which context was used?", "Does failure return to a clear previous state?"]
      }
    },
    "googlebook-ai-pc": {
      zh: {
        analysis: [
          "Googlebook 的信号在于它把 AI PC 从“性能配置 + Copilot/Gemini 功能”推成了一个系统入口类别。电脑不只是运行 AI 的机器，而是把光标、桌面、widget 和 Gemini 组织成一个新的工作流层。",
          "这类产品如果成立，AI PC 的评估方式会变。芯片、续航、模型能力仍然重要，但用户每天感受到的是：能不能少复制粘贴、少切窗口、少解释上下文，并把结果放回当前任务。",
          "对 HCI 来说，关键是 feedback surface。AI 结果不能只在聊天窗口里出现，它要能回到桌面、文件、widget、指针附近，形成轻量但可追踪的工作流闭环。"
        ],
        readout: ["AI PC 变成入口类别", "指针/桌面/widget 成为 agent UI", "系统反馈比聊天窗口更重要"],
        questions: ["Magic Pointer 是否真的减少上下文解释？", "widget 结果是否可追溯、可撤销？", "AI PC 的差异点是模型、芯片还是工作流闭环？"]
      },
      en: {
        analysis: [
          "The signal is that Googlebook reframes the AI PC from a spec sheet plus Gemini features into a system entry-point category. The computer is not just a machine that runs AI; pointer, desktop, widgets, and Gemini become one workflow layer.",
          "If this category holds, AI PC evaluation changes. Chips, battery, and model capability still matter, but the daily user experience is whether the system reduces copy-paste, window switching, context explanation, and returns output to the current task.",
          "For HCI, the key is the feedback surface. AI output cannot stay trapped in a chat pane; it needs to return to desktop objects, files, widgets, and pointer-adjacent moments as a lightweight but traceable loop."
        ],
        readout: ["AI PC becomes an entry category", "Pointer, desktop, and widgets become agent UI", "System feedback matters more than a chat box"],
        questions: ["Does Magic Pointer reduce context explanation?", "Are widget results traceable and undoable?", "Is the differentiator model, chip, or workflow closure?"]
      }
    },
    "android-xr-eyewear": {
      zh: {
        analysis: [
          "Android XR 眼镜的产品意义不是把手机通知搬到眼前，而是把 AI 入口放进一个更连续的身体位置。语音、位置、相机、翻译和消息动作结合后，眼镜开始接近“随身 agent shell”。",
          "但眼镜也是最敏感的 HCI 场域。它把用户的注意力、旁人的隐私、环境上下文和实时反馈挤在一起。任何录制、识别、导航和翻译，都必须处理别人是否知道、用户是否可控、错误是否会造成社交尴尬。",
          "所以智能眼镜不能只追求少屏幕。它需要一套低打扰反馈语言：什么时候听到了、什么时候在处理、什么时候没有把握、什么时候需要手机接管。"
        ],
        readout: ["眼镜是连续上下文入口", "旁人隐私成为界面问题", "低打扰反馈比炫酷显示更关键"],
        questions: ["录制/识别状态是否对旁人可见？", "导航或翻译错误如何快速纠正？", "音频和显示反馈如何避免打扰？"]
      },
      en: {
        analysis: [
          "The product meaning of Android XR glasses is not moving phone notifications onto the face. It puts the AI entry point into a more continuous bodily position. Voice, location, camera, translation, and message actions start to resemble a wearable agent shell.",
          "Glasses are also one of the most sensitive HCI surfaces. They compress attention, bystander privacy, environmental context, and real-time feedback into one object. Recording, recognition, navigation, and translation all need to answer who knows, who controls, and what happens when the system is wrong.",
          "So smart glasses should not only chase fewer screens. They need a low-interruption feedback language: heard, processing, uncertain, failed, or handed off to the phone."
        ],
        readout: ["Glasses become continuous-context entry points", "Bystander privacy becomes interface design", "Low-interruption feedback beats flashy display"],
        questions: ["Is recording status visible to bystanders?", "How are navigation or translation errors corrected?", "How does feedback avoid interruption?"]
      }
    },
    "microsoft-solara": {
      zh: {
        analysis: [
          "Solara 的价值在于它把 agent-first device 当成系统栈问题，而不是单个设备 demo。Agent Shell、MDEP、身份、管理、隐私指示和临时 UI 被放在同一个叙事里，说明企业场景下的 AI 硬件需要可治理。",
          "这和消费级 AI gadget 的差异很大。企业用户不只问“能做什么”，还会问谁授权、谁审计、丢失怎么办、录音是否关闭、数据进入哪个身份边界。",
          "HCI 上最值得看的不是 shell 长什么样，而是 just-in-time UI 的模式：agent 平时可以隐身，但关键时刻必须现身，让用户看到状态、选择和后果。"
        ],
        readout: ["agent device 是系统栈，不是 app", "企业信任依赖身份和审计", "临时 UI 是无界面和可控性的折中"],
        questions: ["Agent Shell 何时出现、何时退场？", "物理麦克风状态如何进入软件反馈？", "审计轨迹是否对最终用户可理解？"]
      },
      en: {
        analysis: [
          "Solara matters because it treats the agent-first device as a system-stack problem, not a standalone device demo. Agent Shell, MDEP, identity, management, privacy indicators, and just-in-time UI sit in one story, which signals that enterprise AI hardware must be governable.",
          "This is very different from consumer AI gadgets. Enterprise buyers do not only ask what it can do. They ask who authorized it, who audits it, what happens if it is lost, whether recording is physically off, and which identity boundary owns the data.",
          "The most interesting HCI pattern is not the shell's visual style. It is just-in-time UI: the agent can stay invisible most of the time, but must become visible when status, choice, or consequence matters."
        ],
        readout: ["Agent devices are system stacks, not apps", "Enterprise trust depends on identity and audit", "Temporary UI balances invisibility with control"],
        questions: ["When does Agent Shell appear or disappear?", "How does physical mic state become software feedback?", "Is the audit trail understandable to end users?"]
      }
    },
    "wild-smart-glasses": {
      zh: {
        analysis: [
          "野生信号的价值不是证明市场已经成立，而是暴露产品假设的边缘。Product Hunt、Kickstarter、Reddit 里出现的 HUD、录制总结、翻译、tap-to-AI，本质上是在测试用户愿不愿意把 AI 入口放到脸上。",
          "这些信号要弱读：众筹页面可能夸张，社区反馈可能偏极端，Product Hunt 热度不等于留存。但它们能告诉我们，大厂 demo 之外的真实阻力在哪里。",
          "当前最密集的阻力集中在电池、隐私、佩戴心理、录制边界和结果质量。也就是说，智能眼镜的早期 PMF 不是“AI 功能够多”，而是“我愿不愿意整天戴着它”。"
        ],
        readout: ["弱信号适合看阻力，不适合看规模", "佩戴心理是产品问题", "功能堆叠不等于 PMF"],
        questions: ["用户抱怨集中在设备、隐私还是 AI 质量？", "众筹承诺有没有第三方评测支撑？", "哪些场景让用户愿意每天佩戴？"]
      },
      en: {
        analysis: [
          "The value of wild signals is not proving the market. It is exposing the edges of product assumptions. HUDs, recording summaries, translation, and tap-to-AI on Product Hunt, Kickstarter, and Reddit test whether users will put an AI entry point on their face.",
          "These signals must be read weakly. Crowdfunding pages can overclaim, community feedback can be extreme, and Product Hunt heat is not retention. But they reveal friction outside polished big-company demos.",
          "The dense friction areas are battery, privacy, wearing psychology, recording boundaries, and output quality. Early PMF for smart glasses is not more AI features; it is whether users want to wear the object all day."
        ],
        readout: ["Weak signals reveal friction, not scale", "Wearing psychology is a product problem", "Feature stacking is not PMF"],
        questions: ["Are complaints about device, privacy, or AI quality?", "Do crowdfunding claims have independent review support?", "Which scenes make daily wear acceptable?"]
      }
    },
    "research-agency-wearables": {
      zh: {
        analysis: [
          "研究信号把问题从“界面是否高效”推向“人的 agency 是否还在”。当 conversational AI 和 wearable input 降低操作成本时，用户可能更快触发任务，但也更容易失去过程控制。",
          "wearable ring 这类低摩擦输入很诱人，因为它绕过了手机和屏幕。但越低摩擦，越需要反馈补偿。没有音频、视觉或触觉确认时，用户不知道 agent 是否听懂、是否开始、是否需要修正。",
          "这给 AI OS 和 AI hardware 一个明确提醒：无界面不是终点。真正成熟的 agentic interface 应该是低摩擦输入 + 可见状态 + 可暂停/撤销/纠错的控制层。"
        ],
        readout: ["agency 是核心 HCI 变量", "低摩擦输入需要高质量反馈", "无界面必须配控制层"],
        questions: ["用户在哪一步失去过程控制？", "反馈是确认动作还是解释原因？", "可暂停和可撤销是否足够近？"]
      },
      en: {
        analysis: [
          "The research signal moves the question from interface efficiency to human agency. Conversational AI and wearable input lower the cost of action, but can also remove process control.",
          "A wearable ring is attractive because it bypasses phone and screen friction. But the lower the input friction, the more feedback compensation is needed. Without audio, visual, or haptic confirmation, users cannot tell whether the agent understood, started, or needs correction.",
          "This is a clear warning for AI OS and AI hardware: no-interface is not the destination. A mature agentic interface is low-friction input plus visible state plus pause, undo, and correction."
        ],
        readout: ["Agency is the core HCI variable", "Low-friction input needs high-quality feedback", "No-interface still needs a control layer"],
        questions: ["Where does the user lose process control?", "Does feedback confirm action or explain cause?", "Are pause and undo close enough?"]
      }
    },
    "patent-watch-protocol": {
      zh: {
        analysis: [
          "专利很适合做方向雷达，但不能当产品事实。尤其是 AI hardware 和 sensing peripheral，专利往往会覆盖传感器组合、手势识别、显示反馈、端侧推理等关键接口，但它不说明是否发布、何时发布、以什么形态发布。",
          "因此日报里的 patent lane 需要有明确降权标识。它可以告诉我们大厂或创业公司正在防守哪类交互空间，但不能替代产品页、开发者文档、评测或用户反馈。",
          "更稳的做法是把专利和其他证据交叉：如果专利方向同时出现在 SDK、硬件发布、开发者招募、社区试用里，才提高证据等级。"
        ],
        readout: ["专利是方向，不是发布", "需要和产品/社区证据交叉", "必须显式标注 patent signal"],
        questions: ["专利 claim 对应哪种输入/反馈？", "有没有 SDK 或硬件证据呼应？", "是否容易被误读成 roadmap？"]
      },
      en: {
        analysis: [
          "Patents are useful as direction radar, but not as product facts. In AI hardware and sensing peripherals, patents often cover sensor combinations, gesture recognition, display feedback, and on-device inference, but they do not indicate launch, date, or final form.",
          "That means the patent lane needs a visible downgrade label. It can show which interaction space a company is defending, but it cannot replace product pages, developer docs, reviews, or user feedback.",
          "The stronger pattern is cross-evidence: a patent direction becomes more useful when it also appears in SDKs, hardware announcements, developer recruitment, or community trials."
        ],
        readout: ["Patent means direction, not launch", "Cross it with product and community evidence", "Label patent signal visibly"],
        questions: ["Which input or feedback does the claim map to?", "Is there SDK or hardware evidence?", "Could it be misread as roadmap?"]
      }
    },
    "china-global-compare": {
      zh: {
        analysis: [
          "中国/海外对比要分两层读。海外大厂信号更偏平台层：OS、AI PC、XR、enterprise shell；中国相关和创业信号更常出现在硬件单品、众筹、眼镜生态和快速试错里。",
          "这不是谁更先进的简单比较，而是证据类型不同。平台信号强调 API、身份、生态和系统入口；野生市场信号强调价格、形态、佩戴、场景和用户吐槽。",
          "对产品判断来说，最有价值的是把两种信号叠起来看：平台决定长期入口位置，野生产品暴露短期用户阻力。日报需要同时保留这两种密度。"
        ],
        readout: ["平台信号和野生信号不能混读", "中国/海外差异首先是证据类型差异", "长期入口与短期阻力要同时看"],
        questions: ["中国相关信号是官方发布还是众筹/社区？", "海外平台能力是否已有开发者入口？", "两边共同指向哪个默认入口？"]
      },
      en: {
        analysis: [
          "China/global comparison needs two layers. Global big-tech signals are more platform-led: OS, AI PC, XR, enterprise shell. China-linked and startup signals often show up through devices, crowdfunding, glasses ecosystems, and faster form-factor experiments.",
          "This is not a simple ranking of who is ahead. The evidence types differ. Platform signals emphasize APIs, identity, ecosystem, and system entry points; wild-market signals emphasize price, form, wearability, scenes, and user complaints.",
          "For product judgment, the useful move is to layer them: platforms decide long-term entry-point position, while wild products expose short-term user resistance. The brief needs both densities."
        ],
        readout: ["Do not mix platform and wild signals", "China/global difference is often evidence-type difference", "Track long-term entry and short-term friction together"],
        questions: ["Is the China-linked signal official or community/crowdfunding?", "Does the global platform signal have a developer entry?", "Which default entry point do both sides point toward?"]
      }
    }
  };

  return narratives[topic.id]?.[locale] ?? {
    analysis: [topic[locale === "zh" ? "zhValue" : "enValue"], topic[locale === "zh" ? "zhImplication" : "enImplication"]],
    readout: topic[locale === "zh" ? "zhHciLens" : "enHciLens"],
    questions: []
  };
}

function layout({ locale, title, description, body, rootPrefix = "" }) {
  const language = locale === "zh" ? "zh-CN" : "en";
  const favicon = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2f2234"/><text x="13" y="42" font-family="Arial" font-size="26" font-weight="900" fill="#fff">AI</text></svg>'
  )}`;
  return `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${html(title)}</title>
    <meta name="description" content="${html(description)}" />
    <link rel="icon" href="${favicon}" />
    <link rel="stylesheet" href="${rootPrefix}assets/site.css" />
  </head>
  <body>
${body}
    <script>
      document.querySelectorAll("[data-time-filter]").forEach((button) => {
        button.addEventListener("click", () => {
          const filter = button.dataset.timeFilter;
          document.querySelectorAll("[data-time-filter]").forEach((item) => item.classList.toggle("active", item === button));
          document.querySelectorAll("[data-time]").forEach((card) => {
            const tokens = card.dataset.time.split(" ");
            card.hidden = filter !== "all" && !tokens.includes(filter);
          });
        });
      });

      const deck = document.querySelector("[data-deck]");
      if (deck) {
        const slides = Array.from(deck.querySelectorAll("[data-slide]"));
        const counter = document.querySelector("[data-deck-counter]");
        const progress = document.querySelector("[data-deck-progress]");
        const dots = document.querySelector("[data-deck-dots]");
        let current = 0;

        function showSlide(nextIndex, updateHash = true) {
          current = Math.max(0, Math.min(slides.length - 1, nextIndex));
          slides.forEach((slide, index) => {
            const active = index === current;
            slide.classList.toggle("is-active", active);
            slide.setAttribute("aria-hidden", active ? "false" : "true");
          });
          if (counter) counter.textContent = String(current + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
          if (progress) progress.style.width = ((current + 1) / slides.length * 100).toFixed(2) + "%";
          if (dots) {
            dots.querySelectorAll("button").forEach((button, index) => {
              button.classList.toggle("active", index === current);
            });
          }
          if (updateHash && slides[current]?.id) history.replaceState(null, "", "#" + slides[current].id);
        }

        if (dots) {
          dots.innerHTML = slides.map((slide, index) => '<button type="button" aria-label="Slide ' + (index + 1) + '"></button>').join("");
          dots.querySelectorAll("button").forEach((button, index) => button.addEventListener("click", () => showSlide(index)));
        }

        document.querySelectorAll("[data-next-slide]").forEach((button) => button.addEventListener("click", () => showSlide(current + 1)));
        document.querySelectorAll("[data-prev-slide]").forEach((button) => button.addEventListener("click", () => showSlide(current - 1)));
        document.querySelectorAll("[data-go-slide]").forEach((link) => {
          link.addEventListener("click", (event) => {
            event.preventDefault();
            const target = slides.findIndex((slide) => slide.id === link.dataset.goSlide);
            if (target >= 0) showSlide(target);
          });
        });

        window.addEventListener("keydown", (event) => {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          if (["ArrowRight", "PageDown", " "].includes(event.key)) {
            event.preventDefault();
            showSlide(current + 1);
          }
          if (["ArrowLeft", "PageUp"].includes(event.key)) {
            event.preventDefault();
            showSlide(current - 1);
          }
          if (event.key === "Home") showSlide(0);
          if (event.key === "End") showSlide(slides.length - 1);
        });

        const initial = slides.findIndex((slide) => "#" + slide.id === window.location.hash);
        showSlide(initial >= 0 ? initial : 0, false);
      }
    </script>
  </body>
</html>
`;
}

function homepage(locale) {
  const latest = issues[0];
  const isZh = locale === "zh";
  const rootPrefix = isZh ? "" : "../";
  const title = "AI Daily";
  const description = isZh
    ? "AI Daily：面向 HCI、AI 硬件、AI 软件与软硬件系统的产品晨报。"
    : "AI Daily: product briefings for HCI, AI hardware, AI software, and soft/hardware systems.";
  const latestMonth = latest.date.slice(0, 7);
  const latestYear = latest.date.slice(0, 4);
  const timeFilters = [
    { key: "all", label: isZh ? "全部时间" : "All dates" },
    { key: "latest", label: isZh ? "最新" : "Latest" },
    { key: `y-${latestYear}`, label: latestYear },
    { key: `m-${latestMonth}`, label: latestMonth }
  ];

  const issueCards = issues
    .map((issue, index) => {
      const issueTitle = isZh ? issue.zhTitle : issue.enTitle;
      const issueSummary = isZh ? issue.zhSummary : issue.enSummary;
      const coverTitle = isZh ? issue.coverStory.zhTitle : issue.coverStory.enTitle;
      const timeTokens = [
        index === 0 ? "latest" : "",
        `y-${issue.date.slice(0, 4)}`,
        `m-${issue.date.slice(0, 7)}`,
        `d-${issue.date}`
      ]
        .filter(Boolean)
        .join(" ");
      return `
        <article class="issue-card" data-time="${html(timeTokens)}">
          <figure class="issue-thumb">
            <img ${attrs({
              src: assetUrl(issue, issue.coverStory.imagePath),
              alt: coverTitle,
              width: issue.coverStory.imageWidth,
              height: issue.coverStory.imageHeight,
              loading: "lazy",
              decoding: "async"
            })} />
          </figure>
          <div class="issue-main">
            <div class="issue-kicker">${html(issue.date)} · ${html(issue.timezone)}</div>
            <h2>${html(issueTitle)}</h2>
            <p>${html(issueSummary)}</p>
            <div class="chip-row">${chips(issue.tags.slice(0, 7))}</div>
            <div class="mini-source">${html(isZh ? "封面：" : "Cover:")} <a href="${html(issue.coverStory.primarySourceUrl)}" target="_blank" rel="noreferrer">${html(coverTitle)}</a></div>
          </div>
          <div class="issue-actions">
            <a class="primary" href="${html(issue.zhPath)}">${isZh ? "中文版" : "Chinese"}</a>
            <a href="${html(issue.enPath)}">English</a>
            <a href="${html(issue.sourcesPath)}">${sectionLabels[locale].sources}</a>
          </div>
        </article>`;
    })
    .join("");

  const body = `
    <main class="app-shell archive-shell">
      <aside class="rail" aria-label="AI Daily">
        <a class="mark" href="${siteBase}/">AI</a>
        <a class="rail-icon active" href="${isZh ? siteBase + "/" : siteBase + "/en/"}" aria-label="Home">⌂</a>
        <a class="rail-icon" href="#archive" aria-label="Archive">≡</a>
      </aside>
      <section class="workspace">
        <nav class="topbar" aria-label="Primary">
          <div class="search-pill">${isZh ? "按日期翻日报" : "Browse issues by date"}</div>
          <div class="nav-links">
            <a href="#archive">${isZh ? "日报" : "Archive"}</a>
            <a href="#filters">${isZh ? "时间筛选" : "Time filter"}</a>
            <a href="${latest.sourcesPath}">${isZh ? "来源" : "Sources"}</a>
          </div>
          <div class="lang-switch">
            <a class="${isZh ? "active" : ""}" href="${siteBase}/">中文</a>
            <a class="${isZh ? "" : "active"}" href="${siteBase}/en/">English</a>
          </div>
        </nav>

        <header class="archive-head">
          <p class="eyebrow">AI Daily</p>
          <h1>${isZh ? "每日 AI 产品报纸" : "Daily AI Product Newspaper"}</h1>
          <p>${isZh ? "只保留日期列表：点开每一期进入杂志式长读页面，来源和图片都在正文里。" : "A date-first archive: open any issue to read the magazine-style longform page with inline images and sources."}</p>
        </header>

        <section class="filter-bar" id="filters" aria-label="Filters">
          ${timeFilters.map((filter) => `<button class="${filter.key === "all" ? "active" : ""}" data-time-filter="${filter.key}">${filter.label}</button>`).join("")}
        </section>

        <section class="issue-list" id="archive" aria-label="Daily issues">
          ${issueCards}
        </section>
      </section>
    </main>`;

  return layout({ locale, title, description, body, rootPrefix });
}

function topicCard(issue, topic, locale) {
  const isZh = locale === "zh";
  const headline = isZh ? topic.zhHeadline : topic.enHeadline;
  const fact = isZh ? topic.zhFact : topic.enFact;
  const value = isZh ? topic.zhValue : topic.enValue;
  const implication = isZh ? topic.zhImplication : topic.enImplication;
  const lens = isZh ? topic.zhHciLens : topic.enHciLens;
  return `
    <article class="topic-card" id="${html(topic.id)}" data-sections="${html(topic.section)}">
      ${figure(issue, topic.visual, locale, false)}
      <div class="topic-main">
        <div class="topic-topline">
          <span class="section-chip">${html(sectionLabels[locale][topic.section] ?? topic.section)}</span>
          <span>${html(topic.evidenceStrength)}</span>
          <span>${html(topic.sourceDate)}</span>
        </div>
        <h3>${html(headline)}</h3>
        <p><strong>${isZh ? "事实：" : "Fact:"}</strong> ${html(fact)}</p>
        <p><strong>${isZh ? "价值：" : "Value:"}</strong> ${html(value)}</p>
        <div class="lens-grid">
          ${lens.map((item) => `<span>${html(item)}</span>`).join("")}
        </div>
        <p><strong>${isZh ? "产品影响：" : "Product implication:"}</strong> ${html(implication)}</p>
        ${sourceLinks(topic.sources, locale)}
      </div>
    </article>`;
}

function topicSpread(issue, topic, locale, pageNumber) {
  const isZh = locale === "zh";
  const headline = isZh ? topic.zhHeadline : topic.enHeadline;
  const fact = isZh ? topic.zhFact : topic.enFact;
  const value = isZh ? topic.zhValue : topic.enValue;
  const implication = isZh ? topic.zhImplication : topic.enImplication;
  const lens = isZh ? topic.zhHciLens : topic.enHciLens;
  const narrative = topicNarrative(topic, locale);
  const page = String(pageNumber).padStart(2, "0");

  return `
    <article class="magazine-spread" id="${html(topic.id)}">
      <div class="spread-number">${page}</div>
      <div class="spread-visual">
        ${figure(issue, topic.visual, locale, false)}
      </div>
      <div class="spread-copy">
        <div class="topic-topline">
          <span class="section-chip">${html(sectionLabels[locale][topic.section] ?? topic.section)}</span>
          <span>${html(topic.evidenceStrength)}</span>
          <span>${html(topic.sourceDate)}</span>
        </div>
        <h3>${html(headline)}</h3>
        <div class="deck-copy">
          <p><strong>${isZh ? "事实：" : "Fact:"}</strong> ${html(fact)}</p>
          <p><strong>${isZh ? "为什么重要：" : "Why it matters:"}</strong> ${html(value)}</p>
          ${narrative.analysis.map((paragraph) => `<p>${html(paragraph)}</p>`).join("")}
          <p><strong>${isZh ? "产品影响：" : "Product implication:"}</strong> ${html(implication)}</p>
        </div>
        ${sourceLinks(topic.sources, locale)}
      </div>
      <aside class="spread-sidebar">
        <h4>${isZh ? "HCI Lens" : "HCI Lens"}</h4>
        <div class="lens-grid">
          ${lens.map((item) => `<span>${html(item)}</span>`).join("")}
        </div>
        <h4>${isZh ? "Readout" : "Readout"}</h4>
        <ul>
          ${narrative.readout.map((item) => `<li>${html(item)}</li>`).join("")}
        </ul>
        <h4>${isZh ? "Open Questions" : "Open Questions"}</h4>
        <ul>
          ${narrative.questions.map((item) => `<li>${html(item)}</li>`).join("")}
        </ul>
      </aside>
    </article>`;
}

function issuePage(issue, locale) {
  const isZh = locale === "zh";
  const rootPrefix = "../../";
  const title = isZh ? `${issue.zhTitle} · AI Daily` : `${issue.enTitle} · AI Daily`;
  const description = isZh ? issue.zhSummary : issue.enSummary;
  const cover = issue.coverStory;
  const grouped = issue.topics.reduce((acc, topic) => {
    acc[topic.section] ??= [];
    acc[topic.section].push(topic);
    return acc;
  }, {});
  const sectionOrder = ["official", "wild", "research", "patent", "china", "global"];
  const navSections = sectionOrder.filter((section) => grouped[section]?.length);

  let pageNumber = 2;
  const sections = navSections
    .map((section) => {
      const spreads = grouped[section].map((topic) => topicSpread(issue, topic, locale, pageNumber++)).join("");
      return `
        <section class="desk-section" id="${section}">
          <div class="section-heading">
            <p>${html(sectionLabels[locale][section] ?? section)}</p>
            <h2>${html(sectionNames[locale][section] ?? section)}</h2>
          </div>
          <div class="spread-list">
            ${spreads}
          </div>
        </section>`;
    })
    .join("");

  const body = `
    <main class="issue-shell">
      <nav class="issue-nav" aria-label="Issue navigation">
        <a class="brand" href="${siteBase}/">AI Daily</a>
        <div>
          <a class="${isZh ? "active" : ""}" href="${siteBase}/${issue.date}/zh/">中文</a>
          <a class="${isZh ? "" : "active"}" href="${siteBase}/${issue.date}/en/">English</a>
          <a href="${siteBase}/${issue.date}/sources.md">${isZh ? "来源总表" : "Source ledger"}</a>
        </div>
      </nav>

      <header class="issue-hero magazine-cover">
        <div class="spread-number">01</div>
        <div class="issue-hero-copy">
          <p class="eyebrow">${html(issue.date)} · ${html(issue.timezone)}</p>
          <h1>${html(isZh ? issue.zhTitle : issue.enTitle)}</h1>
          <div class="hero-lines">
            ${(isZh ? cover.zhSummary : cover.enSummary).map((line) => `<p>${html(line)}</p>`).join("")}
          </div>
          <div class="chip-row">${chips(issue.tags)}</div>
          ${sourceLinks([{ label: isZh ? "封面原文" : "Cover source", url: cover.primarySourceUrl }], locale)}
        </div>
        <figure class="issue-cover-image">
          <img ${attrs({
            src: relAssetUrl(cover.imagePath),
            alt: isZh ? cover.zhTitle : cover.enTitle,
            width: cover.imageWidth,
            height: cover.imageHeight,
            decoding: "async"
          })} />
          <figcaption>${html(cover.evidenceStrength)} · ${html(cover.whyCover)}</figcaption>
        </figure>
      </header>

      <section class="section-jump" aria-label="Sections">
        ${navSections.map((section) => `<a href="#${section}">${html(sectionLabels[locale][section] ?? section)}</a>`).join("")}
      </section>

      ${sections}

      <section class="watchlist">
        <div class="section-heading">
          <p>${isZh ? "Next scan" : "Next scan"}</p>
          <h2>${isZh ? "Watchlist" : "Watchlist"}</h2>
        </div>
        <ul>
          ${(isZh ? issue.watchlistZh : issue.watchlistEn).map((item) => `<li>${html(item)}</li>`).join("")}
        </ul>
      </section>
    </main>`;

  return layout({ locale, title, description, body, rootPrefix });
}

function deckSlideId(pageNumber) {
  return `slide-${String(pageNumber).padStart(2, "0")}`;
}

function deckSlideTopline(pageNumber, label) {
  return `
    <div class="slide-chrome">
      <span>${String(pageNumber).padStart(2, "0")}</span>
      <span>${html(label)}</span>
    </div>`;
}

function deckCoverSlide(issue, locale, pageNumber) {
  const isZh = locale === "zh";
  const cover = issue.coverStory;
  return `
    <section class="deck-slide cover-slide is-active" id="${deckSlideId(pageNumber)}" data-slide>
      ${deckSlideTopline(pageNumber, `${issue.date} · ${issue.timezone}`)}
      <div class="cover-copy">
        <p class="eyebrow">AI Daily</p>
        <h1>${html(isZh ? issue.zhTitle : issue.enTitle)}</h1>
        <div class="hero-lines">
          ${(isZh ? cover.zhSummary : cover.enSummary).map((line) => `<p>${html(line)}</p>`).join("")}
        </div>
        <div class="chip-row">${chips(issue.tags)}</div>
        ${sourceLinks([{ label: isZh ? "封面原文" : "Cover source", url: cover.primarySourceUrl }], locale)}
      </div>
      <figure class="cover-visual">
        <img ${attrs({
          src: relAssetUrl(cover.imagePath),
          alt: isZh ? cover.zhTitle : cover.enTitle,
          width: cover.imageWidth,
          height: cover.imageHeight,
          decoding: "async"
        })} />
        <figcaption>${html(cover.evidenceStrength)} · ${html(cover.whyCover)}</figcaption>
      </figure>
    </section>`;
}

function deckAgendaSlide(issue, locale, pageNumber, navSections) {
  const isZh = locale === "zh";
  let offset = 3;
  const cards = navSections
    .map((section) => {
      const sectionTopics = issue.topics.filter((topic) => topic.section === section);
      const targetSlide = deckSlideId(offset);
      offset += 1 + sectionTopics.length * 2;
      return `
        <a class="agenda-card" href="#${targetSlide}" data-go-slide="${targetSlide}">
          <span>${html(sectionLabels[locale][section] ?? section)}</span>
          <strong>${html(sectionNames[locale][section] ?? section)}</strong>
          <em>${sectionTopics.length} ${isZh ? "条" : "item(s)"}</em>
        </a>`;
    })
    .join("");

  return `
    <section class="deck-slide agenda-slide" id="${deckSlideId(pageNumber)}" data-slide>
      ${deckSlideTopline(pageNumber, isZh ? "今日导航" : "Issue map")}
      <div class="agenda-copy">
        <p class="eyebrow">${isZh ? "先看结构，再看证据" : "Structure before evidence"}</p>
        <h2>${isZh ? "今天按四条线读：大厂入口、野生阻力、研究/专利、中国与海外对照。" : "Read today through four lanes: platform entry points, wild friction, research/patents, and China/global comparison."}</h2>
      </div>
      <div class="agenda-grid">${cards}</div>
    </section>`;
}

function deckSectionSlide(section, locale, pageNumber, topics) {
  const isZh = locale === "zh";
  return `
    <section class="deck-slide section-slide" id="${deckSlideId(pageNumber)}" data-slide data-section="${html(section)}">
      ${deckSlideTopline(pageNumber, sectionLabels[locale][section] ?? section)}
      <p class="eyebrow">${html(sectionLabels[locale][section] ?? section)}</p>
      <h2>${html(sectionNames[locale][section] ?? section)}</h2>
      <div class="section-topic-list">
        ${topics
          .map(
            (topic) => `
              <div>
                <span>${html(topic.evidenceStrength)}</span>
                <strong>${html(isZh ? topic.zhHeadline : topic.enHeadline)}</strong>
              </div>`
          )
          .join("")}
      </div>
    </section>`;
}

function deckTopicEvidenceSlide(issue, topic, locale, pageNumber) {
  const isZh = locale === "zh";
  const headline = isZh ? topic.zhHeadline : topic.enHeadline;
  const fact = isZh ? topic.zhFact : topic.enFact;
  const value = isZh ? topic.zhValue : topic.enValue;
  const implication = isZh ? topic.zhImplication : topic.enImplication;
  const lens = isZh ? topic.zhHciLens : topic.enHciLens;

  return `
    <section class="deck-slide evidence-slide" id="${deckSlideId(pageNumber)}" data-slide data-section="${html(topic.section)}">
      ${deckSlideTopline(pageNumber, sectionNames[locale][topic.section] ?? topic.section)}
      <div class="slide-grid">
        <div class="slide-copy">
          <div class="topic-topline">
            <span class="section-chip">${html(sectionLabels[locale][topic.section] ?? topic.section)}</span>
            <span>${html(topic.evidenceStrength)}</span>
            <span>${html(topic.sourceDate)}</span>
          </div>
          <h2>${html(headline)}</h2>
          <p class="lead"><strong>${isZh ? "事实：" : "Fact:"}</strong> ${html(fact)}</p>
          <p><strong>${isZh ? "为什么重要：" : "Why it matters:"}</strong> ${html(value)}</p>
          <div class="lens-grid">
            ${lens.map((item) => `<span>${html(item)}</span>`).join("")}
          </div>
          <p><strong>${isZh ? "产品影响：" : "Product implication:"}</strong> ${html(implication)}</p>
          ${sourceLinks(topic.sources, locale)}
        </div>
        <div class="slide-visual">
          ${figure(issue, topic.visual, locale, false)}
        </div>
      </div>
    </section>`;
}

function deckTopicAnalysisSlide(topic, locale, pageNumber) {
  const isZh = locale === "zh";
  const narrative = topicNarrative(topic, locale);
  const headline = isZh ? topic.zhHeadline : topic.enHeadline;
  const lens = isZh ? topic.zhHciLens : topic.enHciLens;

  return `
    <section class="deck-slide analysis-slide" id="${deckSlideId(pageNumber)}" data-slide data-section="${html(topic.section)}">
      ${deckSlideTopline(pageNumber, isZh ? "深读" : "Deep read")}
      <div class="analysis-main">
        <div>
          <p class="eyebrow">${html(sectionLabels[locale][topic.section] ?? topic.section)} · ${html(topic.id)}</p>
          <h2>${html(headline)}</h2>
          <div class="analysis-columns">
            ${narrative.analysis.map((paragraph) => `<p>${html(paragraph)}</p>`).join("")}
          </div>
          ${sourceLinks(topic.sources, locale)}
        </div>
        <aside class="analysis-rail">
          <h3>${isZh ? "HCI Lens" : "HCI Lens"}</h3>
          <div class="lens-grid">
            ${lens.map((item) => `<span>${html(item)}</span>`).join("")}
          </div>
          <h3>${isZh ? "Readout" : "Readout"}</h3>
          <ul>${narrative.readout.map((item) => `<li>${html(item)}</li>`).join("")}</ul>
          <h3>${isZh ? "Open Questions" : "Open Questions"}</h3>
          <ul>${narrative.questions.map((item) => `<li>${html(item)}</li>`).join("")}</ul>
        </aside>
      </div>
    </section>`;
}

function deckWatchlistSlide(issue, locale, pageNumber) {
  const isZh = locale === "zh";
  const items = isZh ? issue.watchlistZh : issue.watchlistEn;
  return `
    <section class="deck-slide watch-slide" id="${deckSlideId(pageNumber)}" data-slide>
      ${deckSlideTopline(pageNumber, isZh ? "Watchlist" : "Watchlist")}
      <p class="eyebrow">${isZh ? "下一轮扫描" : "Next scan"}</p>
      <h2>${isZh ? "明天继续盯这些入口变化" : "What to watch next"}</h2>
      <div class="watch-grid">
        ${items.map((item, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><p>${html(item)}</p></div>`).join("")}
      </div>
    </section>`;
}

function deckSourcesSlide(issue, locale, pageNumber) {
  const isZh = locale === "zh";
  const seen = new Set();
  const sources = issue.topics.flatMap((topic) => topic.sources).filter((source) => {
    if (seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });

  return `
    <section class="deck-slide source-slide" id="${deckSlideId(pageNumber)}" data-slide>
      ${deckSlideTopline(pageNumber, isZh ? "来源索引" : "Source index")}
      <p class="eyebrow">${isZh ? "可追溯证据" : "Traceable evidence"}</p>
      <h2>${isZh ? "正文每个话题都有来源；这里是快速跳转。" : "Every topic has inline sources; this is the quick ledger."}</h2>
      <div class="source-grid">
        ${sources
          .map((source) => `<a href="${html(source.url)}" target="_blank" rel="noreferrer"><span>${html(source.type ?? "source")}</span><strong>${html(source.label)}</strong></a>`)
          .join("")}
      </div>
      <p class="source-row"><strong>${isZh ? "完整总表：" : "Full ledger:"}</strong> <a href="${siteBase}/${issue.date}/sources.md">sources.md</a></p>
    </section>`;
}

function deckIssuePage(issue, locale) {
  const isZh = locale === "zh";
  const rootPrefix = "../../";
  const title = isZh ? `${issue.zhTitle} · AI Daily` : `${issue.enTitle} · AI Daily`;
  const description = isZh ? issue.zhSummary : issue.enSummary;
  const grouped = issue.topics.reduce((acc, topic) => {
    acc[topic.section] ??= [];
    acc[topic.section].push(topic);
    return acc;
  }, {});
  const sectionOrder = ["official", "wild", "research", "patent", "china", "global"];
  const navSections = sectionOrder.filter((section) => grouped[section]?.length);
  const pdfName = `ai-daily-${issue.date}-${locale}.pdf`;
  const slideParts = [];
  let pageNumber = 1;

  slideParts.push(deckCoverSlide(issue, locale, pageNumber++));
  slideParts.push(deckAgendaSlide(issue, locale, pageNumber++, navSections));
  for (const section of navSections) {
    slideParts.push(deckSectionSlide(section, locale, pageNumber++, grouped[section]));
    for (const topic of grouped[section]) {
      slideParts.push(deckTopicEvidenceSlide(issue, topic, locale, pageNumber++));
      slideParts.push(deckTopicAnalysisSlide(topic, locale, pageNumber++));
    }
  }
  slideParts.push(deckWatchlistSlide(issue, locale, pageNumber++));
  slideParts.push(deckSourcesSlide(issue, locale, pageNumber++));

  const body = `
    <main class="deck-page">
      <nav class="deck-nav" aria-label="Issue navigation">
        <a class="brand" href="${siteBase}/">AI Daily</a>
        <div class="deck-nav-actions">
          <a class="${isZh ? "active" : ""}" href="${siteBase}/${issue.date}/zh/">中文</a>
          <a class="${isZh ? "" : "active"}" href="${siteBase}/${issue.date}/en/">English</a>
          <a href="${siteBase}/${issue.date}/sources.md">${isZh ? "来源总表" : "Source ledger"}</a>
          <a class="primary" href="../${pdfName}" download>${isZh ? "下载 PDF" : "Download PDF"}</a>
        </div>
      </nav>

      <section class="deck-stage" data-deck aria-label="${html(title)}">
        ${slideParts.join("")}
      </section>

      <footer class="deck-controls" aria-label="Slide controls">
        <button type="button" data-prev-slide>${isZh ? "上一页" : "Previous"}</button>
        <div class="deck-progress-shell"><span data-deck-progress></span></div>
        <span class="deck-counter" data-deck-counter>01 / ${String(slideParts.length).padStart(2, "0")}</span>
        <button type="button" data-next-slide>${isZh ? "下一页" : "Next"}</button>
      </footer>
      <div class="deck-dots" data-deck-dots aria-hidden="true"></div>
    </main>`;

  return layout({ locale, title, description, body, rootPrefix });
}

function rootManifest() {
  return JSON.stringify(
    issues.map((issue) => ({
      date: issue.date,
      zhTitle: issue.zhTitle,
      enTitle: issue.enTitle,
      zhSummary: issue.zhSummary,
      enSummary: issue.enSummary,
      tags: issue.tags,
      sourceTypes: issue.sourceTypes,
      coverStory: issue.coverStory,
      zhPath: issue.zhPath,
      enPath: issue.enPath,
      sourcesPath: issue.sourcesPath
    })),
    null,
    2
  );
}

function issueManifest(issue) {
  return JSON.stringify(
    {
      date: issue.date,
      timezone: issue.timezone,
      zhTitle: issue.zhTitle,
      enTitle: issue.enTitle,
      zhSummary: issue.zhSummary,
      enSummary: issue.enSummary,
      tags: issue.tags,
      sourceTypes: issue.sourceTypes,
      coverStory: issue.coverStory,
      topics: issue.topics.map((topic) => ({
        id: topic.id,
        section: topic.section,
        zhHeadline: topic.zhHeadline,
        enHeadline: topic.enHeadline,
        visual: topic.visual,
        sources: topic.sources,
        evidenceStrength: topic.evidenceStrength
      })),
      zhPath: "./zh/",
      enPath: "./en/",
      sourcesPath: "./sources.md"
    },
    null,
    2
  );
}

function sourcesMarkdown(issue) {
  const sourceRows = [];
  const seenSources = new Set();
  for (const topic of issue.topics) {
    for (const source of topic.sources) {
      const key = source.url;
      if (seenSources.has(key)) continue;
      seenSources.add(key);
      sourceRows.push({ source, usedFor: topic.id, evidence: topic.evidenceStrength, date: topic.sourceDate });
    }
  }

  const visualRows = issue.topics.map((topic) => ({
    asset: topic.visual.captionEn,
    local: topic.visual.path,
    source: topic.visual.sourceUrl,
    role: `${topic.id} / ${topic.evidenceStrength}`
  }));

  return `# AI Daily Sources

Date: ${issue.date}
Timezone: ${issue.timezone}
Scope: HCI, AI hardware, AI software products, agentic devices, on-device AI, AI OS/shells, smart glasses, AI PCs, robotics, cameras/sensing peripherals, wearables, soft/hardware systems, community/startup signals, research papers, and patent watch.

## Source Index

| ID | Source | Date | Evidence strength | Used for |
| --- | --- | --- | --- | --- |
${sourceRows
  .map(
    (row, index) =>
      `| S${index + 1} | ${row.source.label}: ${row.source.url} | ${row.date} | ${row.evidence}; ${row.source.type ?? ""} | ${row.usedFor} |`
  )
  .join("\n")}

## Visual Asset Index

| Asset | Local path | Source | Evidence role |
| --- | --- | --- | --- |
| ${issue.coverStory.enTitle} | \`${issue.coverStory.imagePath}\` | ${issue.coverStory.imageSourceUrl} | Homepage and issue cover visual |
${visualRows.map((row) => `| ${row.asset} | \`${row.local}\` | ${row.source} | ${row.role} |`).join("\n")}

## Evidence Rules

- Official facts are linked to company announcements, product pages, developer docs, or company blogs.
- Product Hunt, Kickstarter, Reddit, startup, and review signals are labeled as weak, community, startup, or crowdfunding signals unless corroborated.
- Research claims link to arXiv, conference pages, Microsoft Research, ACM-style publication pages, or PDFs.
- Patent material is treated as a patent signal only, not a confirmed product launch, availability, or roadmap.
- Every topic deck slide in the published Chinese and English issue pages includes inline source links; this file is the audit ledger, not the only source surface.
- Evidence visuals use source-traceable product images, source-based screenshots, or clearly labeled self-drawn mechanism diagrams. No generic stock or decorative images are used.
- Public HTML/CSS must not use cropped image-fit rules for evidence visuals.
`;
}

function siteCss() {
  return `:root {
  --red: #c7000b;
  --ink: #171413;
  --muted: #6f6a66;
  --soft: #f6f4ef;
  --paper: #fffdfa;
  --line: #e8e3dc;
  --chip: #f2efea;
  --shadow: 0 22px 60px rgba(35, 25, 16, 0.08);
  --radius: 28px;
  color-scheme: light;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background:
    radial-gradient(circle at 12% -10%, #fff3d5 0, transparent 34rem),
    linear-gradient(145deg, #fff7df 0%, #fff 34%, #f4f7fb 100%);
  color: var(--ink);
  font-family: "Aptos", "IBM Plex Sans", "Microsoft YaHei", "Source Han Sans SC", sans-serif;
}

a { color: inherit; text-decoration: none; }
a:hover { color: var(--red); }

button {
  border: 0;
  font: inherit;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center;
}

.app-shell {
  width: min(1780px, calc(100% - 40px));
  margin: 58px auto;
  display: grid;
  grid-template-columns: 90px 1fr;
  min-height: calc(100vh - 116px);
  background: rgba(255, 253, 250, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.86);
  border-radius: 34px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.archive-shell {
  grid-template-columns: 1fr;
  width: min(1660px, calc(100% - 40px));
}

.archive-shell .rail {
  display: none;
}

.rail {
  border-right: 1px solid var(--line);
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  background: linear-gradient(#fffefa, #fbfaf7);
}

.mark {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: #2f2234;
  color: #fff;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.rail-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  color: #8d8781;
  border: 1px solid transparent;
}

.rail-icon.active {
  background: #f2e8f0;
  color: var(--red);
  border-color: #eadce7;
}

.workspace {
  padding: 30px;
  min-width: 0;
}

.archive-shell .workspace {
  padding: clamp(24px, 3vw, 44px);
}

.topbar,
.issue-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.search-pill {
  width: min(390px, 100%);
  border-radius: 999px;
  background: #f4f2ef;
  color: var(--muted);
  padding: 15px 22px;
  font-size: 15px;
}

.nav-links,
.lang-switch,
.issue-nav div,
.hero-actions,
.issue-actions,
.section-jump {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.nav-links a,
.lang-switch a,
.issue-nav a,
.hero-actions a,
.issue-actions a,
.section-jump a {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 10px 15px;
  background: #fff;
  color: var(--ink);
  font-size: 14px;
  font-weight: 760;
}

.lang-switch a.active,
.issue-nav a.active,
.hero-actions a.primary,
.issue-actions a.primary {
  background: #2f2234;
  border-color: #2f2234;
  color: #fff;
}

.archive-head {
  padding: clamp(24px, 4vw, 54px) 0 26px;
  max-width: 1120px;
}

.archive-head h1 {
  font-size: clamp(42px, 6vw, 86px);
  line-height: 0.96;
  letter-spacing: -0.07em;
  margin-bottom: 16px;
}

.archive-head p:last-child {
  color: #4d4843;
  font-size: clamp(16px, 1.4vw, 22px);
  line-height: 1.55;
  max-width: 780px;
}

.eyebrow,
.issue-kicker,
.section-heading p {
  color: var(--red);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 0 12px;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  max-width: 930px;
  font-size: clamp(44px, 7vw, 108px);
  line-height: 0.98;
  letter-spacing: -0.07em;
  margin-bottom: 26px;
}

.hero-lines {
  display: grid;
  gap: 10px;
  color: #312c28;
  font-size: clamp(17px, 1.6vw, 24px);
  line-height: 1.45;
  font-weight: 680;
  max-width: 900px;
}

.hero-media,
.issue-cover-image,
.evidence-figure,
.issue-thumb {
  margin: 0;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
}

.hero-media {
  padding: 18px;
}

.hero-media img,
.issue-cover-image img,
.evidence-figure img,
.issue-thumb img {
  width: 100%;
  height: auto;
  background: #fff;
}

figcaption {
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 12px;
  line-height: 1.35;
  padding: 12px 14px;
  background: #fffdfa;
}

.hero-actions {
  margin-top: 28px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0 0 24px;
  padding: 14px;
  background: #f5f3f0;
  border: 1px solid var(--line);
  border-radius: 24px;
}

.filter-bar button {
  border-radius: 999px;
  padding: 11px 17px;
  background: transparent;
  color: #5d5751;
  cursor: pointer;
}

.filter-bar button.active {
  background: #fff;
  color: var(--ink);
  box-shadow: 0 8px 20px rgba(20, 16, 12, 0.06);
}

.issue-list,
.topic-list {
  display: grid;
  gap: 22px;
}

.issue-card {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr) auto;
  gap: 28px;
  align-items: stretch;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
}

.issue-thumb {
  border-radius: 18px;
  display: grid;
  place-items: center;
}

.issue-main {
  padding: 14px 0;
}

.issue-main h2 {
  font-size: clamp(26px, 2.4vw, 42px);
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin-bottom: 12px;
}

.issue-main p {
  color: #4d4843;
  font-size: 16px;
  line-height: 1.58;
  max-width: 860px;
}

.chip-row,
.lens-grid,
.topic-topline {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-row span,
.lens-grid span,
.topic-topline span,
.section-chip {
  background: var(--chip);
  border: 1px solid var(--line);
  border-radius: 10px;
  color: #4b4540;
  font-size: 12px;
  font-weight: 780;
  padding: 7px 9px;
}

.section-chip {
  background: #fff0ef;
  color: var(--red);
  border-color: #ffd7d4;
}

.mini-source,
.source-row {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.45;
  margin: 14px 0 0;
}

.mini-source a,
.source-row a {
  color: var(--red);
  font-weight: 820;
}

.issue-actions {
  align-content: center;
  justify-content: flex-end;
  min-width: 132px;
}

.issue-actions a {
  width: 100%;
  justify-content: center;
  display: inline-flex;
}

.issue-shell {
  width: min(1580px, calc(100% - 40px));
  margin: 42px auto 70px;
  background: rgba(255, 253, 250, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 34px;
  box-shadow: var(--shadow);
  padding: clamp(22px, 4vw, 46px);
  scroll-snap-type: y proximity;
}

.issue-nav .brand {
  font-size: 22px;
  font-weight: 950;
  color: var(--red);
  border: 0;
  background: transparent;
  padding-left: 0;
}

.issue-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.72fr);
  gap: clamp(24px, 5vw, 70px);
  align-items: center;
  padding: clamp(34px, 5vw, 78px) 0 34px;
}

.magazine-cover {
  position: relative;
  min-height: min(820px, calc(100vh - 120px));
  border-bottom: 1px solid var(--line);
  scroll-snap-align: start;
}

.issue-hero h1 {
  font-size: clamp(40px, 6.5vw, 92px);
}

.issue-cover-image {
  padding: 16px;
}

.section-jump {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 18px 0;
  margin-bottom: 42px;
}

.desk-section {
  margin-top: 54px;
}

.section-heading h2 {
  font-size: clamp(28px, 3.4vw, 54px);
  letter-spacing: -0.05em;
  line-height: 1;
  margin-bottom: 20px;
}

.topic-card {
  display: grid;
  grid-template-columns: minmax(260px, 390px) minmax(0, 1fr);
  gap: 26px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: #fff;
  padding: 16px;
}

.spread-list {
  display: grid;
  gap: 34px;
}

.legacy-spread {
  position: relative;
  display: grid;
  grid-template-columns: minmax(300px, 0.72fr) minmax(0, 1.1fr) minmax(260px, 0.52fr);
  gap: clamp(22px, 3vw, 42px);
  align-items: start;
  min-height: min(860px, calc(100vh - 92px));
  border: 1px solid var(--line);
  border-radius: 30px;
  background:
    linear-gradient(90deg, rgba(199, 0, 11, 0.04), transparent 22%),
    #fff;
  padding: clamp(20px, 3vw, 38px);
  scroll-snap-align: start;
}

.spread-number {
  position: absolute;
  top: 22px;
  right: 24px;
  color: rgba(199, 0, 11, 0.16);
  font-size: clamp(50px, 8vw, 116px);
  font-weight: 950;
  line-height: 0.8;
  letter-spacing: -0.08em;
  pointer-events: none;
}

.spread-visual {
  position: sticky;
  top: 24px;
}

.legacy-spread .evidence-figure {
  border-radius: 24px;
}

.spread-copy {
  min-width: 0;
}

.spread-copy h3 {
  font-size: clamp(32px, 4vw, 66px);
  line-height: 0.98;
  letter-spacing: -0.065em;
  margin: 14px 0 22px;
  max-width: 860px;
}

.deck-copy {
  column-count: 2;
  column-gap: 30px;
}

.deck-copy p {
  break-inside: avoid;
  color: #332e2a;
  font-size: 16px;
  line-height: 1.72;
  margin-bottom: 14px;
}

.spread-sidebar {
  border-left: 1px solid var(--line);
  padding-left: 22px;
  color: #433d38;
}

.spread-sidebar h4 {
  color: var(--red);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin: 0 0 12px;
}

.spread-sidebar ul {
  margin: 0 0 22px;
  padding-left: 18px;
  line-height: 1.55;
  font-size: 14px;
}

.spread-sidebar li {
  margin-bottom: 8px;
}

.topic-main {
  padding: 10px 8px 8px 0;
}

.topic-main h3 {
  font-size: clamp(24px, 2.2vw, 36px);
  letter-spacing: -0.035em;
  line-height: 1.08;
  margin: 12px 0 14px;
}

.topic-main p {
  color: #3c3732;
  font-size: 15px;
  line-height: 1.62;
  margin-bottom: 10px;
}

.lens-grid {
  margin: 14px 0;
}

.watchlist {
  margin-top: 58px;
  border: 1px solid var(--line);
  border-radius: 26px;
  background: #fff;
  padding: 28px;
}

.watchlist ul {
  margin: 0;
  padding-left: 20px;
  color: #3c3732;
  line-height: 1.7;
}

html:has(.deck-page),
body:has(.deck-page) {
  height: 100%;
  overflow: hidden;
}

body:has(.deck-page) {
  background:
    radial-gradient(circle at 8% -8%, #fff0c8 0, transparent 30rem),
    linear-gradient(145deg, #fff8e2 0%, #f8f5ef 48%, #eef3f8 100%);
}

.deck-page {
  width: min(1720px, calc(100vw - 32px));
  height: 100vh;
  margin: 0 auto;
  padding: 16px 0 78px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 14px;
}

.deck-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 0 4px;
}

.deck-nav .brand {
  color: var(--red);
  font-size: 22px;
  font-weight: 950;
  letter-spacing: -0.05em;
}

.deck-nav-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.deck-nav-actions a,
.deck-controls button {
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: var(--ink);
  font-size: 13px;
  font-weight: 820;
  padding: 9px 14px;
  box-shadow: 0 10px 28px rgba(38, 25, 13, 0.06);
}

.deck-nav-actions a.active,
.deck-nav-actions a.primary {
  background: #2f2234;
  border-color: #2f2234;
  color: #fff;
}

.deck-stage {
  position: relative;
  align-self: center;
  justify-self: center;
  width: min(100%, calc((100vh - 152px) * 16 / 9));
  max-height: calc(100vh - 152px);
  aspect-ratio: 16 / 9;
  min-height: 0;
}

.deck-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transform: translateX(22px) scale(0.985);
  transition: opacity 180ms ease, transform 220ms ease;
  overflow: hidden;
  border: 1px solid rgba(232, 227, 220, 0.95);
  border-radius: 30px;
  background:
    linear-gradient(90deg, rgba(199, 0, 11, 0.045), transparent 23%),
    #fffdfa;
  box-shadow: 0 28px 70px rgba(35, 25, 16, 0.12);
  padding: clamp(26px, 3vw, 54px);
}

.deck-slide.is-active {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0) scale(1);
}

.slide-chrome {
  position: absolute;
  top: 22px;
  left: clamp(26px, 3vw, 54px);
  right: clamp(26px, 3vw, 54px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(111, 106, 102, 0.82);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.cover-slide {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.85fr);
  gap: clamp(24px, 4vw, 64px);
  align-items: center;
}

.cover-copy h1 {
  font-size: clamp(46px, 5.6vw, 88px);
  max-width: 1040px;
}

.cover-visual,
.slide-visual .evidence-figure {
  min-height: 0;
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: 26px;
  background: #fff;
  overflow: hidden;
}

.cover-visual img,
.slide-visual .evidence-figure img {
  flex: 1 1 auto;
  width: 100%;
  min-height: 0;
  height: 100%;
  object-fit: contain;
  object-position: center;
  background: #fff;
  padding: 12px;
}

.cover-visual figcaption,
.slide-visual .evidence-figure figcaption {
  flex: 0 0 auto;
}

.agenda-slide,
.section-slide,
.watch-slide,
.source-slide {
  display: grid;
  align-content: center;
  gap: 28px;
}

.agenda-copy h2,
.section-slide h2,
.watch-slide h2,
.source-slide h2 {
  font-size: clamp(42px, 5.2vw, 86px);
  line-height: 0.98;
  letter-spacing: -0.065em;
  max-width: 1180px;
  margin-bottom: 0;
}

.agenda-grid,
.section-topic-list,
.watch-grid,
.source-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.agenda-card,
.section-topic-list div,
.watch-grid div,
.source-grid a {
  min-height: 132px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.86);
  padding: 20px;
  display: grid;
  align-content: space-between;
  gap: 14px;
}

.agenda-card span,
.section-topic-list span,
.watch-grid span,
.source-grid span {
  color: var(--red);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.agenda-card strong,
.section-topic-list strong,
.source-grid strong {
  font-size: 22px;
  line-height: 1.12;
  letter-spacing: -0.035em;
}

.agenda-card em {
  color: var(--muted);
  font-style: normal;
  font-weight: 780;
}

.slide-grid {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.78fr);
  gap: clamp(24px, 4vw, 58px);
  align-items: center;
}

.slide-copy {
  min-width: 0;
}

.slide-copy h2,
.analysis-main h2 {
  font-size: clamp(34px, 4.4vw, 72px);
  line-height: 0.98;
  letter-spacing: -0.065em;
  margin: 14px 0 22px;
  max-width: 980px;
}

.slide-copy p,
.analysis-columns p,
.watch-grid p {
  color: #332e2a;
  font-size: clamp(15px, 1.12vw, 19px);
  line-height: 1.62;
  margin-bottom: 12px;
}

.slide-copy .lead {
  font-size: clamp(18px, 1.5vw, 25px);
  line-height: 1.42;
  font-weight: 760;
}

.analysis-main {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.42fr);
  gap: clamp(24px, 3vw, 46px);
  align-items: center;
}

.analysis-columns {
  column-count: 2;
  column-gap: 30px;
  max-width: 980px;
}

.analysis-columns p {
  break-inside: avoid;
}

.analysis-rail {
  border-left: 1px solid var(--line);
  padding-left: 24px;
}

.analysis-rail h3 {
  color: var(--red);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin: 0 0 10px;
}

.analysis-rail ul {
  margin: 0 0 22px;
  padding-left: 18px;
  color: #413b36;
  font-size: 14px;
  line-height: 1.55;
}

.deck-controls {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  width: min(760px, calc(100vw - 36px));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 10;
}

.deck-controls button {
  cursor: pointer;
}

.deck-progress-shell {
  flex: 1 1 auto;
  height: 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  overflow: hidden;
}

.deck-progress-shell span {
  display: block;
  width: 0;
  height: 100%;
  background: var(--red);
  transition: width 180ms ease;
}

.deck-counter {
  min-width: 72px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
  text-align: center;
}

.deck-dots {
  position: fixed;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  display: grid;
  gap: 6px;
  z-index: 10;
}

.deck-dots button {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgba(47, 34, 52, 0.22);
}

.deck-dots button.active {
  height: 20px;
  background: var(--red);
}

[hidden] { display: none !important; }

@media (max-width: 1040px) {
  .app-shell {
    grid-template-columns: 1fr;
    margin: 20px auto;
    width: min(100% - 24px, 900px);
  }

  .rail {
    display: none;
  }

  .topbar,
  .issue-nav,
  .issue-card,
  .issue-hero,
  .topic-card,
  .legacy-spread {
    grid-template-columns: 1fr;
  }

  .topbar,
  .issue-nav {
    align-items: flex-start;
  }

  .issue-actions {
    justify-content: stretch;
  }

  .spread-visual {
    position: static;
  }

  .deck-copy {
    column-count: 1;
  }

  .spread-sidebar {
    border-left: 0;
    border-top: 1px solid var(--line);
    padding-left: 0;
    padding-top: 22px;
  }
}

@media (max-width: 720px) {
  .workspace,
  .issue-shell {
    padding: 18px;
  }

  .issue-shell {
    width: min(100% - 20px, 680px);
    margin-top: 16px;
  }

  h1 {
    font-size: clamp(38px, 13vw, 58px);
  }

  .issue-hero {
    padding-top: 28px;
  }

  .issue-card,
  .topic-card,
  .legacy-spread {
    padding: 12px;
    gap: 16px;
  }

  .magazine-cover,
  .legacy-spread {
    min-height: auto;
  }
}

@media (max-width: 980px) {
  html:has(.deck-page),
  body:has(.deck-page) {
    overflow: auto;
  }

  .deck-page {
    width: min(100% - 20px, 760px);
    height: auto;
    min-height: 100vh;
    padding-bottom: 92px;
  }

  .deck-stage {
    width: 100%;
    max-height: none;
    aspect-ratio: auto;
    min-height: 720px;
  }

  .deck-slide {
    min-height: 720px;
  }

  .cover-slide,
  .slide-grid,
  .analysis-main,
  .agenda-grid,
  .section-topic-list,
  .watch-grid,
  .source-grid {
    grid-template-columns: 1fr;
  }

  .analysis-columns {
    column-count: 1;
  }

  .analysis-rail {
    border-left: 0;
    border-top: 1px solid var(--line);
    padding-left: 0;
    padding-top: 18px;
  }

  .deck-dots {
    display: none;
  }
}

@media print {
  @page {
    size: 16in 9in;
    margin: 0;
  }

  html,
  body,
  html:has(.deck-page),
  body:has(.deck-page) {
    width: 16in;
    height: auto;
    overflow: visible;
    background: #fff;
  }

  .deck-nav,
  .deck-controls,
  .deck-dots {
    display: none !important;
  }

  .deck-page,
  .deck-stage {
    display: block;
    width: 16in;
    height: auto;
    max-height: none;
    aspect-ratio: auto;
    margin: 0;
    padding: 0;
  }

  .deck-slide {
    position: relative;
    inset: auto;
    display: block;
    width: 16in;
    height: 9in;
    opacity: 1 !important;
    pointer-events: auto;
    transform: none !important;
    transition: none;
    page-break-after: always;
    break-after: page;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .cover-slide,
  .slide-grid,
  .analysis-main {
    display: grid;
  }
}
`;
}

function svgDiagram(title, subtitle, columns) {
  const colWidth = 305;
  const startX = 96;
  const blocks = columns
    .map((column, index) => {
      const x = startX + index * 350;
      const items = column.items
        .map(
          (item, itemIndex) => `
            <rect x="${x + 22}" y="${300 + itemIndex * 78}" width="${colWidth - 44}" height="52" rx="16" fill="#fffdfa" stroke="#e5ddd4"/>
            <text x="${x + 44}" y="${333 + itemIndex * 78}" font-size="20" font-weight="700" fill="#3b332d">${html(item)}</text>`
        )
        .join("");
      return `
        <rect x="${x}" y="210" width="${colWidth}" height="410" rx="32" fill="#f7f3ed" stroke="#e3d9ce"/>
        <text x="${x + 24}" y="260" font-size="25" font-weight="900" fill="#c7000b">${html(column.title)}</text>
        ${items}`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760" role="img" aria-label="${html(title)}">
  <rect width="1200" height="760" fill="#fffdfa"/>
  <rect x="40" y="40" width="1120" height="680" rx="44" fill="#ffffff" stroke="#e8e3dc"/>
  <text x="82" y="118" font-family="Aptos, Arial, sans-serif" font-size="54" font-weight="950" letter-spacing="-2" fill="#171413">${html(title)}</text>
  <text x="86" y="160" font-family="Aptos, Arial, sans-serif" font-size="22" font-weight="700" fill="#6f6a66">${html(subtitle)}</text>
  ${blocks}
  <text x="84" y="682" font-family="Aptos, Arial, sans-serif" font-size="18" font-weight="700" fill="#8c837a">Source-based diagram · not a product render</text>
</svg>`;
}

function diagramAssets() {
  return {
    "diagram-solara-agent-shell.svg": svgDiagram("Agent-first device stack", "MDEP + Agent Shell + identity + just-in-time UI", [
      { title: "Device", items: ["MDEP base", "physical mic state", "sensor policy"] },
      { title: "Shell", items: ["Agent Shell", "temporary UI", "privacy indicator"] },
      { title: "Enterprise", items: ["Intune", "Entra ID", "audit trail"] }
    ]),
    "diagram-wild-signal-map.svg": svgDiagram("Wild wearable signals", "Startup, crowdfunding, and community evidence lanes", [
      { title: "Product Hunt", items: ["coding HUD", "gesture input", "reservation signal"] },
      { title: "Kickstarter", items: ["AR display", "tap-to-AI", "translation"] },
      { title: "Reddit", items: ["battery worry", "privacy worry", "AI slop worry"] }
    ]),
    "diagram-research-agency-ring.svg": svgDiagram("Agency moves off-screen", "Conversational AI + wearable ring research implications", [
      { title: "Input", items: ["low friction", "ring gesture", "voice tension"] },
      { title: "Control", items: ["process agency", "pause", "undo"] },
      { title: "Feedback", items: ["confidence gap", "status cue", "recovery"] }
    ]),
    "diagram-patent-watch.svg": svgDiagram("Patent signal handling", "Patents are direction signals, not launch facts", [
      { title: "Search", items: ["Google Patents", "CNIPA", "fresh filings"] },
      { title: "Classify", items: ["device form", "sensor stack", "interaction claim"] },
      { title: "Label", items: ["patent signal", "weak evidence", "no launch claim"] }
    ]),
    "diagram-china-global-compare.svg": svgDiagram("China / global compare", "Separate platform facts from wild market probes", [
      { title: "Global official", items: ["OS agents", "AI PC", "Android XR"] },
      { title: "China-linked", items: ["Rokid lane", "startup devices", "crowdfunding"] },
      { title: "Readout", items: ["evidence strength", "availability", "workflow impact"] }
    ])
  };
}

async function writeFile(filePath, contents) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents.replace(/[ \t]+$/gm, ""));
}

async function copyAssets(issue) {
  const outputDir = path.join(root, issue.date, "assets");
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  const sourceDir = path.resolve(root, "..", "Survey", "output", "slidev", `ai-product-morning-brief-${issue.date}`, "public", "assets");
  const officialAssets = [
    "apple-siri-onscreen.jpg",
    "google-xr-hero.webp",
    "googlebook-hero.png"
  ];
  for (const asset of officialAssets) {
    await fs.copyFile(path.join(sourceDir, asset), path.join(outputDir, asset));
  }
  for (const [filename, svg] of Object.entries(diagramAssets())) {
    await fs.writeFile(path.join(outputDir, filename), svg);
  }
}

await writeFile(path.join(root, "assets", "site.css"), siteCss());
await writeFile(path.join(root, "index.html"), homepage("zh"));
await writeFile(path.join(root, "en", "index.html"), homepage("en"));
await writeFile(path.join(root, "manifest.json"), `${rootManifest()}\n`);

for (const issue of issues) {
  await copyAssets(issue);
  await writeFile(path.join(root, issue.date, "zh", "index.html"), deckIssuePage(issue, "zh"));
  await writeFile(path.join(root, issue.date, "en", "index.html"), deckIssuePage(issue, "en"));
  await writeFile(path.join(root, issue.date, "manifest.json"), `${issueManifest(issue)}\n`);
  await writeFile(path.join(root, issue.date, "sources.md"), sourcesMarkdown(issue));
}

console.log(`Rendered ${issues.length} AI Daily issue(s).`);
