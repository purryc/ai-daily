import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readIssues } from "./lib/issue-data.mjs";
import { allIssueTopics, allTopicVisuals } from "./lib/topic-content.mjs";
import {
  assertCloudOutput,
  selectEvents,
  selectContextEvents,
  validateIssue,
  validateIllustratedIssue,
} from "./lib/issue-policy.mjs";

export async function generateIssue({ root, input }) {
  assertCloudOutput(root, root);
  const archive = await readIssues(root);
  if (!Array.isArray(input.candidates))
    throw new Error(
      "input candidates must be an array, including on no-news days",
    );
  const base = {
    ...input,
    editorialVersion: 2,
    topics: [],
    tags: input.tags ?? [],
    sourceTypes: [],
    watchlistZh: input.watchlistZh ?? [],
    watchlistEn: input.watchlistEn ?? [],
    laneScans: input.laneScans ?? [],
  };
  delete base.candidates;
  delete base.contextCandidates;
  // Validate date/cutoff before selecting or writing anything.
  validateIssue(base);
  const { topics, excluded } = selectEvents(input.candidates, archive, base);
  const context = selectContextEvents(
    input.contextCandidates ?? [],
    archive,
    base,
  );
  const issue = {
    ...base,
    topics,
    contextTopics: context.topics,
    excludedContext: context.excluded,
    excludedCandidates: excluded,
    sourceTypes: [
      ...new Set(
        topics.flatMap((topic) =>
          topic.sources.map((source) => source.type ?? topic.section),
        ),
      ),
    ],
  };
  issue.zhPath = `./${issue.date}/zh/`;
  issue.enPath = `./${issue.date}/en/`;
  issue.sourcesPath = `./${issue.date}/sources.md`;
  if (!topics.length) {
    issue.zhTitle = "今天没有可核实的新进展";
    issue.enTitle = "No verified new advances today";
    issue.zhSummary =
      "截至标注的编辑截止时间，没有通过来源日期和跨期去重检查的新产品进展。历史报道保留在归档中。";
    issue.enSummary =
      "No verified new product advances passed source-date and cross-issue checks by the stated editorial cutoff. Previous reports remain in the archive.";
  }
  const lead = topics[0];
  const leadVisual = lead?.visuals?.[0] ?? lead?.visual;
  issue.coverStory = lead
    ? {
        topicId: lead.id,
        zhTitle: lead.zhHeadline,
        enTitle: lead.enHeadline,
        zhSummary: [lead.brief.zh.what, lead.brief.zh.change],
        enSummary: [lead.brief.en.what, lead.brief.en.change],
        imagePath: leadVisual?.path ?? null,
        imageSourceUrl: leadVisual?.sourceUrl ?? null,
        primarySourceUrl: lead.eventSourceUrl ?? lead.sources[0].url,
        evidenceStrength: lead.evidenceStrength ?? lead.evidenceLabel,
      }
    : {
        zhTitle: issue.zhTitle,
        enTitle: issue.enTitle,
        zhSummary: [issue.zhSummary],
        enSummary: [issue.enSummary],
        imagePath: null,
      };
  validateIssue(issue, archive);
  if (issue.requireProductVisuals) validateIllustratedIssue(issue);
  for (const topic of allIssueTopics(issue))
    for (const visual of allTopicVisuals(topic)) {
      const asset = assertCloudOutput(
        path.join(root, issue.date, visual.path),
        root,
      );
      await fs.access(asset);
    }
  const output = assertCloudOutput(
    path.join(root, "data/editions", `${issue.date}.json`),
    root,
  );
  await fs.mkdir(path.dirname(output), { recursive: true });
  const temp = output + ".tmp";
  await fs.writeFile(temp, JSON.stringify(issue, null, 2) + "\n");
  await fs.rename(temp, output);
  return { issue, excluded, output };
}
export async function main(args = process.argv.slice(2)) {
  const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
  const inputArg = args.indexOf("--input");
  if (inputArg < 0 || !args[inputArg + 1])
    throw new Error(
      "Usage: node scripts/create-issue.mjs --input data/candidates/YYYY-MM-DD.json",
    );
  const inputPath = assertCloudOutput(
    path.resolve(root, args[inputArg + 1]),
    root,
  );
  const input = JSON.parse(await fs.readFile(inputPath, "utf8"));
  const result = await generateIssue({ root, input });
  console.log(
    JSON.stringify({
      date: result.issue.date,
      selected: result.issue.topics.length,
      excluded: result.excluded,
      edition: path.relative(root, result.output),
    }),
  );
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();
